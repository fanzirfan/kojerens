/**
 * Exporter Pipeline
 * Strictly enforces KOJERENS guidelines:
 * - Exported PNG files must strictly use the filename prefix `tracker-...`
 *   (format: `tracker-[format]-[timestamp].png`). Never use `brand-asset-...`.
 */

export interface ExportOptions {
  format?: string;
  isOverlay?: boolean;
  mimeType?: string;
}

export function generateExportFilename(format = 'custom', isOverlay = false, extension = 'png'): string {
  const timestamp = Date.now();
  const prefix = isOverlay ? 'tracker-overlay' : 'tracker';
  return `${prefix}-${format}-${timestamp}.${extension}`;
}

export function triggerDownload(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerTextDownload(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
