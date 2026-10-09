<?php

namespace App\Http\Controllers\Owner;

use App\Models\Feedback;

class FeedbackController extends OwnerController
{
    public function index()
    {
        $shop = $this->shop();
        $all = Feedback::whereHas('booking', fn ($q) => $q->where('shop_id', $shop->id))
            ->with(['barber', 'booking.style', 'booking.service', 'user'])->latest('created_at')->latest('id')->get();
        $dist = [];
        foreach ([5, 4, 3, 2, 1] as $s) {
            $dist[$s] = $all->where('stars', $s)->count();
        }

        return view('owner.feedback', ['items' => $all, 'avg' => $all->count() ? round($all->avg('stars'), 1) : null, 'dist' => $dist, 'total' => $all->count()]);
    }
}
