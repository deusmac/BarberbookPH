@extends('layouts.customer')
@section('title', 'Review - BarberBook PH')
@section('back', route('customer.book.schedule'))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
@include('customer.partials.stepbar', ['cur' => 4])
@php($p = $d['prefs'])
<div class="col">
    <dl class="card" style="padding:6px 14px">
        <div class="sumrow"><dt>Barbershop</dt><dd>{{ $shop->name }}<br><span class="muted">{{ $shop->area }}</span></dd></div>
        <div class="sumrow"><dt>Service</dt><dd>{{ $service->name }}</dd></div>
        <div class="sumrow"><dt>Barber</dt><dd>{{ $any ? 'Assigned to '.$barber->name : $barber->name }}</dd></div>
        <div class="sumrow"><dt>Haircut</dt><dd>
            @if ($style)<div class="cu-thumb-row" style="align-items:center"><div style="width:56px"><x-style-art :style="$style"/></div><span class="b up">{{ $style->name }}</span></div>@else No style selected @endif
            @if ($d['photo_path'])<img class="cu-photo" src="{{ \Illuminate\Support\Facades\Storage::url($d['photo_path']) }}" alt="Reference photo you uploaded" style="max-height:120px">@endif</dd></div>
        <div class="sumrow"><dt>Preferences</dt><dd>Guard {{ $p['guard'] ?? 0 }} · {{ $p['top'] ?? 'Medium' }} · {{ $p['beard'] ?? 'None' }}<br>Extras: {{ ! empty($p['extras']) ? implode(', ', $p['extras']) : 'None' }}@if (! empty($p['notes']))<br>Notes: {{ $p['notes'] }}@endif</dd></div>
        <div class="sumrow"><dt>Date</dt><dd>{{ \App\Support\Fmt::date($d['date']) }}</dd></div>
        <div class="sumrow"><dt>Time</dt><dd>{{ \App\Support\Fmt::time((int) $d['start_min']) }} - {{ \App\Support\Fmt::time((int) $d['start_min'] + $dur) }}</dd></div>
        <div class="sumrow"><dt>Duration</dt><dd>{{ $dur }} min</dd></div>
        <div class="sumrow"><dt>Total</dt><dd>{{ \App\Support\Fmt::money($service->price) }} (sample price)</dd></div>
    </dl>
    <div class="notice">Payment is made at the shop. The system only reserves your slot.</div>
    <form method="post" action="{{ route('customer.book.confirm') }}">@csrf<button class="btn block" type="submit">Confirm booking</button></form>
    <div class="row wrap">
        <a class="btn secondary sm" href="{{ route('customer.book.style') }}">Edit style</a>
        <a class="btn secondary sm" href="{{ route('customer.book.barber') }}">Edit barber</a>
        <a class="btn secondary sm" href="{{ route('customer.book.schedule') }}">Edit time</a>
    </div>
</div>
@endsection
