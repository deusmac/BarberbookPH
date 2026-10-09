@extends('layouts.owner')
@section('title', 'Queue | BarberBook PH')
@section('content')
@include('owner.partials.assets')
@php($fmt = \App\Support\Fmt::class)
<div class="oh row sp wrap" style="align-items:flex-end">
    <div><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Queue</h1></div>
    <div class="row wrap">
        <a class="btn secondary sm" href="{{ route('owner.queue', ['date' => $prev, 'view' => $view]) }}" aria-label="Previous day">Prev</a>
        <span class="b">{{ $fmt::date($date) }}{{ $isToday ? ' (today)' : '' }}</span>
        <a class="btn secondary sm" href="{{ route('owner.queue', ['date' => $next, 'view' => $view]) }}" aria-label="Next day">Next</a>
        @unless ($isToday)<a class="btn sm" href="{{ route('owner.queue', ['view' => $view]) }}">Today</a>@endunless
        <a class="btn sm" href="{{ route('owner.walkin') }}">Add walk-in</a>
    </div>
</div>

<div class="kpis">
    <div class="card kpi"><b>{{ $kpi['bookings'] }}</b><span>Bookings {{ $isToday ? 'today' : 'this day' }}</span></div>
    <div class="card kpi"><b>{{ $kpi['open'] }}</b><span>Open slots left</span></div>
    <div class="card kpi"><b>{{ $kpi['inchair'] }}</b><span>In chair now</span></div>
    <div class="card kpi"><b>{{ $kpi['noshow'] }}</b><span>No-shows this week</span></div>
</div>

<div class="segmented viewtoggle" role="group" aria-label="View">
    <a class="segbtn {{ $view === 'board' ? 'on' : '' }}" href="{{ route('owner.queue', ['date' => $date, 'view' => 'board']) }}">Timeline</a>
    <a class="segbtn {{ $view === 'list' ? 'on' : '' }}" href="{{ route('owner.queue', ['date' => $date, 'view' => 'list']) }}">List</a>
</div>

@if ($barbers->isEmpty())
    <div class="card empty">No active barbers yet. Add one under Barbers &amp; hours.</div>
@elseif ($view === 'list')
    @if ($bookings->isEmpty())
        <div class="card empty">No bookings on this day.</div>
    @else
    <div class="scroll-x"><table class="t">
        <thead><tr><th>Time</th><th>Customer</th><th>Barber</th><th>Service</th><th>Style</th><th>Status</th><th></th></tr></thead>
        <tbody>
        @foreach ($bookings as $b)
            <tr>
                <td>{{ $b->timeLabel() }} to {{ $fmt::time($b->endMin()) }}</td>
                <td>{{ $b->customerName() }}@if ($b->is_walkin) <span class="badge y">Walk-in</span>@endif</td>
                <td>{{ $b->barber->name }}</td>
                <td>{{ $b->service->name }}</td>
                <td>{{ $b->style?->name ?? '-' }}</td>
                <td><span class="st-pill st-{{ $b->status }}">{{ $b->statusLabel() }}</span></td>
                <td><a class="btn sm secondary" href="{{ route('owner.booking', $b) }}">Open</a></td>
            </tr>
        @endforeach
        </tbody>
    </table></div>
    @endif
@else
    <div class="board" style="--n:{{ $barbers->count() }};--rows:{{ $boardRows }}">
        <div class="hd"></div>
        @foreach ($barbers as $br)<div class="hd">{{ $br->name }}</div>@endforeach
        <div class="tcol">
            @for ($i = 0; $i < $boardRows; $i++)
                <div class="tc">{{ $i % 2 === 0 ? $fmt::time($boardStart + $i * 30) : '' }}</div>
            @endfor
        </div>
        @foreach ($barbers as $br)
            @php($works = $avail->barberWorks($br, $date))
            <div class="bcol">
                @if (! $works)
                    <div class="offcol">{{ $br->dayOffs->contains(fn ($o) => $o->date->format('Y-m-d') === $date) ? 'Day off' : 'Not working' }}</div>
                @else
                    @if ($br->break_at)
                        @php($bm = $fmt::hhmm($br->break_at))
                        @if ($bm >= $boardStart && $bm < $boardStart + $boardRows * 30)
                            <div class="bk brk" style="top:{{ ($bm - $boardStart) / 30 * 40 }}px;height:78px;cursor:default">Break</div>
                        @endif
                    @endif
                    @foreach ($bookings->where('barber_id', $br->id) as $b)
                        @php($s = max($b->start_min, $boardStart))
                        @php($e = min($b->endMin(), $boardStart + $boardRows * 30))
                        @if ($e > $s)
                            <a class="bk s-{{ $b->status }}" href="{{ route('owner.booking', $b) }}"
                               style="top:{{ ($s - $boardStart) / 30 * 40 }}px;height:{{ max(18, ($e - $s) / 30 * 40 - 2) }}px">
                                <span class="nm">{{ \Illuminate\Support\Str::limit($b->customerName(), 18) }}</span>
                                <span class="tiny">{{ $b->timeLabel() }} {{ $b->style?->name ?? $b->service->name }}</span>
                            </a>
                        @endif
                    @endforeach
                    @if ($isToday && $nowMin >= $boardStart && $nowMin < $boardStart + $boardRows * 30)
                        <div class="nowline" style="top:{{ ($nowMin - $boardStart) / 30 * 40 }}px"></div>
                    @endif
                @endif
            </div>
        @endforeach
    </div>
    <p class="small muted">Tap a booking to read the preference card. Colors: blue confirmed, yellow in chair, green done, red no-show.</p>
@endif
@endsection
