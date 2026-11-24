export type StripLayoutId = 'strip-3' | 'strip-4' | 'grid-2x2';

export type FilterId =
  | 'original'
  | 'y2k-gloss'
  | 'peach-milk'
  | 'cyber-mint'
  | 'retro-2001'
  | 'dreamy-soft'
  | 'mono-pop';

export type FrameStyleId =
  | 'glitter-pink'
  | 'warm-cream'
  | 'sky-checker'
  | 'pastel-lavender'
  | 'mint-soda'
  | 'candy-gradient'
  | 'plum-night';

export type StudioMode = 'capture' | 'decorate';
export type DecorateTab = 'frames' | 'stickers' | 'pen' | 'text';
export type CountdownOption = 0 | 3 | 5;

export interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StripLayoutDef {
  id: StripLayoutId;
  name: string;
  shortLabel: string;
  shotCount: number;
  width: number;
  height: number;
  slots: SlotRect[];
  footerY: number;
  footerH: number;
  photoRadius: number;
}

export interface FilterDef {
  id: FilterId;
  name: string;
  cssFilter: string;
  tintOverlay?: string;
  accentColor: string;
}

export interface FrameStyleDef {
  id: FrameStyleId;
  name: string;
  bgColor: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  pattern: 'solid' | 'glitter' | 'checker' | 'gradient' | 'dots';
  secondaryColor?: string;
  previewCss: string;
}

export interface StickerDef {
  id: string;
  name: string;
  category: 'cute' | 'sparkle' | 'words';
  width: number;
  height: number;
  svg: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  /** Normalized 0..1 across strip width */
  x: number;
  /** Normalized 0..1 across strip height */
  y: number;
  /** Scale multiplier (default 1) */
  scale: number;
  /** Degrees -180..180 */
  rotation: number;
}

export interface DoodlePoint {
  x: number;
  y: number;
}

export interface DoodleStroke {
  id: string;
  color: string;
  /** Width relative to 600px reference strip width */
  size: number;
  points: DoodlePoint[];
}

export interface CapturedPhoto {
  dataUrl: string;
  filterId: FilterId;
  capturedAt: string;
}

export interface SavedStrip {
  id: string;
  dataUrl: string;
  createdAt: string;
  layoutId: StripLayoutId;
  frameId: FrameStyleId;
  caption: string;
}
