(function () {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var wrap = document.getElementById('canvasWrap');
  var emptyState = document.getElementById('emptyState');
  var imageInput = document.getElementById('imageInput');
  var textureInput = document.getElementById('textureInput');
  var replaceImageBtn = document.getElementById('replaceImageBtn');
  var replaceTextureBtn = document.getElementById('replaceTextureBtn');
  var removeTextureBtn = document.getElementById('removeTextureBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var downloadOverlayBtn = document.getElementById('downloadOverlayBtn');
  var randomizeBtn = document.getElementById('randomizeBtn');
  var randomizeSettingsBtn = document.getElementById('randomizeSettingsBtn');
  var exportStatusText = document.getElementById('exportStatusText');

  // Gradient Map Controls
  var gradientMapToggleBtn = document.getElementById('gradientMapToggleBtn');
  var gradientMapSelect = document.getElementById('gradientMapSelect');
  var gradientMapPresetVal = document.getElementById('gradientMapPresetVal');
  var gradientMapStrip = document.getElementById('gradientMapStrip');
  var gradientSwatchesGrid = document.getElementById('gradientSwatchesGrid');
  var gradientMapOpacitySlider = document.getElementById('gradientMapOpacity');
  var gradientMapOpacityVal = document.getElementById('gradientMapOpacityVal');
  var gradientMapInvertBtn = document.getElementById('gradientMapInvertBtn');
  var randomizeGradientBtn = document.getElementById('randomizeGradientBtn');
  var importGrdBtn = document.getElementById('importGrdBtn');
  var grdFileInput = document.getElementById('grdFileInput');

  // Frame Text Controls
  var frameTextToggleBtn = document.getElementById('frameTextToggleBtn');
  var frameTextSizeSlider = document.getElementById('frameTextSize');
  var frameTextSizeVal = document.getElementById('frameTextSizeVal');
  var frameTextTLInput = document.getElementById('frameTextTL');
  var frameTextTRInput = document.getElementById('frameTextTR');
  var frameTextBLInput = document.getElementById('frameTextBL');
  var frameTextBRInput = document.getElementById('frameTextBR');

  // Pixelate Controls
  var pixelSizeSlider = document.getElementById('pixelSize');
  var pixelSizeVal = document.getElementById('pixelSizeVal');
  var zoneSizeSlider = document.getElementById('zoneSize');
  var zoneSizeVal = document.getElementById('zoneSizeVal');
  var pixelateStrokeBtn = document.getElementById('pixelateStrokeBtn');
  var undoPixelateBtn = document.getElementById('undoPixelateBtn');
  var clearPixelateBtn = document.getElementById('clearPixelateBtn');
  var pixelateStatus = document.getElementById('pixelateStatus');

  // Crosshair Frame Controls
  var frameToggleBtn = document.getElementById('frameToggleBtn');
  var frameWidthSlider = document.getElementById('frameWidth');
  var frameWidthVal = document.getElementById('frameWidthVal');
  var frameHeightSlider = document.getElementById('frameHeight');
  var frameHeightVal = document.getElementById('frameHeightVal');
  var dashPatternSlider = document.getElementById('dashPattern');
  var dashPatternVal = document.getElementById('dashPatternVal');
  var frameStrokeSlider = document.getElementById('frameStroke');
  var frameStrokeVal = document.getElementById('frameStrokeVal');
  var starSizeSlider = document.getElementById('starSize');
  var starSizeVal = document.getElementById('starSizeVal');
  var starPointsSlider = document.getElementById('starPoints');
  var starPointsVal = document.getElementById('starPointsVal');

  // Chain Controls
  var chainToggleBtn = document.getElementById('chainToggleBtn');
  var chainCountSlider = document.getElementById('chainCount');
  var chainCountVal = document.getElementById('chainCountVal');
  var chainAngleSlider = document.getElementById('chainAngle');
  var chainAngleVal = document.getElementById('chainAngleVal');
  var chainBaseRadiusSlider = document.getElementById('chainBaseRadius');
  var chainBaseRadiusVal = document.getElementById('chainBaseRadiusVal');
  var chainSizeRatioSlider = document.getElementById('chainSizeRatio');
  var chainSizeRatioVal = document.getElementById('chainSizeRatioVal');
  var chainIntersectionsBtn = document.getElementById('chainIntersectionsBtn');
  var markerSizeSlider = document.getElementById('markerSize');
  var markerSizeVal = document.getElementById('markerSizeVal');

  // Image & Detection Controls
  var imageOpacitySlider = document.getElementById('imageOpacity');
  var imageOpacityVal = document.getElementById('imageOpacityVal');
  var blockSizeSlider = document.getElementById('blockSize');
  var blockSizeVal = document.getElementById('blockSizeVal');
  var thresholdSlider = document.getElementById('threshold');
  var thresholdVal = document.getElementById('thresholdVal');
  var maxCirclesSlider = document.getElementById('maxCircles');
  var maxCirclesVal = document.getElementById('maxCirclesVal');
  var minDistanceSlider = document.getElementById('minDistance');
  var minDistanceVal = document.getElementById('minDistanceVal');

  // Shape Controls
  var minRadiusSlider = document.getElementById('minRadius');
  var minRadiusVal = document.getElementById('minRadiusVal');
  var maxRadiusSlider = document.getElementById('maxRadius');
  var maxRadiusVal = document.getElementById('maxRadiusVal');
  var shapeStrokeSlider = document.getElementById('shapeStroke');
  var shapeStrokeVal = document.getElementById('shapeStrokeVal');
  var sizeSeedSlider = document.getElementById('sizeSeed');
  var sizeSeedVal = document.getElementById('sizeSeedVal');
  var labelSizeSlider = document.getElementById('labelSize');
  var labelSizeVal = document.getElementById('labelSizeVal');
  var overlayOpacitySlider = document.getElementById('overlayOpacity');
  var overlayOpacityVal = document.getElementById('overlayOpacityVal');

  // Connection Controls
  var maxDistanceSlider = document.getElementById('maxDistance');
  var maxDistanceVal = document.getElementById('maxDistanceVal');
  var lineWeightSlider = document.getElementById('lineWeight');
  var lineWeightVal = document.getElementById('lineWeightVal');

  // Telemetry HUD Controls
  var telemetryGridSlider = document.getElementById('telemetryGrid');
  var telemetryGridVal = document.getElementById('telemetryGridVal');
  var telemetryNodesSlider = document.getElementById('telemetryNodes');
  var telemetryNodesVal = document.getElementById('telemetryNodesVal');
  var telemetryStrokeSlider = document.getElementById('telemetryStroke');
  var telemetryStrokeVal = document.getElementById('telemetryStrokeVal');
  var telemetryRadarBtn = document.getElementById('telemetryRadarBtn');
  var telemetryBracketsBtn = document.getElementById('telemetryBracketsBtn');
  var telemetryDataBtn = document.getElementById('telemetryDataBtn');

  // Topography Controls
  var topoLevelsSlider = document.getElementById('topoLevels');
  var topoLevelsVal = document.getElementById('topoLevelsVal');
  var topoSmoothingSlider = document.getElementById('topoSmoothing');
  var topoSmoothingVal = document.getElementById('topoSmoothingVal');
  var topoStrokeSlider = document.getElementById('topoStroke');
  var topoStrokeVal = document.getElementById('topoStrokeVal');
  var topoPeakElevationSlider = document.getElementById('topoPeakElevation');
  var topoPeakElevationVal = document.getElementById('topoPeakElevationVal');
  var topoLabelsBtn = document.getElementById('topoLabelsBtn');
  var topoPeaksBtn = document.getElementById('topoPeaksBtn');
  var topoNeatlineBtn = document.getElementById('topoNeatlineBtn');
  var topoLegendBtn = document.getElementById('topoLegendBtn');

  // Viewfinder Controls
  var studioFrameInsetSlider = document.getElementById('studioFrameInset');
  var studioFrameInsetVal = document.getElementById('studioFrameInsetVal');
  var studioStrokeSlider = document.getElementById('studioStroke');
  var studioStrokeVal = document.getElementById('studioStrokeVal');
  var studioBracketsBtn = document.getElementById('studioBracketsBtn');
  var studioTelemetryBtn = document.getElementById('studioTelemetryBtn');

  // Texture & Format Controls
  var textureOpacitySlider = document.getElementById('textureOpacity');
  var textureOpacityVal = document.getElementById('textureOpacityVal');
  var canvasSizeSelect = document.getElementById('canvasSizeSelect');
  var customWidthInput = document.getElementById('customWidth');
  var customHeightInput = document.getElementById('customHeight');
  var paletteGrid = document.getElementById('paletteGrid');

  var FORMATS = {
    portrait_3_4: { w: 1200, h: 1600, label: '1200x1600' },
    square: { w: 1080, h: 1080, label: '1080x1080' },
    landscape_16_9: { w: 1920, h: 1080, label: '1920x1080' },
    instagram_story: { w: 1080, h: 1920, label: '1080x1920' },
    poster: { w: 1400, h: 2000, label: '1400x2000' },
    custom: { w: 1200, h: 1600, label: 'Custom' }
  };

  var state = {
    image: null,
    pixelZones: [],
    pixelStroke: true,
    frameOn: true,
    frameTextOn: true,
    frameTextTL: 'Design & Strategy',
    frameTextTR: 'Fanz Irfan',
    frameTextBL: 'manji.eu.org',
    frameTextBR: 'Indonesia',
    chainOn: true,
    chainIntersections: true,
    detectionMode: 'contrast',
    shape: 'circle',
    palette: { bg: '#0a0a0a', color: '#ffffff', stroke: '#ffffff', name: 'White / Dark' },
    customTexture: null,
    noiseCanvas: null,
    noisePattern: null,
    format: 'portrait_3_4',
    mode: 'circles',
    circles: [],
    connections: [],
    chainCircles: [],
    telemetryRadar: true,
    telemetryBrackets: true,
    telemetryData: true,
    topoLabels: true,
    topoPeaks: true,
    topoNeatline: true,
    topoLegend: true,
    studioGuideMode: 'thirds',
    studioReticleMode: 'circle',
    studioBrackets: true,
    studioTelemetry: true,
    gradientMapOn: false,
    gradientMapIndex: 0,
    gradientMapOpacity: 1.0,
    gradientMapInvert: false
  };

  // Lehmer PRNG (LCG)
  function lcgPRNG(seed) {
    var t = Math.abs(seed) || 1;
    return function () {
      t = (t * 16807) % 2147483647;
      return (t - 1) / 2147483646;
    };
  }

  function createNoisePattern() {
    var nc = document.createElement('canvas');
    nc.width = 256;
    nc.height = 256;
    var nctx = nc.getContext('2d');
    var idata = nctx.createImageData(256, 256);
    var d = idata.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = Math.floor(Math.random() * 256);
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    nctx.putImageData(idata, 0, 0);
    state.noiseCanvas = nc;
    state.noisePattern = null;
  }
  createNoisePattern();

  function updateStatusFooter() {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    exportStatusText.textContent = fmt.label + ' / ' + state.palette.name;
  }

  // Reusable Offscreen Canvas buffer with willReadFrequently
  var offscreenCanvas = null;
  var offscreenCtx = null;
  function getOffscreen(w, h) {
    if (!offscreenCanvas) {
      offscreenCanvas = document.createElement('canvas');
      offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    }
    if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
      offscreenCanvas.width = w;
      offscreenCanvas.height = h;
    }
    return { canvas: offscreenCanvas, ctx: offscreenCtx };
  }

  // Reusable Scratch Canvas for hardware-accelerated pixelation
  var pixelScratchCanvas = null;
  var pixelScratchCtx = null;
  function getPixelScratch() {
    if (!pixelScratchCanvas) {
      pixelScratchCanvas = document.createElement('canvas');
      pixelScratchCtx = pixelScratchCanvas.getContext('2d');
    }
    return { canvas: pixelScratchCanvas, ctx: pixelScratchCtx };
  }

  // Gradient Map System & Presets
  var gradientPresets = (typeof window !== 'undefined' && window.GRADIENT_MAP_PRESETS) ? window.GRADIENT_MAP_PRESETS : [];

  function getGradientLUT(index, inverted) {
    var grad = gradientPresets[index] || gradientPresets[0];
    if (!grad || !grad.stops || grad.stops.length === 0) {
      var fallback = new Uint8Array(256 * 3);
      for (var k = 0; k < 256; k++) {
        fallback[k * 3] = k;
        fallback[k * 3 + 1] = k;
        fallback[k * 3 + 2] = k;
      }
      return fallback;
    }

    var stops = grad.stops.map(function (s) {
      return { r: s.r, g: s.g, b: s.b, pos: inverted ? (1 - s.pos) : s.pos };
    }).sort(function (a, b) { return a.pos - b.pos; });

    if (stops[0].pos > 0) {
      stops.unshift({ r: stops[0].r, g: stops[0].g, b: stops[0].b, pos: 0 });
    }
    if (stops[stops.length - 1].pos < 1) {
      var last = stops[stops.length - 1];
      stops.push({ r: last.r, g: last.g, b: last.b, pos: 1 });
    }

    var lut = new Uint8Array(256 * 3);
    for (var i = 0; i < 256; i++) {
      var t = i / 255;
      var s0 = stops[0];
      var s1 = stops[stops.length - 1];
      for (var j = 0; j < stops.length - 1; j++) {
        if (t >= stops[j].pos && t <= stops[j + 1].pos) {
          s0 = stops[j];
          s1 = stops[j + 1];
          break;
        }
      }
      var span = s1.pos - s0.pos;
      var factor = span > 0.0001 ? (t - s0.pos) / span : 0;
      lut[i * 3] = Math.round(s0.r + (s1.r - s0.r) * factor);
      lut[i * 3 + 1] = Math.round(s0.g + (s1.g - s0.g) * factor);
      lut[i * 3 + 2] = Math.round(s0.b + (s1.b - s0.b) * factor);
    }
    return lut;
  }

  function getGradientCss(grad, inverted) {
    if (!grad || !grad.stops || grad.stops.length === 0) return '#000';
    var stops = grad.stops.map(function (s) {
      return { hex: s.hex, pos: inverted ? (1 - s.pos) : s.pos };
    }).sort(function (a, b) { return a.pos - b.pos; });
    var stopStrs = stops.map(function (s) {
      return s.hex + ' ' + (s.pos * 100).toFixed(1) + '%';
    });
    return 'linear-gradient(to right, ' + stopStrs.join(', ') + ')';
  }

  var gradientMapCache = {
    key: null,
    canvas: null,
    ctx: null
  };

  function getGradientMappedCanvas(img, tW, tH, sx, sy, sw, sh) {
    var opVal = gradientMapOpacitySlider ? parseFloat(gradientMapOpacitySlider.value) : state.gradientMapOpacity;
    if (isNaN(opVal)) opVal = 1.0;
    var key = [
      img.src ? img.src.slice(-32) : 'img',
      tW,
      tH,
      state.gradientMapIndex,
      opVal.toFixed(2),
      state.gradientMapInvert ? 1 : 0
    ].join('_');

    if (gradientMapCache.key === key && gradientMapCache.canvas) {
      return gradientMapCache.canvas;
    }

    if (!gradientMapCache.canvas) {
      gradientMapCache.canvas = document.createElement('canvas');
      gradientMapCache.ctx = gradientMapCache.canvas.getContext('2d', { willReadFrequently: true });
    }
    var oc = gradientMapCache.canvas;
    var oCtx = gradientMapCache.ctx;
    if (oc.width !== tW || oc.height !== tH) {
      oc.width = tW;
      oc.height = tH;
    }

    oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, tW, tH);
    var imgData = oCtx.getImageData(0, 0, tW, tH);
    var data = imgData.data;
    var len = data.length;
    var lut = getGradientLUT(state.gradientMapIndex, state.gradientMapInvert);
    var blend = opVal;

    for (var i = 0; i < len; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      var lum = (r * 77 + g * 151 + b * 28) >> 8;
      var lr = lut[lum * 3];
      var lg = lut[lum * 3 + 1];
      var lb = lut[lum * 3 + 2];
      if (blend < 1) {
        data[i] = Math.round(r + (lr - r) * blend);
        data[i + 1] = Math.round(g + (lg - g) * blend);
        data[i + 2] = Math.round(b + (lb - b) * blend);
      } else {
        data[i] = lr;
        data[i + 1] = lg;
        data[i + 2] = lb;
      }
    }
    oCtx.putImageData(imgData, 0, 0);
    gradientMapCache.key = key;
    return oc;
  }

  function updateGradientMapPreview() {
    var grad = gradientPresets[state.gradientMapIndex] || gradientPresets[0];
    if (!grad) return;
    var css = getGradientCss(grad, state.gradientMapInvert);
    if (gradientMapStrip) gradientMapStrip.style.background = css;
    if (gradientMapPresetVal) gradientMapPresetVal.textContent = grad.name;
    if (gradientMapSelect) gradientMapSelect.value = state.gradientMapIndex;

    if (gradientSwatchesGrid) {
      var items = gradientSwatchesGrid.querySelectorAll('.gradient-swatch-item');
      items.forEach(function (el, idx) {
        el.classList.toggle('active', idx === state.gradientMapIndex);
        var g = gradientPresets[idx];
        if (g) el.style.background = getGradientCss(g, state.gradientMapInvert);
      });
    }
  }

  function populateGradientMapControls() {
    if (!gradientMapSelect || !gradientSwatchesGrid) return;
    gradientMapSelect.innerHTML = '';
    gradientSwatchesGrid.innerHTML = '';

    gradientPresets.forEach(function (grad, idx) {
      var opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = grad.name;
      gradientMapSelect.appendChild(opt);

      var swatch = document.createElement('div');
      swatch.className = 'gradient-swatch-item' + (idx === state.gradientMapIndex ? ' active' : '');
      swatch.title = grad.name;
      swatch.style.background = getGradientCss(grad, state.gradientMapInvert);
      swatch.setAttribute('data-index', idx);
      swatch.setAttribute('role', 'button');
      swatch.setAttribute('tabindex', '0');
      swatch.setAttribute('aria-label', grad.name);

      swatch.addEventListener('click', function () {
        state.gradientMapIndex = idx;
        updateGradientMapPreview();
        scheduleUpdate(1);
      });
      swatch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.gradientMapIndex = idx;
          updateGradientMapPreview();
          scheduleUpdate(1);
        }
      });

      gradientSwatchesGrid.appendChild(swatch);
    });

    updateGradientMapPreview();
  }

  function parseGrdBuffer(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    var uint8 = new Uint8Array(arrayBuffer);
    var grads = [];
    var len = arrayBuffer.byteLength;

    function getAscii(offset, count) {
      var res = '';
      for (var i = 0; i < count; i++) {
        res += String.fromCharCode(uint8[offset + i]);
      }
      return res;
    }

    function readUtf16BE(start, charCount) {
      var res = '';
      for (var i = 0; i < charCount; i++) {
        var code = view.getUint16(start + i * 2, false);
        if (code === 0) break;
        res += String.fromCharCode(code);
      }
      return res;
    }

    var offset = 0;
    while (offset < len - 8) {
      if (getAscii(offset, 4) === 'Nm  ' && getAscii(offset + 4, 4) === 'TEXT') {
        var nameLen = view.getUint32(offset + 8, false);
        var origName = readUtf16BE(offset + 12, nameLen);
        var gradStart = offset;

        var nextGrad = len;
        for (var j = offset + 12 + nameLen * 2; j < len - 8; j++) {
          if (getAscii(j, 4) === 'Nm  ' && getAscii(j + 4, 4) === 'TEXT') {
            nextGrad = j;
            break;
          }
        }

        var colorStops = [];
        var p = gradStart;
        while (p < nextGrad - 8) {
          if (getAscii(p, 4) === 'Rd  ') {
            var rIdx = -1, gIdx = -1, bIdx = -1, lctnIdx = -1;
            for (var k = p; k < Math.min(nextGrad, p + 200); k++) {
              if (rIdx === -1 && getAscii(k, 4) === 'doub') rIdx = k + 4;
              else if (gIdx === -1 && getAscii(k, 4) === 'Grn ') {
                for (var k2 = k; k2 < k + 20; k2++) {
                  if (getAscii(k2, 4) === 'doub') { gIdx = k2 + 4; break; }
                }
              } else if (bIdx === -1 && getAscii(k, 4) === 'Bl  ') {
                for (var k3 = k; k3 < k + 20; k3++) {
                  if (getAscii(k3, 4) === 'doub') { bIdx = k3 + 4; break; }
                }
              } else if (lctnIdx === -1 && getAscii(k, 4) === 'Lctn') {
                for (var k4 = k; k4 < k + 20; k4++) {
                  if (getAscii(k4, 4) === 'long') { lctnIdx = k4 + 4; break; }
                }
              }
              if (rIdx !== -1 && gIdx !== -1 && bIdx !== -1 && lctnIdx !== -1) break;
            }

            if (rIdx !== -1 && gIdx !== -1 && bIdx !== -1 && lctnIdx !== -1) {
              var r = Math.round(view.getFloat64(rIdx, false));
              var g = Math.round(view.getFloat64(gIdx, false));
              var b = Math.round(view.getFloat64(bIdx, false));
              var lctn = view.getInt32(lctnIdx, false);
              var pos = Math.max(0, Math.min(1, lctn / 4096));
              colorStops.push({
                r: r, g: g, b: b,
                pos: parseFloat(pos.toFixed(4)),
                hex: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
              });
              p = lctnIdx + 4;
              continue;
            }
          }
          p++;
        }

        colorStops.sort(function (a, b) { return a.pos - b.pos; });
        var uniqueStops = [];
        colorStops.forEach(function (s) {
          if (uniqueStops.length === 0 || Math.abs(uniqueStops[uniqueStops.length - 1].pos - s.pos) > 0.001) {
            uniqueStops.push(s);
          }
        });

        var numStr = (grads.length + 1 < 10 ? '0' : '') + (grads.length + 1);
        var cleanName = 'Gradient ' + numStr;

        grads.push({
          id: 'custom_grad_' + (grads.length + 1),
          name: cleanName,
          stops: uniqueStops
        });

        offset = nextGrad;
      } else {
        offset++;
      }
    }
    return grads;
  }

  // Block Analysis Cache: avoids re-analyzing 2M pixels on circle placement/visual slider drags
  var cachedAnalysis = {
    image: null,
    targetW: 0,
    targetH: 0,
    bSize: 0,
    mode: '',
    blocks: null
  };

  function getAnalyzedBlocks(img, targetW, targetH, bSize, mode, forceReanalyze) {
    if (
      !forceReanalyze &&
      cachedAnalysis.blocks &&
      cachedAnalysis.image === img &&
      cachedAnalysis.targetW === targetW &&
      cachedAnalysis.targetH === targetH &&
      cachedAnalysis.bSize === bSize &&
      cachedAnalysis.mode === mode
    ) {
      return cachedAnalysis.blocks;
    }
    var blocks = analyzeImage(img, targetW, targetH, bSize, mode);
    cachedAnalysis.image = img;
    cachedAnalysis.targetW = targetW;
    cachedAnalysis.targetH = targetH;
    cachedAnalysis.bSize = bSize;
    cachedAnalysis.mode = mode;
    cachedAnalysis.blocks = blocks;
    return blocks;
  }

  // Enhanced Image Feature Detection with Edge Gradient & Salience-Weighted Centroid Snapping
  function analyzeImage(img, targetW, targetH, bSize, mode) {
    var off = getOffscreen(targetW, targetH);
    var actx = off.ctx;

    var imgRatio = img.width / img.height;
    var targetRatio = targetW / targetH;
    var sx, sy, sw, sh;

    if (imgRatio > targetRatio) {
      sh = img.height;
      sw = sh * targetRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / targetRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    var f;
    try {
      actx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      f = actx.getImageData(0, 0, targetW, targetH).data;
    } catch (err) {
      console.warn('Canvas pixel read error (e.g. cross-origin/tainted image):', err);
      return [];
    }

    var p = bSize || 16;
    var cols = Math.floor(targetW / p);
    var rows = Math.floor(targetH / p);
    var blocks = [];

    // Precompute grayscale luminance for ultra-fast gradient and variance calculation
    var lum = new Float32Array(targetW * targetH);
    for (var i = 0, j = 0; i < f.length; i += 4, j++) {
      lum[j] = f[i] * 0.299 + f[i + 1] * 0.587 + f[i + 2] * 0.114;
    }

    var detMode = mode || 'contrast';

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var startX = c * p;
        var startY = r * p;
        var endX = Math.min(targetW, startX + p);
        var endY = Math.min(targetH, startY + p);
        var sumLum = 0, sumSq = 0, count = 0;
        var sumGrad = 0;

        // Pass 1: Local statistics and spatial gradient calculation
        for (var y = startY; y < endY; y++) {
          var yOff = y * targetW;
          var prevYOff = (y > 0 ? y - 1 : y) * targetW;
          var nextYOff = (y < targetH - 1 ? y + 1 : y) * targetW;

          for (var x = startX; x < endX; x++) {
            var val = lum[yOff + x];
            sumLum += val;
            sumSq += val * val;
            count++;

            var prevX = x > 0 ? x - 1 : x;
            var nextX = x < targetW - 1 ? x + 1 : x;
            var gx = lum[yOff + nextX] - lum[yOff + prevX];
            var gy = lum[nextYOff + x] - lum[prevYOff + x];
            sumGrad += Math.sqrt(gx * gx + gy * gy);
          }
        }

        if (count === 0) continue;

        var mean = sumLum / count;
        var variance = Math.max(0, sumSq / count - mean * mean);
        var rmsContrast = Math.sqrt(variance);
        var meanGrad = sumGrad / count;

        // Enhanced contrast blends intensity variance with edge gradient sharpness
        var contrastScore = rmsContrast * 0.65 + meanGrad * 0.75;

        // Pass 2: Feature Centroid Snapping
        // Snaps circle center precisely to physical feature (pupils, glints, teeth, contours)
        var candX = startX + p / 2;
        var candY = startY + p / 2;

        // Optimization: skip Pass 2 if the block is flat/uniform background
        if (rmsContrast > 4 || meanGrad > 3) {
          var sumW = 0, sumWX = 0, sumWY = 0;

          for (var py = startY; py < endY; py++) {
            var pyOff = py * targetW;
            var pprevY = (py > 0 ? py - 1 : py) * targetW;
            var pnextY = (py < targetH - 1 ? py + 1 : py) * targetW;

            for (var px = startX; px < endX; px++) {
              var lVal = lum[pyOff + px];
              var ppx1 = px > 0 ? px - 1 : px;
              var ppx2 = px < targetW - 1 ? px + 1 : px;
              var pgx = lum[pyOff + ppx2] - lum[pyOff + ppx1];
              var pgy = lum[pnextY + px] - lum[pprevY + px];
              var pgrad = Math.sqrt(pgx * pgx + pgy * pgy);

              var w = 0;
              if (detMode === 'bright') {
                w = Math.pow(Math.max(0, lVal - 50) / 205, 2.5);
              } else if (detMode === 'dark') {
                w = Math.pow(Math.max(0, 205 - lVal) / 205, 2.5);
              } else if (detMode === 'contrast') {
                var diff = Math.abs(lVal - mean);
                w = pgrad * 0.7 + diff * 0.3;
              } else { // combined
                var diffMid = Math.abs(lVal - 128);
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
            candX = Math.max(startX + 1, Math.min(endX - 1, candX));
            candY = Math.max(startY + 1, Math.min(endY - 1, candY));
          }
        }

        blocks.push({
          x: candX,
          y: candY,
          brightness: mean,
          contrast: contrastScore
        });
      }
    }
    return blocks;
  }

  // Circle Placement
  function placeCircles(blocks, opts) {
    if (!blocks || blocks.length === 0) return [];
    var mode = opts.mode || 'contrast';
    var threshold = opts.threshold;
    var maxCircles = opts.maxCircles;
    var minRadius = opts.minRadius;
    var maxRadius = opts.maxRadius;
    var minDistance = opts.minDistance;
    var sizeSeed = opts.sizeSeed;

    var prng = lcgPRNG(sizeSeed);

    var scored = blocks.map(function (b) {
      var s;
      if (mode === 'contrast') {
        s = b.contrast;
      } else if (mode === 'bright') {
        s = b.brightness;
      } else if (mode === 'dark') {
        s = 255 - b.brightness;
      } else { // combined
        s = b.contrast * (1 + Math.abs(b.brightness - 128) / 128);
      }
      return {
        x: b.x,
        y: b.y,
        brightness: b.brightness,
        contrast: b.contrast,
        score: s
      };
    });

    var maxScore = 1;
    for (var k = 0; k < scored.length; k++) {
      if (scored[k].score > maxScore) maxScore = scored[k].score;
    }

    var threshRatio = threshold / 100;
    var filtered = [];
    for (var m = 0; m < scored.length; m++) {
      var norm = scored[m].score / maxScore;
      if (norm >= threshRatio) {
        filtered.push({
          x: scored[m].x,
          y: scored[m].y,
          brightness: scored[m].brightness,
          contrast: scored[m].contrast,
          score: scored[m].score,
          normalizedScore: norm
        });
      }
    }

    filtered.sort(function (a, b) {
      return b.normalizedScore - a.normalizedScore;
    });

    var placed = [];
    var minDistSq = minDistance * minDistance;

    for (var i = 0; i < filtered.length; i++) {
      if (placed.length >= maxCircles) break;
      var candidate = filtered[i];
      var ok = true;
      for (var j = 0; j < placed.length; j++) {
        var dx = placed[j].x - candidate.x;
        var dy = placed[j].y - candidate.y;
        if (dx * dx + dy * dy < minDistSq) {
          ok = false;
          break;
        }
      }
      if (ok) {
        var randScale = 0.5 + prng();
        var radius = (minRadius + (maxRadius - minRadius) * candidate.normalizedScore) * randScale;
        placed.push({
          x: candidate.x,
          y: candidate.y,
          r: radius,
          score: candidate.normalizedScore
        });
      }
    }
    return placed;
  }

  // Connections
  function buildConnections(circles, maxDist) {
    var lines = [];
    if (maxDist <= 0) return lines;
    var maxDistSq = maxDist * maxDist;
    for (var r = 0; r < circles.length; r++) {
      var cr = circles[r];
      for (var i = r + 1; i < circles.length; i++) {
        var ci = circles[i];
        var dx = ci.x - cr.x;
        var dy = ci.y - cr.y;
        var dSq = dx * dx + dy * dy;
        if (dSq < maxDistSq) {
          lines.push({ a: r, b: i, dist: Math.sqrt(dSq) });
        }
      }
    }
    return lines;
  }

  // Chain Calculation
  function buildChain(w, h, opts) {
    var count = opts.chainCount;
    var angle = opts.chainAngle;
    var baseRadius = opts.chainBaseRadius;
    var ratio = opts.chainSizeRatio;
    if (count <= 0) return [];

    var cx = w / 2;
    var cy = h / 2;
    var rad = (angle - 90) * Math.PI / 180;
    var list = [];
    list.push({ x: cx, y: cy, r: baseRadius });

    var px = cx, py = cy, pr = baseRadius;
    var forwardSteps = Math.floor((count - 1) / 2);
    for (var i = 0; i < forwardSteps; i++) {
      var nr = pr * ratio;
      px += Math.cos(rad) * pr;
      py += Math.sin(rad) * pr;
      list.push({ x: px, y: py, r: nr });
      pr = nr;
    }

    px = cx; py = cy; pr = baseRadius;
    var backwardSteps = Math.ceil((count - 1) / 2);
    for (var j = 0; j < backwardSteps; j++) {
      var br = pr * ratio;
      px -= Math.cos(rad) * pr;
      py -= Math.sin(rad) * pr;
      list.push({ x: px, y: py, r: br });
      pr = br;
    }
    return list;
  }

  // Circle Intersections
  function circleIntersections(c1, c2) {
    var dx = c2.x - c1.x;
    var dy = c2.y - c1.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > c1.r + c2.r || dist < Math.abs(c1.r - c2.r) || dist === 0) return [];

    var a = (c1.r * c1.r - c2.r * c2.r + dist * dist) / (2 * dist);
    var hSq = c1.r * c1.r - a * a;
    if (hSq < 0) return [];

    var h = Math.sqrt(hSq);
    var midX = c1.x + a * dx / dist;
    var midY = c1.y + a * dy / dist;
    var rx = -dy * (h / dist);
    var ry = dx * (h / dist);

    return [
      { x: midX + rx, y: midY + ry },
      { x: midX - rx, y: midY - ry }
    ];
  }

  function recalculate(forceReanalyze) {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    var w = fmt.w;
    var h = fmt.h;

    // Chain geometry is independent of image
    state.chainCircles = buildChain(w, h, {
      chainCount: parseInt(chainCountSlider.value, 10) || 11,
      chainAngle: parseFloat(chainAngleSlider.value) || 45,
      chainBaseRadius: parseFloat(chainBaseRadiusSlider.value) || 300,
      chainSizeRatio: parseFloat(chainSizeRatioSlider.value) || 0.50
    });

    if (state.image) {
      var bSize = parseInt(blockSizeSlider.value, 10) || 16;
      var thresh = parseFloat(thresholdSlider.value) || 30;
      var maxC = parseInt(maxCirclesSlider.value, 10) || 80;
      var minDist = parseFloat(minDistanceSlider.value) || 40;
      var minR = parseFloat(minRadiusSlider.value) || 4;
      var maxR = parseFloat(maxRadiusSlider.value) || 24;
      var seed = parseInt(sizeSeedSlider.value, 10) || 42;

      var blocks = getAnalyzedBlocks(state.image, w, h, bSize, state.detectionMode, forceReanalyze);
      state.circles = placeCircles(blocks, {
        mode: state.detectionMode,
        threshold: thresh,
        maxCircles: maxC,
        minRadius: minR,
        maxRadius: maxR,
        minDistance: minDist,
        sizeSeed: seed
      });

      var connDist = parseFloat(maxDistanceSlider.value) || 150;
      state.connections = buildConnections(state.circles, connDist);
    } else {
      state.circles = [];
      state.connections = [];
    }
  }

  // --- MODE RENDERERS (Hero, Geo Tool, Studio) ---
  function drawHeroMode(tCtx, tW, tH, palette, op) {
    var strokeColor = palette.stroke;
    var minDim = Math.min(tW, tH);
    var margin = minDim * 0.08;
    var gridW = tW - margin * 2;
    var gridH = tH - margin * 2;
    var density = parseInt(telemetryGridSlider ? telemetryGridSlider.value : 24, 10) || 24;
    var count = parseInt(telemetryNodesSlider ? telemetryNodesSlider.value : 40, 10) || 40;
    var strokeW = parseFloat(telemetryStrokeSlider ? telemetryStrokeSlider.value : 1.0) || 1.0;
    var cellW = gridW / density;
    var cellH = gridH / density;
    var ox = margin + gridW / 2;
    var oy = margin + gridH / 2;

    tCtx.save();

    // 1. Perspective / Technical Coordinate Grid
    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = Math.max(0.4, strokeW * 0.5);
    for (var i = 0; i <= density; i++) {
      tCtx.globalAlpha = (i === 0 || i === density) ? 0.3 * op : 0.08 * op;
      tCtx.beginPath();
      tCtx.moveTo(margin + i * cellW, margin);
      tCtx.lineTo(margin + i * cellW, margin + gridH);
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.moveTo(margin, margin + i * cellH);
      tCtx.lineTo(margin + gridW, margin + i * cellH);
      tCtx.stroke();
    }

    // 2. Corner Target Brackets
    if (state.telemetryBrackets) {
      var bLen = Math.max(16, minDim * 0.04);
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(1.0, strokeW * 1.5);
      tCtx.globalAlpha = 0.8 * op;

      // Top-Left
      tCtx.beginPath();
      tCtx.moveTo(margin, margin + bLen);
      tCtx.lineTo(margin, margin);
      tCtx.lineTo(margin + bLen, margin);
      tCtx.stroke();

      // Top-Right
      tCtx.beginPath();
      tCtx.moveTo(margin + gridW - bLen, margin);
      tCtx.lineTo(margin + gridW, margin);
      tCtx.lineTo(margin + gridW, margin + bLen);
      tCtx.stroke();

      // Bottom-Left
      tCtx.beginPath();
      tCtx.moveTo(margin, margin + gridH - bLen);
      tCtx.lineTo(margin, margin + gridH);
      tCtx.lineTo(margin + bLen, margin + gridH);
      tCtx.stroke();

      // Bottom-Right
      tCtx.beginPath();
      tCtx.moveTo(margin + gridW - bLen, margin + gridH);
      tCtx.lineTo(margin + gridW, margin + gridH);
      tCtx.lineTo(margin + gridW, margin + gridH - bLen);
      tCtx.stroke();
    }

    // 3. Radar Dial & Compass Rings
    if (state.telemetryRadar) {
      var maxRadarR = minDim * 0.36;
      var numRings = 3;
      tCtx.strokeStyle = strokeColor;
      for (var rIdx = 1; rIdx <= numRings; rIdx++) {
        var ringR = (rIdx / numRings) * maxRadarR;
        tCtx.lineWidth = Math.max(0.5, strokeW * 0.6);
        tCtx.globalAlpha = (rIdx === numRings ? 0.45 : 0.18) * op;
        tCtx.beginPath();
        tCtx.arc(ox, oy, ringR, 0, Math.PI * 2);
        tCtx.stroke();
      }

      tCtx.font = Math.max(7, minDim * 0.0075) + 'px "JetBrains Mono", "SF Mono", monospace';
      tCtx.fillStyle = strokeColor;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      for (var deg = 0; deg < 360; deg += 10) {
        var rad = (deg * Math.PI) / 180;
        var isCardinal = (deg % 90 === 0);
        var isMajor = (deg % 30 === 0);
        var tLen = isCardinal ? 10 : (isMajor ? 6 : 3);
        var innerR = maxRadarR;
        var outerR = maxRadarR + tLen;

        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = isCardinal ? Math.max(1, strokeW) : 0.6;
        tCtx.globalAlpha = (isCardinal ? 0.7 : (isMajor ? 0.4 : 0.2)) * op;
        tCtx.beginPath();
        tCtx.moveTo(ox + Math.cos(rad) * innerR, oy + Math.sin(rad) * innerR);
        tCtx.lineTo(ox + Math.cos(rad) * outerR, oy + Math.sin(rad) * outerR);
        tCtx.stroke();

        if (isMajor) {
          var lblR = maxRadarR + 16;
          var lblText = isCardinal ? (deg === 0 ? '000°' : deg === 90 ? '090°' : deg === 180 ? '180°' : '270°') : deg + '°';
          tCtx.globalAlpha = 0.55 * op;
          tCtx.fillText(lblText, ox + Math.cos(rad) * lblR, oy + Math.sin(rad) * lblR);
        }
      }
    }

    // 4. Origin Center Marker & Reticle
    tCtx.globalAlpha = 0.85 * op;
    tCtx.fillStyle = strokeColor;
    tCtx.beginPath();
    tCtx.arc(ox, oy, Math.max(3, minDim * 0.004), 0, Math.PI * 2);
    tCtx.fill();

    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = Math.max(0.6, strokeW * 0.8);
    tCtx.globalAlpha = 0.5 * op;
    var chLen = minDim * 0.04;
    tCtx.beginPath();
    tCtx.moveTo(ox - chLen, oy);
    tCtx.lineTo(ox + chLen, oy);
    tCtx.moveTo(ox, oy - chLen);
    tCtx.lineTo(ox, oy + chLen);
    tCtx.stroke();

    tCtx.globalAlpha = 0.6 * op;
    tCtx.font = 'bold ' + Math.max(8, minDim * 0.009) + 'px "JetBrains Mono", monospace';
    tCtx.textAlign = 'left';
    tCtx.textBaseline = 'bottom';
    tCtx.fillText('ORIGIN [0,0]', ox + minDim * 0.012, oy - minDim * 0.008);

    // 5. Generative Flow Vectors & Ray Nodes
    var seed = parseInt(sizeSeedSlider ? sizeSeedSlider.value : 42, 10) || 42;
    var prng = lcgPRNG(seed);
    tCtx.lineCap = 'round';

    for (var pIdx = 0; pIdx < count; pIdx++) {
      var angle = prng() * Math.PI * 2;
      var dist = (0.15 + prng() * 0.75) * (minDim * 0.40);
      var px = ox + Math.cos(angle) * dist;
      var py = oy + Math.sin(angle) * dist;
      var isHeavy = pIdx % 4 === 0;

      // Ray from origin
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = isHeavy ? Math.max(1.2, strokeW * 1.4) : Math.max(0.6, strokeW * 0.7);
      tCtx.globalAlpha = (isHeavy ? 0.65 : 0.22) * op;
      tCtx.beginPath();
      tCtx.moveTo(ox, oy);
      tCtx.lineTo(px, py);
      tCtx.stroke();

      // Node point
      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = (isHeavy ? 0.95 : 0.6) * op;
      tCtx.beginPath();
      tCtx.arc(px, py, isHeavy ? Math.max(3.5, minDim * 0.005) : Math.max(2, minDim * 0.003), 0, Math.PI * 2);
      tCtx.fill();

      // Dashed target ring and coordinates for heavy nodes
      if (isHeavy) {
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = Math.max(0.5, strokeW * 0.6);
        tCtx.setLineDash([minDim * 0.004, minDim * 0.004]);
        tCtx.globalAlpha = 0.3 * op;
        tCtx.beginPath();
        tCtx.arc(px, py, minDim * 0.022, 0, Math.PI * 2);
        tCtx.stroke();
        tCtx.setLineDash([]);

        tCtx.fillStyle = strokeColor;
        tCtx.globalAlpha = 0.6 * op;
        tCtx.font = Math.max(7, minDim * 0.0075) + 'px "JetBrains Mono", monospace';
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'middle';
        var degVal = Math.round((angle * 180 / Math.PI + 360) % 360);
        tCtx.fillText('V' + pIdx + ' ' + degVal + '°', px + minDim * 0.028, py);
      }
    }

    // 6. Telemetry Data Readout
    if (state.telemetryData) {
      tCtx.fillStyle = strokeColor;
      tCtx.font = 'bold ' + Math.max(7.5, minDim * 0.0085) + 'px "JetBrains Mono", monospace';
      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'top';
      tCtx.globalAlpha = 0.75 * op;

      var hudX = margin + 8;
      var hudY = margin + 8;
      tCtx.fillText('SYS.TRK // HUD TELEMETRY', hudX, hudY);
      tCtx.font = Math.max(6.5, minDim * 0.007) + 'px "JetBrains Mono", monospace';
      tCtx.globalAlpha = 0.55 * op;
      tCtx.fillText('AZ: 048.2° // EL: +18.4° // RNG: 1840M', hudX, hudY + 14);
      tCtx.fillText('VECTORS: ' + count + ' NODES // GRID: ' + density + 'x' + density, hudX, hudY + 26);
      tCtx.fillText('LOCK: NOMINAL // SNR: 98.4dB', hudX, hudY + 38);
    }

    tCtx.restore();
  }

  // --- TOPOGRAPHIC SURVEY & CONTOUR MAPPING ENGINE ---
  var topoCache = {
    image: null,
    targetW: 0,
    targetH: 0,
    gridW: 0,
    gridH: 0,
    smoothing: 2,
    rawOriginal: null,
    elev: null,
    minVal: 0,
    maxVal: 0,
    peaks: []
  };

  function getTopoElevationGrid(img, tW, tH) {
    var passes = parseInt(topoSmoothingSlider ? topoSmoothingSlider.value : 2, 10) || 2;
    var gridW = 96;
    var gridH = Math.max(48, Math.round(96 * (tH / tW)));

    if (
      topoCache.elev &&
      topoCache.image === img &&
      topoCache.targetW === tW &&
      topoCache.targetH === tH &&
      topoCache.smoothing === passes
    ) {
      return topoCache;
    }

    var raw;
    if (topoCache.rawOriginal && topoCache.image === img && topoCache.targetW === tW && topoCache.targetH === tH) {
      raw = new Float32Array(topoCache.rawOriginal);
    } else {
      raw = new Float32Array(gridW * gridH);
      if (img) {
        var sCanvas = document.createElement('canvas');
        sCanvas.width = gridW;
        sCanvas.height = gridH;
        var sCtx = sCanvas.getContext('2d', { willReadFrequently: true });
        try {
          var imgRatio = img.width / img.height;
          var targetRatio = tW / tH;
          var sx, sy, sw, sh;
          if (imgRatio > targetRatio) {
            sh = img.height;
            sw = sh * targetRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            sw = img.width;
            sh = sw / targetRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }
          sCtx.drawImage(img, sx, sy, sw, sh, 0, 0, gridW, gridH);
          var idata = sCtx.getImageData(0, 0, gridW, gridH).data;
          for (var i = 0, j = 0; i < idata.length; i += 4, j++) {
            raw[j] = idata[i] * 0.299 + idata[i + 1] * 0.587 + idata[i + 2] * 0.114;
          }
        } catch (e) {
          console.warn('Topo grid sampling fallback:', e);
        }
      } else {
        for (var r = 0; r < gridH; r++) {
          var ny = r / gridH;
          for (var c = 0; c < gridW; c++) {
            var nx = c / gridW;
            var v = Math.sin(nx * Math.PI * 3) * Math.cos(ny * Math.PI * 2.5) * 50 +
                    Math.sin(nx * 7.5 + ny * 6.2) * 28 +
                    Math.cos(nx * 14.1 - ny * 11.3) * 14 +
                    128;
            raw[r * gridW + c] = v;
          }
        }
      }
      topoCache.rawOriginal = new Float32Array(raw);
    }

    var smoothed = new Float32Array(gridW * gridH);
    var currentSrc = raw;
    var currentDst = smoothed;

    for (var pass = 0; pass < passes; pass++) {
      for (var gr = 0; gr < gridH; gr++) {
        var r0 = gr > 0 ? gr - 1 : gr;
        var r1 = gr < gridH - 1 ? gr + 1 : gr;
        for (var gc = 0; gc < gridW; gc++) {
          var c0 = gc > 0 ? gc - 1 : gc;
          var c1 = gc < gridW - 1 ? gc + 1 : gc;
          var sum =
            currentSrc[r0 * gridW + c0] + 2 * currentSrc[r0 * gridW + gc] + currentSrc[r0 * gridW + c1] +
            2 * currentSrc[gr * gridW + c0]  + 4 * currentSrc[gr * gridW + gc]  + 2 * currentSrc[gr * gridW + c1] +
            currentSrc[r1 * gridW + c0] + 2 * currentSrc[r1 * gridW + gc] + currentSrc[r1 * gridW + c1];
          currentDst[gr * gridW + gc] = sum / 16;
        }
      }
      var temp = currentSrc;
      currentSrc = currentDst;
      currentDst = temp;
    }
    var elev = currentSrc;

    var minVal = Infinity, maxVal = -Infinity;
    for (var k = 0; k < elev.length; k++) {
      var val = elev[k];
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
    if (maxVal - minVal < 20) {
      maxVal = minVal + 20;
    }

    // Detect mountain peaks and summits
    var peaks = [];
    var minPeakVal = minVal + (maxVal - minVal) * 0.65;
    for (var pr = 2; pr < gridH - 2; pr++) {
      for (var pc = 2; pc < gridW - 2; pc++) {
        var pval = elev[pr * gridW + pc];
        if (pval > minPeakVal) {
          var isPeak = true;
          for (var dr = -1; dr <= 1 && isPeak; dr++) {
            for (var dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              if (elev[(pr + dr) * gridW + (pc + dc)] >= pval) {
                isPeak = false;
                break;
              }
            }
          }
          if (isPeak) {
            peaks.push({
              gx: pc,
              gy: pr,
              x: (pc / (gridW - 1)) * tW,
              y: (pr / (gridH - 1)) * tH,
              val: pval
            });
          }
        }
      }
    }

    peaks.sort(function (a, b) { return b.val - a.val; });
    var filteredPeaks = [];
    var minDim = Math.min(tW, tH);
    var minPeakDist = minDim * 0.16;
    for (var pk = 0; pk < peaks.length && filteredPeaks.length < 5; pk++) {
      var cand = peaks[pk];
      var tooClose = false;
      for (var fk = 0; fk < filteredPeaks.length; fk++) {
        var dX = cand.x - filteredPeaks[fk].x;
        var dY = cand.y - filteredPeaks[fk].y;
        if (Math.sqrt(dX * dX + dY * dY) < minPeakDist) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        filteredPeaks.push(cand);
      }
    }

    topoCache.image = img;
    topoCache.targetW = tW;
    topoCache.targetH = tH;
    topoCache.gridW = gridW;
    topoCache.gridH = gridH;
    topoCache.smoothing = passes;
    topoCache.elev = elev;
    topoCache.minVal = minVal;
    topoCache.maxVal = maxVal;
    topoCache.peaks = filteredPeaks;

    return topoCache;
  }

  function drawGeoMode(tCtx, tW, tH, palette, op) {
    var strokeColor = palette.stroke;
    var minDim = Math.min(tW, tH);
    var strokeW = parseFloat(topoStrokeSlider ? topoStrokeSlider.value : 1.0) || 1.0;
    var lblSize = parseInt(labelSizeSlider ? labelSizeSlider.value : 8, 10) || 8;

    var topo = getTopoElevationGrid(state.image, tW, tH);
    var gridW = topo.gridW;
    var gridH = topo.gridH;
    var elev = topo.elev;
    var minVal = topo.minVal;
    var maxVal = topo.maxVal;
    var span = maxVal - minVal;

    var cellW = tW / (gridW - 1);
    var cellH = tH / (gridH - 1);

    tCtx.save();
    tCtx.lineCap = 'round';
    tCtx.lineJoin = 'round';

    var neatlineMargin = minDim * 0.035;
    var innerW = tW - neatlineMargin * 2;
    var innerH = tH - neatlineMargin * 2;

    // 1. Geodetic Neatline / Cartographic Double Border
    if (state.topoNeatline) {
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(0.6, minDim * 0.0006);
      tCtx.globalAlpha = 0.45 * op;
      tCtx.strokeRect(neatlineMargin, neatlineMargin, innerW, innerH);

      var innerInset = Math.max(3, minDim * 0.004);
      tCtx.lineWidth = 0.5;
      tCtx.globalAlpha = 0.22 * op;
      tCtx.strokeRect(neatlineMargin + innerInset, neatlineMargin + innerInset, innerW - innerInset * 2, innerH - innerInset * 2);

      // 2. Geodetic Coordinate Ticks on Neatline
      var tickSpacing = minDim * 0.08;
      var numTicksX = Math.floor(innerW / tickSpacing);
      var numTicksY = Math.floor(innerH / tickSpacing);

      tCtx.font = Math.max(7, minDim * 0.007) + 'px "JetBrains Mono", "SF Mono", monospace';
      tCtx.fillStyle = strokeColor;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'bottom';

      for (var tx = 1; tx < numTicksX; tx++) {
        var tickX = neatlineMargin + (tx / numTicksX) * innerW;
        tCtx.globalAlpha = 0.35 * op;
        tCtx.beginPath();
        tCtx.moveTo(tickX, neatlineMargin);
        tCtx.lineTo(tickX, neatlineMargin + 5);
        tCtx.stroke();
        tCtx.beginPath();
        tCtx.moveTo(tickX, tH - neatlineMargin);
        tCtx.lineTo(tickX, tH - neatlineMargin - 5);
        tCtx.stroke();

        if (tx % 2 === 0) {
          var lonMin = 10 + tx * 2;
          tCtx.fillText('08°' + lonMin + "'E", tickX, neatlineMargin - 3);
        }
      }

      tCtx.textAlign = 'right';
      tCtx.textBaseline = 'middle';
      for (var ty = 1; ty < numTicksY; ty++) {
        var tickY = neatlineMargin + (ty / numTicksY) * innerH;
        tCtx.globalAlpha = 0.35 * op;
        tCtx.beginPath();
        tCtx.moveTo(neatlineMargin, tickY);
        tCtx.lineTo(neatlineMargin + 5, tickY);
        tCtx.stroke();
        tCtx.beginPath();
        tCtx.moveTo(tW - neatlineMargin, tickY);
        tCtx.lineTo(tW - neatlineMargin - 5, tickY);
        tCtx.stroke();

        if (ty % 2 === 0) {
          var latMin = 40 - ty * 2;
          tCtx.fillText('46°' + latMin + "'N", neatlineMargin - 4, tickY);
        }
      }
    }

    // 3. Marching Squares Isoline Contours
    var numLevels = parseInt(topoLevelsSlider ? topoLevelsSlider.value : 14, 10) || 14;
    var baseMeters = 800;
    var peakMeters = parseInt(topoPeakElevationSlider ? topoPeakElevationSlider.value : 3200, 10) || 3200;
    var meterSpan = peakMeters - baseMeters;

    for (var lIdx = 1; lIdx <= numLevels; lIdx++) {
      var frac = lIdx / (numLevels + 1);
      var iso = minVal + frac * span;
      var isIndex = (lIdx % 3 === 0);
      var currentMeters = Math.round(baseMeters + frac * meterSpan);

      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = isIndex ? Math.max(1.2, strokeW * 1.5) : Math.max(0.6, strokeW * 0.75);
      tCtx.globalAlpha = (isIndex ? 0.85 : 0.40) * op;

      tCtx.beginPath();
      var labelCandidate = null;
      var candidateLen = 0;

      for (var r = 0; r < gridH - 1; r++) {
        var rIdx = r * gridW;
        var rNextIdx = (r + 1) * gridW;
        var y0 = r * cellH;
        var y1 = (r + 1) * cellH;

        for (var c = 0; c < gridW - 1; c++) {
          var v0 = elev[rIdx + c];
          var v1 = elev[rIdx + c + 1];
          var v2 = elev[rNextIdx + c + 1];
          var v3 = elev[rNextIdx + c];

          var caseId = 0;
          if (v0 >= iso) caseId |= 8;
          if (v1 >= iso) caseId |= 4;
          if (v2 >= iso) caseId |= 2;
          if (v3 >= iso) caseId |= 1;

          if (caseId === 0 || caseId === 15) continue;

          var x0 = c * cellW;
          var x1 = (c + 1) * cellW;

          var topX = x0 + (cellW * (iso - v0)) / (v1 - v0);
          var topY = y0;
          var rightX = x1;
          var rightY = y0 + (cellH * (iso - v1)) / (v2 - v1);
          var botX = x0 + (cellW * (iso - v3)) / (v2 - v3);
          var botY = y1;
          var leftX = x0;
          var leftY = y0 + (cellH * (iso - v0)) / (v3 - v0);

          switch (caseId) {
            case 1:
            case 14:
              tCtx.moveTo(botX, botY);
              tCtx.lineTo(leftX, leftY);
              break;
            case 2:
            case 13:
              tCtx.moveTo(rightX, rightY);
              tCtx.lineTo(botX, botY);
              break;
            case 3:
            case 12:
              tCtx.moveTo(leftX, leftY);
              tCtx.lineTo(rightX, rightY);
              break;
            case 4:
            case 11:
              tCtx.moveTo(topX, topY);
              tCtx.lineTo(rightX, rightY);
              break;
            case 5:
              tCtx.moveTo(leftX, leftY);
              tCtx.lineTo(topX, topY);
              tCtx.moveTo(botX, botY);
              tCtx.lineTo(rightX, rightY);
              break;
            case 6:
            case 9:
              tCtx.moveTo(topX, topY);
              tCtx.lineTo(botX, botY);
              break;
            case 7:
            case 8:
              tCtx.moveTo(leftX, leftY);
              tCtx.lineTo(topX, topY);
              break;
            case 10:
              tCtx.moveTo(topX, topY);
              tCtx.lineTo(rightX, rightY);
              tCtx.moveTo(leftX, leftY);
              tCtx.lineTo(botX, botY);
              break;
          }

          if (isIndex && c > gridW * 0.25 && c < gridW * 0.75 && r > gridH * 0.2 && r < gridH * 0.8) {
            var distFromCenter = Math.abs(c - gridW * 0.5) + Math.abs(r - gridH * 0.5);
            if (!labelCandidate || distFromCenter < candidateLen) {
              labelCandidate = { x: (x0 + x1) * 0.5, y: (y0 + y1) * 0.5 };
              candidateLen = distFromCenter;
            }
          }
        }
      }
      tCtx.stroke();

      if (state.topoLabels && isIndex && labelCandidate && lblSize > 0) {
        var elevText = currentMeters + 'm';
        var tFont = 'bold ' + Math.max(7, minDim * 0.0075) + 'px "JetBrains Mono", "SF Mono", monospace';
        tCtx.save();
        tCtx.font = tFont;
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        var mWidth = tCtx.measureText(elevText).width + 6;
        var mHeight = Math.max(9, minDim * 0.009);

        tCtx.fillStyle = palette.bg || '#05060f';
        tCtx.globalAlpha = 0.85 * op;
        tCtx.fillRect(labelCandidate.x - mWidth / 2, labelCandidate.y - mHeight / 2, mWidth, mHeight);

        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = 0.6;
        tCtx.globalAlpha = 0.4 * op;
        tCtx.strokeRect(labelCandidate.x - mWidth / 2, labelCandidate.y - mHeight / 2, mWidth, mHeight);

        tCtx.fillStyle = strokeColor;
        tCtx.globalAlpha = 0.9 * op;
        tCtx.fillText(elevText, labelCandidate.x, labelCandidate.y);
        tCtx.restore();
      }
    }

    // 4. Peak Summit Benchmarks
    if (state.topoPeaks) {
      topo.peaks.forEach(function (peak, pIdx) {
        var peakM = Math.round(baseMeters + ((peak.val - minVal) / span) * meterSpan);
        var triSize = Math.max(4, minDim * 0.007);

        tCtx.save();
        tCtx.fillStyle = strokeColor;
        tCtx.globalAlpha = 0.95 * op;
        tCtx.beginPath();
        tCtx.moveTo(peak.x, peak.y - triSize * 1.3);
        tCtx.lineTo(peak.x - triSize, peak.y + triSize * 0.7);
        tCtx.lineTo(peak.x + triSize, peak.y + triSize * 0.7);
        tCtx.closePath();
        tCtx.fill();

        tCtx.fillStyle = palette.bg || '#05060f';
        tCtx.beginPath();
        tCtx.arc(peak.x, peak.y, Math.max(1, triSize * 0.25), 0, Math.PI * 2);
        tCtx.fill();

        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = 0.7;
        tCtx.globalAlpha = 0.4 * op;
        tCtx.setLineDash([2, 3]);
        tCtx.beginPath();
        tCtx.moveTo(peak.x - triSize * 2.5, peak.y);
        tCtx.lineTo(peak.x + triSize * 2.5, peak.y);
        tCtx.moveTo(peak.x, peak.y - triSize * 2.5);
        tCtx.lineTo(peak.x, peak.y + triSize * 2.5);
        tCtx.stroke();
        tCtx.setLineDash([]);

        var pLbl = '▲ PEAK ' + (pIdx + 1) + ' [' + peakM + 'm]';
        tCtx.font = 'bold ' + Math.max(8, minDim * 0.0085) + 'px "JetBrains Mono", "SF Mono", monospace';
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'middle';
        tCtx.fillStyle = strokeColor;
        tCtx.globalAlpha = 0.9 * op;
        tCtx.fillText(pLbl, peak.x + triSize * 1.6, peak.y - 1);

        var latSub = '46°' + Math.round(30 + (peak.y / tH) * 10) + "'N " + '08°' + Math.round(12 + (peak.x / tW) * 10) + "'E";
        tCtx.font = Math.max(6.5, minDim * 0.007) + 'px "JetBrains Mono", "SF Mono", monospace';
        tCtx.globalAlpha = 0.55 * op;
        tCtx.fillText(latSub, peak.x + triSize * 1.6, peak.y + triSize * 1.3);

        tCtx.restore();
      });
    }

    // 5. Cartographic Legend Block
    if (state.topoLegend) {
      var legW = Math.min(220, minDim * 0.38);
      var legH = Math.min(65, minDim * 0.12);
      var legX = neatlineMargin + 14;
      var legY = tH - neatlineMargin - legH - 14;

      tCtx.save();
      tCtx.fillStyle = palette.bg || '#05060f';
      tCtx.globalAlpha = 0.85 * op;
      tCtx.fillRect(legX, legY, legW, legH);

      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = 0.8;
      tCtx.globalAlpha = 0.35 * op;
      tCtx.strokeRect(legX, legY, legW, legH);

      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = 0.9 * op;
      tCtx.font = 'bold ' + Math.max(7.5, minDim * 0.0085) + 'px "JetBrains Mono", "SF Mono", monospace';
      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'top';
      tCtx.fillText('TOPOGRAPHIC ELEVATION SURVEY', legX + 8, legY + 8);

      tCtx.font = Math.max(6.5, minDim * 0.007) + 'px "JetBrains Mono", "SF Mono", monospace';
      tCtx.globalAlpha = 0.6 * op;
      tCtx.fillText('CONTOUR INTERVAL: 100m // WGS-84', legX + 8, legY + 22);
      tCtx.fillText('ELEVATION: ' + baseMeters + 'm - ' + peakMeters + 'm MSL', legX + 8, legY + 34);
      tCtx.fillText('GRID: GEODETIC WGS84 // SCALE 1:25,000', legX + 8, legY + 46);

      // 6. Cartographic True North Indicator
      var northX = tW - neatlineMargin - 28;
      var northY = neatlineMargin + 32;
      var arrowLen = Math.max(14, minDim * 0.025);

      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = 1;
      tCtx.globalAlpha = 0.7 * op;
      tCtx.beginPath();
      tCtx.moveTo(northX, northY + arrowLen);
      tCtx.lineTo(northX, northY - arrowLen);
      tCtx.lineTo(northX - 4, northY - arrowLen + 8);
      tCtx.stroke();

      tCtx.fillStyle = strokeColor;
      tCtx.beginPath();
      tCtx.moveTo(northX, northY - arrowLen);
      tCtx.lineTo(northX + 4, northY - arrowLen + 8);
      tCtx.lineTo(northX, northY - arrowLen + 6);
      tCtx.closePath();
      tCtx.fill();

      tCtx.font = 'bold ' + Math.max(7, minDim * 0.008) + 'px "JetBrains Mono", monospace';
      tCtx.textAlign = 'center';
      tCtx.fillText('TN', northX, northY - arrowLen - 3);

      tCtx.restore();
    }

    tCtx.restore();
  }

  function drawStudioMode(tCtx, tW, tH, palette, op) {
    var strokeColor = palette.stroke;
    var minDim = Math.min(tW, tH);
    var strokeW = parseFloat(studioStrokeSlider ? studioStrokeSlider.value : 1.0) || 1.0;
    var insetPct = (parseFloat(studioFrameInsetSlider ? studioFrameInsetSlider.value : 10) || 10) / 100;

    var frameMarginX = tW * insetPct;
    var frameMarginY = tH * insetPct;
    var frameW = tW - frameMarginX * 2;
    var frameH = tH - frameMarginY * 2;
    var cx = tW / 2;
    var cy = tH / 2;

    tCtx.save();
    tCtx.lineCap = 'round';
    tCtx.lineJoin = 'round';

    // 1. Inner Safe Framing Box
    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = Math.max(0.6, strokeW * 0.8);
    tCtx.globalAlpha = 0.25 * op;
    tCtx.strokeRect(frameMarginX, frameMarginY, frameW, frameH);

    // 2. Compositional Guides
    var guideMode = state.studioGuideMode || 'thirds';
    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = Math.max(0.5, strokeW * 0.6);
    tCtx.setLineDash([minDim * 0.005, minDim * 0.005]);

    if (guideMode === 'thirds') {
      var x1 = frameMarginX + frameW / 3;
      var x2 = frameMarginX + (frameW * 2) / 3;
      var y1 = frameMarginY + frameH / 3;
      var y2 = frameMarginY + (frameH * 2) / 3;

      tCtx.globalAlpha = 0.22 * op;
      tCtx.beginPath();
      tCtx.moveTo(x1, frameMarginY); tCtx.lineTo(x1, frameMarginY + frameH);
      tCtx.moveTo(x2, frameMarginY); tCtx.lineTo(x2, frameMarginY + frameH);
      tCtx.moveTo(frameMarginX, y1); tCtx.lineTo(frameMarginX + frameW, y1);
      tCtx.moveTo(frameMarginX, y2); tCtx.lineTo(frameMarginX + frameW, y2);
      tCtx.stroke();
      tCtx.setLineDash([]);

      var ppTicks = [[x1, y1], [x2, y1], [x1, y2], [x2, y2]];
      var ptLen = Math.max(6, minDim * 0.012);
      tCtx.globalAlpha = 0.6 * op;
      tCtx.lineWidth = Math.max(0.8, strokeW);
      ppTicks.forEach(function (pt) {
        tCtx.beginPath();
        tCtx.moveTo(pt[0] - ptLen, pt[1]); tCtx.lineTo(pt[0] + ptLen, pt[1]);
        tCtx.moveTo(pt[0], pt[1] - ptLen); tCtx.lineTo(pt[0], pt[1] + ptLen);
        tCtx.stroke();
      });
    } else if (guideMode === 'golden') {
      var gx1 = frameMarginX + frameW * 0.382;
      var gx2 = frameMarginX + frameW * 0.618;
      var gy1 = frameMarginY + frameH * 0.382;
      var gy2 = frameMarginY + frameH * 0.618;

      tCtx.globalAlpha = 0.22 * op;
      tCtx.beginPath();
      tCtx.moveTo(gx1, frameMarginY); tCtx.lineTo(gx1, frameMarginY + frameH);
      tCtx.moveTo(gx2, frameMarginY); tCtx.lineTo(gx2, frameMarginY + frameH);
      tCtx.moveTo(frameMarginX, gy1); tCtx.lineTo(frameMarginX + frameW, gy1);
      tCtx.moveTo(frameMarginX, gy2); tCtx.lineTo(frameMarginX + frameW, gy2);
      tCtx.stroke();
      tCtx.setLineDash([]);

      var gPoints = [[gx1, gy1], [gx2, gy1], [gx1, gy2], [gx2, gy2]];
      var gLen = Math.max(6, minDim * 0.012);
      tCtx.globalAlpha = 0.65 * op;
      tCtx.lineWidth = Math.max(0.8, strokeW);
      gPoints.forEach(function (pt) {
        tCtx.beginPath();
        tCtx.moveTo(pt[0] - gLen, pt[1]); tCtx.lineTo(pt[0] + gLen, pt[1]);
        tCtx.moveTo(pt[0], pt[1] - gLen); tCtx.lineTo(pt[0], pt[1] + gLen);
        tCtx.stroke();
      });
    } else if (guideMode === 'cross') {
      tCtx.setLineDash([]);
      tCtx.globalAlpha = 0.25 * op;
      tCtx.beginPath();
      tCtx.moveTo(frameMarginX, cy); tCtx.lineTo(frameMarginX + frameW, cy);
      tCtx.moveTo(cx, frameMarginY); tCtx.lineTo(cx, frameMarginY + frameH);
      tCtx.stroke();

      var tickCount = 10;
      var tSub = Math.max(3, minDim * 0.005);
      tCtx.globalAlpha = 0.4 * op;
      for (var t = 1; t < tickCount; t++) {
        var tx = frameMarginX + (frameW * t) / tickCount;
        var ty = frameMarginY + (frameH * t) / tickCount;
        tCtx.beginPath();
        tCtx.moveTo(tx, cy - tSub); tCtx.lineTo(tx, cy + tSub);
        tCtx.moveTo(cx - tSub, ty); tCtx.lineTo(cx + tSub, ty);
        tCtx.stroke();
      }
    } else if (guideMode === 'grid') {
      var divs = 6;
      tCtx.globalAlpha = 0.15 * op;
      tCtx.beginPath();
      for (var d = 1; d < divs; d++) {
        var dx = frameMarginX + (frameW * d) / divs;
        var dy = frameMarginY + (frameH * d) / divs;
        tCtx.moveTo(dx, frameMarginY); tCtx.lineTo(dx, frameMarginY + frameH);
        tCtx.moveTo(frameMarginX, dy); tCtx.lineTo(frameMarginX + frameW, dy);
      }
      tCtx.stroke();
      tCtx.setLineDash([]);
    }
    tCtx.setLineDash([]);

    // 3. Corner Crop Brackets
    if (state.studioBrackets) {
      var brLen = Math.max(18, minDim * 0.04);
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(1.2, strokeW * 1.6);
      tCtx.globalAlpha = 0.85 * op;

      // Top-Left
      tCtx.beginPath();
      tCtx.moveTo(frameMarginX, frameMarginY + brLen);
      tCtx.lineTo(frameMarginX, frameMarginY);
      tCtx.lineTo(frameMarginX + brLen, frameMarginY);
      tCtx.stroke();

      // Top-Right
      tCtx.beginPath();
      tCtx.moveTo(frameMarginX + frameW - brLen, frameMarginY);
      tCtx.lineTo(frameMarginX + frameW, frameMarginY);
      tCtx.lineTo(frameMarginX + frameW, frameMarginY + brLen);
      tCtx.stroke();

      // Bottom-Left
      tCtx.beginPath();
      tCtx.moveTo(frameMarginX, frameMarginY + frameH - brLen);
      tCtx.lineTo(frameMarginX, frameMarginY + frameH);
      tCtx.lineTo(frameMarginX + brLen, frameMarginY + frameH);
      tCtx.stroke();

      // Bottom-Right
      tCtx.beginPath();
      tCtx.moveTo(frameMarginX + frameW - brLen, frameMarginY + frameH);
      tCtx.lineTo(frameMarginX + frameW, frameMarginY + frameH);
      tCtx.lineTo(frameMarginX + frameW, frameMarginY + frameH - brLen);
      tCtx.stroke();
    }

    // 4. Center Reticle
    var reticleMode = state.studioReticleMode || 'circle';
    if (reticleMode === 'circle') {
      var rR = Math.max(16, minDim * 0.035);
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(0.8, strokeW);
      tCtx.globalAlpha = 0.65 * op;
      tCtx.beginPath();
      tCtx.arc(cx, cy, rR, 0, Math.PI * 2);
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.moveTo(cx - rR - 6, cy); tCtx.lineTo(cx - rR, cy);
      tCtx.moveTo(cx + rR, cy); tCtx.lineTo(cx + rR + 6, cy);
      tCtx.moveTo(cx, cy - rR - 6); tCtx.lineTo(cx, cy - rR);
      tCtx.moveTo(cx, cy + rR); tCtx.lineTo(cx, cy + rR + 6);
      tCtx.stroke();

      tCtx.fillStyle = strokeColor;
      tCtx.beginPath();
      tCtx.arc(cx, cy, 1.8, 0, Math.PI * 2);
      tCtx.fill();
    } else if (reticleMode === 'cross') {
      var cLen = Math.max(14, minDim * 0.03);
      var cGap = Math.max(4, minDim * 0.008);
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(0.8, strokeW);
      tCtx.globalAlpha = 0.7 * op;
      tCtx.beginPath();
      tCtx.moveTo(cx - cLen, cy); tCtx.lineTo(cx - cGap, cy);
      tCtx.moveTo(cx + cGap, cy); tCtx.lineTo(cx + cLen, cy);
      tCtx.moveTo(cx, cy - cLen); tCtx.lineTo(cx, cy - cGap);
      tCtx.moveTo(cx, cy + cGap); tCtx.lineTo(cx, cy + cLen);
      tCtx.stroke();
    } else if (reticleMode === 'dot') {
      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = 0.85 * op;
      tCtx.beginPath();
      tCtx.arc(cx, cy, Math.max(2.5, minDim * 0.004), 0, Math.PI * 2);
      tCtx.fill();
    }

    // 5. Camera Telemetry OSD
    if (state.studioTelemetry) {
      tCtx.fillStyle = strokeColor;
      tCtx.font = 'bold ' + Math.max(7.5, minDim * 0.0085) + 'px "JetBrains Mono", monospace';
      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'bottom';
      tCtx.globalAlpha = 0.85 * op;

      var redDotR = Math.max(3, minDim * 0.004);
      tCtx.fillStyle = '#ef4444';
      tCtx.beginPath();
      tCtx.arc(frameMarginX + 8 + redDotR, frameMarginY - 14, redDotR, 0, Math.PI * 2);
      tCtx.fill();

      tCtx.fillStyle = strokeColor;
      tCtx.fillText('REC [4K RAW 24.00 FPS]', frameMarginX + 14 + redDotR * 2, frameMarginY - 8);

      tCtx.textAlign = 'right';
      tCtx.fillText('BAT 98% [■■■■]  00:14:32:18', frameMarginX + frameW - 8, frameMarginY - 8);

      tCtx.textBaseline = 'top';
      tCtx.textAlign = 'left';
      tCtx.fillText('ISO 400   1/250s   f/2.8   50mm', frameMarginX + 8, frameMarginY + frameH + 8);

      tCtx.textAlign = 'right';
      tCtx.fillText('AF-C [LOCK]   5600K   TC 23:59:12', frameMarginX + frameW - 8, frameMarginY + frameH + 8);

      var evW = Math.min(160, frameW * 0.3);
      var evY = frameMarginY + frameH - 14;
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = 0.6;
      tCtx.globalAlpha = 0.4 * op;
      tCtx.beginPath();
      tCtx.moveTo(cx - evW / 2, evY);
      tCtx.lineTo(cx + evW / 2, evY);
      tCtx.stroke();

      tCtx.font = Math.max(6.5, minDim * 0.0065) + 'px "JetBrains Mono", monospace';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.globalAlpha = 0.6 * op;
      tCtx.fillText('-2     -1      0     +1     +2', cx, evY - 8);
      tCtx.beginPath();
      tCtx.moveTo(cx, evY - 4);
      tCtx.lineTo(cx, evY + 4);
      tCtx.stroke();
    }

    tCtx.restore();
  }

  // Render Pipeline
  function drawCanvas(tCtx, tW, tH, options) {
    options = options || {};
    var overlayOnly = !!options.overlayOnly;
    var palette = state.palette;
    var strokeColor = palette.stroke;
    var op = parseFloat(overlayOpacitySlider.value);
    if (isNaN(op)) op = 1;

    // 1. Background Fill
    if (!overlayOnly) {
      tCtx.fillStyle = palette.bg;
      tCtx.fillRect(0, 0, tW, tH);
    } else {
      tCtx.clearRect(0, 0, tW, tH);
    }

    // 2. Background Image
    if (state.image && !overlayOnly) {
      var img = state.image;
      var imgRatio = img.width / img.height;
      var targetRatio = tW / tH;
      var sx, sy, sw, sh;

      if (imgRatio > targetRatio) {
        sh = img.height;
        sw = sh * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      var imgOp = parseFloat(imageOpacitySlider.value);
      tCtx.globalAlpha = isNaN(imgOp) ? 0.75 : imgOp;
      if (state.gradientMapOn) {
        var mappedCanvas = getGradientMappedCanvas(img, tW, tH, sx, sy, sw, sh);
        tCtx.drawImage(mappedCanvas, 0, 0, tW, tH);
      } else {
        tCtx.drawImage(img, sx, sy, sw, sh, 0, 0, tW, tH);
      }
      tCtx.globalAlpha = 1;
    }

    // 3. Pixelation Zones
    if (!overlayOnly && state.pixelZones && state.pixelZones.length > 0 && parseInt(pixelSizeSlider.value, 10) > 1) {
      var pSize = parseInt(pixelSizeSlider.value, 10) || 16;
      var pRadius = parseInt(zoneSizeSlider.value, 10) || 90;
      var scratch = getPixelScratch();

      state.pixelZones.forEach(function (zone) {
        var zx = zone.x;
        var zy = zone.y;
        var minX = Math.max(0, Math.floor(zx - pRadius));
        var minY = Math.max(0, Math.floor(zy - pRadius));
        var zWidth = Math.min(tW, Math.ceil(zx + pRadius)) - minX;
        var zHeight = Math.min(tH, Math.ceil(zy + pRadius)) - minY;

        if (zWidth > 0 && zHeight > 0) {
          var smallW = Math.max(1, Math.round(zWidth / pSize));
          var smallH = Math.max(1, Math.round(zHeight / pSize));
          scratch.canvas.width = smallW;
          scratch.canvas.height = smallH;
          scratch.ctx.imageSmoothingEnabled = true;
          scratch.ctx.drawImage(tCtx.canvas, minX, minY, zWidth, zHeight, 0, 0, smallW, smallH);

          tCtx.save();
          tCtx.beginPath();
          tCtx.rect(minX, minY, zWidth, zHeight);
          tCtx.clip();
          tCtx.imageSmoothingEnabled = false;
          tCtx.drawImage(scratch.canvas, 0, 0, smallW, smallH, minX, minY, zWidth, zHeight);
          tCtx.restore();

          if (state.pixelStroke) {
            tCtx.globalAlpha = 0.4;
            tCtx.strokeStyle = strokeColor;
            tCtx.lineWidth = 1;
            tCtx.strokeRect(minX, minY, zWidth, zHeight);
            tCtx.globalAlpha = 1;
          }

          var lblSz = parseInt(labelSizeSlider.value, 10) || 8;
          tCtx.globalAlpha = op;
          tCtx.fillStyle = strokeColor;
          tCtx.font = lblSz + 'px Telegraf, system-ui, sans-serif';
          tCtx.textAlign = 'center';
          tCtx.textBaseline = 'middle';
          tCtx.fillText(Math.round(zx) + ',' + Math.round(zy), minX + zWidth / 2, minY + zHeight / 2);
          tCtx.globalAlpha = 1;
        }
      });
    } else if (overlayOnly && state.pixelZones && state.pixelZones.length > 0 && state.pixelStroke) {
      var pRadiusZone = parseInt(zoneSizeSlider.value, 10) || 90;
      var lblSzZone = parseInt(labelSizeSlider.value, 10) || 8;
      state.pixelZones.forEach(function (zone) {
        var zx = zone.x;
        var zy = zone.y;
        var minX = Math.max(0, Math.floor(zx - pRadiusZone));
        var minY = Math.max(0, Math.floor(zy - pRadiusZone));
        var zWidth = Math.min(tW, Math.ceil(zx + pRadiusZone)) - minX;
        var zHeight = Math.min(tH, Math.ceil(zy + pRadiusZone)) - minY;
        if (zWidth > 0 && zHeight > 0) {
          tCtx.save();
          tCtx.globalAlpha = 0.6 * op;
          tCtx.strokeStyle = strokeColor;
          tCtx.lineWidth = 1;
          tCtx.setLineDash([4, 4]);
          tCtx.strokeRect(minX, minY, zWidth, zHeight);
          tCtx.setLineDash([]);
          if (lblSzZone > 0) {
            tCtx.globalAlpha = op;
            tCtx.fillStyle = strokeColor;
            tCtx.font = lblSzZone + 'px Telegraf, system-ui, sans-serif';
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            tCtx.fillText(Math.round(zx) + ',' + Math.round(zy), minX + zWidth / 2, minY + zHeight / 2);
          }
          tCtx.restore();
        }
      });
    }

    // 4. Crosshair Frame (for Sensor mode)
    if (state.frameOn && state.mode === 'circles') {
      var cx = tW / 2;
      var cy = tH / 2;
      var fWidthPct = parseFloat(frameWidthSlider ? frameWidthSlider.value : 60) || 60;
      var fHeightPct = parseFloat(frameHeightSlider ? frameHeightSlider.value : 60) || 60;
      var frameBoxW = tW * (fWidthPct / 100);
      var frameBoxH = tH * (fHeightPct / 100);
      var dash = parseFloat(dashPatternSlider.value) || 8;
      var fStroke = parseFloat(frameStrokeSlider.value) || 1.0;

      tCtx.save();
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = fStroke;
      tCtx.setLineDash([dash, dash]);
      tCtx.globalAlpha = op;

      tCtx.beginPath();
      tCtx.moveTo(0, cy);
      tCtx.lineTo(tW, cy);
      tCtx.moveTo(cx, 0);
      tCtx.lineTo(cx, tH);
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.rect(cx - frameBoxW / 2, cy - frameBoxH / 2, frameBoxW, frameBoxH);
      tCtx.stroke();
      tCtx.setLineDash([]);

      var sRadius = (parseFloat(starSizeSlider.value) || 40) / 2;
      var sPoints = parseInt(starPointsSlider.value, 10) || 4;
      if (sRadius > 0) {
        tCtx.beginPath();
        for (var pIdx = 0; pIdx < sPoints; pIdx++) {
          var ang = (pIdx / sPoints) * Math.PI;
          var sxDist = Math.cos(ang) * sRadius;
          var syDist = Math.sin(ang) * sRadius;
          tCtx.moveTo(cx - sxDist, cy - syDist);
          tCtx.lineTo(cx + sxDist, cy + syDist);
        }
        tCtx.stroke();
      }
      tCtx.restore();
    }

    // 5. Chain Circles & Intersections (exclusive to Sensor mode)
    if (state.mode === 'circles' && state.chainOn && state.chainCircles && state.chainCircles.length > 0) {
      var minDim = Math.min(tW, tH);
      var cStroke = parseFloat(shapeStrokeSlider.value) || 1.0;
      var lblSize = parseInt(labelSizeSlider.value, 10) || 8;

      state.chainCircles.forEach(function (circ) {
        tCtx.globalAlpha = 0.5 * op;
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = cStroke;
        tCtx.beginPath();
        tCtx.arc(circ.x, circ.y, circ.r, 0, Math.PI * 2);
        tCtx.stroke();

        var crossLen = Math.max(8, circ.r * 0.3);
        tCtx.globalAlpha = 0.3 * op;
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = Math.max(0.5, minDim * 0.0006);
        tCtx.setLineDash([minDim * 0.004, minDim * 0.004]);
        tCtx.beginPath();
        tCtx.moveTo(circ.x - crossLen, circ.y);
        tCtx.lineTo(circ.x + crossLen, circ.y);
        tCtx.moveTo(circ.x, circ.y - crossLen);
        tCtx.lineTo(circ.x + crossLen, circ.y);
        tCtx.stroke();
        tCtx.setLineDash([]);

        tCtx.globalAlpha = 0.6 * op;
        tCtx.fillStyle = strokeColor;
        tCtx.beginPath();
        tCtx.arc(circ.x, circ.y, Math.max(1.5, minDim * 0.002), 0, Math.PI * 2);
        tCtx.fill();

        if (lblSize > 0) {
          tCtx.globalAlpha = op;
          tCtx.fillStyle = strokeColor;
          tCtx.font = lblSize + 'px Telegraf, system-ui, sans-serif';
          tCtx.textAlign = 'left';
          tCtx.textBaseline = 'middle';
          tCtx.fillText(Math.round(circ.x) + ',' + Math.round(circ.y), circ.x + crossLen + lblSize * 0.4, circ.y);
        }
      });

      if (state.chainIntersections) {
        var mSize = parseFloat(markerSizeSlider ? markerSizeSlider.value : 3.0) || 3.0;
        var pNum = 1;
        for (var cIdx = 0; cIdx < state.chainCircles.length - 1; cIdx++) {
          var pts = circleIntersections(state.chainCircles[cIdx], state.chainCircles[cIdx + 1]);
          pts.forEach(function (pt) {
            tCtx.globalAlpha = op;
            tCtx.fillStyle = strokeColor;
            tCtx.beginPath();
            tCtx.arc(pt.x, pt.y, mSize, 0, Math.PI * 2);
            tCtx.fill();

            if (lblSize > 0) {
              tCtx.font = lblSize + 'px Telegraf, system-ui, sans-serif';
              tCtx.textAlign = 'left';
              tCtx.textBaseline = 'middle';
              tCtx.fillText(pNum + ' → ' + Math.round(pt.x) + ', ' + Math.round(pt.y), pt.x + mSize + lblSize * 0.5, pt.y);
              pNum++;
            }
          });
        }
      }
      tCtx.globalAlpha = 1;
      tCtx.setLineDash([]);
    }

    // 6 & 7. Generative Mode-Specific Rendering
    if (state.mode === 'hero') {
      drawHeroMode(tCtx, tW, tH, palette, op);
    } else if (state.mode === 'geo') {
      drawGeoMode(tCtx, tW, tH, palette, op);
    } else if (state.mode === 'studio') {
      drawStudioMode(tCtx, tW, tH, palette, op);
    } else {
      // Circles Mode: Connections and Detected Blobs
      if (state.connections && state.connections.length > 0) {
        var lWeight = parseFloat(lineWeightSlider.value) || 0.8;
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = lWeight;
        tCtx.lineCap = 'round';

        state.connections.forEach(function (conn) {
          var p1 = state.circles[conn.a];
          var p2 = state.circles[conn.b];
          tCtx.globalAlpha = op;
          tCtx.beginPath();
          tCtx.moveTo(p1.x, p1.y);
          tCtx.lineTo(p2.x, p2.y);
          tCtx.stroke();
        });
      }

      var shapeStroke = parseFloat(shapeStrokeSlider.value) || 1.0;
      var labelSize = parseInt(labelSizeSlider.value, 10) || 8;

      state.circles.forEach(function (circle) {
        tCtx.globalAlpha = (0.3 + 0.4 * circle.score) * op;
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = shapeStroke;

        tCtx.beginPath();
        if (state.shape === 'square') {
          tCtx.rect(circle.x - circle.r, circle.y - circle.r, circle.r * 2, circle.r * 2);
        } else {
          tCtx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        }
        tCtx.stroke();

        tCtx.globalAlpha = (0.7 + 0.3 * circle.score) * op;
        tCtx.fillStyle = strokeColor;
        tCtx.beginPath();
        tCtx.arc(circle.x, circle.y, 2.5, 0, Math.PI * 2);
        tCtx.fill();

        if (labelSize > 0) {
          tCtx.globalAlpha = op;
          tCtx.font = labelSize + 'px Telegraf, system-ui, sans-serif';
          tCtx.textAlign = 'left';
          tCtx.textBaseline = 'middle';
          tCtx.fillText(Math.round(circle.x) + ',' + Math.round(circle.y), circle.x + circle.r + labelSize * 0.4, circle.y);
        }
      });
    }

    // 8. Teks 4 Pojok Kustom
    if (state.frameTextOn) {
      var fTextSize = parseInt(frameTextSizeSlider.value, 10) || 12;
      tCtx.globalAlpha = op;
      tCtx.fillStyle = strokeColor;
      tCtx.font = fTextSize + 'px Telegraf, system-ui, sans-serif';

      if (state.frameTextTL) {
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'top';
        tCtx.fillText(state.frameTextTL, 40, 40);
      }

      if (state.frameTextTR) {
        tCtx.textAlign = 'right';
        tCtx.textBaseline = 'top';
        tCtx.fillText(state.frameTextTR, tW - 40, 40);
      }

      if (state.frameTextBL) {
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'bottom';
        tCtx.fillText(state.frameTextBL, 40, tH - 40);
      }

      if (state.frameTextBR) {
        tCtx.textAlign = 'right';
        tCtx.textBaseline = 'bottom';
        tCtx.fillText(state.frameTextBR, tW - 40, tH - 40);
      }
    }

    // 9. Texture / Noise
    if (!overlayOnly) {
      var texOp = parseFloat(textureOpacitySlider.value);
      if (!isNaN(texOp) && texOp > 0) {
        tCtx.save();
        tCtx.globalCompositeOperation = 'screen';
        tCtx.globalAlpha = texOp * 0.5;
        if (state.customTexture) {
          tCtx.drawImage(state.customTexture, 0, 0, tW, tH);
        } else if (state.noiseCanvas) {
          if (!state.noisePattern && tCtx === ctx) {
            state.noisePattern = ctx.createPattern(state.noiseCanvas, 'repeat');
          }
          var pat = (tCtx === ctx && state.noisePattern) ? state.noisePattern : tCtx.createPattern(state.noiseCanvas, 'repeat');
          tCtx.fillStyle = pat;
          tCtx.fillRect(0, 0, tW, tH);
        }
        tCtx.restore();
      }
    }

    tCtx.globalAlpha = 1;
  }

  function resizeAndRender() {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    canvas.width = fmt.w;
    canvas.height = fmt.h;

    var wrapRect = wrap.getBoundingClientRect();
    var pad = 40;
    var maxW = Math.max(200, wrapRect.width - pad);
    var maxH = Math.max(200, wrapRect.height - pad);
    var ratio = fmt.w / fmt.h;

    var dispW = maxW;
    var dispH = dispW / ratio;
    if (dispH > maxH) {
      dispH = maxH;
      dispW = dispH * ratio;
    }

    canvas.style.width = Math.round(dispW) + 'px';
    canvas.style.height = Math.round(dispH) + 'px';

    drawCanvas(ctx, fmt.w, fmt.h);
  }

  function render() {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    drawCanvas(ctx, fmt.w, fmt.h);
  }

  function syncValues() {
    if (frameTextSizeVal && frameTextSizeSlider) {
      frameTextSizeVal.textContent = frameTextSizeSlider.value;
    }
    imageOpacityVal.textContent = parseFloat(imageOpacitySlider.value).toFixed(2);
    pixelSizeVal.textContent = pixelSizeSlider.value;
    zoneSizeVal.textContent = zoneSizeSlider.value;
    if (frameWidthVal && frameWidthSlider) frameWidthVal.textContent = frameWidthSlider.value;
    if (frameHeightVal && frameHeightSlider) frameHeightVal.textContent = frameHeightSlider.value;
    dashPatternVal.textContent = dashPatternSlider.value;
    frameStrokeVal.textContent = parseFloat(frameStrokeSlider.value).toFixed(1);
    starSizeVal.textContent = starSizeSlider.value;
    starPointsVal.textContent = starPointsSlider.value;
    chainCountVal.textContent = chainCountSlider.value;
    chainAngleVal.textContent = chainAngleSlider.value;
    chainBaseRadiusVal.textContent = chainBaseRadiusSlider.value;
    chainSizeRatioVal.textContent = parseFloat(chainSizeRatioSlider.value).toFixed(2);
    if (markerSizeVal && markerSizeSlider) {
      markerSizeVal.textContent = parseFloat(markerSizeSlider.value).toFixed(1);
    }
    blockSizeVal.textContent = blockSizeSlider.value;
    thresholdVal.textContent = thresholdSlider.value;
    maxCirclesVal.textContent = maxCirclesSlider.value;
    minDistanceVal.textContent = minDistanceSlider.value;
    minRadiusVal.textContent = minRadiusSlider.value;
    maxRadiusVal.textContent = maxRadiusSlider.value;
    shapeStrokeVal.textContent = parseFloat(shapeStrokeSlider.value).toFixed(1);
    sizeSeedVal.textContent = sizeSeedSlider.value;
    labelSizeVal.textContent = labelSizeSlider.value;
    overlayOpacityVal.textContent = parseFloat(overlayOpacitySlider.value).toFixed(2);
    maxDistanceVal.textContent = maxDistanceSlider.value;
    lineWeightVal.textContent = parseFloat(lineWeightSlider.value).toFixed(1);
    textureOpacityVal.textContent = parseFloat(textureOpacitySlider.value).toFixed(2);
    pixelateStatus.textContent = state.pixelZones.length + ' zones placed';
    if (gradientMapOpacityVal && gradientMapOpacitySlider) {
      gradientMapOpacityVal.textContent = parseFloat(gradientMapOpacitySlider.value).toFixed(2);
    }

    // Mode-specific slider readouts
    if (telemetryGridVal && telemetryGridSlider) telemetryGridVal.textContent = telemetryGridSlider.value;
    if (telemetryNodesVal && telemetryNodesSlider) telemetryNodesVal.textContent = telemetryNodesSlider.value;
    if (telemetryStrokeVal && telemetryStrokeSlider) telemetryStrokeVal.textContent = parseFloat(telemetryStrokeSlider.value).toFixed(1);

    if (topoLevelsVal && topoLevelsSlider) topoLevelsVal.textContent = topoLevelsSlider.value;
    if (topoSmoothingVal && topoSmoothingSlider) topoSmoothingVal.textContent = topoSmoothingSlider.value;
    if (topoStrokeVal && topoStrokeSlider) topoStrokeVal.textContent = parseFloat(topoStrokeSlider.value).toFixed(1);
    if (topoPeakElevationVal && topoPeakElevationSlider) topoPeakElevationVal.textContent = topoPeakElevationSlider.value + 'm';

    if (studioFrameInsetVal && studioFrameInsetSlider) studioFrameInsetVal.textContent = studioFrameInsetSlider.value + '%';
    if (studioStrokeVal && studioStrokeSlider) studioStrokeVal.textContent = parseFloat(studioStrokeSlider.value).toFixed(1);
  }

  var rafPending = false;
  var scheduledRecalcLevel = 0; // 0: none, 1: render only, 2: placement/chain recalc, 3: full reanalyze

  function scheduleUpdate(level) {
    if (level > scheduledRecalcLevel) {
      scheduledRecalcLevel = level;
    }
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        var lvl = scheduledRecalcLevel;
        scheduledRecalcLevel = 0;
        if (lvl === 3) {
          recalculate(true);
        } else if (lvl === 2) {
          recalculate(false);
        }
        render();
      });
    }
  }

  function bindSlider(slider, recalcLevel) {
    if (!slider) return;
    slider.addEventListener('input', function () {
      syncValues();
      scheduleUpdate(recalcLevel);
    });
  }

  // 1. Level 3: Full Re-analysis of image blocks (only block size re-partitions image pixels)
  bindSlider(blockSizeSlider, 3);

  // 2. Level 2: Fast Circle Placement & Chain Geometry (uses cached analysis, runs in < 1ms)
  [thresholdSlider, maxCirclesSlider, minDistanceSlider, minRadiusSlider, maxRadiusSlider, sizeSeedSlider, maxDistanceSlider, chainCountSlider, chainAngleSlider, chainBaseRadiusSlider, chainSizeRatioSlider].forEach(function (s) {
    bindSlider(s, 2);
  });

  // 3. Level 1: Pure Visual Sliders (instant GPU canvas redraw, zero geometry math)
  [imageOpacitySlider, pixelSizeSlider, zoneSizeSlider, frameWidthSlider, frameHeightSlider, dashPatternSlider, frameStrokeSlider, starSizeSlider, starPointsSlider, shapeStrokeSlider, labelSizeSlider, overlayOpacitySlider, lineWeightSlider, textureOpacitySlider, telemetryGridSlider, telemetryNodesSlider, telemetryStrokeSlider, topoLevelsSlider, topoStrokeSlider, topoPeakElevationSlider, studioFrameInsetSlider, studioStrokeSlider].forEach(function (s) {
    bindSlider(s, 1);
  });
  if (markerSizeSlider) {
    bindSlider(markerSizeSlider, 1);
  }
  if (frameTextSizeSlider) {
    bindSlider(frameTextSizeSlider, 1);
  }
  if (topoSmoothingSlider) {
    topoSmoothingSlider.addEventListener('input', function () {
      topoCache.smoothing = -1;
      syncValues();
      scheduleUpdate(1);
    });
  }

  // Toggles
  pixelateStrokeBtn.addEventListener('click', function () {
    state.pixelStroke = !state.pixelStroke;
    pixelateStrokeBtn.classList.toggle('active', state.pixelStroke);
    pixelateStrokeBtn.textContent = state.pixelStroke ? 'Stroke On' : 'Stroke Off';
    scheduleUpdate(1);
  });

  undoPixelateBtn.addEventListener('click', function () {
    if (state.pixelZones.length > 0) {
      state.pixelZones.pop();
      syncValues();
      scheduleUpdate(1);
    }
  });

  clearPixelateBtn.addEventListener('click', function () {
    state.pixelZones = [];
    syncValues();
    scheduleUpdate(1);
  });

  frameToggleBtn.addEventListener('click', function () {
    state.frameOn = !state.frameOn;
    frameToggleBtn.classList.toggle('active', state.frameOn);
    frameToggleBtn.textContent = state.frameOn ? 'Frame On' : 'Frame Off';
    scheduleUpdate(1);
  });

  if (frameTextToggleBtn) {
    frameTextToggleBtn.addEventListener('click', function () {
      state.frameTextOn = !state.frameTextOn;
      frameTextToggleBtn.classList.toggle('active', state.frameTextOn);
      frameTextToggleBtn.textContent = state.frameTextOn ? 'Frame Text On' : 'Frame Text Off';
      scheduleUpdate(1);
    });
  }

  [frameTextTLInput, frameTextTRInput, frameTextBLInput, frameTextBRInput].forEach(function (inp) {
    if (inp) {
      inp.addEventListener('input', function () {
        state.frameTextTL = frameTextTLInput.value;
        state.frameTextTR = frameTextTRInput.value;
        state.frameTextBL = frameTextBLInput.value;
        state.frameTextBR = frameTextBRInput.value;
        scheduleUpdate(1);
      });
    }
  });

  chainToggleBtn.addEventListener('click', function () {
    state.chainOn = !state.chainOn;
    chainToggleBtn.classList.toggle('active', state.chainOn);
    chainToggleBtn.textContent = state.chainOn ? 'Chain On' : 'Chain Off';
    scheduleUpdate(1);
  });

  chainIntersectionsBtn.addEventListener('click', function () {
    state.chainIntersections = !state.chainIntersections;
    chainIntersectionsBtn.classList.toggle('active', state.chainIntersections);
    chainIntersectionsBtn.textContent = state.chainIntersections ? 'Intersections On' : 'Intersections Off';
    scheduleUpdate(1);
  });

  // Telemetry HUD Toggles
  if (telemetryRadarBtn) {
    telemetryRadarBtn.addEventListener('click', function () {
      state.telemetryRadar = !state.telemetryRadar;
      telemetryRadarBtn.classList.toggle('active', state.telemetryRadar);
      telemetryRadarBtn.textContent = state.telemetryRadar ? 'Radar Dial On' : 'Radar Dial Off';
      scheduleUpdate(1);
    });
  }
  if (telemetryBracketsBtn) {
    telemetryBracketsBtn.addEventListener('click', function () {
      state.telemetryBrackets = !state.telemetryBrackets;
      telemetryBracketsBtn.classList.toggle('active', state.telemetryBrackets);
      telemetryBracketsBtn.textContent = state.telemetryBrackets ? 'Target Brackets On' : 'Target Brackets Off';
      scheduleUpdate(1);
    });
  }
  if (telemetryDataBtn) {
    telemetryDataBtn.addEventListener('click', function () {
      state.telemetryData = !state.telemetryData;
      telemetryDataBtn.classList.toggle('active', state.telemetryData);
      telemetryDataBtn.textContent = state.telemetryData ? 'Telemetry Data On' : 'Telemetry Data Off';
      scheduleUpdate(1);
    });
  }

  // Topography Map Toggles
  if (topoLabelsBtn) {
    topoLabelsBtn.addEventListener('click', function () {
      state.topoLabels = !state.topoLabels;
      topoLabelsBtn.classList.toggle('active', state.topoLabels);
      topoLabelsBtn.textContent = state.topoLabels ? 'Elevation Labels On' : 'Elevation Labels Off';
      scheduleUpdate(1);
    });
  }
  if (topoPeaksBtn) {
    topoPeaksBtn.addEventListener('click', function () {
      state.topoPeaks = !state.topoPeaks;
      topoPeaksBtn.classList.toggle('active', state.topoPeaks);
      topoPeaksBtn.textContent = state.topoPeaks ? 'Summit Peaks On' : 'Summit Peaks Off';
      scheduleUpdate(1);
    });
  }
  if (topoNeatlineBtn) {
    topoNeatlineBtn.addEventListener('click', function () {
      state.topoNeatline = !state.topoNeatline;
      topoNeatlineBtn.classList.toggle('active', state.topoNeatline);
      topoNeatlineBtn.textContent = state.topoNeatline ? 'Geodetic Neatline On' : 'Geodetic Neatline Off';
      scheduleUpdate(1);
    });
  }
  if (topoLegendBtn) {
    topoLegendBtn.addEventListener('click', function () {
      state.topoLegend = !state.topoLegend;
      topoLegendBtn.classList.toggle('active', state.topoLegend);
      topoLegendBtn.textContent = state.topoLegend ? 'Survey Legend On' : 'Survey Legend Off';
      scheduleUpdate(1);
    });
  }

  // Viewfinder / Studio Controls
  if (studioBracketsBtn) {
    studioBracketsBtn.addEventListener('click', function () {
      state.studioBrackets = !state.studioBrackets;
      studioBracketsBtn.classList.toggle('active', state.studioBrackets);
      studioBracketsBtn.textContent = state.studioBrackets ? 'Crop Brackets On' : 'Crop Brackets Off';
      scheduleUpdate(1);
    });
  }
  if (studioTelemetryBtn) {
    studioTelemetryBtn.addEventListener('click', function () {
      state.studioTelemetry = !state.studioTelemetry;
      studioTelemetryBtn.classList.toggle('active', state.studioTelemetry);
      studioTelemetryBtn.textContent = state.studioTelemetry ? 'Camera Telemetry On' : 'Camera Telemetry Off';
      scheduleUpdate(1);
    });
  }
  document.querySelectorAll('[data-guide-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-guide-mode]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.studioGuideMode = btn.dataset.guideMode;
      scheduleUpdate(1);
    });
  });
  document.querySelectorAll('[data-reticle-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-reticle-mode]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.studioReticleMode = btn.dataset.reticleMode;
      scheduleUpdate(1);
    });
  });

  // Canvas Click to add Pixelation Zone or open image picker
  canvas.addEventListener('click', function (e) {
    if (!state.image) {
      imageInput.click();
      return;
    }
    var rect = canvas.getBoundingClientRect();
    var clickX = (e.clientX - rect.left) / rect.width * canvas.width;
    var clickY = (e.clientY - rect.top) / rect.height * canvas.height;

    state.pixelZones.push({
      x: clickX,
      y: clickY
    });

    syncValues();
    scheduleUpdate(1);
  });

  // Segmented Buttons: Detection Mode (Combined, Contrast, Bright, Dark)
  document.querySelectorAll('[data-detection-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-detection-mode]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.detectionMode = btn.dataset.detectionMode;
      scheduleUpdate(3);
    });
  });

  // Segmented Buttons: Shapes (Circle vs Square)
  document.querySelectorAll('[data-shape]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-shape]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.shape = btn.dataset.shape;
      scheduleUpdate(1);
    });
  });

  // Collapsible Sections
  document.querySelectorAll('.panel-header').forEach(function (hdr) {
    hdr.addEventListener('click', function () {
      var p = hdr.closest('.panel');
      if (p) p.classList.toggle('collapsed');
    });
  });

  // Palette Grid Selection
  paletteGrid.addEventListener('click', function (e) {
    var swatch = e.target.closest('.palette-swatch');
    if (!swatch) return;
    document.querySelectorAll('.palette-swatch').forEach(function (s) { s.classList.remove('active'); });
    swatch.classList.add('active');
    state.palette = {
      bg: swatch.dataset.bg,
      color: swatch.dataset.color,
      stroke: swatch.dataset.color,
      name: swatch.title
    };
    updateStatusFooter();
    scheduleUpdate(1);
  });

  // Canvas Format Selection
  function syncSizeInputsFromFormat() {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    if (customWidthInput) customWidthInput.value = fmt.w;
    if (customHeightInput) customHeightInput.value = fmt.h;
  }

  canvasSizeSelect.addEventListener('change', function () {
    state.format = canvasSizeSelect.value;
    if (state.format !== 'custom') {
      var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
      FORMATS.custom.w = fmt.w;
      FORMATS.custom.h = fmt.h;
    }
    syncSizeInputsFromFormat();
    updateStatusFooter();
    recalculate(true);
    resizeAndRender();
  });

  function handleCustomDimensionChange() {
    var w = parseInt(customWidthInput.value, 10);
    var h = parseInt(customHeightInput.value, 10);
    if (!w || isNaN(w)) w = 1200;
    if (!h || isNaN(h)) h = 1600;
    w = Math.max(400, Math.min(4000, w));
    h = Math.max(400, Math.min(4000, h));

    FORMATS.custom.w = w;
    FORMATS.custom.h = h;
    FORMATS.custom.label = w + 'x' + h;

    state.format = 'custom';
    canvasSizeSelect.value = 'custom';

    updateStatusFooter();
    recalculate(true);
    resizeAndRender();
  }

  if (customWidthInput) {
    customWidthInput.addEventListener('change', handleCustomDimensionChange);
  }
  if (customHeightInput) {
    customHeightInput.addEventListener('change', handleCustomDimensionChange);
  }

  // Dynamic Sidebar Panels + Rail Filter
  function updateDynamicSidebarPanels(currentMode) {
    // 1. Show/hide sidebar panels
    var panels = document.querySelectorAll('.sidebar .panel');
    panels.forEach(function (panel) {
      var modes = (panel.dataset.modes || 'all').split(' ');
      if (modes.indexOf('all') !== -1 || modes.indexOf(currentMode) !== -1) {
        panel.style.display = '';
      } else {
        panel.style.display = 'none';
      }
    });

    // 2. Show/hide rail buttons by their data-modes
    var enginePanelMap = {
      circles: 'crosshair',
      hero: 'telemetry',
      geo: 'topography',
      studio: 'viewfinder'
    };
    document.querySelectorAll('.rail-btn').forEach(function (btn) {
      var modes = (btn.dataset.modes || 'all').split(' ');
      var visible = modes.indexOf('all') !== -1 || modes.indexOf(currentMode) !== -1;
      btn.style.display = visible ? '' : 'none';

      // Swap Engine button target to the mode-specific section
      if (btn.dataset.engine === 'true') {
        btn.dataset.panel = enginePanelMap[currentMode] || 'crosshair';
      }
    });
  }

  // Topbar Mode Tabs (Sensor, Telemetry, Topography, Viewfinder)
  document.querySelectorAll('.mode-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.mode-tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.mode = tab.dataset.mode;
      updateDynamicSidebarPanels(state.mode);
      // Reflect active mode in engine rail button
      updateRailModeHighlight(state.mode);
      scheduleUpdate(1);
    });
  });

  // Icon Rail: toggle panel drawer
  var panelDrawer = document.getElementById('panelDrawer');
  var activeRailPanel = 'image';
  document.querySelectorAll('.rail-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.panel;
      if (activeRailPanel === target && panelDrawer.classList.contains('open')) {
        // Clicking active icon collapses drawer
        panelDrawer.classList.remove('open');
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        activeRailPanel = null;
      } else {
        // Open drawer and scroll to target section
        document.querySelectorAll('.rail-btn').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeRailPanel = target;
        panelDrawer.classList.add('open');
        // Scroll the sidebar to the target section
        var targetSection = panelDrawer.querySelector('[data-section="' + target + '"]');
        if (targetSection) {
          setTimeout(function () { targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        }
      }
    });
  });

  function updateRailModeHighlight(mode) {
    // No rail button directly maps to mode; engine button can optionally highlight
  }


  // Image Loading
  function applyLoadedImage(img) {
    state.image = img;
    emptyState.classList.add('hidden');
    canvas.classList.add('visible');
    recalculate(true);
    resizeAndRender();
  }

  function isImageFile(file) {
    if (!file) return false;
    if (file.type && file.type.startsWith('image/')) return true;
    var name = file.name || '';
    return /\.(png|jpe?g|webp|avif|bmp|gif|tiff|svg)$/i.test(name);
  }

  function loadFile(file) {
    if (!isImageFile(file)) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        applyLoadedImage(img);
      };
      img.onerror = function (err) {
        console.error('Image load error:', err);
      };
      img.src = ev.target.result;
    };
    reader.onerror = function (err) {
      console.error('FileReader error:', err);
    };
    reader.readAsDataURL(file);
  }

  replaceImageBtn.addEventListener('click', function () {
    imageInput.click();
  });

  imageInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) {
      loadFile(file);
      imageInput.value = '';
    }
  });

  // Drag and Drop & Paste
  wrap.addEventListener('dragover', function (e) {
    e.preventDefault();
    wrap.classList.add('drag-over');
  });
  wrap.addEventListener('dragleave', function (e) {
    e.preventDefault();
    wrap.classList.remove('drag-over');
  });
  wrap.addEventListener('drop', function (e) {
    e.preventDefault();
    wrap.classList.remove('drag-over');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) loadFile(files[0]);
  });
  emptyState.addEventListener('click', function () {
    imageInput.click();
  });

  window.addEventListener('paste', function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf('image') !== -1) {
        var blob = items[i].getAsFile();
        if (blob) {
          loadFile(blob);
          break;
        }
      }
    }
  });

  // Texture Buttons
  replaceTextureBtn.addEventListener('click', function () {
    textureInput.click();
  });
  textureInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file && isImageFile(file)) {
      var r = new FileReader();
      r.onload = function (ev) {
        var tImg = new Image();
        tImg.onload = function () {
          state.customTexture = tImg;
          scheduleUpdate(1);
        };
        tImg.src = ev.target.result;
      };
      r.readAsDataURL(file);
      textureInput.value = '';
    }
  });
  removeTextureBtn.addEventListener('click', function () {
    state.customTexture = null;
    textureOpacitySlider.value = 0;
    syncValues();
    scheduleUpdate(1);
  });

  // Download High-Resolution PNG
  downloadBtn.addEventListener('click', function () {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    var exportCanvas = document.createElement('canvas');
    exportCanvas.width = fmt.w;
    exportCanvas.height = fmt.h;
    var expCtx = exportCanvas.getContext('2d');
    drawCanvas(expCtx, fmt.w, fmt.h);

    var link = document.createElement('a');
    link.download = 'tracker-' + state.format + '-' + Date.now() + '.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  // Download Transparent Overlay Only PNG
  if (downloadOverlayBtn) {
    downloadOverlayBtn.addEventListener('click', function () {
      var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
      var exportCanvas = document.createElement('canvas');
      exportCanvas.width = fmt.w;
      exportCanvas.height = fmt.h;
      var expCtx = exportCanvas.getContext('2d');
      drawCanvas(expCtx, fmt.w, fmt.h, { overlayOnly: true });

      var link = document.createElement('a');
      link.download = 'tracker-overlay-' + state.format + '-' + Date.now() + '.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    });
  }

  // Randomize Style & Settings Engine
  function randomizeStyleAndSettings() {
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function randFloat(min, max, decimals) {
      var f = Math.random() * (max - min) + min;
      return parseFloat(f.toFixed(decimals !== undefined ? decimals : 1));
    }
    function updateToggle(btn, isActive, onText, offText) {
      if (!btn) return;
      btn.classList.toggle('active', isActive);
      btn.textContent = isActive ? onText : offText;
    }
    function updateSegmented(attr, value) {
      document.querySelectorAll('[' + attr + ']').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute(attr) === value);
      });
    }

    // 1. Random Style / Mode
    var modes = ['circles', 'hero', 'geo', 'studio'];
    var chosenMode = pick(modes);
    state.mode = chosenMode;
    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.mode === chosenMode);
      tab.setAttribute('aria-selected', tab.dataset.mode === chosenMode ? 'true' : 'false');
    });
    updateDynamicSidebarPanels(chosenMode);

    // 2. Random Palette
    var swatches = paletteGrid.querySelectorAll('.palette-swatch');
    if (swatches.length > 0) {
      var chosenSwatch = pick(Array.prototype.slice.call(swatches));
      swatches.forEach(function (s) { s.classList.remove('active'); });
      chosenSwatch.classList.add('active');
      state.palette = {
        bg: chosenSwatch.dataset.bg,
        color: chosenSwatch.dataset.color,
        stroke: chosenSwatch.dataset.color,
        name: chosenSwatch.title
      };
    }

    // 3. Random Global / Detection Parameters
    if (sizeSeedSlider) sizeSeedSlider.value = randInt(1, 9999);
    if (thresholdSlider) thresholdSlider.value = randInt(15, 65);
    if (blockSizeSlider) blockSizeSlider.value = randInt(6, 16);
    if (maxCirclesSlider) maxCirclesSlider.value = randInt(15, 60);
    if (minDistanceSlider) minDistanceSlider.value = randInt(15, 45);
    if (minRadiusSlider) minRadiusSlider.value = randInt(4, 12);
    if (maxRadiusSlider) maxRadiusSlider.value = randInt(25, 75);
    if (shapeStrokeSlider) shapeStrokeSlider.value = randFloat(0.8, 2.0, 1);
    if (overlayOpacitySlider) overlayOpacitySlider.value = randFloat(0.8, 1.0, 2);
    if (lineWeightSlider) lineWeightSlider.value = randFloat(0.5, 1.6, 1);
    if (maxDistanceSlider) maxDistanceSlider.value = randInt(90, 220);

    // 4. Detection Mode & Shape
    var detModes = ['combined', 'contrast', 'bright', 'dark'];
    state.detectionMode = pick(detModes);
    updateSegmented('data-detection-mode', state.detectionMode);

    var shapes = ['circle', 'square'];
    state.shape = pick(shapes);
    updateSegmented('data-shape', state.shape);

    // 5. Frame Marginalia
    state.frameTextOn = Math.random() > 0.15;
    updateToggle(frameTextToggleBtn, state.frameTextOn, 'Frame Text On', 'Frame Text Off');
    if (frameTextSizeSlider) frameTextSizeSlider.value = randInt(8, 12);

    // 6. Style-Specific Parameters
    if (chosenMode === 'circles') {
      state.frameOn = Math.random() > 0.2;
      updateToggle(frameToggleBtn, state.frameOn, 'Frame On', 'Frame Off');
      if (frameWidthSlider) frameWidthSlider.value = randInt(40, 80);
      if (frameHeightSlider) frameHeightSlider.value = randInt(40, 80);
      if (dashPatternSlider) dashPatternSlider.value = pick([4, 6, 8, 12]);
      if (frameStrokeSlider) frameStrokeSlider.value = randFloat(0.8, 2.0, 1);
      if (starSizeSlider) starSizeSlider.value = randInt(6, 16);
      if (starPointsSlider) starPointsSlider.value = pick([4, 6, 8]);

      state.chainOn = Math.random() > 0.3;
      updateToggle(chainToggleBtn, state.chainOn, 'Chain On', 'Chain Off');
      if (chainCountSlider) chainCountSlider.value = randInt(2, 6);
      if (chainAngleSlider) chainAngleSlider.value = randInt(0, 360);
      if (chainBaseRadiusSlider) chainBaseRadiusSlider.value = randInt(30, 80);
      if (chainSizeRatioSlider) chainSizeRatioSlider.value = randFloat(0.8, 1.4, 2);
      state.chainIntersections = Math.random() > 0.2;
      updateToggle(chainIntersectionsBtn, state.chainIntersections, 'Intersections On', 'Intersections Off');
      if (markerSizeSlider) markerSizeSlider.value = randInt(3, 8);
    } else if (chosenMode === 'hero') {
      if (telemetryGridSlider) telemetryGridSlider.value = randInt(4, 9);
      if (telemetryNodesSlider) telemetryNodesSlider.value = randInt(12, 40);
      if (telemetryStrokeSlider) telemetryStrokeSlider.value = randFloat(0.8, 2.0, 1);
      state.telemetryRadar = Math.random() > 0.2;
      updateToggle(telemetryRadarBtn, state.telemetryRadar, 'Radar Dial On', 'Radar Dial Off');
      state.telemetryBrackets = Math.random() > 0.2;
      updateToggle(telemetryBracketsBtn, state.telemetryBrackets, 'Target Brackets On', 'Target Brackets Off');
      state.telemetryData = Math.random() > 0.15;
      updateToggle(telemetryDataBtn, state.telemetryData, 'Telemetry Data On', 'Telemetry Data Off');
    } else if (chosenMode === 'geo') {
      if (topoLevelsSlider) topoLevelsSlider.value = randInt(10, 18);
      if (topoSmoothingSlider) topoSmoothingSlider.value = randInt(3, 7);
      if (topoStrokeSlider) topoStrokeSlider.value = randFloat(0.8, 2.0, 1);
      if (topoPeakElevationSlider) topoPeakElevationSlider.value = randInt(280, 520);
      state.topoLabels = Math.random() > 0.2;
      updateToggle(topoLabelsBtn, state.topoLabels, 'Elevation Labels On', 'Elevation Labels Off');
      state.topoPeaks = Math.random() > 0.2;
      updateToggle(topoPeaksBtn, state.topoPeaks, 'Summit Peaks On', 'Summit Peaks Off');
      state.topoNeatline = Math.random() > 0.2;
      updateToggle(topoNeatlineBtn, state.topoNeatline, 'Geodetic Neatline On', 'Geodetic Neatline Off');
      state.topoLegend = Math.random() > 0.2;
      updateToggle(topoLegendBtn, state.topoLegend, 'Survey Legend On', 'Survey Legend Off');
    } else if (chosenMode === 'studio') {
      if (studioFrameInsetSlider) studioFrameInsetSlider.value = randInt(20, 50);
      if (studioStrokeSlider) studioStrokeSlider.value = randFloat(0.8, 2.0, 1);
      state.studioBrackets = Math.random() > 0.15;
      updateToggle(studioBracketsBtn, state.studioBrackets, 'Crop Brackets On', 'Crop Brackets Off');
      state.studioTelemetry = Math.random() > 0.15;
      updateToggle(studioTelemetryBtn, state.studioTelemetry, 'Camera Telemetry On', 'Camera Telemetry Off');
      state.studioGuideMode = pick(['thirds', 'golden', 'diagonal', 'crosshair']);
      updateSegmented('data-guide-mode', state.studioGuideMode);
      state.studioReticleMode = pick(['brackets', 'cross', 'circle', 'grid']);
      updateSegmented('data-reticle-mode', state.studioReticleMode);
    }

    // 7. Gradient Map Preset Randomization
    if (gradientPresets.length > 0) {
      state.gradientMapIndex = randInt(0, gradientPresets.length - 1);
      updateGradientMapPreview();
    }

    syncValues();
    updateStatusFooter();
    recalculate(true);
    scheduleUpdate(3);
  }

  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', randomizeStyleAndSettings);
  }
  if (randomizeSettingsBtn) {
    randomizeSettingsBtn.addEventListener('click', randomizeStyleAndSettings);
  }

  // Gradient Map Event Listeners
  if (gradientMapToggleBtn) {
    gradientMapToggleBtn.addEventListener('click', function () {
      state.gradientMapOn = !state.gradientMapOn;
      gradientMapToggleBtn.classList.toggle('active', state.gradientMapOn);
      gradientMapToggleBtn.textContent = state.gradientMapOn ? 'Gradient Map On' : 'Gradient Map Off';
      scheduleUpdate(1);
    });
  }

  if (gradientMapSelect) {
    gradientMapSelect.addEventListener('change', function () {
      state.gradientMapIndex = parseInt(gradientMapSelect.value, 10) || 0;
      updateGradientMapPreview();
      scheduleUpdate(1);
    });
  }

  if (gradientMapOpacitySlider) {
    gradientMapOpacitySlider.addEventListener('input', function () {
      state.gradientMapOpacity = parseFloat(gradientMapOpacitySlider.value);
      syncValues();
      scheduleUpdate(1);
    });
  }

  if (gradientMapInvertBtn) {
    gradientMapInvertBtn.addEventListener('click', function () {
      state.gradientMapInvert = !state.gradientMapInvert;
      gradientMapInvertBtn.classList.toggle('active', state.gradientMapInvert);
      gradientMapInvertBtn.textContent = state.gradientMapInvert ? 'Invert On' : 'Invert Off';
      updateGradientMapPreview();
      scheduleUpdate(1);
    });
  }

  if (randomizeGradientBtn) {
    randomizeGradientBtn.addEventListener('click', function () {
      if (gradientPresets.length > 0) {
        state.gradientMapIndex = Math.floor(Math.random() * gradientPresets.length);
        updateGradientMapPreview();
        scheduleUpdate(1);
      }
    });
  }

  if (importGrdBtn && grdFileInput) {
    importGrdBtn.addEventListener('click', function () {
      grdFileInput.click();
    });

    grdFileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        try {
          var parsed = parseGrdBuffer(ev.target.result);
          if (parsed && parsed.length > 0) {
            gradientPresets = parsed;
            state.gradientMapIndex = 0;
            populateGradientMapControls();
            scheduleUpdate(1);
          }
        } catch (err) {
          console.error('Failed to parse GRD file:', err);
        }
      };
      reader.readAsArrayBuffer(file);
      grdFileInput.value = '';
    });
  }

  window.addEventListener('resize', function () {
    resizeAndRender();
  });

  populateGradientMapControls();
  syncValues();
  syncSizeInputsFromFormat();
  updateStatusFooter();
  updateDynamicSidebarPanels(state.mode);
  recalculate(true);
  resizeAndRender();
})();
