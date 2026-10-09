<?php

namespace App\Http\Controllers\Customer;

use App\Exceptions\SlotTakenException;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Customer\Concerns\BuildsSchedule;
use App\Models\Booking;
use App\Models\Feedback;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

class BookingsController extends Controller
{
    use BuildsSchedule;

    public const REASONS = ['Schedule conflict', 'Feeling sick', 'Found another time', 'Other'];

    private function mine(Request $r, Booking $b): Booking
    {
        abort_unless($b->user_id === $r->user()->id, 404);

        return $b;
    }

    public function index(Request $request)
    {
        $tab = in_array($request->query('tab'), ['upcoming', 'past', 'cancelled'], true) ? $request->query('tab') : 'upcoming';
        $all = Booking::with(['barber', 'style', 'service', 'shop'])->where('user_id', $request->user()->id)->get();
        $sort = fn ($c, $desc) => $c->sortBy(fn ($b) => $b->startsAt()->timestamp, SORT_REGULAR, $desc)->values();
        $list = match ($tab) {
            'cancelled' => $sort($all->where('status', 'cancelled'), true),
            'past' => $sort($all->filter(fn ($b) => in_array($b->status, ['done', 'noshow', 'inchair'], true)
                || (in_array($b->status, ['pending', 'confirmed'], true) && ! $b->startsAt()->isFuture())), true),
            default => $sort($all->filter(fn ($b) => $b->isUpcoming()), false),
        };

        return view('customer.bookings', ['tab' => $tab, 'list' => $list, 'reasons' => self::REASONS, 'tags' => Feedback::TAGS]);
    }

    public function cancel(Request $request, Booking $booking, BookingService $svc)
    {
        $this->mine($request, $booking);
        $v = $request->validate(['reason' => ['required', Rule::in(self::REASONS)]], ['reason.required' => 'Please choose a reason for cancelling.']);
        try {
            $svc->cancel($booking, $v['reason']);
        } catch (InvalidArgumentException $e) {
            return back()->with('toast_error', $e->getMessage());
        }

        return redirect()->route('customer.bookings', ['tab' => 'cancelled'])->with('toast', 'Booking '.$booking->reference.' cancelled.');
    }

    public function rescheduleForm(Request $request, Booking $booking)
    {
        $this->mine($request, $booking);
        if (! $booking->isUpcoming()) {
            return redirect()->route('customer.bookings')->with('toast_error', 'This booking can no longer be changed.');
        }
        $booking->load(['barber', 'service', 'style', 'shop']);
        $s = $this->scheduleData($booking->shop, $booking->barber_id, (int) $booking->duration, $booking->id, $request->query('date'), $request->query('month'));

        return view('customer.reschedule', $s + [
            'booking' => $booking, 'dur' => (int) $booking->duration, 'd' => ['date' => null, 'start_min' => null], 'assigned' => null,
            'barberModel' => $booking->barber,
            'saveRoute' => route('customer.bookings.reschedule.save', $booking), 'pageRoute' => route('customer.bookings.reschedule', $booking),
            'slotsBarber' => $booking->barber_id,
        ]);
    }

    public function reschedule(Request $request, Booking $booking, BookingService $svc)
    {
        $this->mine($request, $booking);
        $v = $request->validate(['date' => 'required|date_format:Y-m-d', 'start_min' => 'required|integer|min:0|max:1439']);
        try {
            $svc->reschedule($booking, $v['date'], (int) $v['start_min'], $booking->barber_id);
        } catch (SlotTakenException $e) {
            return redirect()->route('customer.bookings.reschedule', [$booking, 'date' => $v['date']])->withErrors(['slot' => $e->getMessage()]);
        } catch (InvalidArgumentException $e) {
            return redirect()->route('customer.bookings')->with('toast_error', $e->getMessage());
        }

        return redirect()->route('customer.bookings')->with('toast', 'Rescheduled. Your reference '.$booking->reference.' stays the same.');
    }

    public function rate(Request $request, Booking $booking, BookingService $svc)
    {
        $this->mine($request, $booking);
        $v = $request->validate([
            'stars' => 'required|integer|min:1|max:5', 'tags' => 'nullable|array', 'tags.*' => [Rule::in(Feedback::TAGS)],
            'comment' => 'nullable|string|max:500',
        ], ['stars.required' => 'Please tap a star rating.']);
        try {
            $svc->rate($booking, (int) $v['stars'], $v['tags'] ?? [], $v['comment'] ?? null);
        } catch (InvalidArgumentException $e) {
            return back()->with('toast_error', $e->getMessage());
        }

        return redirect()->route('customer.bookings', ['tab' => 'past'])->with('toast', 'Thanks for rating your cut!');
    }

    public function ics(Request $request, Booking $booking)
    {
        $this->mine($request, $booking);
        $booking->load(['barber', 'style', 'shop']);
        $esc = fn ($s) => str_replace(["\\", ';', ',', "\r\n", "\n"], ['\\\\', '\;', '\,', '\n', '\n'], (string) $s);
        $stamp = fn ($m) => $booking->dateString() !== '' ? str_replace('-', '', $booking->dateString()).'T'.sprintf('%02d%02d00', intdiv($m, 60), $m % 60) : '';
        $lines = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BarberBook PH//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
            'UID:'.$booking->reference.'@barberbook.ph', 'DTSTAMP:'.gmdate('Ymd\THis\Z'),
            'DTSTART:'.$stamp($booking->start_min), 'DTEND:'.$stamp($booking->endMin()),
            'SUMMARY:'.$esc('Haircut at '.$booking->shop->name), 'LOCATION:'.$esc($booking->shop->address ?: $booking->shop->area),
            'DESCRIPTION:'.$esc(($booking->style?->name ?? 'Haircut').' with '.$booking->barber->name.'. Ref '.$booking->reference.'. Pay at the shop.'),
            'END:VEVENT', 'END:VCALENDAR',
        ];

        return response(implode("\r\n", $lines)."\r\n", 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$booking->reference.'.ics"',
        ]);
    }
}
