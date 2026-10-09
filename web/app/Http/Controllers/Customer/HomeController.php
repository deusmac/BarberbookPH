<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Shop;
use App\Models\Style;
use App\Services\AvailabilityService;
use App\Support\Fmt;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public static function openNow(Shop $s): bool
    {
        $m = now()->hour * 60 + now()->minute;

        return $s->open_time && $s->close_time && $m >= Fmt::hhmm($s->open_time) && $m < Fmt::hhmm($s->close_time);
    }

    public function home(Request $request)
    {
        $user = $request->user();
        $q = trim((string) $request->query('q', ''));
        $shops = Shop::query()
            ->when($q !== '', fn ($x) => $x->where(fn ($w) => $w->where('name', 'like', '%'.$q.'%')->orWhere('area', 'like', '%'.$q.'%')))
            ->orderByDesc('is_partner')->orderBy('distance_km')->get();
        $next = Booking::with(['barber', 'style', 'service', 'shop'])->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])->whereDate('date', '>=', now()->format('Y-m-d'))
            ->orderBy('date')->orderBy('start_min')->get()->first(fn ($b) => $b->isUpcoming());
        $pref = $user->preference?->load('style');

        return view('customer.home', [
            'shops' => $shops, 'q' => $q, 'next' => $next, 'pref' => $pref,
            'open' => $shops->mapWithKeys(fn ($s) => [$s->id => self::openNow($s)]),
            'favorite' => $user->favoriteBarber,
        ]);
    }

    public function shop(Shop $shop)
    {
        abort_unless($shop->isBookable(), 404);
        $avail = new AvailabilityService();
        $services = $shop->services()->where('active', true)->orderBy('id')->get();
        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->get();
        $next = $barbers->mapWithKeys(fn ($b) => [$b->id => $avail->nextFreeLabel($b)]);

        return view('customer.shop', [
            'shop' => $shop, 'services' => $services, 'barbers' => $barbers, 'next' => $next,
            'default' => $services->firstWhere('name', 'Haircut')?->id ?? $services->first()?->id,
            'open' => self::openNow($shop),
        ]);
    }

    public function styles(Request $request)
    {
        $cats = ['Trending', 'Fades', 'Classic', 'Textured', 'Kids', 'All'];
        $cat = in_array($request->query('cat'), $cats, true) ? $request->query('cat') : 'Trending';
        $shop = Shop::where('is_partner', true)->firstOrFail();
        $styles = Style::visible()->where('shop_id', $shop->id)
            ->when($cat === 'Trending', fn ($q) => $q->where('trending', true))
            ->when(! in_array($cat, ['Trending', 'All'], true), fn ($q) => $q->where('category', $cat))
            ->orderBy('id')->get();

        return view('customer.styles', ['styles' => $styles, 'cat' => $cat, 'cats' => $cats]);
    }
}
