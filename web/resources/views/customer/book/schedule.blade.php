@extends('layouts.customer')
@section('title', 'Pick a time - BarberBook PH')
@section('back', route('customer.book.barber'))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
@include('customer.partials.stepbar', ['cur' => 3])
<div class="col">@include('customer.partials.schedule')</div>
@endsection
