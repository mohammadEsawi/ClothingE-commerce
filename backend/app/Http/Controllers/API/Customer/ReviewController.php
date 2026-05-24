<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    public function index(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $reviews = Review::with('user:id,name,avatar')
            ->where('product_id', $id)
            ->approved()
            ->latest()
            ->paginate(10);

        $stats = [
            'average_rating' => round(Review::where('product_id', $id)->approved()->avg('rating') ?? 0, 1),
            'total_reviews' => Review::where('product_id', $id)->approved()->count(),
            'rating_breakdown' => [],
        ];

        for ($i = 5; $i >= 1; $i--) {
            $stats['rating_breakdown'][$i] = Review::where('product_id', $id)
                ->approved()
                ->where('rating', $i)
                ->count();
        }

        return response()->json([
            'success' => true,
            'message' => 'Reviews retrieved successfully',
            'data' => [
                'reviews' => ReviewResource::collection($reviews)->collection,
                'stats' => $stats,
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:2000',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        // Check if user already reviewed this product
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingReview) {
            return $this->error('You have already reviewed this product', 422);
        }

        // Verify user has purchased this product
        $hasPurchased = Order::where('user_id', $user->id)
            ->whereIn('status', ['delivered', 'shipped'])
            ->whereHas('orderItems.productVariant', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            })
            ->exists();

        if (!$hasPurchased) {
            return $this->error('You can only review products you have purchased', 403);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'body' => $request->body,
            'is_approved' => false,
        ]);

        $review->load('user:id,name,avatar');

        return $this->created(new ReviewResource($review), 'Review submitted successfully. It will be visible after approval.');
    }
}
