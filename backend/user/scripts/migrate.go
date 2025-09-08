package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"nexark-user-backend/internal/config"
	"nexark-user-backend/pkg/database"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Connect to database
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

	// Read and execute migration file
	migrationPath := "migrations/001_initial_schema.sql"
	if len(os.Args) > 1 {
		migrationPath = os.Args[1]
	}

	content, err := ioutil.ReadFile(migrationPath)
	if err != nil {
		log.Fatal("Failed to read migration file:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB:", err)
	}

	_, err = sqlDB.Exec(string(content))
	if err != nil {
		log.Fatal("Failed to execute migration:", err)
	}

	fmt.Println("Migration executed successfully!")
}
