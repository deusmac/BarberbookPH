<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Model;

abstract class OwnerController extends Controller
{
    protected function shop(): Shop
    {
        return auth()->user()->shop ?? abort(403, 'No shop is linked to this account.');
    }

    /** 404 for anything that belongs to another shop. */
    protected function own(Model $m): Model
    {
        abort_unless((int) $m->shop_id === (int) auth()->user()->shop_id, 404);

        return $m;
    }

    protected function today(): string
    {
        return now()->format('Y-m-d');
    }
}
