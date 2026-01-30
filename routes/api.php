<?php

use App\Http\Controllers\Api\ConvertPdfController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\SignPdfController;
use App\Http\Controllers\Api\SplitPdfController;
use Illuminate\Support\Facades\Route;

Route::prefix('pdf')->group(function () {
    // Generic PDF operations
    Route::post('/upload', [PdfController::class, 'upload'])->name('pdf.upload');
    Route::delete('/{id}', [PdfController::class, 'destroy'])->name('pdf.destroy');

    // Sign PDF
    Route::post('/sign', [SignPdfController::class, 'sign'])->name('pdf.sign');
    Route::get('/{id}/sign-download', [SignPdfController::class, 'download'])->name('pdf.sign-download');

    // Convert PDF
    Route::post('/convert-to-png', [ConvertPdfController::class, 'convertToPng'])->name('pdf.convert-to-png');
    Route::post('/convert-to-jpg', [ConvertPdfController::class, 'convertToJpg'])->name('pdf.convert-to-jpg');
    Route::get('/{id}/convert-download', [ConvertPdfController::class, 'download'])->name('pdf.convert-download');

    // Split PDF
    Route::post('/split', [SplitPdfController::class, 'split'])->name('pdf.split');
    Route::get('/{id}/split-download', [SplitPdfController::class, 'download'])->name('pdf.split-download');
});
