package handlers

import (
	"net/http"
	"strings"

	"nexark-user-backend/internal/models"
	"nexark-user-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ServerHandler struct {
	serverService *services.ServerService
}

func NewServerHandler(serverService *services.ServerService) *ServerHandler {
	return &ServerHandler{serverService: serverService}
}

func (h *ServerHandler) GetServers(c *gin.Context) {
	servers, err := h.serverService.GetServers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_SERVERS",
				"message": "Failed to retrieve servers",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"servers": servers,
		},
	})
}

func (h *ServerHandler) GetServerByID(c *gin.Context) {
	serverIDStr := c.Param("server_id")
	server, err := h.serverService.GetServerByIdentifier(c.Request.Context(), serverIDStr)
	if err != nil {
		if err.Error() == "server not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "SERVER_NOT_FOUND",
					"message": "Server not found",
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_SERVER",
				"message": "Failed to retrieve server",
			},
		})
		return
	}

	// Localize server details using details_i18n if present
	lang := getLang(c)
	localizeServerDetails(server, lang)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"server": server,
		},
	})
}

func (h *ServerHandler) GetServerDisplayInfo(c *gin.Context) {
	serverIDStr := c.Param("server_id")
	server, err := h.serverService.GetServerByIdentifier(c.Request.Context(), serverIDStr)
	if err != nil {
		if err.Error() == "server not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "SERVER_NOT_FOUND",
					"message": "Server not found",
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_SERVER",
				"message": "Failed to retrieve server",
			},
		})
		return
	}

	categoryKey := c.Query("category")

	displayInfo, err := h.serverService.GetServerDisplayInfo(c.Request.Context(), server.ServerID, categoryKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_DISPLAY_INFO",
				"message": "Failed to retrieve server display info",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"display_info": displayInfo,
		},
	})
}

func (h *ServerHandler) GetDisplayCategories(c *gin.Context) {
	categories, err := h.serverService.GetDisplayCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "FAILED_TO_GET_CATEGORIES",
				"message": "Failed to retrieve display categories",
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

// getLang resolves language preference with precedence: ?lang query > Accept-Language header; supported: en, th
func getLang(c *gin.Context) string {
	lang := strings.ToLower(strings.TrimSpace(c.Query("lang")))
	if lang == "" {
		al := strings.ToLower(c.GetHeader("Accept-Language"))
		if strings.HasPrefix(al, "th") {
			lang = "th"
		} else {
			lang = "en"
		}
	}
	if lang != "th" {
		return "en"
	}
	return "th"
}

// localizeServerDetails picks localized JSON from DetailsI18n into Details for response compatibility
func localizeServerDetails(server *models.Server, lang string) {
	if server == nil || server.DetailsI18n == nil {
		return
	}
	if v, ok := server.DetailsI18n[lang]; ok && v != nil {
		// Expect map[string]interface{}, but handle robustly
		switch vv := v.(type) {
		case map[string]interface{}:
			server.Details = models.JSONMap(vv)
		default:
			// leave as is if unexpected type
		}
	}
}
