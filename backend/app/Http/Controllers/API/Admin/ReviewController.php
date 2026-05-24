<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['user:id,name,email', 'product:id,name_en,name_ar,slug']);

        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $reviews = $query->latest()->paginate($perPage);

        return $this->paginated(
            ReviewResource::collection($reviews),
            'Reviews retrieved successfully'
        );
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $review = Review::with(['user:id,name,email', 'product:id,name_en,slug'])->findOrFail($id);

        $request->validate([
            'is_approved' => 'required|boolean',
        ]);

        $review->update(['is_approved' => $request->boolean('is_approved')]);

        return $this->success(
            new ReviewResource($review->fresh(['user', 'product'])),
            $request->boolean('is_approved') ? 'Review approved' : 'Review rejected'
        );
    }
}
