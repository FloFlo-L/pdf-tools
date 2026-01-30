import { Text, Title } from '@mantine/core';
import type { ComponentType } from 'react';
import { PiCheck } from 'react-icons/pi';
import { useTranslation } from '@/hooks/use-translation';
import type { Translations } from '@/types';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

const featureKeys: (keyof Translations)[] = ['feature_free', 'feature_online', 'feature_no_limits', 'feature_secure'];

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-center">
      <Title order={2} mb="sm">
        {Icon && <Icon className="mr-2 inline" />}
        {title}
      </Title>
      {description && <Text c="dimmed">{description}</Text>}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {featureKeys.map((key) => (
          <Text size="md" fw={500} key={key}>
            <PiCheck className="mr-1 inline text-green-500" />
            {t(key)}
          </Text>
        ))}
      </div>
    </div>
  );
}
