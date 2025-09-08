package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type limiterState struct {
	mu          sync.Mutex
	count       int
	windowStart time.Time
}

var (
	generalStore sync.Map
	paymentStore sync.Map
)

func allow(store *sync.Map, key string, limit int, window time.Duration) bool {
	now := time.Now()
	val, _ := store.LoadOrStore(key, &limiterState{windowStart: now})
	state := val.(*limiterState)

	state.mu.Lock()
	defer state.mu.Unlock()

	if now.Sub(state.windowStart) >= window {
		state.windowStart = now
		state.count = 0
	}

	if state.count >= limit {
		return false
	}

	state.count++
	return true
}

func GeneralRateLimiter() gin.HandlerFunc {
	const (
		limit  = 100
		window = time.Minute
	)
	return func(c *gin.Context) {
		key := c.ClientIP()
		if !allow(&generalStore, key, limit, window) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "RATE_LIMIT_EXCEEDED",
					"message": "Too many requests. Please try again later.",
				},
			})
			return
		}
		c.Next()
	}
}

func PaymentRateLimiter() gin.HandlerFunc {
	const (
		limit  = 10
		window = time.Minute
	)
	return func(c *gin.Context) {
		// Prefer user ID if authenticated; otherwise fall back to IP
		if userID, ok := GetUserID(c); ok {
			key := "user:" + fmtUint(userID)
			if !allow(&paymentStore, key, limit, window) {
				c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
					"success": false,
					"error": map[string]interface{}{
						"code":    "PAYMENT_RATE_LIMIT_EXCEEDED",
						"message": "Payment requests are limited. Please try again later.",
					},
				})
				return
			}
			c.Next()
			return
		}

		key := "ip:" + c.ClientIP()
		if !allow(&paymentStore, key, limit, window) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error": map[string]interface{}{
					"code":    "PAYMENT_RATE_LIMIT_EXCEEDED",
					"message": "Payment requests are limited. Please try again later.",
				},
			})
			return
		}
		c.Next()
	}
}

func fmtUint(v uint) string {
	// small helper to avoid importing fmt just for uint to string
	const digits = "0123456789"
	if v == 0 {
		return "0"
	}
	var buf [20]byte
	i := len(buf)
	for v > 0 {
		i--
		buf[i] = digits[v%10]
		v /= 10
	}
	return string(buf[i:])
}
