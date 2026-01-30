import { Button, Group, Radio, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

const FONTS = [
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: "'Arial', sans-serif", label: 'Arial' },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'DD MMMM YYYY', label: 'DD Month YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'MMMM DD, YYYY', label: 'Month DD, YYYY' },
];

type SignatureDatePadProps = {
  onSignature: (dateText: string, font: string) => void;
};

export default function SignatureDatePad({ onSignature }: SignatureDatePadProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedFormat, setSelectedFormat] = useState(DATE_FORMATS[0].value);

  const handleApply = () => {
    if (date) {
      onSignature(dayjs(date).format(selectedFormat), selectedFont);
    }
  };

  return (
    <div className="space-y-3">
      <DatePickerInput value={date} onChange={setDate} placeholder={t('sign_pick_date')} valueFormat="DD/MM/YYYY" size="md" />

      <SimpleGrid cols={2} spacing="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('sign_format')}
          </Text>
          <Radio.Group value={selectedFormat} onChange={(value) => setSelectedFormat(value)}>
            <Stack gap="xs">
              {DATE_FORMATS.map((format) => (
                <Radio key={format.value} value={format.value} label={format.label} />
              ))}
            </Stack>
          </Radio.Group>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('sign_font')}
          </Text>
          <Radio.Group value={selectedFont} onChange={(value) => setSelectedFont(value)}>
            <Stack gap="xs">
              {FONTS.map((font) => (
                <Radio key={font.value} value={font.value} label={<span>{font.label}</span>} />
              ))}
            </Stack>
          </Radio.Group>
        </div>
      </SimpleGrid>

      <div className="flex min-h-16 items-center justify-center rounded-md border border-gray-300 bg-white p-4">
        <span className="text-xl text-gray-800" style={{ fontFamily: selectedFont }}>
          {date ? dayjs(date).format(selectedFormat) : t('sign_select_date')}
        </span>
      </div>

      <Group justify="flex-end">
        <Button size="sm" onClick={handleApply} disabled={!date}>
          {t('sign_apply')}
        </Button>
      </Group>
    </div>
  );
}
