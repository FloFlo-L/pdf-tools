<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/tools/{tool}', function ($tool) {
    return Inertia::render('tools/' . $tool);
})->name('tools.show');