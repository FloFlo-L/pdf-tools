import { ActionIcon } from '@mantine/core';
import { PiX } from 'react-icons/pi';
import { Rnd } from 'react-rnd';
import type { SignatureData, SignaturePosition } from '@/types/sign-pdf';

type SignatureOverlayProps = {
  signatureData: SignatureData;
  position: SignaturePosition;
  onPositionChange: (position: SignaturePosition) => void;
  onDelete: () => void;
  containerWidth: number;
  containerHeight: number;
};

export default function SignatureOverlay({
  signatureData,
  position,
  onPositionChange,
  onDelete,
  containerWidth,
  containerHeight,
}: SignatureOverlayProps) {
  // Convert percentage to pixels
  const pixelX = (position.x / 100) * containerWidth;
  const pixelY = (position.y / 100) * containerHeight;
  const pixelWidth = (position.width / 100) * containerWidth;
  const pixelHeight = (position.height / 100) * containerHeight;

  const handleDragStop = (_e: unknown, d: { x: number; y: number }) => {
    onPositionChange({
      ...position,
      x: (d.x / containerWidth) * 100,
      y: (d.y / containerHeight) * 100,
    });
  };

  const handleResizeStop = (_e: unknown, _direction: unknown, ref: HTMLElement, _delta: unknown, pos: { x: number; y: number }) => {
    onPositionChange({
      ...position,
      x: (pos.x / containerWidth) * 100,
      y: (pos.y / containerHeight) * 100,
      width: (ref.offsetWidth / containerWidth) * 100,
      height: (ref.offsetHeight / containerHeight) * 100,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Rnd
      position={{ x: pixelX, y: pixelY }}
      size={{ width: pixelWidth, height: pixelHeight }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      minWidth={50}
      minHeight={30}
      lockAspectRatio
      className="border border-dashed border-primary-300 bg-primary-100/50"
    >
      {/* Delete button */}
      <div className="absolute -top-8 -right-1">
        <ActionIcon size="xs" color="red" radius="xl" onClick={handleDelete} title="Delete signature">
          <PiX size={10} />
        </ActionIcon>
      </div>

      {/* Signature content */}
      <div className="flex h-full w-full cursor-move items-center justify-center overflow-hidden px-1">
        {signatureData.type === 'draw' && (
          <img src={signatureData.data} alt="Signature" className="pointer-events-none h-full w-full object-contain" draggable={false} />
        )}
        {signatureData.type === 'text' && (
          <span
            className="pointer-events-none whitespace-nowrap text-gray-800 select-none"
            style={{
              fontFamily: signatureData.font || "'Georgia', 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: `${(pixelWidth / signatureData.data.length) * 1.5}px`,
            }}
          >
            {signatureData.data}
          </span>
        )}
        {signatureData.type === 'date' && (
          <span
            className="pointer-events-none whitespace-nowrap text-gray-800 select-none"
            style={{
              fontFamily: signatureData.font || "'Times New Roman', serif",
              fontSize: `${(pixelWidth / signatureData.data.length) * 1.5}px`,
            }}
          >
            {signatureData.data}
          </span>
        )}
      </div>
    </Rnd>
  );
}
