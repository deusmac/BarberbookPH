<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';
    protected $guarded = [];

    protected $casts = ['tags' => 'array'];

    public const TAGS = ['Sulit', 'On time', 'Exactly what I asked', 'Friendly', 'Clean shop'];

    public function booking() { return $this->belongsTo(Booking::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function barber() { return $this->belongsTo(Barber::class); }
}
