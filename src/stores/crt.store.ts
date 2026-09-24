import { map } from 'nanostores';
import { DEFAULT_FRAME_TEXTS } from '../core/shared/watermark';
import type { CrtConfig } from '../core/engines/crt-gen/types';

export const $crtState = map<CrtConfig>({
  preset: 'trinitron',
  curvature: 14,
  cornerRound: 12,
  vignette: 50,
  glassGlow: 25,
  scanlineCount: 320,
  scanlineOpacity: 65,
  beamBloom: 45,
  maskType: 'aperture',
  maskPitch: 2,
  maskOpacity: 50,
  rgbSplit: 4,
  syncJitter: 6,
  chromaBleed: 8,
  vhsNoise: 20,
  rfSnow: 15,
  palette: 'rgb',
  brightness: 0,
  contrast: 10,
  saturation: 110,
  format: 'ntsc_4_3',
  showOsd: true,
  osdText: 'CH 03 [NTSC] · STEREO · 15.75 kHz',
  showFrameText: false,
  frameTL: DEFAULT_FRAME_TEXTS.topLeft,
  frameTR: DEFAULT_FRAME_TEXTS.topRight,
  frameBL: DEFAULT_FRAME_TEXTS.bottomLeft,
  frameBR: DEFAULT_FRAME_TEXTS.bottomRight,
});
