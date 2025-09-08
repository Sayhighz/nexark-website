package services

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type DailyRewardsService struct {
	db             *gorm.DB
	loyaltyService *LoyaltyService
	creditService  *CreditService
}

func NewDailyRewardsService(db *gorm.DB, loyaltyService *LoyaltyService, creditService *CreditService) *DailyRewardsService {
	return &DailyRewardsService{
		db:             db,
		loyaltyService: loyaltyService,
		creditService:  creditService,
	}
}

type DailyRewardInfo struct {
	CanClaim      bool                      `json:"can_claim"`
	CurrentStreak int                       `json:"current_streak"`
	NextReward    *DailyRewardConfig        `json:"next_reward"`
	LastClaimed   *time.Time                `json:"last_claimed,omitempty"`
	RewardHistory []models.DailyLoginReward `json:"reward_history"`
}

type DailyRewardConfig struct {
	Day         int    `json:"day"`
	RewardType  string `json:"reward_type"`
	RewardValue string `json:"reward_value"`
	Description string `json:"description"`
}

type ClaimResult struct {
	Success    bool               `json:"success"`
	Message    string             `json:"message"`
	Reward     *DailyRewardConfig `json:"reward,omitempty"`
	NewStreak  int                `json:"new_streak"`
	NextReward *DailyRewardConfig `json:"next_reward,omitempty"`
}

// Define reward schedule (7-day cycle)
var rewardSchedule = []DailyRewardConfig{
	{Day: 1, RewardType: "points", RewardValue: "10", Description: "10 Loyalty Points"},
	{Day: 2, RewardType: "credits", RewardValue: "5", Description: "5 Credits"},
	{Day: 3, RewardType: "points", RewardValue: "15", Description: "15 Loyalty Points"},
	{Day: 4, RewardType: "credits", RewardValue: "10", Description: "10 Credits"},
	{Day: 5, RewardType: "points", RewardValue: "25", Description: "25 Loyalty Points"},
	{Day: 6, RewardType: "credits", RewardValue: "15", Description: "15 Credits"},
	{Day: 7, RewardType: "credits", RewardValue: "25", Description: "25 Credits (Bonus!)"},
}

func (s *DailyRewardsService) GetDailyRewardInfo(ctx context.Context, userID uint) (*DailyRewardInfo, error) {
	// Get last claimed reward
	var lastReward models.DailyLoginReward
	err := s.db.Where("user_id = ?", userID).
		Order("claimed_at DESC").
		First(&lastReward).Error

	var currentStreak int
	var lastClaimed *time.Time
	canClaim := true

	if err == nil {
		// User has claimed before
		lastClaimed = &lastReward.ClaimedAt
		currentStreak = lastReward.DayStreak

		// Check if already claimed today
		today := time.Now().Truncate(24 * time.Hour)
		lastClaimedDay := lastReward.ClaimedAt.Truncate(24 * time.Hour)

		if lastClaimedDay.Equal(today) {
			canClaim = false
		} else if lastClaimedDay.Before(today.Add(-24 * time.Hour)) {
			// More than 1 day ago, reset streak
			currentStreak = 0
		}
	} else if err != gorm.ErrRecordNotFound {
		return nil, fmt.Errorf("failed to get last reward: %w", err)
	}

	// Get next reward
	nextDay := (currentStreak % 7) + 1
	nextReward := &rewardSchedule[nextDay-1]

	// Get recent reward history (last 7 days)
	var rewardHistory []models.DailyLoginReward
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	s.db.Where("user_id = ? AND claimed_at >= ?", userID, sevenDaysAgo).
		Order("claimed_at DESC").
		Find(&rewardHistory)

	return &DailyRewardInfo{
		CanClaim:      canClaim,
		CurrentStreak: currentStreak,
		NextReward:    nextReward,
		LastClaimed:   lastClaimed,
		RewardHistory: rewardHistory,
	}, nil
}

func (s *DailyRewardsService) ClaimDailyReward(ctx context.Context, userID uint) (*ClaimResult, error) {
	var result *ClaimResult

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// Check if user can claim
		info, err := s.GetDailyRewardInfo(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to get reward info: %w", err)
		}

		if !info.CanClaim {
			return fmt.Errorf("daily reward already claimed today")
		}

		// Calculate new streak
		newStreak := info.CurrentStreak + 1

		// Get reward for this day
		rewardDay := ((newStreak - 1) % 7) + 1
		reward := rewardSchedule[rewardDay-1]

		// Create reward record
		dailyReward := models.DailyLoginReward{
			UserID:      userID,
			DayStreak:   newStreak,
			RewardType:  reward.RewardType,
			RewardValue: &reward.RewardValue,
		}

		if err := tx.Create(&dailyReward).Error; err != nil {
			return fmt.Errorf("failed to create reward record: %w", err)
		}

		// Award the reward
		err = s.awardDailyReward(ctx, userID, &reward)
		if err != nil {
			return fmt.Errorf("failed to award reward: %w", err)
		}

		// Prepare next reward
		var nextReward *DailyRewardConfig
		if newStreak < 7 || newStreak%7 != 0 {
			nextDay := (newStreak % 7) + 1
			nextReward = &rewardSchedule[nextDay-1]
		} else {
			// Reset cycle
			nextReward = &rewardSchedule[0]
		}

		result = &ClaimResult{
			Success:    true,
			Message:    fmt.Sprintf("Daily reward claimed! You received %s", reward.Description),
			Reward:     &reward,
			NewStreak:  newStreak,
			NextReward: nextReward,
		}

		return nil
	})

	if err != nil {
		return &ClaimResult{
			Success: false,
			Message: err.Error(),
		}, err
	}

	return result, nil
}

func (s *DailyRewardsService) awardDailyReward(ctx context.Context, userID uint, reward *DailyRewardConfig) error {
	switch reward.RewardType {
	case "credits":
		amount, err := parseFloat(reward.RewardValue)
		if err != nil {
			return fmt.Errorf("invalid credit amount: %w", err)
		}

		err = s.creditService.userService.UpdateCreditBalance(
			ctx, userID, amount, "daily_reward",
			fmt.Sprintf("Daily login reward: %.2f credits", amount),
			nil, nil,
		)
		if err != nil {
			return fmt.Errorf("failed to award credits: %w", err)
		}

	case "points":
		points, err := parseInt(reward.RewardValue)
		if err != nil {
			return fmt.Errorf("invalid points amount: %w", err)
		}

		err = s.loyaltyService.AwardPoints(ctx, userID, points, "daily_reward",
			fmt.Sprintf("Daily login reward: %d points", points))
		if err != nil {
			return fmt.Errorf("failed to award points: %w", err)
		}

	default:
		return fmt.Errorf("unknown reward type: %s", reward.RewardType)
	}

	return nil
}

func (s *DailyRewardsService) GetRewardHistory(ctx context.Context, userID uint, limit, offset int) ([]models.DailyLoginReward, int64, error) {
	var rewards []models.DailyLoginReward
	var total int64

	// Get total count
	if err := s.db.Model(&models.DailyLoginReward{}).
		Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count rewards: %w", err)
	}

	// Get rewards with pagination
	err := s.db.Where("user_id = ?", userID).
		Order("claimed_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&rewards).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get reward history: %w", err)
	}

	return rewards, total, nil
}

// Helper functions
func parseFloat(s string) (float64, error) {
	return strconv.ParseFloat(s, 64)
}

func parseInt(s string) (int, error) {
	return strconv.Atoi(s)
}
