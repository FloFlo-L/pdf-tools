import { Button } from '@mantine/core';
import type { ReactNode } from 'react';

type StickyBottomButtonProps = {
  visible: boolean;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export default function StickyBottomButton({ visible, onClick, loading, disabled, children }: StickyBottomButtonProps) {
  if (!visible) return null;

  return (
    <div className="md:mx-auto md:max-w-6xl md:px-4" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      <div className="border-t border-gray-200 bg-white px-4 pt-2 pb-4 md:border-r md:border-l">
        <Button onClick={onClick} loading={loading} disabled={disabled} fullWidth>
          {children}
        </Button>
      </div>
    </div>
  );
}
