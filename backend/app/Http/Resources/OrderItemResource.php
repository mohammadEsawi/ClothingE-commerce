<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variant = $this->whenLoaded('productVariant');
        $product = $variant instanceof \App\Models\ProductVariant ? $variant->product : null;

        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'color_name' => $this->color_name,
            'size_name' => $this->size_name,
            'sku' => $this->sku,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'currency' => 'ILS',
            'product' => $product ? [
                'id' => $product->id,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'slug' => $product->slug,
                'primary_image_url' => $product->primary_image_url,
            ] : null,
        ];
    }
}
