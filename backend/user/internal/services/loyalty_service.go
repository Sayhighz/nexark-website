package services

import (
	"context"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type LoyaltyService struct {
	db          *gorm.DB
	userService *UserService
}

func NewLoyaltyService(db *gorm.DB, userService *UserService) *LoyaltyService {
	return &LoyaltyService{
		db:          db,
		userService: userService,
	}
}

type LoyaltyPointsBalance struct {
	UserID          uint      `json:"user_id"`
	CurrentPoints   int       `json:"current_points"`
	LifetimeEarned  int       `json:"lifetime_earned"`
	LifetimeSpent   int       `json:"lifetime_spent"`
	LastTransaction time.Time `json:"last_transaction"`
}

func (s *LoyaltyService) GetPointsBalance(ctx context.Context, userID uint) (*LoyaltyPointsBalance, error) {
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	var lifetimeEarned, lifetimeSpent int
	var lastTransaction time.Time

	// Get lifetime earned points
	err = s.db.Model(&models.LoyaltyPointTransaction{}).
		Where("user_id = ? AND points > 0", userID).
		Select("COALESCE(SUM(points), 0)").
		Scan(&lifetimeEarned).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get lifetime earned: %w", err)
	}

	// Get lifetime spent points
	err = s.db.Model(&models.LoyaltyPointTransaction{}).
		Where("user_id = ? AND points < 0", userID).
		Select("COALESCE(SUM(ABS(points)), 0)").
		Scan(&lifetimeSpent).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get lifetime spent: %w", err)
	}

	// Get last transaction date
	var lastTx models.LoyaltyPointTransaction
	err = s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		First(&lastTx).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, fmt.Errorf("failed to get last transaction: %w", err)
	}
	if err == nil {
		lastTransaction = lastTx.CreatedAt
	}

	return &LoyaltyPointsBalance{
		UserID:          userID,
		CurrentPoints:   user.LoyaltyPoints,
		LifetimeEarned:  lifetimeEarned,
		LifetimeSpent:   lifetimeSpent,
		LastTransaction: lastTransaction,
	}, nil
}

func (s *LoyaltyService) AwardPoints(ctx context.Context, userID uint, points int, source, description string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get current user points
		var user models.User
		if err := tx.Where("user_id = ?", userID).First(&user).Error; err != nil {
			return fmt.Errorf("failed to get user: %w", err)
		}

		// Create loyalty point transaction
		transaction := models.LoyaltyPointTransaction{
			UserID:          userID,
			Points:          points,
			TransactionType: "earned",
			Description:     &description,
			BalanceBefore:   user.LoyaltyPoints,
			BalanceAfter:    user.LoyaltyPoints + points,
			Source:          &source,
		}

		if err := tx.Create(&transaction).Error; err != nil {
			return fmt.Errorf("failed to create transaction: %w", err)
		}

		// Update user loyalty points
		if err := tx.Model(&user).Update("loyalty_points", user.LoyaltyPoints+points).Error; err != nil {
			return fmt.Errorf("failed to update user points: %w", err)
		}

		return nil
	})
}

func (s *LoyaltyService) SpendPoints(ctx context.Context, userID uint, points int, purpose, description string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get current user points
		var user models.User
		if err := tx.Where("user_id = ?", userID).First(&user).Error; err != nil {
			return fmt.Errorf("failed to get user: %w", err)
		}

		// Check if user has enough points
		if user.LoyaltyPoints < points {
			return fmt.Errorf("insufficient loyalty points. Required: %d, Available: %d",
				points, user.LoyaltyPoints)
		}

		// Create loyalty point transaction
		transaction := models.LoyaltyPointTransaction{
			UserID:          userID,
			Points:          -points,
			TransactionType: "spent",
			Description:     &description,
			BalanceBefore:   user.LoyaltyPoints,
			BalanceAfter:    user.LoyaltyPoints - points,
			Source:          &purpose,
		}

		if err := tx.Create(&transaction).Error; err != nil {
			return fmt.Errorf("failed to create transaction: %w", err)
		}

		// Update user loyalty points
		if err := tx.Model(&user).Update("loyalty_points", user.LoyaltyPoints-points).Error; err != nil {
			return fmt.Errorf("failed to update user points: %w", err)
		}

		return nil
	})
}

func (s *LoyaltyService) GetPointsHistory(ctx context.Context, userID uint, limit, offset int) ([]models.LoyaltyPointTransaction, int64, error) {
	var transactions []models.LoyaltyPointTransaction
	var total int64

	// Get total count
	if err := s.db.Model(&models.LoyaltyPointTransaction{}).
		Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Get transactions with pagination
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&transactions).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get transactions: %w", err)
	}

	return transactions, total, nil
}

func (s *LoyaltyService) AwardPointsForPurchase(ctx context.Context, userID uint, purchaseAmount float64) error {
	// Award 1 point per 1 credit spent (configurable)
	pointsToAward := int(purchaseAmount)

	if pointsToAward > 0 {
		return s.AwardPoints(ctx, userID, pointsToAward, "purchase",
			fmt.Sprintf("Points earned from purchase (%.2f credits)", purchaseAmount))
	}

	return nil
}
