<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPdfRequest;
use App\Services\PdfConverterService;
use App\Services\PdfService;
use App\Services\PdfSignerService;
use App\Services\PdfSplitterService;
use Illuminate\Http\JsonResponse;

class PdfController extends Controller
{
    public function __construct(
        public PdfService $pdfService,
        public PdfSignerService $pdfSigner,
        public PdfConverterService $pdfConverter,
        public PdfSplitterService $pdfSplitter,
    ) {}

    public function upload(UploadPdfRequest $request): JsonResponse
    {
        $result = $this->pdfService->upload($request->file('file'));

        return response()->json($result);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->pdfService->delete($id);
        $this->pdfSigner->cleanup($id);
        $this->pdfConverter->cleanup($id);
        $this->pdfSplitter->cleanup($id);

        return response()->json(['deleted' => true]);
    }
}
