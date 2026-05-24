<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Category::with(['parent', 'children']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name_en', 'like', "%{$request->search}%")
                  ->orWhere('name_ar', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('parent_only')) {
            if ($request->boolean('parent_only')) {
                $query->whereNull('parent_id');
            }
        }

        $categories = $query->orderBy('sort_order')->get();

        return $this->success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully'
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = Category::with(['parent', 'children'])
            ->withCount('products')
            ->findOrFail($id);

        return $this->success(new CategoryResource($category), 'Category retrieved successfully');
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $slug = Str::slug($request->name_en);
        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $category = Category::create([
            'parent_id' => $request->parent_id,
            'name_en' => $request->name_en,
            'name_ar' => $request->name_ar,
            'slug' => $slug,
            'image' => $imagePath,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        $category->load(['parent', 'children']);

        return $this->created(new CategoryResource($category), 'Category created successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'parent_id' => "nullable|exists:categories,id|not_in:{$id}",
            'name_en' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_url' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['parent_id', 'name_en', 'name_ar', 'sort_order']);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($request->filled('name_en') && $request->name_en !== $category->name_en) {
            $slug = Str::slug($request->name_en);
            $originalSlug = $slug;
            $count = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            $data['slug'] = $slug;
        }

        if ($request->hasFile('image')) {
            if ($category->image && !str_starts_with($category->image, 'http')) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        } elseif ($request->filled('image_url')) {
            $data['image'] = $request->image_url;
        }

        $category->update($data);
        $category->load(['parent', 'children']);

        return $this->success(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        if ($category->products()->count() > 0) {
            return $this->error('Cannot delete category with associated products', 422);
        }

        if ($category->children()->count() > 0) {
            return $this->error('Cannot delete category with subcategories', 422);
        }

        if ($category->image && !str_starts_with($category->image, 'http')) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }
}
