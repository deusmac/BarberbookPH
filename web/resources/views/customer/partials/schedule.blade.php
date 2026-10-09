@php
    $today = now()->format('Y-m-d');
    $lead = $month->copy()->startOfMonth()->dayOfWeek;
    $prevUrl = $prev ? $pageRoute.'?month='.$prev : null;
    $nextUrl = $next ? $pageRoute.'?month='.$next : null;
@endphp
<div class="notice">Duration: {{ $dur }} min. Barber: {{ $barberModel ? $barberModel->name : 'any available barber' }}.</div>
<section class="card">
    <div class="row sp">
        @if ($prevUrl)<a class="btn icon secondary" href="{{ $prevUrl }}" aria-label="Previous month">&larr;</a>@else<span class="btn icon secondary" aria-disabled="true" style="opacity:.4">&larr;</span>@endif
        <div class="b up">{{ $month->format('F Y') }}</div>
        @if ($nextUrl)<a class="btn icon secondary" href="{{ $nextUrl }}" aria-label="Next month">&rarr;</a>@else<span class="btn icon secondary" aria-disabled="true" style="opacity:.4">&rarr;</span>@endif
    </div>
    <form method="get" action="{{ $pageRoute }}" id="calForm" style="margin-top:10px">
        <div class="cal">
            @foreach (['S', 'M', 'T', 'W', 'T', 'F', 'S'] as $h)<div class="dh">{{ $h }}</div>@endforeach
            @for ($i = 0; $i < $lead; $i++)<span></span>@endfor
            @foreach ($status as $k => $st)
                @php($n = (int) substr($k, 8, 2))
                <button type="submit" name="date" value="{{ $k }}" class="{{ $date === $k ? 'on' : '' }} {{ $k === $today ? 'today' : '' }}" {{ $st === 'free' ? '' : 'disabled' }} aria-label="{{ \App\Support\Fmt::date($k) }}{{ $st === 'full' ? ', fully booked' : '' }}">{{ $n }}@if ($st === 'full')<span class="full">FULL</span>@endif</button>
            @endforeach
        </div>
    </form>
</section>
<section class="card" id="slotsCard" data-api="{{ route('customer.slots') }}" data-barber="{{ $slotsBarber }}" data-booking="{{ $booking?->id }}">
    <div class="b up" id="slotsTitle">Time slots{{ $date ? ' - '.\App\Support\Fmt::dateShort($date) : '' }}</div>
    <form method="post" action="{{ $saveRoute }}" id="slotForm">
        @csrf
        <input type="hidden" name="date" value="{{ $date }}" id="slotDate">
        <div class="slots" id="slotsBox" style="margin-top:10px">
            @forelse ($slots as $s)
                @if ($s['free'])
                    <button type="submit" name="start_min" value="{{ $s['start'] }}" class="slot {{ ($d['date'] ?? null) === $date && ($d['start_min'] ?? null) === $s['start'] ? 'on' : '' }}">{{ $s['label'] }}</button>
                @else
                    <button type="button" class="slot taken" disabled>{{ $s['label'] }}<small>{{ $s['state'] === 'past' ? 'Past' : 'Taken' }}</small></button>
                @endif
            @empty
                <p class="muted" style="grid-column:1/-1">No openings on this day. Pick another date above.</p>
            @endforelse
        </div>
    </form>
    @if ($assigned)<div class="notice" style="margin-top:10px">Assigned to {{ $assigned->name }}</div>@endif
    <p class="tiny muted" style="margin-top:10px">Tap a free time to continue. Taken times cannot be booked, so double booking will not happen.</p>
</section>
@push('scripts')<script src="{{ asset('js/customer.js') }}"></script>@endpush
