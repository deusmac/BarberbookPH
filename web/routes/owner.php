<?php

// Owner routes. Registered inside middleware ['auth', 'role:owner'] with prefix "owner" and names "owner.".
use Illuminate\Support\Facades\Route;

Route::get('/queue', fn () => 'owner queue placeholder')->name('queue');
