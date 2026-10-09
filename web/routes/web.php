<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'landing'])->name('landing');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Customer area (routes/customer.php) and owner area (routes/owner.php).
Route::middleware(['auth', 'role:customer'])->group(base_path('routes/customer.php'));
Route::middleware(['auth', 'role:owner'])->prefix('owner')->name('owner.')->group(base_path('routes/owner.php'));
