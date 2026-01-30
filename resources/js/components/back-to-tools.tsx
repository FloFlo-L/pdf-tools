import { PiArrowLeft } from 'react-icons/pi';
import { useTranslation } from '@/hooks/use-translation';

export default function BackToTools() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <a href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary hover:underline">
        <PiArrowLeft size={16} />
        {t('use_another_tool')}
      </a>
    </div>
  );
}
