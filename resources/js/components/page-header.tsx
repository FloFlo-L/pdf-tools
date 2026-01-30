import { Text, Title } from '@mantine/core';
import type { ComponentType } from 'react';
import { PiCheck } from 'react-icons/pi';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

const features = ['Free', 'Online', 'No limits', 'Secure'];

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <Title order={2} mb="sm">
        {Icon && <Icon className="mr-2 inline" />}
        {title}
      </Title>
      {description && <Text c="dimmed">{description}</Text>}
      <div className="mt-4 flex justify-center gap-4">
        {features.map((feature, index) => (
          <Text size="md" fw={500} key={`feature-${index}`}>
            <PiCheck className="mr-1 inline text-green-500" />
            {feature}
          </Text>
        ))}
      </div>
    </div>
  );
}
