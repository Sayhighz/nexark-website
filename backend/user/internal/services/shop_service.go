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

func (s *ShopService) AddToCart(ctx context.Context, userID, itemID, serverID uint, quantity int) error {
	// Check if item exists and is active
	var item models.Item
	if err := s.db.Where("item_id = ? AND is_active = ?", itemID, true).First(&item).Error; err != nil {
		return fmt.Errorf("item not found")
	}

	// Check if server exists
	var server models.Server
	if err := s.db.Where("server_id = ?", serverID).First(&server).Error; err != nil {
		return fmt.Errorf("server not found")
	}

	// Check stock
	if item.StockQuantity != -1 && item.StockQuantity < quantity {
		return fmt.Errorf("insufficient stock")
	}

	// Check if item already in cart
	var existingCart models.ShoppingCart
	err := s.db.Where("user_id = ? AND item_id = ? AND server_id = ?", userID, itemID, serverID).First(&existingCart).Error

	if err == nil {
		// Update existing cart item
		existingCart.Quantity += quantity
		return s.db.Save(&existingCart).Error
	} else if err == gorm.ErrRecordNotFound {
		// Create new cart item
		cartItem := models.ShoppingCart{
			UserID:   userID,
			ItemID:   itemID,
			ServerID: serverID,
			Quantity: quantity,
		}
		return s.db.Create(&cartItem).Error
	}

	return fmt.Errorf("failed to add to cart: %w", err)
}

func (s *ShopService) GetUserCart(ctx context.Context, userID uint) ([]models.ShoppingCart, error) {
	var cartItems []models.ShoppingCart
	err := s.db.Where("user_id = ?", userID).
		Preload("Item").
		Preload("Item.Category").
		Preload("Server").
		Find(&cartItems).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get cart: %w", err)
	}

	return cartItems, nil
}

func (s *ShopService) UpdateCartItem(ctx context.Context, userID, cartID uint, quantity int) error {
	if quantity <= 0 {
		return s.RemoveFromCart(ctx, userID, cartID)
	}

	var cartItem models.ShoppingCart
	err := s.db.Where("cart_id = ? AND user_id = ?", cartID, userID).First(&cartItem).Error
	if err != nil {
		return fmt.Errorf("cart item not found")
	}

	cartItem.Quantity = quantity
	return s.db.Save(&cartItem).Error
}

func (s *ShopService) RemoveFromCart(ctx context.Context, userID, cartID uint) error {
	return s.db.Where("cart_id = ? AND user_id = ?", cartID, userID).Delete(&models.ShoppingCart{}).Error
}

func (s *ShopService) ClearUserCart(ctx context.Context, userID uint) error {
	return s.db.Where("user_id = ?", userID).Delete(&models.ShoppingCart{}).Error
}
