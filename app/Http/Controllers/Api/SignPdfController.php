<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignPdfRequest;
use App\Http\Requests\UploadPdfRequest;
use App\Services\PdfSignerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SignPdfController extends Controller
{
    public function __construct(public PdfSignerService $pdfSigner) {}

    public function upload(UploadPdfRequest $request): JsonResponse
    {
        $result = $this->pdfSigner->upload($request->file('file'));

        return response()->json($result);
    }

    public function sign(SignPdfRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (! $this->pdfSigner->exists($validated['id'])) {
            return response()->json(['error' => 'PDF not found'], 404);
        }

        $this->pdfSigner->sign($validated['id'], $validated['elements']);

        return response()->json(['id' => $validated['id'], 'signed' => true]);
    }

    public function download(Request $request, string $id): BinaryFileResponse|JsonResponse
    {
        $path = $this->pdfSigner->getSignedPath($id);

        if (! $path) {
            return response()->json(['error' => 'Signed PDF not found'], 404);
        }

        $filename = $request->query('filename', 'signed_document.pdf');

        return response()->download($path, $filename);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->pdfSigner->delete($id);

        return response()->json(['deleted' => true]);
    }
}
