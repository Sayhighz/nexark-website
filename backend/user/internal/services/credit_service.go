package services

import (
	"context"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type CreditService struct {
	db             *gorm.DB
	userService    *UserService
	paymentService *PaymentService
}

func NewCreditService(db *gorm.DB, userService *UserService, paymentService *PaymentService) *CreditService {
	return &CreditService{
		db:             db,
		userService:    userService,
		paymentService: paymentService,
	}
}

type TopUpRequest struct {
	Amount        float64 `json:"amount" binding:"required,min=100,max=50000"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Currency      string  `json:"currency"`
}

type CreditBalance struct {
	Balance         float64   `json:"balance"`
	PendingPayments float64   `json:"pending_payments"`
	LastUpdated     time.Time `json:"last_updated"`
}

type TransferRequest struct {
	ToUserID    uint    `json:"to_user_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required,min=1"`
	Description string  `json:"description"`
}

func (s *CreditService) GetCreditBalance(ctx context.Context, userID uint) (*CreditBalance, error) {
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Get pending payments amount
	var pendingAmount float64
	err = s.db.Model(&models.Payment{}).
		Where("user_id = ? AND payment_status IN (?)", userID, []string{"pending", "processing"}).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&pendingAmount).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get pending payments: %w", err)
	}

	return &CreditBalance{
		Balance:         user.CreditBalance,
		PendingPayments: pendingAmount,
		LastUpdated:     time.Now(),
	}, nil
}

func (s *CreditService) TopUpCredits(ctx context.Context, userID uint, req TopUpRequest) (*models.Payment, error) {
	// Set default currency
	if req.Currency == "" {
		req.Currency = "thb"
	}

	// Create payment intent through payment service
	paymentReq := CreatePaymentIntentRequest{
		Amount:        req.Amount,
		Currency:      req.Currency,
		PaymentMethod: req.PaymentMethod,
	}

	payment, err := s.paymentService.CreatePaymentIntent(ctx, userID, paymentReq)
	if err != nil {
		return nil, fmt.Errorf("failed to create payment intent: %w", err)
	}

	return payment, nil
}

func (s *CreditService) GetCreditTransactions(ctx context.Context, userID uint, limit, offset int, transactionType string) ([]models.CreditTransaction, int64, error) {
	var transactions []models.CreditTransaction
	var total int64

	query := s.db.Model(&models.CreditTransaction{}).Where("user_id = ?", userID)

	// Filter by transaction type if provided
	if transactionType != "" {
		query = query.Where("transaction_type = ?", transactionType)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Get transactions with pagination
	err := query.Order("created_at DESC").
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

func (s *CreditService) TransferCredits(ctx context.Context, fromUserID uint, req TransferRequest) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get sender
		fromUser, err := s.userService.GetUserByID(ctx, fromUserID)
		if err != nil {
			return fmt.Errorf("sender not found: %w", err)
		}

		// Get receiver
		_, err = s.userService.GetUserByID(ctx, req.ToUserID)
		if err != nil {
			return fmt.Errorf("receiver not found: %w", err)
		}

		// Validate sender has sufficient balance
		if fromUser.CreditBalance < req.Amount {
			return fmt.Errorf("insufficient balance. Available: %.2f, Required: %.2f",
				fromUser.CreditBalance, req.Amount)
		}

		// Deduct from sender
		err = s.userService.UpdateCreditBalance(
			ctx,
			fromUserID,
			-req.Amount,
			"transfer_out",
			fmt.Sprintf("Transfer to user %d: %s", req.ToUserID, req.Description),
			nil,
			nil,
		)
		if err != nil {
			return fmt.Errorf("failed to deduct from sender: %w", err)
		}

		// Add to receiver
		err = s.userService.UpdateCreditBalance(
			ctx,
			req.ToUserID,
			req.Amount,
			"transfer_in",
			fmt.Sprintf("Transfer from user %d: %s", fromUserID, req.Description),
			nil,
			nil,
		)
		if err != nil {
			return fmt.Errorf("failed to add to receiver: %w", err)
		}

		return nil
	})
}

func (s *CreditService) AdminAdjustCredits(ctx context.Context, userID uint, amount float64, reason string, adminID uint) error {
	transactionType := "admin_adjust"
	description := fmt.Sprintf("Admin adjustment: %s", reason)

	err := s.userService.UpdateCreditBalance(
		ctx,
		userID,
		amount,
		transactionType,
		description,
		nil,
		nil,
	)

	if err != nil {
		return fmt.Errorf("failed to adjust credits: %w", err)
	}

	return nil
}

func (s *CreditService) GetCreditSummary(ctx context.Context, userID uint) (map[string]interface{}, error) {
	balance, err := s.GetCreditBalance(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Get transaction summary for last 30 days
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)

	var deposits, purchases float64

	err = s.db.Model(&models.CreditTransaction{}).
		Where("user_id = ? AND created_at >= ? AND transaction_type = ?", userID, thirtyDaysAgo, "deposit").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&deposits).Error
	if err != nil {
		return nil, err
	}

	err = s.db.Model(&models.CreditTransaction{}).
		Where("user_id = ? AND created_at >= ? AND transaction_type = ?", userID, thirtyDaysAgo, "purchase").
		Select("COALESCE(SUM(ABS(amount)), 0)").
		Scan(&purchases).Error
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"current_balance":  balance.Balance,
		"pending_payments": balance.PendingPayments,
		"last_30_days": map[string]float64{
			"deposits":  deposits,
			"purchases": purchases,
		},
		"last_updated": balance.LastUpdated,
	}, nil
}
