<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Size;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $blackId = Color::where('name_en', 'Black')->value('id');
        $whiteId = Color::where('name_en', 'White')->value('id');
        $navyId = Color::where('name_en', 'Navy')->value('id');
        $redId = Color::where('name_en', 'Red')->value('id');
        $greenId = Color::where('name_en', 'Green')->value('id');
        $beigeId = Color::where('name_en', 'Beige')->value('id');
        $grayId = Color::where('name_en', 'Gray')->value('id');
        $brownId = Color::where('name_en', 'Brown')->value('id');
        $pinkId = Color::where('name_en', 'Pink')->value('id');
        $blueId = Color::where('name_en', 'Blue')->value('id');

        $sId = Size::where('name', 'S')->where('type', 'clothing')->value('id');
        $mId = Size::where('name', 'M')->where('type', 'clothing')->value('id');
        $lId = Size::where('name', 'L')->where('type', 'clothing')->value('id');
        $xlId = Size::where('name', 'XL')->where('type', 'clothing')->value('id');
        $xxlId = Size::where('name', 'XXL')->where('type', 'clothing')->value('id');
        $size40 = Size::where('name', '40')->where('type', 'shoes')->value('id');
        $size41 = Size::where('name', '41')->where('type', 'shoes')->value('id');
        $size42 = Size::where('name', '42')->where('type', 'shoes')->value('id');
        $size43 = Size::where('name', '43')->where('type', 'shoes')->value('id');

        $tshirtsId = Category::where('slug', 't-shirts')->value('id');
        $shirtsId = Category::where('slug', 'shirts')->value('id');
        $pantsId = Category::where('slug', 'pants')->value('id');
        $jacketsId = Category::where('slug', 'jackets')->value('id');
        $hoodiesId = Category::where('slug', 'hoodies')->value('id');
        $shoesId = Category::where('slug', 'shoes')->value('id');
        $dressesId = Category::where('slug', 'dresses')->value('id');
        $abayasId = Category::where('slug', 'abayas')->value('id');
        $skirtsId = Category::where('slug', 'skirts')->value('id');
        $bagsId = Category::where('slug', 'bags')->value('id');

        $products = [
            [
                'category_id' => $tshirtsId,
                'name_en' => 'Classic Cotton Crew-Neck T-Shirt',
                'name_ar' => 'تيشيرت قطني كلاسيكي',
                'description_en' => 'A timeless essential crafted from 100% premium cotton. Soft, breathable, and perfect for everyday wear. Features a classic crew-neck design with a relaxed fit.',
                'description_ar' => 'قطعة أساسية خالدة مصنوعة من القطن المصري الخالص. ناعم وقابل للتنفس ومثالي للارتداء اليومي. يتميز بتصميم رقبة دائرية كلاسيكية مع قصة مريحة.',
                'base_price' => 89.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => [
                    '/storage/products/placeholder.jpg',
                    '/storage/products/placeholder-2.jpg',
                ],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 30],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 25],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 20],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 20],
                    ['color_id' => $whiteId, 'size_id' => $lId, 'stock' => 15],
                    ['color_id' => $navyId, 'size_id' => $sId, 'stock' => 10],
                ],
            ],
            [
                'category_id' => $tshirtsId,
                'name_en' => 'Striped Polo Shirt',
                'name_ar' => 'قميص بولو مخطط',
                'description_en' => 'A stylish striped polo shirt made from breathable pique cotton. Features a classic two-button placket and ribbed collar. Perfect for smart casual occasions.',
                'description_ar' => 'قميص بولو مخطط أنيق مصنوع من قطن بيكيه قابل للتنفس. يتميز بياقة ضلعية ومشبك كلاسيكي بزرين. مثالي للمناسبات شبه الرسمية.',
                'base_price' => 120.00,
                'sale_price' => 99.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $navyId, 'size_id' => $sId, 'stock' => 15],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 20],
                    ['color_id' => $navyId, 'size_id' => $lId, 'stock' => 12],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $whiteId, 'size_id' => $xlId, 'stock' => 5],
                ],
            ],
            [
                'category_id' => $shirtsId,
                'name_en' => 'Slim Fit Oxford Dress Shirt',
                'name_ar' => 'قميص أكسفورد سليم فيت',
                'description_en' => 'A refined Oxford dress shirt with slim fit cut. Crafted from wrinkle-resistant Oxford cotton blend. Perfect for office and formal settings.',
                'description_ar' => 'قميص أكسفورد رسمي بقصة ضيقة. مصنوع من خليط القطن المقاوم للتجعد. مثالي لبيئات العمل والمناسبات الرسمية.',
                'base_price' => 185.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $sId, 'stock' => 12],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 18],
                    ['color_id' => $whiteId, 'size_id' => $lId, 'stock' => 15],
                    ['color_id' => $blueId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $blueId, 'size_id' => $lId, 'stock' => 8],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 6],
                ],
            ],
            [
                'category_id' => $pantsId,
                'name_en' => 'Classic Slim Chino Pants',
                'name_ar' => 'بنطال تشينو سليم كلاسيكي',
                'description_en' => 'Versatile slim-fit chino pants crafted from premium stretch cotton. Features five-pocket styling with a modern tapered leg. Perfect transition piece from office to weekend.',
                'description_ar' => 'بنطال تشينو متعدد الاستخدامات بقصة ضيقة مصنوع من القطن المطاطي الممتاز. يتميز بتصميم خمسة جيوب مع ساق مستدقة عصرية.',
                'base_price' => 220.00,
                'sale_price' => 179.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $beigeId, 'size_id' => $sId, 'stock' => 8],
                    ['color_id' => $beigeId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $beigeId, 'size_id' => $lId, 'stock' => 10],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $navyId, 'size_id' => $lId, 'stock' => 5],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $xlId, 'stock' => 3],
                ],
            ],
            [
                'category_id' => $jacketsId,
                'name_en' => 'Classic Denim Jacket',
                'name_ar' => 'جاكيت جينز كلاسيكي',
                'description_en' => 'A wardrobe staple denim jacket made from 100% cotton denim. Features classic button closure, chest pockets, and adjustable button cuffs. Perfectly worn year-round.',
                'description_ar' => 'جاكيت جينز أساسي في خزانة الملابس مصنوع من قطن الدنيم الخالص. يتميز بإغلاق أزرار كلاسيكي وجيوب صدر وأساور بأزرار قابلة للتعديل.',
                'base_price' => 350.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blueId, 'size_id' => $sId, 'stock' => 5],
                    ['color_id' => $blueId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $blueId, 'size_id' => $lId, 'stock' => 7],
                    ['color_id' => $blueId, 'size_id' => $xlId, 'stock' => 4],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 5],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 3],
                ],
            ],
            [
                'category_id' => $hoodiesId,
                'name_en' => 'Fleece Pullover Hoodie',
                'name_ar' => 'هودي فليس بولوفر',
                'description_en' => 'Ultra-soft fleece pullover hoodie for ultimate comfort. Features kangaroo pocket, adjustable drawstring hood, and ribbed cuffs and hem.',
                'description_ar' => 'هودي فليس بولوفر فائق الليونة للراحة المطلقة. يتميز بجيب الكانغارو والغطاء ذو الخيط القابل للتعديل والأساور والحاشية المضلعة.',
                'base_price' => 180.00,
                'sale_price' => 149.00,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $grayId, 'size_id' => $sId, 'stock' => 15],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 20],
                    ['color_id' => $grayId, 'size_id' => $lId, 'stock' => 18],
                    ['color_id' => $grayId, 'size_id' => $xlId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 8],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 5],
                ],
            ],
            [
                'category_id' => $dressesId,
                'name_en' => 'Floral Wrap Midi Dress',
                'name_ar' => 'فستان ميدي ورودي رابط',
                'description_en' => 'An elegant floral print wrap midi dress made from soft chiffon fabric. Features a V-neckline, adjustable waist tie, and flowing midi length. Perfect for special occasions.',
                'description_ar' => 'فستان ميدي رابط بطبعة زهرية أنيقة مصنوع من قماش الشيفون الناعم. يتميز بفتحة رقبة على شكل V وربطة خصر قابلة للتعديل وطول ميدي سائل.',
                'base_price' => 280.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $pinkId, 'size_id' => $sId, 'stock' => 8],
                    ['color_id' => $pinkId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $pinkId, 'size_id' => $lId, 'stock' => 6],
                    ['color_id' => $blueId, 'size_id' => $sId, 'stock' => 5],
                    ['color_id' => $blueId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $greenId, 'size_id' => $mId, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $abayasId,
                'name_en' => 'Elegant Open Abaya',
                'name_ar' => 'عباية مفتوحة أنيقة',
                'description_en' => 'A stunning open front abaya crafted from premium crepe fabric. Features delicate embroidery on the cuffs and hemline, creating an elegant and modest look.',
                'description_ar' => 'عباية مفتوحة رائعة مصنوعة من قماش الكريب الممتاز. تتميز بتطريز رقيق على الأساور والحاشية، مما يخلق مظهراً أنيقاً ومحتشماً.',
                'base_price' => 320.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 8],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $xlId, 'stock' => 6],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 5],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $skirtsId,
                'name_en' => 'A-Line Pleated Midi Skirt',
                'name_ar' => 'تنورة ميدي مكسرات A-Line',
                'description_en' => 'A beautiful A-line pleated midi skirt crafted from flowy chiffon. The pleats add graceful movement to this versatile piece. Perfect for both casual and formal occasions.',
                'description_ar' => 'تنورة ميدي مكسرات A-Line جميلة مصنوعة من الشيفون السائل. تضيف الكسرات حركة رشيقة لهذه القطعة متعددة الاستخدامات.',
                'base_price' => 160.00,
                'sale_price' => 129.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 8],
                    ['color_id' => $beigeId, 'size_id' => $sId, 'stock' => 6],
                    ['color_id' => $beigeId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $pinkId, 'size_id' => $mId, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $shoesId,
                'name_en' => 'Classic Leather Sneakers',
                'name_ar' => 'حذاء رياضي جلد كلاسيكي',
                'description_en' => 'Clean, minimalist leather sneakers crafted from premium full-grain leather. Features a cushioned insole and durable rubber outsole. Versatile enough for any casual outfit.',
                'description_ar' => 'حذاء رياضي جلد نظيف وبسيط مصنوع من الجلد الطبيعي الممتاز. يتميز بنعل داخلي مبطن ونعل خارجي مطاطي متين.',
                'base_price' => 280.00,
                'sale_price' => 239.00,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $size40, 'stock' => 5],
                    ['color_id' => $whiteId, 'size_id' => $size41, 'stock' => 8],
                    ['color_id' => $whiteId, 'size_id' => $size42, 'stock' => 10],
                    ['color_id' => $whiteId, 'size_id' => $size43, 'stock' => 6],
                    ['color_id' => $blackId, 'size_id' => $size41, 'stock' => 7],
                    ['color_id' => $blackId, 'size_id' => $size42, 'stock' => 9],
                    ['color_id' => $blackId, 'size_id' => $size43, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $tshirtsId,
                'name_en' => 'Graphic Print Oversized T-Shirt',
                'name_ar' => 'تيشيرت أوفرسايز بطباعة',
                'description_en' => 'A trendy oversized t-shirt featuring a unique graphic print. Made from soft cotton blend for all-day comfort. A statement piece for streetwear enthusiasts.',
                'description_ar' => 'تيشيرت أوفرسايز عصري يتميز بطباعة فريدة. مصنوع من خليط القطن الناعم للراحة طوال اليوم.',
                'base_price' => 110.00,
                'sale_price' => null,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 20],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 25],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 18],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 15],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 12],
                ],
            ],
            [
                'category_id' => $pantsId,
                'name_en' => 'Relaxed Fit Linen Pants',
                'name_ar' => 'بنطال كتان مريح',
                'description_en' => 'Lightweight linen pants for warm weather comfort. Features a relaxed fit with elastic waistband and two side pockets. Breathable and stylish for summer.',
                'description_ar' => 'بنطال كتان خفيف الوزن للراحة في الطقس الدافئ. يتميز بقصة مريحة مع خصر مطاطي وجيبين جانبيين.',
                'base_price' => 195.00,
                'sale_price' => null,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $sId, 'stock' => 8],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $beigeId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $beigeId, 'size_id' => $lId, 'stock' => 8],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 6],
                ],
            ],
            [
                'category_id' => $jacketsId,
                'name_en' => 'Quilted Puffer Jacket',
                'name_ar' => 'جاكيت بافر مبطن',
                'description_en' => 'A warm and stylish quilted puffer jacket perfect for cold weather. Features a lightweight yet warm fill, water-resistant shell, and multiple pockets.',
                'description_ar' => 'جاكيت بافر مبطن دافئ وأنيق مثالي للطقس البارد. يتميز بحشو خفيف الوزن ودافئ وغلاف مقاوم للماء وجيوب متعددة.',
                'base_price' => 340.00,
                'sale_price' => 299.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 4],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 6],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 5],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 3],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 2],
                ],
            ],
            [
                'category_id' => $dressesId,
                'name_en' => 'Casual Linen Shirt Dress',
                'name_ar' => 'فستان قميص كتان كاجوال',
                'description_en' => 'A comfortable and chic linen shirt dress. Features a button-down front, rolled-up sleeves, and a relaxed silhouette. Perfect for casual days out.',
                'description_ar' => 'فستان قميص كتان مريح وأنيق. يتميز بواجهة أزرار وأكمام ملفوفة وصورة ظلية مريحة. مثالي لأيام الخروج العادية.',
                'base_price' => 210.00,
                'sale_price' => null,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $sId, 'stock' => 6],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $beigeId, 'size_id' => $mId, 'stock' => 7],
                    ['color_id' => $beigeId, 'size_id' => $lId, 'stock' => 5],
                    ['color_id' => $blueId, 'size_id' => $mId, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $bagsId,
                'name_en' => 'Leather Tote Bag',
                'name_ar' => 'حقيبة توت جلدية',
                'description_en' => 'A spacious and stylish leather tote bag. Features a zip closure, inner pockets, and comfortable handles. Perfect for daily use or shopping trips.',
                'description_ar' => 'حقيبة توت جلدية واسعة وأنيقة. تتميز بإغلاق بسحاب وجيوب داخلية ومقابض مريحة. مثالية للاستخدام اليومي أو رحلات التسوق.',
                'base_price' => 250.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => null, 'stock' => 10],
                    ['color_id' => $brownId, 'size_id' => null, 'stock' => 8],
                    ['color_id' => $beigeId, 'size_id' => null, 'stock' => 6],
                    ['color_id' => $redId, 'size_id' => null, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $hoodiesId,
                'name_en' => 'Zip-Up Hoodie Sweatshirt',
                'name_ar' => 'سويتشيرت هودي بسحاب',
                'description_en' => 'A comfortable zip-up hoodie perfect for layering. Made from a warm cotton-poly blend with a fleece lining. Features full-length zipper and kangaroo pockets.',
                'description_ar' => 'هودي بسحاب مريح مثالي للطبقات. مصنوع من خليط قطن-بوليستر دافئ مع بطانة فليس.',
                'base_price' => 165.00,
                'sale_price' => 135.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $grayId, 'size_id' => $sId, 'stock' => 12],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 15],
                    ['color_id' => $grayId, 'size_id' => $lId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $blackId, 'size_id' => $xlId, 'stock' => 5],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 3],
                ],
            ],
            [
                'category_id' => $shirtsId,
                'name_en' => 'Casual Linen Short Sleeve Shirt',
                'name_ar' => 'قميص كتان كاجوال بأكمام قصيرة',
                'description_en' => 'A breathable short sleeve linen shirt for hot days. Features a button-down front, chest pocket, and relaxed fit. Available in natural earth tones.',
                'description_ar' => 'قميص كتان قصير الأكمام قابل للتنفس لأيام الحر. يتميز بواجهة أزرار وجيب صدر وقصة مريحة.',
                'base_price' => 145.00,
                'sale_price' => null,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $sId, 'stock' => 8],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $beigeId, 'size_id' => $mId, 'stock' => 10],
                    ['color_id' => $blueId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $greenId, 'size_id' => $lId, 'stock' => 4],
                ],
            ],
            [
                'category_id' => $abayasId,
                'name_en' => 'Modern Butterfly Abaya',
                'name_ar' => 'عباية فراشة عصرية',
                'description_en' => 'A contemporary butterfly abaya with flowing sleeves. Made from premium georgette fabric with subtle floral embroidery. A perfect blend of modesty and modern style.',
                'description_ar' => 'عباية فراشة معاصرة بأكمام سائلة. مصنوعة من قماش الجورجيت الممتاز مع تطريز زهري خفيف. مزيج مثالي من الحشمة والأسلوب العصري.',
                'base_price' => 380.00,
                'sale_price' => 320.00,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 5],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 6],
                    ['color_id' => $blackId, 'size_id' => $xlId, 'stock' => 3],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 4],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 2],
                ],
            ],
            [
                'category_id' => $tshirtsId,
                'name_en' => 'Premium Henley T-Shirt',
                'name_ar' => 'تيشيرت هنلي بريميوم',
                'description_en' => 'A stylish henley t-shirt featuring a classic 3-button placket. Made from premium 100% Pima cotton for exceptional softness and durability.',
                'description_ar' => 'تيشيرت هنلي أنيق يتميز بمشبك كلاسيكي بثلاثة أزرار. مصنوع من القطن بيما الممتاز 100% للنعومة والمتانة الاستثنائية.',
                'base_price' => 130.00,
                'sale_price' => null,
                'is_featured' => false,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $whiteId, 'size_id' => $sId, 'stock' => 10],
                    ['color_id' => $whiteId, 'size_id' => $mId, 'stock' => 15],
                    ['color_id' => $grayId, 'size_id' => $mId, 'stock' => 12],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 8],
                    ['color_id' => $blackId, 'size_id' => $lId, 'stock' => 6],
                ],
            ],
            [
                'category_id' => $dressesId,
                'name_en' => 'Satin Evening Dress',
                'name_ar' => 'فستان سهرة ساتان',
                'description_en' => 'An exquisite satin evening dress for special occasions. Features an elegant draping design, adjustable spaghetti straps, and a subtle slit. Luxurious and eye-catching.',
                'description_ar' => 'فستان سهرة ساتان رائع للمناسبات الخاصة. يتميز بتصميم تعليق أنيق وأحزمة إيطالية قابلة للتعديل وشق خفيف. فاخر ولافت للنظر.',
                'base_price' => 420.00,
                'sale_price' => null,
                'is_featured' => true,
                'images' => ['/storage/products/placeholder.jpg'],
                'variants' => [
                    ['color_id' => $blackId, 'size_id' => $sId, 'stock' => 4],
                    ['color_id' => $blackId, 'size_id' => $mId, 'stock' => 6],
                    ['color_id' => $redId, 'size_id' => $sId, 'stock' => 3],
                    ['color_id' => $redId, 'size_id' => $mId, 'stock' => 4],
                    ['color_id' => $navyId, 'size_id' => $mId, 'stock' => 3],
                ],
            ],
        ];

        foreach ($products as $productData) {
            if (!$productData['category_id']) {
                continue;
            }

            $slug = Str::slug($productData['name_en']);
            $originalSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $productData['category_id'],
                    'name_en' => $productData['name_en'],
                    'name_ar' => $productData['name_ar'],
                    'slug' => $slug,
                    'description_en' => $productData['description_en'],
                    'description_ar' => $productData['description_ar'],
                    'base_price' => $productData['base_price'],
                    'sale_price' => $productData['sale_price'],
                    'is_featured' => $productData['is_featured'],
                    'is_active' => true,
                    'views' => rand(50, 2000),
                ]
            );

            // Create images
            if (isset($productData['images'])) {
                $product->images()->delete();
                foreach ($productData['images'] as $index => $imageUrl) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imageUrl,
                        'alt_text' => $product->name_en . ' - Image ' . ($index + 1),
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }

            // Create variants
            if (isset($productData['variants'])) {
                foreach ($productData['variants'] as $vData) {
                    $skuParts = [
                        strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $productData['name_en']), 0, 4)),
                        $vData['color_id'] ? str_pad($vData['color_id'], 2, '0', STR_PAD_LEFT) : '00',
                        $vData['size_id'] ? str_pad($vData['size_id'], 2, '0', STR_PAD_LEFT) : '00',
                        $product->id,
                        rand(100, 999),
                    ];
                    $sku = implode('-', $skuParts);

                    $quantity = $vData['stock'];
                    $threshold = 5;
                    $status = $quantity <= 0 ? 'out_of_stock' : ($quantity <= $threshold ? 'low_stock' : 'in_stock');

                    ProductVariant::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'color_id' => $vData['color_id'],
                            'size_id' => $vData['size_id'],
                        ],
                        [
                            'sku' => $sku,
                            'price_override' => null,
                            'stock_quantity' => $quantity,
                            'low_stock_threshold' => $threshold,
                            'status' => $status,
                        ]
                    );
                }
            }
        }

        $this->command->info('Products seeded successfully.');
    }
}
