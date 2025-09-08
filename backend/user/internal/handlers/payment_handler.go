package handlers

import (
	"io"
	"net/http"
	"strconv"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v75/webhook"
)

type PaymentHandler struct {
	paymentService *services.PaymentService
	webhookSecret  string
}

func NewPaymentHandler(paymentService *services.PaymentService, webhookSecret string) *PaymentHandler {
	return &PaymentHandler{
		paymentService: paymentService,
		webhookSecret:  webhookSecret,
	}
}

func (h *PaymentHandler) CreatePaymentIntent(c *gin.Context) {
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

	var req services.CreatePaymentIntentRequest
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

	// Set default currency if not provided
	if req.Currency == "" {
		req.Currency = "thb"
	}

	payment, err := h.paymentService.CreatePaymentIntent(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "PAYMENT_CREATION_FAILED",
				"message": "Failed to create payment intent",
				"details": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"payment_uuid":   payment.PaymentUUID,
			"client_secret":  payment.StripeClientSecret,
			"amount":         payment.Amount,
			"currency":       payment.Currency,
			"payment_method": payment.PaymentMethod,
			"status":         payment.PaymentStatus,
			"expires_at":     payment.ExpiresAt,
		},
	})
}

func (h *PaymentHandler) GetPaymentStatus(c *gin.Context) {
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

	paymentUUID := c.Param("payment_uuid")
	if paymentUUID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "MISSING_PAYMENT_UUID",
				"message": "Payment UUID is required",
			},
		})
		return
	}

	payment, err := h.paymentService.GetPaymentStatus(c.Request.Context(), userID, paymentUUID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "PAYMENT_NOT_FOUND",
				"message": "Payment not found",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"payment_uuid":   payment.PaymentUUID,
			"amount":         payment.Amount,
			"currency":       payment.Currency,
			"payment_method": payment.PaymentMethod,
			"status":         payment.PaymentStatus,
			"created_at":     payment.CreatedAt,
			"confirmed_at":   payment.ConfirmedAt,
			"expires_at":     payment.ExpiresAt,
		},
	})
}

func (h *PaymentHandler) GetPaymentHistory(c *gin.Context) {
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

	payments, total, err := h.paymentService.GetUserPayments(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_PAYMENTS",
				"message": "Failed to retrieve payment history",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"payments": payments,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}

func (h *PaymentHandler) StripeWebhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_BODY",
				"message": "Failed to read request body",
			},
		})
		return
	}

	signature := c.GetHeader("Stripe-Signature")
	event, err := webhook.ConstructEvent(body, signature, h.webhookSecret)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_SIGNATURE",
				"message": "Invalid webhook signature",
			},
		})
		return
	}

	// Process webhook event
	err = h.paymentService.ProcessWebhook(c.Request.Context(), &event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "WEBHOOK_PROCESSING_FAILED",
				"message": "Failed to process webhook",
				"details": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"received": true,
	})
}
