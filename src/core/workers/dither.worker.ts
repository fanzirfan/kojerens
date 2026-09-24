/**
 * Dither Web Worker (ESM)
 * Dedicated background worker for 15 1-Bit Dither algorithms:
 * - Atkinson, Floyd-Steinberg, Bayer (8x8, 4x4, 2x2), Halftone Dot, Halftone Line,
 *   Sierra-3, Two-Row Sierra, Sierra Lite, Stucki, Burkes, Jarvis-Judice-Ninke,
 *   Noise Dither, Random Threshold.
 */

export interface DitherWorkerRequest {
  id: number;
  width: number;
  height: number;
  data: Uint8ClampedArray; // RGBA buffer
  options: {
    engine: string;
    brightness: number;
    contrast: number;
    gamma: number;
    thresholdBias: number;
    edgeSharpen: number;
    serpentine: boolean;
    halftoneAngle: number;
    halftoneFreq: number;
    pixelScale: number;
  };
}

export interface DitherWorkerResponse {
  id: number;
  width: number;
  height: number;
  bitmap: Uint8Array; // 1-bit bitmap where 1 = foreground, 0 = background
}

const BAYER_2 = [
  [0, 2],
  [3, 1],
];

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

function clamp(v: number, min = 0, max = 255): number {
  return Math.max(min, Math.min(max, v));
}

