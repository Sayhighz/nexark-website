package rcon

import (
	"encoding/binary"
	"fmt"
	"net"
	"time"
)

const (
	// RCON packet types
	SERVERDATA_AUTH           = 3
	SERVERDATA_EXECCOMMAND    = 2
	SERVERDATA_AUTH_RESPONSE  = 2
	SERVERDATA_RESPONSE_VALUE = 0
)

type RCONClient struct {
	conn          net.Conn
	host          string
	port          string
	password      string
	timeout       time.Duration
	authenticated bool
	requestID     int32
}

type RCONPacket struct {
	Size  int32
	ID    int32
	Type  int32
	Body  string
	Empty byte
}

type RCONResponse struct {
	Success  bool   `json:"success"`
	Response string `json:"response"`
	Error    string `json:"error,omitempty"`
}

func NewRCONClient(host, port, password string) *RCONClient {
	return &RCONClient{
		host:      host,
		port:      port,
		password:  password,
		timeout:   10 * time.Second,
		requestID: 1,
	}
}

func (r *RCONClient) Connect() error {
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%s", r.host, r.port), r.timeout)
	if err != nil {
		return fmt.Errorf("failed to connect to RCON server: %w", err)
	}

	r.conn = conn
	return r.authenticate()
}

func (r *RCONClient) authenticate() error {
	packet := &RCONPacket{
		ID:   r.getNextRequestID(),
		Type: SERVERDATA_AUTH,
		Body: r.password,
	}

	if err := r.sendPacket(packet); err != nil {
		return fmt.Errorf("failed to send auth packet: %w", err)
	}

	// Read auth response
	response, err := r.readPacket()
	if err != nil {
		return fmt.Errorf("failed to read auth response: %w", err)
	}

	if response.ID != packet.ID {
		return fmt.Errorf("authentication failed: invalid response ID")
	}

	r.authenticated = true
	return nil
}

func (r *RCONClient) ExecuteCommand(command string) (*RCONResponse, error) {
	if !r.authenticated {
		return nil, fmt.Errorf("not authenticated")
	}

	packet := &RCONPacket{
		ID:   r.getNextRequestID(),
		Type: SERVERDATA_EXECCOMMAND,
		Body: command,
	}

	if err := r.sendPacket(packet); err != nil {
		return &RCONResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to send command: %v", err),
		}, err
	}

	response, err := r.readPacket()
	if err != nil {
		return &RCONResponse{
			Success: false,
			Error:   fmt.Sprintf("failed to read response: %v", err),
		}, err
	}

	return &RCONResponse{
		Success:  true,
		Response: response.Body,
	}, nil
}

func (r *RCONClient) sendPacket(packet *RCONPacket) error {
	packet.Size = int32(len(packet.Body) + 10) // 4 + 4 + len(body) + 1 + 1

	if err := binary.Write(r.conn, binary.LittleEndian, packet.Size); err != nil {
		return err
	}
	if err := binary.Write(r.conn, binary.LittleEndian, packet.ID); err != nil {
		return err
	}
	if err := binary.Write(r.conn, binary.LittleEndian, packet.Type); err != nil {
		return err
	}
	if _, err := r.conn.Write([]byte(packet.Body)); err != nil {
		return err
	}
	if err := binary.Write(r.conn, binary.LittleEndian, byte(0)); err != nil {
		return err
	}
	if err := binary.Write(r.conn, binary.LittleEndian, byte(0)); err != nil {
		return err
	}

	return nil
}

func (r *RCONClient) readPacket() (*RCONPacket, error) {
	var size, id, packetType int32

	if err := binary.Read(r.conn, binary.LittleEndian, &size); err != nil {
		return nil, err
	}
	if err := binary.Read(r.conn, binary.LittleEndian, &id); err != nil {
		return nil, err
	}
	if err := binary.Read(r.conn, binary.LittleEndian, &packetType); err != nil {
		return nil, err
	}

	bodySize := size - 10
	body := make([]byte, bodySize)
	if _, err := r.conn.Read(body); err != nil {
		return nil, err
	}

	// Remove null terminators
	bodyStr := string(body[:len(body)-2])

	return &RCONPacket{
		Size: size,
		ID:   id,
		Type: packetType,
		Body: bodyStr,
	}, nil
}

func (r *RCONClient) getNextRequestID() int32 {
	r.requestID++
	return r.requestID
}

func (r *RCONClient) Close() error {
	if r.conn != nil {
		return r.conn.Close()
	}
	return nil
}

func (r *RCONClient) IsConnected() bool {
	return r.conn != nil && r.authenticated
}
