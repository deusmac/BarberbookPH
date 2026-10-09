@extends('layouts.owner')
@section('title', 'Reports | BarberBook PH')
@section('content')
@include('owner.partials.assets')
@php($dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
<div class="oh row sp wrap" style="align-items:flex-end">
    <div><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Reports</h1></div>
    <div class="row wrap">
        <div class="segmented rangeseg" role="group" aria-label="Range">
            @foreach ($ranges as $k => $label)<a class="segbtn {{ $range === $k ? 'on' : '' }}" href="{{ route('owner.reports', ['range' => $k]) }}">{{ $label }}</a>@endforeach
        </div>
        <a class="btn sm" href="{{ route('owner.reports.csv', ['range' => $range]) }}">Export CSV</a>
    </div>
</div>
<p class="small muted">{{ \App\Support\Fmt::dateShort($from) }} to {{ \App\Support\Fmt::dateShort($to) }}. Counts exclude cancelled bookings except the status breakdown.</p>

@if ($total === 0)
    <div class="card empty">No bookings in this range yet.</div>
@else
<div class="grid2 rgrid">
    <div class="card col">
        <h3>Bookings per day</h3>
        @php($mx = max(1, max($perDay)))
        @php($n = count($perDay))
        @php($bw = 100 / max(1, $n))
        <svg class="ochart" viewBox="0 0 100 52" preserveAspectRatio="none" role="img" aria-label="Bookings per day bar chart" style="height:150px">
            @foreach (array_values($perDay) as $i => $v)
                <rect x="{{ $i * $bw + $bw * 0.15 }}" y="{{ 44 - $v / $mx * 40 }}" width="{{ $bw * 0.7 }}" height="{{ $v / $mx * 40 }}" fill="var(--blue)"><title>{{ array_keys($perDay)[$i] }}: {{ $v }}</title></rect>
            @endforeach
        </svg>
        <div class="daylbls" style="--n:{{ $n }}">@foreach (array_keys($perDay) as $d)<span>{{ $n > 8 ? \Illuminate\Support\Carbon::parse($d)->format('j') : \Illuminate\Support\Carbon::parse($d)->format('D') }}<br><b>{{ $perDay[$d] }}</b></span>@endforeach</div>
    </div>

    <div class="card col">
        <h3>Bookings per barber</h3>
        @php($bmx = max(1, $perBarber->max()))
        @foreach ($perBarber as $name => $v)
            <div class="row"><span class="bar-lbl" style="width:90px">{{ $name }}</span><div class="hbar"><i style="width:{{ round($v / $bmx * 100) }}%"></i></div><span class="bar-lbl">{{ $v }}</span></div>
        @endforeach
    </div>

    <div class="card col">
        <h3>Top 5 styles</h3>
        @if ($topStyles->isEmpty())<div class="empty">No styles picked in this range.</div>@else
        @php($smx = max(1, $topStyles->max()))
        @foreach ($topStyles as $name => $v)
            <div class="row"><span class="bar-lbl" style="width:120px">{{ $name }}</span><div class="hbar"><i style="width:{{ round($v / $smx * 100) }}%"></i></div><span class="bar-lbl">{{ $v }}</span></div>
        @endforeach
        @endif
    </div>

    <div class="card col">
        <h3>Status breakdown</h3>
        @foreach ($statuses as $k => $s)
            <div class="row"><span class="st-pill st-{{ $k }}" style="width:92px;text-align:center">{{ $s['label'] }}</span><div class="hbar"><i style="width:{{ $s['pct'] }}%"></i></div><span class="bar-lbl">{{ $s['n'] }} ({{ $s['pct'] }}%)</span></div>
        @endforeach
    </div>
</div>

<div class="card col">
    <h3>Busiest hours</h3>
    <div class="scroll-x"><div class="heatgrid" style="--hn:10">
        <span></span>@for ($h = 9; $h <= 18; $h++)<span class="tiny b">{{ \App\Support\Fmt::time($h * 60) }}</span>@endfor
        @foreach ($dayNames as $di => $dn)
            <span class="tiny b">{{ $dn }}</span>
            @for ($h = 9; $h <= 18; $h++)
                @php($v = $heat[$di][$h] ?? 0)
                @php($pct = $heatMax ? round($v / $heatMax * 100) : 0)
                <span class="heatc" style="background:color-mix(in srgb, var(--blue) {{ $pct }}%, #fff);color:{{ $pct > 55 ? '#fff' : '#000' }}" title="{{ $dn }} {{ \App\Support\Fmt::time($h * 60) }}: {{ $v }}">{{ $v ?: '' }}</span>
            @endfor
        @endforeach
    </div></div>
</div>
@endif
<p class="small muted">Reports help the owner decide shop hours and staffing.</p>
@endsection
