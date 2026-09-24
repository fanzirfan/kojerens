import { BufferPool } from '../../shared/buffer-pool';
import { drawFrameWatermark } from '../../shared/watermark';
import { generateExportFilename, triggerDownload } from '../../shared/exporter';
import type { CrtConfig } from './types';

export const CRT_FORMATS: Record<string, { w: number; h: number; name: string }> = {
  ntsc_4_3: { w: 1440, h: 1080, name: 'NTSC 4:3' },
  vhs_4_3: { w: 1280, h: 960, name: 'VHS Standard 4:3' },
  cinema_16_9: { w: 1920, h: 1080, name: 'HD Broadcast 16:9' },
  arcade_3_4: { w: 1080, h: 1440, name: 'TATE Arcade 3:4' },
};

export class CrtEngine {
  private targetCanvas: HTMLCanvasElement;
  private targetCtx: CanvasRenderingContext2D;
  private currentImage: HTMLImageElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.targetCanvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Cannot get 2d context for CrtEngine');
    this.targetCtx = ctx;
  }

  public setImage(img: HTMLImageElement): void {
    this.currentImage = img;
  }

  public render(config: CrtConfig): void {
    const fmt = CRT_FORMATS[config.format] || CRT_FORMATS.ntsc_4_3;
    const w = fmt.w;
    const h = fmt.h;

    this.targetCanvas.width = w;
    this.targetCanvas.height = h;

    const ctx = this.targetCtx;
    ctx.fillStyle = '#05060f';
    ctx.fillRect(0, 0, w, h);

    if (!this.currentImage) return;

    const pool = BufferPool.getInstance();
    const sourceBuf = pool.getBuffer('crt-source', w, h);
    const sCtx = sourceBuf.ctx;

    // Draw Source Image
    sCtx.clearRect(0, 0, w, h);
    const scale = Math.max(w / this.currentImage.width, h / this.currentImage.height);
    const dw = this.currentImage.width * scale;
    const dh = this.currentImage.height * scale;
    sCtx.drawImage(this.currentImage, (w - dw) / 2, (h - dh) / 2, dw, dh);

    // 1. Chromatic Aberration & RGB Split
    if (config.rgbSplit > 0) {
      const split = config.rgbSplit;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Red channel
      ctx.drawImage(sourceBuf.canvas, -split, 0, w, h);
      // Green channel
      ctx.drawImage(sourceBuf.canvas, 0, 0, w, h);
      // Blue channel
      ctx.drawImage(sourceBuf.canvas, split, 0, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(sourceBuf.canvas, 0, 0, w, h);
    }

    // 2. Scanlines
    if (config.scanlineOpacity > 0) {
      const scanCount = Math.max(60, config.scanlineCount);
      const step = h / scanCount;
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = config.scanlineOpacity / 100;
      for (let y = 0; y < h; y += step) {
        ctx.fillRect(0, y, w, step * 0.45);
      }
      ctx.restore();
    }

    // 3. Phosphor Mask (Trinitron Aperture Grille / Triad Shadow)
    if (config.maskType !== 'none' && config.maskOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = (config.maskOpacity / 100) * 0.35;
      const pitch = Math.max(1, config.maskPitch);

      if (config.maskType === 'aperture') {
        // Vertical stripes: Red, Green, Blue
        for (let x = 0; x < w; x += pitch * 3) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.fillRect(x, 0, pitch, h);
          ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
          ctx.fillRect(x + pitch, 0, pitch, h);
          ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
          ctx.fillRect(x + pitch * 2, 0, pitch, h);
        }
      }
      ctx.restore();
    }

    // 4. Vignette / Glass Curvature
    if (config.vignette > 0) {
      ctx.save();
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.65);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(0, 0, 0, ${config.vignette / 100})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 5. On-Screen Display (OSD)
    if (config.showOsd && config.osdText) {
      ctx.save();
      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00ff41';
      ctx.globalAlpha = 0.85;
      ctx.fillText(config.osdText, 48, 54);
      ctx.restore();
    }

    // 6. Watermark Frame
    if (config.showFrameText) {
      drawFrameWatermark(ctx, w, h, {
        enabled: true,
        topLeft: config.frameTL,
        topRight: config.frameTR,
        bottomLeft: config.frameBL,
        bottomRight: config.frameBR,
        color: '#c7d3ea',
      });
    }
  }

  public exportPng(format = 'ntsc_4_3'): void {
    const filename = generateExportFilename(format, false, 'png');
    triggerDownload(this.targetCanvas, filename);
  }
}
