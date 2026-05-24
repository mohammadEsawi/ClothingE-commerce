<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'discount_amount',
        'shipping_cost',
        'total',
        'coupon_id',
        'shipping_address',
        'notes',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'shipping_address' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateOrderNumber(): string
    {
        $year = date('Y');
        $lastOrder = static::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $nextNumber = $lastOrder
            ? (int) substr($lastOrder->order_number, -6) + 1
            : 1;

        return 'ORD-' . $year . '-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    public function isCancelled(): bool
    {
        return in_array($this->status, ['cancelled', 'refunded']);
    }
}
