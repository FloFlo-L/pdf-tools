<?php

namespace App\Console\Commands;

use App\Services\PdfSignerService;
use Illuminate\Console\Command;

class CleanupTempPdfs extends Command
{
    protected $signature = 'pdf:cleanup {--minutes=60 : Max age in minutes}';

    protected $description = 'Cleanup temporary PDF files older than the given duration';

    public function handle(PdfSignerService $pdfSigner): int
    {
        $minutes = (int) $this->option('minutes');
        $count = $pdfSigner->cleanupOlderThan($minutes);

        $this->info("Cleaned up {$count} temporary file(s).");

        return Command::SUCCESS;
    }
}
