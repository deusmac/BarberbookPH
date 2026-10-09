@extends('layouts.owner')
@section('title', 'Barbers and hours | BarberBook PH')
@section('content')
@include('owner.partials.assets')
@php($days = [1 => 'Mon', 2 => 'Tue', 3 => 'Wed', 4 => 'Thu', 5 => 'Fri', 6 => 'Sat', 0 => 'Sun'])
<div class="oh"><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Barbers &amp; hours</h1></div>
<p class="small muted">Changing hours or days off never deletes bookings. If a change leaves bookings uncovered you will see a warning.</p>

<div class="grid2 bgrid">
@foreach ($barbers as $b)
    <div class="card col {{ $b->active ? '' : 'inactive' }}">
        <div class="row sp"><div class="row"><span class="avatar">{{ $b->initials() }}</span><div><b>{{ $b->name }}</b><div class="small muted">{{ $b->specialty }}</div></div></div>
            @if ($offToday[$b->id])<span class="st-pill st-noshow">Off today</span>@endif</div>
        <form class="col" method="post" action="{{ route('owner.barbers.update', $b) }}">
            @csrf @method('PUT')
            <div class="grid-in"><div><label class="lbl">Name</label><input class="input" name="name" value="{{ $b->name }}" maxlength="80" required></div>
            <div><label class="lbl">Specialty</label><input class="input" name="specialty" value="{{ $b->specialty }}" maxlength="120"></div></div>
            <input type="hidden" name="years" value="{{ $b->years }}">
            <div><div class="lbl">Working days</div>
                <div class="row wrap">@foreach ($days as $n => $label)
                    <label class="dchip"><input type="checkbox" name="working_days[]" value="{{ $n }}" @checked(in_array($n, $b->working_days ?? []))><span>{{ $label }}</span></label>
                @endforeach</div></div>
            <div class="grid-in3">
                <div><label class="lbl">Start</label><select class="select" name="start_time">@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($b->start_time === $v)>{{ $l }}</option>@endforeach</select></div>
                <div><label class="lbl">End</label><select class="select" name="end_time">@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($b->end_time === $v)>{{ $l }}</option>@endforeach</select></div>
                <div><label class="lbl">Break (1 hr)</label><select class="select" name="break_at"><option value="">No break</option>@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($b->break_at === $v)>{{ $l }}</option>@endforeach</select></div>
            </div>
            <input type="hidden" name="active" value="0">
            <label class="row"><input type="checkbox" name="active" value="1" @checked($b->active)> <span class="b">Active (can take bookings)</span></label>
            <button class="btn sm" type="submit">Save {{ $b->name }}</button>
        </form>
        <form method="post" action="{{ route('owner.barbers.dayoff', $b) }}" data-confirm="Tap again to confirm">
            @csrf
            <button class="btn secondary sm block" type="submit">{{ $offToday[$b->id] ? 'Cancel day off today' : 'Day off today' }}</button>
        </form>
    </div>
@endforeach
</div>

<form class="card col" method="post" action="{{ route('owner.barbers.store') }}">
    @csrf
    <h2>Add barber</h2>
    <div class="grid-in"><div><label class="lbl" for="nb_name">Name</label><input class="input" id="nb_name" name="name" maxlength="80" required></div>
    <div><label class="lbl" for="nb_spec">Specialty</label><input class="input" id="nb_spec" name="specialty" maxlength="120"></div></div>
    <div><div class="lbl">Working days</div><div class="row wrap">@foreach ($days as $n => $label)<label class="dchip"><input type="checkbox" name="working_days[]" value="{{ $n }}" @checked($n !== 0)><span>{{ $label }}</span></label>@endforeach</div></div>
    <div class="grid-in3">
        <div><label class="lbl">Start</label><select class="select" name="start_time">@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($v === '09:00')>{{ $l }}</option>@endforeach</select></div>
        <div><label class="lbl">End</label><select class="select" name="end_time">@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($v === '18:00')>{{ $l }}</option>@endforeach</select></div>
        <div><label class="lbl">Break (1 hr)</label><select class="select" name="break_at"><option value="">No break</option>@foreach ($times as $v => $l)<option value="{{ $v }}" @selected($v === '12:00')>{{ $l }}</option>@endforeach</select></div>
    </div>
    <button class="btn" type="submit">Add barber</button>
</form>
@endsection
