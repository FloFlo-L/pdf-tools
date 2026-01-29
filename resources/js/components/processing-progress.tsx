import { Progress, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

type ProcessingProgressProps = {
  onComplete: () => void;
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

export default function ProcessingProgress({ onComplete, title, description, icon: Icon }: ProcessingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        // Accelerate progress as it goes
        const increment = prev < 70 ? 8 : prev < 90 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <Stack align="center" gap="lg">
        {Icon && (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <Icon className="h-10 w-10 text-primary-600" />
          </div>
        )}

        <div className="space-y-2">
          <Title order={3}>{title}</Title>
          {description && <Text c="dimmed">{description}</Text>}
        </div>

        <div className="w-full">
          <Progress value={progress} size="lg" radius="xl" animated />
          <Text size="sm" c="dimmed" mt="xs">
            {progress}%
          </Text>
        </div>
      </Stack>
    </div>
  );
}
