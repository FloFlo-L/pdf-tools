import { ActionIcon, Button, Card, Drawer } from '@mantine/core';
import { useDisclosure, useIntersection, useMediaQuery } from '@mantine/hooks';
import { FaPencilAlt } from 'react-icons/fa';
import { PiPencilLine, PiSignature } from 'react-icons/pi';
import BackToTools from '@/components/back-to-tools';
import DropZone from '@/components/drop-zone';
import PageHeader from '@/components/page-header';
import ProcessingProgress from '@/components/processing-progress';
import DownloadPanel from '@/components/sign-pdf/download-panel';
import PdfPreview from '@/components/sign-pdf/pdf-preview';
import SignaturePad from '@/components/sign-pdf/signature-pad';
import StickyBottomButton from '@/components/sticky-bottom-button';
import { useSignPdf } from '@/hooks/use-sign-pdf';

export default function SignPdf() {
  const {
    step,
    uploadedFile,
    pdfInfo,
    elements,
    isLoading,
    error,
    signingComplete,
    handleFileDrop,
    handleElementCreate,
    handleElementUpdate,
    handleElementDelete,
    handleConfirmSign,
    handleAnimationComplete,
    handleReset,
  } = useSignPdf();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { ref: signButtonRef, entry } = useIntersection({ threshold: 0.5 });
  const isSignButtonVisible = entry?.isIntersecting ?? true;

  const onElementCreate = (data: Parameters<typeof handleElementCreate>[0]) => {
    handleElementCreate(data);
    closeDrawer();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <PageHeader icon={PiSignature} title="Sign PDF" description="Add your signature to any PDF document" />

      {error && <div className="rounded-md bg-red-50 p-4 text-center text-red-600">{error}</div>}

      {step === 'upload' && (
        <>
          <DropZone onDrop={handleFileDrop} loading={isLoading} />
          <BackToTools />
        </>
      )}

      {step === 'sign' && uploadedFile && pdfInfo && (
        <div className="relative space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card shadow="sm" padding="xs" withBorder>
              <PdfPreview
                file={uploadedFile}
                pdfInfo={pdfInfo}
                elements={elements}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
              />
            </Card>

            {!isMobile && (
              <Card shadow="sm" padding="md" withBorder>
                <SignaturePad onSignatureCreate={onElementCreate} />
              </Card>
            )}
          </div>

          <div ref={signButtonRef} className="text-center">
            <Button onClick={handleConfirmSign} loading={isLoading} disabled={elements.length === 0}>
              Sign
            </Button>
          </div>

          {isMobile && (
            <>
              <ActionIcon
                size="38"
                radius="xl"
                variant="filled"
                onClick={openDrawer}
                aria-label="Open signature panel"
                style={{
                  position: 'fixed',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <FaPencilAlt size={16} />
              </ActionIcon>

              <Drawer opened={drawerOpened} onClose={closeDrawer} title="Add elements" position="right" size="100%" padding="md">
                <SignaturePad onSignatureCreate={onElementCreate} />
              </Drawer>
            </>
          )}
        </div>
      )}

      {step === 'signing' && (
        <ProcessingProgress
          onComplete={handleAnimationComplete}
          title="Signing your document..."
          description="Please wait while we apply your signature"
          icon={PiPencilLine}
          isApiComplete={signingComplete}
        />
      )}

      {step === 'download' && pdfInfo && uploadedFile && (
        <DownloadPanel pdfId={pdfInfo.id} originalFilename={uploadedFile.name} onReset={handleReset} />
      )}

      {step === 'sign' && (
        <StickyBottomButton visible={!isSignButtonVisible} onClick={handleConfirmSign} loading={isLoading} disabled={elements.length === 0}>
          Sign
        </StickyBottomButton>
      )}
    </div>
  );
}
