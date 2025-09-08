package services

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type SpinWheelService struct {
	db             *gorm.DB
	loyaltyService *LoyaltyService
	creditService  *CreditService
}

func NewSpinWheelService(db *gorm.DB, loyaltyService *LoyaltyService, creditService *CreditService) *SpinWheelService {
	return &SpinWheelService{
		db:             db,
		loyaltyService: loyaltyService,
		creditService:  creditService,
	}
}

type SpinResult struct {
	SpinID      uint                  `json:"spin_id"`
	RewardType  string                `json:"reward_type"`
	RewardValue string                `json:"reward_value"`
	PointsSpent int                   `json:"points_spent"`
	Success     bool                  `json:"success"`
	Message     string                `json:"message"`
	UserBalance *LoyaltyPointsBalance `json:"user_balance"`
}

type SpinWheelInfo struct {
	AvailableRewards []models.SpinWheelConfig `json:"available_rewards"`
	MinPointsCost    int                      `json:"min_points_cost"`
	UserPoints       int                      `json:"user_points"`
	CanSpin          bool                     `json:"can_spin"`
	CooldownInfo     *CooldownInfo            `json:"cooldown_info,omitempty"`
}

type CooldownInfo struct {
	LastSpinAt    time.Time `json:"last_spin_at"`
	NextSpinAt    time.Time `json:"next_spin_at"`
	SecondsLeft   int       `json:"seconds_left"`
	CooldownHours int       `json:"cooldown_hours"`
}

func (s *SpinWheelService) GetSpinWheelInfo(ctx context.Context, userID uint) (*SpinWheelInfo, error) {
	// Get active rewards
	var rewards []models.SpinWheelConfig
	err := s.db.Where("is_active = ?", true).
		Order("points_cost ASC").
		Find(&rewards).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get rewards: %w", err)
	}

	// Get user points
	balance, err := s.loyaltyService.GetPointsBalance(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user balance: %w", err)
	}

	// Find minimum points cost
	minPointsCost := 100 // default
	if len(rewards) > 0 {
		minPointsCost = rewards[0].PointsCost
	}

	// Check cooldown
	canSpin := true
	var cooldownInfo *CooldownInfo

	lastSpin, err := s.getLastSpinTime(userID)
	if err == nil {
		cooldownDuration := 24 * time.Hour // 24 hours cooldown
		nextSpinTime := lastSpin.Add(cooldownDuration)

		if time.Now().Before(nextSpinTime) {
			canSpin = false
			secondsLeft := int(nextSpinTime.Sub(time.Now()).Seconds())
			cooldownInfo = &CooldownInfo{
				LastSpinAt:    lastSpin,
				NextSpinAt:    nextSpinTime,
				SecondsLeft:   secondsLeft,
				CooldownHours: 24,
			}
		}
	}

	// Check if user has enough points
	if balance.CurrentPoints < minPointsCost {
		canSpin = false
	}

	return &SpinWheelInfo{
		AvailableRewards: rewards,
		MinPointsCost:    minPointsCost,
		UserPoints:       balance.CurrentPoints,
		CanSpin:          canSpin,
		CooldownInfo:     cooldownInfo,
	}, nil
}

func (s *SpinWheelService) Spin(ctx context.Context, userID uint) (*SpinResult, error) {
	return s.performSpin(ctx, userID)
}

