import {
  FilterDef,
  FrameStyleDef,
  StickerDef,
  StripLayoutDef,
  StripLayoutId,
} from '../types/booth';

export const STRIP_LAYOUTS: Record<StripLayoutId, StripLayoutDef> = {
  'strip-3': {
    id: 'strip-3',
    name: '3-Cut Film Strip',
    shortLabel: '3-Cut',
    shotCount: 3,
    width: 600,
    height: 1520,
    photoRadius: 24,
    footerY: 1365,
    footerH: 130,
    slots: [
      { x: 48, y: 56, w: 504, h: 405 },
      { x: 48, y: 493, w: 504, h: 405 },
      { x: 48, y: 930, w: 504, h: 405 },
    ],
  },
  'strip-4': {
    id: 'strip-4',
    name: '4-Cut Classic Strip',
    shortLabel: '4-Cut',
    shotCount: 4,
    width: 600,
    height: 1920,
    photoRadius: 22,
    footerY: 1768,
    footerH: 126,
    slots: [
      { x: 48, y: 52, w: 504, h: 398 },
      { x: 48, y: 478, w: 504, h: 398 },
      { x: 48, y: 904, w: 504, h: 398 },
      { x: 48, y: 1330, w: 504, h: 398 },
    ],
  },
  'grid-2x2': {
    id: 'grid-2x2',
    name: '2×2 Purikura Sheet',
    shortLabel: '2×2 Grid',
    shotCount: 4,
    width: 920,
    height: 1120,
    photoRadius: 24,
    footerY: 970,
    footerH: 125,
    slots: [
      { x: 48, y: 56, w: 396, h: 430 },
      { x: 476, y: 56, w: 396, h: 430 },
      { x: 48, y: 514, w: 396, h: 430 },
      { x: 476, y: 514, w: 396, h: 430 },
    ],
  },
};

export const CAMERA_FILTERS: FilterDef[] = [
  {
    id: 'y2k-gloss',
    name: 'Y2K Gloss',
    cssFilter: 'brightness(1.1) contrast(1.06) saturate(1.18)',
    tintOverlay: 'rgba(255, 110, 167, 0.08)',
    accentColor: '#FF6EA7',
  },
  {
    id: 'original',
    name: 'Natural',
    cssFilter: 'none',
    accentColor: '#FFFDF7',
  },
  {
    id: 'peach-milk',
    name: 'Peach Milk',
    cssFilter: 'brightness(1.12) contrast(0.95) saturate(1.12) sepia(0.14)',
    tintOverlay: 'rgba(255, 196, 172, 0.14)',
    accentColor: '#FFD9E3',
  },
  {
    id: 'cyber-mint',
    name: 'Cyber Mint',
    cssFilter: 'brightness(1.06) contrast(1.08) saturate(1.15) hue-rotate(-8deg)',
    tintOverlay: 'rgba(112, 214, 255, 0.11)',
    accentColor: '#70D6FF',
  },
  {
    id: 'dreamy-soft',
    name: 'Soft Angel',
    cssFilter: 'brightness(1.18) contrast(0.9) saturate(0.92)',
    tintOverlay: 'rgba(216, 180, 248, 0.14)',
    accentColor: '#D8B4F8',
  },
  {
    id: 'retro-2001',
    name: 'CCD 2001',
    cssFilter: 'contrast(1.14) saturate(1.26) sepia(0.22) brightness(1.02)',
    tintOverlay: 'rgba(255, 224, 150, 0.1)',
    accentColor: '#FFE599',
  },
  {
    id: 'mono-pop',
    name: 'Mono Pop',
    cssFilter: 'grayscale(1) contrast(1.22) brightness(1.08)',
    accentColor: '#E5DCE7',
  },
];

