import { useCallback, useEffect, useState } from 'react';
import type { PdfInfo, SignatureData, SignatureElement, SignaturePosition, SignStep } from '@/types/sign-pdf';

const getDefaultPosition = (type: SignatureData['type']): SignaturePosition => {
  const basePosition = { page: 1 };
  switch (type) {
    case 'draw':
      return { ...basePosition, x: 10, y: 70, width: 25, height: 10 };
    case 'text':
      return { ...basePosition, x: 10, y: 82, width: 20, height: 5 };
    case 'date':
      return { ...basePosition, x: 10, y: 88, width: 15, height: 4 };
  }
};

export function useSignPdf() {
  const [step, setStep] = useState<SignStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [elements, setElements] = useState<SignatureElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingComplete, setSigningComplete] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Cleanup on unmount or when navigating away
  useEffect(() => {
    const cleanup = () => {
      if (pdfInfo) {
        fetch(`/api/pdf/${pdfInfo.id}`, { method: 'DELETE' }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [pdfInfo]);

  // Move to download when both API and animation are complete
  useEffect(() => {
    if (signingComplete && animationComplete && step === 'signing') {
      setStep('download');
    }
  }, [signingComplete, animationComplete, step]);

  const handleFileDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }

      const data: PdfInfo = await response.json();
      setUploadedFile(file);
      setPdfInfo(data);
      setStep('sign');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleElementCreate = useCallback((data: SignatureData) => {
    setElements((prev) => {
      const existingIndex = prev.findIndex((el) => el.data.type === data.type);

      if (existingIndex !== -1) {
        return prev.map((el, index) => (index === existingIndex ? { ...el, data } : el));
      }

      const newElement: SignatureElement = {
        id: crypto.randomUUID(),
        data,
        position: getDefaultPosition(data.type),
      };
      return [...prev, newElement];
    });
  }, []);

  const handleElementUpdate = useCallback((id: string, position: SignaturePosition) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, position } : el)));
  }, []);

  const handleElementDelete = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  const handleConfirmSign = useCallback(async () => {
    if (!pdfInfo || elements.length === 0) return;

    setError(null);
    setIsLoading(true);
    setSigningComplete(false);
    setAnimationComplete(false);
    setStep('signing');

    try {
      const response = await fetch('/api/pdf/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pdfInfo.id,
          elements: elements.map((el) => ({
            signature: el.data,
            position: el.position,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signing failed');
      }

      setSigningComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
      setStep('sign');
    } finally {
      setIsLoading(false);
    }
  }, [pdfInfo, elements]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleReset = useCallback(async () => {
    if (pdfInfo) {
      await fetch(`/api/pdf/${pdfInfo.id}`, { method: 'DELETE' }).catch(() => {});
    }

    setStep('upload');
    setUploadedFile(null);
    setPdfInfo(null);
    setElements([]);
    setError(null);
  }, [pdfInfo]);

  return {
    // State
    step,
    uploadedFile,
    pdfInfo,
    elements,
    isLoading,
    error,

    // Handlers
    handleFileDrop,
    handleElementCreate,
    handleElementUpdate,
    handleElementDelete,
    handleConfirmSign,
    handleAnimationComplete,
    handleReset,
  };
}
