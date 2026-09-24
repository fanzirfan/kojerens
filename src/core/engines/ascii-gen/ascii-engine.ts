import { BufferPool } from '../../shared/buffer-pool';
import { drawFrameWatermark } from '../../shared/watermark';
import { generateExportFilename, triggerDownload, triggerTextDownload } from '../../shared/exporter';
import type { AsciiConfig, CharSetType } from './types';

const CHAR_SETS: Record<CharSetType, string> = {
  standard: ' .:-=+*#%@',
  numbers: ' 0123456789',
  latin: ' .oO0Q@',
  cyrillic: ' .оО0ФЖ@',
  devanagari: ' .अकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह',
  thai: ' .กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ',
  japanese: ' .一十木林森日田中国会人年大',
  korean: ' .의가은이하고는에한을도를다지',
  chinese: ' .一十木林森口日田中国会人年大',
  arabic: ' .ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
  blocks: ' ░▒▓█',
};

export class AsciiEngine {
  private targetCanvas: HTMLCanvasElement;
  private targetCtx: CanvasRenderingContext2D;
  private currentImage: HTMLImageElement | null = null;
  private lastTextOutput = '';

  constructor(canvas: HTMLCanvasElement) {
    this.targetCanvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Cannot get 2d context for AsciiEngine');
    this.targetCtx = ctx;
  }

  public setImage(img: HTMLImageElement): void {
    this.currentImage = img;
  }

  public render(config: AsciiConfig): string {
    if (!this.currentImage) return '';

    const imgW = this.currentImage.width;
    const imgH = this.currentImage.height;

    const charW = config.fontSize * 0.6 + config.letterSpacing;
    const charH = config.fontSize * config.lineHeight;

    const cols = Math.floor(imgW / charW);
    const rows = Math.floor(imgH / charH);

    const pool = BufferPool.getInstance();
    const sampleBuffer = pool.getBuffer('ascii-sample', cols, rows);
    sampleBuffer.ctx.drawImage(this.currentImage, 0, 0, cols, rows);
    const imgData = sampleBuffer.ctx.getImageData(0, 0, cols, rows);
    const data = imgData.data;

    const targetW = Math.round(cols * charW);
    const targetH = Math.round(rows * charH);

    this.targetCanvas.width = targetW;
    this.targetCanvas.height = targetH;

    const ctx = this.targetCtx;
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    const chars = config.customChars || CHAR_SETS[config.charSet] || CHAR_SETS.standard;
    const charLen = chars.length;

    ctx.font = `${config.fontSize}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'top';

    const textLines: string[] = [];

    for (let r = 0; r < rows; r++) {
      let lineText = '';
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 4;
        const cr = data[idx];
        const cg = data[idx + 1];
        const cb = data[idx + 2];

        // Perceptual luminance
        let lum = 0.299 * cr + 0.587 * cg + 0.114 * cb;
        lum += config.brightness;
        lum = (lum - 128) * (1 + config.contrast / 100) + 128;
        lum = 255 * Math.pow(Math.max(0, Math.min(255, lum)) / 255, 1 / Math.max(0.1, config.gamma));

        let norm = Math.max(0, Math.min(1, lum / 255));
        if (config.invert) norm = 1 - norm;

        const charIdx = Math.min(charLen - 1, Math.floor(norm * charLen));
        const glyph = chars[charIdx];
        lineText += glyph;

        // Choose foreground color
        if (config.colorMode === 'original') {
          ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        } else if (config.colorMode === 'matrix') {
          ctx.fillStyle = `rgb(0, ${Math.floor(norm * 255)}, 65)`;
        } else if (config.colorMode === 'amber') {
          ctx.fillStyle = `rgb(255, ${Math.floor(norm * 176)}, 0)`;
        } else {
          ctx.fillStyle = config.fgColor;
        }

        const x = c * charW;
        const y = r * charH;
        ctx.fillText(glyph, x, y);
      }
      textLines.push(lineText);
    }

    this.lastTextOutput = textLines.join('\n');

    // Bloom effect if enabled
    if (config.bloom && config.bloomStrength > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = `blur(${config.bloomRadius || 8}px)`;
      ctx.globalAlpha = config.bloomStrength / 100;
      ctx.drawImage(this.targetCanvas, 0, 0);
      ctx.restore();
    }

    if (config.watermark) {
      drawFrameWatermark(ctx, targetW, targetH, {
        enabled: true,
        color: config.fgColor,
      });
    }

    return this.lastTextOutput;
  }

  public exportPng(format = 'ascii'): void {
    const filename = generateExportFilename(format, false, 'png');
    triggerDownload(this.targetCanvas, filename);
  }

  public exportText(format = 'ascii'): void {
    const filename = generateExportFilename(format, false, 'txt');
    triggerTextDownload(this.lastTextOutput, filename);
  }
}
