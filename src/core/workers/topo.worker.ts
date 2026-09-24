/**
 * Topo Worker (ESM)
 * Dedicated background worker for Marching Squares elevation contour mapping
 */

export interface TopoWorkerRequest {
  id: number;
  width: number;
  height: number;
  data: Uint8ClampedArray;
  levels: number;
  step: number;
}

export interface ContourLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  level: number;
}

export interface TopoWorkerResponse {
  id: number;
  contours: ContourLine[];
}

self.onmessage = (e: MessageEvent<TopoWorkerRequest>) => {
  const { id, width, height, data, levels, step } = e.data;
  const gridStep = Math.max(4, step);
  const contours: ContourLine[] = [];

  const cols = Math.floor(width / gridStep);
  const rows = Math.floor(height / gridStep);
  const grid = new Float32Array(cols * rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * gridStep;
      const py = r * gridStep;
      const idx = (py * width + px) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      grid[r * cols + c] = lum;
    }
  }

  const numLevels = Math.max(2, levels);
  for (let l = 1; l <= numLevels; l++) {
    const isoval = (l / (numLevels + 1)) * 255;

    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const v0 = grid[r * cols + c] >= isoval ? 1 : 0;
        const v1 = grid[r * cols + (c + 1)] >= isoval ? 1 : 0;
        const v2 = grid[(r + 1) * cols + (c + 1)] >= isoval ? 1 : 0;
        const v3 = grid[(r + 1) * cols + c] >= isoval ? 1 : 0;

        const cellIndex = (v0 << 3) | (v1 << 2) | (v2 << 1) | v3;
        if (cellIndex === 0 || cellIndex === 15) continue;

        const x = c * gridStep;
        const y = r * gridStep;
        const half = gridStep / 2;

        const top = { x: x + half, y };
        const right = { x: x + gridStep, y: y + half };
        const bottom = { x: x + half, y: y + gridStep };
        const left = { x, y: y + half };

        const addSegment = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
          contours.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, level: l });
        };

        switch (cellIndex) {
          case 1:
          case 14:
            addSegment(left, bottom);
            break;
          case 2:
          case 13:
            addSegment(bottom, right);
            break;
          case 3:
          case 12:
            addSegment(left, right);
            break;
          case 4:
          case 11:
            addSegment(top, right);
            break;
          case 5:
            addSegment(left, top);
            addSegment(bottom, right);
            break;
          case 6:
          case 9:
            addSegment(top, bottom);
            break;
          case 7:
          case 8:
            addSegment(left, top);
            break;
          case 10:
            addSegment(top, right);
            addSegment(left, bottom);
            break;
        }
      }
    }
  }

  const response: TopoWorkerResponse = { id, contours };
  self.postMessage(response);
};
