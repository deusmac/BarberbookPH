<?php

namespace App\Http\Controllers\Owner;

use App\Models\Barber;
use App\Models\BarberDayOff;
use App\Support\Fmt;
use Illuminate\Http\Request;

class BarberController extends OwnerController
{
    public function index()
    {
        $shop = $this->shop();
        $today = $this->today();
        $barbers = $shop->barbers()->with('dayOffs')->orderBy('id')->get();
        $times = [];
        for ($m = 360; $m <= 1320; $m += 30) {
            $times[Fmt::toHhmm($m)] = Fmt::time($m);
        }

        return view('owner.barbers', [
            'barbers' => $barbers, 'times' => $times, 'today' => $today,
            'offToday' => $barbers->mapWithKeys(fn ($b) => [$b->id => $b->dayOffs->contains(fn ($o) => $o->date->format('Y-m-d') === $today)]),
        ]);
    }

    public function store(Request $request)
    {
        $d = $this->validated($request, true);
        $b = $this->shop()->barbers()->create($d);

        return redirect()->route('owner.barbers')->with('toast', $b->name.' added.');
    }

    public function update(Request $request, Barber $barber)
    {
        $this->own($barber);
        $barber->update($this->validated($request, false));
        $warn = Coverage::message($barber->fresh());

        $res = redirect()->route('owner.barbers')->with('toast', $barber->name.' updated.');

        return $warn ? $res->with('toast_error', $warn) : $res;
    }

    public function dayOff(Request $request, Barber $barber)
    {
        $this->own($barber);
        $date = $request->validate(['date' => ['nullable', 'date_format:Y-m-d']])['date'] ?? $this->today();
        $off = BarberDayOff::where('barber_id', $barber->id)->whereDate('date', $date)->first();
        if ($off) {
            $off->delete();
            $msg = $barber->name.' is back on the schedule.';
            $warn = null;
        } else {
            BarberDayOff::create(['barber_id' => $barber->id, 'date' => $date]);
            $msg = $barber->name.' is marked off.';
            $warn = Coverage::message($barber->fresh());
        }
        $res = back()->with('toast', $msg);

        return $warn ? $res->with('toast_error', $warn) : $res;
    }

    private function validated(Request $request, bool $creating): array
    {
        $d = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'specialty' => ['nullable', 'string', 'max:120'],
            'years' => ['nullable', 'integer', 'between:0,60'],
            'working_days' => ['required', 'array', 'min:1'],
            'working_days.*' => ['integer', 'between:0,6'],
            'start_time' => ['required', 'regex:/^([01]\d|2[0-3]):(00|30)$/'],
            'end_time' => ['required', 'regex:/^([01]\d|2[0-3]):(00|30)$/'],
            'break_at' => ['nullable', 'regex:/^([01]\d|2[0-3]):(00|30)$/'],
        ], ['working_days.required' => 'Pick at least one working day.']);

        $start = Fmt::hhmm($d['start_time']);
        $end = Fmt::hhmm($d['end_time']);
        $errors = [];
        if ($end <= $start) {
            $errors['end_time'] = 'End time must be after start time.';
        }
        if (! empty($d['break_at'])) {
            $br = Fmt::hhmm($d['break_at']);
            if ($br < $start || $br + 60 > $end) {
                $errors['break_at'] = 'The one hour break must fall inside working hours.';
            }
        }
        if ($errors) {
            throw \Illuminate\Validation\ValidationException::withMessages($errors);
        }

        return [
            'name' => trim($d['name']), 'specialty' => $d['specialty'] ?? null, 'years' => (int) ($d['years'] ?? 0),
            'working_days' => array_values(array_unique(array_map('intval', $d['working_days']))),
            'start_time' => $d['start_time'], 'end_time' => $d['end_time'], 'break_at' => $d['break_at'] ?: null,
            'active' => $creating ? true : $request->boolean('active'),
        ];
    }
}
