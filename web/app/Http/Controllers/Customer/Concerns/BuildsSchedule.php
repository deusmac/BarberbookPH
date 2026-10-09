<?php

namespace App\Http\Controllers\Customer\Concerns;

use App\Models\Shop;
use App\Services\AvailabilityService;
use Illuminate\Support\Carbon;

trait BuildsSchedule
{
    protected function validDate(?string $d): ?string
    {
        if (! $d || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) {
            return null;
        }
        try {
            $c = Carbon::createFromFormat('Y-m-d', $d);
        } catch (\Throwable) {
            return null;
        }

        return $c && $c->format('Y-m-d') === $d ? $d : null;
    }

    protected function barberPool(Shop $shop, int|string $sel)
    {
        $q = $shop->barbers()->where('active', true)->with('dayOffs');
        if ($sel !== 'any') {
            $q->whereKey($sel);
        }

        return $q->get();
    }

    /**
     * Calendar and slot data for the schedule screens.
     * @return array{barbers:\Illuminate\Support\Collection,month:Carbon,status:array,date:?string,slots:array,prev:?string,next:?string}
     */
    protected function scheduleData(Shop $shop, int|string $sel, int $dur, ?int $exclude, ?string $date, ?string $month): array
    {
        $avail = new AvailabilityService();
        $barbers = $this->barberPool($shop, $sel);
        $curMonth = now()->startOfMonth();
        $maxMonth = $curMonth->copy()->addMonth();
        $date = $this->validDate($date);
        if ($date && $date < now()->format('Y-m-d')) {
            $date = null;
        }

        $m = null;
        if ($date) {
            $m = Carbon::parse($date)->startOfMonth();
        } elseif ($month && preg_match('/^\d{4}-\d{2}$/', $month)) {
            $m = Carbon::parse($month.'-01')->startOfMonth();
        }
        $explicitMonth = $m !== null;
        $m = $m ?? $curMonth->copy();
        if ($m->lt($curMonth)) {
            $m = $curMonth->copy();
        }
        if ($m->gt($maxMonth)) {
            $m = $maxMonth->copy();
        }

        $status = $avail->month($barbers, $m->year, $m->month, $dur, $exclude);
        if (! $date) {
            $date = collect($status)->search('free') ?: null;
            if (! $date && ! $explicitMonth && $m->lt($maxMonth)) {
                $m = $maxMonth->copy();
                $status = $avail->month($barbers, $m->year, $m->month, $dur, $exclude);
                $date = collect($status)->search('free') ?: null;
            }
        }
        $slots = $date ? $avail->slots($barbers, $date, $dur, $exclude) : [];

        return [
            'barbers' => $barbers, 'month' => $m, 'status' => $status, 'date' => $date, 'slots' => $slots,
            'prev' => $m->gt($curMonth) ? $m->copy()->subMonth()->format('Y-m') : null,
            'next' => $m->lt($maxMonth) ? $m->copy()->addMonth()->format('Y-m') : null,
        ];
    }
}
