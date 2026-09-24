export type CharSetType =
  | 'standard'
  | 'numbers'
  | 'latin'
  | 'cyrillic'
  | 'devanagari'
  | 'thai'
  | 'japanese'
  | 'korean'
  | 'chinese'
  | 'arabic'
  | 'blocks';

export interface AsciiConfig {
  charSet: CharSetType;
  customChars?: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  levels: number;
  brightness: number;
  gamma: number;
  contrast: number;
  invert: boolean;
  bloom: boolean;
  bloomStrength: number;
  bloomRadius: number;
  colorMode: 'mono' | 'original' | 'matrix' | 'amber';
  fgColor: string;
  bgColor: string;
  format: string;
  watermark: boolean;
}
