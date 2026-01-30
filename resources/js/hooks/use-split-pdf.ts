import { useCallback, useEffect, useState } from 'react';
import type { PdfInfo } from '@/types/pdf';
import type { PageRange, SplitResult, SplitStep } from '@/types/split';

const MAX_RANGES = 10;

export function useSplitPdf() {
  const [step, setStep] = useState<SplitStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [ranges, setRanges] = useState<PageRange[]>([]);
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [splitComplete, setSplitComplete] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Initialize default range when pdfInfo changes
  useEffect(() => {
    if (pdfInfo) {
      setRanges([
        {
          id: crypto.randomUUID(),
          from: 1,
          to: pdfInfo.pageCount,
        },
      ]);
    }
  }, [pdfInfo]);

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
    if (splitComplete && animationComplete && step === 'splitting') {
      setStep('download');
    }
  }, [splitComplete, animationComplete, step]);

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
      setStep('configure');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddRange = useCallback(() => {
    if (!pdfInfo || ranges.length >= MAX_RANGES) return;

    setRanges((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        from: 1,
        to: pdfInfo.pageCount,
      },
    ]);
  }, [pdfInfo, ranges.length]);

  const handleRemoveRange = useCallback((id: string) => {
    setRanges((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleUpdateRange = useCallback(
    (id: string, field: 'from' | 'to', value: number) => {
      if (!pdfInfo) return;

      setRanges((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;

          const clampedValue = Math.max(1, Math.min(value, pdfInfo.pageCount));

          if (field === 'from') {
            return { ...r, from: clampedValue, to: Math.max(clampedValue, r.to) };
          } else {
            return { ...r, to: clampedValue, from: Math.min(clampedValue, r.from) };
          }
        }),
      );
    },
    [pdfInfo],
  );

  const handleSplit = useCallback(async () => {
    if (!pdfInfo || !file || ranges.length === 0) return;

    setError(null);
    setIsLoading(true);
    setSplitComplete(false);
    setAnimationComplete(false);
    setStep('splitting');

    try {
      const response = await fetch('/api/pdf/split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          id: pdfInfo.id,
          ranges: ranges.map((r) => ({ from: r.from, to: r.to })),
          filename: file.name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Split failed');
      }

      const data: SplitResult = await response.json();
      setSplitResult(data);
      setSplitComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed');
      setStep('configure');
    } finally {
      setIsLoading(false);
    }
  }, [pdfInfo, file, ranges]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!splitResult) return;

    try {
      const response = await fetch(`/api/pdf/${splitResult.id}/split-download?filename=${encodeURIComponent(splitResult.filename)}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = splitResult.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  }, [splitResult]);

  const handleReset = useCallback(async () => {
    if (pdfInfo) {
      await fetch(`/api/pdf/${pdfInfo.id}`, { method: 'DELETE' }).catch(() => {});
    }

    setStep('upload');
    setFile(null);
    setPdfInfo(null);
    setRanges([]);
    setSplitResult(null);
    setError(null);
    setSplitComplete(false);
    setAnimationComplete(false);
  }, [pdfInfo]);

  return {
    step,
    file,
    pdfInfo,
    ranges,
    splitResult,
    isLoading,
    error,
    splitComplete,
    canAddRange: ranges.length < MAX_RANGES,
    canRemoveRange: ranges.length > 1,
    handleFileDrop,
    handleAddRange,
    handleRemoveRange,
    handleUpdateRange,
    handleSplit,
    handleAnimationComplete,
    handleDownload,
    handleReset,
  };
}
