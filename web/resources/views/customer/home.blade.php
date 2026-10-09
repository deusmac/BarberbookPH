@extends('layouts.customer')
@section('title', 'Home - BarberBook PH')
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<section class="hero">
    <h1>Book your next haircut in under a minute.</h1>
    <form method="get" action="{{ route('customer.home') }}" role="search">
        <label class="sr" for="q">Search shops</label>
        <input class="input" id="q" name="q" type="search" value="{{ $q }}" placeholder="Search shops by name or area">
    </form>
</section>

@if ($next)
<section class="card yellow" aria-label="Your next cut">
    @php($n = (int) now()->startOfDay()->diffInDays($next->startsAt()->startOfDay(), false))
    <div class="row sp"><span class="badge">Your next cut</span><span class="tiny b up">{{ $n <= 0 ? 'today' : ($n === 1 ? 'tomorrow' : 'in '.$n.' days') }}</span></div>
    <div class="b up" style="font-size:20px;margin-top:8px">{{ \App\Support\Fmt::date($next->date) }}</div>
    <div class="b">{{ $next->timeLabel() }}</div>
    <div class="small">{{ $next->style?->name ?? 'No style selected' }} with {{ $next->barber->name }}</div>
    <div class="row wrap" style="margin-top:10px">
        <a class="btn secondary sm" href="{{ route('customer.bookings') }}">View</a>
        <a class="btn secondary sm" href="{{ route('customer.bookings.reschedule', $next) }}">Reschedule</a>
    </div>
</section>
@endif

<section class="card soft">
    <div class="tiny b up">Quick rebook</div>
    @if ($pref)
        <p class="b up" style="font-size:18px;margin:6px 0 10px">Book your usual: {{ $pref->style?->name ?? 'Haircut' }} with {{ $favorite?->name ?? 'any barber' }}</p>
        <form method="post" action="{{ route('customer.book.quick') }}">@csrf<button class="btn block" type="submit">Book now</button></form>
    @else
        <p class="small" style="margin:6px 0 10px">After your first booking we save your usual cut here so you can rebook in one tap.</p>
    @endif
</section>

<div class="b up">Shops near Tanza, Cavite</div>
<div class="col stag">
    @forelse ($shops as $s)
        @if ($s->isBookable())
            <a class="card hover linkcard" href="{{ route('customer.shop', $s) }}">
                <div class="row sp"><div class="b up" style="font-size:18px">{{ $s->name }}</div>
                    @if ($open[$s->id])<span class="badge g">Open now</span>@else<span class="badge">Closed now</span>@endif</div>
                <div class="small muted" style="margin-top:4px">{{ $s->area }}@if ($s->distance_km) · {{ $s->distance_km }} km away @endif</div>
                <div class="small" style="margin-top:6px">Hours: {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($s->open_time)) }} to {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($s->close_time)) }}</div>
                <div class="tiny b up" style="margin-top:8px">Bookable now</div>
            </a>
        @else
            <div class="card" aria-disabled="true" style="opacity:.75">
                <div class="row sp"><div class="b up">{{ $s->name }}</div><span class="badge r">Coming soon</span></div>
                <div class="small muted" style="margin-top:4px">{{ $s->area }}</div>
            </div>
        @endif
    @empty
        <div class="empty"><p class="muted">No shops match "{{ $q }}".</p><a class="btn secondary sm" href="{{ route('customer.home') }}">Clear search</a></div>
    @endforelse
</div>
@endsection
