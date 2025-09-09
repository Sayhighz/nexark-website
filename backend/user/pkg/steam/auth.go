package steam

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"time"

	"github.com/go-resty/resty/v2"
)

type SteamUser struct {
	SteamID     string `json:"steamid"`
	Username    string `json:"personaname"`
	DisplayName string `json:"realname"`
	AvatarURL   string `json:"avatarfull"`
	ProfileURL  string `json:"profileurl"`
}

type SteamAPIResponse struct {
	Response struct {
		Players []SteamUser `json:"players"`
	} `json:"response"`
}

type SteamAuth struct {
	apiKey    string
	returnURL string
	realm     string
	client    *resty.Client
}

func NewSteamAuth(apiKey, returnURL string) *SteamAuth {
	// Derive realm (origin) from returnURL as required by Steam OpenID
	realm := returnURL
	if u, err := url.Parse(returnURL); err == nil && u.Scheme != "" && u.Host != "" {
		realm = u.Scheme + "://" + u.Host
	}

	return &SteamAuth{
		apiKey:    apiKey,
		returnURL: returnURL,
		realm:     realm,
		client:    resty.New().SetTimeout(10 * time.Second),
	}
}

func (s *SteamAuth) GetLoginURL() string {
	params := url.Values{}
	params.Set("openid.ns", "http://specs.openid.net/auth/2.0")
	params.Set("openid.mode", "checkid_setup")
	params.Set("openid.return_to", s.returnURL)
	// Steam requires realm to be the origin (scheme + host [+ port]), not the full callback path
	params.Set("openid.realm", s.realm)
	params.Set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select")
	params.Set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select")

	return "https://steamcommunity.com/openid/login?" + params.Encode()
}

func (s *SteamAuth) VerifyCallback(ctx context.Context, r *http.Request) (string, error) {
	// Parse and validate OpenID response
	if err := r.ParseForm(); err != nil {
		return "", fmt.Errorf("failed to parse form: %w", err)
	}

	mode := r.Form.Get("openid.mode")
	if mode != "id_res" {
		return "", fmt.Errorf("invalid openid mode: %s", mode)
	}

	// Extract Steam ID from claimed_id
	claimedID := r.Form.Get("openid.claimed_id")
	steamID, err := s.extractSteamID(claimedID)
	if err != nil {
		return "", fmt.Errorf("failed to extract steam id: %w", err)
	}

	// Verify with Steam
	if err := s.verifyWithSteam(ctx, r.Form); err != nil {
		return "", fmt.Errorf("steam verification failed: %w", err)
	}

	return steamID, nil
}

func (s *SteamAuth) GetUserInfo(ctx context.Context, steamID string) (*SteamUser, error) {
	url := fmt.Sprintf("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s",
		s.apiKey, steamID)

	resp, err := s.client.R().
		SetContext(ctx).
		Get(url)

	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	var apiResp SteamAPIResponse
	if err := json.Unmarshal(resp.Body(), &apiResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if len(apiResp.Response.Players) == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return &apiResp.Response.Players[0], nil
}

func (s *SteamAuth) extractSteamID(claimedID string) (string, error) {
	re := regexp.MustCompile(`https://steamcommunity\.com/openid/id/(\d+)`)
	matches := re.FindStringSubmatch(claimedID)
	if len(matches) != 2 {
		return "", fmt.Errorf("invalid claimed_id format")
	}

	steamID64, err := strconv.ParseUint(matches[1], 10, 64)
	if err != nil {
		return "", fmt.Errorf("invalid steam id: %w", err)
	}

	return fmt.Sprintf("%d", steamID64), nil
}

func (s *SteamAuth) verifyWithSteam(ctx context.Context, params url.Values) error {
	params.Set("openid.mode", "check_authentication")

	resp, err := s.client.R().
		SetContext(ctx).
		SetFormDataFromValues(params).
		Post("https://steamcommunity.com/openid/login")

	if err != nil {
		return fmt.Errorf("verification request failed: %w", err)
	}

	if !regexp.MustCompile(`is_valid\s*:\s*true`).Match(resp.Body()) {
		return fmt.Errorf("steam verification failed")
	}

	return nil
}
