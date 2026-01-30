<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Imagick;
use ZipArchive;

class PdfConverterService
{
    private string $tempDisk = 'local';

    private string $uploadPath = 'temp/uploads';

    private string $convertedPath = 'temp/converted';

    /**
     * Convert PDF pages to PNG.
     *
     * @param  array<int>  $pages
     * @return array{id: string, type: 'png'|'zip', filename: string}
     */
    public function convertToPng(string $id, array $pages, string $originalFilename): array
    {
        $pdfPath = Storage::disk($this->tempDisk)->path($this->uploadPath.'/'.$id.'.pdf');

        if (! file_exists($pdfPath)) {
            throw new \Exception('PDF not found');
        }

        Storage::disk($this->tempDisk)->makeDirectory($this->convertedPath);

        $baseName = pathinfo($originalFilename, PATHINFO_FILENAME);
        $convertedFiles = [];

        // Convert each selected page
        foreach ($pages as $pageNumber) {
            $imagick = new Imagick;
            $imagick->setResolution(200, 200);
            $imagick->readImage($pdfPath.'['.($pageNumber - 1).']');
            $imagick->setImageFormat('png');
            $imagick->setImageCompressionQuality(90);

            $pngFilename = $baseName.'_page'.$pageNumber.'.png';
            $pngPath = Storage::disk($this->tempDisk)->path($this->convertedPath.'/'.$id.'_'.$pngFilename);

            $imagick->writeImage($pngPath);
            $imagick->clear();
            $imagick->destroy();

            $convertedFiles[] = [
                'path' => $pngPath,
                'filename' => $pngFilename,
            ];
        }

        // Single page: return PNG info
        if (count($convertedFiles) === 1) {
            return [
                'id' => $id,
                'type' => 'png',
                'filename' => $convertedFiles[0]['filename'],
            ];
        }

        // Multiple pages: create ZIP
        $zipFilename = $baseName.'.zip';
        $zipPath = Storage::disk($this->tempDisk)->path($this->convertedPath.'/'.$id.'_'.$zipFilename);

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Could not create ZIP file');
        }

        foreach ($convertedFiles as $file) {
            $zip->addFile($file['path'], $file['filename']);
        }

        $zip->close();

        // Clean up individual PNG files after zipping
        foreach ($convertedFiles as $file) {
            @unlink($file['path']);
        }

        return [
            'id' => $id,
            'type' => 'zip',
            'filename' => $zipFilename,
        ];
    }

    /**
     * Get converted file path.
     */
    public function getConvertedPath(string $id, string $filename): ?string
    {
        $path = Storage::disk($this->tempDisk)->path($this->convertedPath.'/'.$id.'_'.$filename);

        return file_exists($path) ? $path : null;
    }

    /**
     * Delete converted files for an ID.
     */
    public function cleanup(string $id): void
    {
        $files = Storage::disk($this->tempDisk)->files($this->convertedPath);

        foreach ($files as $file) {
            if (str_starts_with(basename($file), $id.'_')) {
                Storage::disk($this->tempDisk)->delete($file);
            }
        }
    }

    /**
     * Cleanup converted files older than given minutes.
     */
    public function cleanupOlderThan(int $minutes = 60): int
    {
        $count = 0;
        $threshold = now()->subMinutes($minutes)->timestamp;

        if (! Storage::disk($this->tempDisk)->exists($this->convertedPath)) {
            return $count;
        }

        $files = Storage::disk($this->tempDisk)->files($this->convertedPath);

        foreach ($files as $file) {
            if (Storage::disk($this->tempDisk)->lastModified($file) < $threshold) {
                Storage::disk($this->tempDisk)->delete($file);
                $count++;
            }
        }

        return $count;
    }
}
