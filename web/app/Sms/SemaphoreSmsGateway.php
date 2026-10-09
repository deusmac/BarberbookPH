<?php

namespace App\Sms;

use App\Contracts\SmsGateway;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/** Semaphore (semaphore.co), a Philippine SMS provider. Needs SEMAPHORE_API_KEY. */
class SemaphoreSmsGateway implements SmsGateway
{
    public function send(string $to, string $message): void
    {
        $key = config('sms.semaphore.api_key');
        if (! $key) {
            throw new RuntimeException('SEMAPHORE_API_KEY is not set.');
        }
        $res = Http::asForm()->timeout(10)->post(config('sms.semaphore.url'), [
            'apikey' => $key,
            'number' => $to,
            'message' => $message,
            'sendername' => config('sms.semaphore.sender'),
        ]);
        if ($res->failed()) {
            throw new RuntimeException('SMS gateway returned HTTP '.$res->status());
        }
    }
}
