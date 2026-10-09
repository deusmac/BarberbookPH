@extends('layouts.app')
@section('body_class', 'role-c')
@section('body')
<div class="cshell">
    <header class="cbar">
        @hasSection('back')
            <a class="btn icon sm secondary" href="@yield('back')" aria-label="Back">&larr;</a>
        @endif
        <a class="logo" href="{{ route('customer.home') }}">BARBER<b>BOOK</b> PH</a>
        <span class="grow"></span>
        @include('partials.theme-switch')
    </header>
    <main class="cmain">
        @if ($errors->any())
            <div class="card soft" role="alert"><ul class="plain">@foreach ($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>
        @endif
        @yield('content')
    </main>
    <nav class="ctabs" aria-label="Customer">
        <a href="{{ route('customer.home') }}" class="{{ request()->routeIs('customer.home', 'customer.shop*', 'customer.book*') ? 'on' : '' }}">Home</a>
        <a href="{{ route('customer.styles') }}" class="{{ request()->routeIs('customer.styles') ? 'on' : '' }}">Styles</a>
        <a href="{{ route('customer.bookings') }}" class="{{ request()->routeIs('customer.bookings*') ? 'on' : '' }}">Bookings</a>
        <a href="{{ route('customer.profile') }}" class="{{ request()->routeIs('customer.profile*') ? 'on' : '' }}">Profile</a>
    </nav>
</div>
@endsection
