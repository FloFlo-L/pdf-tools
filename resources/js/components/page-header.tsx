import { Text, Title } from '@mantine/core';
import type { ComponentType } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <Title order={2}>
        {Icon && <Icon className="mr-2 inline" />}
        {title}
      </Title>
      {description && <Text c="dimmed">{description}</Text>}
    </div>
  );
}
