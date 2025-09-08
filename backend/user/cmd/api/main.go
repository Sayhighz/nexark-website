package main

import (
	"fmt"
	"log"

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

	// Initialize services
	jwtService := utils.NewJWTService(cfg.JWT.Secret)
	steamAuth := steam.NewSteamAuth(cfg.Steam.APIKey, cfg.Steam.ReturnURL)
	stripeService := stripe.NewStripeService(cfg.Stripe.SecretKey, cfg.Stripe.WebhookSecret)

	// Initialize business services
	userService := services.NewUserService(db, steamAuth, stripeService)
	paymentService := services.NewPaymentService(db, stripeService, userService)
	shopService := services.NewShopService(db)
	serverService := services.NewServerService(db)                                       // ใหม่
	transactionService := services.NewTransactionService(db, serverService, userService) // ใหม่

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userService, jwtService, steamAuth)
	paymentHandler := handlers.NewPaymentHandler(paymentService, cfg.Stripe.WebhookSecret)
	shopHandler := handlers.NewShopHandler(shopService)
	serverHandler := handlers.NewServerHandler(serverService)                // ใหม่
	transactionHandler := handlers.NewTransactionHandler(transactionService) // ใหม่

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtService)

	// Setup routes
	router := setupRoutes(authHandler, paymentHandler, shopHandler, serverHandler, transactionHandler, authMiddleware)

	// Start server
	port := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("Starting server on port %s", port)
	if err := router.Run(port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func setupRoutes(
	authHandler *handlers.AuthHandler,
	paymentHandler *handlers.PaymentHandler,
	shopHandler *handlers.ShopHandler,
	serverHandler *handlers.ServerHandler,
	transactionHandler *handlers.TransactionHandler,
	authMiddleware *middleware.AuthMiddleware,
) *gin.Engine {
	router := gin.New()

	// Middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.GeneralRateLimiter())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "nexark-user-api",
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")

	// Authentication routes
	auth := v1.Group("/auth")
	{
		auth.GET("/steam/login", authHandler.GetLoginURL)
		auth.GET("/steam/callback", authHandler.SteamCallback)
		auth.POST("/logout", authMiddleware.RequireAuth(), authHandler.Logout)
		auth.GET("/profile", authMiddleware.RequireAuth(), authHandler.GetProfile)
		auth.POST("/refresh", authMiddleware.RequireAuth(), authHandler.RefreshToken)
	}

	// Server routes ใหม่
	servers := v1.Group("/servers")
	{
		servers.GET("/", serverHandler.GetServers)
		servers.GET("/:server_id", serverHandler.GetServerByID)
		servers.GET("/:server_id/info", serverHandler.GetServerDisplayInfo)
		servers.GET("/categories", serverHandler.GetDisplayCategories)
	}

	// Payment routes
	payments := v1.Group("/payments")
	payments.Use(middleware.PaymentRateLimiter())
	{
		payments.POST("/create-intent", authMiddleware.RequireAuth(), paymentHandler.CreatePaymentIntent)
		payments.GET("/:payment_uuid/status", authMiddleware.RequireAuth(), paymentHandler.GetPaymentStatus)
		payments.GET("/history", authMiddleware.RequireAuth(), paymentHandler.GetPaymentHistory)
		payments.POST("/webhook", paymentHandler.StripeWebhook)
	}

	// Transaction routes ใหม่
	transactions := v1.Group("/transactions")
	transactions.Use(authMiddleware.RequireAuth())
	{
		transactions.POST("/purchase", transactionHandler.ProcessPurchase)
		transactions.GET("/", transactionHandler.GetUserTransactions)
		transactions.GET("/:transaction_uuid", transactionHandler.GetTransactionByID)
	}

	// Shop routes
	shop := v1.Group("/shop")
	{
		shop.GET("/categories", shopHandler.GetCategories)
		shop.GET("/items", shopHandler.GetItems)
		shop.GET("/items/:item_id", shopHandler.GetItemByID)
	}

	// Cart routes (require authentication)
	cart := v1.Group("/cart")
	cart.Use(authMiddleware.RequireAuth())
	{
		cart.POST("/add", shopHandler.AddToCart)
		cart.GET("/", shopHandler.GetCart)
		cart.PUT("/:cart_id", shopHandler.UpdateCartItem)
		cart.DELETE("/:cart_id", shopHandler.RemoveFromCart)
	}

	return router
}
