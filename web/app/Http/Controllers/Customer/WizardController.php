<?php

namespace App\Http\Controllers\Customer;

use App\Exceptions\SlotTakenException;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Customer\Concerns\BuildsSchedule;
use App\Models\Barber;
use App\Models\Booking;
use App\Models\CustomerPreference;
use App\Models\Service;
use App\Models\Shop;
use App\Models\Style;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WizardController extends Controller
{
    use BuildsSchedule;

    private const DEFAULT_PREFS = ['guard' => 0, 'top' => 'Medium', 'beard' => 'None', 'extras' => [], 'notes' => ''];

    private function shop(): Shop
    {
        return Shop::where('is_partner', true)->where('coming_soon', false)->firstOrFail();
    }

    private function draft(): array
    {
        $d = session('draft');
        if (! is_array($d)) {
            throw new HttpResponseException(redirect()->route('customer.home')->with('toast_error', 'Start a booking from the shop page.'));
        }

        return $d;
    }

    private function put(array $patch): array
    {
        $d = array_merge($this->draft(), $patch);
        session(['draft' => $d]);

        return $d;
    }

    private function service(array $d): Service
    {
        return Service::where('shop_id', $d['shop_id'])->where('active', true)->findOrFail($d['service_id']);
    }

    private function styleOf(array $d): ?Style
    {
        return ! empty($d['style_id']) ? Style::visible()->where('shop_id', $d['shop_id'])->find($d['style_id']) : null;
    }

    private function duration(array $d): int
    {
        return Booking::durationFor($this->service($d), $this->styleOf($d));
    }

    private function newDraft(Request $r, ?int $serviceId, ?int $styleId): array
    {
        $shop = $this->shop();
        $user = $r->user();
        $service = $serviceId
            ? Service::where('shop_id', $shop->id)->where('active', true)->findOrFail($serviceId)
            : ($shop->services()->where('active', true)->where('name', 'Haircut')->first() ?? $shop->services()->where('active', true)->firstOrFail());
        if ($styleId) {
            Style::visible()->where('shop_id', $shop->id)->findOrFail($styleId);
        }
        $pref = $user->preference;
        $fav = $user->favorite_barber_id && Barber::where('shop_id', $shop->id)->where('active', true)->whereKey($user->favorite_barber_id)->exists()
            ? (int) $user->favorite_barber_id : 'any';

        return [
            'shop_id' => $shop->id, 'service_id' => $service->id, 'style_id' => $styleId, 'photo_path' => null, 'barber' => $fav,
            'prefs' => $pref ? array_merge(self::DEFAULT_PREFS, array_filter($pref->toBookingPrefs(), fn ($v) => $v !== null)) : self::DEFAULT_PREFS,
            'usual' => (bool) $pref, 'save_usual' => true, 'date' => null, 'start_min' => null,
        ];
    }

    public function start(Request $request)
    {
        $data = $request->validate(['service_id' => 'nullable|integer', 'style_id' => 'nullable|integer']);
        $d = $this->newDraft($request, $data['service_id'] ?? null, $data['style_id'] ?? null);
        session(['draft' => $d]);

        return redirect()->route(! empty($d['style_id']) ? 'customer.book.barber' : 'customer.book.style');
    }

    public function quick(Request $request)
    {
        $pref = $request->user()->preference;
        $styleId = $pref?->style_id && Style::visible()->whereKey($pref->style_id)->exists() ? $pref->style_id : null;
        session(['draft' => $this->newDraft($request, null, $styleId)]);

        return redirect()->route('customer.book.schedule');
    }

    // Step 1
    public function style(Request $request)
    {
        $d = $this->draft();
        $cats = ['Trending', 'Fades', 'Classic', 'Textured', 'Kids', 'All'];
        $cat = in_array($request->query('cat'), $cats, true) ? $request->query('cat') : 'Trending';
        $styles = Style::visible()->where('shop_id', $d['shop_id'])
            ->when($cat === 'Trending', fn ($q) => $q->where('trending', true))
            ->when(! in_array($cat, ['Trending', 'All'], true), fn ($q) => $q->where('category', $cat))
            ->orderBy('id')->get();

        return view('customer.book.style', ['d' => $d, 'styles' => $styles, 'cat' => $cat, 'cats' => $cats, 'service' => $this->service($d)]);
    }

    public function saveStyle(Request $request)
    {
        $d = $this->draft();
        $request->validate([
            'style_id' => 'nullable|integer',
            'action' => 'nullable|in:continue,skip,remove_photo',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:4096',
        ], ['photo.max' => 'The photo must be 4 MB or smaller.', 'photo.mimes' => 'Use a JPG, PNG or WEBP photo.']);

        $patch = [];
        if ($request->filled('style_id')) {
            Style::visible()->where('shop_id', $d['shop_id'])->findOrFail($request->input('style_id'));
            $patch['style_id'] = (int) $request->input('style_id');
        } elseif ($request->input('action') === 'skip') {
            $patch['style_id'] = null;
        }
        if ($request->hasFile('photo')) {
            $patch['photo_path'] = $request->file('photo')->store('references', 'public');
        } elseif ($request->input('action') === 'remove_photo') {
            $patch['photo_path'] = null;
        }
        // Duration may change with the style, so a chosen time must be picked again.
        if (($patch['style_id'] ?? $d['style_id']) !== $d['style_id']) {
            $patch['date'] = null;
            $patch['start_min'] = null;
        }
        $this->put($patch);

        if ($request->input('action') === 'remove_photo' || ($request->hasFile('photo') && ! $request->filled('style_id') && $request->input('action') !== 'continue')) {
            return redirect()->route('customer.book.style')->with('toast', $request->hasFile('photo') ? 'Photo added.' : 'Photo removed.');
        }

        return redirect()->route('customer.book.barber');
    }

    // Step 2
    public function barber()
    {
        $d = $this->draft();
        $shop = Shop::findOrFail($d['shop_id']);
        $avail = new AvailabilityService();
        $dur = $this->duration($d);
        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->get();

        return view('customer.book.barber', [
            'd' => $d, 'barbers' => $barbers, 'next' => $barbers->mapWithKeys(fn ($b) => [$b->id => $avail->nextFreeLabel($b, $dur)]),
            'tops' => CustomerPreference::TOPS, 'beards' => CustomerPreference::BEARDS, 'extrasList' => CustomerPreference::EXTRAS,
            'style' => $this->styleOf($d),
        ]);
    }

    public function saveBarber(Request $request)
    {
        $d = $this->draft();
        $ids = Barber::where('shop_id', $d['shop_id'])->where('active', true)->pluck('id')->map(fn ($i) => (string) $i)->all();
        $v = $request->validate([
            'barber' => ['required', Rule::in(array_merge(['any'], $ids))],
            'guard' => 'nullable|integer|min:0|max:8',
            'top' => ['nullable', Rule::in(CustomerPreference::TOPS)],
            'beard' => ['nullable', Rule::in(CustomerPreference::BEARDS)],
            'extras' => 'nullable|array',
            'extras.*' => [Rule::in(CustomerPreference::EXTRAS)],
            'notes' => 'nullable|string|max:200',
        ]);
        $barber = $v['barber'] === 'any' ? 'any' : (int) $v['barber'];
        $patch = [
            'barber' => $barber,
            'prefs' => [
                'guard' => $v['guard'] ?? 0, 'top' => $v['top'] ?? 'Medium', 'beard' => $v['beard'] ?? 'None',
                'extras' => $v['extras'] ?? [], 'notes' => $v['notes'] ?? '',
            ],
            'save_usual' => $request->boolean('save_usual'),
        ];
        if ($barber !== $d['barber']) {
            $patch['date'] = null;
            $patch['start_min'] = null;
        }
        $this->put($patch);

        return redirect()->route('customer.book.schedule');
    }

    // Step 3
    public function schedule(Request $request)
    {
        $d = $this->draft();
        $shop = Shop::findOrFail($d['shop_id']);
        $dur = $this->duration($d);
        $date = $request->query('date') ?: ($d['date'] ?? null);
        $s = $this->scheduleData($shop, $d['barber'], $dur, null, $date, $request->query('month'));
        $assigned = null;
        if ($d['barber'] === 'any' && $d['start_min'] !== null && $d['date'] === $s['date']) {
            $assigned = (new AvailabilityService())->pickAuto($s['barbers'], $s['date'], (int) $d['start_min'], $dur);
        }
        $barberModel = $d['barber'] === 'any' ? null : $s['barbers']->first();

        return view('customer.book.schedule', $s + [
            'd' => $d, 'dur' => $dur, 'assigned' => $assigned, 'barberModel' => $barberModel, 'booking' => null,
            'saveRoute' => route('customer.book.schedule.save'), 'pageRoute' => route('customer.book.schedule'),
            'slotsBarber' => $d['barber'],
        ]);
    }

    public function saveSchedule(Request $request)
    {
        $d = $this->draft();
        $v = $request->validate(['date' => 'required|date_format:Y-m-d', 'start_min' => 'required|integer|min:0|max:1439']);
        $shop = Shop::findOrFail($d['shop_id']);
        $dur = $this->duration($d);
        $slots = (new AvailabilityService())->slots($this->barberPool($shop, $d['barber']), $v['date'], $dur);
        $ok = collect($slots)->contains(fn ($s) => $s['start'] === (int) $v['start_min'] && $s['free']);
        if (! $ok) {
            return redirect()->route('customer.book.schedule', ['date' => $v['date']])->withErrors(['slot' => (new SlotTakenException())->getMessage()]);
        }
        $this->put(['date' => $v['date'], 'start_min' => (int) $v['start_min']]);

        return redirect()->route('customer.book.review');
    }

    // Step 4
    public function review()
    {
        $d = $this->draft();
        if (empty($d['date']) || $d['start_min'] === null) {
            return redirect()->route('customer.book.schedule')->with('toast_error', 'Pick a date and time first.');
        }
        $shop = Shop::findOrFail($d['shop_id']);
        $service = $this->service($d);
        $dur = $this->duration($d);
        $barbers = $this->barberPool($shop, $d['barber']);
        $barber = (new AvailabilityService())->pickAuto($barbers, $d['date'], (int) $d['start_min'], $dur);
        if (! $barber) {
            $this->put(['start_min' => null]);

            return redirect()->route('customer.book.schedule', ['date' => $d['date']])->withErrors(['slot' => (new SlotTakenException())->getMessage()]);
        }

        return view('customer.book.review', [
            'd' => $d, 'shop' => $shop, 'service' => $service, 'style' => $this->styleOf($d), 'dur' => $dur,
            'barber' => $barber, 'any' => $d['barber'] === 'any',
        ]);
    }

    public function confirm(Request $request, BookingService $svc)
    {
        $d = $this->draft();
        if (empty($d['date']) || $d['start_min'] === null) {
            return redirect()->route('customer.book.schedule');
        }
        try {
            $booking = $svc->create([
                'shop_id' => $d['shop_id'], 'service_id' => $d['service_id'], 'style_id' => $d['style_id'],
                'barber_id' => $d['barber'], 'date' => $d['date'], 'start_min' => (int) $d['start_min'],
                'user_id' => $request->user()->id, 'prefs' => $d['prefs'], 'photo_path' => $d['photo_path'],
            ]);
        } catch (SlotTakenException $e) {
            $this->put(['start_min' => null]);

            return redirect()->route('customer.book.schedule', ['date' => $d['date']])->withErrors(['slot' => $e->getMessage()]);
        }
        if (! empty($d['save_usual'])) {
            $svc->saveUsual($request->user()->id, $d['style_id'], $d['prefs']);
        }
        session()->forget('draft');

        return redirect()->route('customer.booked', $booking);
    }

    public function done(Request $request, Booking $booking)
    {
        abort_unless($booking->user_id === $request->user()->id, 404);
        $booking->load(['barber', 'service', 'style', 'shop']);

        return view('customer.done', ['b' => $booking, 'user' => $request->user()]);
    }

    /** JSON slots for the schedule screens (progressive enhancement). */
    public function slots(Request $request)
    {
        $request->validate(['date' => 'required|date_format:Y-m-d', 'barber' => 'nullable|string', 'booking' => 'nullable|integer']);
        $exclude = null;
        if ($request->filled('booking')) {
            $b = Booking::where('user_id', $request->user()->id)->findOrFail($request->integer('booking'));
            $shop = $b->shop;
            $dur = (int) $b->duration;
            $sel = $b->barber_id;
            $exclude = $b->id;
        } else {
            $d = $this->draft();
            $shop = Shop::findOrFail($d['shop_id']);
            $dur = $this->duration($d);
            $sel = $d['barber'];
        }
        $slots = (new AvailabilityService())->slots($this->barberPool($shop, $sel), $request->query('date'), $dur, $exclude);

        return response()->json(['date' => $request->query('date'), 'slots' => array_map(
            fn ($s) => ['start' => $s['start'], 'label' => $s['label'], 'free' => $s['free'], 'state' => $s['state']], $slots
        )]);
    }
}
