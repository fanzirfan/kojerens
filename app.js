(function () {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var wrap = document.getElementById('canvasWrap');
  var imageInput = document.getElementById('imageInput');
  var imageHint = document.getElementById('imageHint');
  var emptyState = document.getElementById('emptyState');
  var fpsTag = document.getElementById('fpsTag');
  var countTag = document.getElementById('countTag');
  var resTag = document.getElementById('resTag');

  var S = {
    minR: document.getElementById('minRadius'),
    maxR: document.getElementById('maxRadius'),
    stroke: document.getElementById('stroke'),
    seed: document.getElementById('seed'),
    density: document.getElementById('density'),
    labelSz: document.getElementById('labelSize'),
    op: document.getElementById('opacity'),
    maxDist: document.getElementById('maxDistance'),
    lineW: document.getElementById('lineWeight'),
    trailLen: document.getElementById('trailLength')
  };

  var V = {
    minR: document.getElementById('minRadiusVal'),
    maxR: document.getElementById('maxRadiusVal'),
    stroke: document.getElementById('strokeVal'),
    seed: document.getElementById('seedVal'),
    density: document.getElementById('densityVal'),
    labelSz: document.getElementById('labelSizeVal'),
    op: document.getElementById('opacityVal'),
    maxDist: document.getElementById('maxDistanceVal'),
    lineW: document.getElementById('lineWeightVal'),
    trailLen: document.getElementById('trailLengthVal')
  };

  var lockSeed = document.getElementById('lockSeed');
  var randomizeBtn = document.getElementById('randomizeSeed');
  var redrawBtn = document.getElementById('redrawBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var customColor = document.getElementById('customColor');
  var showTrails = document.getElementById('showTrails');
  var paletteEl = document.getElementById('palette');

  var state = {
    image: null,
    blobs: [],
    focusBox: null,
    telemetry: { id: 'TRK-9842', conf: '98.7%' },
    color: '#d4a843',
    mode: 'hero'
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

  function readNum(el, def) {
    var n = parseFloat(el.value);
    return isNaN(n) ? def : n;
  }

  function extractImageFeatures(img, density, seed, minR, maxR, trailLen) {
    var maxDim = 400;
    var imgW = img.naturalWidth || img.width;
    var imgH = img.naturalHeight || img.height;
    var scale = Math.min(1, maxDim / Math.max(imgW, imgH));
    var aW = Math.max(50, Math.round(imgW * scale));
    var aH = Math.max(50, Math.round(imgH * scale));

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
        var avgSurround =
          (lum[yPrev + x] + lum[yNext + x] + lum[yCurr + x - 1] + lum[yCurr + x + 1]) * 0.25;
        var contrast = Math.abs(center - avgSurround);
        var highlight = center * center;

        var sal = grad * 0.55 + contrast * 0.3 + highlight * 0.15;
        saliency[yCurr + x] = sal;
        if (sal > maxSal) maxSal = sal;
      }
    }

    for (var k = 0; k < saliency.length; k++) {
      saliency[k] /= maxSal;
    }

    var gridX = Math.max(7, Math.min(28, Math.round(Math.sqrt(density * 2.8))));
    var gridY = Math.max(7, Math.min(28, Math.round(gridX * (aH / aW))));
    var cellW = aW / gridX;
    var cellH = aH / gridY;

    var rand = mulberry32(seed);
    var candidates = [];

    for (var gy = 0; gy < gridY; gy++) {
      for (var gx = 0; gx < gridX; gx++) {
        var startX = Math.floor(gx * cellW);
        var endX = Math.min(aW - 1, Math.floor((gx + 1) * cellW));
        var startY = Math.floor(gy * cellH);
        var endY = Math.min(aH - 1, Math.floor((gy + 1) * cellH));

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

        if (bestScore > 0.05) {
          var jitter = 0.8 + rand() * 0.4;
          candidates.push({
            nx: bestX / aW,
            ny: bestY / aH,
            rawScore: bestScore,
            score: bestScore * jitter,
            brightness: lum[bestY * aW + bestX]
          });
        }
      }
    }

    candidates.sort(function (a, b) {
      return b.score - a.score;
    });

    var selected = candidates.slice(0, density);

    if (selected.length < density) {
      for (var sIdx = 0; sIdx < density - selected.length; sIdx++) {
        var base = selected[sIdx % selected.length] || { nx: 0.5, ny: 0.5, rawScore: 0.5, brightness: 0.5 };
        selected.push({
          nx: Math.min(0.95, Math.max(0.05, base.nx + (rand() - 0.5) * 0.08)),
          ny: Math.min(0.95, Math.max(0.05, base.ny + (rand() - 0.5) * 0.08)),
          rawScore: base.rawScore * 0.85,
          score: base.rawScore * 0.85,
          brightness: base.brightness
        });
      }
    }

    var minX = 1, maxX = 0, minY = 1, maxY = 0;
    var topCount = Math.max(3, Math.min(12, Math.floor(selected.length * 0.4)));
    for (var tc = 0; tc < topCount; tc++) {
      var item = selected[tc];
      if (item.nx < minX) minX = item.nx;
      if (item.nx > maxX) maxX = item.nx;
      if (item.ny < minY) minY = item.ny;
      if (item.ny > maxY) maxY = item.ny;
    }

    var spanX = Math.max(0.1, maxX - minX);
    var spanY = Math.max(0.1, maxY - minY);
    var padX = spanX * 0.28;
    var padY = spanY * 0.28;
    var focusBox = {
      x1: Math.max(0.04, minX - padX),
      y1: Math.max(0.04, minY - padY),
      x2: Math.min(0.96, maxX + padX),
      y2: Math.min(0.96, maxY + padY)
    };

    var blobs = [];
    var majorIndices = [0, 1, 2];

    for (var b = 0; b < selected.length; b++) {
      var sel = selected[b];
      var isMajor = majorIndices.indexOf(b) !== -1;
      var hasDoubleCircle = isMajor || (b % 4 === 0 && sel.rawScore > 0.35);
      var hasGlow = sel.brightness > 0.65 || (b < 2 && sel.rawScore > 0.6);

      var radius;
      if (isMajor) {
        radius = maxR * (1.6 + rand() * 1.2);
      } else {
        radius = minR + sel.rawScore * (maxR - minR);
      }

      var id = Math.floor(rand() * 9000 + 1000);
      var leaderDir = rand() > 0.5 ? 1 : -1;
      var leaderVal = (sel.rawScore * 99).toFixed(1) + '%';

      var trail = [];
      var trailDir = rand() * Math.PI * 2;
      var trailCurve = (rand() - 0.5) * 0.8;
      for (var t = 0; t < trailLen; t++) {
        var step = (t + 1) / trailLen;
        var angle = trailDir + trailCurve * step;
        var dist = radius * 1.5 * step;
        trail.push({
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist
        });
      }

      blobs.push({
        nx: sel.nx,
        ny: sel.ny,
        r: radius,
        score: sel.rawScore,
        brightness: sel.brightness,
        isMajor: isMajor,
        hasDoubleCircle: hasDoubleCircle,
        hasGlow: hasGlow,
        hasLeader: b % 3 === 0,
        leaderDir: leaderDir,
        leaderVal: leaderVal,
        id: id,
        trail: trail
      });
    }

    return {
      blobs: blobs,
      focusBox: focusBox
    };
  }

  function loadImageFromFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        state.image = img;
        var origW = img.naturalWidth || img.width;
        var origH = img.naturalHeight || img.height;
        imageHint.textContent = file.name + ' · ' + origW + '×' + origH;
        emptyState.classList.add('hidden');
        canvas.classList.add('visible');
        resTag.textContent = origW + ' × ' + origH;
        resizeCanvas();
        regenerateBlobs();
        render();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function resizeCanvas() {
    if (!state.image) return;
    var rect = wrap.getBoundingClientRect();
    var pad = 48;
    var maxW = Math.max(200, rect.width - pad);
    var maxH = Math.max(200, rect.height - pad);
    var imgW = state.image.naturalWidth || state.image.width;
    var imgH = state.image.naturalHeight || state.image.height;
    var ratio = imgW / imgH;
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

  function regenerateBlobs() {
    if (!state.image) return;
    var seedVal = parseInt(S.seed.value, 10) || 1;
    var density = parseInt(S.density.value, 10);
    var minR = readNum(S.minR, 8);
    var maxR = readNum(S.maxR, 32);
    var trailLen = parseInt(S.trailLen.value, 10);

    var res = extractImageFeatures(state.image, density, seedVal, minR, maxR, trailLen);
    state.blobs = res.blobs;
    state.focusBox = res.focusBox;
    countTag.textContent = state.blobs.length + ' BLOBS';
  }

  function drawScene(targetCtx, targetW, targetH, scale) {
    scale = scale || 1;
    var opacity = parseInt(S.op.value, 10) / 100;
    var strokeW = Math.max(0.6 * scale, readNum(S.stroke, 1.5) * scale * 0.85);
    var lineW = Math.max(0.5 * scale, readNum(S.lineW, 0.8) * scale * 0.8);
    var labelSz = Math.max(7 * scale, Math.round(parseInt(S.labelSz.value, 10) * scale));
    var maxDist = parseInt(S.maxDist.value, 10) * scale * 1.1;
    var color = state.color;
    var showLabels = state.mode !== 'geo';
    var showLines = state.mode !== 'studio';
    var showCross = state.mode !== 'geo';

    targetCtx.clearRect(0, 0, targetW, targetH);
    targetCtx.setLineDash([]);
    targetCtx.globalAlpha = 1;
    targetCtx.drawImage(state.image, 0, 0, targetW, targetH);

    targetCtx.fillStyle = 'rgba(0, 0, 0, 0.26)';
    targetCtx.fillRect(0, 0, targetW, targetH);

    if (state.focusBox && showCross) {
      var bx1 = state.focusBox.x1 * targetW;
      var by1 = state.focusBox.y1 * targetH;
      var bw = (state.focusBox.x2 - state.focusBox.x1) * targetW;
      var bh = (state.focusBox.y2 - state.focusBox.y1) * targetH;

      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = lineW * 0.9;
      targetCtx.globalAlpha = opacity * 0.65;
      targetCtx.setLineDash([7 * scale, 5 * scale]);
      targetCtx.strokeRect(bx1, by1, bw, bh);

      targetCtx.setLineDash([]);
      var cornerLen = Math.min(bw, bh) * 0.08;
      targetCtx.beginPath();
      targetCtx.moveTo(bx1, by1 + cornerLen); targetCtx.lineTo(bx1, by1); targetCtx.lineTo(bx1 + cornerLen, by1);
      targetCtx.moveTo(bx1 + bw - cornerLen, by1); targetCtx.lineTo(bx1 + bw, by1); targetCtx.lineTo(bx1 + bw, by1 + cornerLen);
      targetCtx.moveTo(bx1, by1 + bh - cornerLen); targetCtx.lineTo(bx1, by1 + bh); targetCtx.lineTo(bx1 + cornerLen, by1 + bh);
      targetCtx.moveTo(bx1 + bw - cornerLen, by1 + bh); targetCtx.lineTo(bx1 + bw, by1 + bh); targetCtx.lineTo(bx1 + bw, by1 + bh - cornerLen);
      targetCtx.stroke();
      targetCtx.restore();
    }

    var i, j, a, b, ax, ay, bx, by, dx, dy, d, alpha;

    if (showLines && maxDist > 0 && state.blobs.length > 1) {
      for (i = 0; i < state.blobs.length; i++) {
        for (j = i + 1; j < state.blobs.length; j++) {
          a = state.blobs[i];
          b = state.blobs[j];
          ax = a.nx * targetW;
          ay = a.ny * targetH;
          bx = b.nx * targetW;
          by = b.ny * targetH;
          dx = ax - bx;
          dy = ay - by;
          d = Math.sqrt(dx * dx + dy * dy);

          if (d < maxDist) {
            alpha = 1 - d / maxDist;
            var isDashed = d > maxDist * 0.48;

            targetCtx.save();
            targetCtx.strokeStyle = color;
            targetCtx.lineWidth = lineW * (isDashed ? 0.75 : 1);
            targetCtx.globalAlpha = opacity * (isDashed ? 0.38 : 0.55) * alpha;

            if (isDashed) {
              targetCtx.setLineDash([3 * scale, 4 * scale]);
            } else {
              targetCtx.setLineDash([]);
            }

            targetCtx.beginPath();
            targetCtx.moveTo(ax, ay);
            targetCtx.lineTo(bx, by);
            targetCtx.stroke();
            targetCtx.restore();
          }
        }
      }
    }

    targetCtx.setLineDash([]);

    for (i = 0; i < state.blobs.length; i++) {
      var blob = state.blobs[i];
      var x = blob.nx * targetW;
      var y = blob.ny * targetH;
      var r = blob.r * scale;
      var score = blob.score;
      var id = blob.id;
      var trail = blob.trail;

      if (showTrails.checked && trail && trail.length > 0) {
        targetCtx.save();
        targetCtx.strokeStyle = color;
        targetCtx.lineWidth = lineW * 0.65;
        targetCtx.globalAlpha = opacity * 0.3;
        targetCtx.beginPath();
        targetCtx.moveTo(x, y);
        for (var k = 0; k < trail.length; k++) {
          targetCtx.lineTo(x + trail[k].dx * scale, y + trail[k].dy * scale);
        }
        targetCtx.stroke();
        targetCtx.restore();
      }

      var intensity = blob.isMajor ? 0.9 : 0.45 + score * 0.55;

      targetCtx.save();
      targetCtx.strokeStyle = color;
      targetCtx.globalAlpha = opacity * intensity * 0.9;
      targetCtx.lineWidth = blob.isMajor ? strokeW * 0.9 : strokeW;
      targetCtx.beginPath();
      targetCtx.arc(x, y, r, 0, Math.PI * 2);
      targetCtx.stroke();

      if (blob.hasDoubleCircle) {
        targetCtx.globalAlpha = opacity * intensity * 0.6;
        targetCtx.lineWidth = strokeW * 0.65;
        targetCtx.beginPath();
        targetCtx.arc(x, y, r * 0.45, 0, Math.PI * 2);
        targetCtx.stroke();
      }
      targetCtx.restore();

      if (showCross && !blob.isMajor) {
        targetCtx.save();
        targetCtx.strokeStyle = color;
        targetCtx.globalAlpha = opacity * 0.45;
        targetCtx.lineWidth = lineW * 0.85;
        var ch = Math.min(r + 4 * scale, r * 1.3);
        targetCtx.beginPath();
        targetCtx.moveTo(x - ch, y); targetCtx.lineTo(x - r - scale, y);
        targetCtx.moveTo(x + r + scale, y); targetCtx.lineTo(x + ch, y);
        targetCtx.moveTo(x, y - ch); targetCtx.lineTo(x, y - r - scale);
        targetCtx.moveTo(x, y + r + scale); targetCtx.lineTo(x, y + ch);
        targetCtx.stroke();
        targetCtx.restore();
      }

      targetCtx.save();
      if (blob.hasGlow) {
        targetCtx.fillStyle = '#ffffff';
        targetCtx.globalAlpha = opacity * 0.95;
        targetCtx.beginPath();
        targetCtx.arc(x, y, Math.max(2 * scale, strokeW * 1.1), 0, Math.PI * 2);
        targetCtx.fill();

        targetCtx.strokeStyle = color;
        targetCtx.lineWidth = 1 * scale;
        targetCtx.beginPath();
        targetCtx.arc(x, y, Math.max(3.5 * scale, strokeW * 1.8), 0, Math.PI * 2);
        targetCtx.stroke();
      } else {
        targetCtx.fillStyle = color;
        targetCtx.globalAlpha = opacity * 0.85;
        targetCtx.beginPath();
        targetCtx.arc(x, y, Math.max(1.3 * scale, strokeW * 0.75), 0, Math.PI * 2);
        targetCtx.fill();
      }
      targetCtx.restore();

      if (blob.hasLeader && showLabels && !blob.isMajor) {
        targetCtx.save();
        targetCtx.strokeStyle = color;
        targetCtx.lineWidth = lineW * 0.7;
        targetCtx.globalAlpha = opacity * 0.55;
        var dir = blob.leaderDir;
        var lxStart = x + dir * r;
        var lxEnd = lxStart + dir * 18 * scale;
        targetCtx.beginPath();
        targetCtx.moveTo(lxStart, y);
        targetCtx.lineTo(lxEnd, y);
        targetCtx.stroke();

        targetCtx.fillStyle = color;
        targetCtx.font = Math.max(7 * scale, labelSz - 2 * scale) + "px 'SF Mono','Menlo',monospace";
        targetCtx.textBaseline = 'bottom';
        targetCtx.textAlign = dir > 0 ? 'left' : 'right';
        targetCtx.fillText(blob.leaderVal, lxEnd + dir * 3 * scale, y - 1 * scale);
        targetCtx.restore();
      }

      if (showLabels && (blob.isMajor || score > 0.45)) {
        targetCtx.save();
        targetCtx.fillStyle = color;
        targetCtx.font = labelSz + "px 'SF Mono','Menlo',monospace";
        targetCtx.textBaseline = 'middle';
        targetCtx.globalAlpha = opacity * 0.85;
        var normX = (blob.nx * 100).toFixed(1);
        var normY = (blob.ny * 100).toFixed(1);
        targetCtx.fillText('x:' + normX, x + r + 4 * scale, y - 4 * scale);
        targetCtx.fillText('y:' + normY, x + r + 4 * scale, y + 6 * scale);

        targetCtx.globalAlpha = opacity * 0.5;
        targetCtx.font = Math.max(6 * scale, labelSz - 2 * scale) + "px 'SF Mono',monospace";
        targetCtx.fillText('#' + id, x - r * 0.4, y + r + 7 * scale);
        targetCtx.restore();
      }
    }

    if (showLabels) {
      targetCtx.save();
      targetCtx.fillStyle = color;
      targetCtx.font = Math.max(8 * scale, labelSz) + "px 'SF Mono','Menlo',monospace";
      targetCtx.globalAlpha = opacity * 0.65;
      targetCtx.textBaseline = 'top';
      targetCtx.fillText('FACIAL_GEO_TRACKING // ' + state.telemetry.id, 16 * scale, 16 * scale);

      targetCtx.textAlign = 'right';
      targetCtx.fillText(
        'CONF: ' + state.telemetry.conf + ' [LOCKED]',
        targetW - 16 * scale,
        16 * scale
      );

      targetCtx.textBaseline = 'bottom';
      targetCtx.textAlign = 'left';
      targetCtx.font = Math.max(7 * scale, labelSz - 2 * scale) + "px 'SF Mono',monospace";
      targetCtx.globalAlpha = opacity * 0.45;
      targetCtx.fillText('TOPOLOGY_3D_SURFACE', 16 * scale, targetH - 14 * scale);

      targetCtx.textAlign = 'right';
      targetCtx.fillText('SYS_OK // 100% CLIENT', targetW - 16 * scale, targetH - 14 * scale);
      targetCtx.restore();
    }

    targetCtx.globalAlpha = 1;
    targetCtx.setLineDash([]);
  }

  function render() {
    if (!state.image) return;
    drawScene(ctx, canvas.width, canvas.height, 1);
  }

  var frameCount = 0;
  var lastFpsUpdate = performance.now();
  function animate(now) {
    frameCount++;
    if (now - lastFpsUpdate >= 500) {
      var fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
      fpsTag.textContent = fps + ' FPS';
      frameCount = 0;
      lastFpsUpdate = now;
    }
    requestAnimationFrame(animate);
  }

  function syncVals() {
    V.minR.textContent = S.minR.value;
    V.maxR.textContent = S.maxR.value;
    V.stroke.textContent = S.stroke.value;
    V.seed.textContent = S.seed.value;
    V.density.textContent = S.density.value;
    V.labelSz.textContent = S.labelSz.value;
    V.op.textContent = S.op.value;
    V.maxDist.textContent = S.maxDist.value;
    V.lineW.textContent = S.lineW.value;
    V.trailLen.textContent = S.trailLen.value;
  }

  function bindSlider(el, needsRegen) {
    el.addEventListener('input', function () {
      syncVals();
      if (needsRegen) regenerateBlobs();
      render();
    });
  }

  ['minR', 'maxR', 'density', 'seed', 'trailLen'].forEach(function (k) {
    bindSlider(S[k], true);
  });
  ['stroke', 'labelSz', 'op', 'maxDist', 'lineW'].forEach(function (k) {
    bindSlider(S[k], false);
  });

  lockSeed.addEventListener('change', function () {
    S.seed.disabled = !lockSeed.checked;
  });

  function newSeed() {
    var n = Math.floor(Math.random() * 9999) + 1;
    S.seed.value = n;
    V.seed.textContent = n;
  }

  randomizeBtn.addEventListener('click', function () {
    newSeed();
    regenerateBlobs();
    render();
  });

  redrawBtn.addEventListener('click', function () {
    if (!lockSeed.checked) newSeed();
    regenerateBlobs();
    render();
  });

  downloadBtn.addEventListener('click', function () {
    if (!state.image) return;
    var fullW = state.image.naturalWidth || state.image.width;
    var fullH = state.image.naturalHeight || state.image.height;
    var exportCanvas = document.createElement('canvas');
    exportCanvas.width = fullW;
    exportCanvas.height = fullH;
    var exportCtx = exportCanvas.getContext('2d');
    var scale = fullW / canvas.width;
    drawScene(exportCtx, fullW, fullH, scale);

    var link = document.createElement('a');
    link.download = 'blob-tracker-' + Date.now() + '.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  });

  imageInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) {
      loadImageFromFile(file);
      imageInput.value = '';
    }
  });

  emptyState.addEventListener('click', function () {
    imageInput.click();
  });

  wrap.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.add('drag-over');
  });

  wrap.addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.remove('drag-over');
  });

  wrap.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.remove('drag-over');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) {
      loadImageFromFile(files[0]);
    }
  });

  window.addEventListener('paste', function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        var blob = items[i].getAsFile();
        if (blob) {
          loadImageFromFile(blob);
          break;
        }
      }
    }
  });

  paletteEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.swatch');
    if (!btn) return;
    var all = paletteEl.querySelectorAll('.swatch');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
    btn.classList.add('active');
    state.color = btn.dataset.color;
    customColor.value = state.color;
    render();
  });

  customColor.addEventListener('input', function () {
    state.color = customColor.value;
    var all = paletteEl.querySelectorAll('.swatch');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
    render();
  });

  showTrails.addEventListener('change', render);

  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) {
    (function (tab) {
      tab.addEventListener('click', function () {
        for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('active');
        tab.classList.add('active');
        state.mode = tab.dataset.mode;
        render();
      });
    })(tabs[i]);
  }

  window.addEventListener('resize', function () {
    if (state.image) {
      resizeCanvas();
      render();
    }
  });

  syncVals();
  requestAnimationFrame(animate);
})();
