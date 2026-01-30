<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;
use ZipArchive;

class PdfSplitterService
{
    private string $tempDisk = 'local';

    private string $splitPath = 'temp/split';

    public function __construct(public PdfService $pdfService) {}

    /**
     * Split PDF into multiple files based on ranges.
     *
     * @param  array<array{from: int, to: int}>  $ranges
     * @return array{id: string, type: 'pdf'|'zip', filename: string, files: array<string>}
     */
    public function split(string $id, array $ranges, string $originalFilename): array
    {
        $sourcePath = $this->pdfService->getPath($id);

        if (! $sourcePath) {
            throw new \Exception('PDF not found');
        }

        Storage::disk($this->tempDisk)->makeDirectory($this->splitPath);

        $baseName = pathinfo($originalFilename, PATHINFO_FILENAME);
        $splitFiles = [];

        foreach ($ranges as $range) {
            $from = $range['from'];
            $to = $range['to'];

            $pdf = new Fpdi;
            $pageCount = $pdf->setSourceFile($sourcePath);

            // Validate range
            $from = max(1, min($from, $pageCount));
            $to = max($from, min($to, $pageCount));

            for ($pageNo = $from; $pageNo <= $to; $pageNo++) {
                $templateId = $pdf->importPage($pageNo);
                $size = $pdf->getTemplateSize($templateId);

                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);
            }

            $rangeLabel = $from === $to ? "page{$from}" : "pages{$from}-{$to}";
            $splitFilename = $baseName.'_'.$rangeLabel.'.pdf';
            $splitFullPath = Storage::disk($this->tempDisk)->path($this->splitPath.'/'.$id.'_'.$splitFilename);

            $pdf->Output('F', $splitFullPath);

            $splitFiles[] = [
                'path' => $splitFullPath,
                'filename' => $splitFilename,
            ];
        }

        // Single range: return PDF directly
        if (count($splitFiles) === 1) {
            return [
                'id' => $id,
                'type' => 'pdf',
                'filename' => $splitFiles[0]['filename'],
                'files' => [$splitFiles[0]['filename']],
            ];
        }

        // Multiple ranges: create ZIP
        $zipFilename = $baseName.'_split.zip';
        $zipPath = Storage::disk($this->tempDisk)->path($this->splitPath.'/'.$id.'_'.$zipFilename);

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Could not create ZIP file');
        }

        foreach ($splitFiles as $file) {
            $zip->addFile($file['path'], $file['filename']);
        }

        $zip->close();

        // Clean up individual PDF files after zipping
        foreach ($splitFiles as $file) {
            @unlink($file['path']);
        }

        return [
            'id' => $id,
            'type' => 'zip',
            'filename' => $zipFilename,
            'files' => array_map(fn ($f) => $f['filename'], $splitFiles),
        ];
    }

    /**
     * Get split file path.
     */
    public function getSplitPath(string $id, string $filename): ?string
    {
        $path = Storage::disk($this->tempDisk)->path($this->splitPath.'/'.$id.'_'.$filename);

        return file_exists($path) ? $path : null;
    }

    /**
     * Delete split files for an ID.
     */
    public function cleanup(string $id): void
    {
        if (! Storage::disk($this->tempDisk)->exists($this->splitPath)) {
            return;
        }

        $files = Storage::disk($this->tempDisk)->files($this->splitPath);

        foreach ($files as $file) {
            if (str_starts_with(basename($file), $id.'_')) {
                Storage::disk($this->tempDisk)->delete($file);
            }
        }
    }

    /**
     * Cleanup split files older than given minutes.
     */
    public function cleanupOlderThan(int $minutes = 60): int
    {
        $count = 0;
        $threshold = now()->subMinutes($minutes)->timestamp;

        if (! Storage::disk($this->tempDisk)->exists($this->splitPath)) {
            return $count;
        }

        $files = Storage::disk($this->tempDisk)->files($this->splitPath);

        foreach ($files as $file) {
            if (Storage::disk($this->tempDisk)->lastModified($file) < $threshold) {
                Storage::disk($this->tempDisk)->delete($file);
                $count++;
            }
        }

        return $count;
    }
}
