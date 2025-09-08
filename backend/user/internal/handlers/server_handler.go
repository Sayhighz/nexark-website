package handlers

import (
	"net/http"
	"strconv"

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
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_SERVER_ID",
				"message": "Invalid server ID",
			},
		})
		return
	}

	server, err := h.serverService.GetServerByID(c.Request.Context(), uint(serverID))
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

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"server": server,
		},
	})
}

func (h *ServerHandler) GetServerDisplayInfo(c *gin.Context) {
	serverIDStr := c.Param("server_id")
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "INVALID_SERVER_ID",
				"message": "Invalid server ID",
			},
		})
		return
	}

	categoryKey := c.Query("category")

	displayInfo, err := h.serverService.GetServerDisplayInfo(c.Request.Context(), uint(serverID), categoryKey)
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
