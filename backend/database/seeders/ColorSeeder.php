<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    public function run(): void
    {
        $colors = [
            ['name_en' => 'Black', 'name_ar' => 'أسود', 'hex_code' => '#000000'],
            ['name_en' => 'White', 'name_ar' => 'أبيض', 'hex_code' => '#FFFFFF'],
            ['name_en' => 'Navy', 'name_ar' => 'كحلي', 'hex_code' => '#001F5B'],
            ['name_en' => 'Red', 'name_ar' => 'أحمر', 'hex_code' => '#FF0000'],
            ['name_en' => 'Green', 'name_ar' => 'أخضر', 'hex_code' => '#228B22'],
            ['name_en' => 'Beige', 'name_ar' => 'بيج', 'hex_code' => '#F5F5DC'],
            ['name_en' => 'Gray', 'name_ar' => 'رمادي', 'hex_code' => '#808080'],
            ['name_en' => 'Brown', 'name_ar' => 'بني', 'hex_code' => '#8B4513'],
            ['name_en' => 'Pink', 'name_ar' => 'وردي', 'hex_code' => '#FFC0CB'],
            ['name_en' => 'Blue', 'name_ar' => 'أزرق', 'hex_code' => '#0000FF'],
            ['name_en' => 'Yellow', 'name_ar' => 'أصفر', 'hex_code' => '#FFD700'],
            ['name_en' => 'Purple', 'name_ar' => 'بنفسجي', 'hex_code' => '#800080'],
            ['name_en' => 'Orange', 'name_ar' => 'برتقالي', 'hex_code' => '#FF8C00'],
            ['name_en' => 'Olive', 'name_ar' => 'زيتوني', 'hex_code' => '#808000'],
            ['name_en' => 'Camel', 'name_ar' => 'جملي', 'hex_code' => '#C19A6B'],
        ];

        foreach ($colors as $color) {
            Color::updateOrCreate(
                ['name_en' => $color['name_en']],
                $color
            );
        }

        $this->command->info('Colors seeded successfully.');
    }
}
