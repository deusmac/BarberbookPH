<?php

namespace App\Http\Controllers\Owner;

use App\Models\Barber;
use App\Models\Booking;
use App\Support\Fmt;

/**
 * Finds upcoming active bookings a barber's current hours, days or days off no longer cover.
 * It only reports; bookings are never changed or deleted.
 */
class Coverage
{
    /** @return \Illuminate\Support\Collection<int, Booking> */
    public static function uncovered(Barber $b)
    {
        $b->unsetRelation('dayOffs');
        $offs = $b->dayOffs()->get()->map(fn ($o) => $o->date->format('Y-m-d'))->all();
        $days = array_map('intval', $b->working_days ?? []);
        $start = Fmt::hhmm($b->start_time);
        $end = Fmt::hhmm($b->end_time);
        $br = $b->break_at ? Fmt::hhmm($b->break_at) : null;

        return Booking::where('barber_id', $b->id)->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('date', '>=', now()->format('Y-m-d'))->orderBy('date')->orderBy('start_min')->get()
            ->filter(function (Booking $k) use ($b, $offs, $days, $start, $end, $br) {
                $d = $k->dateString();
                if (! $b->active || in_array($d, $offs, true) || ! in_array((int) $k->date->dayOfWeek, $days, true)) {
                    return true;
                }
                if ($k->start_min < $start || $k->endMin() > $end) {
                    return true;
                }

                return $br !== null && $k->start_min < $br + 60 && $k->endMin() > $br;
            })->values();
    }

    public static function message(Barber $b): ?string
    {
        $n = self::uncovered($b)->count();

        return $n === 0 ? null : "Heads up: {$n} upcoming booking".($n === 1 ? '' : 's')." for {$b->name} fall outside the new schedule. They were not changed. Please contact those customers or reassign them.";
    }
}
