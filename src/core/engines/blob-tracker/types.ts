export type DetectionMode = 'contrast' | 'bright' | 'dark' | 'combined';
export type VisualEngineMode = 'circles' | 'hero' | 'geo' | 'studio';

export interface CircleFeature {
  x: number;
  y: number;
  r: number;
  score: number;
}

export interface ConnectionLine {
  a: number;
  b: number;
  dist: number;
}

export interface ChainCircle {
  x: number;
  y: number;
  r: number;
}

export interface AnalyzedBlock {
  x: number;
  y: number;
  brightness: number;
  contrast: number;
}

export interface DetectorOptions {
  mode: DetectionMode;
  blockSize: number;
  threshold: number;
  maxCircles: number;
  minRadius: number;
  maxRadius: number;
  minDistance: number;
  sizeSeed: number;
}

export interface BlobEngineConfig {
  mode: VisualEngineMode;
  detectionMode: DetectionMode;
  format: string;
  palette: {
    bg: string;
    stroke: string;
    name: string;
  };
  imageOpacity: number;
  overlayOpacity: number;
  shapeStroke: number;
  blockSize: number;
  threshold: number;
  maxCircles: number;
  minDistance: number;
  minRadius: number;
  maxRadius: number;
  sizeSeed: number;
  maxDistance: number;
  chainOn: boolean;
  chainCount: number;
  chainAngle: number;
  chainBaseRadius: number;
  chainSizeRatio: number;
  chainIntersections: boolean;
  frameTextOn: boolean;
  frameTextTL: string;
  frameTextTR: string;
  frameTextBL: string;
  frameTextBR: string;
  frameTextSize: number;
  telemetryRadar: boolean;
  telemetryBrackets: boolean;
  telemetryData: boolean;
  topoLabels: boolean;
}
