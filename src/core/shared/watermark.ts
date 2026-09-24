/**
 * Watermark & Attribution Overlay System
 * Strictly enforces KOJERENS Agent guidelines:
 * - Always attribute to Fanz Irfan
 * - Default 4-corner frame texts:
 *   - Top Left: Design & Strategy
 *   - Top Right: Fanz Irfan
 *   - Bottom Left: manji.eu.org
 *   - Bottom Right: Indonesia
 */

export interface FrameTextOptions {
  enabled: boolean;
  topRight?: string;
  topLeft?: string;
  bottomLeft?: string;
  bottomRight?: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  padding?: number;
  fontFamily?: string;
}

export const DEFAULT_FRAME_TEXTS = {
  topLeft: 'Design & Strategy',
  topRight: 'Fanz Irfan',
  bottomLeft: 'manji.eu.org',
  bottomRight: 'Indonesia',
} as const;

export function drawFrameWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: Partial<FrameTextOptions> = {}
): void {
  const {
    enabled = true,
    topLeft = DEFAULT_FRAME_TEXTS.topLeft,
    topRight = DEFAULT_FRAME_TEXTS.topRight,
    bottomLeft = DEFAULT_FRAME_TEXTS.bottomLeft,
    bottomRight = DEFAULT_FRAME_TEXTS.bottomRight,
    fontSize = 12,
    color = '#ffffff',
    opacity = 0.8,
    padding = 40,
    fontFamily = 'JetBrains Mono, monospace',
  } = options;

  if (!enabled) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;

  // Top Left
  if (topLeft) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(topLeft, padding, padding);
  }

  // Top Right (Strictly Fanz Irfan)
  if (topRight) {
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(topRight, width - padding, padding);
  }

  // Bottom Left
  if (bottomLeft) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(bottomLeft, padding, height - padding);
  }

  // Bottom Right
  if (bottomRight) {
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(bottomRight, width - padding, height - padding);
  }

  ctx.restore();
}
