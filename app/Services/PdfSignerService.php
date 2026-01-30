<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class PdfSignerService
{
    private string $tempDisk = 'local';

    private string $signedPath = 'temp/signed';

    public function __construct(public PdfService $pdfService) {}

    /**
     * Sign PDF with provided elements (signatures, text, dates).
     *
     * @param  array<array{signature: array{type: string, data: string, font?: string, color?: string}, position: array{x: float, y: float, width: float, height: float, page: int}}>  $elements
     */
    public function sign(string $id, array $elements): string
    {
        $sourcePath = $this->pdfService->getPath($id);

        if (! $sourcePath) {
            throw new \Exception('PDF not found');
        }

        $pdf = new Fpdi;
        $pageCount = $pdf->setSourceFile($sourcePath);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);

            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            foreach ($elements as $element) {
                if ($pageNo === (int) $element['position']['page']) {
                    $this->addSignature($pdf, $element['signature'], $element['position'], $size);
                }
            }
        }

        $signedFilename = $id.'_signed.pdf';
        $signedPath = Storage::disk($this->tempDisk)->path($this->signedPath.'/'.$signedFilename);

        Storage::disk($this->tempDisk)->makeDirectory($this->signedPath);
        $pdf->Output('F', $signedPath);

        return $signedPath;
    }

    /**
     * Add signature to PDF page.
     *
     * @param  array{type: string, data: string, font?: string, color?: string}  $signature
     * @param  array{x: float, y: float, width: float, height: float, page: int}  $position
     * @param  array{width: float, height: float}  $pageSize
     */
    private function addSignature(Fpdi $pdf, array $signature, array $position, array $pageSize): void
    {
        $x = ($position['x'] / 100) * $pageSize['width'];
        $y = ($position['y'] / 100) * $pageSize['height'];
        $width = ($position['width'] / 100) * $pageSize['width'];
        $height = ($position['height'] / 100) * $pageSize['height'];

        if ($signature['type'] === 'draw') {
            $this->addDrawnSignature($pdf, $signature['data'], $x, $y, $width, $height);
        } elseif ($signature['type'] === 'text' || $signature['type'] === 'date') {
            $this->addTextSignature($pdf, $signature['data'], $x, $y, $width, $height, $signature['font'] ?? null);
        }
    }

    /**
     * Add drawn signature (base64 image) to PDF.
     */
    private function addDrawnSignature(Fpdi $pdf, string $base64Data, float $x, float $y, float $width, float $height): void
    {
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Data));

        $tempFile = tempnam(sys_get_temp_dir(), 'sig_').'.png';
        file_put_contents($tempFile, $imageData);

        $pdf->Image($tempFile, $x, $y, $width, $height);

        unlink($tempFile);
    }

    /**
     * Add text signature to PDF.
     */
    private function addTextSignature(Fpdi $pdf, string $text, float $x, float $y, float $width, float $height, ?string $font = null): void
    {
        // Convert UTF-8 to ISO-8859-1 for FPDF compatibility
        $text = mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');

        // Match frontend calculation: (width / textLength) * factor
        $textLength = max(1, strlen($text));
        $fontSize = ($width / $textLength) * 4;

        // Clamp to reasonable bounds
        $fontSize = max(6, min($fontSize, 72));

        // Map frontend fonts to FPDF fonts
        $pdfFont = $this->mapFontToPdf($font);

        $pdf->SetFont($pdfFont, '', $fontSize);
        $pdf->SetTextColor(0, 0, 0);

        // Use Text() - Y position needs adjustment for baseline
        $pdf->Text($x, $y + ($height * 0.75), $text);
    }

    /**
     * Map frontend font to FPDF compatible font.
     */
    private function mapFontToPdf(?string $font): string
    {
        if (! $font) {
            return 'Helvetica';
        }

        if (str_contains($font, 'Times')) {
            return 'Times';
        }

        if (str_contains($font, 'Courier')) {
            return 'Courier';
        }

        return 'Helvetica';
    }

    /**
     * Get signed PDF path.
     */
    public function getSignedPath(string $id): ?string
    {
        $signedFilename = $id.'_signed.pdf';
        $path = Storage::disk($this->tempDisk)->path($this->signedPath.'/'.$signedFilename);

        return file_exists($path) ? $path : null;
    }

    /**
     * Delete signed PDF files for an ID.
     */
    public function cleanup(string $id): void
    {
        Storage::disk($this->tempDisk)->delete($this->signedPath.'/'.$id.'_signed.pdf');
    }

    /**
     * Cleanup signed files older than given minutes.
     */
    public function cleanupOlderThan(int $minutes = 60): int
    {
        $count = 0;
        $threshold = now()->subMinutes($minutes)->timestamp;

        if (! Storage::disk($this->tempDisk)->exists($this->signedPath)) {
            return $count;
        }

        $files = Storage::disk($this->tempDisk)->files($this->signedPath);

        foreach ($files as $file) {
            if (Storage::disk($this->tempDisk)->lastModified($file) < $threshold) {
                Storage::disk($this->tempDisk)->delete($file);
                $count++;
            }
        }

        return $count;
    }
}
