<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryAlert;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfYear = $now->copy()->startOfYear();
        $last30Days = $now->copy()->subDays(30);

        // Revenue stats
        $monthRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $startOfMonth)
            ->sum('total');

        $yearRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $startOfYear)
            ->sum('total');

        $totalRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('payment_status', 'paid')
            ->sum('total');

        // Order stats
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::whereIn('status', ['confirmed', 'processing'])->count();
        $shippedOrders = Order::where('status', 'shipped')->count();

        // Customer stats
        $totalCustomers = User::where('role', 'customer')->count();
        $newCustomersThisMonth = User::where('role', 'customer')
            ->whereDate('created_at', '>=', $startOfMonth)
            ->count();

        // Product stats
        $totalProducts = Product::where('is_active', true)->count();
        $totalCategories = \App\Models\Category::where('is_active', true)->count();

        // Top products by revenue
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->select(
                'products.id',
                'products.name_en',
                'products.name_ar',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name_en', 'products.name_ar')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get();

        // Recent orders
        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer' => $o->user ? $o->user->name : 'Unknown',
                'total' => $o->total,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'created_at' => $o->created_at,
            ]);

        // Revenue chart - last 30 days
        $revenueChart = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $last30Days)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Low stock alerts
        $lowStockAlerts = InventoryAlert::with([
            'productVariant.product:id,name_en,name_ar',
            'productVariant.color:id,name_en',
            'productVariant.size:id,name',
        ])
        ->where('is_read', false)
        ->latest()
        ->limit(10)
        ->get()
        ->map(fn($alert) => [
            'id' => $alert->id,
            'type' => $alert->type,
            'product_name' => $alert->productVariant?->product?->name_en,
            'color' => $alert->productVariant?->color?->name_en,
            'size' => $alert->productVariant?->size?->name,
            'sku' => $alert->productVariant?->sku,
            'stock_quantity' => $alert->productVariant?->stock_quantity,
            'created_at' => $alert->created_at,
        ]);

        return $this->success([
            'revenue' => [
                'total' => round((float) $totalRevenue, 2),
                'this_month' => round((float) $monthRevenue, 2),
                'this_year' => round((float) $yearRevenue, 2),
                'currency' => 'ILS',
            ],
            'orders' => [
                'total' => $totalOrders,
                'pending' => $pendingOrders,
                'processing' => $processingOrders,
                'shipped' => $shippedOrders,
            ],
            'customers' => [
                'total' => $totalCustomers,
                'new_this_month' => $newCustomersThisMonth,
            ],
            'products' => [
                'total' => $totalProducts,
                'total_categories' => $totalCategories,
            ],
            'top_products' => $topProducts,
            'recent_orders' => $recentOrders,
            'revenue_chart' => $revenueChart,
            'low_stock_alerts' => $lowStockAlerts,
            'alerts_count' => InventoryAlert::where('is_read', false)->count(),
        ], 'Dashboard data retrieved successfully');
    }
}
