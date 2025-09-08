package errors

import (
	"fmt"
	"net/http"
	"time"
)

type ErrorType string

const (
	ErrorTypeValidation     ErrorType = "VALIDATION_ERROR"
	ErrorTypeAuthentication ErrorType = "AUTHENTICATION_ERROR"
	ErrorTypeAuthorization  ErrorType = "AUTHORIZATION_ERROR"
	ErrorTypeNotFound       ErrorType = "NOT_FOUND_ERROR"
	ErrorTypeConflict       ErrorType = "CONFLICT_ERROR"
	ErrorTypeInternal       ErrorType = "INTERNAL_ERROR"
	ErrorTypePayment        ErrorType = "PAYMENT_ERROR"
	ErrorTypeRateLimit      ErrorType = "RATE_LIMIT_ERROR"
	ErrorTypeExternal       ErrorType = "EXTERNAL_SERVICE_ERROR"
)

type AppError struct {
	Type      ErrorType   `json:"type"`
	Code      string      `json:"code"`
	Message   string      `json:"message"`
	Details   interface{} `json:"details,omitempty"`
	Timestamp time.Time   `json:"timestamp"`
	RequestID string      `json:"request_id,omitempty"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("[%s] %s: %s", e.Type, e.Code, e.Message)
}

func (e *AppError) HTTPStatus() int {
	switch e.Type {
	case ErrorTypeValidation:
		return http.StatusBadRequest
	case ErrorTypeAuthentication:
		return http.StatusUnauthorized
	case ErrorTypeAuthorization:
		return http.StatusForbidden
	case ErrorTypeNotFound:
		return http.StatusNotFound
	case ErrorTypeConflict:
		return http.StatusConflict
	case ErrorTypePayment:
		return http.StatusPaymentRequired
	case ErrorTypeRateLimit:
		return http.StatusTooManyRequests
	case ErrorTypeExternal:
		return http.StatusServiceUnavailable
	default:
		return http.StatusInternalServerError
	}
}

// Helper functions to create specific errors
func NewValidationError(code, message string, details interface{}) *AppError {
	return &AppError{
		Type:      ErrorTypeValidation,
		Code:      code,
		Message:   message,
		Details:   details,
		Timestamp: time.Now(),
	}
}

func NewAuthenticationError(code, message string) *AppError {
	return &AppError{
		Type:      ErrorTypeAuthentication,
		Code:      code,
		Message:   message,
		Timestamp: time.Now(),
	}
}

func NewAuthorizationError(code, message string) *AppError {
	return &AppError{
		Type:      ErrorTypeAuthorization,
		Code:      code,
		Message:   message,
		Timestamp: time.Now(),
	}
}

func NewNotFoundError(code, message string) *AppError {
	return &AppError{
		Type:      ErrorTypeNotFound,
		Code:      code,
		Message:   message,
		Timestamp: time.Now(),
	}
}

func NewConflictError(code, message string) *AppError {
	return &AppError{
		Type:      ErrorTypeConflict,
		Code:      code,
		Message:   message,
		Timestamp: time.Now(),
	}
}

func NewPaymentError(code, message string, details interface{}) *AppError {
	return &AppError{
		Type:      ErrorTypePayment,
		Code:      code,
		Message:   message,
		Details:   details,
		Timestamp: time.Now(),
	}
}

func NewInternalError(code, message string) *AppError {
	return &AppError{
		Type:      ErrorTypeInternal,
		Code:      code,
		Message:   message,
		Timestamp: time.Now(),
	}
}

func NewExternalServiceError(code, message string, details interface{}) *AppError {
	return &AppError{
		Type:      ErrorTypeExternal,
		Code:      code,
		Message:   message,
		Details:   details,
		Timestamp: time.Now(),
	}
}
