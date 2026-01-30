import { Button, Group, Radio, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

const FONTS = [
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: "'Arial', sans-serif", label: 'Arial' },
];

type SignatureTextPadProps = {
  onSignature: (text: string, font: string) => void;
};

export default function SignatureTextPad({ onSignature }: SignatureTextPadProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);

  const handleApply = () => {
    if (text.trim()) {
      onSignature(text.trim(), selectedFont);
    }
  };

  return (
    <div className="space-y-3">
      <TextInput
        placeholder={t('sign_type_text')}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        size="md"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleApply();
          }
        }}
      />

      <Radio.Group value={selectedFont} onChange={(value) => setSelectedFont(value)}>
        <Stack gap="xs">
          {FONTS.map((font) => (
            <Radio key={font.value} value={font.value} label={<span>{font.label}</span>} />
          ))}
        </Stack>
      </Radio.Group>

      <div
        className="flex min-h-24 items-center justify-center rounded-md border border-gray-300 bg-white p-4"
        style={{ fontFamily: selectedFont, fontStyle: 'italic' }}
      >
        <span className="text-2xl text-gray-800">{text || t('sign_text_preview')}</span>
      </div>

      <Group justify="flex-end">
        <Button size="sm" onClick={handleApply} disabled={!text.trim()}>
          {t('sign_apply')}
        </Button>
      </Group>
    </div>
  );
}
