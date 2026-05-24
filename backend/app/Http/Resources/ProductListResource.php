<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $inStock = false;
        $minPrice = null;
        $maxPrice = null;
        $availableColors = [];
        $availableSizes = [];

        if ($this->relationLoaded('variants')) {
            $variants = $this->variants;
            $inStock = $variants->sum('stock_quantity') > 0;
            $prices = $variants->map(fn($v) => $v->effective_price)->filter();
            $minPrice = $prices->min();
            $maxPrice = $prices->max();

            $availableColors = $variants->filter(fn($v) => $v->stock_quantity > 0 && $v->color)
                ->unique('color_id')
                ->map(fn($v) => [
                    'id' => $v->color->id,
                    'name_en' => $v->color->name_en,
                    'name_ar' => $v->color->name_ar,
                    'hex_code' => $v->color->hex_code,
                ])->values()->toArray();

            $availableSizes = $variants->filter(fn($v) => $v->stock_quantity > 0 && $v->size)
                ->unique('size_id')
                ->map(fn($v) => [
                    'id' => $v->size->id,
                    'name' => $v->size->name,
                    'type' => $v->size->type,
                ])->values()->toArray();
        }

        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'base_price' => $this->base_price,
            'sale_price' => $this->sale_price,
            'effective_price' => $this->effective_price,
            'is_on_sale' => $this->is_on_sale,
            'discount_percentage' => $this->discount_percentage,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'views' => $this->views,
            'primary_image_url' => $this->primary_image_url,
            'is_in_stock' => $inStock,
            'min_variant_price' => $minPrice,
            'max_variant_price' => $maxPrice,
            'available_colors' => $availableColors,
            'available_sizes' => $availableSizes,
            'category' => $this->whenLoaded('category', function () {
                return $this->category ? [
                    'id' => $this->category->id,
                    'name_en' => $this->category->name_en,
                    'name_ar' => $this->category->name_ar,
                    'slug' => $this->category->slug,
                ] : null;
            }),
            'currency' => 'ILS',
            'created_at' => $this->created_at,
        ];
    }
}
