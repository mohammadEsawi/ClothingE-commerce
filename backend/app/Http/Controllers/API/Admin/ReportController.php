<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    use ApiResponse;

    public function sales(Request $request): JsonResponse
    {
        $period = $request->get('period', 'monthly');
        $dateFrom = $request->filled('date_from') ? $request->date_from : now()->subDays(30)->toDateString();
        $dateTo = $request->filled('date_to') ? $request->date_to : now()->toDateString();

        $baseQuery = Order::whereNotIn('status', ['cancelled', 'refunded'])
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $dateFrom)
            ->whereDate('created_at', '<=', $dateTo);

        // Revenue by period
        switch ($period) {
            case 'daily':
                $revenueData = (clone $baseQuery)
                    ->select(
                        DB::raw('DATE(created_at) as period'),
                        DB::raw('SUM(total) as revenue'),
                        DB::raw('COUNT(*) as orders_count'),
                        DB::raw('AVG(total) as avg_order_value')
                    )
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get();
                break;
            case 'weekly':
                $revenueData = (clone $baseQuery)
                    ->select(
                        DB::raw('YEARWEEK(created_at, 1) as period'),
                        DB::raw('MIN(DATE(created_at)) as week_start'),
                        DB::raw('SUM(total) as revenue'),
                        DB::raw('COUNT(*) as orders_count'),
                        DB::raw('AVG(total) as avg_order_value')
                    )
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get();
                break;
            default: // monthly
                $revenueData = (clone $baseQuery)
                    ->select(
                        DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'),
                        DB::raw('SUM(total) as revenue'),
                        DB::raw('COUNT(*) as orders_count'),
                        DB::raw('AVG(total) as avg_order_value')
                    )
                    ->groupBy('period')
                    ->orderBy('period')
                    ->get();
        }

        // Summary stats
        $summary = [
            'total_revenue' => round((float) (clone $baseQuery)->sum('total'), 2),
            'total_orders' => (clone $baseQuery)->count(),
            'average_order_value' => round((float) (clone $baseQuery)->avg('total') ?? 0, 2),
            'total_discount_given' => round((float) (clone $baseQuery)->sum('discount_amount'), 2),
        ];

        // Top products by sales
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->whereDate('orders.created_at', '>=', $dateFrom)
            ->whereDate('orders.created_at', '<=', $dateTo)
            ->select(
                'products.id',
                'products.name_en',
                'products.name_ar',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count')
            )
            ->groupBy('products.id', 'products.name_en', 'products.name_ar')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        // Top categories by revenue
        $topCategories = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.payment_status', 'paid')
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->whereDate('orders.created_at', '>=', $dateFrom)
            ->whereDate('orders.created_at', '<=', $dateTo)
            ->select(
                'categories.id',
                'categories.name_en',
                'categories.name_ar',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('categories.id', 'categories.name_en', 'categories.name_ar')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        // Order status breakdown
        $statusBreakdown = Order::whereDate('created_at', '>=', $dateFrom)
            ->whereDate('created_at', '<=', $dateTo)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        return $this->success([
            'period' => $period,
            'date_range' => ['from' => $dateFrom, 'to' => $dateTo],
            'summary' => $summary,
            'revenue_data' => $revenueData,
            'top_products' => $topProducts,
            'top_categories' => $topCategories,
            'status_breakdown' => $statusBreakdown,
            'currency' => 'ILS',
        ], 'Sales report generated successfully');
    }

    public function inventory(Request $request): JsonResponse
    {
        // Overall stats
        $totalVariants = ProductVariant::count();
        $inStockCount = ProductVariant::where('status', 'in_stock')->count();
        $lowStockCount = ProductVariant::where('status', 'low_stock')->count();
        $outOfStockCount = ProductVariant::where('status', 'out_of_stock')->count();
        $totalStockValue = DB::table('product_variants')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->select(DB::raw('SUM(product_variants.stock_quantity * COALESCE(product_variants.price_override, products.base_price)) as total_value'))
            ->value('total_value') ?? 0;

        // Low stock items
        $lowStockItems = ProductVariant::with([
            'product:id,name_en,name_ar,slug',
            'color:id,name_en,hex_code',
            'size:id,name',
        ])
        ->where('status', 'low_stock')
        ->orderBy('stock_quantity')
        ->limit(50)
        ->get()
        ->map(fn($v) => [
            'variant_id' => $v->id,
            'sku' => $v->sku,
            'product_name_en' => $v->product?->name_en,
            'product_name_ar' => $v->product?->name_ar,
            'color' => $v->color?->name_en,
            'size' => $v->size?->name,
            'stock_quantity' => $v->stock_quantity,
            'low_stock_threshold' => $v->low_stock_threshold,
            'status' => $v->status,
        ]);

        // Out of stock items
        $outOfStockItems = ProductVariant::with([
            'product:id,name_en,name_ar,slug',
            'color:id,name_en,hex_code',
            'size:id,name',
        ])
        ->where('status', 'out_of_stock')
        ->limit(50)
        ->get()
        ->map(fn($v) => [
            'variant_id' => $v->id,
            'sku' => $v->sku,
            'product_name_en' => $v->product?->name_en,
            'product_name_ar' => $v->product?->name_ar,
            'color' => $v->color?->name_en,
            'size' => $v->size?->name,
            'stock_quantity' => $v->stock_quantity,
            'status' => $v->status,
        ]);

        // Stock levels by category
        $stockByCategory = DB::table('product_variants')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'categories.id',
                'categories.name_en',
                DB::raw('COUNT(product_variants.id) as variants_count'),
                DB::raw('SUM(product_variants.stock_quantity) as total_stock'),
                DB::raw('SUM(CASE WHEN product_variants.status = "out_of_stock" THEN 1 ELSE 0 END) as out_of_stock_count'),
                DB::raw('SUM(CASE WHEN product_variants.status = "low_stock" THEN 1 ELSE 0 END) as low_stock_count')
            )
            ->groupBy('categories.id', 'categories.name_en')
            ->get();

        // Most moved products (sold in last 30 days)
        $mostMovedProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->whereDate('orders.created_at', '>=', now()->subDays(30))
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->select(
                'products.id',
                'products.name_en',
                DB::raw('SUM(order_items.quantity) as units_sold_30d')
            )
            ->groupBy('products.id', 'products.name_en')
            ->orderByDesc('units_sold_30d')
            ->limit(10)
            ->get();

        return $this->success([
            'summary' => [
                'total_variants' => $totalVariants,
                'in_stock' => $inStockCount,
                'low_stock' => $lowStockCount,
                'out_of_stock' => $outOfStockCount,
                'total_stock_value' => round((float) $totalStockValue, 2),
                'currency' => 'ILS',
            ],
            'low_stock_items' => $lowStockItems,
            'out_of_stock_items' => $outOfStockItems,
            'stock_by_category' => $stockByCategory,
            'most_moved_products_30d' => $mostMovedProducts,
        ], 'Inventory report generated successfully');
    }
}
