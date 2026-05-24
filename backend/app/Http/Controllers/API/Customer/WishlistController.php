<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\WishlistItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $wishlistItems = WishlistItem::with([
            'product.images',
            'product.category',
            'product.variants',
        ])
        ->where('user_id', $request->user()->id)
        ->latest()
        ->get();

        $data = $wishlistItems->map(function ($item) {
            $product = $item->product;
            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'slug' => $product->slug,
                'base_price' => $product->base_price,
                'sale_price' => $product->sale_price,
                'effective_price' => $product->effective_price,
                'is_on_sale' => $product->is_on_sale,
                'discount_percentage' => $product->discount_percentage,
                'primary_image_url' => $product->primary_image_url,
                'is_in_stock' => $product->variants->sum('stock_quantity') > 0,
                'added_at' => $item->created_at,
            ];
        });

        return $this->success([
            'items' => $data,
            'count' => $data->count(),
        ], 'Wishlist retrieved successfully');
    }

    public function store(Request $request, int $productId): JsonResponse
    {
        $product = Product::active()->findOrFail($productId);

        $exists = WishlistItem::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->exists();

        if ($exists) {
            return $this->error('Product is already in your wishlist', 422);
        }

        WishlistItem::create([
            'user_id' => $request->user()->id,
            'product_id' => $productId,
        ]);

        return $this->created(null, 'Product added to wishlist');
    }

    public function destroy(Request $request, int $productId): JsonResponse
    {
        $item = WishlistItem::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->firstOrFail();

        $item->delete();

        return $this->success(null, 'Product removed from wishlist');
    }
}
