package handlers

import (
	"net/http"
	"strconv"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type SpinWheelHandler struct {
	spinWheelService *services.SpinWheelService
}

func NewSpinWheelHandler(spinWheelService *services.SpinWheelService) *SpinWheelHandler {
	return &SpinWheelHandler{spinWheelService: spinWheelService}
}

func (h *SpinWheelHandler) GetSpinWheelInfo(c *gin.Context) {
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

	info, err := h.spinWheelService.GetSpinWheelInfo(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_INFO",
				"message": "Failed to retrieve spin wheel info",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    info,
	})
}

func (h *SpinWheelHandler) Spin(c *gin.Context) {
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

	result, err := h.spinWheelService.Spin(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "SPIN_FAILED",
				"message": err.Error(),
			},
		})
		return
	}

	if result.Success {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    result,
		})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "SPIN_FAILED",
				"message": result.Message,
			},
		})
	}
}

func (h *SpinWheelHandler) GetSpinHistory(c *gin.Context) {
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

	history, total, err := h.spinWheelService.GetSpinHistory(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_HISTORY",
				"message": "Failed to retrieve spin history",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"spins": history,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}
