package handlers

import (
	"net/http"
	"strconv"

	"nexark-user-backend/internal/models"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ShopHandler struct {
	shopService *services.ShopService
}

func NewShopHandler(shopService *services.ShopService) *ShopHandler {
	return &ShopHandler{shopService: shopService}
}

func (h *ShopHandler) GetCategories(c *gin.Context) {
	categories, err := h.shopService.GetCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_CATEGORIES",
				"message": "Failed to retrieve categories",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"categories": categories,
		},
	})
}

func (h *ShopHandler) GetItems(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "20")
	pageStr := c.DefaultQuery("page", "1")
	categoryIDStr := c.Query("category_id")
	featuredStr := c.DefaultQuery("featured", "false")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit
	featured := featuredStr == "true"

	var items []models.Item
	var total int64

	if categoryIDStr != "" {
		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "INVALID_CATEGORY_ID",
					"message": "Invalid category ID",
				},
			})
			return
		}

		items, total, err = h.shopService.GetItemsByCategory(c.Request.Context(), uint(categoryID), limit, offset)
	} else {
		items, total, err = h.shopService.GetAllItems(c.Request.Context(), limit, offset, featured)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_ITEMS",
				"message": "Failed to retrieve items",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"items": items,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}

func (h *ShopHandler) GetItemByID(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	itemID, err := strconv.ParseUint(itemIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_ITEM_ID",
				"message": "Invalid item ID",
			},
		})
		return
	}

	item, err := h.shopService.GetItemByID(c.Request.Context(), uint(itemID))
	if err != nil {
		if err.Error() == "item not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "ITEM_NOT_FOUND",
					"message": "Item not found",
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_ITEM",
				"message": "Failed to retrieve item",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"item": item,
		},
	})
}
