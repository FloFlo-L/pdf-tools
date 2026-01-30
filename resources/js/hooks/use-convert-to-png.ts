import { useCallback, useEffect, useState } from 'react';
import type { ConvertedFile, ConvertStep } from '@/types/convert';
import type { PdfInfo } from '@/types/pdf';

export function useConvertToPng() {
  const [step, setStep] = useState<ConvertStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionComplete, setConversionComplete] = useState(false);
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
    if (conversionComplete && animationComplete && step === 'converting') {
      setStep('download');
    }
  }, [conversionComplete, animationComplete, step]);

  const handleFileDrop = useCallback(async (files: File[]) => {
    const droppedFile = files[0];
    if (!droppedFile) return;

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', droppedFile);

      const response = await fetch('/api/pdf/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }

      const data: PdfInfo = await response.json();
      setFile(droppedFile);
      setPdfInfo(data);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConvert = useCallback(
    async (selectedPages: number[]) => {
      if (!pdfInfo || !file || selectedPages.length === 0) return;

      setError(null);
      setIsLoading(true);
      setConversionComplete(false);
      setAnimationComplete(false);
      setStep('converting');

      try {
        const response = await fetch('/api/pdf/convert-to-png', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id: pdfInfo.id,
            pages: selectedPages,
            filename: file.name,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Conversion failed');
        }

        const data: ConvertedFile = await response.json();
        setConvertedFile(data);
        setConversionComplete(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setStep('preview');
      } finally {
        setIsLoading(false);
      }
    },
    [pdfInfo, file],
  );

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!convertedFile) return;

    try {
      const response = await fetch(`/api/pdf/${convertedFile.id}/convert-download?filename=${encodeURIComponent(convertedFile.filename)}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = convertedFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  }, [convertedFile]);

  const handleReset = useCallback(async () => {
    if (pdfInfo) {
      await fetch(`/api/pdf/${pdfInfo.id}`, { method: 'DELETE' }).catch(() => {});
    }

    setStep('upload');
    setFile(null);
    setPdfInfo(null);
    setConvertedFile(null);
    setError(null);
    setConversionComplete(false);
    setAnimationComplete(false);
  }, [pdfInfo]);

  return {
    step,
    file,
    pdfInfo,
    convertedFile,
    isLoading,
    error,
    conversionComplete,
    handleFileDrop,
    handleConvert,
    handleAnimationComplete,
    handleDownload,
    handleReset,
  };
}
