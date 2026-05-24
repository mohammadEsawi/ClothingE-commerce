<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get();

        return $this->success($addresses, 'Addresses retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state_province' => 'required|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $user = $request->user();

        if ($request->boolean('is_default')) {
            Address::where('user_id', $user->id)->update(['is_default' => false]);
        }

        $isFirst = !Address::where('user_id', $user->id)->exists();

        $address = Address::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'address_line1' => $request->address_line1,
            'address_line2' => $request->address_line2,
            'city' => $request->city,
            'state_province' => $request->state_province,
            'country' => $request->country ?? 'Palestine',
            'postal_code' => $request->postal_code,
            'is_default' => $request->boolean('is_default') || $isFirst,
        ]);

        return $this->created($address, 'Address added successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address_line1' => 'sometimes|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'state_province' => 'sometimes|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($request->boolean('is_default')) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address->update($request->only([
            'full_name', 'phone', 'address_line1', 'address_line2',
            'city', 'state_province', 'country', 'postal_code', 'is_default',
        ]));

        return $this->success($address->fresh(), 'Address updated successfully');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $newDefault = Address::where('user_id', $request->user()->id)->first();
            if ($newDefault) {
                $newDefault->update(['is_default' => true]);
            }
        }

        return $this->success(null, 'Address deleted successfully');
    }
}
