<?php

namespace Tests\Feature;

class OwnerAccessTest extends OwnerTestCase
{
    private function getRoutes(): array
    {
        return ['/owner/queue', '/owner/walk-in', '/owner/barbers', '/owner/styles', '/owner/services', '/owner/reports', '/owner/reports/export.csv', '/owner/feedback', '/owner/walk-in/slots'];
    }

    public function test_guest_is_blocked_from_every_owner_route(): void
    {
        $b = $this->book();
        foreach (array_merge($this->getRoutes(), ['/owner/bookings/'.$b->id]) as $url) {
            $this->get($url)->assertRedirect('/login');
        }
        $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'inchair'])->assertRedirect('/login');
        $this->post('/owner/walk-in', [])->assertRedirect('/login');
        $this->assertSame('confirmed', $b->fresh()->status);
    }

    public function test_customer_is_forbidden_from_every_owner_route(): void
    {
        $b = $this->book();
        $this->actingAs($this->customer);
        foreach (array_merge($this->getRoutes(), ['/owner/bookings/'.$b->id]) as $url) {
            $this->get($url)->assertForbidden();
        }
        $this->post('/owner/bookings/'.$b->id.'/status', ['status' => 'inchair'])->assertForbidden();
        $this->post('/owner/walk-in', [])->assertForbidden();
        $this->put('/owner/services/1', ['name' => 'x', 'price' => 1, 'mins' => 10])->assertForbidden();
        $this->assertSame('confirmed', $b->fresh()->status);
    }

    public function test_owner_cannot_read_or_change_another_shops_data(): void
    {
        [$shop, , $theirs] = $this->otherShop();
        $this->actingAs($this->owner);

        $this->get('/owner/bookings/'.$theirs->id)->assertNotFound();
        $this->post('/owner/bookings/'.$theirs->id.'/status', ['status' => 'inchair'])->assertNotFound();
        $this->assertSame('confirmed', $theirs->fresh()->status);

        $this->put('/owner/barbers/'.$shop->barbers()->first()->id, ['name' => 'Hacked', 'working_days' => [1], 'start_time' => '09:00', 'end_time' => '10:00'])->assertNotFound();
        $this->put('/owner/services/'.$shop->services()->first()->id, ['name' => 'Hacked', 'price' => 1, 'mins' => 10])->assertNotFound();
        $this->assertSame('Haircut', $shop->services()->first()->name);

        // Their booking never appears in this owner's queue or CSV.
        $this->get('/owner/queue?date='.$this->date)->assertOk()->assertDontSee('Secret Person');
        $this->get('/owner/reports/export.csv?range=week')->assertOk();
        $this->assertStringNotContainsString('Secret Person', $this->get('/owner/reports/export.csv?range=week')->streamedContent());
    }
}
