package stripe

import (
	"context"
	"fmt"

	"github.com/stripe/stripe-go/v75"
	"github.com/stripe/stripe-go/v75/customer"
	"github.com/stripe/stripe-go/v75/paymentintent"
	"github.com/stripe/stripe-go/v75/paymentmethod"
	"github.com/stripe/stripe-go/v75/refund"
)

type StripeService struct {
	secretKey     string
	webhookSecret string
}

func NewStripeService(secretKey, webhookSecret string) *StripeService {
	// Only set the global key when provided to avoid 401s during local dev without Stripe
	if secretKey != "" {
		stripe.Key = secretKey
	}
	return &StripeService{
		secretKey:     secretKey,
		webhookSecret: webhookSecret,
	}
}

type CreatePaymentIntentParams struct {
	Amount                  int64
	Currency                string
	CustomerID              string
	PaymentMethodTypes      []string
	Metadata                map[string]string
	AutomaticPaymentMethods bool
}

func (s *StripeService) CreatePaymentIntent(ctx context.Context, params CreatePaymentIntentParams) (*stripe.PaymentIntent, error) {
	piParams := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(params.Amount),
		Currency: stripe.String(params.Currency),
		Customer: stripe.String(params.CustomerID),
	}

	if len(params.PaymentMethodTypes) > 0 {
		piParams.PaymentMethodTypes = stripe.StringSlice(params.PaymentMethodTypes)
	}

	if params.AutomaticPaymentMethods {
		piParams.AutomaticPaymentMethods = &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		}
	}

	if params.Metadata != nil {
		piParams.Metadata = params.Metadata
	}

	pi, err := paymentintent.New(piParams)
	if err != nil {
		return nil, fmt.Errorf("failed to create payment intent: %w", err)
	}

	return pi, nil
}

func (s *StripeService) ConfirmPaymentIntent(ctx context.Context, paymentIntentID string, paymentMethodID string) (*stripe.PaymentIntent, error) {
	params := &stripe.PaymentIntentConfirmParams{
		PaymentMethod: stripe.String(paymentMethodID),
	}

	pi, err := paymentintent.Confirm(paymentIntentID, params)
	if err != nil {
		return nil, fmt.Errorf("failed to confirm payment intent: %w", err)
	}

	return pi, nil
}

func (s *StripeService) GetPaymentIntent(ctx context.Context, paymentIntentID string) (*stripe.PaymentIntent, error) {
	pi, err := paymentintent.Get(paymentIntentID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get payment intent: %w", err)
	}

	return pi, nil
}

func (s *StripeService) CreateCustomer(ctx context.Context, email, name string, metadata map[string]string) (*stripe.Customer, error) {
	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}

	if metadata != nil {
		params.Metadata = metadata
	}

	cust, err := customer.New(params)
	if err != nil {
		return nil, fmt.Errorf("failed to create customer: %w", err)
	}

	return cust, nil
}

func (s *StripeService) GetCustomer(ctx context.Context, customerID string) (*stripe.Customer, error) {
	cust, err := customer.Get(customerID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get customer: %w", err)
	}

	return cust, nil
}

func (s *StripeService) AttachPaymentMethod(ctx context.Context, paymentMethodID, customerID string) (*stripe.PaymentMethod, error) {
	params := &stripe.PaymentMethodAttachParams{
		Customer: stripe.String(customerID),
	}

	pm, err := paymentmethod.Attach(paymentMethodID, params)
	if err != nil {
		return nil, fmt.Errorf("failed to attach payment method: %w", err)
	}

	return pm, nil
}

func (s *StripeService) DetachPaymentMethod(ctx context.Context, paymentMethodID string) (*stripe.PaymentMethod, error) {
	pm, err := paymentmethod.Detach(paymentMethodID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to detach payment method: %w", err)
	}

	return pm, nil
}

func (s *StripeService) ListCustomerPaymentMethods(ctx context.Context, customerID string) ([]*stripe.PaymentMethod, error) {
	params := &stripe.PaymentMethodListParams{
		Customer: stripe.String(customerID),
		Type:     stripe.String("card"),
	}

	i := paymentmethod.List(params)
	var methods []*stripe.PaymentMethod

	for i.Next() {
		methods = append(methods, i.PaymentMethod())
	}

	if err := i.Err(); err != nil {
		return nil, fmt.Errorf("failed to list payment methods: %w", err)
	}

	return methods, nil
}

func (s *StripeService) CreateRefund(ctx context.Context, paymentIntentID string, amount *int64, reason string) (*stripe.Refund, error) {
	params := &stripe.RefundParams{
		PaymentIntent: stripe.String(paymentIntentID),
		Reason:        stripe.String(reason),
	}

	if amount != nil {
		params.Amount = stripe.Int64(*amount)
	}

	ref, err := refund.New(params)
	if err != nil {
		return nil, fmt.Errorf("failed to create refund: %w", err)
	}

	return ref, nil
}

func (s *StripeService) GetWebhookSecret() string {
	return s.webhookSecret
}

// IsConfigured reports whether a usable Stripe secret key is set.
// Use this to no-op Stripe-dependent flows in non-payment environments.
func (s *StripeService) IsConfigured() bool {
	return s != nil && s.secretKey != ""
}
