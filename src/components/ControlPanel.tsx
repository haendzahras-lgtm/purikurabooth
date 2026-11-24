import React, { useState } from 'react';
import {
  ArrowRight,
  BookmarkPlus,
  Copy,
  Download,
  Eraser,
  Frame,
  PenTool,
  RotateCcw,
  Sparkles,
  Sticker,
  Trash2,
  Type,
  Undo2,
} from 'lucide-react';
import {
  CAMERA_FILTERS,
  FRAME_STYLES,
  GEL_PEN_COLORS,
  STICKER_CATALOG,
  STRIP_LAYOUTS,
  svgToDataUrl,
} from '../data/boothPresets';
import {
  CapturedPhoto,
  DecorateTab,
  DoodleStroke,
  FilterId,
  FrameStyleId,
  PlacedSticker,
  StripLayoutId,
  StudioMode,
} from '../types/booth';
import { StripCanvasEditor } from './StripCanvasEditor';

interface ControlPanelProps {
  mode: StudioMode;
  onModeChange: (mode: StudioMode) => void;
  layoutId: StripLayoutId;
  onLayoutChange: (layoutId: StripLayoutId) => void;
  activeFilter: FilterId;
  onFilterChange: (filterId: FilterId) => void;
  frameId: FrameStyleId;
  onFrameChange: (frameId: FrameStyleId) => void;
  decorateTab: DecorateTab;
  onDecorateTabChange: (tab: DecorateTab) => void;
  photos: (CapturedPhoto | null)[];
  stickers: PlacedSticker[];
  doodles: DoodleStroke[];
  selectedStickerId: string | null;
  onAddSticker: (stickerId: string) => void;
  onUpdateSticker: (id: string, patch: Partial<PlacedSticker>) => void;
  onDuplicateSticker: (id: string) => void;
  onDeleteSticker: (id: string) => void;
  onClearStickers: () => void;
  penColor: string;
  onPenColorChange: (color: string) => void;
  penSize: number;
  onPenSizeChange: (size: number) => void;
  onUndoDoodle: () => void;
  onClearDoodles: () => void;
  caption: string;
  onCaptionChange: (val: string) => void;
  showDateStamp: boolean;
  onToggleDateStamp: () => void;
  onClearPhotos: () => void;
  onRetakeSlot: (slotIndex: number) => void;
  onDownloadStrip: () => void;
  onSaveToGallery: () => void;
  isExporting: boolean;
  isShooting: boolean;
}

