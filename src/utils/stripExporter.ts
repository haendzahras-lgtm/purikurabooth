import {
  getFilterById,
  getFrameById,
  getStickerById,
  STRIP_LAYOUTS,
  svgToDataUrl,
} from '../data/boothPresets';
import {
  CapturedPhoto,
  DoodleStroke,
  FilterId,
  FrameStyleId,
  PlacedSticker,
  StripLayoutId,
} from '../types/booth';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawSparkleGlyph(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx + size * 0.16, cy - size * 0.16, cx + size, cy);
  ctx.quadraticCurveTo(cx + size * 0.16, cy + size * 0.16, cx, cy + size);
  ctx.quadraticCurveTo(cx - size * 0.16, cy + size * 0.16, cx - size, cy);
  ctx.quadraticCurveTo(cx - size * 0.16, cy - size * 0.16, cx, cy - size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export interface RenderStripParams {
  layoutId: StripLayoutId;
  frameId: FrameStyleId;
  photos: (CapturedPhoto | null)[];
  stickers: PlacedSticker[];
  doodles: DoodleStroke[];
  caption: string;
  showDateStamp: boolean;
  scale?: number;
}

export function formatRetroDate(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `'${yy} ${mm} ${dd}`;
}

/**
 * Renders the complete Purikura photo strip with frame pattern, filtered photos,
 * gel-pen doodles, stickers, caption, and retro date stamp into a high-res PNG data URL.
 */
export async function renderStripToDataUrl(params: RenderStripParams): Promise<string> {
  const {
    layoutId,
    frameId,
    photos,
    stickers,
    doodles,
    caption,
    showDateStamp,
    scale = 2,
  } = params;

  const layout = STRIP_LAYOUTS[layoutId];
  const frame = getFrameById(frameId);

  const canvas = document.createElement('canvas');
  canvas.width = layout.width * scale;
  canvas.height = layout.height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.scale(scale, scale);

  // 1. Frame Background
  if (frame.pattern === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, layout.width * 0.4, layout.height);
    grad.addColorStop(0, '#FF6EA7');
    grad.addColorStop(0.52, '#D8B4F8');
    grad.addColorStop(1, '#70D6FF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, layout.width, layout.height);
  } else {
    ctx.fillStyle = frame.bgColor;
    ctx.fillRect(0, 0, layout.width, layout.height);
  }

  // Pattern overlays
  if (frame.pattern === 'checker') {
    const cell = 34;
    ctx.fillStyle = frame.secondaryColor || '#FFFDF7';
    for (let y = 0; y < layout.height; y += cell) {
      for (let x = 0; x < layout.width; x += cell) {
        if (((x / cell) + (y / cell)) % 2 === 0) {
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }
  } else if (frame.pattern === 'dots') {
    ctx.fillStyle =
      frame.id === 'mint-soda'
        ? 'rgba(255, 253, 247, 0.45)'
        : 'rgba(255, 110, 167, 0.22)';
    const gap = 28;
    for (let y = 14; y < layout.height; y += gap) {
      for (let x = 14; x < layout.width; x += gap) {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (frame.pattern === 'glitter') {
    const sparkleColor =
      frame.id === 'plum-night'
        ? 'rgba(255, 176, 201, 0.45)'
        : 'rgba(255, 253, 247, 0.55)';
    const stepY = 125;
    for (let y = 26; y < layout.height; y += stepY) {
      drawSparkleGlyph(ctx, 22, y, 10, sparkleColor);
      drawSparkleGlyph(ctx, layout.width - 22, y + 48, 9, sparkleColor);
    }
    drawSparkleGlyph(ctx, layout.width * 0.22, 26, 8, sparkleColor);
    drawSparkleGlyph(ctx, layout.width * 0.78, 26, 10, sparkleColor);
  }

  // Outer strip border
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, layout.width - 10, layout.height - 10);

  // 2. Photo Slots
  for (let i = 0; i < layout.slots.length; i++) {
    const slot = layout.slots[i];
    const photo = photos[i];

    // Drop shadow behind each photo card
    ctx.save();
    ctx.fillStyle = frame.id === 'plum-night' ? '#FF6EA7' : '#2B1A2F';
    drawRoundedRect(ctx, slot.x + 6, slot.y + 6, slot.w, slot.h, layout.photoRadius);
    ctx.fill();
    ctx.restore();

    // Clip rounded photo frame
    ctx.save();
    drawRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, layout.photoRadius);
    ctx.clip();

    if (photo?.dataUrl) {
      try {
        const img = await loadImage(photo.dataUrl);
        const filterDef = getFilterById(photo.filterId);

        // Cover-fit calculation
        const imgRatio = img.width / img.height;
        const slotRatio = slot.w / slot.h;
        let drawW = slot.w;
        let drawH = slot.h;
        let offsetX = slot.x;
        let offsetY = slot.y;

        if (imgRatio > slotRatio) {
          drawH = slot.h;
          drawW = slot.h * imgRatio;
          offsetX = slot.x - (drawW - slot.w) / 2;
        } else {
          drawW = slot.w;
          drawH = slot.w / imgRatio;
          offsetY = slot.y - (drawH - slot.h) / 2;
        }

        ctx.filter = filterDef.cssFilter;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        ctx.filter = 'none';

        if (filterDef.tintOverlay) {
          ctx.fillStyle = filterDef.tintOverlay;
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
        }
      } catch {
        ctx.fillStyle = '#FFF5EA';
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      }
    } else {
      ctx.fillStyle = '#FFF5EA';
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      ctx.fillStyle = '#897177';
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`SHOT ${i + 1}`, slot.x + slot.w / 2, slot.y + slot.h / 2);
    }

    // Subtle film frame number corner
    ctx.fillStyle = 'rgba(43, 26, 47, 0.65)';
    drawRoundedRect(ctx, slot.x + 14, slot.y + 14, 54, 28, 14);
    ctx.fill();
    ctx.fillStyle = '#FFFDF7';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${i + 1}`, slot.x + 41, slot.y + 28);

    ctx.restore();

    // Crisp border around photo
    ctx.save();
    ctx.strokeStyle = frame.borderColor;
    ctx.lineWidth = 4.5;
    drawRoundedRect(ctx, slot.x, slot.y, slot.w, slot.h, layout.photoRadius);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Footer Banner / Caption & Retro Date Stamp
  const footerCenterX = layout.width / 2;
  const footerCenterY = layout.footerY + layout.footerH / 2;

  // For checkerboard frames, add a clean cream pill backing so caption stays super crisp
  if (frame.pattern === 'checker') {
    ctx.save();
    const pillW = Math.min(layout.width - 96, 520);
    const pillH = 84;
    const pillX = footerCenterX - pillW / 2;
    const pillY = footerCenterY - pillH / 2;
    ctx.fillStyle = '#2B1A2F';
    drawRoundedRect(ctx, pillX + 4, pillY + 4, pillW, pillH, 42);
    ctx.fill();
    ctx.fillStyle = '#FFFDF7';
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 42);
    ctx.fill();
    ctx.strokeStyle = '#2B1A2F';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();
  }

  const displayCaption = (caption.trim() || 'PURIKURA POP').toUpperCase();
  ctx.save();
  ctx.fillStyle = frame.pattern === 'checker' ? '#2B1A2F' : frame.textColor;
  ctx.font = '800 30px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    displayCaption,
    footerCenterX,
    showDateStamp ? footerCenterY - 14 : footerCenterY
  );

  if (showDateStamp) {
    ctx.fillStyle = frame.pattern === 'checker' ? '#005C75' : frame.subtextColor;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText(
      `✧ ${formatRetroDate()} · PRINT CLUB ✧`,
      footerCenterX,
      footerCenterY + 20
    );
  }
  ctx.restore();

  // 4. Gel-Pen Freehand Doodles
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const stroke of doodles) {
    if (stroke.points.length < 2) continue;
    const lineWidth = (stroke.size / 600) * layout.width;

    // Subtle dark outline halo for Y2K gel pen pop
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

    // Main vibrant gel ink
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
  ctx.restore();

  // 5. Placed Peelable Stickers
  for (const placed of stickers) {
    const def = getStickerById(placed.stickerId);
    if (!def) continue;
    try {
      const img = await loadImage(svgToDataUrl(def.svg));
      const baseSize = layout.width * 0.22;
      const aspect = def.height / def.width;
      const w = baseSize * placed.scale;
      const h = w * aspect;
      const cx = placed.x * layout.width;
      const cy = placed.y * layout.height;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((placed.rotation * Math.PI) / 180);
      ctx.shadowColor = 'rgba(43, 26, 47, 0.22)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    } catch {
      // Skip malformed sticker silently
    }
  }

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Generates a cheerful, high-craft Y2K Purikura sample studio portrait on canvas
 * so users without a connected webcam can immediately test the full photobooth experience.
 */
export function generateSamplePosePhoto(shotIndex: number, filterId: FilterId): CapturedPhoto {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  const backdrops = [
    ['#FFD9E3', '#FFF5EA', '#FF6EA7', 'PEACE SIGN!'],
    ['#BCE9FF', '#FFFDF7', '#70D6FF', 'HEART POSE!'],
    ['#F0DBFF', '#FFF5EA', '#D8B4F8', 'WINK & SMILE!'],
    ['#C8F7CE', '#FFFDF7', '#7AE582', 'STAR POSE!'],
  ];
  const [c1, c2, accent, label] = backdrops[shotIndex % backdrops.length];

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle retro studio curtain stripes
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let x = 0; x < canvas.width; x += 80) {
    ctx.fillRect(x, 0, 32, canvas.height);
  }

  // Sparkle studio bokeh
  drawSparkleGlyph(ctx, 150, 140, 26, accent);
  drawSparkleGlyph(ctx, 810, 165, 32, '#FFFDF7');
  drawSparkleGlyph(ctx, 180, 620, 20, '#FFFDF7');
  drawSparkleGlyph(ctx, 800, 580, 24, accent);

  // Charming illustrated Purikura character avatar
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.52;

  // Shoulders
  ctx.fillStyle = accent;
  ctx.strokeStyle = '#2B1A2F';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy + 290, 210, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.fillStyle = '#FFF0E6';
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 148, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cute Y2K hair bangs
  ctx.fillStyle = '#2B1A2F';
  ctx.beginPath();
  ctx.arc(cx, cy - 52, 156, Math.PI * 1.04, Math.PI * 1.96);
  ctx.quadraticCurveTo(cx + 80, cy - 55, cx + 45, cy - 95);
  ctx.quadraticCurveTo(cx, cy - 35, cx - 45, cy - 95);
  ctx.quadraticCurveTo(cx - 85, cy - 55, cx - 154, cy - 34);
  ctx.fill();

  // Eyes (different expression per pose!)
  ctx.fillStyle = '#2B1A2F';
  ctx.strokeStyle = '#2B1A2F';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';

  if (shotIndex % 4 === 2) {
    // Wink
    ctx.beginPath();
    ctx.arc(cx - 52, cy - 10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDF7';
    ctx.beginPath();
    ctx.arc(cx - 57, cy - 16, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 34, cy - 14);
    ctx.quadraticCurveTo(cx + 54, cy - 28, cx + 74, cy - 10);
    ctx.stroke();
  } else if (shotIndex % 4 === 1) {
    // Happy curved eyes
    ctx.beginPath();
    ctx.arc(cx - 52, cy - 4, 20, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 52, cy - 4, 20, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else {
    // Sparkling big Purikura eyes
    ctx.beginPath();
    ctx.arc(cx - 52, cy - 12, 18, 0, Math.PI * 2);
    ctx.arc(cx + 52, cy - 12, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDF7';
    ctx.beginPath();
    ctx.arc(cx - 58, cy - 18, 6, 0, Math.PI * 2);
    ctx.arc(cx + 46, cy - 18, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rosy blush
  ctx.fillStyle = 'rgba(255, 110, 167, 0.45)';
  ctx.beginPath();
  ctx.ellipse(cx - 84, cy + 22, 24, 13, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 84, cy + 22, 24, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#2B1A2F';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy + 24, 28, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Studio badge at bottom
  ctx.fillStyle = '#FFFDF7';
  drawRoundedRect(ctx, cx - 145, canvas.height - 96, 290, 52, 26);
  ctx.fill();
  ctx.strokeStyle = '#2B1A2F';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#2B1A2F';
  ctx.font = '800 22px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`POSE 0${shotIndex + 1} · ${label}`, cx, canvas.height - 70);

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.92),
    filterId,
    capturedAt: new Date().toISOString(),
  };
}
