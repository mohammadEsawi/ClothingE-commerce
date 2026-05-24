<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Coupon::withCount('orders');

        if ($request->filled('search')) {
            $query->where('code', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $coupons = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Coupons retrieved successfully',
            'data' => $coupons->items(),
            'meta' => [
                'current_page' => $coupons->currentPage(),
                'last_page' => $coupons->lastPage(),
                'per_page' => $coupons->perPage(),
                'total' => $coupons->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $coupon = Coupon::withCount('orders')->findOrFail($id);
        return $this->success($coupon, 'Coupon retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
        ]);

        if ($request->type === 'percentage' && $request->value > 100) {
            return $this->error('Percentage discount cannot exceed 100%', 422);
        }

        $coupon = Coupon::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'max_discount_amount' => $request->max_discount_amount,
            'max_uses' => $request->max_uses,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return $this->created($coupon, 'Coupon created successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);

        $request->validate([
            'code' => "sometimes|string|max:50|unique:coupons,code,{$id}",
            'type' => 'sometimes|in:fixed,percentage',
            'value' => 'sometimes|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $data = $request->only([
            'type', 'value', 'min_order_amount', 'max_discount_amount',
            'max_uses', 'starts_at', 'expires_at',
        ]);

        if ($request->filled('code')) {
            $data['code'] = strtoupper($request->code);
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $coupon->update($data);

        return $this->success($coupon->fresh(), 'Coupon updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);

        if ($coupon->orders()->count() > 0) {
            $coupon->update(['is_active' => false]);
            return $this->success(null, 'Coupon has been deactivated (it has associated orders)');
        }

        $coupon->delete();

        return $this->success(null, 'Coupon deleted successfully');
    }
}
