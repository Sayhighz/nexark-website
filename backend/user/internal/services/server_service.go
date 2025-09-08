package services

import (
	"context"
	"fmt"
	"log"
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

	// Start server monitoring
	go service.startServerMonitoring()

	return service
}

func (s *ServerService) GetServers(ctx context.Context) ([]models.Server, error) {
	var servers []models.Server
	err := s.db.Find(&servers).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get servers: %w", err)
	}

	return servers, nil
}

func (s *ServerService) GetServerByID(ctx context.Context, serverID uint) (*models.Server, error) {
	var server models.Server
	err := s.db.Where("server_id = ?", serverID).First(&server).Error
	if err != nil {
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

func (s *ServerService) startServerMonitoring() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.monitorServers()
		}
	}
}

func (s *ServerService) monitorServers() {
	var servers []models.Server
	if err := s.db.Find(&servers).Error; err != nil {
		log.Printf("Failed to get servers for monitoring: %v", err)
		return
	}

	for _, server := range servers {
		go s.checkServerStatus(&server)
	}
}

func (s *ServerService) checkServerStatus(server *models.Server) {
	rconClient, err := s.getRCONClient(server)
	if err != nil {
		s.updateServerStatus(server.ServerID, false, 0)
		return
	}

	// Execute listplayers command to get player count and verify connection
	response, err := rconClient.ExecuteCommand("listplayers")
	if err != nil {
		s.updateServerStatus(server.ServerID, false, 0)
		return
	}

	if !response.Success {
		s.updateServerStatus(server.ServerID, false, 0)
		return
	}

	// Parse player count from response (this is ARK-specific)
	playerCount := s.parsePlayerCount(response.Response)
	s.updateServerStatus(server.ServerID, true, playerCount)
}

func (s *ServerService) parsePlayerCount(response string) int {
	// Simple implementation - in real scenario, you'd parse the actual response
	// ARK's listplayers command returns specific format
	// For now, return 0 as placeholder
	return 0
}

func (s *ServerService) updateServerStatus(serverID uint, isOnline bool, playerCount int) {
	now := time.Now()
	updates := map[string]interface{}{
		"is_online":       isOnline,
		"current_players": playerCount,
		"last_ping":       now,
	}

	if err := s.db.Model(&models.Server{}).
		Where("server_id = ?", serverID).
		Updates(updates).Error; err != nil {
		log.Printf("Failed to update server status for server %d: %v", serverID, err)
	}
}

func (s *ServerService) CloseConnections() {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for _, client := range s.rconClients {
		client.Close()
	}
}
