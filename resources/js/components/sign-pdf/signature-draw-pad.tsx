import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PiEraser } from 'react-icons/pi';
import { useTranslation } from '@/hooks/use-translation';
import type { Translations } from '@/types';
import type { SignatureColor } from '@/types/sign-pdf';

const SIGNATURE_COLORS: { value: SignatureColor; labelKey: keyof Translations }[] = [
  { value: '#000000', labelKey: 'sign_color_black' },
  { value: '#4a4a4a', labelKey: 'sign_color_dark_gray' },
  { value: '#1971c2', labelKey: 'sign_color_blue' },
  { value: '#c92a2a', labelKey: 'sign_color_red' },
  { value: '#2f9e44', labelKey: 'sign_color_green' },
];

type SignatureDrawPadProps = {
  onSignature: (dataUrl: string, color: SignatureColor) => void;
};

export default function SignatureDrawPad({ onSignature }: SignatureDrawPadProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [color, setColor] = useState<SignatureColor>('#000000');
  const pathsRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const currentPathRef = useRef<Array<{ x: number; y: number }>>([]);

  const getCanvasPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const path of pathsRef.current) {
      if (path.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    }
  }, [color]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(e.pointerId);
      setIsDrawing(true);
      const point = getCanvasPoint(e);
      currentPathRef.current = [point];
    },
    [getCanvasPoint],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const point = getCanvasPoint(e);
      currentPathRef.current.push(point);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const path = currentPathRef.current;
      if (path.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[path.length - 2].x, path[path.length - 2].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [isDrawing, getCanvasPoint, color],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPathRef.current.length > 1) {
      pathsRef.current.push([...currentPathRef.current]);
      setHasDrawn(true);
    }
    currentPathRef.current = [];
  }, [isDrawing]);

  const handleClear = useCallback(() => {
    pathsRef.current = [];
    currentPathRef.current = [];
    setHasDrawn(false);
    redraw();
  }, [redraw]);

  const handleApply = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSignature(canvas.toDataURL('image/png'), color);
  }, [onSignature, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 200;
  }, []);

  useEffect(() => {
    redraw();
  }, [color, redraw]);

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-gray-300 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ aspectRatio: '2 / 1' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      <Group justify="space-between">
        <ActionIcon variant="subtle" color="gray" onClick={handleClear} disabled={!hasDrawn}>
          <PiEraser size={18} />
        </ActionIcon>

        <Group gap="xs">
          {SIGNATURE_COLORS.map((c) => (
            <Tooltip key={c.value} label={t(c.labelKey)} withArrow>
              <ActionIcon
                variant={color === c.value ? 'filled' : 'outline'}
                size="sm"
                radius="xl"
                onClick={() => setColor(c.value)}
                style={{
                  backgroundColor: color === c.value ? c.value : 'transparent',
                  borderColor: c.value,
                  borderWidth: 2,
                }}
              >
                <span />
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      </Group>

      <Button size="sm" onClick={handleApply} disabled={!hasDrawn} fullWidth>
        {t('sign_apply_signature')}
      </Button>
    </div>
  );
}
