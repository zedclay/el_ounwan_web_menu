<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $imgCoffee = 'assets/images/menu/coffee.jpg';
        $imgSpanishLatte = 'assets/images/menu/spanish-latte.jpg';
        $imgIcedHoney = 'assets/images/menu/iced-honey.jpg';
        $imgMatcha = 'assets/images/menu/matcha.jpg';
        $imgChocolate = 'assets/images/menu/chocolate.jpg';
        $imgTeaJuice = 'assets/images/menu/tea-juice.jpg';
        $imgBakery = 'assets/images/menu/bakery.jpg';
        $imgCrepe = 'assets/images/menu/crepe.jpg';
        $imgEatery = 'assets/images/menu/eatery.jpg';
        $imgSalad = 'assets/images/menu/salad.jpg';

        return response()->json([
            'categories' => [
                [
                    'id' => 'coffee',
                    'label' => 'Coffee • القهوة',
                    'items' => [
                        [
                            'id' => 'house-blend-coffee',
                            'name' => 'House Blend Coffee',
                            'price' => '300 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'espresso-pods',
                            'name' => 'Espresso Pods',
                            'price' => '300 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'cafe-latte-vanilla-hazelnut',
                            'name' => 'Café Latte',
                            'price' => '500 DA',
                            'description' => 'Vanilla • Hazelnut',
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'cappuccino-vanilla-hazelnut',
                            'name' => 'Cappuccino',
                            'price' => '500 DA',
                            'description' => 'Vanilla • Hazelnut',
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'spanish-latte',
                            'name' => 'Spanish Latte',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgSpanishLatte,
                        ],
                    ],
                ],
                [
                    'id' => 'iced-cold',
                    'label' => 'Iced & Cold • بارد',
                    'items' => [
                        [
                            'id' => 'ice-coffee-vanilla-hazelnut',
                            'name' => 'Ice Coffee',
                            'price' => '500 DA',
                            'description' => 'Vanilla • Hazelnut',
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'ice-latte-vanilla-hazelnut',
                            'name' => 'Ice Latte',
                            'price' => '500 DA',
                            'description' => 'Vanilla • Hazelnut',
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'salted-cream-coffee',
                            'name' => 'Salted Cream Coffee',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'ice-honey-cappuccino',
                            'name' => 'Ice Honey Cappuccino',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgIcedHoney,
                        ],
                        [
                            'id' => 'peanut-coffee-vanilla',
                            'name' => 'Peanut Coffee Vanilla',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'mocha-strawberry',
                            'name' => 'Mocha Strawberry',
                            'price' => '650 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'mocha-brown-sugar',
                            'name' => 'Mocha Brown Sugar',
                            'price' => '650 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'coconut-cloud-matcha',
                            'name' => 'Coconut Cloud Matcha',
                            'price' => '900 DA',
                            'description' => null,
                            'imageUrl' => $imgMatcha,
                        ],
                        [
                            'id' => 'sweet-cream-matcha',
                            'name' => 'Sweet Cream Matcha',
                            'price' => '900 DA',
                            'description' => null,
                            'imageUrl' => $imgMatcha,
                        ],
                    ],
                ],
                [
                    'id' => 'non-coffee',
                    'label' => 'Non Coffee • بدون قهوة',
                    'items' => [
                        [
                            'id' => 'hot-chocolate',
                            'name' => 'Hot Chocolate',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'salt-caramel-latte',
                            'name' => 'Salt Caramel Latte',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                        [
                            'id' => 'peanut-butter-cocoa',
                            'name' => 'Peanut Butter Cocoa',
                            'price' => '700 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'matcha-latte',
                            'name' => 'Matcha Latte',
                            'price' => '900 DA',
                            'description' => null,
                            'imageUrl' => $imgMatcha,
                        ],
                    ],
                ],
                [
                    'id' => 'tea',
                    'label' => 'Tea Selection • شاي',
                    'items' => [
                        [
                            'id' => 'tea-selection',
                            'name' => 'Tea Selection',
                            'price' => '400 DA',
                            'description' => 'Rotating flavours — please ask for details',
                            'imageUrl' => $imgTeaJuice,
                        ],
                    ],
                ],
                [
                    'id' => 'fresh-squeeze',
                    'label' => 'Fresh Squeeze • عصائر',
                    'items' => [
                        [
                            'id' => 'fresh-juice',
                            'name' => 'Fresh Juice',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'fruit-cocktail',
                            'name' => 'Fruit Cocktail',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'red-lime-soda',
                            'name' => 'Red Lime Soda',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'karkade-mint-ice-tea',
                            'name' => 'Karkadé Mint Ice Tea',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'virgin-mojito',
                            'name' => 'Virgin Mojito',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'raspberry-mojito',
                            'name' => 'Raspberry Mojito',
                            'price' => '600 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'cherry-berry-fizz',
                            'name' => 'Cherry Berry Fizz',
                            'price' => '650 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'pineapple-coconut',
                            'name' => 'Pineapple Coconut',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'matcha-lime-soda',
                            'name' => 'Matcha Lime Soda',
                            'price' => '850 DA',
                            'description' => null,
                            'imageUrl' => $imgMatcha,
                        ],
                    ],
                ],
                [
                    'id' => 'bakery',
                    'label' => 'Bakery • المخبوزات',
                    'items' => [
                        [
                            'id' => 'croissant',
                            'name' => 'Croissant',
                            'price' => '250 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'glazed-lemon-cake',
                            'name' => 'Glazed Lemon Cake',
                            'price' => '400 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'marble-duo-cake',
                            'name' => 'Marble Duo Cake',
                            'price' => '400 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'pretty-cookie',
                            'name' => 'Pretty Cookie',
                            'price' => '400 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'house-tiramisu',
                            'name' => 'House Tiramisu',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'french-tartlets',
                            'name' => 'French Tartlets',
                            'price' => '500 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'hot-fondant',
                            'name' => 'Hot Fondant',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'bold-brownie',
                            'name' => 'Bold Brownie',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'house-pastries',
                            'name' => 'House Pastries',
                            'price' => '700 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                        [
                            'id' => 'granola',
                            'name' => 'Granola',
                            'price' => '700 DA',
                            'description' => null,
                            'imageUrl' => $imgBakery,
                        ],
                    ],
                ],
                [
                    'id' => 'crepes-waffles',
                    'label' => 'Crepes & Waffles • كريب',
                    'items' => [
                        [
                            'id' => 'classic-chocolate',
                            'name' => 'Classic Chocolate',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgCrepe,
                        ],
                        [
                            'id' => 'honey-fruits',
                            'name' => 'Honey Fruits',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgCrepe,
                        ],
                        [
                            'id' => 'white-chocolate',
                            'name' => 'White Chocolate',
                            'price' => '750 DA',
                            'description' => null,
                            'imageUrl' => $imgCrepe,
                        ],
                    ],
                ],
                [
                    'id' => 'toppings',
                    'label' => 'Toppings • إضافات',
                    'items' => [
                        [
                            'id' => 'chocolate-sauce',
                            'name' => 'Chocolate Sauce',
                            'price' => '200 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'white-chocolate-sauce',
                            'name' => 'White Chocolate',
                            'price' => '200 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'fruits',
                            'name' => 'Fruits',
                            'price' => '200 DA',
                            'description' => null,
                            'imageUrl' => $imgTeaJuice,
                        ],
                        [
                            'id' => 'roasted-almonds',
                            'name' => 'Roasted Almonds',
                            'price' => '200 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'pistachio-sauce',
                            'name' => 'Pistachio Sauce',
                            'price' => '300 DA',
                            'description' => null,
                            'imageUrl' => $imgChocolate,
                        ],
                        [
                            'id' => 'condensed-milk',
                            'name' => 'Condensed Milk',
                            'price' => '200 DA',
                            'description' => null,
                            'imageUrl' => $imgCoffee,
                        ],
                    ],
                ],
                [
                    'id' => 'eatery',
                    'label' => 'Eatery • المأكولات',
                    'items' => [
                        [
                            'id' => 'home-made-quiche',
                            'name' => 'Home Made Quiche',
                            'price' => '400 DA',
                            'description' => null,
                            'imageUrl' => $imgEatery,
                        ],
                        [
                            'id' => 'roasted-camembert',
                            'name' => 'Roasted Camembert',
                            'price' => '1000 DA',
                            'description' => null,
                            'imageUrl' => $imgEatery,
                        ],
                        [
                            'id' => 'caprese-salad',
                            'name' => 'Caprese Salad',
                            'price' => '1000 DA',
                            'description' => null,
                            'imageUrl' => $imgSalad,
                        ],
                        [
                            'id' => 'burrata-salad',
                            'name' => 'Burrata Salad',
                            'price' => '1300 DA',
                            'description' => null,
                            'imageUrl' => $imgSalad,
                        ],
                        [
                            'id' => 'club-sandwich-pesto-chicken',
                            'name' => 'Club Sandwich Pesto Chicken',
                            'price' => '700 DA',
                            'description' => null,
                            'imageUrl' => $imgEatery,
                        ],
                        [
                            'id' => 'club-sandwich-grilled-cheese',
                            'name' => 'Club Sandwich Grilled Cheese',
                            'price' => '700 DA',
                            'description' => null,
                            'imageUrl' => $imgEatery,
                        ],
                        [
                            'id' => 'chicken-crepe',
                            'name' => 'Chicken Crepe',
                            'price' => '1000 DA',
                            'description' => null,
                            'imageUrl' => $imgCrepe,
                        ],
                    ],
                ],
            ],
        ]);
    }
}
