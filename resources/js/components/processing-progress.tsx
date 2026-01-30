import { Progress, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

const MIN_DISPLAY_TIME = 2000;

type ProcessingProgressProps = {
  onComplete: () => void;
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  isApiComplete?: boolean;
};

export default function ProcessingProgress({ onComplete, title, description, icon: Icon, isApiComplete = false }: ProcessingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);

  // Ensure minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanComplete(true);
    }, MIN_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Only go to 100% if both API is complete AND minimum time has passed
        const canFinish = isApiComplete && canComplete;
        const maxProgress = canFinish ? 100 : 90;

        if (prev >= maxProgress) {
          if (prev >= 100) {
            clearInterval(interval);
          }
          return prev;
        }

        // Slower progress to ensure visibility
        const increment = prev < 50 ? 4 : prev < 70 ? 2 : 1;
        return Math.min(prev + increment, maxProgress);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isApiComplete, canComplete]);

  // Jump to 100% when both conditions are met
  useEffect(() => {
    if (isApiComplete && canComplete && progress >= 90) {
      setProgress(100);
    }
  }, [isApiComplete, canComplete, progress]);

  // Call onComplete when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

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
