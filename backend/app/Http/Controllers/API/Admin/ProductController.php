<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images', 'variants'])
            ->withTrashed();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name_en', 'like', "%{$request->search}%")
                  ->orWhere('name_ar', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        if ($request->filled('status')) {
            if ($request->status === 'deleted') {
                $query->onlyTrashed();
            } elseif ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $products = $query->latest()->paginate($perPage);

        return $this->paginated(
            ProductListResource::collection($products),
            'Products retrieved successfully'
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with([
            'category',
            'images',
            'variants.color',
            'variants.size',
        ])->withTrashed()->findOrFail($id);

        return $this->success(new ProductResource($product), 'Product retrieved successfully');
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $slug = Str::slug($request->name_en);
            $originalSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $product = Product::create([
                'category_id' => $request->category_id,
                'name_en' => $request->name_en,
                'name_ar' => $request->name_ar,
                'slug' => $slug,
                'description_en' => $request->description_en,
                'description_ar' => $request->description_ar,
                'base_price' => $request->base_price,
                'sale_price' => $request->sale_price,
                'is_featured' => $request->boolean('is_featured'),
                'is_active' => $request->boolean('is_active', true),
            ]);

            if ($request->has('images')) {
                foreach ($request->images as $index => $imageData) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imageData['url'],
                        'alt_text' => $imageData['alt_text'] ?? null,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }

            if ($request->has('variants')) {
                foreach ($request->variants as $variantData) {
                    $sku = $variantData['sku'] ?? $this->generateSku($product, $variantData);
                    $quantity = (int) ($variantData['stock_quantity'] ?? 0);
                    $threshold = (int) ($variantData['low_stock_threshold'] ?? 5);
                    $status = $this->determineStatus($quantity, $threshold);

                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color_id' => $variantData['color_id'] ?? null,
                        'size_id' => $variantData['size_id'] ?? null,
                        'sku' => $sku,
                        'price_override' => $variantData['price_override'] ?? null,
                        'stock_quantity' => $quantity,
                        'low_stock_threshold' => $threshold,
                        'status' => $status,
                    ]);
                }
            }

            DB::commit();

            $product->load(['category', 'images', 'variants.color', 'variants.size']);

            return $this->created(new ProductResource($product), 'Product created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        try {
            DB::beginTransaction();

            $data = $request->only([
                'category_id', 'name_en', 'name_ar', 'description_en',
                'description_ar', 'base_price', 'sale_price', 'is_featured', 'is_active',
            ]);

            if ($request->filled('name_en') && $request->name_en !== $product->name_en) {
                $slug = Str::slug($request->name_en);
                $originalSlug = $slug;
                $count = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $count++;
                }
                $data['slug'] = $slug;
            }

            if ($request->has('is_featured')) {
                $data['is_featured'] = $request->boolean('is_featured');
            }
            if ($request->has('is_active')) {
                $data['is_active'] = $request->boolean('is_active');
            }

            $product->update($data);

            if ($request->has('images')) {
                $product->images()->delete();
                foreach ($request->images as $index => $imageData) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imageData['url'],
                        'alt_text' => $imageData['alt_text'] ?? null,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            $product->load(['category', 'images', 'variants.color', 'variants.size']);

            return $this->success(new ProductResource($product), 'Product updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }

    public function storeVariant(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'color_id' => 'nullable|exists:colors,id',
            'size_id' => 'nullable|exists:sizes,id',
            'sku' => 'nullable|string|unique:product_variants,sku',
            'price_override' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $quantity = (int) $request->stock_quantity;
        $threshold = (int) ($request->low_stock_threshold ?? 5);
        $sku = $request->sku ?? $this->generateSku($product, $request->all());
        $status = $this->determineStatus($quantity, $threshold);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'color_id' => $request->color_id,
            'size_id' => $request->size_id,
            'sku' => $sku,
            'price_override' => $request->price_override,
            'stock_quantity' => $quantity,
            'low_stock_threshold' => $threshold,
            'status' => $status,
        ]);

        $variant->load(['color', 'size']);

        return $this->created($variant, 'Variant created successfully');
    }

    public function updateVariant(Request $request, int $id, int $variantId): JsonResponse
    {
        $variant = ProductVariant::where('product_id', $id)->findOrFail($variantId);

        $request->validate([
            'color_id' => 'nullable|exists:colors,id',
            'size_id' => 'nullable|exists:sizes,id',
            'sku' => "nullable|string|unique:product_variants,sku,{$variantId}",
            'price_override' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['color_id', 'size_id', 'sku', 'price_override', 'stock_quantity', 'low_stock_threshold']);

        if (isset($data['stock_quantity'])) {
            $quantity = (int) $data['stock_quantity'];
            $threshold = (int) ($data['low_stock_threshold'] ?? $variant->low_stock_threshold);
            $data['status'] = $this->determineStatus($quantity, $threshold);
        }

        $variant->update($data);
        $variant->load(['color', 'size']);

        return $this->success($variant, 'Variant updated successfully');
    }

    public function destroyVariant(int $id, int $variantId): JsonResponse
    {
        $variant = ProductVariant::where('product_id', $id)->findOrFail($variantId);
        $variant->delete();

        return $this->success(null, 'Variant deleted successfully');
    }

    private function generateSku(Product $product, array $data): string
    {
        $base = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $product->name_en), 0, 4));
        $colorPart = isset($data['color_id']) ? str_pad($data['color_id'], 2, '0', STR_PAD_LEFT) : '00';
        $sizePart = isset($data['size_id']) ? str_pad($data['size_id'], 2, '0', STR_PAD_LEFT) : '00';
        $unique = strtoupper(Str::random(4));
        return "{$base}-{$colorPart}{$sizePart}-{$unique}";
    }

    private function determineStatus(int $quantity, int $threshold): string
    {
        if ($quantity <= 0) return 'out_of_stock';
        if ($quantity <= $threshold) return 'low_stock';
        return 'in_stock';
    }
}
