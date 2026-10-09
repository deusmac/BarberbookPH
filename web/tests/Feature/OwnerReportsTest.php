<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Feedback;

class OwnerReportsTest extends OwnerTestCase
{
    public function test_empty_states_render(): void
    {
        $this->actingAs($this->owner);
        $this->get('/owner/reports')->assertOk()->assertSee('No bookings in this range yet.')->assertSee('Reports help the owner decide shop hours and staffing');
        $this->get('/owner/feedback')->assertOk()->assertSee('No feedback yet');
    }

    public function test_reports_page_and_ranges_render_with_content(): void
    {
        $this->book('Kuya Ramil', 14 * 60);
        $b = $this->book('Jhun', 14 * 60, ['style_id' => $this->shop->styles()->first()->id]);
        $b->update(['status' => 'noshow']);
        $this->actingAs($this->owner);

        $this->get('/owner/reports?range=week')->assertOk()->assertSee('Bookings per day')->assertSee('Bookings per barber')->assertSee('Top 5 styles')
            ->assertSee('Status breakdown')->assertSee('Busiest hours')->assertSee('Kuya Ramil')->assertSee('No-show')->assertSee('50%')->assertSee('<svg', false);
        $this->get('/owner/reports?range=month')->assertOk();
        $this->get('/owner/reports?range=lastweek')->assertOk()->assertSee('No bookings in this range yet.');
        $this->get('/owner/reports?range=bogus')->assertSessionHasErrors('range');
    }

    public function test_csv_export_and_formula_injection_is_neutralized(): void
    {
        $this->book('Kuya Ramil', 14 * 60, ['user_id' => null, 'guest_name' => "=HYPERLINK(\"http://evil\")"]);
        $this->book('Jhun', 14 * 60, ['user_id' => null, 'guest_name' => '+1+1']);
        $this->book('Paolo', 14 * 60, ['user_id' => null, 'guest_name' => '@SUM(A1)']);
        $this->book('Kuya Ramil', 15 * 60, ['user_id' => null, 'guest_name' => '-2+3']);
        $this->actingAs($this->owner);

        $res = $this->get('/owner/reports/export.csv?range=week');
        $res->assertOk();
        $this->assertStringContainsString('text/csv', $res->headers->get('Content-Type'));
        $csv = $res->streamedContent();
        $this->assertStringContainsString('Reference,Date,Time,Barber,Customer', $csv);
        $this->assertStringContainsString("'=HYPERLINK", $csv);
        $this->assertStringContainsString("'+1+1", $csv);
        $this->assertStringContainsString("'@SUM(A1)", $csv);
        $this->assertStringContainsString("'-2+3", $csv);
        $this->assertDoesNotMatchRegularExpression('/(^|,|")[=+\-@]/m', preg_replace('/^Reference.*\n/', '', str_replace("\r", '', $csv)) ?? '');
    }

    public function test_feedback_page_lists_reviews(): void
    {
        $b = $this->book('Kuya Ramil', 14 * 60);
        $b->update(['status' => 'done']);
        Feedback::create(['booking_id' => $b->id, 'user_id' => $this->customer->id, 'barber_id' => $b->barber_id, 'stars' => 4, 'tags' => ['Sulit'], 'comment' => 'Solid cut']);
        [, , $theirs] = $this->otherShop();
        $theirs->update(['status' => 'done']);
        Feedback::create(['booking_id' => $theirs->id, 'barber_id' => $theirs->barber_id, 'stars' => 1, 'comment' => 'Other shop review']);

        $this->actingAs($this->owner)->get('/owner/feedback')->assertOk()
            ->assertSee('Solid cut')->assertSee('Sulit')->assertSee('4.0')->assertSee('1 review')->assertDontSee('Other shop review');
    }

    public function test_demo_seeder_is_idempotent_and_valid(): void
    {
        $this->artisan('db:seed', ['--class' => 'DemoSeeder'])->assertSuccessful();
        $n = Booking::count();
        $this->assertGreaterThan(40, $n);
        $this->assertSame(1, \App\Models\User::where('email', 'juan@example.com')->where('role', 'customer')->count());
        $this->assertSame(6, Feedback::count());
        $this->assertSame(3, Booking::where('user_id', \App\Models\User::where('email', 'juan@example.com')->first()->id)->where('status', 'done')->count());
        $this->artisan('db:seed', ['--class' => 'DemoSeeder'])->assertSuccessful();
        $this->assertSame($n, Booking::count());
    }
}
