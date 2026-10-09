<?php

namespace Tests\Feature;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\CustomerPreference;
use App\Models\Service;
use App\Models\Shop;
use App\Models\Style;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CustomerAreaTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Shop $shop;
    private string $date = '2026-10-12'; // Monday

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Carbon::setTestNow(Carbon::parse('2026-10-07 08:00:00', 'Asia/Manila'));
        $this->user = User::factory()->create(['role' => 'customer', 'mobile' => '09171234567']);
        $this->shop = Shop::where('is_partner', true)->first();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function mkBooking(?User $u = null, array $over = []): Booking
    {
        $svc = Service::where('name', 'Haircut')->first();
        $b = app(BookingService::class)->create($over + [
            'shop_id' => $this->shop->id, 'service_id' => $svc->id, 'barber_id' => Barber::where('name', 'Jhun')->first()->id,
            'date' => $this->date, 'start_min' => 600, 'user_id' => ($u ?? $this->user)->id, 'notify' => false,
        ]);

        return $b;
    }

    private function wizardToReview(array $startExtra = []): void
    {
        $svc = Service::where('name', 'Haircut')->first();
        $style = Style::where('name', 'Low Fade')->first();
        $this->actingAs($this->user)->post('/book/start', ['service_id' => $svc->id] + $startExtra)->assertRedirect(route('customer.book.style'));
        $this->post('/book/style', ['style_id' => $style->id])->assertRedirect(route('customer.book.barber'));
        $this->post('/book/barber', ['barber' => 'any', 'guard' => 2, 'top' => 'Short', 'beard' => 'None', 'extras' => ['Hair wash'], 'notes' => 'Thanks', 'save_usual' => 1])
            ->assertRedirect(route('customer.book.schedule'));
        $this->post('/book/schedule', ['date' => $this->date, 'start_min' => 600])->assertRedirect(route('customer.book.review'));
    }

    public function test_guests_and_owners_are_blocked(): void
    {
        $this->get('/home')->assertRedirect('/login');
        $this->get('/bookings')->assertRedirect('/login');
        $owner = User::where('role', 'owner')->first();
        $this->actingAs($owner)->get('/home')->assertForbidden();
        $this->actingAs($owner)->get('/bookings')->assertForbidden();
    }

    public function test_every_page_renders(): void
    {
        $b = $this->mkBooking();
        $this->actingAs($this->user);
        $this->get('/home')->assertOk()->assertSee('Quick rebook')->assertSee('Coming soon');
        $this->get('/home?q=zzzz')->assertOk()->assertSee('No shops match');
        $this->get('/home?q=kings')->assertOk()->assertSee('Kings Cut');
        $this->get(route('customer.shop', $this->shop))->assertOk()->assertSee('Pay at the shop')->assertSee('Next free');
        $this->get('/styles')->assertOk();
        $this->get('/styles?cat=All')->assertOk()->assertSee('Low Fade');
        $this->get('/styles?cat=Fades')->assertOk();
        $this->get('/bookings')->assertOk()->assertSee($b->reference);
        $this->get('/bookings?tab=past')->assertOk();
        $this->get('/bookings?tab=cancelled')->assertOk();
        $this->get('/bookings/'.$b->id.'/reschedule')->assertOk();
        $this->get('/profile')->assertOk()->assertSee('RA 10173');
        $this->get('/booking/'.$b->id.'/done')->assertOk()->assertSee('Preview only')->assertDontSee('SMS');
        $this->get('/book/style')->assertRedirect(route('customer.home'));
    }

    public function test_coming_soon_shop_is_not_bookable(): void
    {
        $this->actingAs($this->user)->get(route('customer.shop', Shop::where('slug', 'fadez-manila')->first()))->assertNotFound();
    }

    public function test_wizard_happy_path_creates_booking(): void
    {
        Storage::fake('public');
        $this->wizardToReview();
        $this->get('/book/style?cat=All')->assertOk()->assertSee('Low Fade');
        $this->get('/book/barber')->assertOk()->assertSee('Any available barber');
        $this->get('/book/schedule?date='.$this->date)->assertOk()->assertSee('Time slots');
        $this->get('/book/review')->assertOk()->assertSee('Confirm booking')->assertSee('Assigned to');

        $res = $this->post('/book/confirm');
        $b = Booking::where('user_id', $this->user->id)->firstOrFail();
        $res->assertRedirect(route('customer.booked', $b));
        $this->assertSame('confirmed', $b->status);
        $this->assertSame(600, $b->start_min);
        $this->assertSame(150.0, (float) $b->price);                       // from the service, not the request
        $this->assertSame(35, $b->duration);                               // 30 + (35-30) style minutes
        $this->assertNotNull($b->reference);
        $this->assertSame('Short', CustomerPreference::where('user_id', $this->user->id)->first()->top);
        $this->assertNull(session('draft'));
        $this->get('/booking/'.$b->id.'/done')->assertOk()->assertSee($b->reference);
        $this->get('/bookings/'.$b->id.'/ics')->assertOk()->assertHeader('Content-Type', 'text/calendar; charset=utf-8')->assertSee('BEGIN:VEVENT', false);
    }

    public function test_price_and_duration_cannot_be_forged(): void
    {
        $this->wizardToReview();
        $this->post('/book/confirm', ['price' => 1, 'duration' => 5, 'status' => 'done']);
        $b = Booking::firstOrFail();
        $this->assertSame(150.0, (float) $b->price);
        $this->assertSame('confirmed', $b->status);
        $this->assertNotSame(5, $b->duration);
    }

    public function test_photo_upload_is_validated_and_stored(): void
    {
        Storage::fake('public');
        $style = Style::first();
        $this->actingAs($this->user)->post('/book/start', ['style_id' => $style->id]);
        $this->post('/book/style', ['action' => 'continue', 'photo' => UploadedFile::fake()->create('x.pdf', 10, 'application/pdf')])->assertSessionHasErrors('photo');
        $this->post('/book/style', ['action' => 'continue', 'photo' => UploadedFile::fake()->image('ref.jpg')->size(5000)])->assertSessionHasErrors('photo');
        $this->post('/book/style', ['action' => 'continue', 'photo' => UploadedFile::fake()->image('ref.jpg')])->assertRedirect(route('customer.book.barber'));
        $path = session('draft')['photo_path'];
        $this->assertStringStartsWith('references/', $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_slot_taken_at_confirm_shows_message_and_creates_nothing(): void
    {
        $this->wizardToReview();
        // Everyone is busy at 10:00 on that Monday: fill Ramil, Jhun (10:00 start) with other customers.
        $other = User::factory()->create(['role' => 'customer']);
        foreach (Barber::all() as $barber) {
            if (in_array(1, $barber->working_days) && $barber->start_time <= '10:00') {
                $this->mkBooking($other, ['barber_id' => $barber->id, 'start_min' => 600]);
            }
        }
        $before = Booking::count();
        $this->post('/book/confirm')->assertRedirect(route('customer.book.schedule', ['date' => $this->date]))
            ->assertSessionHasErrors('slot');
        $this->assertSame($before, Booking::count());
        $this->assertSame(0, Booking::where('user_id', $this->user->id)->count());
        $this->get('/book/schedule?date='.$this->date)->assertSee('just taken');
    }

    public function test_taken_slots_are_struck_through_and_json_endpoint_works(): void
    {
        $svc = Service::where('name', 'Haircut')->first();
        $jhun = Barber::where('name', 'Jhun')->first();
        $this->actingAs($this->user)->post('/book/start', ['service_id' => $svc->id]);
        $this->post('/book/barber', ['barber' => $jhun->id]);
        $this->mkBooking(User::factory()->create(['role' => 'customer']), ['barber_id' => $jhun->id, 'start_min' => 600]);
        $this->get('/book/schedule?date='.$this->date)->assertSee('slot taken', false)->assertSee('Taken');
        $json = $this->getJson('/api/slots?date='.$this->date.'&barber='.$jhun->id)->assertOk()->json('slots');
        $ten = collect($json)->firstWhere('start', 600);
        $this->assertFalse($ten['free']);
        $this->assertSame('taken', $ten['state']);
    }

    public function test_quick_rebook_prefills_and_jumps_to_schedule(): void
    {
        $style = Style::where('name', 'Low Fade')->first();
        CustomerPreference::create(['user_id' => $this->user->id, 'style_id' => $style->id, 'guard' => 3, 'top' => 'Short', 'beard' => 'None', 'extras' => []]);
        $this->actingAs($this->user)->post('/book/quick')->assertRedirect(route('customer.book.schedule'));
        $d = session('draft');
        $this->assertSame($style->id, $d['style_id']);
        $this->assertSame(3, $d['prefs']['guard']);
        $this->get('/book/barber')->assertSee('Your usual');
    }

    public function test_cannot_touch_another_customers_booking(): void
    {
        $other = User::factory()->create(['role' => 'customer']);
        $b = $this->mkBooking($other);
        $this->actingAs($this->user);
        $this->get('/booking/'.$b->id.'/done')->assertNotFound();
        $this->get('/bookings/'.$b->id.'/ics')->assertNotFound();
        $this->get('/bookings/'.$b->id.'/reschedule')->assertNotFound();
        $this->post('/bookings/'.$b->id.'/reschedule', ['date' => $this->date, 'start_min' => 660])->assertNotFound();
        $this->post('/bookings/'.$b->id.'/cancel', ['reason' => 'Other'])->assertNotFound();
        $this->post('/bookings/'.$b->id.'/rate', ['stars' => 5])->assertNotFound();
        $this->assertSame('confirmed', $b->fresh()->status);
        $this->assertSame(600, $b->fresh()->start_min);
    }

    public function test_cancel_requires_a_reason(): void
    {
        $b = $this->mkBooking();
        $this->actingAs($this->user)->post('/bookings/'.$b->id.'/cancel', [])->assertSessionHasErrors('reason');
        $this->post('/bookings/'.$b->id.'/cancel', ['reason' => 'Made up'])->assertSessionHasErrors('reason');
        $this->assertSame('confirmed', $b->fresh()->status);
        $this->post('/bookings/'.$b->id.'/cancel', ['reason' => 'Feeling sick'])->assertRedirect();
        $this->assertSame('cancelled', $b->fresh()->status);
        $this->assertSame('Feeling sick', $b->fresh()->cancel_reason);
        $this->get('/bookings?tab=cancelled')->assertSee('Feeling sick');
    }

    public function test_reschedule_keeps_reference(): void
    {
        $b = $this->mkBooking();
        $ref = $b->reference;
        $this->actingAs($this->user)->post('/bookings/'.$b->id.'/reschedule', ['date' => $this->date, 'start_min' => 720])->assertRedirect(route('customer.bookings'));
        $b->refresh();
        $this->assertSame($ref, $b->reference);
        $this->assertSame(720, $b->start_min);
        $this->assertSame(1, Booking::count());
    }

    public function test_reschedule_into_a_taken_slot_shows_error(): void
    {
        $b = $this->mkBooking();
        $this->mkBooking(User::factory()->create(['role' => 'customer']), ['start_min' => 720]);
        $this->actingAs($this->user)->post('/bookings/'.$b->id.'/reschedule', ['date' => $this->date, 'start_min' => 720])->assertSessionHasErrors('slot');
        $this->assertSame(600, $b->fresh()->start_min);
    }

    public function test_rating_only_for_done_bookings(): void
    {
        $b = $this->mkBooking();
        $this->actingAs($this->user)->post('/bookings/'.$b->id.'/rate', ['stars' => 5])->assertSessionHas('toast_error');
        $this->assertDatabaseCount('feedback', 0);

        $b->update(['status' => 'done']);
        $this->post('/bookings/'.$b->id.'/rate', ['stars' => 9])->assertSessionHasErrors('stars');
        $this->post('/bookings/'.$b->id.'/rate', ['stars' => 4, 'tags' => ['Sulit'], 'comment' => 'Nice'])->assertRedirect();
        $this->assertDatabaseCount('feedback', 1);
        $this->assertTrue($b->fresh()->rated);
        $this->post('/bookings/'.$b->id.'/rate', ['stars' => 5])->assertSessionHas('toast_error');
        $this->assertDatabaseCount('feedback', 1);
    }

    public function test_profile_updates(): void
    {
        $this->actingAs($this->user)->put('/profile', ['name' => 'Juan Dela Cruz', 'mobile' => 'abc'])->assertSessionHasErrors('mobile');
        $this->put('/profile', ['name' => 'Juan Dela Cruz', 'mobile' => '+63 917 555 1234', 'email' => 'x@y.com'])->assertRedirect(route('customer.profile'));
        $u = $this->user->fresh();
        $this->assertSame('Juan Dela Cruz', $u->name);
        $this->assertSame('639175551234', $u->mobile);
        $this->assertNotSame('x@y.com', $u->email);

        $barber = Barber::first();
        $this->put('/profile/preferences', ['favorite_barber_id' => $barber->id, 'guard' => 4, 'top' => 'Medium', 'beard' => 'Full trim', 'extras' => ['Hard part'], 'notes' => 'hi'])
            ->assertRedirect(route('customer.profile'));
        $this->assertSame($barber->id, $u->fresh()->favorite_barber_id);
        $this->assertSame(4, (int) CustomerPreference::where('user_id', $u->id)->first()->guard);
        $this->put('/profile/preferences', ['guard' => 99])->assertSessionHasErrors('guard');
    }
}
