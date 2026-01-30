import { LoadingOverlay, Text } from '@mantine/core';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { PageRange } from '@/types/split';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type SplitPreviewProps = {
  file: File;
  pageCount: number;
  ranges: PageRange[];
};

export default function SplitPreview({ file, pageCount, ranges }: SplitPreviewProps) {
  const [pdfLoaded, setPdfLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text fw={500}>Split result</Text>
        <Text size="sm" c="dimmed">
          {pageCount} page{pageCount !== 1 ? 's' : ''} total
        </Text>
      </div>

      <div className="relative min-h-64">
        <LoadingOverlay visible={!pdfLoaded} zIndex={10} overlayProps={{ blur: 2 }} />

        <Document file={file} onLoadSuccess={() => setPdfLoaded(true)} loading={<div className="h-64" />}>
          <div className="flex flex-col gap-4">
            {ranges.map((range, index) => (
              <div key={range.id} className="rounded-md border-2 border-dashed border-neutral-300 p-4 dark:border-neutral-600">
                <Text size="sm" fw={500} mb="sm" ta="center">
                  Range {index + 1}
                </Text>

                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="overflow-hidden border border-neutral-200 p-2 dark:border-neutral-700">
                      <Page pageNumber={range.from} width={100} renderTextLayer={false} renderAnnotationLayer={false} />
                    </div>
                    <Text size="xs" c="dimmed" mt="xs">
                      Page {range.from}
                    </Text>
                  </div>

                  {range.to !== range.from && (
                    <div className="text-center">
                      <div className="overflow-hidden border border-neutral-200 p-2 dark:border-neutral-700">
                        <Page pageNumber={range.to} width={100} renderTextLayer={false} renderAnnotationLayer={false} />
                      </div>
                      <Text size="xs" c="dimmed" mt="xs">
                        Page {range.to}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
