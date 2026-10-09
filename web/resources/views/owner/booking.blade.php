@extends('layouts.owner')
@section('title', 'Preference card | BarberBook PH')
@section('content')
@include('owner.partials.assets')
@php($fmt = \App\Support\Fmt::class)
@php($p = $b->prefs ?? [])
<div class="oh row sp wrap" style="align-items:flex-end">
    <div><div class="tiny up b muted">Booking {{ $b->reference }}</div><h1>Read this before the cut</h1></div>
    <a class="btn secondary sm" href="{{ route('owner.queue', ['date' => $b->dateString()]) }}">Back to queue</a>
</div>

<div class="pcard-wrap">
    <div class="card">
        <div class="oart">
            @if ($b->photo_path)
                <img src="{{ \Illuminate\Support\Facades\Storage::url($b->photo_path) }}" alt="Reference photo from the customer" class="refphoto">
            @elseif ($b->style)
                <x-style-art :style="$b->style"/>
            @else
                <div class="empty">No style picked. Ask the customer.</div>
            @endif
        </div>
        <h2>{{ $b->style?->name ?? 'No style chosen' }}</h2>
        <p class="small muted">{{ $b->photo_path ? 'Customer reference photo' : 'Style reference' }}</p>
    </div>

    <div class="col">
        <div class="card">
            <div class="row sp wrap"><h2>{{ $b->customerName() }}</h2><span class="st-pill st-{{ $b->status }}">{{ $b->statusLabel() }}</span></div>
            <dl class="sumlist">
                <div><dt>When</dt><dd>{{ $fmt::date($b->date) }}, {{ $b->timeLabel() }} to {{ $fmt::time($b->endMin()) }}</dd></div>
                <div><dt>Barber</dt><dd>{{ $b->barber->name }}</dd></div>
                <div><dt>Service</dt><dd>{{ $b->service->name }} ({{ $fmt::money($b->price) }}, pay at the shop)</dd></div>
                @if ($b->user?->mobile)<div><dt>Mobile</dt><dd>{{ $b->user->mobile }}</dd></div>@endif
                @if ($b->is_walkin)<div><dt>Type</dt><dd>Walk-in</dd></div>@endif
            </dl>
        </div>

        <div class="card yellow pcard-main">
            <div class="pcard-guard"><span class="tiny up b">Guard</span><b>{{ isset($p['guard']) && $p['guard'] !== null ? '#'.$p['guard'] : '-' }}</b></div>
            <dl class="sumlist">
                <div><dt>Top</dt><dd>{{ $p['top'] ?? 'No preference' }}</dd></div>
                <div><dt>Beard</dt><dd>{{ $p['beard'] ?? 'No preference' }}</dd></div>
                <div><dt>Extras</dt><dd>{{ ! empty($p['extras']) ? implode(', ', $p['extras']) : 'None' }}</dd></div>
            </dl>
        </div>

        @if (! empty($p['notes']))
            <div class="sticky-note">{{ $p['notes'] }}</div>
        @endif

        @if ($last)
            <div class="card soft">Last visit: {{ $last->style?->name ?? $last->service->name }}, @if (isset($last->prefs['guard']) && $last->prefs['guard'] !== null)#{{ $last->prefs['guard'] }} guard @else no guard noted @endif ({{ $fmt::dateShort($last->date) }})</div>
        @endif

        <div class="card">
            <div class="lbl">Update status</div>
            <div class="row wrap">
                @php($acts = in_array($b->status, ['pending', 'confirmed']) ? [['inchair', 'Start', ''], ['noshow', 'No-show', 'danger'], ['cancelled', 'Cancel', 'danger']] : ($b->status === 'inchair' ? [['done', 'Done', 'green']] : []))
                @forelse ($acts as [$st, $label, $cls])
                    <form method="post" action="{{ route('owner.booking.status', $b) }}" @if ($cls === 'danger') data-confirm="Tap again to confirm" @endif>
                        @csrf<input type="hidden" name="status" value="{{ $st }}">
                        <button class="btn sm {{ $cls }}" type="submit">{{ $label }}</button>
                    </form>
                @empty
                    <span class="small muted">No further actions for a {{ strtolower($b->statusLabel()) }} booking.</span>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
