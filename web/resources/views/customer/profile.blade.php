@extends('layouts.customer')
@section('title', 'Profile - BarberBook PH')
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<h2 class="up">Profile</h2>
<form method="post" action="{{ route('customer.profile.update') }}" class="card col">
    @csrf @method('PUT')
    <div class="b up">My details</div>
    <div><label class="lbl" for="name">Full name</label><input class="input" id="name" name="name" value="{{ old('name', $user->name) }}" required maxlength="80"></div>
    <div><label class="lbl" for="mobile">Mobile number</label><input class="input" id="mobile" name="mobile" inputmode="tel" value="{{ old('mobile', $user->mobile) }}" required>
        <div class="tiny muted">The shop may call you about your booking.</div></div>
    <div><label class="lbl" for="email">Email</label><input class="input" id="email" value="{{ $user->email }}" readonly aria-readonly="true"></div>
    <button class="btn sm" type="submit">Save details</button>
</form>

<form method="post" action="{{ route('customer.profile.prefs') }}" class="card col">
    @csrf @method('PUT')
    <div class="b up">My usual</div>
    <div><label class="lbl" for="style_id">Usual style</label>
        <select class="select" id="style_id" name="style_id"><option value="">No style</option>@foreach ($styles as $s)<option value="{{ $s->id }}" {{ (int) old('style_id', $pref?->style_id) === $s->id ? 'selected' : '' }}>{{ $s->name }}</option>@endforeach</select></div>
    <div><label class="lbl" for="favorite_barber_id">Favorite barber</label>
        <select class="select" id="favorite_barber_id" name="favorite_barber_id"><option value="">No favorite</option>@foreach ($barbers as $b)<option value="{{ $b->id }}" {{ (int) old('favorite_barber_id', $user->favorite_barber_id) === $b->id ? 'selected' : '' }}>{{ $b->name }}</option>@endforeach</select></div>
    <div><label class="lbl" for="guard">Guard number (0 to 8)</label><input class="input" id="guard" name="guard" type="number" min="0" max="8" value="{{ old('guard', $pref?->guard) }}" style="width:100px"></div>
    <div><div class="lbl">Length on top</div><div class="segmented seg-radio">@foreach ($tops as $o)<label class="opt"><input type="radio" name="top" value="{{ $o }}" {{ old('top', $pref?->top) === $o ? 'checked' : '' }}><span>{{ $o }}</span></label>@endforeach</div></div>
    <div><div class="lbl">Beard</div><div class="segmented seg-radio">@foreach ($beards as $o)<label class="opt"><input type="radio" name="beard" value="{{ $o }}" {{ old('beard', $pref?->beard) === $o ? 'checked' : '' }}><span>{{ $o }}</span></label>@endforeach</div></div>
    <div><div class="lbl">Extras</div><div class="row wrap">@foreach ($extrasList as $x)<label class="chip pick"><input type="checkbox" name="extras[]" value="{{ $x }}" {{ in_array($x, (array) old('extras', $pref?->extras ?? []), true) ? 'checked' : '' }}><span>{{ $x }}</span></label>@endforeach</div></div>
    <div><label class="lbl" for="notes">Notes to barber</label><textarea class="textarea" id="notes" name="notes" maxlength="200">{{ old('notes', $pref?->notes) }}</textarea></div>
    <button class="btn sm" type="submit">Save my usual</button>
</form>

<section>
    <div class="b up">Appointment history</div>
    <div class="col stag" style="margin-top:8px">
        @forelse ($history as $b)
            <div class="card row" style="padding:10px;gap:10px">
                @if ($b->style)<div style="width:44px;flex:none"><x-style-art :style="$b->style"/></div>@endif
                <div class="grow"><div class="b up small">{{ $b->style?->name ?? 'No style selected' }}</div><div class="tiny muted">{{ \App\Support\Fmt::date($b->date) }}</div></div>
                <span class="st-pill st-{{ $b->status }}">{{ $b->statusLabel() }}</span>
            </div>
        @empty
            <div class="empty"><p class="muted">No visits yet. Your finished cuts will appear here.</p><a class="btn sm" href="{{ route('customer.home') }}">Book a cut</a></div>
        @endforelse
    </div>
</section>
<div class="notice">Your details are used only for your bookings (RA 10173, Data Privacy Act of 2012).</div>
<form method="post" action="{{ route('logout') }}">@csrf<button class="btn secondary block" type="submit">Log out</button></form>
@endsection
