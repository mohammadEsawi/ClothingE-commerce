<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\OrderResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('payment_status', 'paid')
                  ->whereNotIn('status', ['cancelled', 'refunded']);
            }], 'total');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $sortField = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'name', 'email', 'orders_count', 'total_spent'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $customers = $query->paginate($perPage);

        $data = $customers->getCollection()->map(function ($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'avatar_url' => $customer->avatar_url,
                'preferred_language' => $customer->preferred_language,
                'orders_count' => $customer->orders_count,
                'total_spent' => round((float) ($customer->total_spent ?? 0), 2),
                'joined_at' => $customer->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Customers retrieved successfully',
            'data' => $data,
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('payment_status', 'paid')
                  ->whereNotIn('status', ['cancelled', 'refunded']);
            }], 'total')
            ->findOrFail($id);

        $recentOrders = $customer->orders()
            ->with(['orderItems'])
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'orders_count' => $customer->orders_count,
            'total_spent' => round((float) ($customer->total_spent ?? 0), 2),
            'pending_orders' => $customer->orders()->where('status', 'pending')->count(),
            'completed_orders' => $customer->orders()->where('status', 'delivered')->count(),
            'cancelled_orders' => $customer->orders()->where('status', 'cancelled')->count(),
        ];

        return $this->success([
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'avatar_url' => $customer->avatar_url,
                'preferred_language' => $customer->preferred_language,
                'email_verified_at' => $customer->email_verified_at,
                'joined_at' => $customer->created_at,
            ],
            'stats' => $stats,
            'recent_orders' => OrderResource::collection($recentOrders),
        ], 'Customer retrieved successfully');
    }
}
