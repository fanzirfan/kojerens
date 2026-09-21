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
  var frameTextSizeSlider = document.getElementById('frameTextSize');
  var frameTextSizeVal = document.getElementById('frameTextSizeVal');

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
    chainOn: true,
    chainIntersections: true,
    detectionMode: 'contrast',
    detectionType: 'bright',
    shape: 'circle',
    palette: { bg: '#0a0a0a', color: '#ffffff', stroke: '#ffffff', name: 'White / Dark' },
    customTexture: null,
    noiseCanvas: null,
    format: 'portrait_3_4',
    mode: 'hero',
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
  }
  createNoisePattern();

  function updateStatusFooter() {
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    exportStatusText.textContent = fmt.label + ' / ' + state.palette.name;
  }

  // Block RMS Contrast & Luminance Analysis
  function analyzeImage(img, targetW, targetH, bSize) {
    var off = document.createElement('canvas');
    off.width = targetW;
    off.height = targetH;
    var actx = off.getContext('2d');

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

    actx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
    var f = actx.getImageData(0, 0, targetW, targetH).data;

    var p = bSize || 16;
    var cols = Math.floor(targetW / p);
    var rows = Math.floor(targetH / p);
    var blocks = [];

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var startX = c * p;
        var startY = r * p;
        var sumLum = 0, sumSq = 0, count = 0;

        for (var y = startY; y < startY + p && y < targetH; y++) {
          for (var x = startX; x < startX + p && x < targetW; x++) {
            var idx = (y * targetW + x) * 4;
            var lum = f[idx] * 0.299 + f[idx + 1] * 0.587 + f[idx + 2] * 0.114;
            sumLum += lum;
            sumSq += lum * lum;
            count++;
          }
        }

        var mean = sumLum / count;
        var variance = sumSq / count - mean * mean;
        var contrast = Math.sqrt(Math.max(0, variance));

        blocks.push({
          x: startX + p / 2,
          y: startY + p / 2,
          brightness: mean,
          contrast: contrast
        });
      }
    }
    return blocks;
  }

  // Circle Placement
  function placeCircles(blocks, opts) {
    if (!blocks || blocks.length === 0) return [];
    var mode = opts.mode;
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

    var maxScore = Math.max.apply(null, scored.map(function (b) { return b.score; })) || 1;
    var filtered = scored
      .map(function (b) {
        return {
          x: b.x,
          y: b.y,
          brightness: b.brightness,
          contrast: b.contrast,
          score: b.score,
          normalizedScore: b.score / maxScore
        };
      })
      .filter(function (b) {
        return b.normalizedScore >= threshold / 100;
      })
      .sort(function (a, b) {
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
    for (var r = 0; r < circles.length; r++) {
      for (var i = r + 1; i < circles.length; i++) {
        var dist = Math.hypot(circles[i].x - circles[r].x, circles[i].y - circles[r].y);
        if (dist < maxDist) {
          lines.push({ a: r, b: i, dist: dist });
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
    var dist = Math.hypot(dx, dy);
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

  function recalculate() {
    if (!state.image) return;
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    var w = fmt.w;
    var h = fmt.h;

    var bSize = parseInt(blockSizeSlider.value, 10) || 16;
    var thresh = parseFloat(thresholdSlider.value) || 30;
    var maxC = parseInt(maxCirclesSlider.value, 10) || 80;
    var minDist = parseFloat(minDistanceSlider.value) || 40;
    var minR = parseFloat(minRadiusSlider.value) || 4;
    var maxR = parseFloat(maxRadiusSlider.value) || 24;
    var seed = parseInt(sizeSeedSlider.value, 10) || 42;

    var blocks = analyzeImage(state.image, w, h, bSize);
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

    state.chainCircles = buildChain(w, h, {
      chainCount: parseInt(chainCountSlider.value, 10) || 11,
      chainAngle: parseFloat(chainAngleSlider.value) || 45,
      chainBaseRadius: parseFloat(chainBaseRadiusSlider.value) || 300,
      chainSizeRatio: parseFloat(chainSizeRatioSlider.value) || 0.50
    });
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

      state.pixelZones.forEach(function (zone) {
        var zx = zone.x;
        var zy = zone.y;
        var minX = Math.max(0, Math.floor(zx - pRadius));
        var minY = Math.max(0, Math.floor(zy - pRadius));
        var zWidth = Math.min(tW, Math.ceil(zx + pRadius)) - minX;
        var zHeight = Math.min(tH, Math.ceil(zy + pRadius)) - minY;

        if (zWidth > 0 && zHeight > 0) {
          tCtx.save();
          tCtx.beginPath();
          tCtx.rect(minX, minY, zWidth, zHeight);
          tCtx.clip();

          var zData = tCtx.getImageData(minX, minY, zWidth, zHeight).data;
          for (var py = 0; py < zHeight; py += pSize) {
            for (var px = 0; px < zWidth; px += pSize) {
              var rSum = 0, gSum = 0, bSum = 0, count = 0;
              for (var by = 0; by < pSize && py + by < zHeight; by++) {
                for (var bx = 0; bx < pSize && px + bx < zWidth; bx++) {
                  var idx = ((py + by) * zWidth + (px + bx)) * 4;
                  rSum += zData[idx];
                  gSum += zData[idx + 1];
                  bSum += zData[idx + 2];
                  count++;
                }
              }
              tCtx.fillStyle = 'rgb(' + ((rSum / count) | 0) + ',' + ((gSum / count) | 0) + ',' + ((bSum / count) | 0) + ')';
              tCtx.fillRect(minX + px, minY + py, pSize, pSize);
            }
          }
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

    // 6. Connections
    if (state.connections && state.connections.length > 0 && state.mode !== 'studio') {
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

    // 7. Detected Circles / Shapes
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

      if (labelSize > 0 && state.mode !== 'geo') {
        tCtx.globalAlpha = op;
        tCtx.font = labelSize + 'px Telegraf, system-ui, sans-serif';
        tCtx.textAlign = 'left';
        tCtx.textBaseline = 'middle';
        tCtx.fillText(Math.round(circle.x) + ',' + Math.round(circle.y), circle.x + circle.r + labelSize * 0.4, circle.y);
      }
    });

    // 8. Teks 4 Pojok dengan Nama Fanz Irfan
    if (state.mode !== 'geo') {
      var fTextSize = parseInt(frameTextSizeSlider.value, 10) || 12;
      tCtx.globalAlpha = op;
      tCtx.fillStyle = strokeColor;
      tCtx.font = fTextSize + 'px Telegraf, system-ui, sans-serif';

      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'top';
      tCtx.fillText('Design & Strategy', 40, 40);

      tCtx.textAlign = 'right';
      tCtx.textBaseline = 'top';
      tCtx.fillText('Fanz Irfan', tW - 40, 40);

      tCtx.textAlign = 'left';
      tCtx.textBaseline = 'bottom';
      tCtx.fillText('www.fanzirfan.id', 40, tH - 40);

      tCtx.textAlign = 'right';
      tCtx.textBaseline = 'bottom';
      tCtx.fillText('Indonesia', tW - 40, tH - 40);
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
        var pat = tCtx.createPattern(state.noiseCanvas, 'repeat');
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

  function bindSlider(slider, triggersRecalc) {
    slider.addEventListener('input', function () {
      syncValues();
      if (triggersRecalc) recalculate();
      render();
    });
  }

  // Bind Recalculate Sliders
  [blockSizeSlider, thresholdSlider, maxCirclesSlider, minDistanceSlider, minRadiusSlider, maxRadiusSlider, sizeSeedSlider, maxDistanceSlider, chainCountSlider, chainAngleSlider, chainBaseRadiusSlider, chainSizeRatioSlider].forEach(function (s) {
    bindSlider(s, true);
  });

  // Bind Fast Visual Sliders
  [imageOpacitySlider, pixelSizeSlider, zoneSizeSlider, frameSizeSlider, dashPatternSlider, frameStrokeSlider, starSizeSlider, starPointsSlider, shapeStrokeSlider, labelSizeSlider, overlayOpacitySlider, lineWeightSlider, textureOpacitySlider].forEach(function (s) {
    bindSlider(s, false);
  });
  if (markerSizeSlider) {
    bindSlider(markerSizeSlider, false);
  }
  if (frameTextSizeSlider) {
    bindSlider(frameTextSizeSlider, false);
  }

  // Toggles
  pixelateStrokeBtn.addEventListener('click', function () {
    state.pixelStroke = !state.pixelStroke;
    pixelateStrokeBtn.classList.toggle('active', state.pixelStroke);
    pixelateStrokeBtn.textContent = state.pixelStroke ? 'Stroke On' : 'Stroke Off';
    render();
  });

  undoPixelateBtn.addEventListener('click', function () {
    if (state.pixelZones.length > 0) {
      state.pixelZones.pop();
      syncValues();
      render();
    }
  });

  clearPixelateBtn.addEventListener('click', function () {
    state.pixelZones = [];
    syncValues();
    render();
  });

  frameToggleBtn.addEventListener('click', function () {
    state.frameOn = !state.frameOn;
    frameToggleBtn.classList.toggle('active', state.frameOn);
    frameToggleBtn.textContent = state.frameOn ? 'Frame On' : 'Frame Off';
    render();
  });

  chainToggleBtn.addEventListener('click', function () {
    state.chainOn = !state.chainOn;
    chainToggleBtn.classList.toggle('active', state.chainOn);
    chainToggleBtn.textContent = state.chainOn ? 'Chain On' : 'Chain Off';
    render();
  });

  chainIntersectionsBtn.addEventListener('click', function () {
    state.chainIntersections = !state.chainIntersections;
    chainIntersectionsBtn.classList.toggle('active', state.chainIntersections);
    chainIntersectionsBtn.textContent = state.chainIntersections ? 'Intersections On' : 'Intersections Off';
    render();
  });

  // Canvas Click to add Pixelation Zone
  canvas.addEventListener('click', function (e) {
    if (!state.image) return;
    var rect = canvas.getBoundingClientRect();
    var clickX = (e.clientX - rect.left) / rect.width * canvas.width;
    var clickY = (e.clientY - rect.top) / rect.height * canvas.height;

    state.pixelZones.push({
      x: clickX,
      y: clickY
    });

    syncValues();
    render();
  });

  // Segmented Buttons: Detection Mode (Combined vs Contrast)
  document.querySelectorAll('[data-detection-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-detection-mode]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.detectionMode = btn.dataset.detectionMode;
      recalculate();
      render();
    });
  });

  // Segmented Buttons: Detection Type (Bright vs Dark)
  document.querySelectorAll('[data-detection-type]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-detection-type]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.detectionType = btn.dataset.detectionType;
      recalculate();
      render();
    });
  });

  // Segmented Buttons: Shapes (Circle vs Square)
  document.querySelectorAll('[data-shape]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-shape]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.shape = btn.dataset.shape;
      render();
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
    render();
  });

  // Canvas Format Selection
  canvasSizeSelect.addEventListener('change', function () {
    state.format = canvasSizeSelect.value;
    updateStatusFooter();
    recalculate();
    resizeAndRender();
  });

  // Stage Navigation (Hero, Geo Tool, Studio)
  document.querySelectorAll('.nav-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.nav-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.mode = tab.dataset.mode;
      render();
    });
  });

  // Image Loading
  function applyLoadedImage(img) {
    state.image = img;
    emptyState.classList.add('hidden');
    canvas.classList.add('visible');
    recalculate();
    resizeAndRender();
  }

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        applyLoadedImage(img);
      };
      img.src = ev.target.result;
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
      if (items[i].type.indexOf('image') !== -1) {
        var blob = items[i].getAsFile();
        if (blob) loadFile(blob);
        break;
      }
    }
  });

  // Texture Buttons
  replaceTextureBtn.addEventListener('click', function () {
    textureInput.click();
  });
  textureInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) {
      var r = new FileReader();
      r.onload = function (ev) {
        var tImg = new Image();
        tImg.onload = function () {
          state.customTexture = tImg;
          render();
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
    render();
  });

  // Download High-Resolution PNG
  downloadBtn.addEventListener('click', function () {
    if (!state.image) return;
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
    if (state.image) {
      resizeAndRender();
    }
  });

  syncValues();
  updateStatusFooter();

  // Load preset portrait automatically on startup if file exists
  var autoImg = new Image();
  autoImg.onload = function () {
    applyLoadedImage(autoImg);
  };
  autoImg.src = 'assets/preset-portrait.png';
})();
