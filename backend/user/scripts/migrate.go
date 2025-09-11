package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

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

	// Prepare SQL executor
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB:", err)
	}

	execSQLFile := func(path string) error {
		content, err := ioutil.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", path, err)
		}

		statements := strings.Split(string(content), ";")
		for _, stmt := range statements {
			stmt = strings.TrimSpace(stmt)
			if stmt == "" {
				continue
			}
			if _, err := sqlDB.Exec(stmt); err != nil {
				log.Printf("Failed to execute statement from %s: %s", path, stmt)
				return fmt.Errorf("failed to execute migration from %s: %w", path, err)
			}
		}
		fmt.Printf("Executed migration: %s\n", path)
		return nil
	}

	// If a specific file is provided, run only that
	if len(os.Args) > 1 {
		migrationPath := os.Args[1]
		if err := execSQLFile(migrationPath); err != nil {
			log.Fatal(err)
		}
		fmt.Println("Migration executed successfully!")
		return
	}

	// Otherwise run all .sql files in migrations directory in lexicographical order
	files, err := ioutil.ReadDir("migrations")
	if err != nil {
		log.Fatal("Failed to read migrations directory:", err)
	}

	var sqlFiles []string
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".sql") {
			sqlFiles = append(sqlFiles, filepath.Join("migrations", f.Name()))
		}
	}
	sort.Strings(sqlFiles)

	for _, f := range sqlFiles {
		if err := execSQLFile(f); err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("All migrations executed successfully!")
}
