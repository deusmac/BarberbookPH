<!DOCTYPE html>
<html><body style="font-family:Arial,Helvetica,sans-serif;color:#1F2A44;background:#FFF6EA;padding:16px">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:20px">
    <h2 style="margin:0 0 6px">BARBERBOOK PH</h2>
    <p style="margin:0 0 14px">Hi {{ explode(' ', $booking->customerName())[0] }}, {{ $intro }}</p>
    <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td><strong>Reference</strong></td><td>{{ $booking->reference }}</td></tr>
        <tr><td><strong>Shop</strong></td><td>{{ $booking->shop->name }}</td></tr>
        <tr><td><strong>Barber</strong></td><td>{{ $booking->barber->name }}</td></tr>
        <tr><td><strong>Service</strong></td><td>{{ $booking->service->name }}@if ($booking->style) &middot; {{ $booking->style->name }}@endif</td></tr>
        <tr><td><strong>When</strong></td><td>{{ \App\Support\Fmt::date($booking->date) }}, {{ $booking->timeLabel() }}</td></tr>
        <tr><td><strong>Total</strong></td><td>{{ \App\Support\Fmt::money($booking->price) }} (pay at the shop)</td></tr>
    </table>
    <p style="font-size:12px;color:#5A6580;margin-top:16px">You can reschedule or cancel from My Bookings. Your details are used only for your bookings (RA 10173).</p>
</div></body></html>