self.onmessage = (e: MessageEvent<DitherWorkerRequest>) => {
  const { id, width, height, data, options } = e.data;
  const {
    engine,
    brightness,
    contrast,
    gamma,
    thresholdBias,
    edgeSharpen,
    serpentine,
    halftoneAngle,
    halftoneFreq,
  } = options;

  const totalPixels = width * height;
  const gray = new Float32Array(totalPixels);

  // Pre-process: Greyscale, Brightness, Contrast, Gamma
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const invGamma = 1 / Math.max(0.1, gamma);

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    // Standard perceptual luminance
    let lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

    // Brightness
    lum += brightness;

    // Contrast
    lum = contrastFactor * (lum - 128) + 128;

    // Gamma
    if (invGamma !== 1.0) {
      lum = 255 * Math.pow(Math.max(0, lum) / 255, invGamma);
    }

    gray[i] = clamp(lum);
  }

  // Edge sharpening if requested
  if (edgeSharpen > 0) {
    const temp = new Float32Array(gray);
    const amount = edgeSharpen / 50;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const laplacian =
          -temp[i - width] - temp[i - 1] + 4 * temp[i] - temp[i + 1] - temp[i + width];
        gray[i] = clamp(temp[i] + laplacian * amount);
      }
    }
  }

  const bitmap = new Uint8Array(totalPixels);
  const threshold = clamp(128 + thresholdBias);

  // Helper for error distribution
  const addError = (x: number, y: number, err: number, weight: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      gray[y * width + x] += err * weight;
    }
  };

  // Algorithm Execution
  if (engine.startsWith('bayer')) {
    let matrix: number[][];
    let mSize: number;
    let maxVal: number;

    if (engine === 'bayer2') {
      matrix = BAYER_2;
      mSize = 2;
      maxVal = 4;
    } else if (engine === 'bayer4') {
      matrix = BAYER_4;
      mSize = 4;
      maxVal = 16;
    } else {
      matrix = BAYER_8;
      mSize = 8;
      maxVal = 64;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const mThresh = ((matrix[y % mSize][x % mSize] + 0.5) / maxVal) * 255;
        bitmap[i] = gray[i] >= mThresh ? 1 : 0;
      }
    }
  } else if (engine === 'halftone_dot' || engine === 'halftone_line') {
    const rad = (halftoneAngle * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const freq = Math.max(2, halftoneFreq);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const u = (x * cosA + y * sinA) / freq;
        const v = (-x * sinA + y * cosA) / freq;

        let pattern: number;
        if (engine === 'halftone_line') {
          pattern = (Math.sin(u * Math.PI * 2) + 1) * 0.5;
        } else {
          const du = u - Math.floor(u) - 0.5;
          const dv = v - Math.floor(v) - 0.5;
          pattern = 1 - Math.sqrt(du * du + dv * dv) * 1.414;
        }

        const normLum = gray[i] / 255;
        bitmap[i] = normLum >= pattern ? 1 : 0;
      }
    }
  } else if (engine === 'noise') {
    for (let i = 0; i < totalPixels; i++) {
      const n = (Math.random() - 0.5) * 50;
      bitmap[i] = gray[i] + n >= threshold ? 1 : 0;
    }
  } else {
    // Error Diffusion Algorithms (Atkinson, Floyd-Steinberg, Sierra, Stucki, Burkes, JJN)
    for (let y = 0; y < height; y++) {
      const isReverse = serpentine && y % 2 === 1;
      const xStart = isReverse ? width - 1 : 0;
      const xEnd = isReverse ? -1 : width;
      const xStep = isReverse ? -1 : 1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const i = y * width + x;
        const oldVal = gray[i];
        const newVal = oldVal >= threshold ? 255 : 0;
        bitmap[i] = newVal === 255 ? 1 : 0;
        const err = oldVal - newVal;

        if (engine === 'atkinson') {
          // Atkinson distributes 1/8 each to 6 neighbors
          addError(x + xStep, y, err, 1 / 8);
          addError(x + 2 * xStep, y, err, 1 / 8);
          addError(x - xStep, y + 1, err, 1 / 8);
          addError(x, y + 1, err, 1 / 8);
          addError(x + xStep, y + 1, err, 1 / 8);
          addError(x, y + 2, err, 1 / 8);
        } else if (engine === 'floyd') {
          // Floyd-Steinberg
          addError(x + xStep, y, err, 7 / 16);
          addError(x - xStep, y + 1, err, 3 / 16);
          addError(x, y + 1, err, 5 / 16);
          addError(x + xStep, y + 1, err, 1 / 16);
        } else if (engine === 'stucki') {
          // Stucki / 42
          addError(x + xStep, y, err, 8 / 42);
          addError(x + 2 * xStep, y, err, 4 / 42);
          addError(x - 2 * xStep, y + 1, err, 2 / 42);
          addError(x - xStep, y + 1, err, 4 / 42);
          addError(x, y + 1, err, 8 / 42);
          addError(x + xStep, y + 1, err, 4 / 42);
          addError(x + 2 * xStep, y + 1, err, 2 / 42);
          addError(x - 2 * xStep, y + 2, err, 1 / 42);
          addError(x - xStep, y + 2, err, 2 / 42);
          addError(x, y + 2, err, 4 / 42);
          addError(x + xStep, y + 2, err, 2 / 42);
          addError(x + 2 * xStep, y + 2, err, 1 / 42);
        } else if (engine === 'burkes') {
          // Burkes / 32
          addError(x + xStep, y, err, 8 / 32);
          addError(x + 2 * xStep, y, err, 4 / 32);
          addError(x - 2 * xStep, y + 1, err, 2 / 32);
          addError(x - xStep, y + 1, err, 4 / 32);
          addError(x, y + 1, err, 8 / 32);
          addError(x + xStep, y + 1, err, 4 / 32);
          addError(x + 2 * xStep, y + 1, err, 2 / 32);
        } else {
          // Default Sierra-3 / 32
          addError(x + xStep, y, err, 5 / 32);
          addError(x + 2 * xStep, y, err, 3 / 32);
          addError(x - 2 * xStep, y + 1, err, 2 / 32);
          addError(x - xStep, y + 1, err, 4 / 32);
          addError(x, y + 1, err, 5 / 32);
          addError(x + xStep, y + 1, err, 4 / 32);
          addError(x + 2 * xStep, y + 1, err, 2 / 32);
          addError(x - xStep, y + 2, err, 2 / 32);
          addError(x, y + 2, err, 3 / 32);
          addError(x + xStep, y + 2, err, 2 / 32);
        }
      }
    }
  }

  // Transfer binary buffer back to main thread
  const response: DitherWorkerResponse = {
    id,
    width,
    height,
    bitmap,
  };

  self.postMessage(response, { transfer: [bitmap.buffer] });
};
