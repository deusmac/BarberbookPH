<?php

use Illuminate\Support\Facades\Schedule;

// Texts and emails customers whose appointment starts within the hour.
Schedule::command('bookings:remind')->everyTenMinutes();
