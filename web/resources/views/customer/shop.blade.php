@extends('layouts.customer')
@section('title', $shop->name.' - BarberBook PH')
@section('back', route('customer.home'))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<section class="card">
    <div class="row sp"><div class="b up" style="font-size:22px">{{ $shop->name }}</div>@if ($open)<span class="badge g">Open now</span>@endif</div>
    <div class="small" style="margin-top:6px">{{ $shop->address ?: $shop->area }}</div>
    <div class="small">Hours: {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($shop->open_time)) }} to {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($shop->close_time)) }}</div>
</section>

<form method="post" action="{{ route('customer.book.start') }}" class="col">
    @csrf
    <h3 class="up">Services</h3>
    <div class="col stag">
        @foreach ($services as $sv)
            <label class="bcard svc"><input type="radio" name="service_id" value="{{ $sv->id }}" {{ (int) old('service_id', $default) === $sv->id ? 'checked' : '' }}>
                <div class="grow"><div class="b up">{{ $sv->name }}</div><div class="small muted">About {{ $sv->mins }} min</div></div>
                <div class="b">{{ \App\Support\Fmt::money($sv->price) }}</div></label>
        @endforeach
    </div>
    <p class="tiny muted">Sample prices. Final prices come from the partner shop.</p>

    <h3 class="up">Barbers</h3>
    <div class="row scroll-x" style="gap:10px;overflow-x:auto;align-items:stretch">
        @foreach ($barbers as $b)
            <div class="card" style="min-width:170px;flex:none">
                <span class="avatar">{{ $b->initials() }}</span>
                <div class="b up" style="margin-top:8px">{{ $b->name }}</div>
                <div class="tiny muted">{{ $b->specialty }}</div>
                @if ($b->averageRating())<div class="small">Rating {{ number_format($b->averageRating(), 1) }}</div>@endif
                <div class="tiny">Next free: {{ $next[$b->id] }}</div>
            </div>
        @endforeach
    </div>
    <div class="notice">Pay at the shop. The system only reserves your slot.</div>
    <button class="btn block" type="submit">Book an appointment</button>
</form>
@endsection
