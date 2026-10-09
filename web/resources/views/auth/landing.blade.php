@extends('layouts.app')
@section('title', 'BarberBook PH')
@section('body_class', 'role-c')
@section('body')
<div class="authwrap">
    <div class="hero">
        <h1>Book your haircut online. Get the cut you asked for.</h1>
        <p>BarberBook PH lets you pick a barber and a time, save your haircut preferences, and skip the waiting line.</p>
        <div class="row wrap" style="margin-top:14px">
            <a class="btn secondary" href="{{ route('register') }}">Create an account</a>
            <a class="btn" href="{{ route('login') }}">Sign in</a>
        </div>
    </div>
    @if ($shop)
        <div class="card"><h3>{{ $shop->name }}</h3><p class="muted">{{ $shop->area }} &middot; {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($shop->open_time)) }} to {{ \App\Support\Fmt::time(\App\Support\Fmt::hhmm($shop->close_time)) }}</p></div>
    @endif
    <div class="row sp">@include('partials.theme-switch')<span class="small muted">Payment is made at the shop.</span></div>
</div>
@endsection
