<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_landing_loads_for_guests(): void
    {
        $this->get('/')->assertOk()->assertSee('Book your haircut online');
    }

    public function test_customer_can_register_and_is_redirected_home(): void
    {
        $res = $this->post('/register', [
            'name' => 'Juan Dela Cruz', 'email' => 'juan@example.com', 'mobile' => '0917 123 4567',
            'password' => 'password123', 'password_confirmation' => 'password123', 'privacy' => '1',
        ]);
        $res->assertRedirect(route('customer.home'));
        $user = User::where('email', 'juan@example.com')->first();
        $this->assertSame('customer', $user->role);
        $this->assertSame('09171234567', $user->mobile, 'phone stored as digits only, no plus sign');
        $this->assertAuthenticatedAs($user);
    }

    public function test_registration_requires_privacy_consent_and_valid_mobile(): void
    {
        $this->post('/register', ['name' => 'A', 'email' => 'a@example.com', 'mobile' => '123', 'password' => 'password123', 'password_confirmation' => 'password123'])
            ->assertSessionHasErrors(['mobile', 'privacy']);
    }

    public function test_owner_logs_in_to_owner_area_and_customers_are_blocked_from_it(): void
    {
        $owner = User::where('role', 'owner')->first();
        $this->post('/login', ['email' => $owner->email, 'password' => env('OWNER_PASSWORD', 'change-me-now')])->assertRedirect(route('owner.queue'));
        $this->post('/logout');

        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer)->get('/owner/queue')->assertForbidden();
    }

    public function test_guests_are_sent_to_login(): void
    {
        $this->get('/home')->assertRedirect('/login');
        $this->get('/owner/queue')->assertRedirect('/login');
    }
}
