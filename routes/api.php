<?php

use App\Http\Controllers\Api\ConvertPdfController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\SignPdfController;
use Illuminate\Support\Facades\Route;

Route::prefix('pdf')->group(function () {
    // Generic PDF operations
    Route::post('/upload', [PdfController::class, 'upload'])->name('pdf.upload');
    Route::delete('/{id}', [PdfController::class, 'destroy'])->name('pdf.destroy');

    // Sign PDF
    Route::post('/sign', [SignPdfController::class, 'sign'])->name('pdf.sign');
    Route::get('/{id}/sign-download', [SignPdfController::class, 'download'])->name('pdf.sign-download');

    // Convert PDF to PNG
    Route::post('/convert-to-png', [ConvertPdfController::class, 'convert'])->name('pdf.convert-to-png');
    Route::get('/{id}/convert-download', [ConvertPdfController::class, 'download'])->name('pdf.convert-download');
});
