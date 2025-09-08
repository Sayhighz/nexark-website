package models

import "time"

type ItemCategory struct {
	CategoryID   uint    `gorm:"primaryKey;column:category_id" json:"category_id"`
	CategoryName string  `gorm:"column:category_name" json:"category_name"`
	Description  *string `gorm:"column:description" json:"description"`
	IconURL      *string `gorm:"column:icon_url" json:"icon_url"`
	DisplayOrder int     `gorm:"column:display_order;default:0" json:"display_order"`
	IsActive     bool    `gorm:"column:is_active;default:true" json:"is_active"`
}

func (ItemCategory) TableName() string {
	return "item_categories"
}

type Item struct {
	ItemID        uint      `gorm:"primaryKey;column:item_id" json:"item_id"`
	CategoryID    uint      `gorm:"column:category_id" json:"category_id"`
	ItemName      string    `gorm:"column:item_name" json:"item_name"`
	ItemCode      string    `gorm:"column:item_code" json:"item_code"`
	Description   *string   `gorm:"column:description" json:"description"`
	Price         float64   `gorm:"column:price" json:"price"`
	RCONCommand   string    `gorm:"column:rcon_command" json:"rcon_command"`
	ImageURL      *string   `gorm:"column:image_url" json:"image_url"`
	StockQuantity int       `gorm:"column:stock_quantity;default:-1" json:"stock_quantity"`
	IsFeatured    bool      `gorm:"column:is_featured;default:false" json:"is_featured"`
	IsActive      bool      `gorm:"column:is_active;default:true" json:"is_active"`
	CreatedAt     time.Time `gorm:"column:created_at" json:"created_at"`
	CreatedBy     *uint     `gorm:"column:created_by" json:"created_by"`

	// Relations
	Category ItemCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
}

func (Item) TableName() string {
	return "items"
}

type ShoppingCart struct {
	CartID    uint      `gorm:"primaryKey;column:cart_id" json:"cart_id"`
	UserID    uint      `gorm:"column:user_id" json:"user_id"`
	ItemID    uint      `gorm:"column:item_id" json:"item_id"`
	Quantity  int       `gorm:"column:quantity;default:1" json:"quantity"`
	ServerID  uint      `gorm:"column:server_id" json:"server_id"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`

	// Relations
	User   User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Item   Item   `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	Server Server `gorm:"foreignKey:ServerID" json:"server,omitempty"`
}

func (ShoppingCart) TableName() string {
	return "shopping_cart"
}
