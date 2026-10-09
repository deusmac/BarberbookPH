@extends('layouts.app')
@section('title', 'Create account - BarberBook PH')
@section('body_class', 'role-c')
@section('body')
<div class="authwrap">
    <a class="logo" href="{{ url('/') }}">BARBER<b>BOOK</b> PH</a>
    <form class="card col" method="post" action="{{ url('/register') }}">
        @csrf
        <h2>Create your account</h2>
        @if ($errors->any())<div class="notice" role="alert"><ul class="plain">@foreach ($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>@endif
        <div><label class="lbl" for="name">Full name</label><input class="input" id="name" name="name" value="{{ old('name') }}" autocomplete="name" required></div>
        <div><label class="lbl" for="email">Email</label><input class="input" id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" required></div>
        <div><label class="lbl" for="mobile">Mobile number</label><input class="input" id="mobile" name="mobile" inputmode="tel" placeholder="0917 123 4567" value="{{ old('mobile') }}" autocomplete="tel" required></div>
        <div><label class="lbl" for="password">Password (8 or more characters)</label><input class="input" id="password" name="password" type="password" autocomplete="new-password" required></div>
        <div><label class="lbl" for="password_confirmation">Confirm password</label><input class="input" id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" required></div>
        <label class="row small"><input type="checkbox" name="privacy" value="1" required> <span>I agree that BarberBook PH uses my details only for my bookings, as described under the Data Privacy Act of 2012 (RA 10173).</span></label>
        <button class="btn block" type="submit">Create account</button>
        <p class="small muted">Already have an account? <a href="{{ route('login') }}">Sign in</a></p>
    </form>
    @include('partials.theme-switch')
</div>
@endsection
