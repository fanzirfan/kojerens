import { map } from 'nanostores';
import { DEFAULT_FRAME_TEXTS } from '../core/shared/watermark';

export interface DitherStoreState {
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
  frameText: boolean;
  frameTL: string;
  frameTR: string;
  frameBL: string;
  frameBR: string;
  frameTextSize: number;
}

export const $ditherState = map<DitherStoreState>({
  engine: 'atkinson',
  palette: 'mac',
  customBg: '#05060f',
  customFg: '#ffffff',
  invertPalette: false,
  pixelScale: 1,
  brightness: 0,
  contrast: 0,
  gamma: 1.0,
  thresholdBias: 0,
  edgeSharpen: 0,
  serpentine: true,
  halftoneAngle: 45,
  halftoneFreq: 24,
  format: 'portrait_3_4',
  frameText: false,
  frameTL: DEFAULT_FRAME_TEXTS.topLeft,
  frameTR: DEFAULT_FRAME_TEXTS.topRight,
  frameBL: DEFAULT_FRAME_TEXTS.bottomLeft,
  frameBR: DEFAULT_FRAME_TEXTS.bottomRight,
  frameTextSize: 12,
});
