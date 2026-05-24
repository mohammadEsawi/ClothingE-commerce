<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ColorSeeder::class,
            SizeSeeder::class,
            ProductSeeder::class,
            CouponSeeder::class,
        ]);

        $this->command->info('All seeders executed successfully!');
        $this->command->info('Admin credentials: admin@store.com / password');
        $this->command->info('Sample customer: ahmad@example.com / password');
    }
}
