package services

import (
	"context"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type ContentService struct {
	db *gorm.DB
}

func NewContentService(db *gorm.DB) *ContentService {
	return &ContentService{db: db}
}

type NewsFilters struct {
	Featured   *bool
	CategoryID *uint
	Published  *bool
	Search     string
}

type AnnouncementFilters struct {
	Type       string
	Active     *bool
	OnlyActive bool // Show only announcements that are currently active (within date range)
}

func (s *ContentService) GetNews(ctx context.Context, filters NewsFilters, limit, offset int) ([]models.News, int64, error) {
	var news []models.News
	var total int64

	query := s.db.Model(&models.News{})

	// Apply filters
	if filters.Published != nil {
		query = query.Where("is_published = ?", *filters.Published)
	} else {
		// Default to published only for public API
		query = query.Where("is_published = ?", true)
	}

	if filters.Featured != nil {
		query = query.Where("is_featured = ?", *filters.Featured)
	}

	if filters.Search != "" {
		query = query.Where("title LIKE ? OR content LIKE ?",
			"%"+filters.Search+"%", "%"+filters.Search+"%")
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count news: %w", err)
	}

	// Get news with pagination
	err := query.Order("is_featured DESC, published_at DESC, created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&news).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get news: %w", err)
	}

	return news, total, nil
}

func (s *ContentService) GetNewsByID(ctx context.Context, newsID uint) (*models.News, error) {
	var news models.News
	err := s.db.Where("news_id = ? AND is_published = ?", newsID, true).First(&news).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("news not found")
		}
		return nil, fmt.Errorf("failed to get news: %w", err)
	}

	// Increment view count
	s.db.Model(&news).Updates(map[string]interface{}{
		"view_count":     gorm.Expr("view_count + 1"),
		"last_viewed_at": time.Now(),
	})

	return &news, nil
}

func (s *ContentService) GetFeaturedNews(ctx context.Context, limit int) ([]models.News, error) {
	var news []models.News
	err := s.db.Where("is_published = ? AND is_featured = ?", true, true).
		Order("published_at DESC").
		Limit(limit).
		Find(&news).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get featured news: %w", err)
	}

	return news, nil
}

func (s *ContentService) GetLatestNews(ctx context.Context, limit int) ([]models.News, error) {
	var news []models.News
	err := s.db.Where("is_published = ?", true).
		Order("published_at DESC").
		Limit(limit).
		Find(&news).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get latest news: %w", err)
	}

	return news, nil
}

func (s *ContentService) GetAnnouncements(ctx context.Context, filters AnnouncementFilters, limit, offset int) ([]models.Announcement, int64, error) {
	var announcements []models.Announcement
	var total int64

	query := s.db.Model(&models.Announcement{})

	// Apply filters
	if filters.Active != nil {
		query = query.Where("is_active = ?", *filters.Active)
	}

	if filters.Type != "" {
		query = query.Where("announcement_type = ?", filters.Type)
	}

	if filters.OnlyActive {
		now := time.Now()
		query = query.Where("is_active = ? AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)",
			true, now, now)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count announcements: %w", err)
	}

	// Get announcements with pagination
	err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&announcements).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get announcements: %w", err)
	}

	return announcements, total, nil
}

func (s *ContentService) GetActiveAnnouncements(ctx context.Context) ([]models.Announcement, error) {
	var announcements []models.Announcement
	now := time.Now()

	err := s.db.Where("is_active = ? AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)",
		true, now, now).
		Order("created_at DESC").
		Find(&announcements).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get active announcements: %w", err)
	}

	return announcements, nil
}

func (s *ContentService) GetAnnouncementByID(ctx context.Context, announcementID uint) (*models.Announcement, error) {
	var announcement models.Announcement
	err := s.db.Where("announcement_id = ?", announcementID).First(&announcement).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("announcement not found")
		}
		return nil, fmt.Errorf("failed to get announcement: %w", err)
	}

	return &announcement, nil
}

func (s *ContentService) SearchContent(ctx context.Context, query string, limit, offset int) (map[string]interface{}, error) {
	var news []models.News
	var announcements []models.Announcement

	// Search news
	newsQuery := s.db.Where("is_published = ? AND (title LIKE ? OR content LIKE ?)",
		true, "%"+query+"%", "%"+query+"%")
	newsQuery.Order("published_at DESC").Limit(limit).Offset(offset).Find(&news)

	var newsTotal int64
	s.db.Model(&models.News{}).Where("is_published = ? AND (title LIKE ? OR content LIKE ?)",
		true, "%"+query+"%", "%"+query+"%").Count(&newsTotal)

	// Search announcements
	now := time.Now()
	announcementQuery := s.db.Where("is_active = ? AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?) AND (title LIKE ? OR content LIKE ?)",
		true, now, now, "%"+query+"%", "%"+query+"%")
	announcementQuery.Order("created_at DESC").Limit(limit).Find(&announcements)

	var announcementTotal int64
	s.db.Model(&models.Announcement{}).Where("is_active = ? AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?) AND (title LIKE ? OR content LIKE ?)",
		true, now, now, "%"+query+"%", "%"+query+"%").Count(&announcementTotal)

	return map[string]interface{}{
		"news": map[string]interface{}{
			"items": news,
			"total": newsTotal,
		},
		"announcements": map[string]interface{}{
			"items": announcements,
			"total": announcementTotal,
		},
		"query": query,
	}, nil
}

func (s *ContentService) GetContentSummary(ctx context.Context) (map[string]interface{}, error) {
	var newsCount, announcementCount int64

	// Count published news
	if err := s.db.Model(&models.News{}).Where("is_published = ?", true).Count(&newsCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count news: %w", err)
	}

	// Count active announcements
	now := time.Now()
	if err := s.db.Model(&models.Announcement{}).
		Where("is_active = ? AND (start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)",
			true, now, now).Count(&announcementCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count announcements: %w", err)
	}

	return map[string]interface{}{
		"total_news":          newsCount,
		"total_announcements": announcementCount,
		"last_updated":        time.Now(),
	}, nil
}
