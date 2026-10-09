<?php

namespace App\Support;

use Carbon\CarbonInterface;

/** Display helpers shared by views and notifications. Minutes are "minutes after midnight". */
class Fmt
{
    public static function time(int $min): string
    {
        $h = intdiv($min, 60);
        $m = $min % 60;
        $ap = $h >= 12 ? 'PM' : 'AM';
        $h12 = $h % 12 ?: 12;

        return sprintf('%d:%02d %s', $h12, $m, $ap);
    }

    public static function hhmm(string $hhmm): int
    {
        [$h, $m] = array_map('intval', explode(':', $hhmm));

        return $h * 60 + $m;
    }

    public static function toHhmm(int $min): string
    {
        return sprintf('%02d:%02d', intdiv($min, 60), $min % 60);
    }

    public static function date(CarbonInterface|string $d): string
    {
        return \Illuminate\Support\Carbon::parse($d)->format('D, M j, Y');
    }

    public static function dateShort(CarbonInterface|string $d): string
    {
        return \Illuminate\Support\Carbon::parse($d)->format('D M j');
    }

    public static function money(float|int|string $n): string
    {
        return 'PHP '.number_format((float) $n, 0);
    }

}
