@extends('layouts.owner')
@section('title', 'Feedback | BarberBook PH')
@section('content')
@include('owner.partials.assets')
@php($star = fn ($n) => str_repeat('★', $n).str_repeat('☆', 5 - $n))
<div class="oh"><div class="tiny up b muted">{{ auth()->user()->shop?->name }} | Owner view</div><h1>Feedback</h1></div>

@if ($total === 0)
    <div class="card empty">No feedback yet. Customers can rate a visit after it is marked done.</div>
@else
<div class="card fbsum">
    <div class="fbavg"><b>{{ number_format($avg, 1) }}</b><span class="stars-txt" aria-hidden="true">{{ $star((int) round($avg)) }}</span><span class="small muted">{{ $total }} review{{ $total === 1 ? '' : 's' }}</span></div>
    <div class="col grow">
        @foreach ($dist as $s => $n)
            <div class="row"><span class="bar-lbl" style="width:34px">{{ $s }} star</span>
                <div class="hbar" role="img" aria-label="{{ $n }} reviews with {{ $s }} stars"><i style="width:{{ $total ? round($n / $total * 100) : 0 }}%"></i></div>
                <span class="bar-lbl" style="width:24px;text-align:right">{{ $n }}</span></div>
        @endforeach
    </div>
</div>

<div class="col">
@foreach ($items as $f)
    <div class="card col">
        <div class="row sp wrap"><span class="stars-txt" aria-label="{{ $f->stars }} out of 5 stars">{{ $star($f->stars) }}</span><span class="small muted">{{ $f->barber->name }} | {{ \App\Support\Fmt::dateShort($f->created_at) }}</span></div>
        @if ($f->comment)<p>{{ $f->comment }}</p>@endif
        <div class="row wrap">@foreach ($f->tags ?? [] as $t)<span class="chip">{{ $t }}</span>@endforeach</div>
        <div class="small muted">{{ $f->booking->user?->name ?? $f->booking->customerName() }}, {{ $f->booking->service->name }}</div>
    </div>
@endforeach
</div>
@endif
@endsection