export const FRAME_STYLES: FrameStyleDef[] = [
  {
    id: 'glitter-pink',
    name: 'Glitter Pink',
    bgColor: '#FF6EA7',
    secondaryColor: '#FFD9E3',
    textColor: '#2B1A2F',
    subtextColor: '#71003C',
    borderColor: '#2B1A2F',
    pattern: 'glitter',
    previewCss: 'linear-gradient(135deg, #FF6EA7 0%, #FF96C0 100%)',
  },
  {
    id: 'warm-cream',
    name: 'Sticker Cream',
    bgColor: '#FFFDF7',
    secondaryColor: '#FFD9E3',
    textColor: '#2B1A2F',
    subtextColor: '#897177',
    borderColor: '#2B1A2F',
    pattern: 'dots',
    previewCss: '#FFFDF7',
  },
  {
    id: 'sky-checker',
    name: 'Sky Checker',
    bgColor: '#70D6FF',
    secondaryColor: '#FFFDF7',
    textColor: '#2B1A2F',
    subtextColor: '#004D63',
    borderColor: '#2B1A2F',
    pattern: 'checker',
    previewCss:
      'repeating-conic-gradient(#70D6FF 0% 25%, #FFFDF7 0% 50%) 50% / 16px 16px',
  },
  {
    id: 'pastel-lavender',
    name: 'Lilac Dream',
    bgColor: '#D8B4F8',
    secondaryColor: '#FFFDF7',
    textColor: '#2B1A2F',
    subtextColor: '#462963',
    borderColor: '#2B1A2F',
    pattern: 'glitter',
    previewCss: 'linear-gradient(135deg, #D8B4F8 0%, #F0DBFF 100%)',
  },
  {
    id: 'mint-soda',
    name: 'Mint Soda',
    bgColor: '#7AE582',
    secondaryColor: '#FFFDF7',
    textColor: '#2B1A2F',
    subtextColor: '#185024',
    borderColor: '#2B1A2F',
    pattern: 'dots',
    previewCss: '#7AE582',
  },
  {
    id: 'candy-gradient',
    name: 'Y2K Pastel',
    bgColor: '#FF6EA7',
    secondaryColor: '#70D6FF',
    textColor: '#2B1A2F',
    subtextColor: '#2B1A2F',
    borderColor: '#2B1A2F',
    pattern: 'gradient',
    previewCss: 'linear-gradient(180deg, #FF6EA7 0%, #D8B4F8 52%, #70D6FF 100%)',
  },
  {
    id: 'plum-night',
    name: 'Plum Arcade',
    bgColor: '#2B1A2F',
    secondaryColor: '#FF6EA7',
    textColor: '#FFFDF7',
    subtextColor: '#FFB0C9',
    borderColor: '#FF6EA7',
    pattern: 'glitter',
    previewCss: '#2B1A2F',
  },
];

export const GEL_PEN_COLORS = [
  { id: 'pink', name: 'Bubblegum', value: '#FF6EA7' },
  { id: 'white', name: 'Milk White', value: '#FFFDF7' },
  { id: 'sky', name: 'Cyber Sky', value: '#70D6FF' },
  { id: 'lavender', name: 'Lavender', value: '#D8B4F8' },
  { id: 'mint', name: 'Mint Pop', value: '#7AE582' },
  { id: 'lemon', name: 'Lemon Fizz', value: '#FFE156' },
  { id: 'plum', name: 'Deep Plum', value: '#2B1A2F' },
];

