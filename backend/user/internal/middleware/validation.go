package middleware

import (
	"fmt"
	"net/http"
	"strconv"

	errors "nexark-user-backend/internal/error"

	"github.com/gin-gonic/gin"
)

// Validate amount parameters
func ValidateAmount(min, max float64) gin.HandlerFunc {
	return func(c *gin.Context) {
		amountStr := c.PostForm("amount")
		if amountStr == "" {
			// Try JSON body
			var body map[string]interface{}
			if err := c.ShouldBindJSON(&body); err == nil {
				if amount, ok := body["amount"]; ok {
					amountStr = fmt.Sprintf("%v", amount)
				}
			}
		}

		if amountStr == "" {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("MISSING_AMOUNT", "Amount is required", nil))
			return
		}

		amount, err := strconv.ParseFloat(amountStr, 64)
		if err != nil {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("INVALID_AMOUNT", "Amount must be a valid number", nil))
			return
		}

		if amount < min {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("AMOUNT_TOO_LOW",
					fmt.Sprintf("Amount must be at least %.2f", min),
					map[string]float64{"minimum": min, "provided": amount}))
			return
		}

		if amount > max {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("AMOUNT_TOO_HIGH",
					fmt.Sprintf("Amount must not exceed %.2f", max),
					map[string]float64{"maximum": max, "provided": amount}))
			return
		}

		c.Set("validated_amount", amount)
		c.Next()
	}
}

// Validate pagination parameters
func ValidatePagination() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Validate limit
		limitStr := c.DefaultQuery("limit", "20")
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 || limit > 100 {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("INVALID_LIMIT",
					"Limit must be between 1 and 100", nil))
			return
		}

		// Validate page
		pageStr := c.DefaultQuery("page", "1")
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("INVALID_PAGE",
					"Page must be a positive integer", nil))
			return
		}

		c.Set("validated_limit", limit)
		c.Set("validated_page", page)
		c.Set("validated_offset", (page-1)*limit)
		c.Next()
	}
}

// Validate UUID parameter
func ValidateUUID(paramName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		uuid := c.Param(paramName)
		if uuid == "" {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("MISSING_UUID",
					fmt.Sprintf("%s is required", paramName), nil))
			return
		}

		// Basic UUID format validation
		if len(uuid) != 36 {
			c.AbortWithError(http.StatusBadRequest,
				errors.NewValidationError("INVALID_UUID_FORMAT",
					fmt.Sprintf("Invalid %s format", paramName), nil))
			return
		}

		c.Next()
	}
}
