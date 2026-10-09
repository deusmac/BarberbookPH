<?php

namespace App\Models;

use App\Support\Fmt;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Booking extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'prefs' => 'array',
        'is_walkin' => 'boolean',
        'rated' => 'boolean',
        'price' => 'decimal:2',
        'reminder_sent_at' => 'datetime',
    ];

    public const STATUSES = [
        'pending' => 'Pending',
        'confirmed' => 'Confirmed',
        'inchair' => 'In chair',
        'done' => 'Done',
        'cancelled' => 'Cancelled',
        'noshow' => 'No-show',
    ];

    /** Statuses that occupy the barber's time. */
    public const ACTIVE = ['pending', 'confirmed', 'inchair', 'done'];

    public function shop() { return $this->belongsTo(Shop::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function barber() { return $this->belongsTo(Barber::class); }
    public function service() { return $this->belongsTo(Service::class); }
    public function style() { return $this->belongsTo(Style::class); }
    public function feedback() { return $this->hasOne(Feedback::class); }

    public function scopeActive($q) { return $q->whereIn('status', self::ACTIVE); }

    public function dateString(): string
    {
        return $this->date instanceof Carbon ? $this->date->format('Y-m-d') : (string) $this->date;
    }

    public function endMin(): int { return $this->start_min + $this->duration; }

    public function startsAt(): Carbon
    {
        return Carbon::parse($this->dateString())->startOfDay()->addMinutes($this->start_min);
    }

    public function isActive(): bool { return in_array($this->status, self::ACTIVE, true); }

    /** Customer may still change or cancel it. */
    public function isUpcoming(): bool
    {
        return in_array($this->status, ['pending', 'confirmed'], true) && $this->startsAt()->isFuture();
    }

    public function statusLabel(): string { return self::STATUSES[$this->status] ?? $this->status; }
    public function customerName(): string { return $this->user?->name ?? $this->guest_name ?? 'Walk-in guest'; }
    public function timeLabel(): string { return Fmt::time($this->start_min); }

    public static function durationFor(Service $service, ?Style $style): int
    {
        $extra = ($style && $service->includes_haircut) ? max(0, $style->mins - 30) : 0;

        return (int) (ceil(($service->mins + $extra) / 5) * 5);
    }
}
