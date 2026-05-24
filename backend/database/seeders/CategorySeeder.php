<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $parentCategories = [
            ['name_en' => "Men's", 'name_ar' => 'رجال', 'sort_order' => 1],
            ['name_en' => "Women's", 'name_ar' => 'نساء', 'sort_order' => 2],
            ['name_en' => "Kids'", 'name_ar' => 'أطفال', 'sort_order' => 3],
            ['name_en' => 'Accessories', 'name_ar' => 'إكسسوارات', 'sort_order' => 4],
        ];

        foreach ($parentCategories as $data) {
            Category::updateOrCreate(
                ['slug' => Str::slug($data['name_en'])],
                [
                    'parent_id' => null,
                    'name_en' => $data['name_en'],
                    'name_ar' => $data['name_ar'],
                    'slug' => Str::slug($data['name_en']),
                    'sort_order' => $data['sort_order'],
                    'is_active' => true,
                ]
            );
        }

        $mensId = Category::where('slug', 'mens')->first()?->id;
        $womensId = Category::where('slug', 'womens')->first()?->id;
        $kidsId = Category::where('slug', 'kids')->first()?->id;
        $accessoriesId = Category::where('slug', 'accessories')->first()?->id;

        $subCategories = [
            // Men's subcategories
            ['parent_id' => $mensId, 'name_en' => 'T-Shirts', 'name_ar' => 'تيشيرتات', 'sort_order' => 1],
            ['parent_id' => $mensId, 'name_en' => 'Shirts', 'name_ar' => 'قمصان', 'sort_order' => 2],
            ['parent_id' => $mensId, 'name_en' => 'Pants', 'name_ar' => 'بناطيل', 'sort_order' => 3],
            ['parent_id' => $mensId, 'name_en' => 'Jackets', 'name_ar' => 'جاكيتات', 'sort_order' => 4],
            ['parent_id' => $mensId, 'name_en' => 'Hoodies', 'name_ar' => 'هوديز', 'sort_order' => 5],
            ['parent_id' => $mensId, 'name_en' => 'Shoes', 'name_ar' => 'أحذية', 'sort_order' => 6],

            // Women's subcategories
            ['parent_id' => $womensId, 'name_en' => 'Dresses', 'name_ar' => 'فساتين', 'sort_order' => 1],
            ['parent_id' => $womensId, 'name_en' => 'Abayas', 'name_ar' => 'عبايات', 'sort_order' => 2],
            ['parent_id' => $womensId, 'name_en' => 'Skirts', 'name_ar' => 'تنانير', 'sort_order' => 3],
            ['parent_id' => $womensId, 'name_en' => 'Blouses', 'name_ar' => 'بلوزات', 'sort_order' => 4],
            ['parent_id' => $womensId, 'name_en' => 'Women Pants', 'name_ar' => 'بناطيل نسائية', 'sort_order' => 5],

            // Kids' subcategories
            ['parent_id' => $kidsId, 'name_en' => 'Boys Clothing', 'name_ar' => 'ملابس أولاد', 'sort_order' => 1],
            ['parent_id' => $kidsId, 'name_en' => 'Girls Clothing', 'name_ar' => 'ملابس بنات', 'sort_order' => 2],
            ['parent_id' => $kidsId, 'name_en' => 'Kids Shoes', 'name_ar' => 'أحذية أطفال', 'sort_order' => 3],

            // Accessories subcategories
            ['parent_id' => $accessoriesId, 'name_en' => 'Bags', 'name_ar' => 'حقائب', 'sort_order' => 1],
            ['parent_id' => $accessoriesId, 'name_en' => 'Belts', 'name_ar' => 'أحزمة', 'sort_order' => 2],
            ['parent_id' => $accessoriesId, 'name_en' => 'Scarves', 'name_ar' => 'أوشحة', 'sort_order' => 3],
            ['parent_id' => $accessoriesId, 'name_en' => 'Hats', 'name_ar' => 'قبعات', 'sort_order' => 4],
        ];

        foreach ($subCategories as $data) {
            if (!$data['parent_id']) continue;

            $slug = Str::slug($data['name_en']);
            $originalSlug = $slug;
            $count = 1;
            while (Category::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'parent_id' => $data['parent_id'],
                    'name_en' => $data['name_en'],
                    'name_ar' => $data['name_ar'],
                    'slug' => $slug,
                    'sort_order' => $data['sort_order'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Categories seeded successfully.');
    }
}
