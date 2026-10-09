@extends('layouts.owner')
@section('title', 'Style gallery | BarberBook PH')
@section('content')
@include('owner.partials.assets')
<div class="oh"><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Style gallery</h1></div>
<p class="small muted">Hidden styles disappear from the customer gallery but stay on past bookings.</p>

<div class="grid2">
@forelse ($styles as $s)
    <div class="card col {{ $s->hidden ? 'inactive' : '' }}">
        <div class="oart"><x-style-art :style="$s"/></div>
        <div class="row sp wrap"><b>{{ $s->name }}</b>@if ($s->trending)<span class="badge y">Trending</span>@endif @if ($s->hidden)<span class="badge">Hidden</span>@endif</div>
        <div class="small muted">{{ $s->category }} | {{ $s->mins }} min</div>
        <div class="row wrap">
            <form method="post" action="{{ route('owner.styles.toggle', $s) }}">@csrf<input type="hidden" name="field" value="trending"><button class="btn sm secondary" type="submit">{{ $s->trending ? 'Remove trending' : 'Mark trending' }}</button></form>
            <form method="post" action="{{ route('owner.styles.toggle', $s) }}">@csrf<input type="hidden" name="field" value="hidden"><button class="btn sm secondary" type="submit">{{ $s->hidden ? 'Show' : 'Hide' }}</button></form>
        </div>
        <details><summary class="btn sm secondary">Edit</summary>
            <form class="col" method="post" action="{{ route('owner.styles.update', $s) }}">
                @csrf @method('PUT')
                <div><label class="lbl">Name</label><input class="input" name="name" value="{{ $s->name }}" maxlength="80" required></div>
                <div class="grid-in"><div><label class="lbl">Minutes</label><input class="input" type="number" name="mins" value="{{ $s->mins }}" min="5" max="180" required></div>
                <div><label class="lbl">Category</label><select class="select" name="category">@foreach ($cats as $c)<option @selected($s->category === $c)>{{ $c }}</option>@endforeach</select></div></div>
                <button class="btn sm" type="submit">Save</button>
            </form></details>
    </div>
@empty
    <div class="card empty">No styles yet. Add one below.</div>
@endforelse
</div>

<form class="card col" method="post" action="{{ route('owner.styles.store') }}">
    @csrf
    <h2>Add style</h2>
    <div class="grid-in"><div><label class="lbl" for="ns_name">Name</label><input class="input" id="ns_name" name="name" maxlength="80" required></div>
    <div><label class="lbl" for="ns_art">Art preset</label><select class="select" id="ns_art" name="art">@foreach ($arts as $a)<option>{{ $a }}</option>@endforeach</select></div></div>
    <div class="grid-in"><div><label class="lbl" for="ns_mins">Minutes</label><input class="input" id="ns_mins" type="number" name="mins" value="30" min="5" max="180" required></div>
    <div><label class="lbl" for="ns_cat">Category</label><select class="select" id="ns_cat" name="category">@foreach ($cats as $c)<option>{{ $c }}</option>@endforeach</select></div></div>
    <button class="btn" type="submit">Add style</button>
</form>
@endsection
