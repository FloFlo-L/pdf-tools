<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/tools/{tool}', function ($tool) {
    return Inertia::render('tools/'.$tool);
})->name('tools.show');

Route::post('/locale', function (Request $request) {
    $locale = $request->input('locale');

    if (in_array($locale, ['en', 'fr'])) {
        $request->session()->put('locale', $locale);
    }

    return back();
})->name('locale.update');
