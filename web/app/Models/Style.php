<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Style extends Model
{
    protected $guarded = [];

    protected $casts = ['trending' => 'boolean', 'hidden' => 'boolean'];

    public const CATEGORIES = ['Fades', 'Classic', 'Textured', 'Kids'];

    public function shop() { return $this->belongsTo(Shop::class); }

    public function scopeVisible($q) { return $q->where('hidden', false); }
}
