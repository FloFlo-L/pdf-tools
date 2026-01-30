<?php

namespace App\Console\Commands;

use App\Services\PdfConverterService;
use App\Services\PdfService;
use App\Services\PdfSignerService;
use App\Services\PdfSplitterService;
use Illuminate\Console\Command;

class CleanupTempPdfs extends Command
{
    protected $signature = 'pdf:cleanup {--minutes=60 : Max age in minutes}';

    protected $description = 'Cleanup temporary PDF files older than the given duration';

    public function handle(
        PdfService $pdfService,
        PdfSignerService $pdfSigner,
        PdfConverterService $pdfConverter,
        PdfSplitterService $pdfSplitter,
    ): int {
        $minutes = (int) $this->option('minutes');

        $uploadCount = $pdfService->cleanupOlderThan($minutes);
        $signedCount = $pdfSigner->cleanupOlderThan($minutes);
        $convertedCount = $pdfConverter->cleanupOlderThan($minutes);
        $splitCount = $pdfSplitter->cleanupOlderThan($minutes);

        $total = $uploadCount + $signedCount + $convertedCount + $splitCount;
        $this->info("Cleaned up {$total} temporary file(s).");

        return Command::SUCCESS;
    }
}
