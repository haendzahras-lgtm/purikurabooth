import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import {
  getFilterById,
  getFrameById,
  getStickerById,
  STRIP_LAYOUTS,
  svgToDataUrl,
} from '../data/boothPresets';
import {
  CapturedPhoto,
  DoodlePoint,
  DoodleStroke,
  FrameStyleId,
  PlacedSticker,
  StripLayoutId,
} from '../types/booth';
import { formatRetroDate } from '../utils/stripExporter';

interface StripCanvasEditorProps {
  layoutId: StripLayoutId;
  frameId: FrameStyleId;
  photos: (CapturedPhoto | null)[];
  stickers: PlacedSticker[];
  doodles: DoodleStroke[];
  caption: string;
  showDateStamp: boolean;
  interactive: boolean;
  isDrawingMode: boolean;
  penColor: string;
  penSize: number;
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  onMoveSticker: (id: string, x: number, y: number) => void;
  onDeleteSticker: (id: string) => void;
  onAddDoodleStroke: (stroke: DoodleStroke) => void;
  onRetakeSlot?: (slotIndex: number) => void;
  compact?: boolean;
}

export const StripCanvasEditor: React.FC<StripCanvasEditorProps> = ({
  layoutId,
  frameId,
  photos,
  stickers,
  doodles,
  caption,
  showDateStamp,
  interactive,
  isDrawingMode,
  penColor,
  penSize,
  selectedStickerId,
  onSelectSticker,
  onMoveSticker,
  onDeleteSticker,
  onAddDoodleStroke,
  onRetakeSlot,
  compact = false,
}) => {
  const layout = STRIP_LAYOUTS[layoutId];
  const frame = getFrameById(frameId);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const doodleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [draggingSticker, setDraggingSticker] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [activeStroke, setActiveStroke] = useState<DoodlePoint[] | null>(null);

  const stickerDataUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of stickers) {
      if (!map[s.stickerId]) {
        const def = getStickerById(s.stickerId);
        if (def) map[s.stickerId] = svgToDataUrl(def.svg);
      }
    }
    return map;
  }, [stickers]);

  // Draw existing doodles + in-progress stroke on the crisp overlay canvas
  useEffect(() => {
    const canvas = doodleCanvasRef.current;
    if (!canvas) return;
    canvas.width = layout.width;
    canvas.height = layout.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes: DoodleStroke[] = activeStroke
      ? [
          ...doodles,
          {
            id: 'active',
            color: penColor,
            size: penSize,
            points: activeStroke,
          },
        ]
      : doodles;

    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
      const lineWidth = (stroke.size / 600) * layout.width;

      // Halo outline for Purikura gel-pen vibe
      ctx.beginPath();
      ctx.strokeStyle =
        stroke.color === '#2B1A2F'
          ? 'rgba(255,253,247,0.85)'
          : 'rgba(43,26,47,0.75)';
      ctx.lineWidth = lineWidth + 4;
      stroke.points.forEach((pt, idx) => {
        const px = pt.x * layout.width;
        const py = pt.y * layout.height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Main gel color
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = lineWidth;
      stroke.points.forEach((pt, idx) => {
        const px = pt.x * layout.width;
        const py = pt.y * layout.height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }, [activeStroke, doodles, layout.height, layout.width, penColor, penSize]);

  const getNormalizedPoint = (clientX: number, clientY: number): DoodlePoint | null => {
    const el = stageRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  };

  // Dragging stickers smoothly
  useEffect(() => {
    if (!draggingSticker) return;

    const handleMove = (e: PointerEvent) => {
      const pt = getNormalizedPoint(e.clientX, e.clientY);
      if (!pt) return;
      onMoveSticker(
        draggingSticker.id,
        Math.max(0.04, Math.min(0.96, pt.x - draggingSticker.offsetX)),
        Math.max(0.03, Math.min(0.97, pt.y - draggingSticker.offsetY))
      );
    };

    const handleUp = () => {
      setDraggingSticker(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [draggingSticker, onMoveSticker]);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !isDrawingMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getNormalizedPoint(e.clientX, e.clientY);
    if (pt) {
      onSelectSticker(null);
      setActiveStroke([pt]);
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStroke || !isDrawingMode) return;
    const pt = getNormalizedPoint(e.clientX, e.clientY);
    if (pt) {
      setActiveStroke((prev) => (prev ? [...prev, pt] : [pt]));
    }
  };

  const handleCanvasPointerUp = () => {
    if (activeStroke && activeStroke.length >= 2) {
      onAddDoodleStroke({
        id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        color: penColor,
        size: penSize,
        points: activeStroke,
      });
    }
    setActiveStroke(null);
  };

  // Compute CSS background matching the canvas exporter
  const frameBackgroundStyle = useMemo<React.CSSProperties>(() => {
    if (frame.pattern === 'gradient') {
      return {
        backgroundImage: 'linear-gradient(160deg, #FF6EA7 0%, #D8B4F8 52%, #70D6FF 100%)',
      };
    }
    if (frame.pattern === 'checker') {
      return {
        backgroundColor: frame.bgColor,
        backgroundImage: `repeating-conic-gradient(${frame.secondaryColor || '#FFFDF7'} 0% 25%, ${frame.bgColor} 0% 50%)`,
        backgroundSize: '28px 28px',
      };
    }
    if (frame.pattern === 'dots') {
      const dotColor =
        frame.id === 'mint-soda'
          ? 'rgba(255,253,247,0.55)'
          : 'rgba(255,110,167,0.28)';
      return {
        backgroundColor: frame.bgColor,
        backgroundImage: `radial-gradient(${dotColor} 2px, transparent 2px)`,
        backgroundSize: '18px 18px',
      };
    }
    return {
      backgroundColor: frame.bgColor,
    };
  }, [frame]);

  // Sizing container to look sharp for both vertical strips and 2x2 sheets
  const maxWidthClass = compact
    ? layoutId === 'grid-2x2'
      ? 'max-w-[290px]'
      : layoutId === 'strip-4'
        ? 'max-w-[185px]'
        : 'max-w-[215px]'
    : layoutId === 'grid-2x2'
      ? 'max-w-[520px]'
      : layoutId === 'strip-4'
        ? 'max-w-[330px]'
        : 'max-w-[385px]';

  const displayCaption = (caption.trim() || 'PURIKURA POP').toUpperCase();

  return (
    <div className={`relative mx-auto w-full select-none ${maxWidthClass}`}>
      <div
        ref={stageRef}
        onClick={() => interactive && !isDrawingMode && onSelectSticker(null)}
        className="relative w-full overflow-hidden rounded-[0.75rem] shadow-[6px_6px_0_#2B1A2F]"
        style={{
          aspectRatio: `${layout.width} / ${layout.height}`,
          border: `3.5px solid ${frame.borderColor}`,
          ...frameBackgroundStyle,
        }}
      >
        {/* Decorative Glitter Sparkles on glitter frames */}
        {frame.pattern === 'glitter' && (
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            style={{
              color: frame.id === 'plum-night' ? '#FFB0C9' : '#FFFDF7',
            }}
          >
            <span className="absolute left-2 top-3 text-xs">✦</span>
            <span className="absolute right-2.5 top-10 text-sm">✧</span>
            <span className="absolute left-2 top-1/2 text-xs">✧</span>
            <span className="absolute right-2 bottom-24 text-xs">✦</span>
            <span className="absolute left-3 bottom-12 text-sm">✦</span>
          </div>
        )}

        {/* Photo Slots */}
        {layout.slots.map((slot, index) => {
          const photo = photos[index];
          const photoFilter = photo ? getFilterById(photo.filterId) : null;
          const leftPct = (slot.x / layout.width) * 100;
          const topPct = (slot.y / layout.height) * 100;
          const widthPct = (slot.w / layout.width) * 100;
          const heightPct = (slot.h / layout.height) * 100;

          return (
            <div
              key={index}
              className="group absolute overflow-hidden transition-transform"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
                borderRadius: `${(layout.photoRadius / layout.width) * 100}% / ${(layout.photoRadius / layout.height) * 100}%`,
                border: `2.5px solid ${frame.borderColor}`,
                boxShadow: `3px 3px 0 ${frame.id === 'plum-night' ? '#FF6EA7' : '#2B1A2F'}`,
                backgroundColor: '#FFF5EA',
              }}
            >
              {photo?.dataUrl ? (
                <>
                  <img
                    src={photo.dataUrl}
                    alt={`Purikura shot ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    style={{ filter: photoFilter?.cssFilter || 'none' }}
                    draggable={false}
                  />
                  {photoFilter?.tintOverlay && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ backgroundColor: photoFilter.tintOverlay }}
                    />
                  )}
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#897177]">
                  <span className="font-mono text-xs font-bold">0{index + 1}</span>
                  {!compact && (
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Ready
                    </span>
                  )}
                </div>
              )}

              {/* Subtle Film Slot Number */}
              <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#2B1A2F]/70 px-2 py-0.5 font-mono text-[9px] font-bold text-[#FFFDF7]">
                0{index + 1}
              </div>

              {/* Hover Retake Action (when not drawing) */}
              {onRetakeSlot && !isDrawingMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetakeSlot(index);
                  }}
                  title={`Retake shot 0${index + 1}`}
                  className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7]/95 px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#2B1A2F] opacity-0 shadow-[2px_2px_0_#2B1A2F] transition-opacity group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                >
                  <Camera className="h-3 w-3" />
                  {photo ? 'Retake' : 'Snap'}
                </button>
              )}
            </div>
          );
        })}

        {/* Footer Caption & Retro Date Stamp */}
        <div
          className="pointer-events-none absolute inset-x-0 flex flex-col items-center justify-center px-4 text-center"
          style={{
            top: `${(layout.footerY / layout.height) * 100}%`,
            height: `${(layout.footerH / layout.height) * 100}%`,
          }}
        >
          <div
            className={
              frame.pattern === 'checker'
                ? 'rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7] px-4 py-1.5 shadow-[2px_2px_0_#2B1A2F]'
                : ''
            }
          >
            <p
              className={`font-display font-extrabold leading-tight tracking-tight ${
                compact ? 'text-[11px]' : 'text-base sm:text-lg'
              }`}
              style={{
                color: frame.pattern === 'checker' ? '#2B1A2F' : frame.textColor,
              }}
            >
              {displayCaption}
            </p>
            {showDateStamp && (
              <p
                className={`mt-0.5 font-mono font-bold tracking-wider ${
                  compact ? 'text-[8px]' : 'text-[10px] sm:text-xs'
                }`}
                style={{
                  color: frame.pattern === 'checker' ? '#005C75' : frame.subtextColor,
                }}
              >
                ✧ {formatRetroDate()} · PRINT CLUB ✧
              </p>
            )}
          </div>
        </div>

        {/* Gel-Pen Freehand Drawing Layer */}
        <canvas
          ref={doodleCanvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          className={`absolute inset-0 z-20 h-full w-full touch-none ${
            interactive && isDrawingMode ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
          }`}
        />

        {/* Interactive Draggable Sticker Layer */}
        <div className="pointer-events-none absolute inset-0 z-30">
          {stickers.map((placed) => {
            const def = getStickerById(placed.stickerId);
            if (!def) return null;
            const isSelected = interactive && selectedStickerId === placed.id;
            const widthPct = 22 * placed.scale;

            return (
              <div
                key={placed.id}
                onPointerDown={(e) => {
                  if (!interactive || isDrawingMode) return;
                  e.stopPropagation();
                  onSelectSticker(placed.id);
                  const pt = getNormalizedPoint(e.clientX, e.clientY);
                  if (pt) {
                    setDraggingSticker({
                      id: placed.id,
                      offsetX: pt.x - placed.x,
                      offsetY: pt.y - placed.y,
                    });
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className={`absolute touch-none ${
                  interactive && !isDrawingMode
                    ? 'pointer-events-auto cursor-grab active:cursor-grabbing'
                    : 'pointer-events-none'
                }`}
                style={{
                  left: `${placed.x * 100}%`,
                  top: `${placed.y * 100}%`,
                  width: `${widthPct}%`,
                  transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                }}
              >
                <div
                  className={`relative rounded-xl transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-dashed ring-[#2B1A2F] bg-[#FFFDF7]/25 p-0.5'
                      : ''
                  }`}
                >
                  <img
                    src={stickerDataUrls[placed.stickerId]}
                    alt={def.name}
                    draggable={false}
                    className="h-auto w-full drop-shadow-[2px_2px_0_rgba(43,26,47,0.22)]"
                  />
                  {isSelected && (
                    <button
                      type="button"
                      aria-label={`Remove ${def.name} sticker`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSticker(placed.id);
                      }}
                      className="absolute -right-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#2B1A2F] bg-[#FF6EA7] text-[#FFFDF7] shadow-[2px_2px_0_#2B1A2F] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
