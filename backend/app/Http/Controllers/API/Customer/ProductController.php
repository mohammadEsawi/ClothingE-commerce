<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images', 'variants.color', 'variants.size'])
            ->active();

        // Category filter
        if ($request->filled('category')) {
            $query->inCategory($request->category);
        }

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Color filter
        if ($request->filled('color')) {
            $colorIds = is_array($request->color) ? $request->color : [$request->color];
            $query->whereHas('variants', function ($q) use ($colorIds) {
                $q->whereIn('color_id', $colorIds)->where('stock_quantity', '>', 0);
            });
        }

        // Size filter
        if ($request->filled('size')) {
            $sizeIds = is_array($request->size) ? $request->size : [$request->size];
            $query->whereHas('variants', function ($q) use ($sizeIds) {
                $q->whereIn('size_id', $sizeIds)->where('stock_quantity', '>', 0);
            });
        }

        // Price range filter
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->priceRange(
                $request->filled('min_price') ? (float) $request->min_price : null,
                $request->filled('max_price') ? (float) $request->max_price : null
            );
        }

        // On sale filter
        if ($request->boolean('on_sale')) {
            $query->onSale();
        }

        // Featured filter
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // In stock filter
        if ($request->boolean('in_stock')) {
            $query->inStock();
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
            case 'rating':
                $query->withAvg(['reviews as avg_rating' => function ($q) {
                    $q->where('is_approved', true);
                }], 'rating')->orderByDesc('avg_rating');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = min((int) $request->get('per_page', 15), 50);
        $products = $query->paginate($perPage);

        return $this->paginated(
            ProductListResource::collection($products),
            'Products retrieved successfully'
        );
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $product = Product::with([
            'category.parent',
            'images',
            'variants.color',
            'variants.size',
            'reviews' => function ($q) {
                $q->approved()->with('user:id,name,avatar')->latest()->limit(10);
            },
        ])
        ->where('slug', $slug)
        ->active()
        ->firstOrFail();

        // Increment view count
        $product->increment('views');

        // Append rating info
        $product->loadCount(['reviews as approved_reviews_count' => function ($q) {
            $q->where('is_approved', true);
        }]);
        $product->loadAvg(['reviews as average_rating' => function ($q) {
            $q->where('is_approved', true);
        }], 'rating');

        return $this->success(new ProductResource($product), 'Product retrieved successfully');
    }
}
