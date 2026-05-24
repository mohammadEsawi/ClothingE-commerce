<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    public function run(): void
    {
        $clothingSizes = [
            ['name' => 'XS', 'type' => 'clothing', 'sort_order' => 1],
            ['name' => 'S', 'type' => 'clothing', 'sort_order' => 2],
            ['name' => 'M', 'type' => 'clothing', 'sort_order' => 3],
            ['name' => 'L', 'type' => 'clothing', 'sort_order' => 4],
            ['name' => 'XL', 'type' => 'clothing', 'sort_order' => 5],
            ['name' => 'XXL', 'type' => 'clothing', 'sort_order' => 6],
            ['name' => 'XXXL', 'type' => 'clothing', 'sort_order' => 7],
        ];

        $shoeSizes = [
            ['name' => '36', 'type' => 'shoes', 'sort_order' => 1],
            ['name' => '37', 'type' => 'shoes', 'sort_order' => 2],
            ['name' => '38', 'type' => 'shoes', 'sort_order' => 3],
            ['name' => '39', 'type' => 'shoes', 'sort_order' => 4],
            ['name' => '40', 'type' => 'shoes', 'sort_order' => 5],
            ['name' => '41', 'type' => 'shoes', 'sort_order' => 6],
            ['name' => '42', 'type' => 'shoes', 'sort_order' => 7],
            ['name' => '43', 'type' => 'shoes', 'sort_order' => 8],
            ['name' => '44', 'type' => 'shoes', 'sort_order' => 9],
            ['name' => '45', 'type' => 'shoes', 'sort_order' => 10],
        ];

        $accessorySizes = [
            ['name' => 'One Size', 'type' => 'accessories', 'sort_order' => 1],
            ['name' => 'Small', 'type' => 'accessories', 'sort_order' => 2],
            ['name' => 'Medium', 'type' => 'accessories', 'sort_order' => 3],
            ['name' => 'Large', 'type' => 'accessories', 'sort_order' => 4],
        ];

        $allSizes = array_merge($clothingSizes, $shoeSizes, $accessorySizes);

        foreach ($allSizes as $size) {
            Size::updateOrCreate(
                ['name' => $size['name'], 'type' => $size['type']],
                $size
            );
        }

        $this->command->info('Sizes seeded successfully.');
    }
}
