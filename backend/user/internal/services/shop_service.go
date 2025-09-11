package services

import (
	"context"
	"fmt"

	"nexark-user-backend/internal/models"

	"gorm.io/gorm"
)

type ShopService struct {
	db *gorm.DB
}

func NewShopService(db *gorm.DB) *ShopService {
	return &ShopService{db: db}
}

func (s *ShopService) GetCategories(ctx context.Context) ([]models.ItemCategory, error) {
	var categories []models.ItemCategory
	err := s.db.Where("is_active = ?", true).
		Order("display_order ASC").
		Find(&categories).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get categories: %w", err)
	}

	return categories, nil
}

func (s *ShopService) GetItemsByCategory(ctx context.Context, categoryID uint, limit, offset int) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	query := s.db.Model(&models.Item{}).Where("category_id = ? AND is_active = ?", categoryID, true)

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count items: %w", err)
	}

	// Get items with pagination
	err := query.Order("item_name ASC").
		Limit(limit).
		Offset(offset).
		Preload("Category").
		Find(&items).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get items: %w", err)
	}

	return items, total, nil
}

func (s *ShopService) GetAllItems(ctx context.Context, limit, offset int, featured bool) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	query := s.db.Model(&models.Item{}).Where("is_active = ?", true)

	if featured {
		query = query.Where("is_featured = ?", true)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count items: %w", err)
	}

	// Get items with pagination
	err := query.Order("item_name ASC").
		Limit(limit).
		Offset(offset).
		Preload("Category").
		Find(&items).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get items: %w", err)
	}

	return items, total, nil
}

func (s *ShopService) GetItemByID(ctx context.Context, itemID uint) (*models.Item, error) {
	var item models.Item
	err := s.db.Where("item_id = ? AND is_active = ?", itemID, true).
		Preload("Category").
		First(&item).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("item not found")
		}
		return nil, fmt.Errorf("failed to get item: %w", err)
	}

	return &item, nil
}
