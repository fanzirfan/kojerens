/**
 * BufferPool: Reusable Offscreen Canvas Pool
 * Complies with KOJERENS architecture:
 * - 100% client-side in-browser processing
 * - Reusable offscreen canvas buffers with { willReadFrequently: true }
 * - Scratch canvas scaling for hardware-accelerated pixelation
 */

export interface PooledCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export class BufferPool {
  private static instance: BufferPool;
  private pool: Map<string, PooledCanvas> = new Map();

  private constructor() {}

  public static getInstance(): BufferPool {
    if (!BufferPool.instance) {
      BufferPool.instance = new BufferPool();
    }
    return BufferPool.instance;
  }

  /**
   * Acquire or resize a reusable canvas buffer
   */
  public getBuffer(key: string, width: number, height: number, willReadFrequently = true): PooledCanvas {
    let entry = this.pool.get(key);

    if (!entry) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently });
      if (!ctx) {
        throw new Error(`Failed to create 2D context for buffer "${key}"`);
      }
      entry = { canvas, ctx };
      this.pool.set(key, entry);
    }

    if (entry.canvas.width !== width || entry.canvas.height !== height) {
      entry.canvas.width = Math.max(1, Math.floor(width));
      entry.canvas.height = Math.max(1, Math.floor(height));
    }

    return entry;
  }

  /**
   * Clear a specific buffer
   */
  public clearBuffer(key: string): void {
    const entry = this.pool.get(key);
    if (entry) {
      entry.ctx.clearRect(0, 0, entry.canvas.width, entry.canvas.height);
    }
  }

  /**
   * Release all buffers to free GPU memory
   */
  public dispose(): void {
    this.pool.forEach((entry) => {
      entry.canvas.width = 1;
      entry.canvas.height = 1;
    });
    this.pool.clear();
  }
}
