<?php

use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Customer\ProductController;
use App\Http\Controllers\API\Customer\CategoryController;
use App\Http\Controllers\API\Customer\CartController;
use App\Http\Controllers\API\Customer\WishlistController;
use App\Http\Controllers\API\Customer\OrderController;
use App\Http\Controllers\API\Customer\CouponController;
use App\Http\Controllers\API\Customer\ReviewController;
use App\Http\Controllers\API\Customer\AddressController;
use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\ProductController as AdminProductController;
use App\Http\Controllers\API\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\API\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\API\Admin\CustomerController;
use App\Http\Controllers\API\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\API\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\API\Admin\ReportController;
use App\Http\Controllers\API\Admin\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── Auth Routes ─────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
        });
    });

    // ─── Public Product Routes ────────────────────────────────────────────────
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

    // ─── Public Category Routes ───────────────────────────────────────────────
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}/products', [CategoryController::class, 'show']);

    // ─── Authenticated Customer Routes ────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart', [CartController::class, 'clear']);
        Route::delete('/cart/{id}', [CartController::class, 'destroy']);

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist/{productId}', [WishlistController::class, 'store']);
        Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::delete('/orders/{id}', [OrderController::class, 'cancel']);

        // Coupons
        Route::post('/coupons/validate', [CouponController::class, 'validate']);

        // Reviews
        Route::post('/reviews', [ReviewController::class, 'store']);

        // Addresses
        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{id}', [AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    });

    // ─── Admin Routes ─────────────────────────────────────────────────────────
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Products
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{id}', [AdminProductController::class, 'show']);
        Route::put('/products/{id}', [AdminProductController::class, 'update']);
        Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

        // Product Variants
        Route::post('/products/{id}/variants', [AdminProductController::class, 'storeVariant']);
        Route::put('/products/{id}/variants/{variantId}', [AdminProductController::class, 'updateVariant']);
        Route::delete('/products/{id}/variants/{variantId}', [AdminProductController::class, 'destroyVariant']);

        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::get('/categories/{id}', [AdminCategoryController::class, 'show']);
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}', [AdminOrderController::class, 'update']);

        // Customers
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);

        // Coupons
        Route::get('/coupons', [AdminCouponController::class, 'index']);
        Route::post('/coupons', [AdminCouponController::class, 'store']);
        Route::get('/coupons/{id}', [AdminCouponController::class, 'show']);
        Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
        Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);

        // Reviews
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::put('/reviews/{id}', [AdminReviewController::class, 'update']);

        // Reports
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/inventory', [ReportController::class, 'inventory']);

        // File Upload
        Route::post('/upload', [UploadController::class, 'store']);
    });
});
