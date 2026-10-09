<?php

namespace App\Sms;

use App\Contracts\SmsGateway;
use Illuminate\Support\Facades\Log;

/** Development driver: writes the SMS to the application log instead of sending it. */
class LogSmsGateway implements SmsGateway
{
    public function send(string $to, string $message): void
    {
        Log::info('SMS (log driver) to '.$to.': '.$message);
    }
}
