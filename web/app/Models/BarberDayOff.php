<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarberDayOff extends Model
{
    protected $guarded = [];

    protected $casts = ['date' => 'date:Y-m-d'];

    public function barber() { return $this->belongsTo(Barber::class); }
}
