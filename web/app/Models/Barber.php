<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barber extends Model
{
    protected $guarded = [];

    protected $casts = ['working_days' => 'array', 'active' => 'boolean'];

    public function shop() { return $this->belongsTo(Shop::class); }
    public function dayOffs(): HasMany { return $this->hasMany(BarberDayOff::class); }
    public function bookings(): HasMany { return $this->hasMany(Booking::class); }
    public function feedback(): HasMany { return $this->hasMany(Feedback::class); }

    public function averageRating(): ?float
    {
        $avg = $this->feedback()->avg('stars');

        return $avg === null ? null : round((float) $avg, 1);
    }

    public function initials(): string
    {
        return collect(preg_split('/\s+/', trim($this->name)))->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))->take(2)->implode('');
    }
}
