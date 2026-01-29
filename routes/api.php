<?php

use App\Http\Controllers\Api\SignPdfController;
use Illuminate\Support\Facades\Route;

Route::prefix('pdf')->group(function () {
    Route::post('/upload', [SignPdfController::class, 'upload'])->name('pdf.upload');
    Route::post('/sign', [SignPdfController::class, 'sign'])->name('pdf.sign');
    Route::get('/{id}/download', [SignPdfController::class, 'download'])->name('pdf.download');
    Route::delete('/{id}', [SignPdfController::class, 'destroy'])->name('pdf.destroy');
});
