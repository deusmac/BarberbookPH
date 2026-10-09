@extends('layouts.app')
@section('title', 'Sign in - BarberBook PH')
@section('body_class', 'role-c')
@section('body')
<div class="authwrap">
    <a class="logo" href="{{ url('/') }}">BARBER<b>BOOK</b> PH</a>
    <form class="card col" method="post" action="{{ url('/login') }}">
        @csrf
        <h2>Sign in</h2>
        @if ($errors->any())<div class="notice" role="alert">{{ $errors->first() }}</div>@endif
        <div><label class="lbl" for="email">Email</label><input class="input" id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" required autofocus></div>
        <div><label class="lbl" for="password">Password</label><input class="input" id="password" name="password" type="password" autocomplete="current-password" required></div>
        <label class="row small"><input type="checkbox" name="remember" value="1"> Keep me signed in</label>
        <button class="btn block" type="submit">Sign in</button>
        <p class="small muted">New here? <a href="{{ route('register') }}">Create an account</a></p>
    </form>
    @include('partials.theme-switch')
</div>
@endsection
