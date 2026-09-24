/**
 * KOJERENS Studio Pipeline & Cross-Tool Interop
 * Author: Fanz Irfan | URL: manji.eu.org
 */

const DB_NAME = 'kojerens_studio_db';
const DB_VERSION = 1;
const STORE_NAME = 'pipeline_store';
const TRANSFER_KEY = 'transfer_image';

export function openPipelineDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        resolve((e.target as IDBOpenDBRequest).result);
      };
      req.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

export function showPipelineToast(message: string, duration = 2500): void {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('pipelineToast');
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  const toast = document.createElement('div');
  toast.id = 'pipelineToast';
  toast.style.cssText = [
    'position: fixed',
    'bottom: 24px',
    'left: 50%',
    'transform: translateX(-50%) translateY(20px)',
    'background: rgba(8, 11, 25, 0.95)',
    'color: #ffffff',
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
    'font-size: 12px',
    'letter-spacing: 0.04em',
    'padding: 10px 18px',
    'border-radius: 999px',
    'border: 1px solid rgba(102, 58, 243, 0.5)',
    'box-shadow: 0 12px 36px rgba(0,0,0,0.8), 0 0 20px rgba(102,58,243,0.35)',
    'z-index: 99999',
    'opacity: 0',
    'transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
    'pointer-events: none',
    'display: flex',
    'align-items: center',
    'gap: 8px',
  ].join(';');

  const icon =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#885dfc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  toast.innerHTML = icon + '<span>' + message + '</span>';
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

export async function sendImageThroughPipeline(dataUrl: string, targetUrl: string, toolName?: string): Promise<void> {
  showPipelineToast('Routing render to ' + (toolName || 'tool') + '...');
  const db = await openPipelineDB();

  if (!db) {
    try {
      sessionStorage.setItem(TRANSFER_KEY, dataUrl);
    } catch {}
    window.location.href = targetUrl;
    return;
  }

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, TRANSFER_KEY);
    tx.oncomplete = () => {
      window.location.href = targetUrl;
    };
    tx.onerror = () => {
      try {
        sessionStorage.setItem(TRANSFER_KEY, dataUrl);
      } catch {}
      window.location.href = targetUrl;
    };
  } catch {
    try {
      sessionStorage.setItem(TRANSFER_KEY, dataUrl);
    } catch {}
    window.location.href = targetUrl;
  }
}

export async function receiveImageFromPipeline(callback: (dataUrl: string) => void): Promise<void> {
  const db = await openPipelineDB();

  if (!db) {
    const fallback = sessionStorage.getItem(TRANSFER_KEY);
    if (fallback) {
      try {
        sessionStorage.removeItem(TRANSFER_KEY);
      } catch {}
      showPipelineToast('Imported visual from Studio Pipeline');
      callback(fallback);
    }
    return;
  }

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(TRANSFER_KEY);
    req.onsuccess = () => {
      const data = req.result;
      if (data) {
        store.delete(TRANSFER_KEY);
        showPipelineToast('Imported visual from Studio Pipeline');
        callback(data);
      } else {
        const fallback = sessionStorage.getItem(TRANSFER_KEY);
        if (fallback) {
          try {
            sessionStorage.removeItem(TRANSFER_KEY);
          } catch {}
          showPipelineToast('Imported visual from Studio Pipeline');
          callback(fallback);
        }
      }
    };
  } catch {
    const fallback = sessionStorage.getItem(TRANSFER_KEY);
    if (fallback) {
      try {
        sessionStorage.removeItem(TRANSFER_KEY);
      } catch {}
      showPipelineToast('Imported visual from Studio Pipeline');
      callback(fallback);
    }
  }
}
