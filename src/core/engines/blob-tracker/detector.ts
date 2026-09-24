import type { AnalyzedBlock, CircleFeature, ConnectionLine, ChainCircle, DetectorOptions } from './types';

function lcgPRNG(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function analyzeBlocks(
  imageData: ImageData,
  blockSize: number,
  detMode: string
): AnalyzedBlock[] {
  const { width, height, data } = imageData;
  const blocks: AnalyzedBlock[] = [];
  const lum = new Float32Array(width * height);

  // Compute Luminance
  for (let i = 0; i < lum.length; i++) {
    const idx = i * 4;
    lum[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  const bSize = Math.max(4, blockSize);

  for (let by = 0; by < height; by += bSize) {
    const endY = Math.min(height, by + bSize);
    for (let bx = 0; bx < width; bx += bSize) {
      const endX = Math.min(width, bx + bSize);

      let sumL = 0;
      let count = 0;
      for (let py = by; py < endY; py++) {
        const row = py * width;
        for (let px = bx; px < endX; px++) {
          sumL += lum[row + px];
          count++;
        }
      }
      const mean = count > 0 ? sumL / count : 0;

      let varSum = 0;
      for (let py = by; py < endY; py++) {
        const row = py * width;
        for (let px = bx; px < endX; px++) {
          const diff = lum[row + px] - mean;
          varSum += diff * diff;
        }
      }
      const stdDev = count > 0 ? Math.sqrt(varSum / count) : 0;
      const contrastScore = stdDev * 2.0;

      // Compute weighted centroid inside block
      let candX = (bx + endX) / 2;
      let candY = (by + endY) / 2;
      let sumW = 0;
      let sumWX = 0;
      let sumWY = 0;

      for (let py = by; py < endY; py++) {
        const pyOff = py * width;
        const pprevY = (py > 0 ? py - 1 : py) * width;
        const pnextY = (py < height - 1 ? py + 1 : py) * width;

        for (let px = bx; px < endX; px++) {
          const lVal = lum[pyOff + px];
          const ppx1 = px > 0 ? px - 1 : px;
          const ppx2 = px < width - 1 ? px + 1 : px;
          const pgx = lum[pyOff + ppx2] - lum[pyOff + ppx1];
          const pgy = lum[pnextY + px] - lum[pprevY + px];
          const pgrad = Math.sqrt(pgx * pgx + pgy * pgy);

          let w = 0;
          if (detMode === 'bright') {
            w = Math.pow(Math.max(0, lVal - 50) / 205, 2.5);
          } else if (detMode === 'dark') {
            w = Math.pow(Math.max(0, 205 - lVal) / 205, 2.5);
          } else if (detMode === 'contrast') {
            const diff = Math.abs(lVal - mean);
            w = pgrad * 0.7 + diff * 0.3;
          } else {
            const diffMid = Math.abs(lVal - 128);
            w = (pgrad * 0.6 + Math.abs(lVal - mean) * 0.4) * (1 + diffMid / 128);
          }

          if (w > 0) {
            sumW += w;
            sumWX += px * w;
            sumWY += py * w;
          }
        }
      }

      if (sumW > 0.001) {
        candX = sumWX / sumW;
        candY = sumWY / sumW;
      }

      blocks.push({
        x: candX,
        y: candY,
        brightness: mean,
        contrast: contrastScore,
      });
    }
  }

  return blocks;
}

export function placeCircles(blocks: AnalyzedBlock[], opts: DetectorOptions): CircleFeature[] {
  if (!blocks || blocks.length === 0) return [];

  const { mode, threshold, maxCircles, minRadius, maxRadius, minDistance, sizeSeed } = opts;
  const prng = lcgPRNG(sizeSeed);

  const scored = blocks.map((b) => {
    let s: number;
    if (mode === 'contrast') {
      s = b.contrast;
    } else if (mode === 'bright') {
      s = b.brightness;
    } else if (mode === 'dark') {
      s = 255 - b.brightness;
    } else {
      s = b.contrast * (1 + Math.abs(b.brightness - 128) / 128);
    }
    return { ...b, score: s };
  });

  let maxScore = 1;
  for (let k = 0; k < scored.length; k++) {
    if (scored[k].score > maxScore) maxScore = scored[k].score;
  }

  const threshRatio = threshold / 100;
  const filtered = scored
    .map((s) => ({ ...s, norm: s.score / maxScore }))
    .filter((s) => s.norm >= threshRatio)
    .sort((a, b) => b.norm - a.norm);

  const placed: CircleFeature[] = [];
  const minDistSq = minDistance * minDistance;

  for (let i = 0; i < filtered.length; i++) {
    if (placed.length >= maxCircles) break;
    const cand = filtered[i];

    let ok = true;
    for (let j = 0; j < placed.length; j++) {
      const dx = placed[j].x - cand.x;
      const dy = placed[j].y - cand.y;
      if (dx * dx + dy * dy < minDistSq) {
        ok = false;
        break;
      }
    }

    if (ok) {
      const randScale = 0.5 + prng();
      const radius = (minRadius + (maxRadius - minRadius) * cand.norm) * randScale;
      placed.push({
        x: cand.x,
        y: cand.y,
        r: radius,
        score: cand.norm,
      });
    }
  }

  return placed;
}

export function buildConnections(circles: CircleFeature[], maxDist: number): ConnectionLine[] {
  const lines: ConnectionLine[] = [];
  if (maxDist <= 0) return lines;
  const maxDistSq = maxDist * maxDist;

  for (let r = 0; r < circles.length; r++) {
    const cr = circles[r];
    for (let i = r + 1; i < circles.length; i++) {
      const ci = circles[i];
      const dx = ci.x - cr.x;
      const dy = ci.y - cr.y;
      const dSq = dx * dx + dy * dy;
      if (dSq < maxDistSq) {
        lines.push({ a: r, b: i, dist: Math.sqrt(dSq) });
      }
    }
  }
  return lines;
}

export function buildChain(
  w: number,
  h: number,
  opts: { chainCount: number; chainAngle: number; chainBaseRadius: number; chainSizeRatio: number }
): ChainCircle[] {
  const { chainCount, chainAngle, chainBaseRadius, chainSizeRatio } = opts;
  if (chainCount <= 0) return [];

  const cx = w / 2;
  const cy = h / 2;
  const rad = ((chainAngle - 90) * Math.PI) / 180;
  const list: ChainCircle[] = [{ x: cx, y: cy, r: chainBaseRadius }];

  let px = cx;
  let py = cy;
  let pr = chainBaseRadius;
  const forwardSteps = Math.floor((chainCount - 1) / 2);

  for (let i = 0; i < forwardSteps; i++) {
    const nr = pr * chainSizeRatio;
    px += Math.cos(rad) * pr;
    py += Math.sin(rad) * pr;
    list.push({ x: px, y: py, r: nr });
    pr = nr;
  }

  return list;
}
