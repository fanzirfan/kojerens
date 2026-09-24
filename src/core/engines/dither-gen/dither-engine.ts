/**
 * DitherEngine: Client-side 1-Bit Dither Matrix Controller
 * Connects Canvas rendering, Web Worker offloading, and SVG export.
 */

import { BufferPool } from '../../shared/buffer-pool';
import { drawFrameWatermark, type FrameTextOptions } from '../../shared/watermark';
import { generateExportFilename, triggerDownload, triggerTextDownload } from '../../shared/exporter';
import { hexToRgb } from '../../shared/color-utils';

export interface DitherConfig {
  engine: string;
  palette: string;
  customBg: string;
  customFg: string;
  invertPalette: boolean;
  pixelScale: number;
  brightness: number;
  contrast: number;
  gamma: number;
  thresholdBias: number;
  edgeSharpen: number;
  serpentine: boolean;
  halftoneAngle: number;
  halftoneFreq: number;
  format: string;
  watermark: Partial<FrameTextOptions>;
}

export const DITHER_PALETTES: Record<string, { name: string; bg: string; fg: string }> = {
  mac: { name: 'Mac 1984', bg: '#000000', fg: '#ffffff' },
  gameboy: { name: 'Game Boy', bg: '#0f380f', fg: '#8bac0f' },
  phosphor: { name: 'Phosphor', bg: '#030c03', fg: '#00ff41' },
  amber: { name: 'Amber CRT', bg: '#0d0700', fg: '#ffb000' },
  cyberpunk: { name: 'Cyberpunk', bg: '#05060f', fg: '#8b5cf6' },
  blueprint: { name: 'Blueprint', bg: '#03162b', fg: '#64d2ff' },
  solarized: { name: 'Solarized', bg: '#073642', fg: '#eee8d5' },
  tokyo: { name: 'Tokyo Neon', bg: '#0b0314', fg: '#ff2a85' },
  newsprint: { name: 'Newsprint', bg: '#181818', fg: '#f2ebdb' },
  thermal: { name: 'Thermal', bg: '#1c000d', fg: '#ff3b30' },
  commodore: { name: 'C64 Indigo', bg: '#352879', fg: '#86b5e5' },
  spectrum: { name: 'ZX Cyan', bg: '#000000', fg: '#00e5ff' },
};

export const DITHER_FORMATS: Record<string, { w: number; h: number; name: string }> = {
  portrait_3_4: { w: 1200, h: 1600, name: 'Portrait 3:4' },
  portrait_9_16: { w: 1080, h: 1920, name: 'Portrait 9:16' },
  portrait_2_3: { w: 1200, h: 1800, name: 'Portrait 2:3' },
  landscape_4_3: { w: 1600, h: 1200, name: 'Landscape 4:3' },
  landscape_16_9: { w: 1920, h: 1080, name: 'Landscape 16:9' },
  landscape_3_2: { w: 1800, h: 1200, name: 'Landscape 3:2' },
  square_1_1: { w: 1200, h: 1200, name: 'Square 1:1' },
};

export class DitherEngine {
  private targetCanvas: HTMLCanvasElement;
  private targetCtx: CanvasRenderingContext2D;
  private worker: Worker | null = null;
  private requestId = 0;
  private lastBitmap: Uint8Array | null = null;
  private currentImage: HTMLImageElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.targetCanvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Cannot get canvas 2d context');
    this.targetCtx = ctx;

