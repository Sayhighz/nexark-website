package middleware

import (
	"fmt"
	"log"
	"net/http"
	"time"

	errors "nexark-user-backend/internal/error"

	"github.com/gin-gonic/gin"
)

type ErrorLogger interface {
	LogError(err error, c *gin.Context)
}

type SimpleErrorLogger struct{}

func (l *SimpleErrorLogger) LogError(err error, c *gin.Context) {
	log.Printf("Error: %v | Method: %s | Path: %s | IP: %s",
		err, c.Request.Method, c.Request.URL.Path, c.ClientIP())
}

func ErrorHandler(logger ErrorLogger) gin.HandlerFunc {
	if logger == nil {
		logger = &SimpleErrorLogger{}
	}

	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors
		if len(c.Errors) == 0 {
			return
		}

		// Get the last error
		lastError := c.Errors.Last()
		err := lastError.Err

		// Log the error
		logger.LogError(err, c)

		// Handle different error types
		switch e := err.(type) {
		case *errors.AppError:
			// Set request ID if available
			if requestID := c.GetString("request_id"); requestID != "" {
				e.RequestID = requestID
			}

			c.JSON(e.HTTPStatus(), gin.H{
				"success": false,
				"error":   e,
			})
		default:
			// Handle unknown errors
			appErr := &errors.AppError{
				Type:      errors.ErrorTypeInternal,
				Code:      "INTERNAL_SERVER_ERROR",
				Message:   "An unexpected error occurred",
				Timestamp: errors.NewInternalError("", "").Timestamp,
			}

			if requestID := c.GetString("request_id"); requestID != "" {
				appErr.RequestID = requestID
			}

			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   appErr,
			})
		}
	}
}

// Helper middleware to set request ID
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}

		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)
		c.Next()
	}
}

func generateRequestID() string {
	// Simple implementation - you might want to use a UUID library
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
