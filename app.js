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
  var presetSelect = document.getElementById('presetSelect');
  var downloadBtn = document.getElementById('downloadBtn');
  var exportStatusText = document.getElementById('exportStatusText');

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
    detectionMode: 'combined',
    detectionType: 'bright',
    shape: 'circle',
    palette: { bg: '#0c0c0c', color: '#d4a843', name: 'Gold / Dark' },
    customTexture: null,
    noiseCanvas: null,
    format: 'portrait_3_4',
    blobs: [],
    focusBox: null
  };

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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

  function extractFeatures() {
    if (!state.image) return;
    var img = state.image;
    var maxDim = 380;
    var imgW = img.naturalWidth || img.width;
    var imgH = img.naturalHeight || img.height;
    var scale = Math.min(1, maxDim / Math.max(imgW, imgH));
    var aW = Math.max(40, Math.round(imgW * scale));
    var aH = Math.max(40, Math.round(imgH * scale));

    var aCanvas = document.createElement('canvas');
    aCanvas.width = aW;
    aCanvas.height = aH;
    var aCtx = aCanvas.getContext('2d');
    aCtx.drawImage(img, 0, 0, aW, aH);

    var imgData = aCtx.getImageData(0, 0, aW, aH);
    var data = imgData.data;

    var lum = new Float32Array(aW * aH);
    for (var i = 0, p = 0; i < data.length; i += 4, p++) {
      lum[p] = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    }

    var saliency = new Float32Array(aW * aH);
    var maxSal = 0.0001;
    var isDark = state.detectionType === 'dark';
    var isContrastOnly = state.detectionMode === 'contrast';

    for (var y = 1; y < aH - 1; y++) {
      var yPrev = (y - 1) * aW;
      var yCurr = y * aW;
      var yNext = (y + 1) * aW;
      for (var x = 1; x < aW - 1; x++) {
        var gx =
          lum[yPrev + x + 1] + 2 * lum[yCurr + x + 1] + lum[yNext + x + 1] -
          (lum[yPrev + x - 1] + 2 * lum[yCurr + x - 1] + lum[yNext + x - 1]);
        var gy =
          lum[yNext + x - 1] + 2 * lum[yNext + x] + lum[yNext + x + 1] -
          (lum[yPrev + x - 1] + 2 * lum[yPrev + x] + lum[yPrev + x + 1]);
        var grad = Math.sqrt(gx * gx + gy * gy);

        var center = lum[yCurr + x];
        var lightVal = isDark ? 1 - center : center;

        var sal;
        if (isContrastOnly) {
          sal = grad;
        } else {
          var surround =
            (lum[yPrev + x] + lum[yNext + x] + lum[yCurr + x - 1] + lum[yCurr + x + 1]) * 0.25;
          var contrast = Math.abs(center - surround);
          sal = grad * 0.55 + contrast * 0.25 + lightVal * 0.2;
        }

        saliency[yCurr + x] = sal;
        if (sal > maxSal) maxSal = sal;
      }
    }

    for (var k = 0; k < saliency.length; k++) {
      saliency[k] /= maxSal;
    }

    var bSize = parseInt(blockSizeSlider.value, 10) || 16;
    var cellW = Math.max(6, Math.round((bSize / 400) * aW));
    var cellH = Math.max(6, Math.round((bSize / 400) * aH));
    var gridX = Math.floor(aW / cellW);
    var gridY = Math.floor(aH / cellH);

    var thresh = (parseFloat(thresholdSlider.value) || 30) / 100;
    var maxC = parseInt(maxCirclesSlider.value, 10) || 80;
    var minDistNorm = (parseFloat(minDistanceSlider.value) || 40) / 1000;
    var seedVal = parseInt(sizeSeedSlider.value, 10) || 42;
    var rand = mulberry32(seedVal);

    var candidates = [];
    for (var gy = 0; gy < gridY; gy++) {
      for (var gx = 0; gx < gridX; gx++) {
        var startX = gx * cellW;
        var endX = Math.min(aW - 1, (gx + 1) * cellW);
        var startY = gy * cellH;
        var endY = Math.min(aH - 1, (gy + 1) * cellH);

        var bestX = startX;
        var bestY = startY;
        var bestScore = -1;

        for (var cy = startY; cy < endY; cy++) {
          var rowOff = cy * aW;
          for (var cx = startX; cx < endX; cx++) {
            var s = saliency[rowOff + cx];
            if (s > bestScore) {
              bestScore = s;
              bestX = cx;
              bestY = cy;
            }
          }
        }

        if (bestScore >= thresh * 0.85) {
          var weighted = bestScore * (0.8 + rand() * 0.4);
          candidates.push({
            nx: bestX / aW,
            ny: bestY / aH,
            rawScore: bestScore,
            score: weighted,
            brightness: lum[bestY * aW + bestX]
          });
        }
      }
    }

    candidates.sort(function (a, b) {
      return b.score - a.score;
    });

    var selected = [];
    for (var c = 0; c < candidates.length && selected.length < maxC; c++) {
      var cand = candidates[c];
      var tooClose = false;
      for (var s = 0; s < selected.length; s++) {
        var dx = cand.nx - selected[s].nx;
        var dy = cand.ny - selected[s].ny;
        if (Math.sqrt(dx * dx + dy * dy) < minDistNorm) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        selected.push(cand);
      }
    }

    var minR = parseFloat(minRadiusSlider.value) || 4;
    var maxR = parseFloat(maxRadiusSlider.value) || 24;
    var blobs = [];

    for (var b = 0; b < selected.length; b++) {
      var item = selected[b];
      var r = minR + item.rawScore * (maxR - minR);
      var isMajor = b < 3;
      if (isMajor) {
        r = maxR * (1.5 + rand() * 0.8);
      }
      blobs.push({
        nx: item.nx,
        ny: item.ny,
        r: r,
        score: item.rawScore,
        brightness: item.brightness,
        isMajor: isMajor,
        hasDouble: isMajor || (b % 4 === 0 && item.rawScore > 0.4),
        hasGlow: item.brightness > 0.65 || (b < 2 && item.rawScore > 0.65),
        hasLeader: b % 3 === 0,
        leaderDir: rand() > 0.5 ? 1 : -1,
        leaderVal: (item.rawScore * 99).toFixed(1) + '%',
        id: Math.floor(rand() * 9000 + 1000)
      });
    }

    state.blobs = blobs;
  }

  function resizeCanvas() {
    var rect = wrap.getBoundingClientRect();
    var pad = 40;
    var maxW = Math.max(200, rect.width - pad);
    var maxH = Math.max(200, rect.height - pad);

    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    var ratio = fmt.w / fmt.h;

    var w = maxW;
    var h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }

    canvas.width = Math.round(w);
    canvas.height = Math.round(h);
    canvas.style.width = Math.round(w) + 'px';
    canvas.style.height = Math.round(h) + 'px';
  }

  function drawScene(targetCtx, targetW, targetH, scale) {
    scale = scale || 1;
    var palette = state.palette;
    var color = palette.color;

    targetCtx.clearRect(0, 0, targetW, targetH);

    targetCtx.fillStyle = palette.bg;
    targetCtx.fillRect(0, 0, targetW, targetH);

    if (state.image) {
      var img = state.image;
      var imgW = img.naturalWidth || img.width;
      var imgH = img.naturalHeight || img.height;
      var imgRatio = imgW / imgH;
      var targetRatio = targetW / targetH;

      var dw, dh, dx, dy;
      if (imgRatio > targetRatio) {
        dh = targetH;
        dw = dh * imgRatio;
        dx = (targetW - dw) / 2;
        dy = 0;
      } else {
        dw = targetW;
        dh = dw / imgRatio;
        dx = 0;
        dy = (targetH - dh) / 2;
      }

      var imgOp = parseFloat(imageOpacitySlider.value);
      targetCtx.globalAlpha = isNaN(imgOp) ? 0.75 : imgOp;
      targetCtx.drawImage(img, dx, dy, dw, dh);
      targetCtx.globalAlpha = 1;

      // 2. PIXELATE ZONES
      if (state.pixelZones && state.pixelZones.length > 0) {
        for (var pz = 0; pz < state.pixelZones.length; pz++) {
          var zone = state.pixelZones[pz];
          var zcx = zone.nx * targetW;
          var zcy = zone.ny * targetH;
          var zw = zone.zoneSize * 2 * scale;
          var zh = zone.zoneSize * 2 * scale;
          var zx1 = Math.max(0, Math.floor(zcx - zw / 2));
          var zy1 = Math.max(0, Math.floor(zcy - zh / 2));
          var zx2 = Math.min(targetW, Math.ceil(zcx + zw / 2));
          var zy2 = Math.min(targetH, Math.ceil(zcy + zh / 2));

          var pBlock = Math.max(4, Math.round(zone.pixelSize * scale));
          var zWidth = zx2 - zx1;
          var zHeight = zy2 - zy1;

          if (zWidth > 0 && zHeight > 0) {
            try {
              var zData = targetCtx.getImageData(zx1, zy1, zWidth, zHeight);
              var zd = zData.data;

              for (var py = 0; py < zHeight; py += pBlock) {
                for (var px = 0; px < zWidth; px += pBlock) {
                  var rSum = 0, gSum = 0, bSum = 0, count = 0;
                  var maxBy = Math.min(zHeight, py + pBlock);
                  var maxBx = Math.min(zWidth, px + pBlock);

                  for (var by = py; by < maxBy; by++) {
                    for (var bx = px; bx < maxBx; bx++) {
                      var idx = (by * zWidth + bx) * 4;
                      rSum += zd[idx];
                      gSum += zd[idx + 1];
                      bSum += zd[idx + 2];
                      count++;
                    }
                  }

                  var rAvg = Math.round(rSum / count);
                  var gAvg = Math.round(gSum / count);
                  var bAvg = Math.round(bSum / count);

                  for (var by2 = py; by2 < maxBy; by2++) {
                    for (var bx2 = px; bx2 < maxBx; bx2++) {
                      var idx2 = (by2 * zWidth + bx2) * 4;
                      zd[idx2] = rAvg;
                      zd[idx2 + 1] = gAvg;
                      zd[idx2 + 2] = bAvg;
                    }
                  }
                }
              }
              targetCtx.putImageData(zData, zx1, zy1);

              if (state.pixelStroke) {
                targetCtx.save();
                targetCtx.strokeStyle = color;
                targetCtx.lineWidth = 1 * scale;
                targetCtx.globalAlpha = 0.55;
                targetCtx.strokeRect(zx1, zy1, zWidth, zHeight);
                targetCtx.restore();
              }
            } catch (err) {
              // Ignore cross-origin error if any
            }
          }
        }
      }
    }

    // 3. TEXTURE / NOISE OVERLAY
    var texOp = parseFloat(textureOpacitySlider.value);
    if (!isNaN(texOp) && texOp > 0) {
      targetCtx.save();
      targetCtx.globalAlpha = texOp * 0.45;
      targetCtx.globalCompositeOperation = 'screen';
      if (state.customTexture) {
        targetCtx.drawImage(state.customTexture, 0, 0, targetW, targetH);
      } else if (state.noiseCanvas) {
        var pattern = targetCtx.createPattern(state.noiseCanvas, 'repeat');
        targetCtx.fillStyle = pattern;
        targetCtx.fillRect(0, 0, targetW, targetH);
      }
      targetCtx.restore();
    }

    var masterOp = parseFloat(overlayOpacitySlider.value);
    if (isNaN(masterOp)) masterOp = 1;

    // 4. CROSSHAIR FRAME
    if (state.frameOn) {
      var fSizePct = parseFloat(frameSizeSlider.value) || 60;
      var fDash = (parseFloat(dashPatternSlider.value) || 8) * scale;
      var fStroke = (parseFloat(frameStrokeSlider.value) || 1.0) * scale;
      var sSize = (parseFloat(starSizeSlider.value) || 40) * scale;
      var sPoints = parseInt(starPointsSlider.value, 10) || 4;

      var shortSide = Math.min(targetW, targetH);
      var frameBoxW = shortSide * (fSizePct / 100);
      var fcx = targetW / 2;
      var fcy = targetH / 2;
      var fbx = fcx - frameBoxW / 2;
      var fby = fcy - frameBoxW / 2;

      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = fStroke;
      targetCtx.globalAlpha = masterOp * 0.8;
      targetCtx.setLineDash([fDash, fDash]);
      targetCtx.strokeRect(fbx, fby, frameBoxW, frameBoxW);
      targetCtx.setLineDash([]);

      if (sSize > 0) {
        targetCtx.beginPath();
        var numLines = sPoints;
        for (var sp = 0; sp < numLines; sp++) {
          var sAngle = (sp * Math.PI) / numLines;
          var sdx = (Math.cos(sAngle) * sSize) / 2;
          var sdy = (Math.sin(sAngle) * sSize) / 2;
          targetCtx.moveTo(fcx - sdx, fcy - sdy);
          targetCtx.lineTo(fcx + sdx, fcy + sdy);
        }
        targetCtx.stroke();
      }
      targetCtx.restore();
    }

    // 5. CHAIN CIRCLES
    if (state.chainOn) {
      var cCount = parseInt(chainCountSlider.value, 10) || 11;
      var cAngleDeg = parseFloat(chainAngleSlider.value) || 45;
      var cRad = (parseFloat(chainBaseRadiusSlider.value) || 250) * scale;
      var cRatio = parseFloat(chainSizeRatioSlider.value) || 0.79;
      var cStroke = (parseFloat(shapeStrokeSlider.value) || 1.0) * scale;

      var radAngle = (cAngleDeg * Math.PI) / 180;
      var uX = Math.cos(radAngle);
      var uY = Math.sin(radAngle);
      var ccx = targetW / 2;
      var ccy = targetH / 2;

      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = cStroke * 0.85;
      targetCtx.globalAlpha = masterOp * 0.5;

      var chainPoints = [];
      var currRad = cRad;
      var currDist = 0;

      for (var ci = 0; ci < cCount; ci++) {
        var offset = (ci - Math.floor(cCount / 2));
        var sign = offset >= 0 ? 1 : -1;
        var step = Math.abs(offset);
        var rStep = cRad * Math.pow(cRatio, step);
        var dStep = offset * (cRad * 0.45);

        var cpx = ccx + uX * dStep;
        var cpy = ccy + uY * dStep;
        chainPoints.push({ x: cpx, y: cpy, r: rStep });

        targetCtx.beginPath();
        targetCtx.arc(cpx, cpy, rStep, 0, Math.PI * 2);
        targetCtx.stroke();
      }

      if (state.chainIntersections && chainPoints.length > 1) {
        targetCtx.fillStyle = color;
        targetCtx.globalAlpha = masterOp * 0.8;
        for (var cj = 0; cj < chainPoints.length - 1; cj++) {
          var p1 = chainPoints[cj];
          var p2 = chainPoints[cj + 1];
          var midX = (p1.x + p2.x) / 2;
          var midY = (p1.y + p2.y) / 2;
          targetCtx.beginPath();
          targetCtx.arc(midX, midY, 2 * scale, 0, Math.PI * 2);
          targetCtx.fill();
        }
      }
      targetCtx.restore();
    }

    // 6. CONNECTIONS
    var maxD = (parseFloat(maxDistanceSlider.value) || 150) * scale;
    var lineW = (parseFloat(lineWeightSlider.value) || 0.8) * scale;
    var blobs = state.blobs;

    if (maxD > 0 && blobs.length > 1) {
      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = lineW;

      for (var i = 0; i < blobs.length; i++) {
        for (var j = i + 1; j < blobs.length; j++) {
          var b1 = blobs[i];
          var b2 = blobs[j];
          var ax = b1.nx * targetW;
          var ay = b1.ny * targetH;
          var bx = b2.nx * targetW;
          var by = b2.ny * targetH;
          var dist = Math.hypot(ax - bx, ay - by);

          if (dist < maxD) {
            var alpha = 1 - dist / maxD;
            var isDashed = dist > maxD * 0.5;
            targetCtx.globalAlpha = masterOp * (isDashed ? 0.35 : 0.55) * alpha;
            if (isDashed) {
              targetCtx.setLineDash([3 * scale, 4 * scale]);
            } else {
              targetCtx.setLineDash([]);
            }
            targetCtx.beginPath();
            targetCtx.moveTo(ax, ay);
            targetCtx.lineTo(bx, by);
            targetCtx.stroke();
          }
        }
      }
      targetCtx.restore();
    }

    // 7. SHAPES & LABELS
    var sStroke = (parseFloat(shapeStrokeSlider.value) || 1.0) * scale;
    var lblSize = (parseFloat(labelSizeSlider.value) || 8) * scale;
    var isCircle = state.shape === 'circle';

    for (var k = 0; k < blobs.length; k++) {
      var blob = blobs[k];
      var bx = blob.nx * targetW;
      var by = blob.ny * targetH;
      var br = blob.r * scale;

      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = sStroke;
      targetCtx.globalAlpha = masterOp * (blob.isMajor ? 0.9 : 0.7);

      targetCtx.beginPath();
      if (isCircle) {
        targetCtx.arc(bx, by, br, 0, Math.PI * 2);
      } else {
        targetCtx.strokeRect(bx - br, by - br, br * 2, br * 2);
      }
      targetCtx.stroke();

      if (blob.hasDouble) {
        targetCtx.globalAlpha = masterOp * 0.45;
        targetCtx.beginPath();
        if (isCircle) {
          targetCtx.arc(bx, by, br * 0.45, 0, Math.PI * 2);
        } else {
          targetCtx.strokeRect(bx - br * 0.45, by - br * 0.45, br * 0.9, br * 0.9);
        }
        targetCtx.stroke();
      }

      if (blob.hasGlow) {
        targetCtx.fillStyle = '#ffffff';
        targetCtx.globalAlpha = masterOp * 0.95;
        targetCtx.beginPath();
        targetCtx.arc(bx, by, Math.max(1.8 * scale, sStroke * 1.1), 0, Math.PI * 2);
        targetCtx.fill();
      } else {
        targetCtx.fillStyle = color;
        targetCtx.globalAlpha = masterOp * 0.8;
        targetCtx.beginPath();
        targetCtx.arc(bx, by, Math.max(1.2 * scale, sStroke * 0.75), 0, Math.PI * 2);
        targetCtx.fill();
      }
      targetCtx.restore();

      // Leader lines
      if (blob.hasLeader && !blob.isMajor) {
        targetCtx.save();
        targetCtx.strokeStyle = color;
        targetCtx.lineWidth = lineW * 0.7;
        targetCtx.globalAlpha = masterOp * 0.5;
        var dir = blob.leaderDir;
        var lx1 = bx + dir * br;
        var lx2 = lx1 + dir * 16 * scale;
        targetCtx.beginPath();
        targetCtx.moveTo(lx1, by);
        targetCtx.lineTo(lx2, by);
        targetCtx.stroke();

        targetCtx.fillStyle = color;
        targetCtx.font = Math.max(6 * scale, lblSize - 1 * scale) + "px 'SF Mono','Menlo',monospace";
        targetCtx.textBaseline = 'bottom';
        targetCtx.textAlign = dir > 0 ? 'left' : 'right';
        targetCtx.fillText(blob.leaderVal, lx2 + dir * 3 * scale, by - 1 * scale);
        targetCtx.restore();
      }

      // XY coordinate labels
      if (lblSize > 0 && (blob.isMajor || blob.score > 0.4)) {
        targetCtx.save();
        targetCtx.fillStyle = color;
        targetCtx.font = lblSize + "px 'SF Mono','Menlo',monospace";
        targetCtx.textBaseline = 'middle';
        targetCtx.globalAlpha = masterOp * 0.75;
        var normX = (blob.nx * 100).toFixed(1);
        var normY = (blob.ny * 100).toFixed(1);
        targetCtx.fillText('x:' + normX, bx + br + 4 * scale, by - 4 * scale);
        targetCtx.fillText('y:' + normY, bx + br + 4 * scale, by + 5 * scale);
        targetCtx.restore();
      }
    }
  }

  function render() {
    drawScene(ctx, canvas.width, canvas.height, 1);
  }

  function syncValues() {
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

  function bindSlider(slider, needsExtraction) {
    slider.addEventListener('input', function () {
      syncValues();
      if (needsExtraction) {
        extractFeatures();
      }
      render();
    });
  }

  // Bind Extraction Sliders
  [blockSizeSlider, thresholdSlider, maxCirclesSlider, minDistanceSlider, minRadiusSlider, maxRadiusSlider, sizeSeedSlider].forEach(function (s) {
    bindSlider(s, true);
  });

  // Bind Visual Sliders
  [imageOpacitySlider, pixelSizeSlider, zoneSizeSlider, frameSizeSlider, dashPatternSlider, frameStrokeSlider, starSizeSlider, starPointsSlider, chainCountSlider, chainAngleSlider, chainBaseRadiusSlider, chainSizeRatioSlider, shapeStrokeSlider, labelSizeSlider, overlayOpacitySlider, maxDistanceSlider, lineWeightSlider, textureOpacitySlider].forEach(function (s) {
    bindSlider(s, false);
  });

  // Toggle Buttons
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
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;
    var nx = clickX / canvas.width;
    var ny = clickY / canvas.height;

    var pSize = parseInt(pixelSizeSlider.value, 10) || 26;
    var zSize = parseInt(zoneSizeSlider.value, 10) || 90;

    state.pixelZones.push({
      nx: nx,
      ny: ny,
      pixelSize: pSize,
      zoneSize: zSize
    });

    syncValues();
    render();
  });

  // Segmented Buttons: Detection Mode (Combined vs Contrast)
  document.querySelectorAll('[data-detection-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-detection-mode]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      state.detectionMode = btn.dataset.detectionMode;
      extractFeatures();
      render();
    });
  });

  // Segmented Buttons: Detection Type (Bright vs Dark)
  document.querySelectorAll('[data-detection-type]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-detection-type]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      state.detectionType = btn.dataset.detectionType;
      extractFeatures();
      render();
    });
  });

  // Segmented Buttons: Shapes (Circle vs Square)
  document.querySelectorAll('[data-shape]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-shape]').forEach(function (b) {
        b.classList.remove('active');
      });
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
    document.querySelectorAll('.palette-swatch').forEach(function (s) {
      s.classList.remove('active');
    });
    swatch.classList.add('active');
    state.palette = {
      bg: swatch.dataset.bg,
      color: swatch.dataset.color,
      name: swatch.title
    };
    updateStatusFooter();
    render();
  });

  // Canvas Format Selection
  canvasSizeSelect.addEventListener('change', function () {
    state.format = canvasSizeSelect.value;
    updateStatusFooter();
    resizeCanvas();
    render();
  });

  // Image Loading
  function applyLoadedImage(img) {
    state.image = img;
    emptyState.classList.add('hidden');
    canvas.classList.add('visible');
    resizeCanvas();
    extractFeatures();
    render();
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

  // Preset Selection
  presetSelect.addEventListener('change', function () {
    var val = presetSelect.value;
    if (!val) return;
    var img = new Image();
    img.onload = function () {
      applyLoadedImage(img);
    };
    if (val === 'portrait') {
      img.src = 'assets/preset-portrait.png';
    } else {
      // Fallback to reference portrait
      img.src = 'assets/preset-portrait.png';
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
    var scale = fmt.w / canvas.width;
    drawScene(expCtx, fmt.w, fmt.h, scale);

    var link = document.createElement('a');
    link.download = 'blob-tracker-' + state.format + '-' + Date.now() + '.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  window.addEventListener('resize', function () {
    if (state.image) {
      resizeCanvas();
      render();
    }
  });

  syncValues();
  updateStatusFooter();

  // Load preset portrait automatically on init if exists
  var autoImg = new Image();
  autoImg.onload = function () {
    applyLoadedImage(autoImg);
    presetSelect.value = 'portrait';
  };
  autoImg.src = 'assets/preset-portrait.png';
})();
