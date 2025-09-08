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

func (s *PaymentService) AddPaymentMethod(ctx context.Context, userID uint, paymentMethodID string, setAsDefault bool) (*models.UserPaymentMethod, error) {
	// Get user
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	if user.StripeCustomerID == nil {
		return nil, fmt.Errorf("user has no stripe customer")
	}

	// Attach payment method to Stripe customer
	stripeMethod, err := s.stripeService.AttachPaymentMethod(ctx, paymentMethodID, *user.StripeCustomerID)
	if err != nil {
		return nil, fmt.Errorf("failed to attach payment method: %w", err)
	}

	// Start database transaction
	var userMethod models.UserPaymentMethod
	err = s.db.Transaction(func(tx *gorm.DB) error {
		// If setting as default, unset other defaults
		if setAsDefault {
			if err := tx.Model(&models.UserPaymentMethod{}).
				Where("user_id = ?", userID).
				Update("is_default", false).Error; err != nil {
				return fmt.Errorf("failed to unset default payment methods: %w", err)
			}
		}

		// Create user payment method record
		userMethod = models.UserPaymentMethod{
			UserID:                userID,
			StripePaymentMethodID: paymentMethodID,
			PaymentMethodType:     string(stripeMethod.Type),
			IsDefault:             setAsDefault,
			IsActive:              true,
		}

		// Extract card information if available
		if stripeMethod.Card != nil {
			brand := string(stripeMethod.Card.Brand)
			last4 := stripeMethod.Card.Last4
			expMonth := int(stripeMethod.Card.ExpMonth)
			expYear := int(stripeMethod.Card.ExpYear)

			userMethod.Brand = &brand
			userMethod.Last4 = &last4
			userMethod.ExpMonth = &expMonth
			userMethod.ExpYear = &expYear
		}

		return tx.Create(&userMethod).Error
	})

	if err != nil {
		return nil, fmt.Errorf("failed to save payment method: %w", err)
	}

	return &userMethod, nil
}

func (s *PaymentService) GetUserPaymentMethods(ctx context.Context, userID uint) ([]models.UserPaymentMethod, error) {
	var methods []models.UserPaymentMethod
	err := s.db.Where("user_id = ? AND is_active = ?", userID, true).
		Order("is_default DESC, created_at DESC").
		Find(&methods).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get payment methods: %w", err)
	}

	return methods, nil
}

func (s *PaymentService) SetDefaultPaymentMethod(ctx context.Context, userID uint, paymentMethodID string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify the payment method belongs to the user
		var method models.UserPaymentMethod
		if err := tx.Where("user_id = ? AND stripe_payment_method_id = ? AND is_active = ?",
			userID, paymentMethodID, true).First(&method).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("payment method not found")
			}
			return fmt.Errorf("failed to find payment method: %w", err)
		}

		// Unset all defaults for this user
		if err := tx.Model(&models.UserPaymentMethod{}).
			Where("user_id = ?", userID).
			Update("is_default", false).Error; err != nil {
			return fmt.Errorf("failed to unset defaults: %w", err)
		}

		// Set the new default
		if err := tx.Model(&method).Update("is_default", true).Error; err != nil {
			return fmt.Errorf("failed to set default: %w", err)
		}

		return nil
	})
}

func (s *PaymentService) RemovePaymentMethod(ctx context.Context, userID uint, paymentMethodID string) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Find the payment method
		var method models.UserPaymentMethod
		if err := tx.Where("user_id = ? AND stripe_payment_method_id = ? AND is_active = ?",
			userID, paymentMethodID, true).First(&method).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("payment method not found")
			}
			return fmt.Errorf("failed to find payment method: %w", err)
		}

		// Detach from Stripe
		_, err := s.stripeService.DetachPaymentMethod(ctx, paymentMethodID)
		if err != nil {
			return fmt.Errorf("failed to detach from Stripe: %w", err)
		}

		// Mark as inactive in our database
		if err := tx.Model(&method).Update("is_active", false).Error; err != nil {
			return fmt.Errorf("failed to deactivate payment method: %w", err)
		}

		// If this was the default, set another as default
		if method.IsDefault {
			var newDefault models.UserPaymentMethod
			if err := tx.Where("user_id = ? AND is_active = ? AND payment_method_id != ?",
				userID, true, method.PaymentMethodID).
				Order("created_at DESC").First(&newDefault).Error; err == nil {
				tx.Model(&newDefault).Update("is_default", true)
			}
		}

		return nil
	})
}

func (s *PaymentService) ValidatePaymentMethod(ctx context.Context, userID uint, paymentMethodID string) error {
	// Check if payment method belongs to user
	var method models.UserPaymentMethod
	err := s.db.Where("user_id = ? AND stripe_payment_method_id = ? AND is_active = ?",
		userID, paymentMethodID, true).First(&method).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return fmt.Errorf("payment method not found or not accessible")
		}
		return fmt.Errorf("failed to validate payment method: %w", err)
	}

	// Additional validation with Stripe
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}

	if user.StripeCustomerID == nil {
		return fmt.Errorf("user has no stripe customer")
	}

	// Get payment method from Stripe to ensure it's still valid
	methods, err := s.stripeService.ListCustomerPaymentMethods(ctx, *user.StripeCustomerID)
	if err != nil {
		return fmt.Errorf("failed to get Stripe payment methods: %w", err)
	}

	// Check if the payment method exists in Stripe
	found := false
	for _, pm := range methods {
		if pm.ID == paymentMethodID {
			found = true
			break
		}
	}

	if !found {
		// Mark as inactive if not found in Stripe
		s.db.Model(&method).Update("is_active", false)
		return fmt.Errorf("payment method is no longer valid")
	}

	return nil
}
