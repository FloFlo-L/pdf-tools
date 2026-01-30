import { Title } from '@mantine/core';
import { PiGithubLogo } from 'react-icons/pi';
import { useTranslation } from '@/hooks/use-translation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="space-y-4 bg-primary px-4 py-4 text-center text-sm text-white">
      <Title order={4} className="text-primary-contrast" size="h4">
        PDF Tools
      </Title>
      <p>© {new Date().getFullYear()} PDF Tools. {t('all_rights_reserved')}</p>
      <p className="flex items-center justify-center gap-2">
        <PiGithubLogo className="text-xl" />
        {t('made_by')}{' '}
        <a href="https://github.com/FloFlo-L/pdf-tools" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-200">
          Florian Lescribaa
        </a>
      </p>
    </footer>
  );
}
