<?php

namespace App\Http\Controllers\Owner;

use App\Models\Booking;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class QueueController extends OwnerController
{
    public const BOARD_START = 540; // 9:00 AM
    public const BOARD_ROWS = 20;   // to 7:00 PM

    public function index(Request $request, AvailabilityService $avail)
    {
        $data = $request->validate(['date' => ['nullable', 'date_format:Y-m-d'], 'view' => ['nullable', 'in:board,list']]);
        $shop = $this->shop();
        $date = $data['date'] ?? $this->today();
        $view = $data['view'] ?? 'board';

        $barbers = $shop->barbers()->where('active', true)->with('dayOffs')->orderBy('id')->get();
        $bookings = Booking::where('shop_id', $shop->id)->whereDate('date', $date)->where('status', '!=', 'cancelled')
            ->with(['barber', 'service', 'style', 'user'])->orderBy('start_min')->get();

        $open = 0;
        foreach ($barbers as $b) {
            foreach ($avail->candidateTimes(collect([$b]), $date) as $t) {
                if ($avail->isFree($b, $date, $t, 30)) {
                    $open++;
                }
            }
        }
        $weekStart = Carbon::parse($date)->startOfWeek();
        $kpi = [
            'bookings' => $bookings->whereIn('status', Booking::ACTIVE)->count(),
            'open' => $open,
            'inchair' => $bookings->where('status', 'inchair')->count(),
            'noshow' => Booking::where('shop_id', $shop->id)->where('status', 'noshow')
                ->whereDate('date', '>=', $weekStart->format('Y-m-d'))->whereDate('date', '<=', $weekStart->copy()->endOfWeek()->format('Y-m-d'))->count(),
        ];

        $nowMin = now()->hour * 60 + now()->minute;

        return view('owner.queue', [
            'date' => $date, 'view' => $view, 'barbers' => $barbers, 'bookings' => $bookings, 'kpi' => $kpi, 'avail' => $avail,
            'isToday' => $date === $this->today(), 'nowMin' => $nowMin,
            'boardStart' => self::BOARD_START, 'boardRows' => self::BOARD_ROWS,
            'prev' => Carbon::parse($date)->subDay()->format('Y-m-d'), 'next' => Carbon::parse($date)->addDay()->format('Y-m-d'),
        ]);
    }

    public function show(Booking $booking)
    {
        $this->own($booking);
        $booking->load(['barber', 'service', 'style', 'user']);
        $last = null;
        if ($booking->user_id) {
            $last = Booking::where('shop_id', $booking->shop_id)->where('user_id', $booking->user_id)
                ->where('status', 'done')->where('id', '!=', $booking->id)->with('style')
                ->orderByDesc('date')->orderByDesc('start_min')->first();
        }

        return view('owner.booking', ['b' => $booking, 'last' => $last]);
    }

    public function status(Request $request, Booking $booking, BookingService $svc)
    {
        $this->own($booking);
        $data = $request->validate(['status' => ['required', 'in:inchair,done,noshow,cancelled']]);
        try {
            $svc->setStatus($booking, $data['status']);
        } catch (InvalidArgumentException $e) {
            return back()->with('toast_error', $e->getMessage());
        }

        return back()->with('toast', 'Booking marked as '.strtolower(Booking::STATUSES[$data['status']]).'.');
    }
}
