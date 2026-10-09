@extends('layouts.customer')
@section('title', 'Styles - BarberBook PH')
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<h2 class="up">Style gallery</h2>
<p class="small muted">Tap a style to start a booking with it. All images are reference images.</p>
<div class="row wrap" role="group" aria-label="Style categories">
    @foreach ($cats as $c)<a class="chip {{ $cat === $c ? 'on' : '' }}" href="{{ route('customer.styles', ['cat' => $c]) }}">{{ $c }}</a>@endforeach
</div>
@if ($styles->isEmpty())
    <div class="empty"><p class="muted">No styles in this category yet.</p><a class="btn secondary sm" href="{{ route('customer.styles', ['cat' => 'All']) }}">Show all styles</a></div>
@else
<form method="post" action="{{ route('customer.book.start') }}">
    @csrf
    <div class="styles-grid stag">
        @foreach ($styles as $s)
            <button class="scard" type="submit" name="style_id" value="{{ $s->id }}">
                @if ($s->trending)<span class="badge y bd">Trending</span>@endif
                <x-style-art :style="$s"/>
                <div class="b up">{{ $s->name }}</div><div class="tiny muted">{{ $s->mins }} min · Reference image</div>
            </button>
        @endforeach
    </div>
</form>
@endif
@endsection
