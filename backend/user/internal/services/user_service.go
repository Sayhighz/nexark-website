package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"
	"nexark-user-backend/pkg/steam"
	"nexark-user-backend/pkg/stripe"

	"gorm.io/gorm"
)

type UserService struct {
	db            *gorm.DB
	steamAuth     *steam.SteamAuth
	stripeService *stripe.StripeService
}

func NewUserService(db *gorm.DB, steamAuth *steam.SteamAuth, stripeService *stripe.StripeService) *UserService {
	return &UserService{
		db:            db,
		steamAuth:     steamAuth,
		stripeService: stripeService,
	}
}

func (s *UserService) AuthenticateWithSteam(ctx context.Context, steamID string) (*models.User, error) {
	// Get user info from Steam
	steamUser, err := s.steamAuth.GetUserInfo(ctx, steamID)
	if err != nil {
		return nil, fmt.Errorf("failed to get steam user info: %w", err)
	}

	// Find or create user
	var user models.User
	err = s.db.Where("steam_id = ?", steamID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new user
			user = models.User{
				SteamID:     steamID,
				Username:    steamUser.Username,
				DisplayName: steamUser.DisplayName,
				AvatarURL:   &steamUser.AvatarURL,
				LastLogin:   &time.Time{},
			}

			// Create Stripe customer
			stripeCustomer, err := s.stripeService.CreateCustomer(ctx,
				fmt.Sprintf("%s@steam.local", steamID),
				steamUser.DisplayName,
				map[string]string{
					"steam_id": steamID,
					"source":   "nexark_user",
				},
			)
			if err != nil {
				return nil, fmt.Errorf("failed to create stripe customer: %w", err)
			}

			user.StripeCustomerID = &stripeCustomer.ID

			if err := s.db.Create(&user).Error; err != nil {
				return nil, fmt.Errorf("failed to create user: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to query user: %w", err)
		}
	} else {
		// Update existing user info
		now := time.Now()
		user.Username = steamUser.Username
		user.DisplayName = steamUser.DisplayName
		user.AvatarURL = &steamUser.AvatarURL
		user.LastLogin = &now

		if err := s.db.Save(&user).Error; err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
	}

	return &user, nil
}

func (s *UserService) GetUserByID(ctx context.Context, userID uint) (*models.User, error) {
	var user models.User
	err := s.db.Where("user_id = ? AND is_active = ?", userID, true).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return &user, nil
}

func (s *UserService) UpdateCreditBalance(ctx context.Context, userID uint, amount float64, transactionType, description string, relatedPaymentID, relatedTransactionID *uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get current user for balance
		var user models.User
		if err := tx.Where("user_id = ?", userID).First(&user).Error; err != nil {
			return fmt.Errorf("failed to get user: %w", err)
		}

		// Check if this would result in negative balance for purchases
		newBalance := user.CreditBalance + amount
		if transactionType == "purchase" && newBalance < 0 {
			return fmt.Errorf("insufficient credit balance")
		}

		// Create credit transaction record
		creditTx := models.CreditTransaction{
			UserID:               userID,
			RelatedPaymentID:     relatedPaymentID,
			RelatedTransactionID: relatedTransactionID,
			Amount:               amount,
			TransactionType:      transactionType,
			Description:          &description,
			BalanceBefore:        user.CreditBalance,
			BalanceAfter:         newBalance,
		}

		if err := tx.Create(&creditTx).Error; err != nil {
			return fmt.Errorf("failed to create credit transaction: %w", err)
		}

		// Update user balance
		if err := tx.Model(&user).Update("credit_balance", newBalance).Error; err != nil {
			return fmt.Errorf("failed to update user balance: %w", err)
		}

		return nil
	})
}

func (s *UserService) GetCreditTransactions(ctx context.Context, userID uint, limit, offset int) ([]models.CreditTransaction, int64, error) {
	var transactions []models.CreditTransaction
	var total int64

	// Get total count
	if err := s.db.Model(&models.CreditTransaction{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Get transactions with pagination
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Preload("RelatedPayment").
		Preload("RelatedTransaction").
		Find(&transactions).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get transactions: %w", err)
	}

	return transactions, total, nil
}
