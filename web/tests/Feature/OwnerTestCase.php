<?php

namespace Tests\Feature;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Shop;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/** Shared fixtures: seeded Kings Cut, its owner, a customer, and a second shop with its own owner. */
abstract class OwnerTestCase extends TestCase
{
    use RefreshDatabase;

    protected Shop $shop;
    protected User $owner;
    protected User $customer;
    protected string $date = '2026-10-07'; // Wednesday

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Carbon::setTestNow(Carbon::parse('2026-10-07 10:07:00', 'Asia/Manila'));
        $this->shop = Shop::where('slug', 'kings-cut')->first();
        $this->owner = User::where('role', 'owner')->first();
        $this->customer = User::create(['name' => 'Juan', 'email' => 'juan@example.com', 'mobile' => '09171234567', 'password' => 'password', 'role' => 'customer']);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    protected function book(string $barberName = 'Kuya Ramil', int $start = 14 * 60, array $extra = []): Booking
    {
        $barber = Barber::where('shop_id', $this->shop->id)->where('name', $barberName)->first();

        return app(BookingService::class)->create($extra + [
            'shop_id' => $this->shop->id, 'service_id' => Service::where('shop_id', $this->shop->id)->first()->id, 'barber_id' => $barber->id,
            'date' => $this->date, 'start_min' => $start, 'user_id' => $this->customer->id, 'notify' => false,
            'prefs' => ['guard' => 3, 'top' => 'Short', 'beard' => 'None', 'extras' => ['Hard part'], 'notes' => 'Keep the front long'],
        ]);
    }

    /** A second shop with its own owner and one booking. @return array{0:Shop,1:User,2:Booking} */
    protected function otherShop(): array
    {
        $shop = Shop::create(['name' => 'Other Cuts', 'slug' => 'other-cuts', 'area' => 'Imus', 'is_partner' => true]);
        $svc = $shop->services()->create(['name' => 'Haircut', 'price' => 100, 'mins' => 30]);
        $barber = $shop->barbers()->create(['name' => 'Zed', 'working_days' => [0, 1, 2, 3, 4, 5, 6], 'start_time' => '09:00', 'end_time' => '18:00']);
        $owner = User::create(['name' => 'Other Owner', 'email' => 'other@example.com', 'password' => 'password', 'role' => 'owner', 'shop_id' => $shop->id]);
        $b = app(BookingService::class)->create([
            'shop_id' => $shop->id, 'service_id' => $svc->id, 'barber_id' => $barber->id, 'date' => $this->date, 'start_min' => 11 * 60,
            'guest_name' => 'Secret Person', 'notify' => false,
        ]);

        return [$shop, $owner, $b];
    }
}
