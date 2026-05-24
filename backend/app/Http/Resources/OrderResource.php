<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'shipping_cost' => $this->shipping_cost,
            'total' => $this->total,
            'currency' => 'ILS',
            'shipping_address' => $this->shipping_address,
            'notes' => $this->notes,
            'tracking_number' => $this->tracking_number,
            'can_be_cancelled' => $this->canBeCancelled(),
            'coupon' => $this->whenLoaded('coupon', function () {
                return $this->coupon ? [
                    'id' => $this->coupon->id,
                    'code' => $this->coupon->code,
                    'type' => $this->coupon->type,
                    'value' => $this->coupon->value,
                ] : null;
            }),
            'items' => $this->whenLoaded('orderItems', function () {
                return OrderItemResource::collection($this->orderItems);
            }),
            'items_count' => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->count();
            }),
            'user' => $this->whenLoaded('user', function () {
                return $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'phone' => $this->user->phone,
                ] : null;
            }),
            'shipped_at' => $this->shipped_at,
            'delivered_at' => $this->delivered_at,
            'cancelled_at' => $this->cancelled_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
