package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// JSONMap is a custom type for handling JSON data from database
type JSONMap map[string]interface{}

// Value implements the driver.Valuer interface for database storage
func (j JSONMap) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface for database retrieval
func (j *JSONMap) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return fmt.Errorf("cannot scan %T into JSONMap", value)
	}

	if len(bytes) == 0 {
		*j = nil
		return nil
	}

	return json.Unmarshal(bytes, j)
}

// MarshalJSON implements the json.Marshaler interface
func (j JSONMap) MarshalJSON() ([]byte, error) {
	if j == nil {
		return []byte("null"), nil
	}
	return json.Marshal(map[string]interface{}(j))
}

type Server struct {
	ServerID       uint       `gorm:"primaryKey;column:server_id" json:"server_id"`
	ServerName     string     `gorm:"column:server_name" json:"server_name"`
	ServerType     string     `gorm:"column:server_type" json:"server_type"`
	IPAddress      string     `gorm:"column:ip_address" json:"ip_address"`
	Port           int        `gorm:"column:port" json:"port"`
	RCONPort       int        `gorm:"column:rcon_port" json:"rcon_port"`
	RCONPassword   string     `gorm:"column:rcon_password" json:"-"`
	IsOnline       bool       `gorm:"column:is_online;default:false" json:"is_online"`
	CurrentPlayers int        `gorm:"column:current_players;default:0" json:"current_players"`
	MaxPlayers     int        `gorm:"column:max_players;default:70" json:"max_players"`
	LastPing       *time.Time `gorm:"column:last_ping" json:"last_ping"`
	Details        JSONMap    `gorm:"column:details;type:json" json:"details,omitempty"`
	DetailsI18n    JSONMap    `gorm:"column:details_i18n;type:json" json:"details_i18n,omitempty"`
}

func (Server) TableName() string {
	return "servers"
}

type ServerDisplayCategory struct {
	CategoryID   uint    `gorm:"primaryKey;column:category_id" json:"category_id"`
	CategoryName string  `gorm:"column:category_name" json:"category_name"`
	CategoryKey  string  `gorm:"uniqueIndex;column:category_key" json:"category_key"`
	DisplayOrder int     `gorm:"column:display_order;default:0" json:"display_order"`
	IsActive     bool    `gorm:"column:is_active;default:true" json:"is_active"`
	Details      JSONMap `gorm:"column:details;type:json" json:"details,omitempty"`
}

func (ServerDisplayCategory) TableName() string {
	return "server_display_categories"
}

type ServerDisplayInfo struct {
	InfoID       uint      `gorm:"primaryKey;column:info_id" json:"info_id"`
	ServerID     uint      `gorm:"column:server_id" json:"server_id"`
	CategoryID   uint      `gorm:"column:category_id" json:"category_id"`
	InfoKey      string    `gorm:"column:info_key" json:"info_key"`
	InfoValue    string    `gorm:"column:info_value" json:"info_value"`
	Description  *string   `gorm:"column:description" json:"description"`
	DisplayOrder int       `gorm:"column:display_order;default:0" json:"display_order"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
	UpdatedBy    *uint     `gorm:"column:updated_by" json:"updated_by"`

	// Relations
	Server   Server                `gorm:"foreignKey:ServerID" json:"server,omitempty"`
	Category ServerDisplayCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
}

type RCONCommandHistory struct {
	CommandID        uint      `gorm:"primaryKey;column:command_id" json:"command_id"`
	ServerID         uint      `gorm:"column:server_id" json:"server_id"`
	Command          string    `gorm:"column:command" json:"command"`
	Response         *string   `gorm:"column:response" json:"response"`
	Status           string    `gorm:"column:status" json:"status"`
	ExecutedBy       *uint     `gorm:"column:executed_by" json:"executed_by"`
	ExecutionContext string    `gorm:"column:execution_context" json:"execution_context"`
	ExecutedAt       time.Time `gorm:"column:executed_at" json:"executed_at"`

	// Relations
	Server Server `gorm:"foreignKey:ServerID" json:"server,omitempty"`
}

func (RCONCommandHistory) TableName() string {
	return "rcon_command_history"
}

func (ServerDisplayInfo) TableName() string {
	return "server_display_info"
}
