<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignPdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<string>>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'uuid'],
            'elements' => ['required', 'array', 'min:1'],
            'elements.*.signature.type' => ['required', 'string', 'in:draw,text,date'],
            'elements.*.signature.data' => ['required', 'string'],
            'elements.*.signature.font' => ['nullable', 'string'],
            'elements.*.signature.color' => ['nullable', 'string'],
            'elements.*.position.x' => ['required', 'numeric', 'min:0', 'max:100'],
            'elements.*.position.y' => ['required', 'numeric', 'min:0', 'max:100'],
            'elements.*.position.width' => ['required', 'numeric', 'min:1', 'max:100'],
            'elements.*.position.height' => ['required', 'numeric', 'min:1', 'max:100'],
            'elements.*.position.page' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id.required' => 'The PDF identifier is required.',
            'id.uuid' => 'Invalid PDF identifier.',
            'elements.required' => 'At least one element is required.',
            'elements.*.signature.type.in' => 'Signature type must be draw, text, or date.',
            'elements.*.signature.data.required' => 'Signature data is required.',
            'elements.*.position.page.min' => 'Page number must be at least 1.',
        ];
    }
}
