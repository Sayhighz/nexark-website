package models

import "time"

type Transaction struct {
	TransactionID   uint       `gorm:"primaryKey;column:transaction_id" json:"transaction_id"`
	TransactionUUID string     `gorm:"uniqueIndex;column:transaction_uuid" json:"transaction_uuid"`
	UserID          uint       `gorm:"column:user_id" json:"user_id"`
	ItemID          uint       `gorm:"column:item_id" json:"item_id"`
	ServerID        uint       `gorm:"column:server_id" json:"server_id"`
	Amount          float64    `gorm:"column:amount" json:"amount"`
	Quantity        int        `gorm:"column:quantity;default:1" json:"quantity"`
	Status          string     `gorm:"column:status;default:pending" json:"status"`
	RCONCommandSent *string    `gorm:"column:rcon_command_sent" json:"rcon_command_sent"`
	RCONResponse    *string    `gorm:"column:rcon_response" json:"rcon_response"`
	CreatedAt       time.Time  `gorm:"column:created_at" json:"created_at"`
	CompletedAt     *time.Time `gorm:"column:completed_at" json:"completed_at"`
	FailureReason   *string    `gorm:"column:failure_reason" json:"failure_reason"`

	// Relations
	User   User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Item   Item   `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	Server Server `gorm:"foreignKey:ServerID" json:"server,omitempty"`
}

func (Transaction) TableName() string {
	return "transactions"
}

type CreditTransaction struct {
	CreditTransactionID  uint      `gorm:"primaryKey;column:credit_transaction_id" json:"credit_transaction_id"`
	UserID               uint      `gorm:"column:user_id" json:"user_id"`
	RelatedPaymentID     *uint     `gorm:"column:related_payment_id" json:"related_payment_id"`
	RelatedTransactionID *uint     `gorm:"column:related_transaction_id" json:"related_transaction_id"`
	StripeRefundID       *string   `gorm:"column:stripe_refund_id" json:"stripe_refund_id"`
	Amount               float64   `gorm:"column:amount" json:"amount"`
	TransactionType      string    `gorm:"column:transaction_type" json:"transaction_type"`
	Description          *string   `gorm:"column:description" json:"description"`
	BalanceBefore        float64   `gorm:"column:balance_before" json:"balance_before"`
	BalanceAfter         float64   `gorm:"column:balance_after" json:"balance_after"`
	CreatedAt            time.Time `gorm:"column:created_at" json:"created_at"`
	CreatedBy            *uint     `gorm:"column:created_by" json:"created_by"`

	// Relations
	User               User         `gorm:"foreignKey:UserID" json:"user,omitempty"`
	RelatedPayment     *Payment     `gorm:"foreignKey:RelatedPaymentID" json:"related_payment,omitempty"`
	RelatedTransaction *Transaction `gorm:"foreignKey:RelatedTransactionID" json:"related_transaction,omitempty"`
}

func (CreditTransaction) TableName() string {
	return "credit_transactions"
}
