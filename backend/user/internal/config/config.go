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

func Load() (*Config, error) {
	_ = godotenv.Load()

	redisDB, _ := strconv.Atoi(os.Getenv("REDIS_DB"))

	return &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Mode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "3306"),
			User:     getEnv("DB_USER", "root"),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", "nexark_user"),
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
			APIKey:    getEnv("STEAM_API_KEY", ""),
			ReturnURL: getEnv("STEAM_RETURN_URL", ""),
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
	}, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
