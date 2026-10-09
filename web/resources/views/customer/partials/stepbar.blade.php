@php($labels = ['Style', 'Barber', 'Schedule', 'Review'])
<div class="stepbar" role="list" aria-label="Booking steps">
    @foreach ($labels as $i => $l)
        @php($n = $i + 1)
        <div class="st {{ $n < $cur ? 'done' : ($n === $cur ? 'cur' : '') }}" role="listitem"><span class="dot">{{ $n < $cur ? "\u{2713}" : $n }}</span>{{ $l }}</div>
        @if ($n < 4)<span class="ln"></span>@endif
    @endforeach
</div>
