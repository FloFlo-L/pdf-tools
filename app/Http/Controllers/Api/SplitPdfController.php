<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PdfSplitterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SplitPdfController extends Controller
{
    public function __construct(public PdfSplitterService $splitter) {}

    public function split(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'string'],
            'ranges' => ['required', 'array', 'min:1', 'max:10'],
            'ranges.*.from' => ['required', 'integer', 'min:1'],
            'ranges.*.to' => ['required', 'integer', 'min:1'],
            'filename' => ['required', 'string'],
        ]);

        try {
            $result = $this->splitter->split(
                $validated['id'],
                $validated['ranges'],
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

        $path = $this->splitter->getSplitPath($id, $filename);

        if (! $path) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $mimeType = str_ends_with($filename, '.zip') ? 'application/zip' : 'application/pdf';

        return response()->download($path, $filename, [
            'Content-Type' => $mimeType,
        ]);
    }
}
