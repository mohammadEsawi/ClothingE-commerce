<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variant = $this->productVariant;
        $product = $variant?->product;

        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'variant' => $variant ? [
                'id' => $variant->id,
                'sku' => $variant->sku,
                'effective_price' => $variant->effective_price,
                'stock_quantity' => $variant->stock_quantity,
                'status' => $variant->status,
                'color' => $variant->color ? [
                    'id' => $variant->color->id,
                    'name_en' => $variant->color->name_en,
                    'name_ar' => $variant->color->name_ar,
                    'hex_code' => $variant->color->hex_code,
                ] : null,
                'size' => $variant->size ? [
                    'id' => $variant->size->id,
                    'name' => $variant->size->name,
                    'type' => $variant->size->type,
                ] : null,
            ] : null,
            'product' => $product ? [
                'id' => $product->id,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'slug' => $product->slug,
                'base_price' => $product->base_price,
                'sale_price' => $product->sale_price,
                'is_on_sale' => $product->is_on_sale,
                'primary_image_url' => $product->primary_image_url,
            ] : null,
            'subtotal' => $this->subtotal,
            'currency' => 'ILS',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
