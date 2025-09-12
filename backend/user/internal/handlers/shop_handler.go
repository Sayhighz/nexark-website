package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

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

// BuyItemRequest represents the request payload for buying an item
type BuyItemRequest struct {
	ItemID   uint  `json:"item_id" binding:"required"`
	ServerID *uint `json:"server_id"`
}

// UnmarshalJSON supports both snake_case and camelCase fields for BuyItemRequest
func (r *BuyItemRequest) UnmarshalJSON(data []byte) error {
	type Alias struct {
		ItemID   *uint `json:"item_id"`
		ServerID *uint `json:"server_id"`

		// camelCase fallbacks
		ItemId   *uint `json:"itemId"`
		ServerId *uint `json:"serverId"`
	}
	var a Alias
	if err := json.Unmarshal(data, &a); err != nil {
		return err
	}

	// Resolve item ID
	var id *uint
	if a.ItemID != nil {
		id = a.ItemID
	} else {
		id = a.ItemId
	}
	if id == nil || *id == 0 {
		return fmt.Errorf("item_id is required")
	}
	r.ItemID = *id

	// Resolve optional server ID
	if a.ServerID != nil {
		r.ServerID = a.ServerID
	} else {
		r.ServerID = a.ServerId
	}
	return nil
}

// GiftItemRequest represents the request payload for gifting an item
type GiftItemRequest struct {
	ItemID           uint   `json:"item_id" binding:"required"`
	RecipientSteamID string `json:"recipient_steam_id" binding:"required"`
	ServerID         *uint  `json:"server_id"`
}

// UnmarshalJSON supports both snake_case and camelCase fields for GiftItemRequest
func (r *GiftItemRequest) UnmarshalJSON(data []byte) error {
	type Alias struct {
		ItemID           *uint  `json:"item_id"`
		RecipientSteamID string `json:"recipient_steam_id"`
		ServerID         *uint  `json:"server_id"`

		// camelCase fallbacks
		ItemId           *uint  `json:"itemId"`
		RecipientSteamId string `json:"recipientSteamId"`
		ServerId         *uint  `json:"serverId"`
	}
	var a Alias
	if err := json.Unmarshal(data, &a); err != nil {
		return err
	}

	// Resolve item ID
	var id *uint
	if a.ItemID != nil {
		id = a.ItemID
	} else {
		id = a.ItemId
	}
	if id == nil || *id == 0 {
		return fmt.Errorf("item_id is required")
	}
	r.ItemID = *id

	// Resolve recipient steam id
	steam := a.RecipientSteamID
	if steam == "" {
		steam = a.RecipientSteamId
	}
	if steam == "" {
		return fmt.Errorf("recipient_steam_id is required")
	}
	r.RecipientSteamID = steam

	// Resolve optional server ID
	if a.ServerID != nil {
		r.ServerID = a.ServerID
	} else {
		r.ServerID = a.ServerId
	}

	return nil
}

// BuyItem handles item purchase requests
func (h *ShopHandler) BuyItem(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
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

	var req BuyItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_REQUEST",
				"message": err.Error(),
			},
		})
		return
	}

	err := h.shopService.BuyItem(c.Request.Context(), userID.(uint), req.ItemID, req.ServerID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorCode := "PURCHASE_FAILED"

		msg := err.Error()
		switch {
		case strings.Contains(msg, "item not found"):
			statusCode = http.StatusNotFound
			errorCode = "ITEM_NOT_FOUND"
		case strings.Contains(msg, "out of stock"):
			statusCode = http.StatusBadRequest
			errorCode = "OUT_OF_STOCK"
		case strings.Contains(msg, "insufficient credits"):
			statusCode = http.StatusOK
			errorCode = "INSUFFICIENT_CREDITS"
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    errorCode,
				"message": msg,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Item purchased successfully",
	})
}

// GiftItem handles item gifting requests
func (h *ShopHandler) GiftItem(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
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

	var req GiftItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_REQUEST",
				"message": err.Error(),
			},
		})
		return
	}

	err := h.shopService.GiftItem(c.Request.Context(), userID.(uint), req.ItemID, req.RecipientSteamID, req.ServerID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		errorCode := "GIFT_FAILED"

		msg := err.Error()
		switch {
		case strings.Contains(msg, "item not found"):
			statusCode = http.StatusNotFound
			errorCode = "ITEM_NOT_FOUND"
		case strings.Contains(msg, "out of stock"):
			statusCode = http.StatusBadRequest
			errorCode = "OUT_OF_STOCK"
		case strings.Contains(msg, "insufficient credits"):
			statusCode = http.StatusOK
			errorCode = "INSUFFICIENT_CREDITS"
		case strings.Contains(msg, "invalid recipient Steam ID"):
			statusCode = http.StatusBadRequest
			errorCode = "INVALID_STEAM_ID"
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    errorCode,
				"message": msg,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Item gifted successfully",
	})
}
