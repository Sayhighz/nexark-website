package models

import "time"

// News
type News struct {
	NewsID           uint       `gorm:"primaryKey;column:news_id" json:"news_id"`
	Title            string     `gorm:"column:title" json:"title"`
	Content          string     `gorm:"column:content" json:"content"`
	Excerpt          *string    `gorm:"column:excerpt" json:"excerpt"`
	FeaturedImageURL *string    `gorm:"column:featured_image_url" json:"featured_image_url"`
	IsPublished      bool       `gorm:"column:is_published;default:false" json:"is_published"`
	IsFeatured       bool       `gorm:"column:is_featured;default:false" json:"is_featured"`
	PublishedAt      *time.Time `gorm:"column:published_at" json:"published_at"`
	CreatedAt        time.Time  `gorm:"column:created_at" json:"created_at"`
	CreatedBy        *uint      `gorm:"column:created_by" json:"created_by"`

	// View count (for analytics)
	ViewCount    int        `gorm:"column:view_count;default:0" json:"view_count"`
	LastViewedAt *time.Time `gorm:"column:last_viewed_at" json:"last_viewed_at"`
}

func (News) TableName() string {
	return "news"
}

// Announcements
type Announcement struct {
	AnnouncementID   uint       `gorm:"primaryKey;column:announcement_id" json:"announcement_id"`
	Title            string     `gorm:"column:title" json:"title"`
	Content          string     `gorm:"column:content" json:"content"`
	AnnouncementType string     `gorm:"column:announcement_type;default:info" json:"announcement_type"`
	IsActive         bool       `gorm:"column:is_active;default:true" json:"is_active"`
	StartDate        *time.Time `gorm:"column:start_date" json:"start_date"`
	EndDate          *time.Time `gorm:"column:end_date" json:"end_date"`
	CreatedAt        time.Time  `gorm:"column:created_at" json:"created_at"`
	CreatedBy        *uint      `gorm:"column:created_by" json:"created_by"`

	// Priority for display order
	Priority int `gorm:"column:priority;default:0" json:"priority"`

	// Styling options
	IconName        *string `gorm:"column:icon_name" json:"icon_name"`
	BackgroundColor *string `gorm:"column:background_color" json:"background_color"`
	TextColor       *string `gorm:"column:text_color" json:"text_color"`
}

func (Announcement) TableName() string {
	return "announcements"
}

// News Categories (for future expansion)
type NewsCategory struct {
	CategoryID   uint      `gorm:"primaryKey;column:category_id" json:"category_id"`
	CategoryName string    `gorm:"column:category_name" json:"category_name"`
	Description  *string   `gorm:"column:description" json:"description"`
	Slug         string    `gorm:"uniqueIndex;column:slug" json:"slug"`
	IsActive     bool      `gorm:"column:is_active;default:true" json:"is_active"`
	DisplayOrder int       `gorm:"column:display_order;default:0" json:"display_order"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
}

func (NewsCategory) TableName() string {
	return "news_categories"
}
