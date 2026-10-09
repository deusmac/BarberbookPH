<?php

return [
    // log | semaphore
    'driver' => env('SMS_DRIVER', 'log'),

    'semaphore' => [
        'url' => env('SEMAPHORE_URL', 'https://api.semaphore.co/api/v4/messages'),
        'api_key' => env('SEMAPHORE_API_KEY'),
        'sender' => env('SEMAPHORE_SENDER_NAME', 'BarberBook'),
    ],
];
