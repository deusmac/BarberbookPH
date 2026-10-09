<?php

namespace Tests\Unit;

use App\Sms\LogSmsGateway;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Tests\TestCase;

class SmsGatewayTest extends TestCase
{
    public function test_log_driver_masks_the_number_and_omits_the_message(): void
    {
        Log::shouldReceive('info')->once()->withArgs(function (string $line) {
            return str_contains($line, '*******4567') && ! str_contains($line, '639171234567') && ! str_contains($line, 'secret body');
        });
        (new LogSmsGateway())->send('639171234567', 'secret body');
    }

    public function test_log_driver_is_refused_in_production(): void
    {
        $this->app['env'] = 'production';
        $this->expectException(RuntimeException::class);
        (new LogSmsGateway())->send('639171234567', 'x');
    }
}
