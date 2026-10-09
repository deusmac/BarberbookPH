<?php

// Owner routes. Registered inside middleware ['auth', 'role:owner'] with prefix "owner" and names "owner.".
use App\Http\Controllers\Owner\BarberController;
use App\Http\Controllers\Owner\FeedbackController;
use App\Http\Controllers\Owner\QueueController;
use App\Http\Controllers\Owner\ReportController;
use App\Http\Controllers\Owner\ServiceController;
use App\Http\Controllers\Owner\StyleController;
use App\Http\Controllers\Owner\WalkInController;
use Illuminate\Support\Facades\Route;

Route::get('/queue', [QueueController::class, 'index'])->name('queue');
Route::get('/bookings/{booking}', [QueueController::class, 'show'])->whereNumber('booking')->name('booking');
Route::post('/bookings/{booking}/status', [QueueController::class, 'status'])->whereNumber('booking')->name('booking.status');

Route::get('/walk-in', [WalkInController::class, 'create'])->name('walkin');
Route::get('/walk-in/slots', [WalkInController::class, 'slots'])->name('walkin.slots');
Route::post('/walk-in', [WalkInController::class, 'store'])->name('walkin.store');

Route::get('/barbers', [BarberController::class, 'index'])->name('barbers');
Route::post('/barbers', [BarberController::class, 'store'])->name('barbers.store');
Route::put('/barbers/{barber}', [BarberController::class, 'update'])->whereNumber('barber')->name('barbers.update');
Route::post('/barbers/{barber}/day-off', [BarberController::class, 'dayOff'])->whereNumber('barber')->name('barbers.dayoff');

Route::get('/styles', [StyleController::class, 'index'])->name('styles');
Route::post('/styles', [StyleController::class, 'store'])->name('styles.store');
Route::put('/styles/{style}', [StyleController::class, 'update'])->whereNumber('style')->name('styles.update');
Route::post('/styles/{style}/toggle', [StyleController::class, 'toggle'])->whereNumber('style')->name('styles.toggle');

Route::get('/services', [ServiceController::class, 'index'])->name('services');
Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
Route::put('/services/{service}', [ServiceController::class, 'update'])->whereNumber('service')->name('services.update');

Route::get('/reports', [ReportController::class, 'index'])->name('reports');
Route::get('/reports/export.csv', [ReportController::class, 'csv'])->name('reports.csv');

Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback');
