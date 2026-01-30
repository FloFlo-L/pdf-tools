import { ActionIcon, Button, NumberInput, Text } from '@mantine/core';
import { PiPlus, PiTrash } from 'react-icons/pi';
import type { PageRange } from '@/types/split';

type RangeListProps = {
  ranges: PageRange[];
  maxPage: number;
  canAddRange: boolean;
  canRemoveRange: boolean;
  onAddRange: () => void;
  onRemoveRange: (id: string) => void;
  onUpdateRange: (id: string, field: 'from' | 'to', value: number) => void;
};

export default function RangeList({ ranges, maxPage, canAddRange, canRemoveRange, onAddRange, onRemoveRange, onUpdateRange }: RangeListProps) {
  return (
    <div className="space-y-4">
      <div className="hidden items-center justify-between md:flex">
        <Text fw={500}>Page Ranges</Text>
        <Text size="sm" c="dimmed">
          {ranges.length} range{ranges.length !== 1 ? 's' : ''}
        </Text>
      </div>

      <div className="space-y-3">
        {ranges.map((range, index) => (
          <div key={index} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
            <div className="flex flex-1 items-center gap-2">
              <NumberInput
                value={range.from}
                onChange={(value) => onUpdateRange(range.id, 'from', Number(value) || 1)}
                min={1}
                max={maxPage}
                size="sm"
                className="w-20"
                aria-label="From page"
              />
              <Text size="sm" c="dimmed">
                to
              </Text>
              <NumberInput
                value={range.to}
                onChange={(value) => onUpdateRange(range.id, 'to', Number(value) || 1)}
                min={1}
                max={maxPage}
                size="sm"
                className="w-20"
                aria-label="To page"
              />
              <Text size="xs" c="dimmed">
                ({range.to - range.from + 1} page{range.to - range.from + 1 !== 1 ? 's' : ''})
              </Text>
            </div>

            {canRemoveRange && (
              <ActionIcon variant="subtle" color="red" onClick={() => onRemoveRange(range.id)} aria-label="Remove range">
                <PiTrash size={16} />
              </ActionIcon>
            )}
          </div>
        ))}
      </div>

      {canAddRange && (
        <Button variant="light" leftSection={<PiPlus size={16} />} onClick={onAddRange} fullWidth>
          Add Range
        </Button>
      )}
    </div>
  );
}
