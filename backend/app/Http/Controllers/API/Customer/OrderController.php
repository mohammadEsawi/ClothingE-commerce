<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['orderItems', 'coupon'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return $this->paginated(
            OrderResource::collection($orders),
            'Orders retrieved successfully'
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::with([
            'orderItems.productVariant.product.images',
            'coupon',
        ])
        ->where('id', $id)
        ->where('user_id', $request->user()->id)
        ->firstOrFail();

        return $this->success(new OrderResource($order), 'Order retrieved successfully');
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = $request->user();

        $cartItems = CartItem::with([
            'productVariant.product',
            'productVariant.color',
            'productVariant.size',
        ])
        ->where('user_id', $user->id)
        ->get();

        if ($cartItems->isEmpty()) {
            return $this->error('Your cart is empty', 422);
        }

        // Validate stock for all items
        $stockErrors = [];
        foreach ($cartItems as $cartItem) {
            $variant = $cartItem->productVariant;
            if (!$variant) {
                $stockErrors[] = 'One or more cart items are no longer available';
                continue;
            }
            if ($variant->stock_quantity < $cartItem->quantity) {
                $productName = $variant->product->name_en ?? 'Product';
                $stockErrors[] = "{$productName}: only {$variant->stock_quantity} available (requested {$cartItem->quantity})";
            }
        }

        if (!empty($stockErrors)) {
            return $this->error('Stock validation failed', 422, $stockErrors);
        }

        // Calculate amounts
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->productVariant->effective_price;
        });

        $discountAmount = 0;
        $coupon = null;

        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();

            if (!$coupon || !$coupon->isValid($subtotal)) {
                return $this->error('Invalid or expired coupon code', 422);
            }

            $discountAmount = $coupon->applyDiscount($subtotal);
        }

        $shippingCost = $this->calculateShipping($subtotal, $discountAmount);
        $total = max(0, $subtotal - $discountAmount + $shippingCost);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method ?? 'cash_on_delivery',
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'coupon_id' => $coupon?->id,
                'shipping_address' => $request->shipping_address,
                'notes' => $request->notes,
            ]);

            foreach ($cartItems as $cartItem) {
                $variant = $cartItem->productVariant;
                $product = $variant->product;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $product->name_en,
                    'color_name' => $variant->color?->name_en,
                    'size_name' => $variant->size?->name,
                    'sku' => $variant->sku,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $variant->effective_price,
                    'total_price' => $cartItem->quantity * $variant->effective_price,
                ]);

                $variant->decreaseStock($cartItem->quantity);
            }

            if ($coupon) {
                $coupon->incrementUsage();
            }

            CartItem::where('user_id', $user->id)->delete();

            DB::commit();

            $order->load(['orderItems', 'coupon']);

            return $this->created(new OrderResource($order), 'Order placed successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create order. Please try again.', 500);
        }
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::with('orderItems.productVariant')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$order->canBeCancelled()) {
            return $this->error(
                'Order cannot be cancelled. Only pending or confirmed orders can be cancelled.',
                422
            );
        }

        try {
            DB::beginTransaction();

            foreach ($order->orderItems as $item) {
                if ($item->productVariant) {
                    $item->productVariant->increaseStock($item->quantity);
                }
            }

            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            DB::commit();

            return $this->success(new OrderResource($order->fresh()), 'Order cancelled successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to cancel order. Please try again.', 500);
        }
    }

    private function calculateShipping(float $subtotal, float $discount): float
    {
        $afterDiscount = $subtotal - $discount;

        if ($afterDiscount >= 300) {
            return 0;
        }

        return 25;
    }
}
