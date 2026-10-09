@extends('layouts.customer')
@section('title', 'Reschedule - BarberBook PH')
@section('back', route('customer.bookings'))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<h2 class="up">Reschedule</h2>
<div class="card soft small">Booking {{ $booking->reference }}: {{ $booking->style?->name ?? 'Haircut' }} with {{ $booking->barber->name }}, now {{ \App\Support\Fmt::date($booking->date) }} at {{ $booking->timeLabel() }}. Your reference number stays the same.</div>
<div class="col">@include('customer.partials.schedule')</div>
@endsection
