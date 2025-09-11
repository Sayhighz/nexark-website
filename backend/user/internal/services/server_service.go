package services

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"

	"nexark-user-backend/internal/models"
	"nexark-user-backend/pkg/rcon"

	"gorm.io/gorm"
)

type ServerService struct {
	db          *gorm.DB
	rconClients map[uint]*rcon.RCONClient
	mutex       sync.RWMutex
}

func NewServerService(db *gorm.DB) *ServerService {
	service := &ServerService{
		db:          db,
		rconClients: make(map[uint]*rcon.RCONClient),
	}

	// Server status monitoring disabled per requirements

	return service
}

func (s *ServerService) GetServers(ctx context.Context) ([]models.Server, error) {
	var servers []models.Server
	err := s.db.Select("*").Find(&servers).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get servers: %w", err)
	}

	return servers, nil
}

func (s *ServerService) GetServerByID(ctx context.Context, serverID uint) (*models.Server, error) {
	var server models.Server
	err := s.db.Where("server_id = ?", serverID).
		Select("server_id, server_name, server_type, ip_address, port, rcon_port, rcon_password, is_online, current_players, max_players, last_ping, details").
		First(&server).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("server not found")
		}
		return nil, fmt.Errorf("failed to get server: %w", err)
	}

	return &server, nil
}

func (s *ServerService) GetServerByIdentifier(ctx context.Context, identifier string) (*models.Server, error) {
	// Try numeric ID first
	if id, err := strconv.ParseUint(identifier, 10, 32); err == nil {
		return s.GetServerByID(ctx, uint(id))
	}

	// Support slugs and friendly names: x25 -> server_id 1, x100 -> server_id 2
	key := strings.ToLower(strings.TrimSpace(identifier))
	var server models.Server

	switch key {
	case "x25", "25", "ark x25", "x25-pvp", "x25pvp":
		// Prefer explicit mapping to ID 1 if exists
		if err := s.db.Select("*").Where("server_id = ?", 1).First(&server).Error; err == nil {
			return &server, nil
		}
		// Fallback by name containing x25
		if err := s.db.Select("*").Where("server_name LIKE ?", "%x25%").First(&server).Error; err == nil {
			return &server, nil
		}
	case "x100", "100", "ark x100", "x100-pvp", "x100pvp":
		if err := s.db.Select("*").Where("server_id = ?", 2).First(&server).Error; err == nil {
			return &server, nil
		}
		if err := s.db.Select("*").Where("server_name LIKE ?", "%x100%").First(&server).Error; err == nil {
			return &server, nil
		}
	}

	// Fallback to exact server_name
	if err := s.db.Select("*").Where("server_name = ?", identifier).First(&server).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("server not found")
		}
		return nil, fmt.Errorf("failed to get server: %w", err)
	}

	return &server, nil
}

func (s *ServerService) GetServerDisplayInfo(ctx context.Context, serverID uint, categoryKey string) ([]models.ServerDisplayInfo, error) {
	var displayInfo []models.ServerDisplayInfo

	query := s.db.Where("server_id = ?", serverID).
		Preload("Category").
		Order("display_order ASC")

	if categoryKey != "" {
		query = query.Joins("JOIN server_display_categories ON server_display_info.category_id = server_display_categories.category_id").
			Where("server_display_categories.category_key = ? AND server_display_categories.is_active = ?", categoryKey, true)
	}

	err := query.Find(&displayInfo).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get server display info: %w", err)
	}

	return displayInfo, nil
}

func (s *ServerService) GetDisplayCategories(ctx context.Context) ([]models.ServerDisplayCategory, error) {
	var categories []models.ServerDisplayCategory
	err := s.db.Where("is_active = ?", true).
		Order("display_order ASC").
		Find(&categories).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get display categories: %w", err)
	}

	return categories, nil
}

func (s *ServerService) ExecuteRCONCommand(ctx context.Context, serverID uint, command string) (*rcon.RCONResponse, error) {
	server, err := s.GetServerByID(ctx, serverID)
	if err != nil {
		return nil, err
	}

	rconClient, err := s.getRCONClient(server)
	if err != nil {
		return nil, fmt.Errorf("failed to get RCON client: %w", err)
	}

	response, err := rconClient.ExecuteCommand(command)
	if err != nil {
		return nil, fmt.Errorf("failed to execute RCON command: %w", err)
	}

	// Log command execution
	s.logRCONCommand(serverID, command, response, "system")

	return response, nil
}

func (s *ServerService) getRCONClient(server *models.Server) (*rcon.RCONClient, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	client, exists := s.rconClients[server.ServerID]
	if !exists || !client.IsConnected() {
		client = rcon.NewRCONClient(
			server.IPAddress,
			fmt.Sprintf("%d", server.RCONPort),
			server.RCONPassword,
		)

		if err := client.Connect(); err != nil {
			return nil, fmt.Errorf("failed to connect to RCON: %w", err)
		}

		s.rconClients[server.ServerID] = client
	}

	return client, nil
}

func (s *ServerService) logRCONCommand(serverID uint, command string, response *rcon.RCONResponse, context string) {
	status := "success"
	if !response.Success {
		status = "failed"
	}

	commandLog := models.RCONCommandHistory{
		ServerID:         serverID,
		Command:          command,
		Response:         &response.Response,
		Status:           status,
		ExecutionContext: context,
		ExecutedAt:       time.Now(),
	}

	if err := s.db.Create(&commandLog).Error; err != nil {
		log.Printf("Failed to log RCON command: %v", err)
	}
}

/*
Server status monitoring code removed per requirements:
- startServerMonitoring
- monitorServers
- checkServerStatus
- parsePlayerCount
- updateServerStatus
*/

func (s *ServerService) CloseConnections() {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for _, client := range s.rconClients {
		client.Close()
	}
}
