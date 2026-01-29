import { Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { PiCheckCircle } from 'react-icons/pi';

type ProcessingSuccessProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function ProcessingSuccess({ title, description, children }: ProcessingSuccessProps) {
  return (
    <div className="mx-auto max-w-md py-6 text-center">
      <Stack align="center" gap="lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <PiCheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <div className="space-y-2">
          <Title order={3}>{title}</Title>
          {description && <Text c="dimmed">{description}</Text>}
        </div>

        {children}
      </Stack>
    </div>
  );
}
