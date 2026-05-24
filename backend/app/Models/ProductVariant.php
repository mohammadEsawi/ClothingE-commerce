<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'color_id',
        'size_id',
        'sku',
        'price_override',
        'stock_quantity',
        'low_stock_threshold',
        'status',
    ];

    protected $casts = [
        'price_override' => 'decimal:2',
        'stock_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
    ];

    protected $appends = ['effective_price'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function inventoryAlerts(): HasMany
    {
        return $this->hasMany(InventoryAlert::class);
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->stock_quantity <= 0) {
            return 'out_of_stock';
        }
        if ($this->stock_quantity <= $this->low_stock_threshold) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    public function getEffectivePriceAttribute(): float
    {
        if ($this->price_override !== null) {
            return (float) $this->price_override;
        }
        return $this->product ? (float) $this->product->effective_price : 0;
    }

    public function decreaseStock(int $quantity): void
    {
        $this->stock_quantity = max(0, $this->stock_quantity - $quantity);
        $this->updateStockStatus();
        $this->save();

        $this->createInventoryAlertIfNeeded();
    }

    public function increaseStock(int $quantity): void
    {
        $this->stock_quantity += $quantity;
        $this->updateStockStatus();
        $this->save();
    }

    private function updateStockStatus(): void
    {
        if ($this->stock_quantity <= 0) {
            $this->status = 'out_of_stock';
        } elseif ($this->stock_quantity <= $this->low_stock_threshold) {
            $this->status = 'low_stock';
        } else {
            $this->status = 'in_stock';
        }
    }

    private function createInventoryAlertIfNeeded(): void
    {
        $alertType = null;

        if ($this->stock_quantity <= 0) {
            $alertType = 'out_of_stock';
        } elseif ($this->stock_quantity <= $this->low_stock_threshold) {
            $alertType = 'low_stock';
        }

        if ($alertType) {
            InventoryAlert::create([
                'product_variant_id' => $this->id,
                'type' => $alertType,
                'is_read' => false,
            ]);
        }
    }
}
