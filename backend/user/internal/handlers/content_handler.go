package handlers

import (
	"net/http"
	"strconv"

	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ContentHandler struct {
	contentService *services.ContentService
}

func NewContentHandler(contentService *services.ContentService) *ContentHandler {
	return &ContentHandler{contentService: contentService}
}

func (h *ContentHandler) GetNews(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "20")
	pageStr := c.DefaultQuery("page", "1")
	featuredStr := c.Query("featured")
	search := c.Query("search")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	// Parse filters
	filters := services.NewsFilters{
		Search: search,
	}

	if featuredStr != "" {
		featured := featuredStr == "true"
		filters.Featured = &featured
	}

	news, total, err := h.contentService.GetNews(c.Request.Context(), filters, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_NEWS",
				"message": "Failed to retrieve news",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"news": news,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}

func (h *ContentHandler) GetNewsByID(c *gin.Context) {
	newsIDStr := c.Param("news_id")
	newsID, err := strconv.ParseUint(newsIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_NEWS_ID",
				"message": "Invalid news ID",
			},
		})
		return
	}

	news, err := h.contentService.GetNewsByID(c.Request.Context(), uint(newsID))
	if err != nil {
		if err.Error() == "news not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "NEWS_NOT_FOUND",
					"message": "News article not found",
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_NEWS",
				"message": "Failed to retrieve news article",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"news": news,
		},
	})
}

func (h *ContentHandler) GetFeaturedNews(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 20 {
		limit = 5
	}

	news, err := h.contentService.GetFeaturedNews(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_FEATURED_NEWS",
				"message": "Failed to retrieve featured news",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"news": news,
		},
	})
}

func (h *ContentHandler) GetLatestNews(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 20 {
		limit = 10
	}

	news, err := h.contentService.GetLatestNews(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_LATEST_NEWS",
				"message": "Failed to retrieve latest news",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"news": news,
		},
	})
}

func (h *ContentHandler) GetAnnouncements(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "20")
	pageStr := c.DefaultQuery("page", "1")
	announcementType := c.Query("type")
	activeStr := c.Query("active")
	onlyActiveStr := c.DefaultQuery("only_active", "true")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	// Parse filters
	filters := services.AnnouncementFilters{
		Type:       announcementType,
		OnlyActive: onlyActiveStr == "true",
	}

	if activeStr != "" {
		active := activeStr == "true"
		filters.Active = &active
	}

	announcements, total, err := h.contentService.GetAnnouncements(c.Request.Context(), filters, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_ANNOUNCEMENTS",
				"message": "Failed to retrieve announcements",
			},
		})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"announcements": announcements,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       total,
				"total_pages": totalPages,
			},
		},
	})
}

func (h *ContentHandler) GetActiveAnnouncements(c *gin.Context) {
	announcements, err := h.contentService.GetActiveAnnouncements(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_ACTIVE_ANNOUNCEMENTS",
				"message": "Failed to retrieve active announcements",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"announcements": announcements,
		},
	})
}

func (h *ContentHandler) SearchContent(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "MISSING_QUERY",
				"message": "Search query is required",
			},
		})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	pageStr := c.DefaultQuery("page", "1")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 50 {
		limit = 10
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	results, err := h.contentService.SearchContent(c.Request.Context(), query, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "SEARCH_FAILED",
				"message": "Failed to search content",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    results,
	})
}

func (h *ContentHandler) GetContentSummary(c *gin.Context) {
	summary, err := h.contentService.GetContentSummary(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_SUMMARY",
				"message": "Failed to retrieve content summary",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    summary,
	})
}
