package services

import (
	"context"
	"fmt"
	"time"

	"nexark-user-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionService struct {
	db            *gorm.DB
	serverService *ServerService
	userService   *UserService
}

func NewTransactionService(db *gorm.DB, serverService *ServerService, userService *UserService) *TransactionService {
	return &TransactionService{
		db:            db,
		serverService: serverService,
		userService:   userService,
	}
}

type PurchaseRequest struct {
	Items []PurchaseItem `json:"items" binding:"required"`
}

type PurchaseItem struct {
	ItemID   uint `json:"item_id" binding:"required"`
	Quantity int  `json:"quantity" binding:"required,min=1"`
	ServerID uint `json:"server_id" binding:"required"`
}

type PurchaseResponse struct {
	TransactionID string                    `json:"transaction_id"`
	Status        string                    `json:"status"`
	TotalAmount   float64                   `json:"total_amount"`
	Items         []TransactionItemResponse `json:"items"`
	Message       string                    `json:"message"`
}

type TransactionItemResponse struct {
	ItemName       string `json:"item_name"`
	Quantity       int    `json:"quantity"`
	ServerName     string `json:"server_name"`
	DeliveryStatus string `json:"delivery_status"`
}

func (s *TransactionService) ProcessPurchase(ctx context.Context, userID uint, req PurchaseRequest) (*PurchaseResponse, error) {
	// Start database transaction
	return s.processPurchaseTransaction(ctx, userID, req)
}

