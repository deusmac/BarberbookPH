<?php

namespace App\Services;

use App\Models\Barber;
use App\Models\Booking;
use App\Support\Fmt;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Single source of truth for "is this time free". Slots sit on a 30 minute grid.
 * A time is free only if the whole duration fits inside the barber's hours, clear of the
 * break, clear of other active bookings, and not in the past. Cheap per-request memo of
 * bookings; create a new instance (or call fresh()) for the authoritative re-check.
 */
class AvailabilityService
{
    public const GRID = 30;

    /** @var array<string, array<int, array{0:int,1:int,2:int}>> */
    private array $memo = [];

    public function fresh(): static
    {
        return new static();
    }

    /** @return array<int, array{0:int,1:int,2:int}> [start, end, bookingId] */
    private function busy(int $barberId, string $date): array
    {
        $key = $barberId.'|'.$date;
        if (! isset($this->memo[$key])) {
            $this->memo[$key] = Booking::query()
                ->where('barber_id', $barberId)->whereDate('date', $date)->active()
                ->get(['id', 'start_min', 'duration'])
                ->map(fn ($b) => [(int) $b->start_min, (int) $b->start_min + (int) $b->duration, (int) $b->id])
                ->all();
        }

        return $this->memo[$key];
    }

    public function barberWorks(Barber $b, string $date): bool
    {
        if (! $b->active) {
            return false;
        }
        $dow = (int) Carbon::parse($date)->dayOfWeek;
        if (! in_array($dow, array_map('intval', $b->working_days ?? []), true)) {
            return false;
        }
        $offs = $b->relationLoaded('dayOffs') ? $b->dayOffs : $b->dayOffs()->get();

        return ! $offs->contains(fn ($o) => $o->date->format('Y-m-d') === $date);
    }

    public function isFree(Barber $b, string $date, int $start, int $dur, ?int $excludeBookingId = null): bool
    {
        $today = now()->format('Y-m-d');
        if ($date < $today || ! $this->barberWorks($b, $date)) {
            return false;
        }
        if ($start < Fmt::hhmm($b->start_time) || $start + $dur > Fmt::hhmm($b->end_time)) {
            return false;
        }
        if ($b->break_at) {
            $br = Fmt::hhmm($b->break_at);
            if ($start < $br + 60 && $start + $dur > $br) {
                return false;
            }
        }
        if ($date === $today && $start < now()->hour * 60 + now()->minute) {
            return false;
        }
        foreach ($this->busy($b->id, $date) as [$s, $e, $id]) {
            if ($id !== $excludeBookingId && $start < $e && $start + $dur > $s) {
                return false;
            }
        }

        return true;
    }

    /** All grid start times any of the given barbers work on that date. @return int[] */
    public function candidateTimes(Collection $barbers, string $date): array
    {
        $set = [];
        foreach ($barbers as $b) {
            if (! $this->barberWorks($b, $date)) {
                continue;
            }
            for ($t = Fmt::hhmm($b->start_time); $t + self::GRID <= Fmt::hhmm($b->end_time); $t += self::GRID) {
                $set[$t] = true;
            }
        }
        ksort($set);

        return array_keys($set);
    }

    /** @return Collection<int, Barber> barbers free at that start */
    public function freeBarbers(Collection $barbers, string $date, int $start, int $dur, ?int $exclude = null): Collection
    {
        return $barbers->filter(fn ($b) => $this->isFree($b, $date, $start, $dur, $exclude))->values();
    }

    /** Barber with the lightest day among those free, or null. */
    public function pickAuto(Collection $barbers, string $date, int $start, int $dur, ?int $exclude = null): ?Barber
    {
        return $this->freeBarbers($barbers, $date, $start, $dur, $exclude)
            ->sortBy(fn ($b) => count($this->busy($b->id, $date)))->first();
    }

    /**
     * Slot grid for the UI.
     * @return array<int, array{start:int,label:string,free:bool,state:string,barber_ids:int[]}>
     */
    public function slots(Collection $barbers, string $date, int $dur, ?int $exclude = null): array
    {
        $today = now()->format('Y-m-d');
        $nowMin = now()->hour * 60 + now()->minute;
        $out = [];
        foreach ($this->candidateTimes($barbers, $date) as $t) {
            $free = $this->freeBarbers($barbers, $date, $t, $dur, $exclude);
            $past = $date < $today || ($date === $today && $t < $nowMin);
            $out[] = [
                'start' => $t,
                'label' => Fmt::time($t),
                'free' => $free->isNotEmpty(),
                'state' => $free->isNotEmpty() ? 'free' : ($past ? 'past' : 'taken'),
                'barber_ids' => $free->pluck('id')->all(),
            ];
        }

        return $out;
    }

    public function dayHasFree(Collection $barbers, string $date, int $dur, ?int $exclude = null): bool
    {
        foreach ($this->candidateTimes($barbers, $date) as $t) {
            if ($this->freeBarbers($barbers, $date, $t, $dur, $exclude)->isNotEmpty()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calendar month status: date => 'free' | 'full' | 'off'. 'off' means nobody works or it is in the past.
     * @return array<string, string>
     */
    public function month(Collection $barbers, int $year, int $month, int $dur, ?int $exclude = null): array
    {
        $first = Carbon::create($year, $month, 1)->startOfDay();
        $today = now()->format('Y-m-d');
        $out = [];
        for ($d = $first->copy(); $d->month === $first->month; $d->addDay()) {
            $k = $d->format('Y-m-d');
            if ($k < $today || $this->candidateTimes($barbers, $k) === []) {
                $out[$k] = 'off';
            } else {
                $out[$k] = $this->dayHasFree($barbers, $k, $dur, $exclude) ? 'free' : 'full';
            }
        }

        return $out;
    }

    /** First free time within the next days, as "1:30 PM today" or "Tue Oct 13 1:30 PM". */
    public function nextFreeLabel(Barber $b, int $dur = 30, int $horizonDays = 8): string
    {
        $one = collect([$b]);
        for ($i = 0; $i < $horizonDays; $i++) {
            $date = now()->addDays($i)->format('Y-m-d');
            foreach ($this->candidateTimes($one, $date) as $t) {
                if ($this->isFree($b, $date, $t, $dur)) {
                    return $i === 0 ? Fmt::time($t).' today' : Fmt::dateShort($date).' '.Fmt::time($t);
                }
            }
        }

        return 'No slots this week';
    }
}
