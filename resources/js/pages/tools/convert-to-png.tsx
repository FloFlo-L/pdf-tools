import { Button, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useState } from 'react';
import { PiArrowCounterClockwise, PiDownloadSimple, PiImage } from 'react-icons/pi';
import PdfThumbnails from '@/components/convert-to-png/pdf-thumbnails';
import DropZone from '@/components/drop-zone';
import PageHeader from '@/components/page-header';
import ProcessingProgress from '@/components/processing-progress';
import ProcessingSuccess from '@/components/processing-success';
import StickyBottomButton from '@/components/sticky-bottom-button';
import { useConvertToPng } from '@/hooks/use-convert-to-png';

export default function ConvertPng() {
  const {
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
  } = useConvertToPng();

  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const { ref: convertButtonRef, entry } = useIntersection({ threshold: 0.5 });
  const isConvertButtonVisible = entry?.isIntersecting ?? true;

  const onConvert = () => {
    handleConvert(selectedPages);
  };

  const buttonText = `Convert ${selectedPages.length} page${selectedPages.length !== 1 ? 's' : ''} to PNG`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <PageHeader icon={PiImage} title="Convert to PNG" description="Convert your PDF documents to high-quality PNG images" />

      {error && <div className="rounded-md bg-red-50 p-4 text-center text-red-600">{error}</div>}

      {step === 'upload' && <DropZone onDrop={handleFileDrop} loading={isLoading} />}

      {step === 'preview' && file && pdfInfo && (
        <div className="space-y-8">
          <PdfThumbnails file={file} numPages={pdfInfo.pageCount} selectedPages={selectedPages} onSelectionChange={setSelectedPages} />

          <div ref={convertButtonRef} className="text-center">
            <Button onClick={onConvert} loading={isLoading} disabled={selectedPages.length === 0} leftSection={<PiDownloadSimple size={18} />}>
              {buttonText}
            </Button>
          </div>
        </div>
      )}

      {step === 'converting' && (
        <ProcessingProgress
          onComplete={handleAnimationComplete}
          title="Converting your PDF..."
          description="Please wait while we convert your pages to PNG"
          icon={PiImage}
          isApiComplete={conversionComplete}
        />
      )}

      {step === 'download' && convertedFile && (
        <ProcessingSuccess
          title="Conversion complete!"
          description={convertedFile.type === 'zip' ? 'Your PNG images are ready to download as a ZIP file.' : 'Your PNG image is ready to download.'}
        >
          <Stack gap="sm" className="w-full">
            <Button size="md" leftSection={<PiDownloadSimple size={20} />} onClick={handleDownload} fullWidth>
              Download {convertedFile.type === 'zip' ? 'ZIP' : 'PNG'}
            </Button>
            <Button size="md" variant="light" leftSection={<PiArrowCounterClockwise size={20} />} onClick={handleReset} fullWidth>
              Convert another PDF
            </Button>
          </Stack>
        </ProcessingSuccess>
      )}

      {step === 'preview' && (
        <StickyBottomButton visible={!isConvertButtonVisible} onClick={onConvert} loading={isLoading} disabled={selectedPages.length === 0}>
          <PiDownloadSimple size={18} className="mr-2 inline" />
          {buttonText}
        </StickyBottomButton>
      )}
    </div>
  );
}
