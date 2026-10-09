<?php

// Customer routes. Registered inside middleware ['auth', 'role:customer']. Route names start with "customer.".
use App\Http\Controllers\Customer\BookingsController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\WizardController;
use Illuminate\Support\Facades\Route;

Route::name('customer.')->group(function () {
    Route::get('/home', [HomeController::class, 'home'])->name('home');
    Route::get('/shops/{shop}', [HomeController::class, 'shop'])->name('shop');
    Route::get('/styles', [HomeController::class, 'styles'])->name('styles');

    Route::post('/book/start', [WizardController::class, 'start'])->name('book.start');
    Route::post('/book/quick', [WizardController::class, 'quick'])->name('book.quick');
    Route::get('/book/style', [WizardController::class, 'style'])->name('book.style');
    Route::post('/book/style', [WizardController::class, 'saveStyle'])->name('book.style.save');
    Route::get('/book/barber', [WizardController::class, 'barber'])->name('book.barber');
    Route::post('/book/barber', [WizardController::class, 'saveBarber'])->name('book.barber.save');
    Route::get('/book/schedule', [WizardController::class, 'schedule'])->name('book.schedule');
    Route::post('/book/schedule', [WizardController::class, 'saveSchedule'])->name('book.schedule.save');
    Route::get('/book/review', [WizardController::class, 'review'])->name('book.review');
    Route::post('/book/confirm', [WizardController::class, 'confirm'])->name('book.confirm');
    Route::get('/booking/{booking}/done', [WizardController::class, 'done'])->name('booked');
    Route::get('/api/slots', [WizardController::class, 'slots'])->name('slots');

    Route::get('/bookings', [BookingsController::class, 'index'])->name('bookings');
    Route::get('/bookings/{booking}/ics', [BookingsController::class, 'ics'])->name('bookings.ics');
    Route::get('/bookings/{booking}/reschedule', [BookingsController::class, 'rescheduleForm'])->name('bookings.reschedule');
    Route::post('/bookings/{booking}/reschedule', [BookingsController::class, 'reschedule'])->name('bookings.reschedule.save');
    Route::post('/bookings/{booking}/cancel', [BookingsController::class, 'cancel'])->name('bookings.cancel');
    Route::post('/bookings/{booking}/rate', [BookingsController::class, 'rate'])->name('bookings.rate');

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/preferences', [ProfileController::class, 'preferences'])->name('profile.prefs');
});
