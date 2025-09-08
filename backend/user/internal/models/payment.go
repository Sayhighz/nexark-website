package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// JSON type for MySQL
type JSON map[string]interface{}

func (j JSON) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSON) Scan(value interface{}) error {
	if value == nil {
		*j = make(JSON)
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	}

	return errors.New("cannot scan into JSON")
}

type Payment struct {
	PaymentID             uint       `gorm:"primaryKey;column:payment_id" json:"payment_id"`
	PaymentUUID           string     `gorm:"uniqueIndex;column:payment_uuid" json:"payment_uuid"`
	UserID                uint       `gorm:"column:user_id" json:"user_id"`
	StripePaymentIntentID *string    `gorm:"uniqueIndex;column:stripe_payment_intent_id" json:"stripe_payment_intent_id"`
	StripePaymentMethodID *string    `gorm:"column:stripe_payment_method_id" json:"stripe_payment_method_id"`
	Amount                float64    `gorm:"column:amount" json:"amount"`
	Currency              string     `gorm:"column:currency;default:THB" json:"currency"`
	PaymentMethod         string     `gorm:"column:payment_method" json:"payment_method"`
	PaymentStatus         string     `gorm:"column:payment_status;default:pending" json:"payment_status"`
	StripeClientSecret    *string    `gorm:"column:stripe_client_secret" json:"stripe_client_secret"`
	StripeCharges         JSON       `gorm:"column:stripe_charges" json:"stripe_charges"`
	Metadata              JSON       `gorm:"column:metadata" json:"metadata"`
	FailureReason         *string    `gorm:"column:failure_reason" json:"failure_reason"`
	StripeWebhookData     JSON       `gorm:"column:stripe_webhook_data" json:"stripe_webhook_data"`
	CreatedAt             time.Time  `gorm:"column:created_at" json:"created_at"`
	ConfirmedAt           *time.Time `gorm:"column:confirmed_at" json:"confirmed_at"`
	ExpiresAt             *time.Time `gorm:"column:expires_at" json:"expires_at"`

	// Relations
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (Payment) TableName() string {
	return "payments"
}

type UserPaymentMethod struct {
	PaymentMethodID       uint      `gorm:"primaryKey;column:payment_method_id" json:"payment_method_id"`
	UserID                uint      `gorm:"column:user_id" json:"user_id"`
	StripePaymentMethodID string    `gorm:"uniqueIndex;column:stripe_payment_method_id" json:"stripe_payment_method_id"`
	PaymentMethodType     string    `gorm:"column:payment_method_type" json:"payment_method_type"`
	Brand                 *string   `gorm:"column:brand" json:"brand"`
	Last4                 *string   `gorm:"column:last4" json:"last4"`
	ExpMonth              *int      `gorm:"column:exp_month" json:"exp_month"`
	ExpYear               *int      `gorm:"column:exp_year" json:"exp_year"`
	IsDefault             bool      `gorm:"column:is_default;default:false" json:"is_default"`
	IsActive              bool      `gorm:"column:is_active;default:true" json:"is_active"`
	CreatedAt             time.Time `gorm:"column:created_at" json:"created_at"`

	// Relations
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (UserPaymentMethod) TableName() string {
	return "user_payment_methods"
}
