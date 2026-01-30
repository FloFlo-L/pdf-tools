import ListTools from '@/components/list-tools';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <div className="space-y-2 px-4 text-center">
        <h3 className="text-2xl font-semibold md:text-3xl">
          {t('welcome_on')} <span className="text-primary">PDF Tools</span>
        </h3>
        <p className="text-lg font-bold">{t('home_description')}</p>
      </div>
      <div className="text-center">
        <p className="text-xl underline">{t('choose_tool')}</p>
        {/* List tools */}
        <ListTools />
      </div>
    </div>
  );
}
