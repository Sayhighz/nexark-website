package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type JobService struct {
	db *gorm.DB
}

func NewJobService(db *gorm.DB) *JobService {
	service := &JobService{db: db}

	// Start job processor
	go service.startJobProcessor()

	return service
}

type JobPayload struct {
	UserID *uint                  `json:"user_id,omitempty"`
	Email  *EmailJobPayload       `json:"email,omitempty"`
	Data   map[string]interface{} `json:"data,omitempty"`
}

type EmailJobPayload struct {
	ToEmail    string                 `json:"to_email"`
	ToName     string                 `json:"to_name"`
	TemplateID *uint                  `json:"template_id,omitempty"`
	Subject    string                 `json:"subject"`
	BodyHTML   string                 `json:"body_html"`
	BodyText   string                 `json:"body_text"`
	Variables  map[string]interface{} `json:"variables,omitempty"`
}

func (s *JobService) CreateJob(ctx context.Context, jobType models.JobType, payload JobPayload, priority int, processAt *time.Time) (*models.Job, error) {
	if processAt == nil {
		now := time.Now()
		processAt = &now
	}

	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %w", err)
	}

	var payloadMap models.JSON
	if err := json.Unmarshal(payloadJSON, &payloadMap); err != nil {
		return nil, fmt.Errorf("failed to convert payload: %w", err)
	}

	job := models.Job{
		JobType:     jobType,
		Status:      models.JobStatusPending,
		Priority:    priority,
		Payload:     payloadMap,
		ProcessAt:   *processAt,
		MaxAttempts: 3,
	}

	if err := s.db.Create(&job).Error; err != nil {
		return nil, fmt.Errorf("failed to create job: %w", err)
	}

	return &job, nil
}

func (s *JobService) CreateEmailJob(ctx context.Context, email EmailJobPayload, priority int, processAt *time.Time) (*models.Job, error) {
	payload := JobPayload{
		Email: &email,
	}

	return s.CreateJob(ctx, models.JobTypeEmail, payload, priority, processAt)
}

func (s *JobService) GetPendingJobs(ctx context.Context, limit int) ([]models.Job, error) {
	var jobs []models.Job
	err := s.db.Where("status = ? AND process_at <= ?", models.JobStatusPending, time.Now()).
		Order("priority DESC, created_at ASC").
		Limit(limit).
		Find(&jobs).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get pending jobs: %w", err)
	}

	return jobs, nil
}

func (s *JobService) ProcessJob(ctx context.Context, job *models.Job) error {
	// Update job status to processing
	now := time.Now()
	updates := map[string]interface{}{
		"status":        models.JobStatusProcessing,
		"started_at":    now,
		"attempt_count": gorm.Expr("attempt_count + 1"),
	}

	if err := s.db.Model(job).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update job status: %w", err)
	}

	// Process based on job type
	var err error
	switch job.JobType {
	case models.JobTypeEmail:
		err = s.processEmailJob(ctx, job)
	case models.JobTypeLoyaltyPointsAward:
		err = s.processLoyaltyPointsJob(ctx, job)
	case models.JobTypeServerStatusCheck:
		err = s.processServerStatusJob(ctx, job)
	case models.JobTypeDataCleanup:
		err = s.processDataCleanupJob(ctx, job)
	default:
		err = fmt.Errorf("unknown job type: %s", job.JobType)
	}

	// Update job based on result
	if err != nil {
		s.markJobFailed(job, err.Error())
		return err
	} else {
		s.markJobCompleted(job, nil)
		return nil
	}
}

func (s *JobService) processEmailJob(ctx context.Context, job *models.Job) error {
	// Parse email payload
	var payload JobPayload
	payloadBytes, err := json.Marshal(job.Payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %w", err)
	}

	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	if payload.Email == nil {
		return fmt.Errorf("email payload is required")
	}

	// Create email queue entry
	emailQueue := models.EmailQueue{
		JobID:    job.JobID,
		ToEmail:  payload.Email.ToEmail,
		ToName:   &payload.Email.ToName,
		Subject:  payload.Email.Subject,
		BodyHTML: payload.Email.BodyHTML,
		BodyText: &payload.Email.BodyText,
		Status:   "pending",
	}

	if payload.Email.TemplateID != nil {
		emailQueue.TemplateID = payload.Email.TemplateID
	}

	if payload.Email.Variables != nil {
		variablesJSON, _ := json.Marshal(payload.Email.Variables)
		var variablesMap models.JSON
		json.Unmarshal(variablesJSON, &variablesMap)
		emailQueue.Variables = variablesMap
	}

	if err := s.db.Create(&emailQueue).Error; err != nil {
		return fmt.Errorf("failed to create email queue entry: %w", err)
	}

	// TODO: Implement actual email sending
	// For now, just simulate email sending
	log.Printf("Email sent to %s: %s", payload.Email.ToEmail, payload.Email.Subject)

	// Update email status
	now := time.Now()
	s.db.Model(&emailQueue).Updates(map[string]interface{}{
		"status":  "sent",
		"sent_at": now,
	})

	return nil
}

