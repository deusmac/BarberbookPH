<?php

namespace App\Http\Controllers\Owner;

use App\Exceptions\SlotTakenException;
use App\Models\Booking;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WalkInController extends OwnerController
{
    public function create(AvailabilityService $avail)
    {
        $shop = $this->shop();
        $services = $shop->services()->where('active', true)->orderBy('id')->get();
        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->orderBy('id')->get();
        $slots = $services->isEmpty() ? [] : $this->freeSlots($avail, $barbers->all(), $services->first()->mins, 'any');

        return view('owner.walkin', [
            'services' => $services, 'barbers' => $barbers, 'styles' => $shop->styles()->visible()->orderBy('name')->get(), 'slots' => $slots,
        ]);
    }

    public function slots(Request $request, AvailabilityService $avail)
    {
        $d = $request->validate(['service_id' => ['required', 'integer'], 'style_id' => ['nullable', 'integer'], 'barber_id' => ['required', 'string']]);
        $shop = $this->shop();
        $service = $shop->services()->where('active', true)->findOrFail($d['service_id']);
        $style = ! empty($d['style_id']) ? $shop->styles()->findOrFail($d['style_id']) : null;
        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->get();
        if ($d['barber_id'] !== 'any') {
            $barbers = $barbers->where('id', (int) $d['barber_id'])->values();
        }

        return response()->json($this->freeSlots($avail, $barbers->all(), Booking::durationFor($service, $style), $d['barber_id']));
    }

    public function store(Request $request, BookingService $svc, AvailabilityService $avail)
    {
        $shop = $this->shop();
        $d = $request->validate([
            'guest_name' => ['nullable', 'string', 'max:80'],
            'service_id' => ['required', Rule::exists('services', 'id')->where('shop_id', $shop->id)->where('active', true)],
            'style_id' => ['nullable', Rule::exists('styles', 'id')->where('shop_id', $shop->id)],
            'barber_id' => ['required', function ($attr, $v, $fail) use ($shop) {
                if ((string) $v !== 'any' && ! $shop->barbers()->where('active', true)->whereKey($v)->exists()) {
                    $fail('Choose a valid barber.');
                }
            }],
            'when' => ['required', 'in:now,time'],
            'start_min' => ['required_if:when,time', 'nullable', 'integer', 'between:0,1439'],
        ]);

        $service = $shop->services()->findOrFail($d['service_id']);
        $style = ! empty($d['style_id']) ? $shop->styles()->find($d['style_id']) : null;
        $dur = Booking::durationFor($service, $style);
        $today = $this->today();
        $now = now()->hour * 60 + now()->minute;

        if ($d['when'] === 'now') {
            $start = $this->earliestNow($avail, $shop, (string) $d['barber_id'], $dur, $now);
            if ($start === null) {
                return back()->withInput()->with('toast_error', 'No barber is free for the rest of today. Pick another barber or service.');
            }
            $status = 'inchair';
        } else {
            $start = (int) $d['start_min'];
            $status = 'confirmed';
        }

        try {
            $b = $svc->create([
                'shop_id' => $shop->id, 'service_id' => $service->id, 'style_id' => $style?->id,
                'barber_id' => (string) $d['barber_id'] === 'any' ? 'any' : (int) $d['barber_id'],
                'date' => $today, 'start_min' => $start, 'user_id' => null,
                'guest_name' => trim((string) ($d['guest_name'] ?? '')) ?: null,
                'is_walkin' => true, 'status' => $status, 'notify' => false,
            ]);
        } catch (SlotTakenException $e) {
            return back()->withInput()->with('toast_error', $e->getMessage());
        }

        return redirect()->route('owner.queue')->with('toast', 'Walk-in added for '.$b->barber->name.' at '.$b->timeLabel().'.');
    }

    /** Earliest free 5 minute start from now, for the chosen barber or any barber. */
    private function earliestNow(AvailabilityService $avail, $shop, string $barberSel, int $dur, int $now): ?int
    {
        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->get();
        if ($barberSel !== 'any') {
            $barbers = $barbers->where('id', (int) $barberSel)->values();
        }
        $fresh = $avail->fresh();
        for ($t = (int) (ceil($now / 5) * 5); $t + $dur <= 1440; $t += 5) {
            if ($fresh->freeBarbers($barbers, $this->today(), $t, $dur)->isNotEmpty()) {
                return $t;
            }
        }

        return null;
    }

    /** @return array<int, array{start:int,label:string}> */
    private function freeSlots(AvailabilityService $avail, array $barbers, int $dur, string $sel): array
    {
        $out = [];
        foreach ($avail->fresh()->slots(collect($barbers), $this->today(), $dur) as $s) {
            if ($s['free']) {
                $out[] = ['start' => $s['start'], 'label' => $s['label']];
            }
        }

        return $out;
    }
}
