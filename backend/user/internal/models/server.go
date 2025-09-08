package models

import "time"

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
}

func (Server) TableName() string {
	return "servers"
}

type ServerDisplayCategory struct {
	CategoryID   uint   `gorm:"primaryKey;column:category_id" json:"category_id"`
	CategoryName string `gorm:"column:category_name" json:"category_name"`
	CategoryKey  string `gorm:"uniqueIndex;column:category_key" json:"category_key"`
	DisplayOrder int    `gorm:"column:display_order;default:0" json:"display_order"`
	IsActive     bool   `gorm:"column:is_active;default:true" json:"is_active"`
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
