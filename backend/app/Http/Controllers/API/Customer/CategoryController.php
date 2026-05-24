<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductListResource;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $categories = Category::with(['children' => function ($q) {
            $q->active()->orderBy('sort_order');
        }])
        ->active()
        ->parentOnly()
        ->orderBy('sort_order')
        ->get();

        return $this->success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully'
        );
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $category = Category::with(['children' => function ($q) {
            $q->active()->orderBy('sort_order');
        }, 'parent'])
        ->where('slug', $slug)
        ->active()
        ->firstOrFail();

        $query = $category->products()
            ->with(['images', 'variants.color', 'variants.size'])
            ->active();

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->boolean('on_sale')) {
            $query->onSale();
        }

        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->priceRange(
                $request->filled('min_price') ? (float) $request->min_price : null,
                $request->filled('max_price') ? (float) $request->max_price : null
            );
        }

        // Sorting
        switch ($request->get('sort', 'latest')) {
            case 'price_asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('base_price', 'desc');
                break;
            case 'popular':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = min((int) $request->get('per_page', 15), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Category products retrieved successfully',
            'data' => [
                'category' => new CategoryResource($category),
                'products' => ProductListResource::collection($products)->collection,
            ],
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }
}
