export type MaskType = 'aperture' | 'shadow' | 'slot' | 'mesh' | 'none';
export type CrtPalette = 'rgb' | 'green_p1' | 'amber_p3' | 'white_p4' | 'cyan' | 'plasma' | 'blood' | 'nokia';

export interface CrtConfig {
  preset: string;
  curvature: number;
  cornerRound: number;
  vignette: number;
  glassGlow: number;
  scanlineCount: number;
  scanlineOpacity: number;
  beamBloom: number;
  maskType: MaskType;
  maskPitch: number;
  maskOpacity: number;
  rgbSplit: number;
  syncJitter: number;
  chromaBleed: number;
  vhsNoise: number;
  rfSnow: number;
  palette: CrtPalette;
  brightness: number;
  contrast: number;
  saturation: number;
  format: string;
  showOsd: boolean;
  osdText: string;
  showFrameText: boolean;
  frameTL: string;
  frameTR: string;
  frameBL: string;
  frameBR: string;
}
