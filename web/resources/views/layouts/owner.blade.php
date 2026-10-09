@extends('layouts.app')
@section('body_class', 'role-o')
@section('body')
<div class="odash">
    <aside class="osb" aria-label="Owner navigation">
        <div class="brandrow"><span class="logo">BARBER<b>BOOK</b> PH</span><div class="small muted">{{ auth()->user()->shop?->name }}</div></div>
        @php($nav = [['owner.queue', 'Queue'], ['owner.walkin', 'Walk-in'], ['owner.barbers', 'Barbers & hours'], ['owner.styles', 'Style gallery'], ['owner.services', 'Services & prices'], ['owner.reports', 'Reports'], ['owner.feedback', 'Feedback']])
        @foreach ($nav as [$r, $label])
            <a class="nav {{ request()->routeIs($r.'*') ? 'on' : '' }}" href="{{ route($r) }}">{{ $label }}</a>
        @endforeach
        <span class="grow"></span>
        @include('partials.theme-switch')
        <form method="post" action="{{ route('logout') }}">@csrf<button class="btn secondary sm block" type="submit">Sign out</button></form>
    </aside>
    <main class="omain">
        @if ($errors->any())
            <div class="card soft" role="alert"><ul class="plain">@foreach ($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>
        @endif
        @yield('content')
    </main>
</div>
@endsection
