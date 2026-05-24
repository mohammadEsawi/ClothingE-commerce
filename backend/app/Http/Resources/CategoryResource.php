<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_en' => $this->name_en,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'image_url' => $this->image_url,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'products_count' => $this->whenCounted('products'),
            'parent_id' => $this->parent_id,
            'parent' => $this->whenLoaded('parent', function () {
                return $this->parent ? [
                    'id' => $this->parent->id,
                    'name_en' => $this->parent->name_en,
                    'name_ar' => $this->parent->name_ar,
                    'slug' => $this->parent->slug,
                ] : null;
            }),
            'children' => $this->whenLoaded('children', function () {
                return $this->children->map(fn($child) => [
                    'id' => $child->id,
                    'name_en' => $child->name_en,
                    'name_ar' => $child->name_ar,
                    'slug' => $child->slug,
                    'image_url' => $child->image_url,
                    'sort_order' => $child->sort_order,
                    'is_active' => $child->is_active,
                ]);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
