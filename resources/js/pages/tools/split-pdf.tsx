import { ActionIcon, Button, Card, Drawer, ScrollArea, Stack } from '@mantine/core';
import { useDisclosure, useIntersection, useMediaQuery } from '@mantine/hooks';
import { PiArrowCounterClockwise, PiDownloadSimple, PiScissors } from 'react-icons/pi';
import BackToTools from '@/components/back-to-tools';
import DropZone from '@/components/drop-zone';
import PageHeader from '@/components/page-header';
import ProcessingProgress from '@/components/processing-progress';
import ProcessingSuccess from '@/components/processing-success';
import RangeList from '@/components/split/range-list';
import SplitPreview from '@/components/split/split-preview';
import StickyBottomButton from '@/components/sticky-bottom-button';
import { useSplitPdf } from '@/hooks/use-split-pdf';

export default function SplitPdf() {
  const {
    step,
    file,
    pdfInfo,
    ranges,
    splitResult,
    isLoading,
    error,
    splitComplete,
    canAddRange,
    canRemoveRange,
    handleFileDrop,
    handleAddRange,
    handleRemoveRange,
    handleUpdateRange,
    handleSplit,
    handleAnimationComplete,
    handleDownload,
    handleReset,
  } = useSplitPdf();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { ref: splitButtonRef, entry } = useIntersection({ threshold: 0.5 });
  const isSplitButtonVisible = entry?.isIntersecting ?? true;

  const totalPages = ranges.reduce((sum, r) => sum + (r.to - r.from + 1), 0);
  const buttonText = `Split into ${ranges.length} file${ranges.length !== 1 ? 's' : ''} (${totalPages} pages)`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <PageHeader icon={PiScissors} title="Split PDF" description="Extract pages or split your PDF into multiple files" />

      {error && <div className="rounded-md bg-red-50 p-4 text-center text-red-600">{error}</div>}

      {step === 'upload' && (
        <>
          <DropZone onDrop={handleFileDrop} loading={isLoading} />
          <BackToTools />
        </>
      )}

      {step === 'configure' && file && pdfInfo && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card shadow="sm" padding="md" withBorder>
              <SplitPreview file={file} pageCount={pdfInfo.pageCount} ranges={ranges} />
            </Card>

            {!isMobile && (
              <Card shadow="sm" padding="md" withBorder>
                <RangeList
                  ranges={ranges}
                  maxPage={pdfInfo.pageCount}
                  canAddRange={canAddRange}
                  canRemoveRange={canRemoveRange}
                  onAddRange={handleAddRange}
                  onRemoveRange={handleRemoveRange}
                  onUpdateRange={handleUpdateRange}
                />
              </Card>
            )}
          </div>

          <div ref={splitButtonRef} className="text-center">
            <Button onClick={handleSplit} loading={isLoading} disabled={ranges.length === 0} leftSection={<PiScissors size={18} />}>
              {buttonText}
            </Button>
          </div>

          {isMobile && (
            <>
              <ActionIcon
                size="38"
                radius="xl"
                variant="filled"
                onClick={openDrawer}
                aria-label="Open range panel"
                style={{
                  position: 'fixed',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <PiScissors size={16} />
              </ActionIcon>

              <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                title="Page Ranges"
                position="right"
                size="100%"
                styles={{
                  body: {
                    height: 'calc(100dvh - 60px)',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                <ScrollArea style={{ flex: 1 }} p="md">
                  <RangeList
                    ranges={ranges}
                    maxPage={pdfInfo.pageCount}
                    canAddRange={canAddRange}
                    canRemoveRange={canRemoveRange}
                    onAddRange={handleAddRange}
                    onRemoveRange={handleRemoveRange}
                    onUpdateRange={handleUpdateRange}
                  />
                </ScrollArea>
                <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
                  <Button onClick={closeDrawer} fullWidth>
                    Apply
                  </Button>
                </div>
              </Drawer>
            </>
          )}
        </div>
      )}

      {step === 'splitting' && (
        <ProcessingProgress
          onComplete={handleAnimationComplete}
          title="Splitting your PDF..."
          description="Please wait while we extract your pages"
          icon={PiScissors}
          isApiComplete={splitComplete}
        />
      )}

      {step === 'download' && splitResult && (
        <ProcessingSuccess
          title="Split complete!"
          description={
            splitResult.type === 'zip'
              ? `Your ${splitResult.files.length} PDF files are ready to download as a ZIP.`
              : 'Your PDF file is ready to download.'
          }
        >
          <Stack gap="sm" className="w-full">
            <Button size="md" leftSection={<PiDownloadSimple size={20} />} onClick={handleDownload} fullWidth>
              Download {splitResult.type === 'zip' ? 'ZIP' : 'PDF'}
            </Button>
            <Button size="md" variant="light" leftSection={<PiArrowCounterClockwise size={20} />} onClick={handleReset} fullWidth>
              Split another PDF
            </Button>
          </Stack>
        </ProcessingSuccess>
      )}

      {step === 'configure' && (
        <StickyBottomButton visible={!isSplitButtonVisible} onClick={handleSplit} loading={isLoading} disabled={ranges.length === 0}>
          <PiScissors size={18} className="mr-2 inline" />
          {buttonText}
        </StickyBottomButton>
      )}
    </div>
  );
}
