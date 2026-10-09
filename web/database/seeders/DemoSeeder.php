<?php

namespace Database\Seeders;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\CustomerPreference;
use App\Models\Feedback;
use App\Models\Shop;
use App\Models\User;
use App\Support\Fmt;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Optional demo data for LOCAL use only:  php artisan db:seed --class=DemoSeeder
 * Never called from DatabaseSeeder. Idempotent: bookings use the "DM-" reference prefix and the run is
 * skipped when any exist. Placement follows the AvailabilityService rules (working day, day off, hours,
 * break, no overlap); past times are inserted directly because the service refuses to book the past.
 */
class DemoSeeder extends Seeder
{
    private array $busy = []; // "barberId|date" => [[start, end], ...]

    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command?->error('DemoSeeder refuses to run in production.');

            return;
        }
        $shop = Shop::where('slug', 'kings-cut')->first();
        if (! $shop) {
            $this->call(DatabaseSeeder::class);
            $shop = Shop::where('slug', 'kings-cut')->firstOrFail();
        }
        if (Booking::where('reference', 'like', 'DM-%')->exists()) {
            $this->command?->info('Demo data already present. Nothing to do.');

            return;
        }
        mt_srand(2026);

        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->get();
        $services = $shop->services()->where('active', true)->get();
        $styles = $shop->styles()->get();
        $juan = $this->juan($shop, $styles->firstWhere('art', 'midtaper'));
        $names = ['Mark Reyes', 'Paolo Santos', 'Jomar Cruz', 'Ken Villanueva', 'Rico Bautista', 'Migs Aquino', 'Dennis Lim', 'Carlo Mendoza', 'JP Ramos', 'Louie Garcia', 'Nico Torres', 'Alvin Dizon', 'Bong Castillo', 'Ryan Soriano'];
        $seq = 0;

        $make = function (array $o) use ($shop, &$seq) {
            $seq++;
            $b = Booking::create($o + ['shop_id' => $shop->id, 'reference' => sprintf('DM-%04d', $seq), 'prefs' => $o['prefs'] ?? $this->randomPrefs()]);

            return $b;
        };

        // Today: ~14 bookings. Earliest two done, next in chair, the rest confirmed, one walk-in.
        $today = now()->format('Y-m-d');
        $placed = [];
        for ($i = 0; $i < 14; $i++) {
            $p = $this->place($barbers, $services, $styles, $today, $i);
            if ($p) {
                $placed[] = $p;
            }
        }
        usort($placed, fn ($a, $b) => $a['start_min'] <=> $b['start_min']);
        foreach ($placed as $i => $p) {
            $p['status'] = $i < 2 ? 'done' : ($i === 2 ? 'inchair' : 'confirmed');
            if ($i === 5) {
                $p['is_walkin'] = true;
                $p['guest_name'] = 'Walk-in guest';
            } elseif ($i === 6) {
                $p['user_id'] = $juan->id;
                $p['prefs'] = $juan->preference->toBookingPrefs();
                $p['style_id'] = $juan->preference->style_id;
            } else {
                $p['guest_name'] = $names[$i % count($names)];
            }
            $make($p);
        }

        // Next 5 days: 2 to 4 confirmed each.
        for ($d = 1; $d <= 5; $d++) {
            $date = now()->addDays($d)->format('Y-m-d');
            for ($i = 0, $n = mt_rand(2, 4); $i < $n; $i++) {
                if ($p = $this->place($barbers, $services, $styles, $date, $i + $d)) {
                    $make($p + ['status' => 'confirmed', 'guest_name' => $names[mt_rand(0, count($names) - 1)]]);
                }
            }
        }

        // Past 14 days: ~40 with a done / noshow / cancelled mix. Cancelled ones do not hold a slot.
        $past = [];
        for ($i = 0; $i < 40; $i++) {
            $date = now()->subDays(mt_rand(1, 14))->format('Y-m-d');
            $roll = mt_rand(1, 100);
            $status = $roll <= 70 ? 'done' : ($roll <= 85 ? 'noshow' : 'cancelled');
            if ($p = $this->place($barbers, $services, $styles, $date, $i, $status !== 'cancelled')) {
                $b = $make($p + ['status' => $status, 'guest_name' => $names[mt_rand(0, count($names) - 1)],
                    'cancel_reason' => $status === 'cancelled' ? 'Customer cancelled' : null]);
                if ($status === 'done') {
                    $past[] = $b;
                }
            }
        }

        // Juan's three past done bookings, one still unrated.
        $juanDone = [];
        foreach ([3, 7, 12] as $daysAgo) {
            $date = now()->subDays($daysAgo)->format('Y-m-d');
            if ($p = $this->place($barbers, $services, $styles, $date, $daysAgo, true)) {
                $juanDone[] = $make($p + ['status' => 'done', 'user_id' => $juan->id, 'style_id' => $juan->preference->style_id, 'prefs' => $juan->preference->toBookingPrefs()]);
            }
        }

        // Six feedback rows: two for Juan (one of his stays unrated), four for other done bookings.
        $rows = [
            [5, ['Sulit', 'Friendly'], 'Ganda ng fade, sakto sa gusto ko.'],
            [4, ['On time'], 'Maayos, medyo mahaba lang ang pila.'],
            [5, ['Exactly what I asked', 'Clean shop'], 'Salamat po, babalik ako.'],
            [3, [], 'Okay naman pero hindi pantay ang sides.'],
            [5, ['Sulit', 'On time', 'Friendly'], null],
            [4, ['Clean shop'], 'Malinis ang shop, mabilis ang gupit.'],
        ];
        $targets = array_merge(array_slice($juanDone, 0, 2), array_slice($past, 0, 4));
        foreach ($targets as $i => $b) {
            if (! isset($rows[$i])) {
                break;
            }
            [$stars, $tags, $comment] = $rows[$i];
            Feedback::updateOrCreate(['booking_id' => $b->id], [
                'user_id' => $b->user_id, 'barber_id' => $b->barber_id, 'stars' => $stars, 'tags' => $tags, 'comment' => $comment,
            ]);
            $b->update(['rated' => true]);
        }

        $this->command?->info('Demo data created. Customer login: juan@example.com / password');
    }

    private function juan(Shop $shop, $style): User
    {
        $juan = User::firstOrCreate(['email' => 'juan@example.com'], [
            'name' => 'Juan Dela Cruz', 'password' => 'password', 'role' => 'customer', 'mobile' => '09171234567',
        ]);
        CustomerPreference::updateOrCreate(['user_id' => $juan->id], [
            'style_id' => $style?->id, 'guard' => 2, 'top' => 'Medium', 'beard' => 'Line-up only',
            'extras' => ['Trim eyebrows', 'No hair product'], 'notes' => 'Please keep the sides clean, no razor on the neckline.',
        ]);

        return $juan->load('preference');
    }

    /** @return array<string, mixed>|null a booking attribute set that fits, reserving the slot when $reserve */
    private function place($barbers, $services, $styles, string $date, int $salt, bool $reserve = true): ?array
    {
        $service = $services[mt_rand(0, $services->count() - 1)];
        $style = $service->includes_haircut ? $styles[mt_rand(0, $styles->count() - 1)] : null;
        $dur = Booking::durationFor($service, $style);
        $list = $barbers->values();
        for ($try = 0; $try < $list->count(); $try++) {
            $barber = $list[($salt + $try) % $list->count()];
            $cands = $this->starts($barber, $date);
            if (! $cands) {
                continue;
            }
            $off = mt_rand(0, count($cands) - 1);
            for ($k = 0; $k < count($cands); $k++) {
                $start = $cands[($off + $k) % count($cands)];
                if ($this->fits($barber, $date, $start, $dur)) {
                    if ($reserve) {
                        $this->busy[$barber->id.'|'.$date][] = [$start, $start + $dur];
                    }

                    return [
                        'barber_id' => $barber->id, 'service_id' => $service->id, 'style_id' => $style?->id, 'date' => $date,
                        'start_min' => $start, 'duration' => $dur, 'price' => $service->price, 'is_walkin' => false,
                    ];
                }
            }
        }

        return null;
    }

    private function starts(Barber $b, string $date): array
    {
        if (! $this->works($b, $date)) {
            return [];
        }
        $out = [];
        for ($t = Fmt::hhmm($b->start_time); $t + 30 <= Fmt::hhmm($b->end_time); $t += 30) {
            $out[] = $t;
        }

        return $out;
    }

    private function works(Barber $b, string $date): bool
    {
        return $b->active
            && in_array((int) Carbon::parse($date)->dayOfWeek, array_map('intval', $b->working_days ?? []), true)
            && ! $b->dayOffs->contains(fn ($o) => $o->date->format('Y-m-d') === $date);
    }

    private function fits(Barber $b, string $date, int $start, int $dur): bool
    {
        if ($start < Fmt::hhmm($b->start_time) || $start + $dur > Fmt::hhmm($b->end_time)) {
            return false;
        }
        if ($b->break_at) {
            $br = Fmt::hhmm($b->break_at);
            if ($start < $br + 60 && $start + $dur > $br) {
                return false;
            }
        }
        foreach ($this->busy[$b->id.'|'.$date] ?? [] as [$s, $e]) {
            if ($start < $e && $start + $dur > $s) {
                return false;
            }
        }

        return true;
    }

    private function randomPrefs(): array
    {
        return [
            'guard' => mt_rand(0, 4),
            'top' => CustomerPreference::TOPS[mt_rand(0, 2)],
            'beard' => CustomerPreference::BEARDS[mt_rand(0, 2)],
            'extras' => mt_rand(0, 1) ? [CustomerPreference::EXTRAS[mt_rand(0, 3)]] : [],
            'notes' => null,
        ];
    }
}
