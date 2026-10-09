<?php

namespace App\Contracts;

interface SmsGateway
{
    /** Send a text. $to is international digits without a plus sign (63917...). Throw on failure. */
    public function send(string $to, string $message): void;
}
