package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	Steam    SteamConfig
	Stripe   StripeConfig
	ARK      ARKConfig
	External ExternalConfig
}

type ServerConfig struct {
	Port string
	Mode string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret string
}

type SteamConfig struct {
	APIKey    string
	ReturnURL string
}

type StripeConfig struct {
	SecretKey      string
	PublishableKey string
	WebhookSecret  string
}

type ARKConfig struct {
	X25Host          string
	X25RCONPort      string
	X25RCONPassword  string
	X100Host         string
	X100RCONPort     string
	X100RCONPassword string
}

type ExternalConfig struct {
	FrontendURL string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	redisDB, _ := strconv.Atoi(os.Getenv("REDIS_DB"))

	return &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Mode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "49.231.43.118"),
			Port:     getEnv("DB_PORT", "3306"),
			User:     getEnv("DB_USER", "arkdb"),
			Password: getEnv("DB_PASSWORD", "0819897031!Sayhi"),
			Name:     getEnv("DB_NAME", "nex_web_test"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       redisDB,
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "your-secret-key"),
		},
		Steam: SteamConfig{
			APIKey:    getEnv("STEAM_API_KEY", "419A2278919B043A7048FC33C81B6DDE"),
			ReturnURL: getEnv("STEAM_RETURN_URL", "http://localhost:8080/api/v1/auth/steam/callback"),
		},
		Stripe: StripeConfig{
			SecretKey:      getEnv("STRIPE_SECRET_KEY", ""),
			PublishableKey: getEnv("STRIPE_PUBLISHABLE_KEY", ""),
			WebhookSecret:  getEnv("STRIPE_WEBHOOK_SECRET", ""),
		},
		ARK: ARKConfig{
			X25Host:          getEnv("ARK_X25_HOST", "127.0.0.1"),
			X25RCONPort:      getEnv("ARK_X25_RCON_PORT", "27020"),
			X25RCONPassword:  getEnv("ARK_X25_RCON_PASSWORD", ""),
			X100Host:         getEnv("ARK_X100_HOST", "127.0.0.1"),
			X100RCONPort:     getEnv("ARK_X100_RCON_PORT", "27021"),
			X100RCONPassword: getEnv("ARK_X100_RCON_PASSWORD", ""),
		},
		External: ExternalConfig{
			FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
		},
	}, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
