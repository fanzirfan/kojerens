import { BufferPool } from '../../shared/buffer-pool';
import { drawFrameWatermark } from '../../shared/watermark';
import { generateExportFilename, triggerDownload } from '../../shared/exporter';
import { analyzeBlocks, placeCircles, buildConnections, buildChain } from './detector';
import type { BlobEngineConfig, CircleFeature, ConnectionLine, ChainCircle } from './types';
import type { ContourLine } from '../../workers/topo.worker';

export const BLOB_FORMATS: Record<string, { w: number; h: number; name: string }> = {
  portrait_3_4: { w: 1200, h: 1600, name: 'Portrait 3:4' },
  portrait_9_16: { w: 1080, h: 1920, name: 'Portrait 9:16' },
  landscape_16_9: { w: 1920, h: 1080, name: 'Landscape 16:9' },
  square_1_1: { w: 1200, h: 1200, name: 'Square 1:1' },
};

export class BlobEngine {
  private targetCanvas: HTMLCanvasElement;
  private targetCtx: CanvasRenderingContext2D;
  private currentImage: HTMLImageElement | null = null;
  private circles: CircleFeature[] = [];
  private connections: ConnectionLine[] = [];
  private chainCircles: ChainCircle[] = [];
  private topoContours: ContourLine[] = [];
  private topoWorker: Worker | null = null;
  private topoRequestId = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.targetCanvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Cannot get 2d context for BlobEngine');
    this.targetCtx = ctx;

