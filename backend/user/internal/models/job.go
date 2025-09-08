package models

import (
	"time"
)

// JobStatus represents the status of a background job
type JobStatus string

const (
	JobStatusPending    JobStatus = "pending"
	JobStatusProcessing JobStatus = "processing"
	JobStatusCompleted  JobStatus = "completed"
	JobStatusFailed     JobStatus = "failed"
	JobStatusCancelled  JobStatus = "cancelled"
)

// JobType represents different types of background jobs
type JobType string

const (
	JobTypeEmail              JobType = "email"
	JobTypeSMSNotification    JobType = "sms_notification"
	JobTypeDataCleanup        JobType = "data_cleanup"
	JobTypeLoyaltyPointsAward JobType = "loyalty_points_award"
	JobTypeServerStatusCheck  JobType = "server_status_check"
	JobTypePaymentReminder    JobType = "payment_reminder"
)

// Job represents a background job
type Job struct {
	JobID        uint       `gorm:"primaryKey;column:job_id" json:"job_id"`
	JobType      JobType    `gorm:"column:job_type" json:"job_type"`
	Status       JobStatus  `gorm:"column:status;default:pending" json:"status"`
	Priority     int        `gorm:"column:priority;default:0" json:"priority"`
	Payload      JSON       `gorm:"column:payload" json:"payload"`
	Result       JSON       `gorm:"column:result" json:"result"`
	ErrorMsg     *string    `gorm:"column:error_msg" json:"error_msg"`
	AttemptCount int        `gorm:"column:attempt_count;default:0" json:"attempt_count"`
	MaxAttempts  int        `gorm:"column:max_attempts;default:3" json:"max_attempts"`
	CreatedAt    time.Time  `gorm:"column:created_at" json:"created_at"`
	ProcessAt    time.Time  `gorm:"column:process_at" json:"process_at"`
	StartedAt    *time.Time `gorm:"column:started_at" json:"started_at"`
	CompletedAt  *time.Time `gorm:"column:completed_at" json:"completed_at"`
	CreatedBy    *uint      `gorm:"column:created_by" json:"created_by"`
}

func (Job) TableName() string {
	return "jobs"
}

// EmailTemplate represents email templates
type EmailTemplate struct {
	TemplateID   uint      `gorm:"primaryKey;column:template_id" json:"template_id"`
	TemplateName string    `gorm:"uniqueIndex;column:template_name" json:"template_name"`
	Subject      string    `gorm:"column:subject" json:"subject"`
	BodyHTML     string    `gorm:"column:body_html" json:"body_html"`
	BodyText     *string   `gorm:"column:body_text" json:"body_text"`
	IsActive     bool      `gorm:"column:is_active;default:true" json:"is_active"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (EmailTemplate) TableName() string {
	return "email_templates"
}

// EmailQueue represents queued emails
type EmailQueue struct {
	EmailID      uint       `gorm:"primaryKey;column:email_id" json:"email_id"`
	JobID        uint       `gorm:"column:job_id" json:"job_id"`
	ToEmail      string     `gorm:"column:to_email" json:"to_email"`
	ToName       *string    `gorm:"column:to_name" json:"to_name"`
	Subject      string     `gorm:"column:subject" json:"subject"`
	BodyHTML     string     `gorm:"column:body_html" json:"body_html"`
	BodyText     *string    `gorm:"column:body_text" json:"body_text"`
	TemplateID   *uint      `gorm:"column:template_id" json:"template_id"`
	Variables    JSON       `gorm:"column:variables" json:"variables"`
	Status       string     `gorm:"column:status;default:pending" json:"status"`
	AttemptCount int        `gorm:"column:attempt_count;default:0" json:"attempt_count"`
	SentAt       *time.Time `gorm:"column:sent_at" json:"sent_at"`
	ErrorMsg     *string    `gorm:"column:error_msg" json:"error_msg"`
	CreatedAt    time.Time  `gorm:"column:created_at" json:"created_at"`

	// Relations
	Job      Job            `gorm:"foreignKey:JobID" json:"job,omitempty"`
	Template *EmailTemplate `gorm:"foreignKey:TemplateID" json:"template,omitempty"`
}

func (EmailQueue) TableName() string {
	return "email_queue"
}
