<?php

namespace App\Sms;

use App\Contracts\SmsGateway;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Development driver: records that an SMS would have been sent, without the message body
 * and with the number masked, so personal data never lands in log files.
 * Refuses to run in production: set SMS_DRIVER=semaphore there.
 */
class LogSmsGateway implements SmsGateway
{
    public function send(string $to, string $message): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('SMS_DRIVER=log is not allowed in production. Set SMS_DRIVER=semaphore.');
        }
        Log::info('SMS (log driver) to '.str_repeat('*', max(0, strlen($to) - 4)).substr($to, -4).' ('.strlen($message).' characters)');
    }
}