    if (typeof window !== 'undefined' && window.Worker) {
      try {
        this.worker = new Worker(
          new URL('../../workers/dither.worker.ts', import.meta.url),
          { type: 'module' }
        );
      } catch (e) {
        console.warn('Web Worker initialization fallback to inline:', e);
      }
    }
  }

  public setImage(image: HTMLImageElement): void {
    this.currentImage = image;
  }

  public async process(config: DitherConfig): Promise<void> {
    if (!this.currentImage) return;

    const format = DITHER_FORMATS[config.format] || DITHER_FORMATS.portrait_3_4;
    const w = format.w;
    const h = format.h;

    this.targetCanvas.width = w;
    this.targetCanvas.height = h;

    const pool = BufferPool.getInstance();
    const sourceBuffer = pool.getBuffer('dither-source', w, h);
    const sCtx = sourceBuffer.ctx;

    // Fill source buffer
    sCtx.clearRect(0, 0, w, h);
    // Draw image centered & cover
    const scale = Math.max(w / this.currentImage.width, h / this.currentImage.height);
    const drawW = this.currentImage.width * scale;
    const drawH = this.currentImage.height * scale;
    const dx = (w - drawW) / 2;
    const dy = (h - drawH) / 2;
    sCtx.drawImage(this.currentImage, dx, dy, drawW, drawH);

    const imgData = sCtx.getImageData(0, 0, w, h);

    if (this.worker) {
      const curId = ++this.requestId;
      return new Promise<void>((resolve) => {
        if (!this.worker) return resolve();

        const onMsg = (e: MessageEvent) => {
          if (e.data.id === curId) {
            this.worker?.removeEventListener('message', onMsg);
            this.lastBitmap = e.data.bitmap;
            this.renderBitmap(this.lastBitmap!, w, h, config);
            resolve();
          }
        };

        this.worker.addEventListener('message', onMsg);
        this.worker.postMessage(
          {
            id: curId,
            width: w,
            height: h,
            data: imgData.data,
            options: {
              engine: config.engine,
              brightness: config.brightness,
              contrast: config.contrast,
              gamma: config.gamma,
              thresholdBias: config.thresholdBias,
              edgeSharpen: config.edgeSharpen,
              serpentine: config.serpentine,
              halftoneAngle: config.halftoneAngle,
              halftoneFreq: config.halftoneFreq,
              pixelScale: config.pixelScale,
            },
          },
          [imgData.data.buffer]
        );
      });
    }
  }

  private renderBitmap(bitmap: Uint8Array, width: number, height: number, config: DitherConfig): void {
    const pal = DITHER_PALETTES[config.palette] || { bg: config.customBg, fg: config.customFg };
    let bgHex = pal.bg;
    let fgHex = pal.fg;

    if (config.invertPalette) {
      const tmp = bgHex;
      bgHex = fgHex;
      fgHex = tmp;
    }

    const bgRgb = hexToRgb(bgHex);
    const fgRgb = hexToRgb(fgHex);

    const outputImg = this.targetCtx.createImageData(width, height);
    const outData = outputImg.data;
    const totalPixels = width * height;

    for (let i = 0; i < totalPixels; i++) {
      const isFg = bitmap[i] === 1;
      const rgb = isFg ? fgRgb : bgRgb;
      const idx = i * 4;
      outData[idx] = rgb.r;
      outData[idx + 1] = rgb.g;
      outData[idx + 2] = rgb.b;
      outData[idx + 3] = 255;
    }

    this.targetCtx.putImageData(outputImg, 0, 0);

    // Overlay Watermark
    if (config.watermark?.enabled) {
      drawFrameWatermark(this.targetCtx, width, height, {
        ...config.watermark,
        color: fgHex,
      });
    }
  }

  public exportPng(format = 'portrait_3_4'): void {
    const filename = generateExportFilename(format, false, 'png');
    triggerDownload(this.targetCanvas, filename);
  }

  public exportSvg(format = 'portrait_3_4'): void {
    if (!this.lastBitmap) return;
    const w = this.targetCanvas.width;
    const h = this.targetCanvas.height;
    const filename = generateExportFilename(format, false, 'svg');

    let rects = '';
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (this.lastBitmap[y * w + x] === 1) {
          rects += `<rect x="${x}" y="${y}" width="2" height="2"/>`;
        }
      }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#000"/>
      <g fill="#fff">${rects}</g>
    </svg>`;

    triggerTextDownload(svg, filename, 'image/svg+xml');
  }

  public dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
