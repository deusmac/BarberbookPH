<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $guarded = [];

    protected $casts = ['active' => 'boolean', 'includes_haircut' => 'boolean', 'price' => 'decimal:2'];

    public function shop() { return $this->belongsTo(Shop::class); }
}
