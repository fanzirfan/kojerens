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
  var exportStatusText = document.getElementById('exportStatusText');

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
  var frameSizeSlider = document.getElementById('frameSize');
  var frameSizeVal = document.getElementById('frameSizeVal');
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

  // Texture & Format Controls
  var textureOpacitySlider = document.getElementById('textureOpacity');
  var textureOpacityVal = document.getElementById('textureOpacityVal');
  var canvasSizeSelect = document.getElementById('canvasSizeSelect');
  var paletteGrid = document.getElementById('paletteGrid');

  var FORMATS = {
    portrait_3_4: { w: 1200, h: 1600, label: '1200x1600' },
    square: { w: 1080, h: 1080, label: '1080x1080' },
    landscape_16_9: { w: 1920, h: 1080, label: '1920x1080' },
    instagram_story: { w: 1080, h: 1920, label: '1080x1920' },
    poster: { w: 1400, h: 2000, label: '1400x2000' }
  };

  var state = {
    image: null,
    pixelZones: [],
    pixelStroke: true,
    frameOn: true,
    frameTextOn: true,
    frameTextTL: 'Design & Strategy',
    frameTextTR: 'Fanz Irfan',
    frameTextBL: 'www.fanzirfan.id',
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
    chainCircles: []
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
    var detailColor = palette.detail || '#555555';
    var minDim = Math.min(tW, tH);
    var margin = minDim * 0.08;
    var gridW = tW - margin * 2;
    var gridH = tH - margin * 2;
    var density = 24;
    var cellW = gridW / density;
    var cellH = gridH / density;

    tCtx.save();
    // 1. Technical Fluid Coordinate Grid
    tCtx.strokeStyle = detailColor;
    tCtx.lineWidth = Math.max(0.4, minDim * 0.0005);
    for (var i = 0; i <= density; i++) {
      tCtx.globalAlpha = (i === 0 || i === density) ? 0.25 * op : 0.07 * op;
      tCtx.beginPath();
      tCtx.moveTo(margin + i * cellW, margin);
      tCtx.lineTo(margin + i * cellW, margin + gridH);
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.moveTo(margin, margin + i * cellH);
      tCtx.lineTo(margin + gridW, margin + i * cellH);
      tCtx.stroke();
    }

    // 2. Origin Center Marker
    var ox = margin + gridW / 2;
    var oy = margin + gridH / 2;
    tCtx.globalAlpha = 0.8 * op;
    tCtx.fillStyle = strokeColor;
    tCtx.beginPath();
    tCtx.arc(ox, oy, Math.max(3, minDim * 0.004), 0, Math.PI * 2);
    tCtx.fill();

    tCtx.globalAlpha = 0.5 * op;
    tCtx.font = 'bold ' + Math.max(8, minDim * 0.01) + 'px "SF Mono", "Menlo", monospace';
    tCtx.textAlign = 'left';
    tCtx.textBaseline = 'bottom';
    tCtx.fillText('ORIGIN [0,0]', ox + minDim * 0.01, oy - minDim * 0.008);

    // 3. Generative Flow Vectors & Particles
    var seed = parseInt(sizeSeedSlider.value, 10) || 42;
    var prng = lcgPRNG(seed);
    var count = parseInt(maxCirclesSlider.value, 10) || 40;
    count = Math.min(60, Math.max(16, count));

    tCtx.lineCap = 'round';
    for (var pIdx = 0; pIdx < count; pIdx++) {
      var angle = prng() * Math.PI * 2;
      var dist = (0.15 + prng() * 0.75) * (minDim * 0.42);
      var px = ox + Math.cos(angle) * dist;
      var py = oy + Math.sin(angle) * dist;
      var isHeavy = pIdx % 4 === 0;

      // Connecting ray from origin
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = isHeavy ? 1.5 : 0.8;
      tCtx.globalAlpha = (isHeavy ? 0.6 : 0.25) * op;
      tCtx.beginPath();
      tCtx.moveTo(ox, oy);
      tCtx.lineTo(px, py);
      tCtx.stroke();

      // Node point
      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = (isHeavy ? 0.9 : 0.6) * op;
      tCtx.beginPath();
      tCtx.arc(px, py, isHeavy ? Math.max(4, minDim * 0.006) : Math.max(2, minDim * 0.003), 0, Math.PI * 2);
      tCtx.fill();

      // Dashed target ring for heavy nodes
      if (isHeavy) {
        tCtx.strokeStyle = strokeColor;
        tCtx.lineWidth = Math.max(0.5, minDim * 0.0006);
        tCtx.setLineDash([minDim * 0.004, minDim * 0.004]);
        tCtx.globalAlpha = 0.25 * op;
        tCtx.beginPath();
        tCtx.arc(px, py, minDim * 0.025, 0, Math.PI * 2);
        tCtx.stroke();
        tCtx.setLineDash([]);

        // Coordinate text
        tCtx.globalAlpha = 0.45 * op;
        tCtx.font = Math.max(7, minDim * 0.008) + 'px "SF Mono", "Menlo", monospace';
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'middle';
        var deg = Math.round((angle * 180 / Math.PI + 360) % 360);
        tCtx.fillText('V' + pIdx + ' ' + deg + '°', px + minDim * 0.03, py);
      }
    }
    tCtx.restore();
  }

  function drawGeoMode(tCtx, tW, tH, palette, op) {
    var strokeColor = palette.stroke;
    var detailColor = palette.detail || '#555555';
    var minDim = Math.min(tW, tH);
    var cx = tW / 2;
    var cy = tH / 2;

    var seed = parseInt(sizeSeedSlider.value, 10) || 42;
    var strokeW = parseFloat(shapeStrokeSlider.value) || 1.0;

    tCtx.save();
    tCtx.lineCap = 'round';

    // 1. Orbital Ellipses
    var orbitCount = 5;
    for (var oIdx = 0; oIdx < orbitCount; oIdx++) {
      var rx = minDim * (0.12 + oIdx * 0.075);
      var ry = rx * (0.65 + (oIdx % 2) * 0.15);
      var tilt = (oIdx * 35 + (seed % 90)) * Math.PI / 180;

      tCtx.save();
      tCtx.translate(cx, cy);
      tCtx.rotate(tilt);
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = strokeW;
      tCtx.globalAlpha = (0.2 + oIdx * 0.12) * op;

      if (oIdx % 2 === 1) {
        tCtx.setLineDash([minDim * 0.006, minDim * 0.006]);
      }
      tCtx.beginPath();
      tCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      tCtx.stroke();
      tCtx.setLineDash([]);

      // Marker point on orbit
      var ptAng = (oIdx * 72) * Math.PI / 180;
      var px = Math.cos(ptAng) * rx;
      var py = Math.sin(ptAng) * ry;
      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = 0.8 * op;
      tCtx.beginPath();
      tCtx.arc(px, py, Math.max(2.5, minDim * 0.0035), 0, Math.PI * 2);
      tCtx.fill();

      // Label
      tCtx.globalAlpha = 0.5 * op;
      tCtx.font = 'bold ' + Math.max(7, minDim * 0.009) + 'px "SF Mono", monospace';
      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'middle';
      tCtx.fillText(String.fromCharCode(65 + oIdx) + ' [' + Math.round(ptAng * 180 / Math.PI) + '°]', px + 8, py);
      tCtx.restore();
    }

    // 2. Radial Spokes
    var spokeCount = 12;
    var spokeR = minDim * 0.44;
    for (var s = 0; s < spokeCount; s++) {
      var ang = s * (Math.PI * 2 / spokeCount);
      var sx = cx + Math.cos(ang) * spokeR;
      var sy = cy + Math.sin(ang) * spokeR;

      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = 0.7;
      tCtx.globalAlpha = 0.15 * op;
      tCtx.beginPath();
      tCtx.moveTo(cx, cy);
      tCtx.lineTo(sx, sy);
      tCtx.stroke();

      // Degree tick on outer circumference
      tCtx.globalAlpha = 0.4 * op;
      tCtx.fillStyle = strokeColor;
      tCtx.font = Math.max(7, minDim * 0.007) + 'px "SF Mono", monospace';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText(Math.round(s * (360 / spokeCount)) + '°', cx + Math.cos(ang) * (spokeR + 14), cy + Math.sin(ang) * (spokeR + 14));
    }

    // 3. Lissajous Harmonic Curve
    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = strokeW * 1.2;
    tCtx.globalAlpha = 0.6 * op;
    tCtx.beginPath();
    var freqA = 3, freqB = 2, delta = Math.PI / 4;
    var lissScale = minDim * 0.35;
    for (var t = 0; t <= 360; t += 2) {
      var rad = t * Math.PI / 180;
      var lx = cx + Math.sin(freqA * rad + delta) * lissScale;
      var ly = cy + Math.sin(freqB * rad) * (lissScale * 0.75);
      if (t === 0) tCtx.moveTo(lx, ly);
      else tCtx.lineTo(lx, ly);
    }
    tCtx.stroke();

    // 4. Center Origin Marker
    tCtx.fillStyle = strokeColor;
    tCtx.globalAlpha = 0.9 * op;
    tCtx.beginPath();
    tCtx.arc(cx, cy, Math.max(3, minDim * 0.004), 0, Math.PI * 2);
    tCtx.fill();

    tCtx.strokeStyle = strokeColor;
    tCtx.lineWidth = 1;
    tCtx.setLineDash([4, 4]);
    tCtx.beginPath();
    tCtx.arc(cx, cy, minDim * 0.02, 0, Math.PI * 2);
    tCtx.stroke();
    tCtx.setLineDash([]);

    tCtx.globalAlpha = 0.6 * op;
    tCtx.font = 'bold ' + Math.max(8, minDim * 0.01) + 'px "SF Mono", monospace';
    tCtx.textAlign = 'left';
    tCtx.fillText('O [ORIGIN]', cx + minDim * 0.025, cy);

    tCtx.restore();
  }

  function drawStudioMode(tCtx, tW, tH, palette, op) {
    var strokeColor = palette.stroke;
    var detailColor = palette.detail || '#555555';
    var minDim = Math.min(tW, tH);
    var cx = tW / 2;
    var cy = tH / 2;

    var seed = parseInt(sizeSeedSlider.value, 10) || 42;
    var prng = lcgPRNG(seed);
    var strokeW = parseFloat(shapeStrokeSlider.value) || 1.0;

    tCtx.save();
    tCtx.lineCap = 'round';

    // Recursive Branching Fractal Network (Golden Ratio 0.618)
    var generations = 3;
    var ratio = 0.618;
    var baseR = minDim * 0.28;

    function renderBranch(bx, by, r, gen, parentAngle) {
      if (gen > generations) return;

      var alpha = (0.7 * Math.pow(0.72, gen)) * op;
      tCtx.strokeStyle = strokeColor;
      tCtx.lineWidth = Math.max(0.6, strokeW * (1 - gen * 0.2));
      tCtx.globalAlpha = alpha;

      // Circle at this node
      tCtx.beginPath();
      tCtx.arc(bx, by, r, 0, Math.PI * 2);
      tCtx.stroke();

      // Node center dot
      tCtx.fillStyle = strokeColor;
      tCtx.globalAlpha = (0.5 + 0.3 * (1 / (gen + 1))) * op;
      tCtx.beginPath();
      tCtx.arc(bx, by, Math.max(2, minDim * 0.003), 0, Math.PI * 2);
      tCtx.fill();

      // Generation tag
      if (gen < 2) {
        tCtx.globalAlpha = 0.4 * op;
        tCtx.font = Math.max(7, minDim * 0.008) + 'px "SF Mono", monospace';
        tCtx.textAlign = 'left';
        tCtx.fillText('GEN.' + gen + ' [r=' + Math.round(r) + ']', bx + r + 6, by);
      }

      var numChildren = 3;
      var childR = r * ratio;
      for (var c = 0; c < numChildren; c++) {
        var ang = parentAngle + (c - 1) * (Math.PI * 0.55) + (prng() - 0.5) * 0.2;
        var dist = r + childR * 0.85;
        var chX = bx + Math.cos(ang) * dist;
        var chY = by + Math.sin(ang) * dist;

        // Connecting line
        tCtx.strokeStyle = detailColor;
        tCtx.lineWidth = 0.7;
        tCtx.globalAlpha = 0.25 * op;
        tCtx.beginPath();
        tCtx.moveTo(bx, by);
        tCtx.lineTo(chX, chY);
        tCtx.stroke();

        renderBranch(chX, chY, childR, gen + 1, ang);
      }
    }

    renderBranch(cx, cy, baseR, 0, -Math.PI / 2);

    // 3D Contour Elevation Slices
    tCtx.strokeStyle = detailColor;
    tCtx.lineWidth = 0.5;
    tCtx.setLineDash([minDim * 0.005, minDim * 0.005]);
    for (var slice = -2; slice <= 2; slice++) {
      var sy = cy + slice * (minDim * 0.14);
      tCtx.globalAlpha = 0.12 * op;
      tCtx.beginPath();
      tCtx.moveTo(cx - minDim * 0.4, sy);
      tCtx.lineTo(cx + minDim * 0.4, sy);
      tCtx.stroke();

      tCtx.globalAlpha = 0.3 * op;
      tCtx.font = Math.max(7, minDim * 0.007) + 'px "SF Mono", monospace';
      tCtx.textAlign = 'right';
      tCtx.fillText('ELEV ' + (slice * 50) + 'm', cx - minDim * 0.4 - 8, sy + 3);
    }
    tCtx.setLineDash([]);
    tCtx.restore();
  }

  // Render Pipeline
  function drawCanvas(tCtx, tW, tH) {
    var palette = state.palette;
    var strokeColor = palette.stroke;
    var op = parseFloat(overlayOpacitySlider.value);
    if (isNaN(op)) op = 1;

    // 1. Background Fill
    tCtx.fillStyle = palette.bg;
    tCtx.fillRect(0, 0, tW, tH);

    // 2. Background Image
    if (state.image) {
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
      tCtx.drawImage(img, sx, sy, sw, sh, 0, 0, tW, tH);
      tCtx.globalAlpha = 1;
    }

    // 3. Pixelation Zones
    if (state.pixelZones && state.pixelZones.length > 0 && parseInt(pixelSizeSlider.value, 10) > 1) {
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
    }

    // 4. Crosshair Frame
    if (state.frameOn) {
      var cx = tW / 2;
      var cy = tH / 2;
      var fSizePct = parseFloat(frameSizeSlider.value) || 60;
      var frameBox = Math.min(tW, tH) * (fSizePct / 100);
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
      tCtx.rect(cx - frameBox / 2, cy - frameBox / 2, frameBox, frameBox);
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

    // 5. Chain Circles & Intersections
    if (state.chainOn && state.chainCircles && state.chainCircles.length > 0) {
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
              tCtx.fillText(pNum + ' → ' + Math.round(pt.x) + ' – ' + Math.round(pt.y), pt.x + mSize + lblSize * 0.5, pt.y);
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
    frameSizeVal.textContent = frameSizeSlider.value;
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
  [imageOpacitySlider, pixelSizeSlider, zoneSizeSlider, frameSizeSlider, dashPatternSlider, frameStrokeSlider, starSizeSlider, starPointsSlider, shapeStrokeSlider, labelSizeSlider, overlayOpacitySlider, lineWeightSlider, textureOpacitySlider].forEach(function (s) {
    bindSlider(s, 1);
  });
  if (markerSizeSlider) {
    bindSlider(markerSizeSlider, 1);
  }
  if (frameTextSizeSlider) {
    bindSlider(frameTextSizeSlider, 1);
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
  canvasSizeSelect.addEventListener('change', function () {
    state.format = canvasSizeSelect.value;
    updateStatusFooter();
    recalculate(true);
    resizeAndRender();
  });

  // Stage Navigation (Hero, Geo Tool, Studio)
  document.querySelectorAll('.nav-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.nav-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.mode = tab.dataset.mode;
      scheduleUpdate(1);
    });
  });

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
    link.download = 'brand-asset-' + state.format + '-' + Date.now() + '.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  window.addEventListener('resize', function () {
    resizeAndRender();
  });

  syncValues();
  updateStatusFooter();
  recalculate(true);
  resizeAndRender();
})();
