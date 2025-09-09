package main

import (
	"fmt"
	"log"
	"time"

	"nexark-user-backend/internal/config"
	"nexark-user-backend/internal/handlers"
	"nexark-user-backend/internal/middleware"
	"nexark-user-backend/internal/services"
	"nexark-user-backend/internal/utils"
	"nexark-user-backend/pkg/database"
	"nexark-user-backend/pkg/steam"
	"nexark-user-backend/pkg/stripe"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Set Gin mode
	gin.SetMode(cfg.Server.Mode)

	// Initialize database
	db, err := database.NewMySQL(database.DatabaseConfig{
		Host:     cfg.Database.Host,
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		Name:     cfg.Database.Name,
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Redis initialization skipped for testing

	// Initialize core services
	jwtService := utils.NewJWTService(cfg.JWT.Secret)
	steamAuth := steam.NewSteamAuth(cfg.Steam.APIKey, cfg.Steam.ReturnURL)
	stripeService := stripe.NewStripeService(cfg.Stripe.SecretKey, cfg.Stripe.WebhookSecret)

	// Initialize business services
	userService := services.NewUserService(db, steamAuth, stripeService)
	paymentService := services.NewPaymentService(db, stripeService, userService)
	creditService := services.NewCreditService(db, userService, paymentService)
	shopService := services.NewShopService(db)
	serverService := services.NewServerService(db)
	transactionService := services.NewTransactionService(db, serverService, userService)

	// Initialize Priority 2 services
	loyaltyService := services.NewLoyaltyService(db, userService)
	spinWheelService := services.NewSpinWheelService(db, loyaltyService, creditService)
	dailyRewardsService := services.NewDailyRewardsService(db, loyaltyService, creditService)
	// jobService := services.NewJobService(db) // TODO: Implement job service usage

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userService, jwtService, steamAuth, cfg.External.FrontendURL)
	paymentHandler := handlers.NewPaymentHandler(paymentService, cfg.Stripe.WebhookSecret)
	creditHandler := handlers.NewCreditHandler(creditService)
	paymentMethodsHandler := handlers.NewPaymentMethodsHandler(paymentService)
	shopHandler := handlers.NewShopHandler(shopService)
	serverHandler := handlers.NewServerHandler(serverService)
	transactionHandler := handlers.NewTransactionHandler(transactionService)

	// Initialize Priority 2 handlers
	loyaltyHandler := handlers.NewLoyaltyHandler(loyaltyService)
	spinWheelHandler := handlers.NewSpinWheelHandler(spinWheelService)
	dailyRewardsHandler := handlers.NewDailyRewardsHandler(dailyRewardsService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtService)

	// Setup routes
	router := setupRoutes(
		authHandler,
		paymentHandler,
		creditHandler,
		paymentMethodsHandler,
		shopHandler,
		serverHandler,
		transactionHandler,
		loyaltyHandler,
		spinWheelHandler,
		dailyRewardsHandler,
		authMiddleware,
	)

	// Start server
	port := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("Starting Nexark User API server on port %s", port)
	log.Printf("Features enabled: Authentication, Payments, Shop, Gamification, Content Management")

	if err := router.Run(port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func setupRoutes(
	authHandler *handlers.AuthHandler,
	paymentHandler *handlers.PaymentHandler,
	creditHandler *handlers.CreditHandler,
	paymentMethodsHandler *handlers.PaymentMethodsHandler,
	shopHandler *handlers.ShopHandler,
	serverHandler *handlers.ServerHandler,
	transactionHandler *handlers.TransactionHandler,
	loyaltyHandler *handlers.LoyaltyHandler,
	spinWheelHandler *handlers.SpinWheelHandler,
	dailyRewardsHandler *handlers.DailyRewardsHandler,
	authMiddleware *middleware.AuthMiddleware,
) *gin.Engine {
	router := gin.New()

	// Global middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.RequestID())
	router.Use(middleware.GeneralRateLimiter())
	router.Use(middleware.ErrorHandler(nil))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"service":   "nexark-user-api",
			"version":   "2.0.0",
			"features":  []string{"auth", "payments", "shop", "gamification", "jobs"},
			"timestamp": time.Now(),
		})
	})

	// API version 1
	v1 := router.Group("/api/v1")

	// ==========================================
	// AUTHENTICATION ROUTES
	// ==========================================
	auth := v1.Group("/auth")
	{
		auth.GET("/steam/login", authHandler.GetLoginURL)
		auth.GET("/steam/callback", authHandler.SteamCallback)
		auth.POST("/logout", authMiddleware.RequireAuth(), authHandler.Logout)
		auth.GET("/profile", authMiddleware.RequireAuth(), authHandler.GetProfile)
		auth.POST("/refresh", authMiddleware.RequireAuth(), authHandler.RefreshToken)
	}

	// ==========================================
	// SERVER MANAGEMENT ROUTES
	// ==========================================
	servers := v1.Group("/servers")
	{
		servers.GET("/", serverHandler.GetServers)
		servers.GET("/:server_id", serverHandler.GetServerByID)
		servers.GET("/:server_id/info", serverHandler.GetServerDisplayInfo)
		servers.GET("/categories", serverHandler.GetDisplayCategories)
	}

	// ==========================================
	// PAYMENT ROUTES
	// ==========================================
	payments := v1.Group("/payments")
	payments.Use(middleware.PaymentRateLimiter())
	{
		// Payment intent creation and management
		payments.POST("/create-intent", authMiddleware.RequireAuth(), paymentHandler.CreatePaymentIntent)
		payments.GET("/:payment_uuid/status", authMiddleware.RequireAuth(), paymentHandler.GetPaymentStatus)
		payments.GET("/history", authMiddleware.RequireAuth(), middleware.ValidatePagination(), paymentHandler.GetPaymentHistory)

		// Stripe webhook (no auth required)
		payments.POST("/webhook", paymentHandler.StripeWebhook)
	}

	// ==========================================
	// CREDIT MANAGEMENT ROUTES
	// ==========================================
	credits := v1.Group("/credits")
	credits.Use(authMiddleware.RequireAuth())
	{
		credits.GET("/balance", creditHandler.GetBalance)
		credits.GET("/summary", creditHandler.GetSummary)
		credits.POST("/topup", middleware.PaymentRateLimiter(), middleware.ValidateAmount(100, 50000), creditHandler.TopUp)
		credits.GET("/transactions", middleware.ValidatePagination(), creditHandler.GetTransactions)
		credits.POST("/transfer", creditHandler.TransferCredits)
	}

	// ==========================================
	// PAYMENT METHODS ROUTES
	// ==========================================
	paymentMethods := v1.Group("/payment-methods")
	paymentMethods.Use(authMiddleware.RequireAuth())
	{
		paymentMethods.GET("/", paymentMethodsHandler.GetPaymentMethods)
		paymentMethods.POST("/", paymentMethodsHandler.AddPaymentMethod)
		paymentMethods.PUT("/default", paymentMethodsHandler.SetDefaultPaymentMethod)
		paymentMethods.DELETE("/:payment_method_id", paymentMethodsHandler.RemovePaymentMethod)
		paymentMethods.GET("/:payment_method_id/validate", paymentMethodsHandler.ValidatePaymentMethod)
	}

	// ==========================================
	// TRANSACTION ROUTES
	// ==========================================
	transactions := v1.Group("/transactions")
	transactions.Use(authMiddleware.RequireAuth())
	{
		transactions.POST("/purchase", transactionHandler.ProcessPurchase)
		transactions.GET("/", middleware.ValidatePagination(), transactionHandler.GetUserTransactions)
		transactions.GET("/:transaction_uuid", middleware.ValidateUUID("transaction_uuid"), transactionHandler.GetTransactionByID)
	}

	// ==========================================
	// SHOP ROUTES
	// ==========================================
	shop := v1.Group("/shop")
	{
		// Public routes (no auth required)
		shop.GET("/categories", shopHandler.GetCategories)
		shop.GET("/items", middleware.ValidatePagination(), shopHandler.GetItems)
		shop.GET("/items/:item_id", shopHandler.GetItemByID)
	}

	// ==========================================
	// SHOPPING CART ROUTES
	// ==========================================
	cart := v1.Group("/cart")
	cart.Use(authMiddleware.RequireAuth())
	{
		cart.POST("/add", shopHandler.AddToCart)
		cart.GET("/", shopHandler.GetCart)
		cart.PUT("/:cart_id", shopHandler.UpdateCartItem)
		cart.DELETE("/:cart_id", shopHandler.RemoveFromCart)
	}

	// ==========================================
	// GAMIFICATION ROUTES (NEW)
	// ==========================================

	// Loyalty Points
	loyalty := v1.Group("/loyalty")
	loyalty.Use(authMiddleware.RequireAuth())
	{
		loyalty.GET("/balance", loyaltyHandler.GetPointsBalance)
		loyalty.GET("/history", middleware.ValidatePagination(), loyaltyHandler.GetPointsHistory)
	}

	// Spin Wheel
	games := v1.Group("/games")
	games.Use(authMiddleware.RequireAuth())
	{
		// Spin Wheel
		games.GET("/spin", spinWheelHandler.GetSpinWheelInfo)
		games.POST("/spin", spinWheelHandler.Spin)
		games.GET("/spin/history", middleware.ValidatePagination(), spinWheelHandler.GetSpinHistory)

		// Daily Rewards
		games.GET("/daily", dailyRewardsHandler.GetDailyRewardInfo)
		games.POST("/daily/claim", dailyRewardsHandler.ClaimDailyReward)
		games.GET("/daily/history", middleware.ValidatePagination(), dailyRewardsHandler.GetRewardHistory)
	}

	// ==========================================
	// CONTENT MANAGEMENT ROUTES - DISABLED
	// ==========================================
	// News/Announcements/Content endpoints removed per requirements.

	// ==========================================
	// ACCOUNT ROUTES (Enhanced)
	// ==========================================
	account := v1.Group("/account")
	account.Use(authMiddleware.RequireAuth())
	{
		// Profile management
		account.GET("/profile", authHandler.GetProfile)

		// Credit-related endpoints
		account.GET("/credits", creditHandler.GetBalance)
		account.GET("/credits/summary", creditHandler.GetSummary)
		account.GET("/credits/transactions", middleware.ValidatePagination(), creditHandler.GetTransactions)

		// Payment-related endpoints
		account.GET("/payments", middleware.ValidatePagination(), paymentHandler.GetPaymentHistory)
		account.GET("/payment-methods", paymentMethodsHandler.GetPaymentMethods)

		// Transaction history
		account.GET("/transactions", middleware.ValidatePagination(), transactionHandler.GetUserTransactions)

		// Gamification endpoints (NEW)
		account.GET("/points", loyaltyHandler.GetPointsBalance)
		account.GET("/points/history", middleware.ValidatePagination(), loyaltyHandler.GetPointsHistory)

		// Dashboard summary
		account.GET("/dashboard", func(c *gin.Context) {
			// TODO: Create dashboard summary handler
			c.JSON(200, gin.H{
				"message": "Dashboard summary endpoint - to be implemented",
			})
		})
	}

	// ==========================================
	// ADMIN ROUTES (Future expansion)
	// ==========================================
	admin := v1.Group("/admin")
	admin.Use(authMiddleware.RequireAuth()) // Will need admin role check later
	{
		// Placeholder for admin-only endpoints
		admin.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Admin routes available but not implemented yet",
			})
		})
	}

	// ==========================================
	// API DOCUMENTATION ROUTE (Updated)
	// ==========================================
	v1.GET("/docs", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"api_version": "2.0.0",
			"service":     "nexark-user-api",
			"description": "Nexark ARK Server Management System - User API",
			"features": []string{
				"Steam OAuth Authentication",
				"Stripe Payment Processing",
				"Credit Management System",
				"Shopping & Cart System",
				"Gamification (Loyalty Points, Spin Wheel, Daily Rewards)",
				"Background Job Processing",
			},
			"endpoints": gin.H{
				"authentication": []string{
					"GET /api/v1/auth/steam/login",
					"GET /api/v1/auth/steam/callback",
					"POST /api/v1/auth/logout",
					"GET /api/v1/auth/profile",
					"POST /api/v1/auth/refresh",
				},
				"servers": []string{
					"GET /api/v1/servers",
					"GET /api/v1/servers/:id",
					"GET /api/v1/servers/:id/info",
					"GET /api/v1/servers/categories",
				},
				"payments": []string{
					"POST /api/v1/payments/create-intent",
					"GET /api/v1/payments/:uuid/status",
					"GET /api/v1/payments/history",
					"POST /api/v1/payments/webhook",
				},
				"credits": []string{
					"GET /api/v1/credits/balance",
					"GET /api/v1/credits/summary",
					"POST /api/v1/credits/topup",
					"GET /api/v1/credits/transactions",
					"POST /api/v1/credits/transfer",
				},
				"payment_methods": []string{
					"GET /api/v1/payment-methods",
					"POST /api/v1/payment-methods",
					"PUT /api/v1/payment-methods/default",
					"DELETE /api/v1/payment-methods/:id",
					"GET /api/v1/payment-methods/:id/validate",
				},
				"shop": []string{
					"GET /api/v1/shop/categories",
					"GET /api/v1/shop/items",
					"GET /api/v1/shop/items/:id",
				},
				"cart": []string{
					"POST /api/v1/cart/add",
					"GET /api/v1/cart",
					"PUT /api/v1/cart/:id",
					"DELETE /api/v1/cart/:id",
				},
				"transactions": []string{
					"POST /api/v1/transactions/purchase",
					"GET /api/v1/transactions",
					"GET /api/v1/transactions/:uuid",
				},
				"gamification": []string{
					"GET /api/v1/loyalty/balance",
					"GET /api/v1/loyalty/history",
					"GET /api/v1/games/spin",
					"POST /api/v1/games/spin",
					"GET /api/v1/games/spin/history",
					"GET /api/v1/games/daily",
					"POST /api/v1/games/daily/claim",
					"GET /api/v1/games/daily/history",
				},
				"account": []string{
					"GET /api/v1/account/profile",
					"GET /api/v1/account/credits",
					"GET /api/v1/account/payments",
					"GET /api/v1/account/transactions",
					"GET /api/v1/account/points",
					"GET /api/v1/account/dashboard",
				},
			},
			"rate_limits": gin.H{
				"general":      "100 requests per minute",
				"payments":     "10 requests per minute",
				"gamification": "Limited by cooldowns (spin wheel: 24h, daily rewards: 24h)",
			},
			"authentication": gin.H{
				"type":   "Steam OAuth + JWT",
				"header": "Authorization: Bearer {token}",
			},
		})
	})

	return router
}
