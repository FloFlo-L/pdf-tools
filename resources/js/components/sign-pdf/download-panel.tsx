import { Alert, Button, Stack } from '@mantine/core';
import { useState } from 'react';
import { PiArrowCounterClockwise, PiDownloadSimple, PiWarning } from 'react-icons/pi';
import ProcessingSuccess from '@/components/processing-success';

type DownloadPanelProps = {
  pdfId: string;
  originalFilename: string;
  onReset: () => void;
};

export default function DownloadPanel({ pdfId, originalFilename, onReset }: DownloadPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const signedFilename = originalFilename.replace(/\.pdf$/i, '_signed.pdf');

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pdf/${pdfId}/download?filename=${encodeURIComponent(signedFilename)}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = signedFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setHasDownloaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProcessingSuccess title="PDF signed successfully!" description="Your document has been signed and is ready to download.">
      <Stack gap="sm" className="w-full">
        <Button size="md" leftSection={<PiDownloadSimple size={20} />} onClick={handleDownload} loading={isLoading} fullWidth>
          {hasDownloaded ? 'Download Again' : 'Download Signed PDF'}
        </Button>

        {error && (
          <Alert color="red" icon={<PiWarning size={20} />}>
            {error}
          </Alert>
        )}

        <Button size="md" variant="light" leftSection={<PiArrowCounterClockwise size={20} />} onClick={onReset} fullWidth>
          Sign Another PDF
        </Button>
      </Stack>
    </ProcessingSuccess>
  );
}
