<?php

namespace App\Services;

use App\Contracts\SmsGateway;
use App\Mail\BookingMail;
use App\Models\Booking;
use App\Models\NotificationLog;
use App\Support\Fmt;
use Illuminate\Support\Facades\Mail;
use Throwable;

/** Email + SMS for booking events. Failures are logged and never block a booking. */
class NotificationService
{
    public function __construct(private SmsGateway $sms)
    {
    }

    public function confirmed(Booking $b): void
    {
        $this->dispatch($b, 'confirmed',
            "Your BarberBook PH booking {$b->reference} is confirmed",
            "Your slot is reserved. Payment is made at the shop.",
            "BarberBook PH: Hi {$this->first($b)}! Your haircut with {$b->barber->name} is confirmed for {$this->when($b)} at {$b->shop->name}. Ref {$b->reference}");
    }

    public function rescheduled(Booking $b): void
    {
        $this->dispatch($b, 'rescheduled',
            "Your BarberBook PH booking {$b->reference} was moved",
            "Your booking was moved to a new time.",
            "BarberBook PH: Hi {$this->first($b)}! Your booking {$b->reference} moved to {$this->when($b)} with {$b->barber->name}.");
    }

    public function cancelled(Booking $b): void
    {
        $this->dispatch($b, 'cancelled',
            "Your BarberBook PH booking {$b->reference} was cancelled",
            "Your booking was cancelled. You can book a new time anytime.",
            "BarberBook PH: Hi {$this->first($b)}. Your booking {$b->reference} on {$this->when($b)} was cancelled.");
    }

    public function reminder(Booking $b): void
    {
        $this->dispatch($b, 'reminder',
            "Reminder: your haircut is at {$b->timeLabel()}",
            "This is a reminder for your appointment.",
            "BarberBook PH: Reminder, your haircut with {$b->barber->name} is at {$b->timeLabel()} today at {$b->shop->name}. Ref {$b->reference}");
    }

    private function dispatch(Booking $b, string $kind, string $subject, string $intro, string $sms): void
    {
        $b->loadMissing('user', 'barber', 'shop', 'service', 'style');
        $user = $b->user;
        if (! $user) {
            return; // walk-in guests have no contact details
        }
        if ($user->email) {
            $this->run($b, 'email', $kind, $user->email, $subject, $intro, function () use ($b, $kind, $subject, $intro, $user) {
                Mail::to($user->email)->send(new BookingMail($b, $kind, $subject, $intro));
            });
        }
        if ($phone = Fmt::phoneIntl($user->mobile)) {
            $this->run($b, 'sms', $kind, $phone, null, $sms, fn () => $this->sms->send($phone, $sms));
        }
    }

    private function run(Booking $b, string $channel, string $kind, string $to, ?string $subject, string $body, callable $send): void
    {
        $status = 'sent';
        $error = null;
        try {
            $send();
        } catch (Throwable $e) {
            $status = 'failed';
            $error = mb_substr($e->getMessage(), 0, 250);
            report($e);
        }
        NotificationLog::create([
            'booking_id' => $b->id, 'channel' => $channel, 'kind' => $kind, 'recipient' => $to,
            'subject' => $subject, 'body' => $body, 'status' => $status, 'error' => $error,
        ]);
    }

    private function first(Booking $b): string
    {
        return explode(' ', trim($b->customerName()))[0];
    }

    private function when(Booking $b): string
    {
        return Fmt::date($b->date).', '.$b->timeLabel();
    }
}
