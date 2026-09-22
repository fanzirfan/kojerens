/**
 * KOJERENS Studio Pipeline & Cross-Tool Interop
 * Author: Fanz Irfan | URL: manji.eu.org
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StudioPipeline = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DB_NAME = 'kojerens_studio_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'pipeline_store';
  var TRANSFER_KEY = 'transfer_image';

  function openDB() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      try {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          var db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = function (e) {
          resolve(e.target.result);
        };
        req.onerror = function () {
          resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
  }

  function showToast(message, duration) {
    duration = duration || 2500;
    var existing = document.getElementById('pipelineToast');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var toast = document.createElement('div');
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
      'gap: 8px'
    ].join(';');

    var icon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#885dfc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
    toast.innerHTML = icon + '<span>' + message + '</span>';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  function sendImage(dataUrl, targetUrl, toolName) {
    showToast('Routing render to ' + (toolName || 'tool') + '...');
    openDB().then(function (db) {
      if (!db) {
        try {
          sessionStorage.setItem(TRANSFER_KEY, dataUrl);
        } catch (e) {
          console.warn('SessionStorage quota exceeded, continuing direct', e);
        }
        window.location.href = targetUrl;
        return;
      }

      try {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.put(dataUrl, TRANSFER_KEY);
        tx.oncomplete = function () {
          window.location.href = targetUrl;
        };
        tx.onerror = function () {
          try {
            sessionStorage.setItem(TRANSFER_KEY, dataUrl);
          } catch (e) {}
          window.location.href = targetUrl;
        };
      } catch (err) {
        try {
          sessionStorage.setItem(TRANSFER_KEY, dataUrl);
        } catch (e) {}
        window.location.href = targetUrl;
      }
    });
  }

  function receiveImage(callback) {
    openDB().then(function (db) {
      if (!db) {
        var fallback = sessionStorage.getItem(TRANSFER_KEY);
        if (fallback) {
          try { sessionStorage.removeItem(TRANSFER_KEY); } catch (e) {}
          showToast('Imported visual from Studio Pipeline');
          callback(fallback);
        }
        return;
      }

      try {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(TRANSFER_KEY);
        req.onsuccess = function () {
          var data = req.result;
          if (data) {
            store.delete(TRANSFER_KEY);
            showToast('Imported visual from Studio Pipeline');
            callback(data);
          } else {
            var fallback = sessionStorage.getItem(TRANSFER_KEY);
            if (fallback) {
              try { sessionStorage.removeItem(TRANSFER_KEY); } catch (e) {}
              showToast('Imported visual from Studio Pipeline');
              callback(fallback);
            }
          }
        };
      } catch (e) {
        var fallback = sessionStorage.getItem(TRANSFER_KEY);
        if (fallback) {
          try { sessionStorage.removeItem(TRANSFER_KEY); } catch (err) {}
          showToast('Imported visual from Studio Pipeline');
          callback(fallback);
        }
      }
    });
  }

  function setupPasteHandler(onImageReady) {
    window.addEventListener('paste', function (e) {
      // Don't intercept if user is typing in a text/number input
      var target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.type !== 'range') {
        return;
      }

      var items = e.clipboardData && e.clipboardData.items;
      if (!items) return;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.type && item.type.indexOf('image') !== -1) {
          var file = item.getAsFile();
          if (file) {
            e.preventDefault();
            showToast('Pasted image from clipboard');
            onImageReady(file);
            break;
          }
        }
      }
    });
  }

  function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMessage || 'Copied to clipboard');
      }).catch(function () {
        fallbackCopyText(text, successMessage);
      });
    } else {
      fallbackCopyText(text, successMessage);
    }
  }

  function fallbackCopyText(text, successMessage) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMessage || 'Copied to clipboard');
    } catch (e) {
      showToast('Could not copy to clipboard');
    }
    document.body.removeChild(ta);
  }

  return {
    sendImage: sendImage,
    receiveImage: receiveImage,
    setupPasteHandler: setupPasteHandler,
    showToast: showToast,
    copyTextToClipboard: copyTextToClipboard
  };
}));
