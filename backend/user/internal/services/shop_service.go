package services

import (
	"context"
	"fmt"
	"strings"

	"nexark-user-backend/internal/models"

	"github.com/google/uuid"

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

// BuyItem processes item purchase for a user
func (s *ShopService) BuyItem(ctx context.Context, userID, itemID uint, serverID *uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get the item
		var item models.Item
		if err := tx.Where("item_id = ? AND is_active = ?", itemID, true).First(&item).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("item not found")
			}
			return fmt.Errorf("failed to get item: %w", err)
		}

		// Check stock if limited (-1 means unlimited)
		if item.StockQuantity != -1 && item.StockQuantity < 1 {
			return fmt.Errorf("item out of stock")
		}

		// Get user to check credits
		var user models.User
		if err := tx.Where("user_id = ?", userID).First(&user).Error; err != nil {
			return fmt.Errorf("failed to get user: %w", err)
		}

		// Check if user has enough credits
		if user.CreditBalance < item.Price {
			return fmt.Errorf("insufficient credits: required=%.2f, available=%.2f", item.Price, user.CreditBalance)
		}

		// Get balance before transaction
		balanceBefore := user.CreditBalance

		// Deduct credits from user
		if err := tx.Model(&user).Update("credit_balance", gorm.Expr("credit_balance - ?", item.Price)).Error; err != nil {
			return fmt.Errorf("failed to deduct credits: %w", err)
		}

		// Update stock if limited
		if item.StockQuantity > 0 {
			if err := tx.Model(&item).Update("stock_quantity", gorm.Expr("stock_quantity - 1")).Error; err != nil {
				return fmt.Errorf("failed to update stock: %w", err)
			}
		}

		// Create credit transaction record
		description := fmt.Sprintf("Purchased %s", item.ItemName)
		creditTransaction := models.CreditTransaction{
			UserID:          userID,
			Amount:          -item.Price, // Negative for deduction
			TransactionType: "purchase",
			Description:     &description,
			BalanceBefore:   balanceBefore,
			BalanceAfter:    balanceBefore - item.Price,
		}
		if err := tx.Create(&creditTransaction).Error; err != nil {
			return fmt.Errorf("failed to create credit transaction: %w", err)
		}

		// Create item transaction record for RCON processing
		actualServerID := uint(1) // Default server
		if serverID != nil {
			actualServerID = *serverID
		}

		transaction := models.Transaction{
			TransactionUUID: uuid.New().String(),
			UserID:          userID,
			ItemID:          itemID,
			ServerID:        actualServerID,
			Amount:          item.Price,
			Quantity:        1,
			Status:          "pending", // Will be updated when RCON is executed
		}
		if err := tx.Create(&transaction).Error; err != nil {
			return fmt.Errorf("failed to create transaction: %w", err)
		}

		// TODO: Execute RCON command on server
		// This would require integration with server service to execute the RCON command
		// For now, we'll just complete the purchase

		return nil
	})
}

// GiftItem processes item gift from one user to another
func (s *ShopService) GiftItem(ctx context.Context, senderID, itemID uint, recipientSteamID string, serverID *uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get the item
		var item models.Item
		if err := tx.Where("item_id = ? AND is_active = ?", itemID, true).First(&item).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("item not found")
			}
			return fmt.Errorf("failed to get item: %w", err)
		}

		// Check stock if limited (-1 means unlimited)
		if item.StockQuantity != -1 && item.StockQuantity < 1 {
			return fmt.Errorf("item out of stock")
		}

		// Get sender to check credits
		var sender models.User
		if err := tx.Where("user_id = ?", senderID).First(&sender).Error; err != nil {
			return fmt.Errorf("failed to get sender: %w", err)
		}

		// Check if sender has enough credits
		if sender.CreditBalance < item.Price {
			return fmt.Errorf("insufficient credits: required=%.2f, available=%.2f", item.Price, sender.CreditBalance)
		}

		// Validate recipient Steam ID format
		recipientSteamID = strings.TrimSpace(recipientSteamID)
		if len(recipientSteamID) == 0 {
			return fmt.Errorf("invalid recipient Steam ID")
		}

		// Get balance before transaction
		balanceBefore := sender.CreditBalance

		// Deduct credits from sender
		if err := tx.Model(&sender).Update("credit_balance", gorm.Expr("credit_balance - ?", item.Price)).Error; err != nil {
			return fmt.Errorf("failed to deduct credits: %w", err)
		}

		// Update stock if limited
		if item.StockQuantity > 0 {
			if err := tx.Model(&item).Update("stock_quantity", gorm.Expr("stock_quantity - 1")).Error; err != nil {
				return fmt.Errorf("failed to update stock: %w", err)
			}
		}

		// Create credit transaction record
		description := fmt.Sprintf("Gifted %s to Steam ID: %s", item.ItemName, recipientSteamID)
		creditTransaction := models.CreditTransaction{
			UserID:          senderID,
			Amount:          -item.Price, // Negative for deduction
			TransactionType: "gift",
			Description:     &description,
			BalanceBefore:   balanceBefore,
			BalanceAfter:    balanceBefore - item.Price,
		}
		if err := tx.Create(&creditTransaction).Error; err != nil {
			return fmt.Errorf("failed to create credit transaction: %w", err)
		}

		// Create item transaction record for RCON processing
		actualServerID := uint(1) // Default server
		if serverID != nil {
			actualServerID = *serverID
		}

		transaction := models.Transaction{
			TransactionUUID: uuid.New().String(),
			UserID:          senderID,
			ItemID:          itemID,
			ServerID:        actualServerID,
			Amount:          item.Price,
			Quantity:        1,
			Status:          "pending", // Will be updated when RCON is executed
		}
		if err := tx.Create(&transaction).Error; err != nil {
			return fmt.Errorf("failed to create transaction: %w", err)
		}

		// TODO: Execute RCON command on server for recipient
		// This would require integration with server service to execute the RCON command
		// The RCON command would need to be modified to target the recipient Steam ID

		return nil
	})
}
