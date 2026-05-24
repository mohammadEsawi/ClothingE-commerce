<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@store.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@store.com',
                'password' => Hash::make('password'),
                'phone' => '+970591234567',
                'role' => 'admin',
                'preferred_language' => 'en',
                'email_verified_at' => now(),
            ]
        );

        // Create sample customers
        $customers = [
            ['name' => 'Ahmad Al-Rashid', 'email' => 'ahmad@example.com', 'phone' => '+970591000001', 'lang' => 'ar'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah@example.com', 'phone' => '+970591000002', 'lang' => 'en'],
            ['name' => 'Mohammed Hassan', 'email' => 'mohammed@example.com', 'phone' => '+970591000003', 'lang' => 'ar'],
            ['name' => 'Emily Smith', 'email' => 'emily@example.com', 'phone' => '+970591000004', 'lang' => 'en'],
            ['name' => 'Fatima Al-Zahra', 'email' => 'fatima@example.com', 'phone' => '+970591000005', 'lang' => 'ar'],
            ['name' => 'Omar Khalil', 'email' => 'omar@example.com', 'phone' => '+970591000006', 'lang' => 'ar'],
            ['name' => 'Layla Mansour', 'email' => 'layla@example.com', 'phone' => '+970591000007', 'lang' => 'ar'],
            ['name' => 'John Williams', 'email' => 'john@example.com', 'phone' => '+970591000008', 'lang' => 'en'],
            ['name' => 'Nour Al-Din', 'email' => 'nour@example.com', 'phone' => '+970591000009', 'lang' => 'ar'],
            ['name' => 'Maria Garcia', 'email' => 'maria@example.com', 'phone' => '+970591000010', 'lang' => 'en'],
        ];

        foreach ($customers as $customer) {
            User::updateOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'email' => $customer['email'],
                    'password' => Hash::make('password'),
                    'phone' => $customer['phone'],
                    'role' => 'customer',
                    'preferred_language' => $customer['lang'],
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Users seeded successfully.');
    }
}
