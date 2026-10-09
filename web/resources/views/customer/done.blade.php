@extends('layouts.customer')
@section('title', 'Booked - BarberBook PH')
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
@php($first = explode(' ', trim($user->name))[0])
@php($when = \App\Support\Fmt::dateShort($b->date).', '.$b->timeLabel())
@php($styleName = $b->style?->name ?? 'haircut')
<div class="col">
    <h2 class="up" style="text-align:center">Your slot is reserved</h2>
    <div class="ticket">
        <div class="tp row sp"><span class="b up">Booking no.</span><span class="b">{{ $b->reference }}</span></div>
        <div class="cu-thumb-row" style="padding:12px 14px">
            @if ($b->style)<div style="width:72px;flex:none"><x-style-art :style="$b->style"/></div>@endif
            <div class="grow"><div class="b up">{{ $styleName }}</div><div class="small">{{ $b->shop->name }}</div>
                <div class="small">with {{ $b->barber->name }}</div><div class="b" style="margin-top:4px">{{ $when }}</div></div>
        </div>
    </div>
    <p class="small">A confirmation email is sent to {{ $user->email }}, and a reminder email goes out about an hour before your appointment.</p>
    <div class="tiny b up">Email preview. Preview only.</div>
    <div class="mail"><div class="mh">Subject: Your BarberBook PH booking {{ $b->reference }} is confirmed</div>
        <div style="padding:10px 12px;font-size:13px;line-height:1.45">Hi {{ $first }}, your {{ $styleName }} with {{ $b->barber->name }} is confirmed for {{ $when }} at {{ $b->shop->name }}. Payment is made at the shop. To change the time, open My bookings. Ref {{ $b->reference }}.</div></div>
    <a class="btn block" href="{{ route('customer.bookings.ics', $b) }}">Add to my calendar</a>
    <a class="btn secondary block" href="{{ route('customer.bookings') }}">Go to my bookings</a>
</div>
@endsection
