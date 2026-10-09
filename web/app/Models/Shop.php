<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    protected $guarded = [];

    protected $casts = ['is_partner' => 'boolean', 'coming_soon' => 'boolean'];

    public function services(): HasMany { return $this->hasMany(Service::class); }
    public function barbers(): HasMany { return $this->hasMany(Barber::class); }
    public function styles(): HasMany { return $this->hasMany(Style::class); }
    public function bookings(): HasMany { return $this->hasMany(Booking::class); }

    public function isBookable(): bool
    {
        return $this->is_partner && ! $this->coming_soon;
    }
}
