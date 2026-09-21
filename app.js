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
    sampleData: null,
    sampleW: 0,
    sampleH: 0,
    blobs: [],
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

  function createSampleData(img) {
    var sampleCanvas = document.createElement('canvas');
    var maxDim = 800;
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    sampleCanvas.width = w;
    sampleCanvas.height = h;
    var sCtx = sampleCanvas.getContext('2d');
    sCtx.drawImage(img, 0, 0, w, h);
    try {
      state.sampleData = sCtx.getImageData(0, 0, w, h).data;
      state.sampleW = w;
      state.sampleH = h;
    } catch (err) {
      state.sampleData = null;
      state.sampleW = 0;
      state.sampleH = 0;
    }
  }

  function sampleBrightness(nx, ny) {
    if (!state.sampleData || state.sampleW === 0 || state.sampleH === 0) {
      return 0.5;
    }
    var px = Math.min(state.sampleW - 1, Math.max(0, Math.floor(nx * state.sampleW)));
    var py = Math.min(state.sampleH - 1, Math.max(0, Math.floor(ny * state.sampleH)));
    var idx = (py * state.sampleW + px) * 4;
    var r = state.sampleData[idx];
    var g = state.sampleData[idx + 1];
    var b = state.sampleData[idx + 2];
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function loadImageFromFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        state.image = img;
        createSampleData(img);
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
    var rand = mulberry32(seedVal);
    var density = parseInt(S.density.value, 10);
    var minR = readNum(S.minR, 8);
    var maxR = readNum(S.maxR, 32);
    var trailLen = parseInt(S.trailLen.value, 10);
    var blobs = [];

    for (var i = 0; i < density; i++) {
      var nx = 0.05 + rand() * 0.9;
      var ny = 0.05 + rand() * 0.9;
      var imgBrightness = sampleBrightness(nx, ny);
      var score = Math.min(1, Math.max(0, imgBrightness * 0.8 + rand() * 0.2));
      var r = minR + score * (maxR - minR);
      var id = Math.floor(rand() * 9000 + 1000);
      var trail = [];
      var trailDir = rand() * Math.PI * 2;
      var trailCurve = (rand() - 0.5) * 0.8;

      for (var t = 0; t < trailLen; t++) {
        var step = (t + 1) / trailLen;
        var angle = trailDir + trailCurve * step;
        var dist = r * 1.6 * step;
        trail.push({
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist
        });
      }

      blobs.push({
        nx: nx,
        ny: ny,
        r: r,
        score: score,
        id: id,
        trail: trail
      });
    }

    state.blobs = blobs;
    countTag.textContent = blobs.length + ' BLOBS';
  }

  function drawScene(targetCtx, targetW, targetH, scale) {
    scale = scale || 1;
    var opacity = parseInt(S.op.value, 10) / 100;
    var strokeW = readNum(S.stroke, 1.5) * scale;
    var lineW = readNum(S.lineW, 0.8) * scale;
    var labelSz = Math.round(parseInt(S.labelSz.value, 10) * scale);
    var maxDist = parseInt(S.maxDist.value, 10) * scale;
    var color = state.color;
    var showLabels = state.mode !== 'geo';
    var showLines = state.mode !== 'studio';
    var showCross = state.mode !== 'geo';

    targetCtx.clearRect(0, 0, targetW, targetH);
    targetCtx.globalAlpha = 1;
    targetCtx.drawImage(state.image, 0, 0, targetW, targetH);
    targetCtx.fillStyle = 'rgba(0,0,0,0.25)';
    targetCtx.fillRect(0, 0, targetW, targetH);

    var i, j, a, b, ax, ay, bx, by, dx, dy, d, alpha;

    if (showLines && maxDist > 0) {
      targetCtx.strokeStyle = color;
      targetCtx.lineWidth = lineW;
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
            targetCtx.globalAlpha = opacity * 0.5 * alpha;
            targetCtx.beginPath();
            targetCtx.moveTo(ax, ay);
            targetCtx.lineTo(bx, by);
            targetCtx.stroke();
          }
        }
      }
    }

    targetCtx.globalAlpha = opacity;

    for (i = 0; i < state.blobs.length; i++) {
      var blob = state.blobs[i];
      var x = blob.nx * targetW;
      var y = blob.ny * targetH;
      var r = blob.r * scale;
      var score = blob.score;
      var id = blob.id;
      var trail = blob.trail;

      if (showTrails.checked && trail.length > 0) {
        targetCtx.strokeStyle = color;
        targetCtx.lineWidth = lineW * 0.6;
        targetCtx.globalAlpha = opacity * 0.35;
        targetCtx.beginPath();
        targetCtx.moveTo(x, y);
        for (var k = 0; k < trail.length; k++) {
          targetCtx.lineTo(x + trail[k].dx * scale, y + trail[k].dy * scale);
        }
        targetCtx.stroke();
        targetCtx.globalAlpha = opacity;
      }

      var intensity = 0.35 + score * 0.65;

      targetCtx.strokeStyle = color;
      targetCtx.globalAlpha = opacity * intensity;
      targetCtx.lineWidth = strokeW;
      targetCtx.beginPath();
      targetCtx.arc(x, y, r, 0, Math.PI * 2);
      targetCtx.stroke();

      targetCtx.globalAlpha = opacity * intensity * 0.7;
      targetCtx.lineWidth = strokeW * 0.6;
      targetCtx.beginPath();
      targetCtx.arc(x, y, r * 0.6, 0, Math.PI * 2);
      targetCtx.stroke();

      if (showCross) {
        targetCtx.globalAlpha = opacity * 0.55;
        targetCtx.lineWidth = lineW;
        var ch = r + 5 * scale;
        targetCtx.beginPath();
        targetCtx.moveTo(x - ch, y);
        targetCtx.lineTo(x - r - scale, y);
        targetCtx.moveTo(x + r + scale, y);
        targetCtx.lineTo(x + ch, y);
        targetCtx.moveTo(x, y - ch);
        targetCtx.lineTo(x, y - r - scale);
        targetCtx.moveTo(x, y + r + scale);
        targetCtx.lineTo(x, y + ch);
        targetCtx.stroke();
      }

      targetCtx.globalAlpha = opacity;
      targetCtx.fillStyle = color;
      targetCtx.beginPath();
      targetCtx.arc(x, y, Math.max(1.5 * scale, strokeW * 0.8), 0, Math.PI * 2);
      targetCtx.fill();

      if (showLabels) {
        targetCtx.globalAlpha = opacity * 0.9;
        targetCtx.fillStyle = color;
        targetCtx.font = labelSz + "px 'SF Mono','Menlo',monospace";
        targetCtx.textBaseline = 'middle';
        var lx = (blob.nx * 100).toFixed(1);
        var ly = (blob.ny * 100).toFixed(1);
        targetCtx.fillText('x:' + lx, x + r + 4 * scale, y - 5 * scale);
        targetCtx.fillText('y:' + ly, x + r + 4 * scale, y + 5 * scale);
        targetCtx.globalAlpha = opacity * 0.5;
        targetCtx.font = Math.max(6 * scale, labelSz - 2 * scale) + "px 'SF Mono',monospace";
        targetCtx.fillText('#' + id, x - r * 0.5, y + r + 8 * scale);
      }
    }

    targetCtx.globalAlpha = 1;
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
