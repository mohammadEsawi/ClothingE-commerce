<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $cartItems = CartItem::with([
            'productVariant.product.images',
            'productVariant.color',
            'productVariant.size',
        ])
        ->where('user_id', $request->user()->id)
        ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * ($item->productVariant->effective_price ?? 0);
        });

        return $this->success([
            'items' => CartItemResource::collection($cartItems),
            'summary' => [
                'items_count' => $cartItems->count(),
                'total_quantity' => $cartItems->sum('quantity'),
                'subtotal' => round($subtotal, 2),
                'currency' => 'ILS',
            ],
        ], 'Cart retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $variant = ProductVariant::findOrFail($request->product_variant_id);

        if ($variant->stock_quantity <= 0) {
            return $this->error('This product variant is out of stock', 422);
        }

        $existingItem = CartItem::where('user_id', $request->user()->id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($existingItem) {
            $newQty = $existingItem->quantity + $request->quantity;

            if ($newQty > $variant->stock_quantity) {
                return $this->error(
                    "Only {$variant->stock_quantity} items available in stock",
                    422
                );
            }

            $existingItem->update(['quantity' => $newQty]);
            $item = $existingItem->load([
                'productVariant.product.images',
                'productVariant.color',
                'productVariant.size',
            ]);
        } else {
            if ($request->quantity > $variant->stock_quantity) {
                return $this->error(
                    "Only {$variant->stock_quantity} items available in stock",
                    422
                );
            }

            $item = CartItem::create([
                'user_id' => $request->user()->id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
            ]);
            $item->load([
                'productVariant.product.images',
                'productVariant.color',
                'productVariant.size',
            ]);
        }

        return $this->created(new CartItemResource($item), 'Item added to cart');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $variant = $cartItem->productVariant;

        if ($request->quantity > $variant->stock_quantity) {
            return $this->error(
                "Only {$variant->stock_quantity} items available in stock",
                422
            );
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $cartItem->load([
            'productVariant.product.images',
            'productVariant.color',
            'productVariant.size',
        ]);

        return $this->success(new CartItemResource($cartItem), 'Cart item updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cartItem->delete();

        return $this->success(null, 'Item removed from cart');
    }

    public function clear(Request $request): JsonResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return $this->success(null, 'Cart cleared successfully');
    }
}
