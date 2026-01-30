import { router } from '@inertiajs/react';
import { ActionIcon } from '@mantine/core';
import { useLocale } from '@/hooks/use-translation';

export default function ToggleLanguage() {
  const locale = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en';
    router.post('/locale', { locale: newLocale }, { preserveScroll: true });
  };

  return (
    <ActionIcon variant="subtle" color="white" onClick={toggleLocale} aria-label="Toggle language" size="lg">
      <span className="text-sm font-semibold uppercase">{locale === 'en' ? 'FR' : 'EN'}</span>
    </ActionIcon>
  );
}
