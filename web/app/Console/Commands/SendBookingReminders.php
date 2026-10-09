<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendBookingReminders extends Command
{
    protected $signature = 'bookings:remind {--minutes=60 : Remind bookings starting within this many minutes}';
    protected $description = 'Email and text customers whose appointment is about to start (run every 10 minutes by the scheduler).';

    public function handle(NotificationService $notify): int
    {
        $window = (int) $this->option('minutes');
        $nowMin = now()->hour * 60 + now()->minute;
        $sent = 0;
        Booking::with(['user', 'barber', 'shop'])
            ->whereDate('date', now()->format('Y-m-d'))
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereNotNull('user_id')->whereNull('reminder_sent_at')
            ->where('start_min', '>', $nowMin)->where('start_min', '<=', $nowMin + $window)
            ->each(function (Booking $b) use ($notify, &$sent) {
                $notify->reminder($b);
                $b->update(['reminder_sent_at' => now()]);
                $sent++;
            });
        $this->info("Sent {$sent} reminder(s).");

        return self::SUCCESS;
    }
}
