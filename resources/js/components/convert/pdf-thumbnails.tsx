import { Card, Checkbox, LoadingOverlay, SimpleGrid, Text, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type PdfThumbnailsProps = {
  file: File;
  numPages: number;
  selectedPages: number[];
  onSelectionChange: (pages: number[]) => void;
};

export default function PdfThumbnails({ file, numPages, selectedPages, onSelectionChange }: PdfThumbnailsProps) {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const stripeColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  // Select all pages by default when component mounts
  useEffect(() => {
    onSelectionChange(Array.from({ length: numPages }, (_, i) => i + 1));
  }, [numPages, onSelectionChange]);

  const togglePage = (pageNumber: number) => {
    if (selectedPages.includes(pageNumber)) {
      onSelectionChange(selectedPages.filter((p) => p !== pageNumber));
    } else {
      onSelectionChange([...selectedPages, pageNumber].sort((a, b) => a - b));
    }
  };

  const toggleAll = () => {
    if (selectedPages.length === numPages) {
      onSelectionChange([]);
    } else {
      onSelectionChange(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text size="sm" c="dimmed">
          {numPages} page{numPages > 1 ? 's' : ''} found
        </Text>
        {numPages > 1 && (
          <Checkbox
            label="Select all"
            checked={selectedPages.length === numPages}
            indeterminate={selectedPages.length > 0 && selectedPages.length < numPages}
            onChange={toggleAll}
          />
        )}
      </div>

      <div className="relative min-h-48">
        <LoadingOverlay visible={!pdfLoaded} zIndex={10} overlayProps={{ blur: 2 }} />

        <Document file={file} onLoadSuccess={() => setPdfLoaded(true)} loading={<div className="h-48" />}>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              const isSelected = selectedPages.includes(pageNumber);

              const diagonalStyle = !isSelected
                ? {
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${stripeColor} 4px, ${stripeColor} 5px)`,
                  }
                : {};

              return (
                <Card
                  key={pageNumber}
                  shadow="sm"
                  padding="xs"
                  withBorder
                  className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => togglePage(pageNumber)}
                  style={diagonalStyle}
                >
                  <div className="relative flex justify-center">
                    <Checkbox checked={isSelected} onChange={() => togglePage(pageNumber)} className="absolute top-1 left-1 z-10" />
                    <Page pageNumber={pageNumber} width={150} renderTextLayer={false} renderAnnotationLayer={false} />
                  </div>
                  <Text size="xs" ta="center" c="dimmed">
                    Page {pageNumber}
                  </Text>
                </Card>
              );
            })}
          </SimpleGrid>
        </Document>
      </div>
    </div>
  );
}
