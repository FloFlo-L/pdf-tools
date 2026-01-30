<?php

namespace App\Console\Commands;

use App\Services\PdfConverterService;
use App\Services\PdfService;
use App\Services\PdfSignerService;
use Illuminate\Console\Command;

class CleanupTempPdfs extends Command
{
    protected $signature = 'pdf:cleanup {--minutes=60 : Max age in minutes}';

    protected $description = 'Cleanup temporary PDF files older than the given duration';

    public function handle(PdfService $pdfService, PdfSignerService $pdfSigner, PdfConverterService $pdfConverter): int
    {
        $minutes = (int) $this->option('minutes');

        $uploadCount = $pdfService->cleanupOlderThan($minutes);
        $signedCount = $pdfSigner->cleanupOlderThan($minutes);
        $convertedCount = $pdfConverter->cleanupOlderThan($minutes);

        $total = $uploadCount + $signedCount + $convertedCount;
        $this->info("Cleaned up {$total} temporary file(s).");

        return Command::SUCCESS;
    }
}
