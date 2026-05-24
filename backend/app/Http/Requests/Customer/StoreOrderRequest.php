<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line1' => 'required|string|max:255',
            'shipping_address.address_line2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.state_province' => 'required|string|max:100',
            'shipping_address.country' => 'nullable|string|max:100',
            'shipping_address.postal_code' => 'nullable|string|max:20',
            'payment_method' => 'nullable|in:cash_on_delivery,credit_card,bank_transfer',
            'coupon_code' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address.required' => 'Shipping address is required',
            'shipping_address.full_name.required' => 'Full name is required for shipping address',
            'shipping_address.phone.required' => 'Phone number is required for shipping address',
            'shipping_address.address_line1.required' => 'Street address is required',
            'shipping_address.city.required' => 'City is required',
            'shipping_address.state_province.required' => 'State/Province is required',
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
