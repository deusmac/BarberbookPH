<?php

// Customer routes. Registered inside middleware ['auth', 'role:customer']. Route names start with "customer.".
use Illuminate\Support\Facades\Route;

Route::name('customer.')->group(function () {
    Route::get('/home', fn () => 'customer home placeholder')->name('home');
});
