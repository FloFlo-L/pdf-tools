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
        return $this->convert($id, $pages, $originalFilename, 'png');
    }

    /**
     * Convert PDF pages to JPG.
     *
     * @param  array<int>  $pages
     * @return array{id: string, type: 'jpg'|'zip', filename: string}
     */
    public function convertToJpg(string $id, array $pages, string $originalFilename, int $quality = 85): array
    {
        return $this->convert($id, $pages, $originalFilename, 'jpg', $quality);
    }

    /**
     * Convert PDF pages to specified format.
     *
     * @param  array<int>  $pages
     * @return array{id: string, type: string, filename: string}
     */
    private function convert(string $id, array $pages, string $originalFilename, string $format, int $quality = 90): array
    {
        $pdfPath = Storage::disk($this->tempDisk)->path($this->uploadPath.'/'.$id.'.pdf');

        if (! file_exists($pdfPath)) {
            throw new \Exception('PDF not found');
        }

        Storage::disk($this->tempDisk)->makeDirectory($this->convertedPath);

        $baseName = pathinfo($originalFilename, PATHINFO_FILENAME);
        $convertedFiles = [];

        foreach ($pages as $pageNumber) {
            $imagick = new Imagick;
            $imagick->setResolution(200, 200);
            $imagick->readImage($pdfPath.'['.($pageNumber - 1).']');

            if ($format === 'jpg') {
                $imagick->setImageFormat('jpeg');
                $imagick->setImageBackgroundColor('white');
                $imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_REMOVE);
                $imagick = $imagick->mergeImageLayers(Imagick::LAYERMETHOD_FLATTEN);
            } else {
                $imagick->setImageFormat($format);
            }

            $imagick->setImageCompressionQuality($quality);

            $outputFilename = $baseName.'_page'.$pageNumber.'.'.$format;
            $outputPath = Storage::disk($this->tempDisk)->path($this->convertedPath.'/'.$id.'_'.$outputFilename);

            $imagick->writeImage($outputPath);
            $imagick->clear();
            $imagick->destroy();

            $convertedFiles[] = [
                'path' => $outputPath,
                'filename' => $outputFilename,
            ];
        }

        if (count($convertedFiles) === 1) {
            return [
                'id' => $id,
                'type' => $format,
                'filename' => $convertedFiles[0]['filename'],
            ];
        }

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