    if (typeof window !== 'undefined' && window.Worker) {
      try {
        this.topoWorker = new Worker(
          new URL('../../workers/topo.worker.ts', import.meta.url),
          { type: 'module' }
        );
      } catch (e) {
        console.warn('Topo worker initialization fallback:', e);
      }
    }
  }

  public setImage(img: HTMLImageElement): void {
    this.currentImage = img;
  }

  public render(config: BlobEngineConfig): void {
    const fmt = BLOB_FORMATS[config.format] || BLOB_FORMATS.portrait_3_4;
    const w = fmt.w;
    const h = fmt.h;

    this.targetCanvas.width = w;
    this.targetCanvas.height = h;

    const ctx = this.targetCtx;
    ctx.fillStyle = config.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Chain geometry
    if (config.chainOn) {
      this.chainCircles = buildChain(w, h, {
        chainCount: config.chainCount,
        chainAngle: config.chainAngle,
        chainBaseRadius: config.chainBaseRadius,
        chainSizeRatio: config.chainSizeRatio,
      });
    } else {
      this.chainCircles = [];
    }

    // Draw Source Image
    if (this.currentImage && config.imageOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = config.imageOpacity;
      const scale = Math.max(w / this.currentImage.width, h / this.currentImage.height);
      const dw = this.currentImage.width * scale;
      const dh = this.currentImage.height * scale;
      ctx.drawImage(this.currentImage, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.restore();
    }

    // Analyze Features
    if (this.currentImage) {
      const pool = BufferPool.getInstance();
      const sBuf = pool.getBuffer('blob-analyze', w, h);
      sBuf.ctx.drawImage(this.currentImage, 0, 0, w, h);
      const imgData = sBuf.ctx.getImageData(0, 0, w, h);

      const blocks = analyzeBlocks(imgData, config.blockSize, config.detectionMode);
      this.circles = placeCircles(blocks, {
        mode: config.detectionMode,
        blockSize: config.blockSize,
        threshold: config.threshold,
        maxCircles: config.maxCircles,
        minRadius: config.minRadius,
        maxRadius: config.maxRadius,
        minDistance: config.minDistance,
        sizeSeed: config.sizeSeed,
      });

      this.connections = buildConnections(this.circles, config.maxDistance);
    }

    // Render Mode Layers
    ctx.save();
    ctx.strokeStyle = config.palette.stroke;
    ctx.fillStyle = config.palette.stroke;

    switch (config.mode) {
      case 'circles':
        this.renderSensorMode(ctx, w, h, config);
        break;
      case 'hero':
        this.renderHeroTelemetryMode(ctx, w, h, config);
        break;
      case 'geo':
        this.renderGeoTopoMode(ctx, w, h, config);
        break;
      case 'studio':
        this.renderStudioViewfinderMode(ctx, w, h, config);
        break;
    }
    ctx.restore();

    // Watermark Frame
    if (config.frameTextOn) {
      drawFrameWatermark(ctx, w, h, {
        enabled: true,
        topLeft: config.frameTextTL,
        topRight: config.frameTextTR,
        bottomLeft: config.frameTextBL,
        bottomRight: config.frameTextBR,
        fontSize: config.frameTextSize,
        color: config.palette.stroke,
      });
    }
  }

  private renderSensorMode(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    config: BlobEngineConfig
  ): void {
    const op = config.overlayOpacity;

    // Connections
    ctx.globalAlpha = 0.4 * op;
    ctx.lineWidth = Math.max(0.5, config.shapeStroke * 0.5);
    for (const c of this.connections) {
      const c1 = this.circles[c.a];
      const c2 = this.circles[c.b];
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }

    // Circles
    ctx.globalAlpha = 0.85 * op;
    ctx.lineWidth = config.shapeStroke;
    for (const c of this.circles) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.stroke();

      // Center crosshair
      const ch = Math.min(6, c.r * 0.4);
      ctx.beginPath();
      ctx.moveTo(c.x - ch, c.y);
      ctx.lineTo(c.x + ch, c.y);
      ctx.moveTo(c.x, c.y - ch);
      ctx.lineTo(c.x, c.y + ch);
      ctx.stroke();
    }

    // Chain circles
    for (const cc of this.chainCircles) {
      ctx.beginPath();
      ctx.arc(cc.x, cc.y, cc.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private renderHeroTelemetryMode(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    config: BlobEngineConfig
  ): void {
    const op = config.overlayOpacity;
    const margin = Math.min(w, h) * 0.08;
    const gridW = w - margin * 2;
    const gridH = h - margin * 2;

    // Perspective / Tech Grid
    const density = 24;
    const cellW = gridW / density;
    const cellH = gridH / density;

    ctx.lineWidth = Math.max(0.5, config.shapeStroke * 0.4);
    for (let i = 0; i <= density; i++) {
      ctx.globalAlpha = (i === 0 || i === density ? 0.3 : 0.08) * op;
      ctx.beginPath();
      ctx.moveTo(margin + i * cellW, margin);
      ctx.lineTo(margin + i * cellW, margin + gridH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(margin, margin + i * cellH);
      ctx.lineTo(margin + gridW, margin + i * cellH);
      ctx.stroke();
    }

    // Corner Brackets
    if (config.telemetryBrackets) {
      const bLen = Math.max(16, Math.min(w, h) * 0.04);
      ctx.lineWidth = Math.max(1.2, config.shapeStroke * 1.5);
      ctx.globalAlpha = 0.8 * op;

      // TL
      ctx.beginPath();
      ctx.moveTo(margin, margin + bLen);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bLen, margin);
      ctx.stroke();

      // TR
      ctx.beginPath();
      ctx.moveTo(margin + gridW - bLen, margin);
      ctx.lineTo(margin + gridW, margin);
      ctx.lineTo(margin + gridW, margin + bLen);
      ctx.stroke();

      // BL
      ctx.beginPath();
      ctx.moveTo(margin, margin + gridH - bLen);
      ctx.lineTo(margin, margin + gridH);
      ctx.lineTo(margin + bLen, margin + gridH);
      ctx.stroke();

      // BR
      ctx.beginPath();
      ctx.moveTo(margin + gridW - bLen, margin + gridH);
      ctx.lineTo(margin + gridW, margin + gridH);
      ctx.lineTo(margin + gridW, margin + gridH - bLen);
      ctx.stroke();
    }

    // Radar Dial
    if (config.telemetryRadar) {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(gridW, gridH) * 0.38;

      ctx.globalAlpha = 0.25 * op;
      ctx.lineWidth = config.shapeStroke;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Dial ticks
      for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180;
        const tickLen = a % 45 === 0 ? 12 : 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * (r - tickLen), cy + Math.sin(rad) * (r - tickLen));
        ctx.lineTo(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
        ctx.stroke();
      }
    }
  }

  private renderGeoTopoMode(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    config: BlobEngineConfig
  ): void {
    const op = config.overlayOpacity;
    ctx.lineWidth = Math.max(0.8, config.shapeStroke);
    ctx.globalAlpha = 0.7 * op;

    for (const c of this.topoContours) {
      ctx.beginPath();
      ctx.moveTo(c.x1, c.y1);
      ctx.lineTo(c.x2, c.y2);
      ctx.stroke();
    }

    // Bearing Spokes
    const cx = w / 2;
    const cy = h / 2;
    const spokeLen = Math.min(w, h) * 0.45;
    ctx.globalAlpha = 0.15 * op;
    for (let a = 0; a < 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rad) * spokeLen, cy + Math.sin(rad) * spokeLen);
      ctx.stroke();
    }
  }

  private renderStudioViewfinderMode(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    config: BlobEngineConfig
  ): void {
    const op = config.overlayOpacity;
    // Rule of Thirds
    ctx.strokeStyle = config.palette.stroke;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.25 * op;

    const x1 = w / 3;
    const x2 = (w / 3) * 2;
    const y1 = h / 3;
    const y2 = (h / 3) * 2;

    ctx.beginPath();
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, h);
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, h);
    ctx.moveTo(0, y1);
    ctx.lineTo(w, y1);
    ctx.moveTo(0, y2);
    ctx.lineTo(w, y2);
    ctx.stroke();
  }

  public exportPng(format = 'portrait_3_4', isOverlay = false): void {
    const filename = generateExportFilename(format, isOverlay, 'png');
    triggerDownload(this.targetCanvas, filename);
  }

  public dispose(): void {
    if (this.topoWorker) {
      this.topoWorker.terminate();
      this.topoWorker = null;
    }
  }
}
