package database

import (
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"sort"
	"strings"

	"gorm.io/gorm"
)

// RunMigrations runs all .sql files inside the provided directory in lexicographical order.
// Each file is split by ';' and executed statement-by-statement.
func RunMigrations(db *gorm.DB, dir string) error {
	if dir == "" {
		dir = "migrations"
	}

	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
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
		log.Printf("Executed migration: %s", path)
		return nil
	}

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory %s: %w", dir, err)
	}

	var sqlFiles []string
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".sql") {
			sqlFiles = append(sqlFiles, filepath.Join(dir, f.Name()))
		}
	}
	sort.Strings(sqlFiles)

	for _, f := range sqlFiles {
		if err := execSQLFile(f); err != nil {
			return err
		}
	}

	return nil
}
