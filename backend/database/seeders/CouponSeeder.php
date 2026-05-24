<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'SAVE10',
                'type' => 'percentage',
                'value' => 10.00,
                'min_order_amount' => null,
                'max_discount_amount' => null,
                'max_uses' => null,
                'starts_at' => null,
                'expires_at' => null,
                'is_active' => true,
            ],
            [
                'code' => 'WELCOME20',
                'type' => 'fixed',
                'value' => 20.00,
                'min_order_amount' => 100.00,
                'max_discount_amount' => null,
                'max_uses' => 1000,
                'starts_at' => null,
                'expires_at' => null,
                'is_active' => true,
            ],
            [
                'code' => 'SUMMER15',
                'type' => 'percentage',
                'value' => 15.00,
                'min_order_amount' => 150.00,
                'max_discount_amount' => 80.00,
                'max_uses' => 500,
                'starts_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'FLASH50',
                'type' => 'fixed',
                'value' => 50.00,
                'min_order_amount' => 250.00,
                'max_discount_amount' => null,
                'max_uses' => 100,
                'starts_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addWeeks(2),
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP',
                'type' => 'fixed',
                'value' => 25.00,
                'min_order_amount' => 50.00,
                'max_discount_amount' => 25.00,
                'max_uses' => null,
                'starts_at' => null,
                'expires_at' => null,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $couponData) {
            Coupon::updateOrCreate(
                ['code' => $couponData['code']],
                $couponData
            );
        }

        $this->command->info('Coupons seeded successfully.');
    }
}
