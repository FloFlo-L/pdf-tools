<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PdfConverterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ConvertPdfController extends Controller
{
    public function __construct(public PdfConverterService $converter) {}

    public function convert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'string'],
            'pages' => ['required', 'array', 'min:1'],
            'pages.*' => ['integer', 'min:1'],
            'filename' => ['required', 'string'],
        ]);

        try {
            $result = $this->converter->convertToPng(
                $validated['id'],
                $validated['pages'],
                $validated['filename']
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function download(Request $request, string $id): BinaryFileResponse|JsonResponse
    {
        $filename = $request->query('filename');

        if (! $filename) {
            return response()->json(['error' => 'Filename is required'], 400);
        }

        $path = $this->converter->getConvertedPath($id, $filename);

        if (! $path) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $mimeType = str_ends_with($filename, '.zip') ? 'application/zip' : 'image/png';

        return response()->download($path, $filename, [
            'Content-Type' => $mimeType,
        ]);
    }
}
