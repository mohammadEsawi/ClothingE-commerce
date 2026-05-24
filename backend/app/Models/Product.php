<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name_en',
        'name_ar',
        'slug',
        'description_en',
        'description_ar',
        'base_price',
        'sale_price',
        'is_featured',
        'is_active',
        'views',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'views' => 'integer',
    ];

    protected $appends = ['primary_image_url', 'discount_percentage', 'is_on_sale', 'effective_price'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlistItems(): HasMany
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlist_items');
    }

    public function getPrimaryImageAttribute(): ?ProductImage
    {
        return $this->images->where('is_primary', true)->first()
            ?? $this->images->first();
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        $image = $this->getPrimaryImageAttribute();
        return $image?->image_url;
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->sale_price && $this->base_price > 0) {
            return (int) round((($this->base_price - $this->sale_price) / $this->base_price) * 100);
        }
        return null;
    }

    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->base_price;
    }

    public function getEffectivePriceAttribute(): float
    {
        return $this->is_on_sale ? (float) $this->sale_price : (float) $this->base_price;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name_en', 'like', "%{$search}%")
              ->orWhere('name_ar', 'like', "%{$search}%")
              ->orWhere('description_en', 'like', "%{$search}%")
              ->orWhere('description_ar', 'like', "%{$search}%");
        });
    }

    public function scopeInCategory(Builder $query, string $slug): Builder
    {
        return $query->whereHas('category', function ($q) use ($slug) {
            $q->where('slug', $slug)
              ->orWhere('parent_id', function ($subQ) use ($slug) {
                  $subQ->select('id')->from('categories')->where('slug', $slug);
              });
        });
    }

    public function scopePriceRange(Builder $query, ?float $min, ?float $max): Builder
    {
        if ($min !== null) {
            $query->where('base_price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('base_price', '<=', $max);
        }
        return $query;
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->whereHas('variants', function ($q) {
            $q->where('stock_quantity', '>', 0);
        });
    }

    public function scopeOnSale(Builder $query): Builder
    {
        return $query->whereNotNull('sale_price')
                     ->whereColumn('sale_price', '<', 'base_price');
    }

    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->where('is_approved', true)->avg('rating') ?? 0;
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->where('is_approved', true)->count();
    }
}
