@extends('layouts.customer')
@section('title', 'Choose a style - BarberBook PH')
@section('back', route('customer.shop', $d['shop_id']))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
@include('customer.partials.stepbar', ['cur' => 1])
<p class="small muted">Pick the cut you want. Images are references, and your barber confirms the cut in the chair. Service: {{ $service->name }}.</p>
<div class="row wrap" role="group" aria-label="Style categories">
    @foreach ($cats as $c)<a class="chip {{ $cat === $c ? 'on' : '' }}" href="{{ route('customer.book.style', ['cat' => $c]) }}">{{ $c }}</a>@endforeach
</div>
<form method="post" action="{{ route('customer.book.style.save') }}" enctype="multipart/form-data" class="col">
    @csrf
    @if ($styles->isEmpty())
        <div class="empty"><p class="muted">No styles in this category yet.</p><a class="btn secondary sm" href="{{ route('customer.book.style', ['cat' => 'All']) }}">Show all styles</a></div>
    @else
        <div class="styles-grid stag">
            @foreach ($styles as $s)
                <button class="scard {{ (int) $d['style_id'] === $s->id ? 'sel' : '' }}" type="submit" name="style_id" value="{{ $s->id }}" aria-pressed="{{ (int) $d['style_id'] === $s->id ? 'true' : 'false' }}">
                    @if ($s->trending)<span class="badge y bd">Trending</span>@endif
                    <x-style-art :style="$s"/>
                    <div class="b up">{{ $s->name }}</div><div class="tiny muted">{{ $s->mins }} min · Reference image</div>
                </button>
            @endforeach
        </div>
    @endif

    <section class="card">
        <div class="tiny b up">Your reference photo (optional, sent to the barber)</div>
        @if ($d['photo_path'])
            <img class="cu-photo" src="{{ \Illuminate\Support\Facades\Storage::url($d['photo_path']) }}" alt="Reference photo you uploaded">
            <div class="row" style="margin-top:10px"><button class="btn secondary sm" type="submit" name="action" value="remove_photo" formnovalidate>Remove photo</button></div>
        @else
            <label class="lbl" for="photo" style="margin-top:8px">Upload a JPG, PNG or WEBP (max 4 MB)</label>
            <input class="input" id="photo" type="file" name="photo" accept="image/jpeg,image/png,image/webp">
        @endif
    </section>
    @if ($d['style_id'])<div class="notice">Selected: {{ $styles->firstWhere('id', $d['style_id'])?->name ?? 'your chosen style' }}. Tap Continue, or pick another.</div>@endif
    <button class="btn secondary block" type="submit" name="action" value="skip">Skip, I'll decide at the shop</button>
    <button class="btn block" type="submit" name="action" value="continue">Continue</button>
</form>
@endsection
