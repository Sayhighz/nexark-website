package handlers

import (
	"net/http"
	"strconv"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	transactionService *services.TransactionService
}

func NewTransactionHandler(transactionService *services.TransactionService) *TransactionHandler {
	return &TransactionHandler{transactionService: transactionService}
}

func (h *TransactionHandler) ProcessPurchase(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "UNAUTHORIZED",
				"message": "User not authenticated",
			},
		})
		return
	}

	var req services.PurchaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_REQUEST",
				"message": "Invalid request data",
				"details": err.Error(),
			},
		})
		return
	}

	response, err := h.transactionService.ProcessPurchase(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "PURCHASE_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    response,
	})
}

func (h *TransactionHandler) GetUserTransactions(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "UNAUTHORIZED",
				"message": "User not authenticated",
			},
		})
		return
	}

	// Parse pagination parameters
	limitStr := c.DefaultQuery("limit", "20")
	pageStr := c.DefaultQuery("page", "1")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	transactions, total, err := h.transactionService.GetUserTransactions(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_TRANSACTIONS",
				"message": "Failed to retrieve transactions",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"transactions": transactions,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}

func (h *TransactionHandler) GetTransactionByID(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "UNAUTHORIZED",
				"message": "User not authenticated",
			},
		})
		return
	}

	transactionUUID := c.Param("transaction_uuid")
	if transactionUUID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "MISSING_TRANSACTION_UUID",
				"message": "Transaction UUID is required",
			},
		})
		return
	}

	transaction, err := h.transactionService.GetTransactionByID(c.Request.Context(), userID, transactionUUID)
	if err != nil {
		if err.Error() == "transaction not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "TRANSACTION_NOT_FOUND",
					"message": "Transaction not found",
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_TRANSACTION",
				"message": "Failed to retrieve transaction",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"transaction": transaction,
		},
	})
}
