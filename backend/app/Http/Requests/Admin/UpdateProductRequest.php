<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'sometimes|exists:categories,id',
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'description_en' => 'sometimes|string',
            'description_ar' => 'sometimes|string',
            'base_price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*.url' => 'required_with:images|string',
            'images.*.alt_text' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'Selected category does not exist',
            'base_price.numeric' => 'Base price must be a number',
            'sale_price.numeric' => 'Sale price must be a number',
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
