<?php

namespace Tests\Feature;

use App\Models\Barber;
use App\Models\Service;
use App\Services\AvailabilityService;
use Illuminate\Support\Carbon;

class OwnerQueueTest extends OwnerTestCase
{
    public function test_queue_shows_board_kpis_and_list_view(): void
    {
        $b = $this->book();
        $this->actingAs($this->owner);

        $this->get('/owner/queue?date='.$this->date)->assertOk()
            ->assertSee('Bookings today')->assertSee('Open slots left')->assertSee('In chair now')->assertSee('No-shows this week')
            ->assertSee('Kuya Ramil')->assertSee('Juan')->assertSee('nowline', false)->assertSee(route('owner.booking', $b), false);
        $this->get('/owner/queue?date='.$this->date.'&view=list')->assertOk()->assertSee('<table class="t">', false)->assertSee('Juan');
        $this->get('/owner/queue?date=2026-10-08')->assertOk()->assertDontSee('nowline', false);
        $this->get('/owner/queue?date=garbage')->assertSessionHasErrors('date');
    }

    public function test_day_off_column_is_shown(): void
    {
        $r = Barber::where('name', 'Kuya Ramil')->first();
        $r->dayOffs()->create(['date' => $this->date]);
        $this->actingAs($this->owner)->get('/owner/queue?date='.$this->date)->assertOk()->assertSee('Day off');
    }

    public function test_preference_card_shows_prefs_and_last_visit(): void
    {
        // Past dates are rejected by the service, so build the history row directly.
        \App\Models\Booking::create([
            'shop_id' => $this->shop->id, 'user_id' => $this->customer->id, 'barber_id' => Barber::where('name', 'Kuya Ramil')->first()->id, 'service_id' => Service::first()->id,
            'style_id' => \App\Models\Style::where('name', 'Low Fade')->first()->id, 'date' => '2026-10-01', 'start_min' => 600, 'duration' => 30,
            'status' => 'done', 'prefs' => ['guard' => 2], 'price' => 150,
        ]);
        $b = $this->book('Kuya Ramil', 15 * 60, ['style_id' => \App\Models\Style::where('name', 'Mid Taper Fade')->first()->id]);

        $this->actingAs($this->owner)->get('/owner/bookings/'.$b->id)->assertOk()
            ->assertSee('Read this before the cut')->assertSee('#3')->assertSee('Keep the front long')->assertSee('Hard part')
            ->assertSee('Last visit: Low Fade, #2 guard');
    }