const CAPTION_PRESETS = [
  'PURIKURA POP',
  'SHIBUYA NIGHTS',
  'BESTIES FOREVER',
  'SWEET MEMORIES',
  'PRINT CLUB 2026',
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  layoutId,
  onLayoutChange,
  activeFilter,
  onFilterChange,
  frameId,
  onFrameChange,
  decorateTab,
  onDecorateTabChange,
  photos,
  stickers,
  doodles,
  selectedStickerId,
  onAddSticker,
  onUpdateSticker,
  onDuplicateSticker,
  onDeleteSticker,
  onClearStickers,
  penColor,
  onPenColorChange,
  penSize,
  onPenSizeChange,
  onUndoDoodle,
  onClearDoodles,
  caption,
  onCaptionChange,
  showDateStamp,
  onToggleDateStamp,
  onClearPhotos,
  onRetakeSlot,
  onDownloadStrip,
  onSaveToGallery,
  isExporting,
  isShooting,
}) => {
  const [stickerFilter, setStickerFilter] = useState<'all' | 'cute' | 'sparkle' | 'words'>('all');

  const capturedCount = photos.filter(Boolean).length;
  const totalShots = STRIP_LAYOUTS[layoutId].shotCount;
  const selectedSticker = stickers.find((s) => s.id === selectedStickerId) || null;

  const filteredStickers =
    stickerFilter === 'all'
      ? STICKER_CATALOG
      : STICKER_CATALOG.filter((s) => s.category === stickerFilter);

  if (mode === 'capture') {
    return (
      <div className="flex flex-col gap-5">
        {/* Layout Selector Card */}
        <section className="rounded-[2rem] bg-[#FFF5EA] p-5 pop-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-[#2B1A2F]">
              1. Strip Layout
            </h2>
            <span className="text-xs font-bold text-[#564147]">
              {totalShots} poses
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(STRIP_LAYOUTS) as StripLayoutId[]).map((id) => {
              const def = STRIP_LAYOUTS[id];
              const active = layoutId === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={isShooting}
                  onClick={() => onLayoutChange(id)}
                  className={`pop-chip flex flex-col items-center gap-2 rounded-2xl p-3 text-center cursor-pointer ${
                    active
                      ? 'pop-chip-active bg-[#FF6EA7] text-[#2B1A2F]'
                      : 'bg-[#FFFDF7] text-[#2B1A2F] hover:bg-[#FFD9E3]/50'
                  }`}
                >
                  {/* Mini graphic representation of the layout */}
                  <div
                    className={`flex h-11 w-9 items-center justify-center rounded-md border-[1.5px] border-[#2B1A2F] p-1 ${
                      active ? 'bg-[#FFFDF7]' : 'bg-[#FFF5EA]'
                    }`}
                  >
                    {id === 'strip-3' && (
                      <div className="flex h-full w-full flex-col gap-0.5">
                        <div className="flex-1 rounded-[2px] bg-[#70D6FF]" />
                        <div className="flex-1 rounded-[2px] bg-[#D8B4F8]" />
                        <div className="flex-1 rounded-[2px] bg-[#FF6EA7]" />
                      </div>
                    )}
                    {id === 'strip-4' && (
                      <div className="flex h-full w-full flex-col gap-[2px]">
                        <div className="flex-1 rounded-[1px] bg-[#FF6EA7]" />
                        <div className="flex-1 rounded-[1px] bg-[#70D6FF]" />
                        <div className="flex-1 rounded-[1px] bg-[#7AE582]" />
                        <div className="flex-1 rounded-[1px] bg-[#D8B4F8]" />
                      </div>
                    )}
                    {id === 'grid-2x2' && (
                      <div className="grid h-full w-full grid-cols-2 gap-0.5">
                        <div className="rounded-[2px] bg-[#FF6EA7]" />
                        <div className="rounded-[2px] bg-[#70D6FF]" />
                        <div className="rounded-[2px] bg-[#D8B4F8]" />
                        <div className="rounded-[2px] bg-[#7AE582]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-extrabold whitespace-nowrap">
                    {def.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Camera Filter Chips */}
        <section className="rounded-[2rem] bg-[#FFF5EA] p-5 pop-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-[#2B1A2F]">
              2. Lens Filter
            </h2>
            <span className="text-xs font-bold text-[#564147]">Live preview</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CAMERA_FILTERS.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onFilterChange(filter.id)}
                  className={`pop-chip inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-extrabold cursor-pointer whitespace-nowrap ${
                    active
                      ? 'pop-chip-active bg-[#70D6FF] text-[#2B1A2F]'
                      : 'bg-[#FFFDF7] text-[#2B1A2F] hover:bg-[#FFF7FB]'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border-[1.5px] border-[#2B1A2F]"
                    style={{ backgroundColor: filter.accentColor }}
                  />
                  {filter.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Strip Preview & Proceed CTA */}
        <section className="rounded-[2rem] bg-[#FFF5EA] p-5 pop-card">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-[#2B1A2F]">
                3. Film Roll
              </h2>
              <p className="text-xs font-medium text-[#564147]">
                {capturedCount} of {totalShots} frames captured
              </p>
            </div>
            {capturedCount > 0 && (
              <button
                type="button"
                disabled={isShooting}
                onClick={onClearPhotos}
                className="inline-flex items-center gap-1 rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7] px-3 py-1 text-[11px] font-extrabold uppercase text-[#2B1A2F] hover:bg-[#FFD9E3] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          <div className="rounded-[1.5rem] border-2 border-dashed border-[#897177]/60 bg-[#FFFDF7] p-4">
            <StripCanvasEditor
              layoutId={layoutId}
              frameId={frameId}
              photos={photos}
              stickers={stickers}
              doodles={doodles}
              caption={caption}
              showDateStamp={showDateStamp}
              interactive={false}
              isDrawingMode={false}
              penColor={penColor}
              penSize={penSize}
              selectedStickerId={null}
              onSelectSticker={() => {}}
              onMoveSticker={() => {}}
              onDeleteSticker={() => {}}
              onAddDoodleStroke={() => {}}
              onRetakeSlot={onRetakeSlot}
              compact
            />
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              disabled={capturedCount === 0 || isShooting}
              onClick={() => onModeChange('decorate')}
              className="pop-btn flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#7AE582] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2B1A2F] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Decorate Strip
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={capturedCount === 0 || isExporting || isShooting}
              onClick={onDownloadStrip}
              className="pop-btn inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6EA7] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2B1A2F] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Save PNG
            </button>
          </div>
        </section>
      </div>
    );
  }

  // DECORATE MODE TOOLBOX
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[2rem] bg-[#FFF5EA] p-5 pop-card">
        {/* 4 Tactile Studio Tabs */}
        <div className="mb-5 grid grid-cols-4 gap-2">
          {(
            [
              { id: 'frames', label: 'Frames', icon: Frame, bg: '#FF6EA7' },
              { id: 'stickers', label: 'Stickers', icon: Sticker, bg: '#70D6FF' },
              { id: 'pen', label: 'Gel Pen', icon: PenTool, bg: '#D8B4F8' },
              { id: 'text', label: 'Caption', icon: Type, bg: '#7AE582' },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = decorateTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onDecorateTabChange(tab.id)}
                className={`pop-chip flex flex-col items-center justify-center gap-1 rounded-2xl py-2.5 px-2 text-xs font-extrabold cursor-pointer ${
                  active ? 'pop-chip-active text-[#2B1A2F]' : 'bg-[#FFFDF7] text-[#564147] hover:text-[#2B1A2F]'
                }`}
                style={active ? { backgroundColor: tab.bg } : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FRAMES */}
        {decorateTab === 'frames' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-extrabold uppercase text-[#2B1A2F]">
                Frame Paper
              </h3>
              <span className="text-xs font-bold text-[#564147]">7 Purikura finishes</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FRAME_STYLES.map((frame) => {
                const active = frameId === frame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => onFrameChange(frame.id)}
                    className={`pop-chip flex flex-col items-center gap-2 rounded-2xl p-2.5 cursor-pointer ${
                      active
                        ? 'pop-chip-active bg-[#FFD9E3]'
                        : 'bg-[#FFFDF7] hover:bg-[#FFF7FB]'
                    }`}
                  >
                    <div
                      className="h-12 w-full rounded-xl border-2 border-[#2B1A2F]"
                      style={{ background: frame.previewCss }}
                    />
                    <span className="text-xs font-extrabold text-[#2B1A2F] whitespace-nowrap">
                      {frame.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Layout switch still accessible if desired */}
            <div className="border-t-2 border-dashed border-[#2B1A2F]/15 pt-4">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[#564147]">
                Switch Strip Format
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STRIP_LAYOUTS) as StripLayoutId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onLayoutChange(id)}
                    className={`pop-chip rounded-full px-3.5 py-1.5 text-xs font-extrabold cursor-pointer ${
                      layoutId === id
                        ? 'pop-chip-active bg-[#70D6FF] text-[#2B1A2F]'
                        : 'bg-[#FFFDF7] text-[#2B1A2F]'
                    }`}
                  >
                    {STRIP_LAYOUTS[id].name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STICKERS */}
        {decorateTab === 'stickers' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {(['all', 'cute', 'sparkle', 'words'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStickerFilter(cat)}
                    className={`rounded-full border-[1.5px] border-[#2B1A2F] px-3 py-1 text-[11px] font-extrabold uppercase cursor-pointer ${
                      stickerFilter === cat
                        ? 'bg-[#FF6EA7] text-[#2B1A2F] shadow-[2px_2px_0_#2B1A2F]'
                        : 'bg-[#FFFDF7] text-[#564147]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {stickers.length > 0 && (
                <button
                  type="button"
                  onClick={onClearStickers}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#AB2B64] hover:underline cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear ({stickers.length})
                </button>
              )}
            </div>

            {/* Peelable Sticker Shelf */}
            <div className="pop-scroll grid max-h-[270px] grid-cols-3 gap-2.5 overflow-y-auto rounded-[1.5rem] border-2 border-[#2B1A2F] bg-[#FFFDF7] p-3 sm:grid-cols-4">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => onAddSticker(sticker.id)}
                  title={`Add ${sticker.name}`}
                  className="group flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-transparent bg-[#FFF5EA] p-2 transition-all hover:border-[#2B1A2F] hover:bg-[#FFD9E3]/50 hover:shadow-[2px_2px_0_#2B1A2F] active:scale-95 cursor-pointer"
                >
                  <img
                    src={svgToDataUrl(sticker.svg)}
                    alt={sticker.name}
                    className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
                    draggable={false}
                  />
                  <span className="max-w-full truncate text-[10px] font-extrabold text-[#564147]">
                    {sticker.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Sticker Inspector */}
            {selectedSticker ? (
              <div className="space-y-3 rounded-2xl border-2 border-[#2B1A2F] bg-[#FFFDF7] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1A2F]">
                    Selected Sticker
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDuplicateSticker(selectedSticker.id)}
                      className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#2B1A2F] bg-[#70D6FF] px-2.5 py-1 text-[11px] font-extrabold text-[#2B1A2F] cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      Clone
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSticker(selectedSticker.id)}
                      className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#2B1A2F] bg-[#FFD9E3] px-2.5 py-1 text-[11px] font-extrabold text-[#71003C] cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-[#564147]">
                    <span>Stamp Scale</span>
                    <span className="font-mono tabular-nums text-[#2B1A2F]">
                      {Math.round(selectedSticker.scale * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={2.1}
                    step={0.05}
                    value={selectedSticker.scale}
                    onChange={(e) =>
                      onUpdateSticker(selectedSticker.id, {
                        scale: parseFloat(e.target.value),
                      })
                    }
                    className="pop-slider w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-bold text-[#564147]">
                    <span>Tilt Angle</span>
                    <span className="font-mono tabular-nums text-[#2B1A2F]">
                      {Math.round(selectedSticker.rotation)}°
                    </span>
                  </label>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={1}
                    value={selectedSticker.rotation}
                    onChange={(e) =>
                      onUpdateSticker(selectedSticker.id, {
                        rotation: parseFloat(e.target.value),
                      })
                    }
                    className="pop-slider w-full"
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-xs font-medium text-[#564147]">
                Tap any sticker above to peel &amp; place it, then drag it anywhere on your strip.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: GEL PEN DOODLE */}
        {decorateTab === 'pen' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-extrabold uppercase text-[#2B1A2F]">
                  Gel Pen Draw
                </h3>
                <p className="text-xs font-medium text-[#564147]">
                  Draw sparkles, hearts, or signatures right on the strip.
                </p>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="flex flex-wrap items-center gap-2.5">
              {GEL_PEN_COLORS.map((c) => {
                const active = penColor === c.value;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    onClick={() => onPenColorChange(c.value)}
                    className={`h-10 w-10 rounded-full border-[2.5px] border-[#2B1A2F] transition-transform cursor-pointer ${
                      active
                        ? 'scale-110 shadow-[3px_3px_0_#2B1A2F] ring-2 ring-[#FF6EA7] ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                );
              })}
            </div>

            {/* Brush Size Candy Slider */}
            <div className="space-y-2 rounded-2xl border-2 border-[#2B1A2F] bg-[#FFFDF7] p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#564147]">
                <span>Brush Tip Size</span>
                <span className="font-mono tabular-nums text-[#2B1A2F]">{penSize}px</span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                step={1}
                value={penSize}
                onChange={(e) => onPenSizeChange(parseInt(e.target.value, 10))}
                className="pop-slider w-full"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={doodles.length === 0}
                onClick={onUndoDoodle}
                className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFFDF7] px-4 py-2.5 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo Stroke
              </button>
              <button
                type="button"
                disabled={doodles.length === 0}
                onClick={onClearDoodles}
                className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFD9E3] px-4 py-2.5 text-xs font-extrabold uppercase text-[#71003C] cursor-pointer"
              >
                <Eraser className="h-3.5 w-3.5" />
                Clear Ink ({doodles.length})
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CAPTION & DATE STAMP */}
        {decorateTab === 'text' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="strip-caption-input"
                className="block font-display text-sm font-extrabold uppercase text-[#2B1A2F]"
              >
                Strip Footer Title
              </label>
              <input
                id="strip-caption-input"
                type="text"
                maxLength={28}
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                placeholder="PURIKURA POP"
                className="w-full rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFFDF7] px-4 py-3 text-sm font-bold text-[#2B1A2F] placeholder:text-[#897177] focus:outline-none focus:ring-4 focus:ring-[#FF6EA7]/40"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CAPTION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onCaptionChange(preset)}
                  className="rounded-full border-[1.5px] border-[#2B1A2F] bg-[#FFFDF7] px-3 py-1 text-[11px] font-extrabold text-[#2B1A2F] hover:bg-[#FFD9E3] cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-2xl border-2 border-[#2B1A2F] bg-[#FFFDF7] px-4 py-3">
              <div>
                <p className="text-xs font-extrabold uppercase text-[#2B1A2F]">
                  Retro Date Stamp
                </p>
                <p className="text-[11px] font-medium text-[#564147]">
                  Print camera date below your title
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showDateStamp}
                onClick={onToggleDateStamp}
                className={`relative h-8 w-14 rounded-full border-2 border-[#2B1A2F] transition-colors cursor-pointer ${
                  showDateStamp ? 'bg-[#7AE582]' : 'bg-[#EDD1EE]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7] transition-transform ${
                    showDateStamp ? 'left-[26px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Download & Save Export Card */}
      <div className="rounded-[2rem] bg-[#FFF5EA] p-5 pop-card">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={capturedCount === 0 || isExporting}
            onClick={onDownloadStrip}
            className="pop-btn w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FF6EA7] px-6 py-4 font-display text-base font-extrabold uppercase tracking-tight text-[#2B1A2F] cursor-pointer"
          >
            <Download className="h-5 w-5" />
            {isExporting ? 'Printing Strip...' : 'Download Photo Strip (PNG)'}
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={capturedCount === 0 || isExporting}
              onClick={onSaveToGallery}
              className="pop-btn inline-flex items-center justify-center gap-1.5 rounded-full bg-[#70D6FF] px-4 py-2.5 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer"
            >
              <BookmarkPlus className="h-4 w-4" />
              Save to Tray
            </button>
            <button
              type="button"
              onClick={() => onModeChange('capture')}
              className="pop-btn inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFFDF7] px-4 py-2.5 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Booth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
