@extends('layouts.customer')
@section('title', 'Barber and preferences - BarberBook PH')
@section('back', route('customer.book.style'))
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
@include('customer.partials.stepbar', ['cur' => 2])
@php($p = old() ? old() + $d['prefs'] : $d['prefs'])
<form method="post" action="{{ route('customer.book.barber.save') }}" class="col" id="prefsForm">
    @csrf
    <h3 class="up">Choose your barber</h3>
    <label class="bcard svc"><input type="radio" name="barber" value="any" {{ (string) old('barber', $d['barber']) === 'any' ? 'checked' : '' }}>
        <span class="avatar">ANY</span>
        <div class="grow"><div class="b up">Any available barber</div><div class="small muted">Fastest schedule. We assign the barber for you.</div></div></label>
    @foreach ($barbers as $b)
        <label class="bcard svc"><input type="radio" name="barber" value="{{ $b->id }}" {{ (string) old('barber', $d['barber']) === (string) $b->id ? 'checked' : '' }}>
            <span class="avatar">{{ $b->initials() }}</span>
            <div class="grow"><div class="b up">{{ $b->name }}</div><div class="small muted">{{ $b->specialty }}</div>
                <div class="tiny">Next free: {{ $next[$b->id] }}</div></div></label>
    @endforeach

    <div class="row sp"><h3 class="up">Haircut preferences</h3>@if ($d['usual'])<span class="badge y">Your usual</span>@endif</div>
    <section class="card col">
        <div>
            <label class="lbl" for="guard">Guard number on the sides (0 to 8)</label>
            <div class="stepper" data-stepper>
                <button type="button" data-step="-1" aria-label="Lower guard" hidden>-</button>
                <input class="input val" id="guard" name="guard" type="number" min="0" max="8" step="1" value="{{ $p['guard'] ?? 0 }}" style="width:84px;text-align:center">
                <button type="button" data-step="1" aria-label="Raise guard" hidden>+</button>
            </div>
        </div>
        <div>
            <div class="lbl">Length on top</div>
            <div class="segmented seg-radio">@foreach ($tops as $o)<label class="opt"><input type="radio" name="top" value="{{ $o }}" {{ ($p['top'] ?? 'Medium') === $o ? 'checked' : '' }}><span>{{ $o }}</span></label>@endforeach</div>
        </div>
        <div>
            <div class="lbl">Beard</div>
            <div class="segmented seg-radio">@foreach ($beards as $o)<label class="opt"><input type="radio" name="beard" value="{{ $o }}" {{ ($p['beard'] ?? 'None') === $o ? 'checked' : '' }}><span>{{ $o }}</span></label>@endforeach</div>
        </div>
        <div>
            <div class="lbl">Extras</div>
            <div class="row wrap">@foreach ($extrasList as $x)<label class="chip pick"><input type="checkbox" name="extras[]" value="{{ $x }}" {{ in_array($x, (array) ($p['extras'] ?? []), true) ? 'checked' : '' }}><span>{{ $x }}</span></label>@endforeach</div>
        </div>
        <div>
            <label class="lbl" for="notes">Notes to barber</label>
            <textarea class="textarea" id="notes" name="notes" maxlength="200" placeholder="Tell the barber what to watch out for">{{ $p['notes'] ?? '' }}</textarea>
            <div class="tiny muted" style="text-align:right"><span id="notesCount">{{ mb_strlen($p['notes'] ?? '') }}</span>/200</div>
        </div>
        <label class="row small"><input type="checkbox" name="save_usual" value="1" {{ old('save_usual', $d['save_usual'] ? '1' : '') ? 'checked' : '' }}> <span>Save as my usual</span></label>
    </section>
    <button class="btn block" type="submit">Continue</button>
</form>
@push('scripts')<script src="{{ asset('js/customer.js') }}"></script>@endpush
@endsection
