<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'mobile', 'password', 'role', 'shop_id', 'favorite_barber_id'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function isOwner(): bool { return $this->role === 'owner'; }
    public function isCustomer(): bool { return $this->role === 'customer'; }

    public function shop() { return $this->belongsTo(Shop::class); }
    public function favoriteBarber() { return $this->belongsTo(Barber::class, 'favorite_barber_id'); }
    public function preference() { return $this->hasOne(CustomerPreference::class); }
    public function bookings() { return $this->hasMany(Booking::class); }
}
