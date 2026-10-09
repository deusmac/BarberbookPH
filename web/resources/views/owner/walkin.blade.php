@extends('layouts.owner')
@section('title', 'Walk-in | BarberBook PH')
@section('content')
@include('owner.partials.assets')
<div class="oh"><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Walk-in</h1></div>

@if ($services->isEmpty() || $barbers->isEmpty())
    <div class="card empty">Add at least one active service and one active barber first.</div>
@else
<form class="card col walkin" method="post" action="{{ route('owner.walkin.store') }}" data-slots-url="{{ route('owner.walkin.slots') }}">
    @csrf
    <div><label class="lbl" for="guest_name">Customer name (optional)</label>
        <input class="input" id="guest_name" name="guest_name" maxlength="80" value="{{ old('guest_name') }}" placeholder="Walk-in guest"></div>
    <div><label class="lbl" for="service_id">Service</label>
        <select class="select" id="service_id" name="service_id">
            @foreach ($services as $s)<option value="{{ $s->id }}" @selected(old('service_id') == $s->id)>{{ $s->name }} ({{ \App\Support\Fmt::money($s->price) }}, {{ $s->mins }} min)</option>@endforeach
        </select></div>
    <div><label class="lbl" for="style_id">Style (optional)</label>
        <select class="select" id="style_id" name="style_id">
            <option value="">No style yet</option>
            @foreach ($styles as $s)<option value="{{ $s->id }}" @selected(old('style_id') == $s->id)>{{ $s->name }}</option>@endforeach
        </select></div>
    <div><label class="lbl" for="barber_id">Barber</label>
        <select class="select" id="barber_id" name="barber_id">
            <option value="any">First available</option>
            @foreach ($barbers as $b)<option value="{{ $b->id }}" @selected(old('barber_id') == $b->id)>{{ $b->name }}</option>@endforeach
        </select></div>
    <div><div class="lbl">When</div>
        <div class="row wrap">
            <label class="dchip"><input type="radio" name="when" value="now" @checked(old('when', 'now') === 'now')><span>Now (earliest free time)</span></label>
            <label class="dchip"><input type="radio" name="when" value="time" @checked(old('when') === 'time')><span>Pick a time today</span></label>
        </div></div>
    <div id="timeBox" class="{{ old('when', 'now') === 'time' ? '' : 'hide' }}">
        <label class="lbl" for="start_min">Time</label>
        <select class="select" id="start_min" name="start_min">
            @forelse ($slots as $s)<option value="{{ $s['start'] }}" @selected(old('start_min') == $s['start'])>{{ $s['label'] }}</option>@empty<option value="">No free times left today</option>@endforelse
        </select>
        <p class="small muted">Only times that are free for the chosen service and barber are listed.</p>
    </div>
    <p class="small muted">A walk-in is a normal booking: it blocks that time for online customers.</p>
    <button class="btn" type="submit">Add walk-in</button>
</form>
@endif
@endsection
