<?php

namespace Database\Seeders;

use App\Models\Barber;
use App\Models\Service;
use App\Models\Shop;
use App\Models\Style;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Core data for the partner shop plus the owner account. Safe to run more than once.
 * Real values (shop name, prices, barbers) are edited by the owner in the app afterwards.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $shop = Shop::firstOrCreate(['slug' => 'kings-cut'], [
            'name' => 'Kings Cut Barbershop', 'area' => 'Poblacion, Tanza, Cavite', 'address' => 'Poblacion, Tanza, Cavite',
            'open_time' => '09:00', 'close_time' => '19:00', 'distance_km' => 1.2, 'is_partner' => true, 'coming_soon' => false,
        ]);
        Shop::firstOrCreate(['slug' => 'fadez-manila'], ['name' => 'Fadez Manila Barber Lounge', 'area' => 'Trece Martires', 'distance_km' => 3.4, 'coming_soon' => true]);
        Shop::firstOrCreate(['slug' => 'gentlemens-chair'], ['name' => "The Gentlemen's Chair", 'area' => 'Imus', 'distance_km' => 5.0, 'coming_soon' => true]);

        if ($shop->services()->doesntExist()) {
            foreach ([
                ['Haircut', 150, 30, true], ['Haircut + Beard Trim', 220, 45, true], ['Haircut + Hair Wash', 200, 40, true],
                ["Kids' Haircut (12 and below)", 120, 25, true], ['Beard Trim Only', 100, 15, false],
            ] as [$n, $p, $m, $h]) {
                $shop->services()->create(['name' => $n, 'price' => $p, 'mins' => $m, 'includes_haircut' => $h]);
            }
        }
        if ($shop->barbers()->doesntExist()) {
            $shop->barbers()->create(['name' => 'Kuya Ramil', 'specialty' => 'Fades, skin fade', 'years' => 8, 'working_days' => [1, 2, 3, 4, 5, 6], 'start_time' => '09:00', 'end_time' => '18:00', 'break_at' => '12:00']);
            $shop->barbers()->create(['name' => 'Jhun', 'specialty' => 'Classic, scissor cut', 'years' => 5, 'working_days' => [0, 1, 2, 3, 5, 6], 'start_time' => '10:00', 'end_time' => '19:00', 'break_at' => '13:00']);
            $shop->barbers()->create(['name' => 'Paolo', 'specialty' => 'Textured, two block, kids', 'years' => 3, 'working_days' => [0, 2, 3, 4, 5, 6], 'start_time' => '09:00', 'end_time' => '17:00', 'break_at' => '12:00']);
        }
        if ($shop->styles()->doesntExist()) {
            foreach ([
                ['midtaper', 'Mid Taper Fade', 'Fades', 40, true], ['lowfade', 'Low Fade', 'Fades', 35, false], ['highfade', 'High Skin Fade', 'Fades', 45, false],
                ['twoblock', 'Two Block', 'Textured', 40, true], ['fringe', 'Textured Fringe', 'Textured', 40, true], ['frenchcrop', 'French Crop', 'Classic', 30, false],
                ['buzz', 'Buzz Cut', 'Classic', 20, false], ['crew', 'Crew Cut', 'Classic', 25, false], ['sidepart', 'Side Part (Classic)', 'Classic', 35, false],
                ['pompadour', 'Pompadour', 'Classic', 45, false], ['mullet', 'Mullet (Modern)', 'Textured', 45, true], ['kids', "Kids' Cut", 'Kids', 25, false],
            ] as [$art, $n, $c, $m, $t]) {
                $shop->styles()->create(['art' => $art, 'name' => $n, 'category' => $c, 'mins' => $m, 'trending' => $t]);
            }
        }

        User::firstOrCreate(['email' => env('OWNER_EMAIL', 'owner@example.com')], [
            'name' => env('OWNER_NAME', 'Shop Owner'), 'password' => env('OWNER_PASSWORD', 'change-me-now'),
            'role' => 'owner', 'shop_id' => $shop->id, 'mobile' => null,
        ]);
    }
}