export const STICKER_CATALOG: StickerDef[] = [
  {
    id: 'sparkle-pink',
    name: 'Pink Sparkle',
    category: 'sparkle',
    width: 120,
    height: 120,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M60 10 L71 45 L108 56 L71 67 L60 104 L49 67 L12 56 L49 45 Z" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round"/>
      <path d="M60 14 L70 46 L104 56 L70 66 L60 98 L50 66 L16 56 L50 46 Z" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="5" stroke-linejoin="round"/>
      <path d="M60 28 L65 48 L84 56 L65 62 L60 80 L55 62 L38 56 L55 48 Z" fill="#FFD9E3"/>
      <circle cx="94" cy="24" r="9" fill="#FFFDF7"/>
      <circle cx="94" cy="24" r="6" fill="#FFE156" stroke="#2B1A2F" stroke-width="3"/>
    </svg>`,
  },
  {
    id: 'glossy-heart',
    name: 'Candy Heart',
    category: 'cute',
    width: 120,
    height: 120,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M60 100 C28 76 14 56 14 38 C14 22 27 12 41 12 C50 12 56 17 60 24 C64 17 70 12 79 12 C93 12 106 22 106 38 C106 56 92 76 60 100 Z" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round"/>
      <path d="M60 96 C30 74 18 55 18 39 C18 25 29 16 42 16 C50 16 56 21 60 28 C64 21 70 16 78 16 C91 16 102 25 102 39 C102 55 90 74 60 96 Z" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="5" stroke-linejoin="round"/>
      <path d="M32 34 C32 27 38 24 44 25" fill="none" stroke="#FFFDF7" stroke-width="6" stroke-linecap="round"/>
      <circle cx="30" cy="46" r="3.5" fill="#FFFDF7"/>
    </svg>`,
  },
  {
    id: 'ribbon-bow',
    name: 'Coquette Bow',
    category: 'cute',
    width: 140,
    height: 110,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110">
      <g fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
        <path d="M70 46 C44 16 16 20 16 44 C16 66 44 68 70 52 C96 68 124 66 124 44 C124 20 96 16 70 46 Z"/>
        <path d="M62 56 L38 94 L54 88 L68 58"/>
        <path d="M78 56 L102 94 L86 88 L72 58"/>
      </g>
      <path d="M64 54 L40 92 L55 86 L68 58 Z" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M76 54 L100 92 L85 86 L72 58 Z" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M70 48 C46 18 18 22 18 44 C18 65 46 66 70 51 C94 66 122 65 122 44 C122 22 94 18 70 48 Z" fill="#FF96C0" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <ellipse cx="70" cy="50" rx="12" ry="10" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="4.5"/>
      <path d="M31 38 C36 33 44 33 49 37" fill="none" stroke="#FFFDF7" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'cherries',
    name: 'Sweet Cherry',
    category: 'cute',
    width: 120,
    height: 120,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <g fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
        <path d="M40 72 C42 42 58 26 70 18 C74 34 80 54 84 74"/>
        <circle cx="38" cy="84" r="21"/>
        <circle cx="82" cy="86" r="21"/>
      </g>
      <path d="M40 72 C43 44 57 28 70 18 C74 34 79 52 82 72" fill="none" stroke="#2B1A2F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 18 C86 12 99 20 97 32 C84 34 74 28 70 18 Z" fill="#7AE582" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <circle cx="38" cy="84" r="20" fill="#FF4D8D" stroke="#2B1A2F" stroke-width="4.5"/>
      <circle cx="82" cy="86" r="20" fill="#FF4D8D" stroke="#2B1A2F" stroke-width="4.5"/>
      <circle cx="31" cy="77" r="4.5" fill="#FFFDF7"/>
      <circle cx="75" cy="79" r="4.5" fill="#FFFDF7"/>
    </svg>`,
  },
  {
    id: 'crown',
    name: 'Pop Crown',
    category: 'cute',
    width: 130,
    height: 105,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 105">
      <path d="M18 82 L14 34 L42 54 L65 20 L88 54 L116 34 L112 82 Z" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="16" stroke-linejoin="round"/>
      <path d="M20 80 L16 36 L43 55 L65 22 L87 55 L114 36 L110 80 Z" fill="#FFE156" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <rect x="20" y="72" width="90" height="12" rx="6" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="4"/>
      <circle cx="65" cy="54" r="7" fill="#70D6FF" stroke="#2B1A2F" stroke-width="3.5"/>
      <circle cx="16" cy="31" r="6" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="3.5"/>
      <circle cx="65" cy="17" r="7" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="3.5"/>
      <circle cx="114" cy="31" r="6" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="3.5"/>
    </svg>`,
  },
  {
    id: 'angel-wings',
    name: 'Angel Wings',
    category: 'sparkle',
    width: 150,
    height: 90,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 90">
      <g fill="#FFFDF7" stroke="#FFFDF7" stroke-width="12" stroke-linejoin="round">
        <path d="M62 54 C36 22 14 22 12 38 C22 44 26 48 16 56 C28 62 34 62 28 70 C44 74 58 68 64 58 Z"/>
        <path d="M88 54 C114 22 136 22 138 38 C128 44 124 48 134 56 C122 62 116 62 122 70 C106 74 92 68 86 58 Z"/>
      </g>
      <path d="M62 54 C36 22 14 22 12 38 C22 44 26 48 16 56 C28 62 34 62 28 70 C44 74 58 68 64 58 Z" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M88 54 C114 22 136 22 138 38 C128 44 124 48 134 56 C122 62 116 62 122 70 C106 74 92 68 86 58 Z" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <circle cx="75" cy="54" r="11" fill="#70D6FF" stroke="#2B1A2F" stroke-width="4"/>
      <path d="M75 47 L77 52 L82 54 L77 56 L75 61 L73 56 L68 54 L73 52 Z" fill="#FFFDF7"/>
    </svg>`,
  },
  {
    id: 'cyber-star',
    name: 'Sky Star',
    category: 'sparkle',
    width: 120,
    height: 120,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M60 12 L74 42 L107 47 L83 70 L89 103 L60 87 L31 103 L37 70 L13 47 L46 42 Z" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round"/>
      <path d="M60 16 L73 43 L103 48 L81 69 L86 99 L60 85 L34 99 L39 69 L17 48 L47 43 Z" fill="#70D6FF" stroke="#2B1A2F" stroke-width="4.5" stroke-linejoin="round"/>
      <circle cx="51" cy="58" r="4" fill="#2B1A2F"/>
      <circle cx="69" cy="58" r="4" fill="#2B1A2F"/>
      <path d="M55 67 Q60 72 65 67" fill="none" stroke="#2B1A2F" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="44" cy="64" r="4" fill="#FF6EA7" opacity="0.8"/>
      <circle cx="76" cy="64" r="4" fill="#FF6EA7" opacity="0.8"/>
    </svg>`,
  },
  {
    id: 'bunny-ears',
    name: 'Bunny Ears',
    category: 'cute',
    width: 140,
    height: 115,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 115">
      <g fill="#FFFDF7" stroke="#FFFDF7" stroke-width="14" stroke-linejoin="round">
        <ellipse cx="44" cy="58" rx="18" ry="42" transform="rotate(-14 44 58)"/>
        <ellipse cx="96" cy="58" rx="18" ry="42" transform="rotate(14 96 58)"/>
      </g>
      <ellipse cx="44" cy="58" rx="18" ry="42" transform="rotate(-14 44 58)" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4.5"/>
      <ellipse cx="45" cy="62" rx="9" ry="27" transform="rotate(-14 45 62)" fill="#FFB0C9"/>
      <ellipse cx="96" cy="58" rx="18" ry="42" transform="rotate(14 96 58)" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4.5"/>
      <ellipse cx="95" cy="62" rx="9" ry="27" transform="rotate(14 95 62)" fill="#FFB0C9"/>
    </svg>`,
  },
  {
    id: 'rainbow-cloud',
    name: 'Pastel Rainbow',
    category: 'sparkle',
    width: 150,
    height: 100,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
      <path d="M24 76 A51 51 0 0 1 126 76" fill="none" stroke="#FFFDF7" stroke-width="34" stroke-linecap="round"/>
      <path d="M24 76 A51 51 0 0 1 126 76" fill="none" stroke="#2B1A2F" stroke-width="26" stroke-linecap="round"/>
      <path d="M24 76 A51 51 0 0 1 126 76" fill="none" stroke="#FF6EA7" stroke-width="18" stroke-linecap="round"/>
      <path d="M34 76 A41 41 0 0 1 116 76" fill="none" stroke="#FFE156" stroke-width="10" stroke-linecap="round"/>
      <path d="M44 76 A31 31 0 0 1 106 76" fill="none" stroke="#70D6FF" stroke-width="10" stroke-linecap="round"/>
      <circle cx="28" cy="76" r="14" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4"/>
      <circle cx="122" cy="76" r="14" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="4"/>
    </svg>`,
  },
  {
    id: 'glitter-trio',
    name: 'Twinkle Trio',
    category: 'sparkle',
    width: 130,
    height: 110,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 110">
      <path d="M46 14 L53 38 L78 45 L53 52 L46 76 L39 52 L14 45 L39 38 Z" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="12" stroke-linejoin="round"/>
      <path d="M46 18 L52 39 L74 45 L52 51 L46 72 L40 51 L18 45 L40 39 Z" fill="#FFE156" stroke="#2B1A2F" stroke-width="4" stroke-linejoin="round"/>
      <path d="M95 28 L99 42 L113 46 L99 50 L95 64 L91 50 L77 46 L91 42 Z" fill="#D8B4F8" stroke="#2B1A2F" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M80 68 L84 79 L95 83 L84 87 L80 98 L76 87 L65 83 L76 79 Z" fill="#7AE582" stroke="#2B1A2F" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'word-kawaii',
    name: 'SO CUTE!',
    category: 'words',
    width: 170,
    height: 70,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 70">
      <rect x="8" y="10" width="154" height="50" rx="25" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="10"/>
      <rect x="10" y="12" width="150" height="46" rx="23" fill="#FF6EA7" stroke="#2B1A2F" stroke-width="4.5"/>
      <text x="85" y="42" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" font-size="22" fill="#FFFDF7" stroke="#2B1A2F" stroke-width="1.2" letter-spacing="1">SO CUTE!</text>
    </svg>`,
  },
  {
    id: 'word-besties',
    name: 'BESTIES',
    category: 'words',
    width: 170,
    height: 70,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 70">
      <rect x="8" y="10" width="154" height="50" rx="25" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="10"/>
      <rect x="10" y="12" width="150" height="46" rx="23" fill="#70D6FF" stroke="#2B1A2F" stroke-width="4.5"/>
      <text x="85" y="42" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" font-size="22" fill="#2B1A2F" letter-spacing="1">BESTIES ★</text>
    </svg>`,
  },
  {
    id: 'word-purikura',
    name: 'PURIKURA',
    category: 'words',
    width: 180,
    height: 70,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 70">
      <rect x="8" y="10" width="164" height="50" rx="25" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="10"/>
      <rect x="10" y="12" width="160" height="46" rx="23" fill="#D8B4F8" stroke="#2B1A2F" stroke-width="4.5"/>
      <text x="90" y="42" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" font-size="20" fill="#2B1A2F" letter-spacing="1.2">PURIKURA ✧</text>
    </svg>`,
  },
  {
    id: 'word-xoxo',
    name: 'XOXO ♥',
    category: 'words',
    width: 150,
    height: 70,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 70">
      <rect x="8" y="10" width="134" height="50" rx="25" fill="#FFFDF7" stroke="#FFFDF7" stroke-width="10"/>
      <rect x="10" y="12" width="130" height="46" rx="23" fill="#7AE582" stroke="#2B1A2F" stroke-width="4.5"/>
      <text x="75" y="42" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" font-size="22" fill="#2B1A2F" letter-spacing="1.5">XOXO ♥</text>
    </svg>`,
  },
];

export function getStickerById(id: string): StickerDef | undefined {
  return STICKER_CATALOG.find((s) => s.id === id);
}

export function getFilterById(id: string): FilterDef {
  return CAMERA_FILTERS.find((f) => f.id === id) || CAMERA_FILTERS[0];
}

export function getFrameById(id: string): FrameStyleDef {
  return FRAME_STYLES.find((f) => f.id === id) || FRAME_STYLES[0];
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
