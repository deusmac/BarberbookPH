<?php

namespace App\Services;

use App\Exceptions\SlotTakenException;
use App\Models\Barber;
use App\Models\Booking;
use App\Models\CustomerPreference;
use App\Models\Feedback;
use App\Models\Service;
use App\Models\Shop;
use App\Models\Style;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Every create, move, cancel and status change goes through here so double booking stays impossible.
 * Prices and durations are recomputed server-side; the browser is never trusted for them.
 */
class BookingService
{
    public function __construct(private NotificationService $notify)
    {
    }

    /**
     * @param array{shop_id:int,service_id:int,style_id?:?int,barber_id:int|string,date:string,start_min:int,user_id?:?int,guest_name?:?string,prefs?:array,photo_path?:?string,is_walkin?:bool,status?:string,notify?:bool} $in
     * @throws SlotTakenException
     */
    public function create(array $in): Booking
    {
        $shop = Shop::findOrFail($in['shop_id']);
        $service = Service::where('shop_id', $shop->id)->where('active', true)->findOrFail($in['service_id']);
        $style = ! empty($in['style_id']) ? Style::where('shop_id', $shop->id)->findOrFail($in['style_id']) : null;
        $dur = Booking::durationFor($service, $style);
        $date = $in['date'];
        $start = (int) $in['start_min'];

        $booking = DB::transaction(function () use ($in, $shop, $service, $style, $dur, $date, $start) {
            $barbers = $this->lockBarbers($shop, $in['barber_id']);
            $avail = (new AvailabilityService())->fresh();
            $barber = $in['barber_id'] === 'any'
                ? $avail->pickAuto($barbers, $date, $start, $dur)
                : ($avail->isFree($barbers->first(), $date, $start, $dur) ? $barbers->first() : null);
            if (! $barber) {
                throw new SlotTakenException();
            }

            $b = Booking::create([
                'shop_id' => $shop->id,
                'user_id' => $in['user_id'] ?? null,
                'guest_name' => $in['guest_name'] ?? null,
                'barber_id' => $barber->id,
                'service_id' => $service->id,
                'style_id' => $style?->id,
                'date' => $date,
                'start_min' => $start,
                'duration' => $dur,
                'status' => $in['status'] ?? 'confirmed',
                'is_walkin' => (bool) ($in['is_walkin'] ?? false),
                'prefs' => $this->cleanPrefs($in['prefs'] ?? []),
                'photo_path' => $in['photo_path'] ?? null,
                'price' => $service->price,
            ]);
            $b->update(['reference' => sprintf('BB-%s-%05d', substr($date, 0, 4), $b->id)]);

            return $b;
        });

        if (($in['notify'] ?? true) && $booking->user_id) {
            $this->notify->confirmed($booking->fresh());
        }

        return $booking->fresh(['barber', 'service', 'style', 'shop']);
    }

    /** @throws SlotTakenException */
    public function reschedule(Booking $b, string $date, int $start, int|string $barberSel): Booking
    {
        if (! $b->isUpcoming()) {
            throw new InvalidArgumentException('This booking can no longer be changed.');
        }
        DB::transaction(function () use ($b, $date, $start, $barberSel) {
            $barbers = $this->lockBarbers($b->shop, $barberSel);
            $avail = (new AvailabilityService())->fresh();
            $barber = $barberSel === 'any'
                ? $avail->pickAuto($barbers, $date, $start, $b->duration, $b->id)
                : ($avail->isFree($barbers->first(), $date, $start, $b->duration, $b->id) ? $barbers->first() : null);
            if (! $barber) {
                throw new SlotTakenException();
            }
            $b->update(['barber_id' => $barber->id, 'date' => $date, 'start_min' => $start, 'reminder_sent_at' => null]);
        });
        $b = $b->fresh(['barber', 'service', 'style', 'shop', 'user']);
        $this->notify->rescheduled($b);

        return $b;
    }

    public function cancel(Booking $b, string $reason): Booking
    {
        if (! in_array($b->status, ['pending', 'confirmed'], true)) {
            throw new InvalidArgumentException('This booking cannot be cancelled.');
        }
        $b->update(['status' => 'cancelled', 'cancel_reason' => mb_substr($reason, 0, 190)]);
        $this->notify->cancelled($b->fresh(['barber', 'shop', 'user']));

        return $b;
    }

    /** Owner-side status changes: start, finish, no-show, cancel. */
    public function setStatus(Booking $b, string $status): Booking
    {
        $allowed = [
            'pending' => ['confirmed', 'inchair', 'cancelled', 'noshow'],
            'confirmed' => ['inchair', 'cancelled', 'noshow'],
            'inchair' => ['done'],
        ];
        if (! in_array($status, $allowed[$b->status] ?? [], true)) {
            throw new InvalidArgumentException("Cannot change a {$b->status} booking to {$status}.");
        }
        $b->update(['status' => $status]);
        if ($status === 'cancelled') {
            $b->update(['cancel_reason' => 'Cancelled by the shop']);
            $this->notify->cancelled($b->fresh(['barber', 'shop', 'user']));
        }

        return $b;
    }

    public function rate(Booking $b, int $stars, array $tags, ?string $comment): Feedback
    {
        if ($b->status !== 'done' || $b->rated) {
            throw new InvalidArgumentException('This booking cannot be rated.');
        }
        $stars = max(1, min(5, $stars));
        $tags = array_values(array_intersect($tags, Feedback::TAGS));

        return DB::transaction(function () use ($b, $stars, $tags, $comment) {
            $f = Feedback::create([
                'booking_id' => $b->id, 'user_id' => $b->user_id, 'barber_id' => $b->barber_id,
                'stars' => $stars, 'tags' => $tags, 'comment' => $comment ? mb_substr(trim($comment), 0, 500) : null,
            ]);
            $b->update(['rated' => true]);

            return $f;
        });
    }

    /** Save the booking's preferences as the customer's "usual". */
    public function saveUsual(int $userId, ?int $styleId, array $prefs): CustomerPreference
    {
        $p = $this->cleanPrefs($prefs);

        return CustomerPreference::updateOrCreate(['user_id' => $userId], [
            'style_id' => $styleId, 'guard' => $p['guard'], 'top' => $p['top'], 'beard' => $p['beard'],
            'extras' => $p['extras'], 'notes' => $p['notes'],
        ]);
    }

    public function cleanPrefs(array $p): array
    {
        $guard = $p['guard'] ?? null;

        return [
            'guard' => ($guard === null || $guard === '') ? null : max(0, min(8, (int) $guard)),
            'top' => in_array($p['top'] ?? null, CustomerPreference::TOPS, true) ? $p['top'] : null,
            'beard' => in_array($p['beard'] ?? null, CustomerPreference::BEARDS, true) ? $p['beard'] : null,
            'extras' => array_values(array_intersect((array) ($p['extras'] ?? []), CustomerPreference::EXTRAS)),
            'notes' => isset($p['notes']) ? mb_substr(trim(strip_tags((string) $p['notes'])), 0, 200) : null,
        ];
    }

    /** Lock the candidate barbers' rows so concurrent requests serialize on MySQL. */
    private function lockBarbers(Shop $shop, int|string $sel)
    {
        $q = Barber::where('shop_id', $shop->id)->where('active', true)->with('dayOffs')->lockForUpdate();
        if ($sel !== 'any') {
            $q->whereKey($sel);
        }
        $barbers = $q->get();
        if ($barbers->isEmpty()) {
            throw new SlotTakenException('That barber is not available.');
        }

        return $barbers;
    }
}
