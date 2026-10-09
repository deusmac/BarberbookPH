@extends('layouts.customer')
@section('title', 'My bookings - BarberBook PH')
@push('head')<link rel="stylesheet" href="{{ asset('css/customer.css') }}">@endpush
@section('content')
<h2 class="up">My bookings</h2>
<div class="segmented tabs" role="tablist">
    @foreach (['upcoming' => 'Upcoming', 'past' => 'Past', 'cancelled' => 'Cancelled'] as $k => $l)
        <a href="{{ route('customer.bookings', ['tab' => $k]) }}" class="{{ $tab === $k ? 'on' : '' }}" role="tab" aria-selected="{{ $tab === $k ? 'true' : 'false' }}">{{ $l }}</a>
    @endforeach
</div>
@forelse ($list as $b)
    <article class="card" id="b{{ $b->id }}">
        <div class="row sp"><span class="tiny b">{{ $b->reference }}</span><span class="st-pill st-{{ $b->status }}">{{ $b->statusLabel() }}</span></div>
        <div class="cu-thumb-row" style="margin-top:10px">
            @if ($b->style)<div style="width:72px;flex:none"><x-style-art :style="$b->style"/></div>@endif
            <div class="grow"><div class="b up">{{ $b->style?->name ?? 'No style selected' }}</div>
                <div class="small">{{ \App\Support\Fmt::date($b->date) }}</div>
                <div class="small b">{{ $b->timeLabel() }} - {{ \App\Support\Fmt::time($b->endMin()) }}</div>
                <div class="small muted">with {{ $b->barber->name }} · {{ $b->shop->name }}</div>
                @if ($b->status === 'cancelled' && $b->cancel_reason)<div class="small muted">Reason: {{ $b->cancel_reason }}</div>@endif</div>
        </div>
        @if ($b->isUpcoming())
            <div class="row wrap" style="margin-top:10px">
                <a class="btn secondary sm" href="{{ route('customer.bookings.reschedule', $b) }}">Reschedule</a>
                <a class="btn secondary sm" href="{{ route('customer.bookings.ics', $b) }}">Add to calendar</a>
            </div>
            <details style="margin-top:10px"><summary class="btn danger sm">Cancel booking</summary>
                <form method="post" action="{{ route('customer.bookings.cancel', $b) }}" class="col" style="margin-top:10px" data-confirm="Tap again to confirm">
                    @csrf
                    <div class="lbl">Why are you cancelling?</div>
                    <div class="row wrap">@foreach ($reasons as $r)<label class="chip pick"><input type="radio" name="reason" value="{{ $r }}" required><span>{{ $r }}</span></label>@endforeach</div>
                    <button class="btn danger sm" type="submit">Cancel this booking</button>
                </form>
            </details>
        @elseif ($b->status === 'done' && ! $b->rated)
            <details style="margin-top:10px"><summary class="btn sm">Rate your cut</summary>
                <form method="post" action="{{ route('customer.bookings.rate', $b) }}" class="col" style="margin-top:10px">
                    @csrf
                    <div class="lbl">Stars</div>
                    <div class="row stars-pick">@for ($i = 1; $i <= 5; $i++)<label class="chip pick"><input type="radio" name="stars" value="{{ $i }}" required><span>{{ $i }}<span class="sr"> star{{ $i > 1 ? 's' : '' }}</span></span></label>@endfor</div>
                    <div class="lbl">What went well?</div>
                    <div class="row wrap">@foreach ($tags as $t)<label class="chip pick"><input type="checkbox" name="tags[]" value="{{ $t }}"><span>{{ $t }}</span></label>@endforeach</div>
                    <label class="lbl" for="c{{ $b->id }}">Comment (optional)</label>
                    <textarea class="textarea" id="c{{ $b->id }}" name="comment" maxlength="500"></textarea>
                    <button class="btn sm" type="submit">Send rating</button>
                </form>
            </details>
        @elseif ($b->status === 'done')
            <div class="tiny muted" style="margin-top:8px">Thanks for rating this cut.</div>
        @endif
    </article>
@empty
    <div class="empty">
        <p class="muted">{{ ['upcoming' => 'No upcoming cuts yet.', 'past' => 'Finished cuts will show up here.', 'cancelled' => 'No cancelled bookings.'][$tab] }}</p>
        <a class="btn sm" href="{{ route('customer.home') }}">{{ $tab === 'upcoming' ? 'Book a haircut' : 'Browse shops' }}</a>
    </div>
@endforelse
@endsection
