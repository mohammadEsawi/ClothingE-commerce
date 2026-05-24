<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:base_price',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*.url' => 'required_with:images|string',
            'images.*.alt_text' => 'nullable|string|max:255',
            'variants' => 'nullable|array',
            'variants.*.color_id' => 'nullable|exists:colors,id',
            'variants.*.size_id' => 'nullable|exists:sizes,id',
            'variants.*.sku' => 'nullable|string|unique:product_variants,sku',
            'variants.*.price_override' => 'nullable|numeric|min:0',
            'variants.*.stock_quantity' => 'required_with:variants|integer|min:0',
            'variants.*.low_stock_threshold' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'name_en.required' => 'English name is required',
            'name_ar.required' => 'Arabic name is required',
            'description_en.required' => 'English description is required',
            'description_ar.required' => 'Arabic description is required',
            'base_price.required' => 'Base price is required',
            'base_price.numeric' => 'Base price must be a number',
            'sale_price.lt' => 'Sale price must be less than base price',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
