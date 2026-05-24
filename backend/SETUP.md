# Clothing E-commerce API - Setup Guide

## Requirements
- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js (optional, for development)

## Installation Steps

### 1. Install Dependencies
```bash
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database credentials:
```
DB_DATABASE=clothing_ecommerce
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Create Database
```sql
CREATE DATABASE clothing_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Seed the Database
```bash
php artisan db:seed
```

### 6. Create Storage Symlink
```bash
php artisan storage:link
```

### 7. Start the Development Server
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api/v1`

## Default Credentials

| Role    | Email                | Password |
|---------|----------------------|----------|
| Admin   | admin@store.com      | password |
| Customer| ahmad@example.com    | password |

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout (requires token)
- `GET /api/v1/auth/me` - Get current user (requires token)
- `PUT /api/v1/auth/profile` - Update profile (requires token)

### Products (Public)
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/products/{slug}` - Get single product
- `GET /api/v1/products/{id}/reviews` - Get product reviews

### Categories (Public)
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/{slug}/products` - Category products

### Cart (Authentication Required)
- `GET /api/v1/cart` - View cart
- `POST /api/v1/cart` - Add item
- `PUT /api/v1/cart/{id}` - Update quantity
- `DELETE /api/v1/cart/{id}` - Remove item
- `DELETE /api/v1/cart` - Clear cart

### Orders (Authentication Required)
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Place order
- `GET /api/v1/orders/{id}` - Order details
- `DELETE /api/v1/orders/{id}` - Cancel order

### Admin (Admin Role Required)
All admin endpoints use prefix `/api/v1/admin/`

## Product Filtering

```
GET /api/v1/products?category=t-shirts&color=1,2&size=3&min_price=50&max_price=200&on_sale=true&featured=true&search=polo&sort=price_asc&per_page=20
```

Sort options: `latest`, `oldest`, `price_asc`, `price_desc`, `popular`, `rating`

## Request Headers
```
Accept: application/json
Authorization: Bearer {token}
X-Locale: ar  (for Arabic responses)
```

## Response Format
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": {},
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

## Coupon Codes (Pre-seeded)
- `SAVE10` - 10% off (no minimum)
- `WELCOME20` - 20 ILS off (min 100 ILS)
- `SUMMER15` - 15% off (min 150 ILS, max 80 ILS, 3 months)
- `FLASH50` - 50 ILS off (min 250 ILS)
- `FREESHIP` - 25 ILS off shipping (min 50 ILS)
