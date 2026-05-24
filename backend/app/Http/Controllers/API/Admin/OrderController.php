<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['user:id,name,email,phone', 'orderItems', 'coupon']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $sortField = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'total', 'status', 'order_number'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $orders = $query->paginate($perPage);

        return $this->paginated(
            OrderResource::collection($orders),
            'Orders retrieved successfully'
        );
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with([
            'user:id,name,email,phone',
            'orderItems.productVariant.product:id,name_en,name_ar,slug',
            'orderItems.productVariant.color',
            'orderItems.productVariant.size',
            'coupon',
        ])->findOrFail($id);

        return $this->success(new OrderResource($order), 'Order retrieved successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $order = Order::with('orderItems.productVariant')->findOrFail($id);

        $request->validate([
            'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $data = [];

            if ($request->filled('tracking_number')) {
                $data['tracking_number'] = $request->tracking_number;
            }

            if ($request->filled('notes')) {
                $data['notes'] = $request->notes;
            }

            if ($request->filled('payment_status')) {
                $data['payment_status'] = $request->payment_status;
            }

            if ($request->filled('status')) {
                $newStatus = $request->status;
                $oldStatus = $order->status;
                $data['status'] = $newStatus;

                // Handle timestamps
                if ($newStatus === 'shipped' && $oldStatus !== 'shipped') {
                    $data['shipped_at'] = now();
                }
                if ($newStatus === 'delivered' && $oldStatus !== 'delivered') {
                    $data['delivered_at'] = now();
                }
                if (in_array($newStatus, ['cancelled', 'refunded']) && !$order->isCancelled()) {
                    $data['cancelled_at'] = now();

                    // Restore stock
                    foreach ($order->orderItems as $item) {
                        if ($item->productVariant) {
                            $item->productVariant->increaseStock($item->quantity);
                        }
                    }
                }
            }

            $order->update($data);

            DB::commit();

            $order->load([
                'user:id,name,email,phone',
                'orderItems.productVariant.product:id,name_en,name_ar',
                'orderItems.productVariant.color',
                'orderItems.productVariant.size',
                'coupon',
            ]);

            return $this->success(new OrderResource($order), 'Order updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to update order: ' . $e->getMessage(), 500);
        }
    }
}
