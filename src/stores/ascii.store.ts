import { map } from 'nanostores';
import type { AsciiConfig } from '../core/engines/ascii-gen/types';

export const $asciiState = map<AsciiConfig>({
  charSet: 'standard',
  fontSize: 14,
  letterSpacing: 0,
  lineHeight: 1.1,
  levels: 10,
  brightness: 0,
  gamma: 1.0,
  contrast: 0,
  invert: false,
  bloom: true,
  bloomStrength: 35,
  bloomRadius: 6,
  colorMode: 'matrix',
  fgColor: '#00ff41',
  bgColor: '#05060f',
  format: 'portrait_3_4',
  watermark: true,
});
