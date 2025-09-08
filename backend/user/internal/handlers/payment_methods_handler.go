package handlers

import (
	"net/http"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type PaymentMethodsHandler struct {
	paymentService *services.PaymentService
}

func NewPaymentMethodsHandler(paymentService *services.PaymentService) *PaymentMethodsHandler {
	return &PaymentMethodsHandler{paymentService: paymentService}
}

type AddPaymentMethodRequest struct {
	PaymentMethodID string `json:"payment_method_id" binding:"required"`
	SetAsDefault    bool   `json:"set_as_default"`
}

type SetDefaultRequest struct {
	PaymentMethodID string `json:"payment_method_id" binding:"required"`
}

func (h *PaymentMethodsHandler) GetPaymentMethods(c *gin.Context) {
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

	methods, err := h.paymentService.GetUserPaymentMethods(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_PAYMENT_METHODS",
				"message": "Failed to retrieve payment methods",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"payment_methods": methods,
		},
	})
}

func (h *PaymentMethodsHandler) AddPaymentMethod(c *gin.Context) {
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

	var req AddPaymentMethodRequest
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

	method, err := h.paymentService.AddPaymentMethod(
		c.Request.Context(), userID, req.PaymentMethodID, req.SetAsDefault)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "ADD_PAYMENT_METHOD_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"payment_method": method,
		},
		"message": "Payment method added successfully",
	})
}

func (h *PaymentMethodsHandler) SetDefaultPaymentMethod(c *gin.Context) {
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

	var req SetDefaultRequest
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

	err := h.paymentService.SetDefaultPaymentMethod(
		c.Request.Context(), userID, req.PaymentMethodID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "SET_DEFAULT_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Default payment method updated successfully",
	})
}

func (h *PaymentMethodsHandler) RemovePaymentMethod(c *gin.Context) {
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

	paymentMethodID := c.Param("payment_method_id")
	if paymentMethodID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "MISSING_PAYMENT_METHOD_ID",
				"message": "Payment method ID is required",
			},
		})
		return
	}

	err := h.paymentService.RemovePaymentMethod(c.Request.Context(), userID, paymentMethodID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "REMOVE_PAYMENT_METHOD_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Payment method removed successfully",
	})
}

func (h *PaymentMethodsHandler) ValidatePaymentMethod(c *gin.Context) {
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

	paymentMethodID := c.Param("payment_method_id")
	if paymentMethodID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "MISSING_PAYMENT_METHOD_ID",
				"message": "Payment method ID is required",
			},
		})
		return
	}

	err := h.paymentService.ValidatePaymentMethod(c.Request.Context(), userID, paymentMethodID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "VALIDATION_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Payment method is valid",
	})
}
