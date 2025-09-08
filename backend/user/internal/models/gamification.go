package models

import "time"

// Loyalty Points Transaction
type LoyaltyPointTransaction struct {
	PointTransactionID uint      `gorm:"primaryKey;column:point_transaction_id" json:"point_transaction_id"`
	UserID             uint      `gorm:"column:user_id" json:"user_id"`
	Points             int       `gorm:"column:points" json:"points"`
	TransactionType    string    `gorm:"column:transaction_type" json:"transaction_type"`
	Description        *string   `gorm:"column:description" json:"description"`
	BalanceBefore      int       `gorm:"column:balance_before" json:"balance_before"`
	BalanceAfter       int       `gorm:"column:balance_after" json:"balance_after"`
	Source             *string   `gorm:"column:source" json:"source"`
	CreatedAt          time.Time `gorm:"column:created_at" json:"created_at"`

	// Relations
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (LoyaltyPointTransaction) TableName() string {
	return "loyalty_point_transactions"
}

// Spin Wheel Configuration
type SpinWheelConfig struct {
	ConfigID    uint      `gorm:"primaryKey;column:config_id" json:"config_id"`
	RewardType  string    `gorm:"column:reward_type" json:"reward_type"`
	RewardValue string    `gorm:"column:reward_value" json:"reward_value"`
	Probability float64   `gorm:"column:probability" json:"probability"`
	PointsCost  int       `gorm:"column:points_cost;default:100" json:"points_cost"`
	IsActive    bool      `gorm:"column:is_active;default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"column:created_at" json:"created_at"`
	CreatedBy   *uint     `gorm:"column:created_by" json:"created_by"`
}

func (SpinWheelConfig) TableName() string {
	return "spin_wheel_config"
}

// Spin Wheel Results
type SpinWheelResult struct {
	SpinID         uint      `gorm:"primaryKey;column:spin_id" json:"spin_id"`
	UserID         uint      `gorm:"column:user_id" json:"user_id"`
	ConfigID       uint      `gorm:"column:config_id" json:"config_id"`
	RewardReceived string    `gorm:"column:reward_received" json:"reward_received"`
	PointsSpent    int       `gorm:"column:points_spent" json:"points_spent"`
	CreatedAt      time.Time `gorm:"column:created_at" json:"created_at"`

	// Relations
	User   User            `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Config SpinWheelConfig `gorm:"foreignKey:ConfigID" json:"config,omitempty"`
}

func (SpinWheelResult) TableName() string {
	return "spin_wheel_results"
}

// Daily Login Rewards
type DailyLoginReward struct {
	RewardID    uint      `gorm:"primaryKey;column:reward_id" json:"reward_id"`
	UserID      uint      `gorm:"column:user_id" json:"user_id"`
	DayStreak   int       `gorm:"column:day_streak" json:"day_streak"`
	RewardType  string    `gorm:"column:reward_type" json:"reward_type"`
	RewardValue *string   `gorm:"column:reward_value" json:"reward_value"`
	ClaimedAt   time.Time `gorm:"column:claimed_at" json:"claimed_at"`

	// Relations
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (DailyLoginReward) TableName() string {
	return "daily_login_rewards"
}

// Achievement System
type Achievement struct {
	AchievementID   uint      `gorm:"primaryKey;column:achievement_id" json:"achievement_id"`
	Name            string    `gorm:"column:name" json:"name"`
	Description     string    `gorm:"column:description" json:"description"`
	IconURL         *string   `gorm:"column:icon_url" json:"icon_url"`
	RewardType      string    `gorm:"column:reward_type" json:"reward_type"`
	RewardValue     string    `gorm:"column:reward_value" json:"reward_value"`
	RequirementType string    `gorm:"column:requirement_type" json:"requirement_type"`
	RequiredValue   int       `gorm:"column:required_value" json:"required_value"`
	IsActive        bool      `gorm:"column:is_active;default:true" json:"is_active"`
	CreatedAt       time.Time `gorm:"column:created_at" json:"created_at"`
}

func (Achievement) TableName() string {
	return "achievements"
}

// User Achievement Progress
type UserAchievement struct {
	UserAchievementID uint       `gorm:"primaryKey;column:user_achievement_id" json:"user_achievement_id"`
	UserID            uint       `gorm:"column:user_id" json:"user_id"`
	AchievementID     uint       `gorm:"column:achievement_id" json:"achievement_id"`
	CurrentProgress   int        `gorm:"column:current_progress;default:0" json:"current_progress"`
	IsCompleted       bool       `gorm:"column:is_completed;default:false" json:"is_completed"`
	CompletedAt       *time.Time `gorm:"column:completed_at" json:"completed_at"`
	RewardClaimed     bool       `gorm:"column:reward_claimed;default:false" json:"reward_claimed"`
	ClaimedAt         *time.Time `gorm:"column:claimed_at" json:"claimed_at"`

	// Relations
	User        User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Achievement Achievement `gorm:"foreignKey:AchievementID" json:"achievement,omitempty"`
}

func (UserAchievement) TableName() string {
	return "user_achievements"
}
