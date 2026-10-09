<?php

namespace App\Providers;

use App\Contracts\SmsGateway;
use App\Sms\LogSmsGateway;
use App\Sms\SemaphoreSmsGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SmsGateway::class, fn () => match (config('sms.driver')) {
            'semaphore' => new SemaphoreSmsGateway(),
            default => new LogSmsGateway(),
        });
    }

    public function boot(): void
    {
        //
    }
}