func (s *SpinWheelService) performSpin(ctx context.Context, userID uint) (*SpinResult, error) {
	var result *SpinResult

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// Check if user can spin
		info, err := s.GetSpinWheelInfo(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to get spin info: %w", err)
		}

		if !info.CanSpin {
			if info.CooldownInfo != nil {
				return fmt.Errorf("spin on cooldown. Try again in %d seconds", info.CooldownInfo.SecondsLeft)
			}
			return fmt.Errorf("insufficient points to spin")
		}

		// Get random reward
		selectedReward, err := s.selectRandomReward(info.AvailableRewards)
		if err != nil {
			return fmt.Errorf("failed to select reward: %w", err)
		}

		// Spend points
		err = s.loyaltyService.SpendPoints(ctx, userID, selectedReward.PointsCost,
			"spin_wheel", "Spin wheel participation")
		if err != nil {
			return fmt.Errorf("failed to spend points: %w", err)
		}

		// Create spin result record
		spinResult := models.SpinWheelResult{
			UserID:         userID,
			ConfigID:       selectedReward.ConfigID,
			RewardReceived: fmt.Sprintf("%s:%s", selectedReward.RewardType, selectedReward.RewardValue),
			PointsSpent:    selectedReward.PointsCost,
		}

		if err := tx.Create(&spinResult).Error; err != nil {
			return fmt.Errorf("failed to create spin result: %w", err)
		}

		// Award the reward
		err = s.awardSpinReward(ctx, userID, selectedReward)
		if err != nil {
			return fmt.Errorf("failed to award reward: %w", err)
		}

		// Get updated balance
		updatedBalance, err := s.loyaltyService.GetPointsBalance(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to get updated balance: %w", err)
		}

		result = &SpinResult{
			SpinID:      spinResult.SpinID,
			RewardType:  selectedReward.RewardType,
			RewardValue: selectedReward.RewardValue,
			PointsSpent: selectedReward.PointsCost,
			Success:     true,
			Message:     fmt.Sprintf("You won %s %s!", selectedReward.RewardValue, selectedReward.RewardType),
			UserBalance: updatedBalance,
		}

		return nil
	})

	if err != nil {
		return &SpinResult{
			Success: false,
			Message: err.Error(),
		}, err
	}

	return result, nil
}

func (s *SpinWheelService) selectRandomReward(rewards []models.SpinWheelConfig) (*models.SpinWheelConfig, error) {
	if len(rewards) == 0 {
		return nil, fmt.Errorf("no rewards available")
	}

	// Calculate total probability
	var totalProbability float64
	for _, reward := range rewards {
		totalProbability += reward.Probability
	}

	// Generate random number
	rand.Seed(time.Now().UnixNano())
	randomValue := rand.Float64() * totalProbability

	// Select reward based on probability
	var currentProbability float64
	for _, reward := range rewards {
		currentProbability += reward.Probability
		if randomValue <= currentProbability {
			return &reward, nil
		}
	}

	// Fallback to last reward
	return &rewards[len(rewards)-1], nil
}

func (s *SpinWheelService) awardSpinReward(ctx context.Context, userID uint, reward *models.SpinWheelConfig) error {
	switch reward.RewardType {
	case "credits":
		amount, err := strconv.ParseFloat(reward.RewardValue, 64)
		if err != nil {
			return fmt.Errorf("invalid credit amount: %w", err)
		}

		// Award credits directly (bypass payment system for rewards)
		err = s.creditService.userService.UpdateCreditBalance(
			ctx, userID, amount, "spin_wheel_reward",
			fmt.Sprintf("Spin wheel reward: %.2f credits", amount),
			nil, nil,
		)
		if err != nil {
			return fmt.Errorf("failed to award credits: %w", err)
		}

	case "points":
		points, err := strconv.Atoi(reward.RewardValue)
		if err != nil {
			return fmt.Errorf("invalid points amount: %w", err)
		}

		err = s.loyaltyService.AwardPoints(ctx, userID, points, "spin_wheel",
			fmt.Sprintf("Spin wheel bonus: %d points", points))
		if err != nil {
			return fmt.Errorf("failed to award points: %w", err)
		}

	case "items":
		// For items, we would need integration with the shop system
		// For now, just log the reward (implement later with item delivery)
		fmt.Printf("Item reward not implemented yet: %s for user %d\n", reward.RewardValue, userID)

	default:
		return fmt.Errorf("unknown reward type: %s", reward.RewardType)
	}

	return nil
}

func (s *SpinWheelService) getLastSpinTime(userID uint) (time.Time, error) {
	var lastSpin models.SpinWheelResult
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		First(&lastSpin).Error

	if err != nil {
		return time.Time{}, err
	}

	return lastSpin.CreatedAt, nil
}

func (s *SpinWheelService) GetSpinHistory(ctx context.Context, userID uint, limit, offset int) ([]models.SpinWheelResult, int64, error) {
	var results []models.SpinWheelResult
	var total int64

	// Get total count
	if err := s.db.Model(&models.SpinWheelResult{}).
		Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count spins: %w", err)
	}

	// Get results with pagination
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Preload("Config").
		Find(&results).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get spin history: %w", err)
	}

	return results, total, nil
}
