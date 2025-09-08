package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"
	"nexark-user-backend/pkg/stripe"

	"github.com/google/uuid"
	stripelib "github.com/stripe/stripe-go/v75"
	"gorm.io/gorm"
)

type PaymentService struct {
	db            *gorm.DB
	stripeService *stripe.StripeService
	userService   *UserService
}

func NewPaymentService(db *gorm.DB, stripeService *stripe.StripeService, userService *UserService) *PaymentService {
	return &PaymentService{
		db:            db,
		stripeService: stripeService,
		userService:   userService,
	}
}

type CreatePaymentIntentRequest struct {
	Amount        float64 `json:"amount" binding:"required,min=100,max=50000"`
	Currency      string  `json:"currency"`
	PaymentMethod string  `json:"payment_method"`
}

func (s *PaymentService) CreatePaymentIntent(ctx context.Context, userID uint, req CreatePaymentIntentRequest) (*models.Payment, error) {
	// Get user
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	if user.StripeCustomerID == nil {
		return nil, fmt.Errorf("user has no stripe customer")
	}

	// Create payment record
	payment := models.Payment{
		PaymentUUID:   uuid.New().String(),
		UserID:        userID,
		Amount:        req.Amount,
		Currency:      req.Currency,
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "pending",
		Metadata: models.JSON{
			"user_id": userID,
			"purpose": "credit_topup",
		},
		ExpiresAt: func() *time.Time {
			t := time.Now().Add(30 * time.Minute)
			return &t
		}(),
	}

	if err := s.db.Create(&payment).Error; err != nil {
		return nil, fmt.Errorf("failed to create payment record: %w", err)
	}

	// Create Stripe payment intent
	amountInCents := int64(req.Amount * 100) // Convert to cents

	var paymentMethodTypes []string
	switch req.PaymentMethod {
	case "promptpay":
		paymentMethodTypes = []string{"promptpay"}
	case "card":
		paymentMethodTypes = []string{"card"}
	default:
		paymentMethodTypes = []string{"card", "promptpay"}
	}

	stripeParams := stripe.CreatePaymentIntentParams{
		Amount:             amountInCents,
		Currency:           req.Currency,
		CustomerID:         *user.StripeCustomerID,
		PaymentMethodTypes: paymentMethodTypes,
		Metadata: map[string]string{
			"payment_id": fmt.Sprintf("%d", payment.PaymentID),
			"user_id":    fmt.Sprintf("%d", userID),
			"purpose":    "credit_topup",
		},
	}

	stripePI, err := s.stripeService.CreatePaymentIntent(ctx, stripeParams)
	if err != nil {
		return nil, fmt.Errorf("failed to create stripe payment intent: %w", err)
	}

	// Update payment record with Stripe data
	payment.StripePaymentIntentID = &stripePI.ID
	payment.StripeClientSecret = &stripePI.ClientSecret

	if err := s.db.Save(&payment).Error; err != nil {
		return nil, fmt.Errorf("failed to update payment record: %w", err)
	}

	return &payment, nil
}

func (s *PaymentService) GetPaymentStatus(ctx context.Context, userID uint, paymentUUID string) (*models.Payment, error) {
	var payment models.Payment
	err := s.db.Where("payment_uuid = ? AND user_id = ?", paymentUUID, userID).First(&payment).Error
	if err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}

	// Update status from Stripe if needed
	if payment.StripePaymentIntentID != nil && payment.PaymentStatus == "pending" {
		stripePI, err := s.stripeService.GetPaymentIntent(ctx, *payment.StripePaymentIntentID)
		if err == nil {
			payment.PaymentStatus = string(stripePI.Status)
			s.db.Save(&payment)
		}
	}

	return &payment, nil
}

func (s *PaymentService) ProcessWebhook(ctx context.Context, event *stripelib.Event) error {
	switch event.Type {
	case "payment_intent.succeeded":
		return s.handlePaymentSucceeded(ctx, event)
	case "payment_intent.payment_failed":
		return s.handlePaymentFailed(ctx, event)
	default:
		// Log unknown event type but don't fail
		fmt.Printf("Unhandled webhook event type: %s\n", event.Type)
		return nil
	}
}

func (s *PaymentService) handlePaymentSucceeded(ctx context.Context, event *stripelib.Event) error {
	var paymentIntent stripelib.PaymentIntent
	if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err != nil {
		return fmt.Errorf("failed to unmarshal payment intent: %w", err)
	}

	// Find payment record
	var payment models.Payment
	err := s.db.Where("stripe_payment_intent_id = ?", paymentIntent.ID).First(&payment).Error
	if err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	// Update payment status
	now := time.Now()
	payment.PaymentStatus = "succeeded"
	payment.ConfirmedAt = &now

	// Store webhook data
	webhookData := models.JSON{}
	json.Unmarshal(event.Data.Raw, &webhookData)
	payment.StripeWebhookData = webhookData

	if err := s.db.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	// Add credits to user
	err = s.userService.UpdateCreditBalance(
		ctx,
		payment.UserID,
		payment.Amount,
		"deposit",
		fmt.Sprintf("Credit top-up via %s", payment.PaymentMethod),
		&payment.PaymentID,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to add credits: %w", err)
	}

	return nil
}

func (s *PaymentService) handlePaymentFailed(ctx context.Context, event *stripelib.Event) error {
	var paymentIntent stripelib.PaymentIntent
	if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err != nil {
		return fmt.Errorf("failed to unmarshal payment intent: %w", err)
	}

	// Find payment record
	var payment models.Payment
	err := s.db.Where("stripe_payment_intent_id = ?", paymentIntent.ID).First(&payment).Error
	if err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	// Update payment status
	payment.PaymentStatus = "failed"
	if paymentIntent.LastPaymentError != nil {
		msg := paymentIntent.LastPaymentError.Error()
		payment.FailureReason = &msg
	}

	// Store webhook data
	webhookData := models.JSON{}
	json.Unmarshal(event.Data.Raw, &webhookData)
	payment.StripeWebhookData = webhookData

	if err := s.db.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	return nil
}

func (s *PaymentService) GetUserPayments(ctx context.Context, userID uint, limit, offset int) ([]models.Payment, int64, error) {
	var payments []models.Payment
	var total int64

	// Get total count
	if err := s.db.Model(&models.Payment{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count payments: %w", err)
	}

	// Get payments with pagination
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&payments).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get payments: %w", err)
	}

	return payments, total, nil
}
