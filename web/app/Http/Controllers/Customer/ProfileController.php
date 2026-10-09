<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Barber;
use App\Models\Booking;
use App\Models\CustomerPreference;
use App\Models\Shop;
use App\Models\Style;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $shop = Shop::where('is_partner', true)->first();
        $history = Booking::with(['style', 'barber'])->where('user_id', $user->id)->orderByDesc('date')->orderByDesc('start_min')->limit(30)->get();

        return view('customer.profile', [
            'user' => $user, 'pref' => $user->preference?->load('style'), 'history' => $history,
            'barbers' => $shop ? $shop->barbers()->where('active', true)->get() : collect(),
            'styles' => $shop ? Style::visible()->where('shop_id', $shop->id)->orderBy('name')->get() : collect(),
            'tops' => CustomerPreference::TOPS, 'beards' => CustomerPreference::BEARDS, 'extrasList' => CustomerPreference::EXTRAS,
        ]);
    }

    public function update(Request $request)
    {
        $request->merge(['mobile' => preg_replace('/[^\d+]/', '', (string) $request->input('mobile'))]);
        $v = $request->validate([
            'name' => 'required|string|max:80',
            'mobile' => ['required', 'regex:/^(\+?63|0)9\d{9}$/'],
        ], ['mobile.regex' => 'Enter a Philippine mobile number like 0917 123 4567.']);
        $request->user()->update(['name' => $v['name'], 'mobile' => preg_replace('/\D+/', '', $v['mobile'])]);

        return redirect()->route('customer.profile')->with('toast', 'Profile saved.');
    }

    public function preferences(Request $request, BookingService $svc)
    {
        $user = $request->user();
        $barberIds = Barber::where('active', true)->pluck('id')->all();
        $styleIds = Style::visible()->pluck('id')->all();
        $v = $request->validate([
            'favorite_barber_id' => ['nullable', Rule::in($barberIds)],
            'style_id' => ['nullable', Rule::in($styleIds)],
            'guard' => 'nullable|integer|min:0|max:8',
            'top' => ['nullable', Rule::in(CustomerPreference::TOPS)],
            'beard' => ['nullable', Rule::in(CustomerPreference::BEARDS)],
            'extras' => 'nullable|array', 'extras.*' => [Rule::in(CustomerPreference::EXTRAS)],
            'notes' => 'nullable|string|max:200',
        ]);
        $user->update(['favorite_barber_id' => $v['favorite_barber_id'] ?? null]);
        $svc->saveUsual($user->id, ! empty($v['style_id']) ? (int) $v['style_id'] : null, [
            'guard' => $v['guard'] ?? null, 'top' => $v['top'] ?? null, 'beard' => $v['beard'] ?? null,
            'extras' => $v['extras'] ?? [], 'notes' => $v['notes'] ?? null,
        ]);

        return redirect()->route('customer.profile')->with('toast', 'Your usual was saved.');
    }
}