    public function test_status_transitions_and_invalid_transition_message(): void
    {
        $b = $this->book();
        $this->actingAs($this->owner);

        $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'inchair'])->assertRedirect()->assertSessionHas('toast');
        $this->assertSame('inchair', $b->fresh()->status);
        $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'done'])->assertSessionHas('toast');
        $this->assertSame('done', $b->fresh()->status);

        $res = $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'noshow']);
        $res->assertSessionHas('toast_error', 'Cannot change a done booking to noshow.');
        $this->assertSame('done', $b->fresh()->status);

        $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'bogus'])->assertSessionHasErrors('status');

        $c = $this->book('Kuya Ramil', 16 * 60);
        $this->post('/owner/bookings/'.$c->id.'/status', ['status' => 'noshow']);
        $this->assertSame('noshow', $c->fresh()->status);
        $d = $this->book('Kuya Ramil', 17 * 60);
        $this->post('/owner/bookings/'.$d->id.'/status', ['status' => 'cancelled']);
        $this->assertSame('cancelled', $d->fresh()->status);
    }

    public function test_walkin_now_creates_inchair_booking_and_blocks_the_slot(): void
    {
        $ramil = Barber::where('name', 'Kuya Ramil')->first();
        $svc = Service::where('shop_id', $this->shop->id)->first();
        $this->actingAs($this->owner);

        $this->post('/owner/walk-in', ['guest_name' => 'Kuya Boy', 'service_id' => $svc->id, 'barber_id' => $ramil->id, 'when' => 'now'])
            ->assertRedirect(route('owner.queue'));
        $w = \App\Models\Booking::where('guest_name', 'Kuya Boy')->first();
        $this->assertNotNull($w);
        $this->assertTrue($w->is_walkin);
        $this->assertNull($w->user_id);
        $this->assertSame('inchair', $w->status);
        $this->assertSame(10 * 60 + 10, $w->start_min, 'earliest free 5 minute start from 10:07');

        $avail = new AvailabilityService();
        $this->assertFalse($avail->isFree($ramil, $this->date, 10 * 60 + 10, 30), 'walk-in time is not available online');
        $this->assertFalse($avail->isFree($ramil, $this->date, 10 * 60 + 30, 30));
        $this->assertTrue($avail->isFree($ramil, $this->date, 11 * 60, 30));
        $this->assertTrue(\App\Models\NotificationLog::count() === 0);
    }

    public function test_walkin_at_picked_time_is_confirmed_and_taken_time_is_rejected(): void
    {
        $ramil = Barber::where('name', 'Kuya Ramil')->first();
        $svc = Service::where('shop_id', $this->shop->id)->first();
        $this->actingAs($this->owner);
        $payload = ['service_id' => $svc->id, 'barber_id' => $ramil->id, 'when' => 'time', 'start_min' => 15 * 60];

        $this->post('/owner/walk-in', $payload)->assertRedirect(route('owner.queue'));
        $w = \App\Models\Booking::where('is_walkin', true)->first();
        $this->assertSame('confirmed', $w->status);
        $this->assertSame(15 * 60, $w->start_min);

        $this->post('/owner/walk-in', $payload)->assertSessionHas('toast_error');
        $this->assertSame(1, \App\Models\Booking::count());

        $this->post('/owner/walk-in', ['service_id' => $svc->id, 'barber_id' => 'any', 'when' => 'time'])->assertSessionHasErrors('start_min');
        $this->get('/owner/walk-in/slots?service_id='.$svc->id.'&barber_id='.$ramil->id)->assertOk()->assertJsonMissing(['start' => 15 * 60]);
        $this->get('/owner/walk-in')->assertOk()->assertSee('Walk-in');
    }

    public function test_hours_and_day_off_changes_affect_availability_and_warn(): void
    {
        $ramil = Barber::where('name', 'Kuya Ramil')->first();
        $b = $this->book('Kuya Ramil', 16 * 60);
        $avail = new AvailabilityService();
        $this->assertTrue($avail->isFree($ramil->fresh(), $this->date, 17 * 60, 30));
        $this->actingAs($this->owner);

        $form = ['name' => 'Kuya Ramil', 'working_days' => [1, 2, 3, 4, 5, 6], 'start_time' => '09:00', 'end_time' => '15:00', 'break_at' => '12:00', 'active' => 1];
        $res = $this->put('/owner/barbers/'.$ramil->id, $form);
        $res->assertRedirect()->assertSessionHas('toast_error');
        $this->assertStringContainsString('1 upcoming booking', session('toast_error'));
        $this->assertFalse((new AvailabilityService())->isFree($ramil->fresh(), $this->date, 17 * 60, 30), 'shorter hours remove the slot');
        $this->assertSame('confirmed', $b->fresh()->status, 'bookings are never deleted or changed');

        // Day off today removes every slot and can be undone.
        $this->post('/owner/barbers/'.$ramil->id.'/day-off', ['date' => $this->date])->assertSessionHas('toast');
        $this->assertFalse((new AvailabilityService())->isFree($ramil->fresh(), $this->date, 11 * 60, 30));
        $this->post('/owner/barbers/'.$ramil->id.'/day-off', ['date' => $this->date]);
        $this->assertTrue((new AvailabilityService())->isFree($ramil->fresh(), $this->date, 11 * 60, 30));
    }

    public function test_barber_validation_and_add(): void
    {
        $ramil = Barber::where('name', 'Kuya Ramil')->first();
        $this->actingAs($this->owner);
        $base = ['name' => 'X', 'working_days' => [1], 'start_time' => '09:00', 'end_time' => '18:00'];

        $this->put('/owner/barbers/'.$ramil->id, array_merge($base, ['end_time' => '08:30']))->assertSessionHasErrors('end_time');
        $this->put('/owner/barbers/'.$ramil->id, array_merge($base, ['break_at' => '17:30']))->assertSessionHasErrors('break_at');
        $this->put('/owner/barbers/'.$ramil->id, array_merge($base, ['working_days' => []]))->assertSessionHasErrors('working_days');
        $this->put('/owner/barbers/'.$ramil->id, array_merge($base, ['start_time' => '09:15']))->assertSessionHasErrors('start_time');

        $this->post('/owner/barbers', array_merge($base, ['name' => 'Newbie', 'break_at' => '12:00']))->assertRedirect();
        $new = Barber::where('name', 'Newbie')->first();
        $this->assertSame($this->shop->id, $new->shop_id);
        $this->assertTrue($new->active);
        $this->get('/owner/barbers')->assertOk()->assertSee('Newbie')->assertSee('Day off today');
    }

    public function test_styles_and_services_management(): void
    {
        $this->actingAs($this->owner);
        $style = $this->shop->styles()->first();
        $this->post('/owner/styles/'.$style->id.'/toggle', ['field' => 'hidden']);
        $this->assertTrue($style->fresh()->hidden);
        $this->post('/owner/styles/'.$style->id.'/toggle', ['field' => 'trending']);
        $this->put('/owner/styles/'.$style->id, ['name' => 'Renamed', 'mins' => 50, 'category' => 'Classic']);
        $this->assertSame(['Renamed', 50], [$style->fresh()->name, $style->fresh()->mins]);
        $this->post('/owner/styles', ['name' => 'Brand New', 'mins' => 30, 'category' => 'Fades', 'art' => 'mullet'])->assertRedirect();
        $this->post('/owner/styles', ['name' => 'Bad', 'mins' => 30, 'category' => 'Fades', 'art' => '<script>'])->assertSessionHasErrors('art');
        $this->get('/owner/styles')->assertOk()->assertSee('Brand New');

        $svc = $this->shop->services()->first();
        $this->put('/owner/services/'.$svc->id, ['name' => 'Haircut', 'price' => 175, 'mins' => 30, 'includes_haircut' => 1, 'active' => 0]);
        $this->assertSame([175, false], [(int) $svc->fresh()->price, $svc->fresh()->active]);
        $this->assertDatabaseHas('services', ['id' => $svc->id]);
        $this->post('/owner/services', ['name' => 'Hot towel', 'price' => 50, 'mins' => 10, 'includes_haircut' => 0])->assertRedirect();
        $this->get('/owner/services')->assertOk()->assertSee('Hot towel');
    }
}
