<?php

namespace App\Http\Controllers\Owner;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends OwnerController
{
    public const RANGES = ['week' => 'This week', 'lastweek' => 'Last week', 'month' => 'This month'];

    /** @return array{0:string,1:string,2:string} range key, from, to */
    private function range(Request $request): array
    {
        $r = $request->validate(['range' => ['nullable', 'in:week,lastweek,month']])['range'] ?? 'week';
        $now = now();
        [$from, $to] = match ($r) {
            'lastweek' => [$now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek()->endOfWeek()],
            'month' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            default => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
        };

        return [$r, $from->format('Y-m-d'), $to->format('Y-m-d')];
    }

    private function query(string $from, string $to)
    {
        return Booking::where('shop_id', $this->shop()->id)->whereDate('date', '>=', $from)->whereDate('date', '<=', $to);
    }

    public function index(Request $request)
    {
        [$r, $from, $to] = $this->range($request);
        $all = $this->query($from, $to)->with(['barber', 'style'])->get();
        $booked = $all->where('status', '!=', 'cancelled'); // everything that took chair time or was a no-show

        $perDay = [];
        for ($d = Carbon::parse($from); $d->format('Y-m-d') <= $to; $d->addDay()) {
            $perDay[$d->format('Y-m-d')] = 0;
        }
        foreach ($booked as $b) {
            $perDay[$b->dateString()]++;
        }
        $perBarber = $booked->groupBy(fn ($b) => $b->barber->name)->map->count()->sortDesc();
        $topStyles = $booked->whereNotNull('style_id')->groupBy(fn ($b) => $b->style->name)->map->count()->sortDesc()->take(5);

        $statuses = [];
        foreach (Booking::STATUSES as $k => $label) {
            $n = $all->where('status', $k)->count();
            $statuses[$k] = ['label' => $label, 'n' => $n, 'pct' => $all->count() ? round($n / $all->count() * 100) : 0];
        }

        // Heat grid: Monday first, start hours 9 AM to 6 PM.
        $heat = [];
        $max = 0;
        foreach ($booked as $b) {
            $dow = ((int) $b->date->dayOfWeek + 6) % 7;
            $h = intdiv($b->start_min, 60);
            if ($h >= 9 && $h <= 18) {
                $heat[$dow][$h] = ($heat[$dow][$h] ?? 0) + 1;
                $max = max($max, $heat[$dow][$h]);
            }
        }

        return view('owner.reports', [
            'range' => $r, 'ranges' => self::RANGES, 'from' => $from, 'to' => $to, 'total' => $all->count(),
            'perDay' => $perDay, 'perBarber' => $perBarber, 'topStyles' => $topStyles, 'statuses' => $statuses, 'heat' => $heat, 'heatMax' => $max,
        ]);
    }

    public function csv(Request $request)
    {
        [$r, $from, $to] = $this->range($request);
        $rows = $this->query($from, $to)->with(['barber', 'service', 'style', 'user'])->orderBy('date')->orderBy('start_min')->get();
        $safe = function ($v) {
            $v = (string) $v;

            return ($v !== '' && strpbrk($v[0], "=+-@\t\r") !== false) ? "'".$v : $v;
        };

        return response()->streamDownload(function () use ($rows, $safe) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Reference', 'Date', 'Time', 'Barber', 'Customer', 'Service', 'Style', 'Status', 'Walk-in', 'Minutes', 'Price']);
            foreach ($rows as $b) {
                fputcsv($out, array_map($safe, [
                    $b->reference, $b->dateString(), $b->timeLabel(), $b->barber->name, $b->customerName(), $b->service->name,
                    $b->style?->name ?? '', $b->statusLabel(), $b->is_walkin ? 'Yes' : 'No', $b->duration, number_format((float) $b->price, 2, '.', ''),
                ]));
            }
            fclose($out);
        }, "barberbook-bookings-{$r}-{$from}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
