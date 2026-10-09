@extends('layouts.owner')
@section('title', 'Services and prices | BarberBook PH')
@section('content')
@include('owner.partials.assets')
<div class="oh"><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Services &amp; prices</h1></div>
<p class="small muted">Services are hidden, never deleted, so past bookings keep their price history. Sample prices. Final prices come from the partner shop.</p>

@foreach ($services as $s)
<form class="card col {{ $s->active ? '' : 'inactive' }}" method="post" action="{{ route('owner.services.update', $s) }}">
    @csrf @method('PUT')
    <div class="grid-in3">
        <div><label class="lbl">Name</label><input class="input" name="name" value="{{ $s->name }}" maxlength="80" required></div>
        <div><label class="lbl">Price (PHP)</label><input class="input" type="number" step="1" min="0" name="price" value="{{ (int) $s->price }}" required></div>
        <div><label class="lbl">Minutes</label><input class="input" type="number" min="5" max="240" name="mins" value="{{ $s->mins }}" required></div>
    </div>
    <div class="row wrap">
        <input type="hidden" name="includes_haircut" value="0"><label class="row"><input type="checkbox" name="includes_haircut" value="1" @checked($s->includes_haircut)> <span class="b">Includes a haircut (style time applies)</span></label>
        <input type="hidden" name="active" value="0"><label class="row"><input type="checkbox" name="active" value="1" @checked($s->active)> <span class="b">Active (uncheck to hide)</span></label>
        <span class="grow"></span><button class="btn sm" type="submit">Save</button>
    </div>
</form>
@endforeach

<form class="card col" method="post" action="{{ route('owner.services.store') }}">
    @csrf
    <h2>Add service</h2>
    <div class="grid-in3">
        <div><label class="lbl" for="sv_name">Name</label><input class="input" id="sv_name" name="name" maxlength="80" required></div>
        <div><label class="lbl" for="sv_price">Price (PHP)</label><input class="input" id="sv_price" type="number" min="0" name="price" required></div>
        <div><label class="lbl" for="sv_mins">Minutes</label><input class="input" id="sv_mins" type="number" min="5" max="240" name="mins" value="30" required></div>
    </div>
    <input type="hidden" name="includes_haircut" value="0"><label class="row"><input type="checkbox" name="includes_haircut" value="1" checked> <span class="b">Includes a haircut</span></label>
    <button class="btn" type="submit">Add service</button>
</form>
@endsection
