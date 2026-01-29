import { useResizeObserver } from '@mantine/hooks';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { PdfInfo, SignatureElement, SignaturePosition } from '@/types/sign-pdf';
import SignatureOverlay from './signature-overlay';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type PdfPreviewProps = {
  file: File;
  pdfInfo: PdfInfo;
  elements: SignatureElement[];
  onElementUpdate: (id: string, position: SignaturePosition) => void;
  onElementDelete: (id: string) => void;
};

export default function PdfPreview({ file, pdfInfo, elements, onElementUpdate, onElementDelete }: PdfPreviewProps) {
  const [containerRef, containerRect] = useResizeObserver();
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Calculate width to fit container while maintaining aspect ratio
  const aspectRatio = pdfInfo.width / pdfInfo.height;
  const containerWidth = containerRect.width || 600;

  return (
    <div ref={containerRef} className="relative w-full">
      <Document
        file={file}
        onLoadSuccess={() => setPdfLoaded(true)}
        loading={
          <div className="flex h-96 items-center justify-center">
            <div className="text-gray-500">Loading PDF...</div>
          </div>
        }
        error={
          <div className="flex h-96 items-center justify-center">
            <div className="text-red-500">Failed to load PDF</div>
          </div>
        }
      >
        <div className="relative inline-block">
          <Page pageNumber={1} width={containerWidth} renderTextLayer={false} renderAnnotationLayer={false} />

          {pdfLoaded && elements.length > 0 && (
            <div className="absolute inset-0" style={{ width: containerWidth, height: containerWidth / aspectRatio }}>
              {elements.map((element) => (
                <SignatureOverlay
                  key={element.id}
                  signatureData={element.data}
                  position={element.position}
                  onPositionChange={(position) => onElementUpdate(element.id, position)}
                  onDelete={() => onElementDelete(element.id)}
                  containerWidth={containerWidth}
                  containerHeight={containerWidth / aspectRatio}
                />
              ))}
            </div>
          )}
        </div>
      </Document>
    </div>
  );
}
