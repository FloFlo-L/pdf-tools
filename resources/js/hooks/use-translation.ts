import { usePage } from '@inertiajs/react';
import type { Locale, SharedData, Translations } from '@/types';

export function useTranslation() {
  const { translations, locale } = usePage<SharedData>().props;

  const t = (key: keyof Translations): string => {
    return translations[key] ?? key;
  };

  return { t, locale };
}

export function useLocale(): Locale {
  return usePage<SharedData>().props.locale;
}
