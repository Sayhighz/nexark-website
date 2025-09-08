package handlers

import (
	"net/http"

	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"
	"nexark-user-backend/internal/utils"
	"nexark-user-backend/pkg/steam"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	userService *services.UserService
	jwtService  *utils.JWTService
	steamAuth   *steam.SteamAuth
}

func NewAuthHandler(userService *services.UserService, jwtService *utils.JWTService, steamAuth *steam.SteamAuth) *AuthHandler {
	return &AuthHandler{
		userService: userService,
		jwtService:  jwtService,
		steamAuth:   steamAuth,
	}
}

func (h *AuthHandler) GetLoginURL(c *gin.Context) {
	loginURL := h.steamAuth.GetLoginURL()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"login_url": loginURL,
		},
	})
}

func (h *AuthHandler) SteamCallback(c *gin.Context) {
	// Verify Steam callback
	steamID, err := h.steamAuth.VerifyCallback(c.Request.Context(), c.Request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "STEAM_VERIFICATION_FAILED",
				"message": "Failed to verify Steam authentication",
				"details": err.Error(),
			},
		})
		return
	}

	// Authenticate or create user
	user, err := h.userService.AuthenticateWithSteam(c.Request.Context(), steamID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "USER_AUTHENTICATION_FAILED",
				"message": "Failed to authenticate user",
				"details": err.Error(),
			},
		})
		return
	}

	// Generate JWT token
	token, err := h.jwtService.GenerateToken(user.UserID, user.SteamID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "TOKEN_GENERATION_FAILED",
				"message": "Failed to generate authentication token",
			},
		})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"token": token,
			"user": gin.H{
				"user_id":        user.UserID,
				"steam_id":       user.SteamID,
				"username":       user.Username,
				"display_name":   user.DisplayName,
				"avatar_url":     user.AvatarURL,
				"credit_balance": user.CreditBalance,
				"loyalty_points": user.LoyaltyPoints,
			},
		},
	})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
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

	user, err := h.userService.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "USER_NOT_FOUND",
				"message": "User not found",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user": gin.H{
				"user_id":        user.UserID,
				"steam_id":       user.SteamID,
				"username":       user.Username,
				"display_name":   user.DisplayName,
				"avatar_url":     user.AvatarURL,
				"credit_balance": user.CreditBalance,
				"loyalty_points": user.LoyaltyPoints,
				"created_at":     user.CreatedAt,
				"last_login":     user.LastLogin,
			},
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// In a stateless JWT system, logout is handled client-side by removing the token
	// Here we could add the token to a blacklist if needed
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logged out successfully",
	})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
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

	user, err := h.userService.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "USER_NOT_FOUND",
				"message": "User not found",
			},
		})
		return
	}

	// Generate new token
	token, err := h.jwtService.GenerateToken(user.UserID, user.SteamID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": map[string]interface{}{
				"code":    "TOKEN_GENERATION_FAILED",
				"message": "Failed to generate new token",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"token": token,
		},
	})
}
