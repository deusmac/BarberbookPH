<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPreference extends Model
{
    protected $guarded = [];

    protected $casts = ['extras' => 'array'];

    public const TOPS = ['Short', 'Medium', 'Keep it long (scissor only)'];
    public const BEARDS = ['None', 'Line-up only', 'Full trim'];
    public const EXTRAS = ['Trim eyebrows', 'No hair product', 'Hair wash', 'Hard part'];

    public function user() { return $this->belongsTo(User::class); }
    public function style() { return $this->belongsTo(Style::class); }

    /** Preferences in the same shape that bookings store. */
    public function toBookingPrefs(): array
    {
        return [
            'guard' => $this->guard,
            'top' => $this->top,
            'beard' => $this->beard,
            'extras' => $this->extras ?? [],
            'notes' => $this->notes,
        ];
    }
}
