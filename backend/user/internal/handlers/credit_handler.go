package handlers

import (
	"net/http"
	"strconv"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type CreditHandler struct {
	creditService *services.CreditService
}

func NewCreditHandler(creditService *services.CreditService) *CreditHandler {
	return &CreditHandler{creditService: creditService}
}

func (h *CreditHandler) GetBalance(c *gin.Context) {
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

	balance, err := h.creditService.GetCreditBalance(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_BALANCE",
				"message": "Failed to retrieve credit balance",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

func (h *CreditHandler) TopUp(c *gin.Context) {
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

	var req services.TopUpRequest
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

	payment, checkoutURL, err := h.creditService.TopUpCredits(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "TOPUP_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"payment_uuid":   payment.PaymentUUID,
			"checkout_url":   checkoutURL,
			"amount":         payment.Amount,
			"currency":       payment.Currency,
			"payment_method": payment.PaymentMethod,
			"status":         payment.PaymentStatus,
			"expires_at":     payment.ExpiresAt,
		},
	})
}

func (h *CreditHandler) GetTransactions(c *gin.Context) {
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
	transactionType := c.Query("type")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	transactions, total, err := h.creditService.GetCreditTransactions(
		c.Request.Context(), userID, limit, offset, transactionType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_TRANSACTIONS",
				"message": "Failed to retrieve credit transactions",
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

func (h *CreditHandler) TransferCredits(c *gin.Context) {
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

	var req services.TransferRequest
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

	// Prevent self-transfer
	if req.ToUserID == userID {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_TRANSFER",
				"message": "Cannot transfer credits to yourself",
			},
		})
		return
	}

	err := h.creditService.TransferCredits(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "TRANSFER_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Credit transfer completed successfully",
	})
}

func (h *CreditHandler) GetSummary(c *gin.Context) {
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

	summary, err := h.creditService.GetCreditSummary(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_SUMMARY",
				"message": "Failed to retrieve credit summary",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    summary,
	})
}
