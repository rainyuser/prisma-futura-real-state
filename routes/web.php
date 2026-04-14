<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PropertyController;



Route::get('/', function () {
    return Inertia::render('Properties');
});


Route::get('/properties', function () {
    return Inertia::render('Properties');
});

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
});

// PÁGINA INDIVIDUAL (IMPORTANTE)
Route::get('/property/{id}', [PropertyController::class, 'showPage'])
    ->name('properties.show');


Route::get('/admin', [PropertyController::class, 'index'])
    ->name('properties.index');

// CRUD
Route::post('/properties', [PropertyController::class, 'store']);
Route::put('/properties/{id}', [PropertyController::class, 'update']);
Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);


// API (para frontend Web3)
Route::get('/api/properties', [PropertyController::class, 'apiIndex']);
Route::get('/api/properties/{id}', [PropertyController::class, 'apiShow']);


/*Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
*/

require __DIR__.'/auth.php';
