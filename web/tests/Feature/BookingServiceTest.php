<?php

namespace Tests\Feature;

use App\Exceptions\SlotTakenException;
use App\Models\Barber;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Shop;
use App\Models\Style;
use App\Models\User;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingServiceTest extends TestCase
{
    use RefreshDatabase;

    private Shop $shop;
    private string $date;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        // Wednesday 2026-10-07 at 08:00 Manila time, before opening.
        Carbon::setTestNow(Carbon::parse('2026-10-07 08:00:00', 'Asia/Manila'));
        $this->shop = Shop::where('slug', 'kings-cut')->first();
        $this->date = '2026-10-07';
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function input(array $over = []): array
    {
        $barber = Barber::where('name', 'Kuya Ramil')->first();

        return array_merge([
            'shop_id' => $this->shop->id,
            'service_id' => Service::where('name', 'Haircut')->first()->id,
            'style_id' => null,
            'barber_id' => $barber->id,
            'date' => $this->date,
            'start_min' => 600, // 10:00 AM
            'user_id' => User::factory()->create()->id,
            'prefs' => ['guard' => 2],
        ], $over);
    }

    public function test_creates_booking_with_reference_price_and_duration(): void
    {
        $b = app(BookingService::class)->create($this->input());
        $this->assertMatchesRegularExpression('/^BB-2026-\d{5}$/', $b->reference);
        $this->assertSame('150.00', (string) $b->price);
        $this->assertSame(30, $b->duration);
        $this->assertSame('confirmed', $b->status);
    }

    public function test_long_style_lengthens_the_booking(): void
    {
        $style = Style::where('name', 'High Skin Fade')->first(); // 45 mins
        $b = app(BookingService::class)->create($this->input(['style_id' => $style->id]));
        $this->assertSame(45, $b->duration);
    }

    public function test_double_booking_the_same_barber_is_rejected(): void
    {
        app(BookingService::class)->create($this->input());
        $this->expectException(SlotTakenException::class);
        app(BookingService::class)->create($this->input(['start_min' => 615])); // overlaps 10:00-10:30
    }

    public function test_overlap_by_a_long_style_is_rejected(): void
    {
        $long = Style::where('name', 'High Skin Fade')->first(); // 45 mins -> 10:00 to 10:45
        app(BookingService::class)->create($this->input(['style_id' => $long->id]));
        $this->expectException(SlotTakenException::class);
        app(BookingService::class)->create($this->input(['start_min' => 630])); // 10:30 clashes
    }

    public function test_adjacent_bookings_are_allowed(): void
    {
        app(BookingService::class)->create($this->input());
        $b = app(BookingService::class)->create($this->input(['start_min' => 630]));
        $this->assertSame(630, $b->start_min);
    }

    public function test_break_closed_hours_days_off_and_past_are_rejected(): void
    {
        $svc = app(BookingService::class);
        foreach ([720 /* break 12:00 */, 540 - 60 /* before opening */, 1050 /* 5:30 PM ends 6:00 ok? */] as $i => $start) {
            // 1050 (5:30 PM) is still valid for a 30 min cut ending 6:00 PM; only the first two must fail.
            if ($i === 2) {
                $this->assertSame(1050, $svc->create($this->input(['start_min' => $start]))->start_min);
                continue;
            }
            try {
                $svc->create($this->input(['start_min' => $start]));
                $this->fail("start {$start} should be rejected");
            } catch (SlotTakenException) {
                $this->assertTrue(true);
            }
        }
        // Past time today
        Carbon::setTestNow(Carbon::parse('2026-10-07 11:00:00', 'Asia/Manila'));
        $this->expectException(SlotTakenException::class);
        $svc->create($this->input(['start_min' => 600]));
    }

    public function test_day_off_blocks_booking(): void
    {
        $barber = Barber::where('name', 'Kuya Ramil')->first();
        $barber->dayOffs()->create(['date' => $this->date]);
        $this->expectException(SlotTakenException::class);
        app(BookingService::class)->create($this->input());
    }

    public function test_any_barber_auto_assigns_a_free_one(): void
    {
        $svc = app(BookingService::class);
        $first = $svc->create($this->input(['barber_id' => 'any', 'start_min' => 660]));
        $second = $svc->create($this->input(['barber_id' => 'any', 'start_min' => 660]));
        $this->assertNotSame($first->barber_id, $second->barber_id);
    }

    public function test_cancel_frees_the_slot_and_reschedule_keeps_the_reference(): void
    {
        $svc = app(BookingService::class);
        $a = $svc->create($this->input());
        $moved = $svc->reschedule($a, $this->date, 690, $a->barber_id);
        $this->assertSame($a->reference, $moved->reference);
        $this->assertSame(690, $moved->start_min);
        // old slot now free again
        $this->assertTrue((new AvailabilityService())->isFree($a->barber, $this->date, 600, 30));

        $svc->cancel($moved, 'Schedule conflict');
        $this->assertTrue((new AvailabilityService())->isFree($a->barber, $this->date, 690, 30));
        $this->assertSame('cancelled', $moved->fresh()->status);
    }

    public function test_rating_only_after_done_and_only_once(): void
    {
        $svc = app(BookingService::class);
        $b = $svc->create($this->input());
        try {
            $svc->rate($b, 5, [], null);
            $this->fail('should not rate a booking that is not done');
        } catch (\InvalidArgumentException) {
        }
        $svc->setStatus($b, 'inchair');
        $svc->setStatus($b->fresh(), 'done');
        $f = $svc->rate($b->fresh(), 5, ['Sulit', 'Not a real tag'], 'Solid fade');
        $this->assertSame(['Sulit'], $f->tags);
        $this->expectException(\InvalidArgumentException::class);
        $svc->rate($b->fresh(), 4, [], null);
    }

    public function test_confirmation_email_is_logged(): void
    {
        $b = app(BookingService::class)->create($this->input());
        $this->assertDatabaseHas('notification_logs', ['booking_id' => $b->id, 'channel' => 'email', 'kind' => 'confirmed', 'status' => 'sent']);
        $this->assertDatabaseCount('notification_logs', 1);
    }
}