func (s *JobService) processLoyaltyPointsJob(ctx context.Context, job *models.Job) error {
	// TODO: Implement loyalty points awarding logic
	log.Printf("Processing loyalty points job: %d", job.JobID)
	return nil
}

func (s *JobService) processServerStatusJob(ctx context.Context, job *models.Job) error {
	// TODO: Implement server status check logic
	log.Printf("Processing server status job: %d", job.JobID)
	return nil
}

func (s *JobService) processDataCleanupJob(ctx context.Context, job *models.Job) error {
	// TODO: Implement data cleanup logic
	log.Printf("Processing data cleanup job: %d", job.JobID)
	return nil
}

func (s *JobService) markJobCompleted(job *models.Job, result map[string]interface{}) {
	now := time.Now()
	updates := map[string]interface{}{
		"status":       models.JobStatusCompleted,
		"completed_at": now,
	}

	if result != nil {
		resultJSON, _ := json.Marshal(result)
		var resultMap models.JSON
		json.Unmarshal(resultJSON, &resultMap)
		updates["result"] = resultMap
	}

	s.db.Model(job).Updates(updates)
}

func (s *JobService) markJobFailed(job *models.Job, errorMsg string) {
	updates := map[string]interface{}{
		"error_msg": errorMsg,
	}

	// Check if we should retry
	if job.AttemptCount >= job.MaxAttempts {
		updates["status"] = models.JobStatusFailed
		now := time.Now()
		updates["completed_at"] = now
	} else {
		// Retry later (exponential backoff)
		retryDelay := time.Duration(job.AttemptCount*job.AttemptCount) * time.Minute
		updates["status"] = models.JobStatusPending
		updates["process_at"] = time.Now().Add(retryDelay)
	}

	s.db.Model(job).Updates(updates)
}

func (s *JobService) startJobProcessor() {
	ticker := time.NewTicker(10 * time.Second) // Process jobs every 10 seconds
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.processJobs()
		}
	}
}

func (s *JobService) processJobs() {
	jobs, err := s.GetPendingJobs(context.Background(), 10)
	if err != nil {
		log.Printf("Failed to get pending jobs: %v", err)
		return
	}

	for _, job := range jobs {
		go func(j models.Job) {
			if err := s.ProcessJob(context.Background(), &j); err != nil {
				log.Printf("Job %d failed: %v", j.JobID, err)
			} else {
				log.Printf("Job %d completed successfully", j.JobID)
			}
		}(job)
	}
}

func (s *JobService) GetJobStatus(ctx context.Context, jobID uint) (*models.Job, error) {
	var job models.Job
	err := s.db.Where("job_id = ?", jobID).First(&job).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("job not found")
		}
		return nil, fmt.Errorf("failed to get job: %w", err)
	}

	return &job, nil
}

func (s *JobService) GetJobs(ctx context.Context, status *models.JobStatus, jobType *models.JobType, limit, offset int) ([]models.Job, int64, error) {
	var jobs []models.Job
	var total int64

	query := s.db.Model(&models.Job{})

	if status != nil {
		query = query.Where("status = ?", *status)
	}

	if jobType != nil {
		query = query.Where("job_type = ?", *jobType)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count jobs: %w", err)
	}

	// Get jobs with pagination
	err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&jobs).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get jobs: %w", err)
	}

	return jobs, total, nil
}

func (s *JobService) CancelJob(ctx context.Context, jobID uint) error {
	updates := map[string]interface{}{
		"status":       models.JobStatusCancelled,
		"completed_at": time.Now(),
	}

	result := s.db.Model(&models.Job{}).Where("job_id = ? AND status = ?", jobID, models.JobStatusPending).Updates(updates)
	if result.Error != nil {
		return fmt.Errorf("failed to cancel job: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("job not found or not cancellable")
	}

	return nil
}

// Helper methods for specific job types
func (s *JobService) ScheduleWelcomeEmail(ctx context.Context, userEmail, userName string) error {
	emailPayload := EmailJobPayload{
		ToEmail:  userEmail,
		ToName:   userName,
		Subject:  "Welcome to Nexark!",
		BodyHTML: fmt.Sprintf("<h1>Welcome %s!</h1><p>Thank you for joining Nexark ARK Server community.</p>", userName),
		BodyText: fmt.Sprintf("Welcome %s! Thank you for joining Nexark ARK Server community.", userName),
	}

	_, err := s.CreateEmailJob(ctx, emailPayload, 1, nil)
	return err
}

func (s *JobService) SchedulePaymentConfirmationEmail(ctx context.Context, userEmail, userName string, amount float64) error {
	emailPayload := EmailJobPayload{
		ToEmail:  userEmail,
		ToName:   userName,
		Subject:  "Payment Confirmation",
		BodyHTML: fmt.Sprintf("<h1>Payment Confirmed</h1><p>Hello %s,</p><p>Your payment of %.2f THB has been confirmed.</p>", userName, amount),
		BodyText: fmt.Sprintf("Hello %s, Your payment of %.2f THB has been confirmed.", userName, amount),
	}

	_, err := s.CreateEmailJob(ctx, emailPayload, 2, nil)
	return err
}
