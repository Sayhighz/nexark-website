package models

import "time"

type User struct {
	UserID           uint       `gorm:"primaryKey;column:user_id" json:"user_id"`
	SteamID          string     `gorm:"uniqueIndex;column:steam_id" json:"steam_id"`
	Username         string     `gorm:"column:username" json:"username"`
	DisplayName      string     `gorm:"column:display_name" json:"display_name"`
	AvatarURL        *string    `gorm:"column:avatar_url" json:"avatar_url"`
	CreditBalance    float64    `gorm:"column:credit_balance;type:decimal(10,2);default:0.00" json:"credit_balance"`
	LoyaltyPoints    int        `gorm:"column:loyalty_points;default:0" json:"loyalty_points"`
	StripeCustomerID *string    `gorm:"column:stripe_customer_id" json:"stripe_customer_id"`
	CreatedAt        time.Time  `gorm:"column:created_at" json:"created_at"`
	LastLogin        *time.Time `gorm:"column:last_login" json:"last_login"`
	IsActive         bool       `gorm:"column:is_active;default:true" json:"is_active"`
	IsBanned         bool       `gorm:"column:is_banned;default:false" json:"is_banned"`
	BanReason        *string    `gorm:"column:ban_reason" json:"ban_reason"`
}

func (User) TableName() string {
	return "users"
}
