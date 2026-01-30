import { Tabs } from '@mantine/core';
import { PiCalendar, PiPencilSimple, PiTextT } from 'react-icons/pi';
import { useTranslation } from '@/hooks/use-translation';
import type { SignatureColor, SignatureData } from '@/types/sign-pdf';
import SignatureDatePad from './signature-date-pad';
import SignatureDrawPad from './signature-draw-pad';
import SignatureTextPad from './signature-text-pad';

type SignaturePadProps = {
  onSignatureCreate: (data: SignatureData) => void;
};

export default function SignaturePad({ onSignatureCreate }: SignaturePadProps) {
  const { t } = useTranslation();
  const handleDrawSignature = (dataUrl: string, color: SignatureColor) => {
    onSignatureCreate({
      type: 'draw',
      data: dataUrl,
      color,
    });
  };

  const handleTextSignature = (text: string, font: string) => {
    onSignatureCreate({
      type: 'text',
      data: text,
      font,
    });
  };

  const handleDateSignature = (dateText: string, font: string) => {
    onSignatureCreate({
      type: 'date',
      data: dateText,
      font,
    });
  };

  return (
    <Tabs defaultValue="draw">
      <Tabs.List grow>
        <Tabs.Tab value="draw" leftSection={<PiPencilSimple size={16} />}>
          {t('sign_tab_draw')}
        </Tabs.Tab>
        <Tabs.Tab value="text" leftSection={<PiTextT size={16} />}>
          {t('sign_tab_text')}
        </Tabs.Tab>
        <Tabs.Tab value="date" leftSection={<PiCalendar size={16} />}>
          {t('sign_tab_date')}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="draw" pt="md">
        <SignatureDrawPad onSignature={handleDrawSignature} />
      </Tabs.Panel>

      <Tabs.Panel value="text" pt="md">
        <SignatureTextPad onSignature={handleTextSignature} />
      </Tabs.Panel>

      <Tabs.Panel value="date" pt="md">
        <SignatureDatePad onSignature={handleDateSignature} />
      </Tabs.Panel>
    </Tabs>
  );
}
