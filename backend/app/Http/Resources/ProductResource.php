<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $inStock = false;
        if ($this->relationLoaded('variants')) {
            $inStock = $this->variants->sum('stock_quantity') > 0;
        }

        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'description_en' => $this->description_en,
            'description_ar' => $this->description_ar,
            'base_price' => $this->base_price,
            'sale_price' => $this->sale_price,
            'effective_price' => $this->effective_price,
            'is_on_sale' => $this->is_on_sale,
            'discount_percentage' => $this->discount_percentage,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'is_in_stock' => $inStock,
            'views' => $this->views,
            'average_rating' => $this->whenLoaded('reviews', function () {
                return round($this->reviews->where('is_approved', true)->avg('rating') ?? 0, 1);
            }, $this->average_rating ?? 0),
            'reviews_count' => $this->whenLoaded('reviews', function () {
                return $this->reviews->where('is_approved', true)->count();
            }, $this->reviews_count ?? 0),
            'primary_image_url' => $this->primary_image_url,
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->image_url,
                    'alt_text' => $img->alt_text,
                    'is_primary' => $img->is_primary,
                    'sort_order' => $img->sort_order,
                ]);
            }),
            'variants' => $this->whenLoaded('variants', function () {
                return ProductVariantResource::collection($this->variants);
            }),
            'category' => $this->whenLoaded('category', function () {
                return $this->category ? [
                    'id' => $this->category->id,
                    'name_en' => $this->category->name_en,
                    'name_ar' => $this->category->name_ar,
                    'slug' => $this->category->slug,
                    'parent' => $this->category->parent ? [
                        'id' => $this->category->parent->id,
                        'name_en' => $this->category->parent->name_en,
                        'name_ar' => $this->category->parent->name_ar,
                        'slug' => $this->category->parent->slug,
                    ] : null,
                ] : null;
            }),
            'reviews' => $this->whenLoaded('reviews', function () {
                return $this->reviews->where('is_approved', true)->values()->map(fn($r) => [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'title' => $r->title,
                    'body' => $r->body,
                    'user' => $r->user ? [
                        'id' => $r->user->id,
                        'name' => $r->user->name,
                        'avatar_url' => $r->user->avatar_url,
                    ] : null,
                    'created_at' => $r->created_at,
                ]);
            }),
            'currency' => 'ILS',
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
