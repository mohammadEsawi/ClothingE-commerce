<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use ApiResponse;

    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'order_amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return $this->error('Coupon code not found', 404);
        }

        if (!$coupon->isValid((float) $request->order_amount)) {
            $reason = $this->getCouponInvalidReason($coupon, (float) $request->order_amount);
            return $this->error($reason, 422);
        }

        $discountAmount = $coupon->applyDiscount((float) $request->order_amount);

        return $this->success([
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'min_order_amount' => $coupon->min_order_amount,
                'max_discount_amount' => $coupon->max_discount_amount,
                'expires_at' => $coupon->expires_at,
            ],
            'discount_amount' => round($discountAmount, 2),
            'final_amount' => round((float) $request->order_amount - $discountAmount, 2),
        ], 'Coupon is valid');
    }

    private function getCouponInvalidReason(Coupon $coupon, float $orderAmount): string
    {
        if (!$coupon->is_active) {
            return 'This coupon is no longer active';
        }

        if ($coupon->expires_at && now()->gt($coupon->expires_at)) {
            return 'This coupon has expired';
        }

        if ($coupon->starts_at && now()->lt($coupon->starts_at)) {
            return 'This coupon is not yet valid';
        }

        if ($coupon->max_uses !== null && $coupon->used_count >= $coupon->max_uses) {
            return 'This coupon has reached its usage limit';
        }

        if ($coupon->min_order_amount !== null && $orderAmount < $coupon->min_order_amount) {
            return "Minimum order amount of {$coupon->min_order_amount} ILS required for this coupon";
        }

        return 'This coupon is not valid';
    }
}
