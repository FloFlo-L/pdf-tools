<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use setasign\Fpdi\Fpdi;

class PdfService
{
    private string $tempDisk = 'local';

    private string $uploadPath = 'temp/uploads';

    /**
     * Store uploaded PDF and return metadata.
     *
     * @return array{id: string, pageCount: int, width: float, height: float}
     */
    public function upload(UploadedFile $file): array
    {
        $id = Str::uuid()->toString();
        $filename = $id.'.pdf';

        Storage::disk($this->tempDisk)->putFileAs($this->uploadPath, $file, $filename);

        $pdf = new Fpdi;
        $path = $this->getPath($id);
        $pageCount = $pdf->setSourceFile($path);

        $templateId = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($templateId);

        return [
            'id' => $id,
            'pageCount' => $pageCount,
            'width' => $size['width'],
            'height' => $size['height'],
        ];
    }

    /**
     * Check if PDF exists.
     */
    public function exists(string $id): bool
    {
        return Storage::disk($this->tempDisk)->exists($this->uploadPath.'/'.$id.'.pdf');
    }

    /**
     * Get the full path to the PDF file.
     */
    public function getPath(string $id): ?string
    {
        if (! $this->exists($id)) {
            return null;
        }

        return Storage::disk($this->tempDisk)->path($this->uploadPath.'/'.$id.'.pdf');
    }

    /**
     * Delete uploaded PDF.
     */
    public function delete(string $id): void
    {
        Storage::disk($this->tempDisk)->delete($this->uploadPath.'/'.$id.'.pdf');
    }

    /**
     * Cleanup files older than given minutes.
     */
    public function cleanupOlderThan(int $minutes = 60): int
    {
        $count = 0;
        $threshold = now()->subMinutes($minutes)->timestamp;

        $files = Storage::disk($this->tempDisk)->files($this->uploadPath);

        foreach ($files as $file) {
            if (Storage::disk($this->tempDisk)->lastModified($file) < $threshold) {
                Storage::disk($this->tempDisk)->delete($file);
                $count++;
            }
        }

        return $count;
    }
}
