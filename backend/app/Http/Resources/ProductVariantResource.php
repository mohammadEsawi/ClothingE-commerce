<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'color' => $this->whenLoaded('color', function () {
                return $this->color ? [
                    'id' => $this->color->id,
                    'name_en' => $this->color->name_en,
                    'name_ar' => $this->color->name_ar,
                    'hex_code' => $this->color->hex_code,
                ] : null;
            }),
            'size' => $this->whenLoaded('size', function () {
                return $this->size ? [
                    'id' => $this->size->id,
                    'name' => $this->size->name,
                    'type' => $this->size->type,
                ] : null;
            }),
            'price_override' => $this->price_override,
            'effective_price' => $this->effective_price,
            'stock_quantity' => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'status' => $this->status,
            'stock_status' => $this->stock_status,
            'is_available' => $this->stock_quantity > 0,
        ];
    }
}