func (s *TransactionService) processPurchaseTransaction(ctx context.Context, userID uint, req PurchaseRequest) (*PurchaseResponse, error) {
	var totalAmount float64
	var transactions []*models.Transaction

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// Get user and check balance
		user, err := s.userService.GetUserByID(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to get user: %w", err)
		}

		// Process each item
		for _, purchaseItem := range req.Items {
			// Get item details
			var item models.Item
			if err := tx.Where("item_id = ? AND is_active = ?", purchaseItem.ItemID, true).
				Preload("Category").First(&item).Error; err != nil {
				return fmt.Errorf("item %d not found or inactive", purchaseItem.ItemID)
			}

			// Check stock
			if item.StockQuantity != -1 && item.StockQuantity < purchaseItem.Quantity {
				return fmt.Errorf("insufficient stock for item %s", item.ItemName)
			}

			// Get server details
			_, err := s.serverService.GetServerByID(ctx, purchaseItem.ServerID)
			if err != nil {
				return fmt.Errorf("server %d not found", purchaseItem.ServerID)
			}

			// Calculate item total
			itemTotal := item.Price * float64(purchaseItem.Quantity)
			totalAmount += itemTotal

			// Create transaction record
			transaction := &models.Transaction{
				TransactionUUID: uuid.New().String(),
				UserID:          userID,
				ItemID:          purchaseItem.ItemID,
				ServerID:        purchaseItem.ServerID,
				Amount:          itemTotal,
				Quantity:        purchaseItem.Quantity,
				Status:          "pending",
			}

			if err := tx.Create(transaction).Error; err != nil {
				return fmt.Errorf("failed to create transaction: %w", err)
			}

			transactions = append(transactions, transaction)

			// Update stock if limited
			if item.StockQuantity != -1 {
				if err := tx.Model(&item).
					Update("stock_quantity", gorm.Expr("stock_quantity - ?", purchaseItem.Quantity)).Error; err != nil {
					return fmt.Errorf("failed to update stock: %w", err)
				}
			}
		}

		// Check if user has sufficient balance
		if user.CreditBalance < totalAmount {
			return fmt.Errorf("insufficient credit balance. Required: %.2f, Available: %.2f",
				totalAmount, user.CreditBalance)
		}

		// Deduct credits from user
		err = s.userService.UpdateCreditBalance(
			ctx,
			userID,
			-totalAmount,
			"purchase",
			fmt.Sprintf("Purchase of %d items", len(req.Items)),
			nil,
			&transactions[0].TransactionID,
		)
		if err != nil {
			return fmt.Errorf("failed to deduct credits: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Process RCON commands asynchronously
	go s.processRCONCommands(transactions)

	// Prepare response
	response := &PurchaseResponse{
		TransactionID: transactions[0].TransactionUUID,
		Status:        "processing",
		TotalAmount:   totalAmount,
		Message:       "Purchase completed successfully. Items are being delivered.",
	}

	// Add item details to response
	for _, transaction := range transactions {
		var item models.Item
		var server models.Server

		s.db.Where("item_id = ?", transaction.ItemID).First(&item)
		s.db.Where("server_id = ?", transaction.ServerID).First(&server)

		response.Items = append(response.Items, TransactionItemResponse{
			ItemName:       item.ItemName,
			Quantity:       transaction.Quantity,
			ServerName:     server.ServerName,
			DeliveryStatus: "processing",
		})
	}

	return response, nil
}

func (s *TransactionService) processRCONCommands(transactions []*models.Transaction) {
	for _, transaction := range transactions {
		s.processTransactionRCON(transaction)
	}
}

func (s *TransactionService) processTransactionRCON(transaction *models.Transaction) {
	// Update transaction status to processing
	s.updateTransactionStatus(transaction.TransactionID, "processing", nil)

	// Get item and server details
	var item models.Item
	var server models.Server

	if err := s.db.Where("item_id = ?", transaction.ItemID).First(&item).Error; err != nil {
		reason := fmt.Sprintf("Failed to get item details: %v", err)
		s.updateTransactionStatus(transaction.TransactionID, "failed", &reason)
		return
	}

	if err := s.db.Where("server_id = ?", transaction.ServerID).First(&server).Error; err != nil {
		reason := fmt.Sprintf("Failed to get server details: %v", err)
		s.updateTransactionStatus(transaction.TransactionID, "failed", &reason)
		return
	}

	// Prepare RCON command with quantity
	command := item.RCONCommand
	if transaction.Quantity > 1 {
		command = fmt.Sprintf("%s %d", command, transaction.Quantity)
	}

	// Execute RCON command
	response, err := s.serverService.ExecuteRCONCommand(
		context.Background(),
		transaction.ServerID,
		command,
	)

	if err != nil {
		reason := fmt.Sprintf("RCON execution failed: %v", err)
		s.updateTransactionStatus(transaction.TransactionID, "failed", &reason)
		return
	}

	if !response.Success {
		reason := fmt.Sprintf("RCON command failed: %s", response.Error)
		s.updateTransactionStatus(transaction.TransactionID, "failed", &reason)
		return
	}

	// Update transaction with success
	now := time.Now()
	updates := map[string]interface{}{
		"status":            "completed",
		"rcon_command_sent": command,
		"rcon_response":     response.Response,
		"completed_at":      now,
	}

	if err := s.db.Model(&models.Transaction{}).
		Where("transaction_id = ?", transaction.TransactionID).
		Updates(updates).Error; err != nil {
		fmt.Printf("Failed to update transaction status: %v\n", err)
	}
}

func (s *TransactionService) updateTransactionStatus(transactionID uint, status string, failureReason *string) {
	updates := map[string]interface{}{
		"status": status,
	}

	if failureReason != nil {
		updates["failure_reason"] = *failureReason
	}

	if status == "completed" {
		updates["completed_at"] = time.Now()
	}

	if err := s.db.Model(&models.Transaction{}).
		Where("transaction_id = ?", transactionID).
		Updates(updates).Error; err != nil {
		fmt.Printf("Failed to update transaction status: %v\n", err)
	}
}

func (s *TransactionService) GetUserTransactions(ctx context.Context, userID uint, limit, offset int) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	// Get total count
	if err := s.db.Model(&models.Transaction{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Get transactions with relations
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Preload("Item").
		Preload("Item.Category").
		Preload("Server").
		Find(&transactions).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get transactions: %w", err)
	}

	return transactions, total, nil
}

func (s *TransactionService) GetTransactionByID(ctx context.Context, userID uint, transactionUUID string) (*models.Transaction, error) {
	var transaction models.Transaction
	err := s.db.Where("transaction_uuid = ? AND user_id = ?", transactionUUID, userID).
		Preload("Item").
		Preload("Item.Category").
		Preload("Server").
		First(&transaction).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("transaction not found")
		}
		return nil, fmt.Errorf("failed to get transaction: %w", err)
	}

	return &transaction, nil
}
