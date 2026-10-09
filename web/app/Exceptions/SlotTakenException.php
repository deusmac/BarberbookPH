<?php

namespace App\Exceptions;

use RuntimeException;

/** The requested time is no longer free (taken, past, day off, outside hours). */
class SlotTakenException extends RuntimeException
{
    public function __construct(string $message = 'Sorry, that slot was just taken. Please pick another time.')
    {
        parent::__construct($message);
    }
}
