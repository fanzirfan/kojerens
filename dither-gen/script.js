/**
 * KOJERENS 1-BIT DITHER MATRIX : CORE ENGINE
 * Generative Visual & Computational Laboratory
 * Author: Fanz Irfan | URL: manji.eu.org
 */

(function () {
  'use strict';

  // State
  var state = {
    file: null,
    image: null,
    rawImage: null, // Preserves source image for crop resets
    engine: 'atkinson',
    palette: 'mac',
    customBg: '#05060f',
    customFg: '#ffffff',
    invertPalette: false,
    pixelScale: 1,
    brightness: 0,
    contrast: 0,
    gamma: 1.0,
    thresholdBias: 0,
    edgeSharpen: 0,
    serpentine: true,
    halftoneAngle: 45,
    halftoneFreq: 24,
    fileOpacity: 1.0,
    format: 'portrait_3_4',
    customW: 1200,
    customH: 1600,
    frameText: true,
    frameTL: 'Dither Matrix / Studio',
    frameTR: 'Fanz Irfan',
    frameBL: 'manji.eu.org',
    frameBR: 'Indonesia',
    frameTextSize: 12
  };

  var FORMATS = {
    portrait_3_4: { w: 1200, h: 1600, name: 'Portrait 3:4' },
    portrait_9_16: { w: 1080, h: 1920, name: 'Portrait 9:16' },
    portrait_2_3: { w: 1200, h: 1800, name: 'Portrait 2:3' },
    landscape_4_3: { w: 1600, h: 1200, name: 'Landscape 4:3' },
    landscape_16_9: { w: 1920, h: 1080, name: 'Landscape 16:9' },
    landscape_3_2: { w: 1800, h: 1200, name: 'Landscape 3:2' },
    square_1_1: { w: 1200, h: 1200, name: 'Square 1:1' }
  };

  var PALETTES = {
    mac: { name: 'Mac 1984', bg: '#000000', fg: '#ffffff' },
    gameboy: { name: 'Game Boy', bg: '#0f380f', fg: '#8bac0f' },
    phosphor: { name: 'Phosphor', bg: '#030c03', fg: '#00ff41' },
    amber: { name: 'Amber CRT', bg: '#0d0700', fg: '#ffb000' },
    cyberpunk: { name: 'Cyberpunk', bg: '#05060f', fg: '#8b5cf6' },
    blueprint: { name: 'Blueprint', bg: '#03162b', fg: '#64d2ff' },
    solarized: { name: 'Solarized', bg: '#073642', fg: '#eee8d5' },
    tokyo: { name: 'Tokyo Neon', bg: '#0b0314', fg: '#ff2a85' },
    newsprint: { name: 'Newsprint', bg: '#181818', fg: '#f2ebdb' },
    thermal: { name: 'Thermal', bg: '#1c000d', fg: '#ff3b30' },
    commodore: { name: 'C64 Indigo', bg: '#352879', fg: '#86b5e5' },
    spectrum: { name: 'ZX Cyan', bg: '#000000', fg: '#00e5ff' }
  };

  // Bayer Matrices
  var BAYER_2 = [
    [0, 2],
    [3, 1]
  ];

  var BAYER_4 = [
    [0,  8,  2, 10],
    [12, 4, 14,  6],
    [3, 11,  1,  9],
    [15, 7, 13,  5]
  ];

  var BAYER_8 = [
    [0,  32,  8, 40,  2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44,  4, 36, 14, 46,  6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3,  35, 11, 43,  1, 33,  9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];

  var DEMO_FILES = {
    street: '../assets/demo/jack-berry-aVu_orLM3Mc-unsplash.jpg',
    arch: '../assets/demo/dmytro-koplyk-kdN49Gc01_0-unsplash.jpg',
    portrait: '../assets/demo/karsten-winegeart-MB2JolPeFcg-unsplash.jpg'
  };

  // Zoom & Pan State
  var zoomState = {
    scale: 1.0,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0
  };

  // Interactive Crop State
  var cropState = {
    scale: 1,
    startX: 0,
    startY: 0,
    w: 0,
    h: 0,
    imgW: 0,
    imgH: 0,
    dragging: false,
    dragMode: null,
    offsetX: 0,
    offsetY: 0,
    ratio: 'free'
  };

  // DOM Elements
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  var wrap = document.getElementById('canvasWrap');
  var emptyState = document.getElementById('emptyState');
  var fileInput = document.getElementById('fileInput');
  var replaceFileBtn = document.getElementById('replaceFileBtn');
  var loadSampleBtn = document.getElementById('loadSampleBtn');
  var emptyLoadSampleBtn = document.getElementById('emptyLoadSampleBtn');
  var demoPickerPanel = document.getElementById('demoPickerPanel');
  var panelDrawer = document.getElementById('panelDrawer');

  // Zoom DOM Elements
  var zoomInBtn = document.getElementById('zoomInBtn');
  var zoomOutBtn = document.getElementById('zoomOutBtn');
  var zoomFitBtn = document.getElementById('zoomFitBtn');
  var zoomVal = document.getElementById('zoomVal');

  // Crop DOM Elements
  var cropBtn = document.getElementById('cropBtn');
  var cropModal = document.getElementById('cropModal');
  var cropCanvas = document.getElementById('cropCanvas');
  var cropCtx = cropCanvas ? cropCanvas.getContext('2d') : null;
  var cropCancelBtn = document.getElementById('cropCancelBtn');
  var cropResetBtn = document.getElementById('cropResetBtn');
  var cropApplyBtn = document.getElementById('cropApplyBtn');
  var cropInfoText = document.getElementById('cropInfoText');

  // Value Displays
  var engineSelect = document.getElementById('engineSelect');
  var engineNameVal = document.getElementById('engineNameVal');
  var serpentineVal = document.getElementById('serpentineVal');
  var serpentineToggleBtn = document.getElementById('serpentineToggleBtn');
  var halftoneControlsGroup = document.getElementById('halftoneControlsGroup');
  var halftoneAngleSlider = document.getElementById('halftoneAngle');
  var halftoneAngleVal = document.getElementById('halftoneAngleVal');
  var halftoneFreqSlider = document.getElementById('halftoneFreq');
  var halftoneFreqVal = document.getElementById('halftoneFreqVal');
  var fileOpacitySlider = document.getElementById('fileOpacity');
  var fileOpacityVal = document.getElementById('fileOpacityVal');

  // Palette Controls
  var paletteGrid = document.getElementById('paletteGrid');
  var palettePresetVal = document.getElementById('palettePresetVal');
  var bgColorPicker = document.getElementById('bgColorPicker');
  var bgColorText = document.getElementById('bgColorText');
  var fgColorPicker = document.getElementById('fgColorPicker');
  var fgColorText = document.getElementById('fgColorText');
  var invertToggleBtn = document.getElementById('invertToggleBtn');

  // Scale Controls
  var pixelScaleGroup = document.getElementById('pixelScaleGroup');
  var pixelScaleVal = document.getElementById('pixelScaleVal');

  // Telemetry
  var chipRes = document.getElementById('chipRes');
  var chipGrid = document.getElementById('chipGrid');
  var chipCoverage = document.getElementById('chipCoverage');
  var chipTime = document.getElementById('chipTime');

  // Levels Controls
  var brightnessSlider = document.getElementById('brightness');
  var brightnessVal = document.getElementById('brightnessVal');
  var contrastSlider = document.getElementById('contrast');
  var contrastVal = document.getElementById('contrastVal');
  var gammaSlider = document.getElementById('gamma');
  var gammaVal = document.getElementById('gammaVal');
  var thresholdBiasSlider = document.getElementById('thresholdBias');
  var thresholdBiasVal = document.getElementById('thresholdBiasVal');
  var edgeSharpenSlider = document.getElementById('edgeSharpen');
  var edgeSharpenVal = document.getElementById('edgeSharpenVal');

  // Size Controls
  var formatSelect = document.getElementById('formatSelect');
  var formatPresetVal = document.getElementById('formatPresetVal');
  var customDimensionsGroup = document.getElementById('customDimensionsGroup');
  var customWidthInput = document.getElementById('customWidthInput');
  var customHeightInput = document.getElementById('customHeightInput');

  // Frame Text Controls
  var frameTextToggleBtn = document.getElementById('frameTextToggleBtn');
  var frameTextStateVal = document.getElementById('frameTextStateVal');
  var frameTextControls = document.getElementById('frameTextControls');
  var frameTextTL = document.getElementById('frameTextTL');
  var frameTextTR = document.getElementById('frameTextTR');
  var frameTextBL = document.getElementById('frameTextBL');
  var frameTextBR = document.getElementById('frameTextBR');
  var frameTextSizeSlider = document.getElementById('frameTextSize');
  var frameTextSizeVal = document.getElementById('frameTextSizeVal');

  // Actions
  var downloadBtn = document.getElementById('downloadBtn');
  var topbarDownloadBtn = document.getElementById('topbarDownloadBtn');
  var downloadOverlayBtn = document.getElementById('downloadOverlayBtn');
  var downloadSvgBtn = document.getElementById('downloadSvgBtn');
  var randomizeSettingsBtn = document.getElementById('randomizeSettingsBtn');
  var topbarRandomBtn = document.getElementById('topbarRandomBtn');
  var exportStatusText = document.getElementById('exportStatusText');

  // Offscreen Buffers
  var offscreenCanvas = document.createElement('canvas');
  var offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

  // RAF scheduler
  var updatePending = false;
  function scheduleUpdate() {
    if (updatePending) return;
    updatePending = true;
    requestAnimationFrame(function () {
      updatePending = false;
      renderDither();
    });
  }

  // Active Canvas Dimensions
  function getActiveDimensions() {
    if (state.format === 'custom') {
      return {
        w: Math.max(100, Math.min(6000, parseInt(customWidthInput.value, 10) || 1200)),
        h: Math.max(100, Math.min(6000, parseInt(customHeightInput.value, 10) || 1600)),
        name: 'Custom'
      };
    }
    if (state.format === 'original' && state.image) {
      return {
        w: state.image.naturalWidth || state.image.width || 1200,
        h: state.image.naturalHeight || state.image.height || 1600,
        name: 'Original'
      };
    }
    var fmt = FORMATS[state.format] || FORMATS.portrait_3_4;
    return { w: fmt.w, h: fmt.h, name: fmt.name };
  }

  // Active Colors
  function getColors() {
    var bgHex = state.palette === 'custom' ? state.customBg : (PALETTES[state.palette] ? PALETTES[state.palette].bg : '#000000');
    var fgHex = state.palette === 'custom' ? state.customFg : (PALETTES[state.palette] ? PALETTES[state.palette].fg : '#ffffff');
    if (state.invertPalette) {
      var tmp = bgHex;
      bgHex = fgHex;
      fgHex = tmp;
    }
    return {
      bgHex: bgHex,
      fgHex: fgHex,
      bg: hexToRgb(bgHex),
      fg: hexToRgb(fgHex)
    };
  }

  function hexToRgb(hex) {
    hex = (hex || '#000000').replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var num = parseInt(hex, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Procedural Demo Graphic
  function createDemoImage() {
    var c = document.createElement('canvas');
    c.width = 1200;
    c.height = 1600;
    var cx = c.getContext('2d');

    // Deep gradient background
    var bgGrad = cx.createRadialGradient(600, 700, 50, 600, 800, 900);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.35, '#888888');
    bgGrad.addColorStop(0.7, '#222222');
    bgGrad.addColorStop(1, '#000000');
    cx.fillStyle = bgGrad;
    cx.fillRect(0, 0, 1200, 1600);

    // Cyber sphere / geometric composition
    cx.save();
    cx.strokeStyle = '#ffffff';
    cx.lineWidth = 4;
    cx.beginPath();
    cx.arc(600, 680, 360, 0, Math.PI * 2);
    cx.stroke();

    for (var i = 1; i <= 8; i++) {
      cx.beginPath();
      cx.arc(600, 680, i * 42, 0, Math.PI * 2);
      cx.strokeStyle = 'rgba(255, 255, 255, ' + (0.9 - i * 0.1) + ')';
      cx.lineWidth = 2;
      cx.stroke();
    }

    // Grid rays
    for (var a = 0; a < 360; a += 15) {
      var rad = (a * Math.PI) / 180;
      cx.beginPath();
      cx.moveTo(600 + Math.cos(rad) * 120, 680 + Math.sin(rad) * 120);
      cx.lineTo(600 + Math.cos(rad) * 500, 680 + Math.sin(rad) * 500);
      cx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      cx.stroke();
    }

    // Typography in demo
    cx.fillStyle = '#ffffff';
    cx.font = 'bold 72px "Space Grotesk", sans-serif';
    cx.textAlign = 'center';
    cx.fillText('KOJERENS', 600, 1250);

    cx.font = '24px "JetBrains Mono", monospace';
    cx.fillStyle = '#cccccc';
    cx.fillText('1-BIT DITHER SYNTHESIZER', 600, 1310);
    cx.restore();

    var img = new Image();
    img.src = c.toDataURL('image/png');
    img.onload = function () {
      state.rawImage = img;
      applyLoadedFile(img);
    };
  }

  function loadDemoAsset(key) {
    if (demoPickerPanel) {
      demoPickerPanel.style.display = 'none';
    }
    if (key === 'procedural') {
      createDemoImage();
      return;
    }
    var src = (typeof window !== 'undefined' && window.DEMO_ASSETS && window.DEMO_ASSETS[key]) || DEMO_FILES[key];
    if (!src) return;

    var img = new Image();
    img.onload = function () {
      state.rawImage = img;
      applyLoadedFile(img);
      if (window.StudioPipeline) {
        StudioPipeline.showToast('Loaded ' + key + ' demo asset');
      }
    };
    img.onerror = function () {
      createDemoImage();
    };
    img.src = src;
  }

  // Load Source File
  function applyLoadedFile(img) {
    state.image = img;
    state.rawImage = img;
    emptyState.classList.add('hidden');
    resizeCanvasViewport();
    scheduleUpdate();
  }

  function loadFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        state.rawImage = img;
        applyLoadedFile(img);
      };
      img.onerror = function () {
        alert('Could not render this file as visual media. Please select an image or graphic file (PNG, JPG, WebP, SVG, GIF, AVIF, BMP).');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyZoomTransform() {
    canvas.style.transform = 'translate(' + zoomState.panX + 'px, ' + zoomState.panY + 'px) scale(' + zoomState.scale + ')';
    canvas.style.transformOrigin = 'center center';
    canvas.style.cursor = zoomState.scale > 1 ? (zoomState.isPanning ? 'grabbing' : 'grab') : 'crosshair';
    if (zoomVal) {
      zoomVal.textContent = Math.round(zoomState.scale * 100) + '%';
    }
  }

  // Resize Viewport Canvas to fit inside .stage
  function resizeCanvasViewport() {
    var dim = getActiveDimensions();
    canvas.width = dim.w;
    canvas.height = dim.h;

    var wrapRect = wrap.getBoundingClientRect();
    var pad = wrapRect.width < 600 ? 16 : 40;
    var maxW = Math.max(80, wrapRect.width - pad);
    var maxH = Math.max(80, wrapRect.height - pad);
    var ratio = dim.w / dim.h;

    var dispW = maxW;
    var dispH = dispW / ratio;
    if (dispH > maxH) {
      dispH = maxH;
      dispW = dispH * ratio;
    }

    canvas.style.width = Math.round(dispW) + 'px';
    canvas.style.height = Math.round(dispH) + 'px';
    applyZoomTransform();
  }

  // ==========================================================================
  // INTERACTIVE CROP TOOL
  // ==========================================================================
  function openCropModal() {
    var sourceImg = state.rawImage || state.image;
    if (!sourceImg) {
      if (window.StudioPipeline) StudioPipeline.showToast('Please load an image to crop');
      return;
    }

    cropModal.style.display = 'flex';
    var wrapRect = document.getElementById('cropStageWrap').getBoundingClientRect();
    var maxW = Math.min(800, wrapRect.width - 32);
    var maxH = Math.min(500, wrapRect.height - 32);

    cropState.imgW = sourceImg.naturalWidth || sourceImg.width;
    cropState.imgH = sourceImg.naturalHeight || sourceImg.height;

    var s = Math.min(maxW / cropState.imgW, maxH / cropState.imgH, 1);
    cropState.scale = s;
    cropCanvas.width = Math.round(cropState.imgW * s);
    cropCanvas.height = Math.round(cropState.imgH * s);

    // Default crop box (80% centered)
    cropState.startX = Math.round(cropCanvas.width * 0.1);
    cropState.startY = Math.round(cropCanvas.height * 0.1);
    cropState.w = Math.round(cropCanvas.width * 0.8);
    cropState.h = Math.round(cropCanvas.height * 0.8);

    drawCropCanvas();
  }

  function drawCropCanvas() {
    if (!cropCtx) return;
    var sourceImg = state.rawImage || state.image;
    var cw = cropCanvas.width;
    var ch = cropCanvas.height;

    cropCtx.clearRect(0, 0, cw, ch);
    cropCtx.drawImage(sourceImg, 0, 0, cw, ch);

    // Dim overlay
    cropCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    cropCtx.fillRect(0, 0, cw, cropState.startY);
    cropCtx.fillRect(0, cropState.startY + cropState.h, cw, ch - (cropState.startY + cropState.h));
    cropCtx.fillRect(0, cropState.startY, cropState.startX, cropState.h);
    cropCtx.fillRect(cropState.startX + cropState.w, cropState.startY, cw - (cropState.startX + cropState.w), cropState.h);

    // Crop box outline
    cropCtx.strokeStyle = '#ffffff';
    cropCtx.lineWidth = 1.5;
    cropCtx.strokeRect(cropState.startX, cropState.startY, cropState.w, cropState.h);

    // Rule of thirds
    cropCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    cropCtx.lineWidth = 1;
    var thirdW = cropState.w / 3;
    var thirdH = cropState.h / 3;
    cropCtx.beginPath();
    cropCtx.moveTo(cropState.startX + thirdW, cropState.startY); cropCtx.lineTo(cropState.startX + thirdW, cropState.startY + cropState.h);
    cropCtx.moveTo(cropState.startX + thirdW * 2, cropState.startY); cropCtx.lineTo(cropState.startX + thirdW * 2, cropState.startY + cropState.h);
    cropCtx.moveTo(cropState.startX, cropState.startY + thirdH); cropCtx.lineTo(cropState.startX + cropState.w, cropState.startY + thirdH);
    cropCtx.moveTo(cropState.startX, cropState.startY + thirdH * 2); cropCtx.lineTo(cropState.startX + cropState.w, cropState.startY + thirdH * 2);
    cropCtx.stroke();

    // Corner handle blocks
    cropCtx.fillStyle = '#663af3';
    var handleSize = 8;
    cropCtx.fillRect(cropState.startX - handleSize/2, cropState.startY - handleSize/2, handleSize, handleSize);
    cropCtx.fillRect(cropState.startX + cropState.w - handleSize/2, cropState.startY - handleSize/2, handleSize, handleSize);
    cropCtx.fillRect(cropState.startX - handleSize/2, cropState.startY + cropState.h - handleSize/2, handleSize, handleSize);
    cropCtx.fillRect(cropState.startX + cropState.w - handleSize/2, cropState.startY + cropState.h - handleSize/2, handleSize, handleSize);

    // Pixel readout
    var origW = Math.round(cropState.w / cropState.scale);
    var origH = Math.round(cropState.h / cropState.scale);
    if (cropInfoText) {
      cropInfoText.textContent = 'Crop Area: ' + origW + ' × ' + origH + ' px (' + cropState.ratio.toUpperCase() + ')';
    }
  }

  function applyCrop() {
    var sourceImg = state.rawImage || state.image;
    if (!sourceImg) return;

    var origX = Math.round(cropState.startX / cropState.scale);
    var origY = Math.round(cropState.startY / cropState.scale);
    var origW = Math.round(cropState.w / cropState.scale);
    var origH = Math.round(cropState.h / cropState.scale);

    var cCanvas = document.createElement('canvas');
    cCanvas.width = origW;
    cCanvas.height = origH;
    var cCtx = cCanvas.getContext('2d');
    cCtx.drawImage(sourceImg, origX, origY, origW, origH, 0, 0, origW, origH);

    var croppedImg = new Image();
    croppedImg.onload = function () {
      applyLoadedFile(croppedImg);
      cropModal.style.display = 'none';
      if (window.StudioPipeline) {
        StudioPipeline.showToast('Applied image crop (' + origW + 'x' + origH + ')');
      }
    };
    croppedImg.src = cCanvas.toDataURL('image/png');
  }

  // CORE RENDER PIPELINE
  function renderDither(targetCtx, targetW, targetH, isTransparent) {
    var t0 = performance.now();
    var destCtx = targetCtx || ctx;
    var dim = getActiveDimensions();
    var finalW = targetW || dim.w;
    var finalH = targetH || dim.h;

    if (destCtx === ctx) {
      destCtx.clearRect(0, 0, finalW, finalH);
    }

    if (!state.image) {
      return;
    }

    var scale = Math.max(1, state.pixelScale);
    var ditherW = Math.max(1, Math.floor(finalW / scale));
    var ditherH = Math.max(1, Math.floor(finalH / scale));

    // Draw source image into offscreen buffer scaled to dither grid
    offscreenCanvas.width = ditherW;
    offscreenCanvas.height = ditherH;

    // Background fill on offscreen
    offscreenCtx.fillStyle = '#000000';
    offscreenCtx.fillRect(0, 0, ditherW, ditherH);

    // Compute aspect-fit source image
    var imgW = state.image.naturalWidth || state.image.width || ditherW;
    var imgH = state.image.naturalHeight || state.image.height || ditherH;
    var imgRatio = imgW / imgH;
    var destRatio = ditherW / ditherH;

    var renderW, renderH, renderX, renderY;
    if (imgRatio > destRatio) {
      renderW = ditherW;
      renderH = renderW / imgRatio;
      renderX = 0;
      renderY = (ditherH - renderH) / 2;
    } else {
      renderH = ditherH;
      renderW = renderH * imgRatio;
      renderX = (ditherW - renderW) / 2;
      renderY = 0;
    }

    offscreenCtx.drawImage(state.image, renderX, renderY, renderW, renderH);

    var srcData = offscreenCtx.getImageData(0, 0, ditherW, ditherH);
    var pixels = srcData.data;
    var totalPixels = ditherW * ditherH;

    // Luminance array (float for error distribution)
    var lum = new Float32Array(totalPixels);

    var bAdjust = state.brightness * 1.28;
    var cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
    var invGamma = 1 / Math.max(0.1, state.gamma);

    for (var i = 0; i < totalPixels; i++) {
      var p = i * 4;
      // Perceptual Rec. 709 Luminance
      var val = 0.2126 * pixels[p] + 0.7152 * pixels[p + 1] + 0.0722 * pixels[p + 2];

      // Brightness
      val += bAdjust;

      // Contrast
      val = cFactor * (val - 128) + 128;

      // Gamma
      val = 255 * Math.pow(Math.max(0, Math.min(1, val / 255)), invGamma);

      lum[i] = Math.max(0, Math.min(255, val));
    }

    // Optional Edge Sharpening (Sobel 3x3 High-Pass)
    if (state.edgeSharpen > 0) {
      var sharpAmount = state.edgeSharpen / 100;
      var sharpLum = new Float32Array(lum);
      for (var y = 1; y < ditherH - 1; y++) {
        for (var x = 1; x < ditherW - 1; x++) {
          var idx = y * ditherW + x;
          var center = sharpLum[idx];
          var laplacian = center * 4 -
            sharpLum[idx - 1] -
            sharpLum[idx + 1] -
            sharpLum[idx - ditherW] -
            sharpLum[idx + ditherW];
          lum[idx] = Math.max(0, Math.min(255, center + laplacian * sharpAmount));
        }
      }
    }

    // Binary Dither Buffer: 1 = FG (white/dot), 0 = BG (black)
    var binary = new Uint8Array(totalPixels);
    var threshold = Math.max(0, Math.min(255, 128 + state.thresholdBias * 1.28));

    // RUN CHOSEN DITHER ENGINE
    runDitherEngine(state.engine, lum, binary, ditherW, ditherH, threshold);

    // Compute Dot Coverage %
    var dotCount = 0;
    for (var b = 0; b < totalPixels; b++) {
      if (binary[b] === 1) dotCount++;
    }
    var coveragePct = ((dotCount / totalPixels) * 100).toFixed(1);

    // PALETTE RENDERING
    var colors = getColors();
    var outData = offscreenCtx.createImageData(ditherW, ditherH);
    var outPixels = outData.data;

    var bgR = colors.bg.r, bgG = colors.bg.g, bgB = colors.bg.b;
    var fgR = colors.fg.r, fgG = colors.fg.g, fgB = colors.fg.b;
    var bgAlpha = isTransparent ? 0 : 255;
    var fgAlpha = Math.round(255 * state.fileOpacity);

    for (var bi = 0; bi < totalPixels; bi++) {
      var pi = bi * 4;
      if (binary[bi] === 1) {
        outPixels[pi] = fgR;
        outPixels[pi + 1] = fgG;
        outPixels[pi + 2] = fgB;
        outPixels[pi + 3] = fgAlpha;
      } else {
        outPixels[pi] = bgR;
        outPixels[pi + 1] = bgG;
        outPixels[pi + 2] = bgB;
        outPixels[pi + 3] = bgAlpha;
      }
    }

    offscreenCtx.putImageData(outData, 0, 0);

    // Draw to destination canvas with crisp nearest-neighbor integer scaling
    destCtx.save();
    destCtx.imageSmoothingEnabled = false;
    destCtx.mozImageSmoothingEnabled = false;
    destCtx.webkitImageSmoothingEnabled = false;
    destCtx.msImageSmoothingEnabled = false;

    if (!isTransparent) {
      destCtx.fillStyle = colors.bgHex;
      destCtx.fillRect(0, 0, finalW, finalH);
    }

    destCtx.drawImage(offscreenCanvas, 0, 0, finalW, finalH);

    // Draw Frame Text & Technical Corners
    if (state.frameText) {
      drawFrameTypography(destCtx, finalW, finalH, colors.fgHex);
    }

    destCtx.restore();

    var t1 = performance.now();
    var elapsed = (t1 - t0).toFixed(1);

    // Update Telemetry Display
    if (destCtx === ctx) {
      chipRes.textContent = finalW + ' × ' + finalH;
      chipGrid.textContent = ditherW + ' × ' + ditherH + ' @ ' + scale + 'x';
      chipCoverage.textContent = coveragePct + '%';
      chipTime.textContent = elapsed + ' ms';
      updateStatusFooter();
    }
  }

  // DITHER ALGORITHMS
  function runDitherEngine(engine, lum, binary, w, h, baseThreshold) {
    var x, y, idx, oldVal, newVal, err;
    var forward, startX, endX, stepX;

    switch (engine) {
      // 1. ATKINSON (Apple Macintosh 1984)
      case 'atkinson':
        for (y = 0; y < h; y++) {
          forward = !state.serpentine || (y % 2 === 0);
          startX = forward ? 0 : w - 1;
          endX = forward ? w : -1;
          stepX = forward ? 1 : -1;

          for (x = startX; x !== endX; x += stepX) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) >> 3; // divide by 8

            if (err === 0) continue;

            if (forward) {
              if (x + 1 < w) lum[idx + 1] += err;
              if (x + 2 < w) lum[idx + 2] += err;
              if (y + 1 < h) {
                if (x - 1 >= 0) lum[idx + w - 1] += err;
                lum[idx + w] += err;
                if (x + 1 < w) lum[idx + w + 1] += err;
              }
              if (y + 2 < h) {
                lum[idx + w * 2] += err;
              }
            } else {
              if (x - 1 >= 0) lum[idx - 1] += err;
              if (x - 2 >= 0) lum[idx - 2] += err;
              if (y + 1 < h) {
                if (x + 1 < w) lum[idx + w + 1] += err;
                lum[idx + w] += err;
                if (x - 1 >= 0) lum[idx + w - 1] += err;
              }
              if (y + 2 < h) {
                lum[idx + w * 2] += err;
              }
            }
          }
        }
        break;

      // 2. FLOYD-STEINBERG
      case 'floyd':
        for (y = 0; y < h; y++) {
          forward = !state.serpentine || (y % 2 === 0);
          startX = forward ? 0 : w - 1;
          endX = forward ? w : -1;
          stepX = forward ? 1 : -1;

          for (x = startX; x !== endX; x += stepX) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = oldVal - newVal;

            if (forward) {
              if (x + 1 < w) lum[idx + 1] += (err * 7) / 16;
              if (y + 1 < h) {
                if (x - 1 >= 0) lum[idx + w - 1] += (err * 3) / 16;
                lum[idx + w] += (err * 5) / 16;
                if (x + 1 < w) lum[idx + w + 1] += (err * 1) / 16;
              }
            } else {
              if (x - 1 >= 0) lum[idx - 1] += (err * 7) / 16;
              if (y + 1 < h) {
                if (x + 1 < w) lum[idx + w + 1] += (err * 3) / 16;
                lum[idx + w] += (err * 5) / 16;
                if (x - 1 >= 0) lum[idx + w - 1] += (err * 1) / 16;
              }
            }
          }
        }
        break;

      // 3. SIERRA-3
      case 'sierra':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) / 32;

            if (x + 1 < w) lum[idx + 1] += err * 5;
            if (x + 2 < w) lum[idx + 2] += err * 3;

            if (y + 1 < h) {
              if (x - 2 >= 0) lum[idx + w - 2] += err * 2;
              if (x - 1 >= 0) lum[idx + w - 1] += err * 4;
              lum[idx + w] += err * 5;
              if (x + 1 < w) lum[idx + w + 1] += err * 4;
              if (x + 2 < w) lum[idx + w + 2] += err * 2;
            }

            if (y + 2 < h) {
              if (x - 1 >= 0) lum[idx + w * 2 - 1] += err * 2;
              lum[idx + w * 2] += err * 3;
              if (x + 1 < w) lum[idx + w * 2 + 1] += err * 2;
            }
          }
        }
        break;

      // 4. SIERRA LITE
      case 'sierra_lite':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) / 4;

            if (x + 1 < w) lum[idx + 1] += err * 2;
            if (y + 1 < h) {
              if (x - 1 >= 0) lum[idx + w - 1] += err * 1;
              lum[idx + w] += err * 1;
            }
          }
        }
        break;

      // 5. STUCKI
      case 'stucki':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) / 42;

            if (x + 1 < w) lum[idx + 1] += err * 8;
            if (x + 2 < w) lum[idx + 2] += err * 4;

            if (y + 1 < h) {
              if (x - 2 >= 0) lum[idx + w - 2] += err * 2;
              if (x - 1 >= 0) lum[idx + w - 1] += err * 4;
              lum[idx + w] += err * 8;
              if (x + 1 < w) lum[idx + w + 1] += err * 4;
              if (x + 2 < w) lum[idx + w + 2] += err * 2;
            }

            if (y + 2 < h) {
              if (x - 2 >= 0) lum[idx + w * 2 - 2] += err * 1;
              if (x - 1 >= 0) lum[idx + w * 2 - 1] += err * 2;
              lum[idx + w * 2] += err * 4;
              if (x + 1 < w) lum[idx + w * 2 + 1] += err * 2;
              if (x + 2 < w) lum[idx + w * 2 + 2] += err * 1;
            }
          }
        }
        break;

      // 6. BURKES
      case 'burkes':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) / 32;

            if (x + 1 < w) lum[idx + 1] += err * 8;
            if (x + 2 < w) lum[idx + 2] += err * 4;

            if (y + 1 < h) {
              if (x - 2 >= 0) lum[idx + w - 2] += err * 2;
              if (x - 1 >= 0) lum[idx + w - 1] += err * 4;
              lum[idx + w] += err * 8;
              if (x + 1 < w) lum[idx + w + 1] += err * 4;
              if (x + 2 < w) lum[idx + w + 2] += err * 2;
            }
          }
        }
        break;

      // 7. JARVIS-JUDICE-NINKE
      case 'jardin':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            oldVal = lum[idx];
            newVal = oldVal < baseThreshold ? 0 : 255;
            binary[idx] = newVal ? 1 : 0;
            err = (oldVal - newVal) / 48;

            if (x + 1 < w) lum[idx + 1] += err * 7;
            if (x + 2 < w) lum[idx + 2] += err * 5;

            if (y + 1 < h) {
              if (x - 2 >= 0) lum[idx + w - 2] += err * 3;
              if (x - 1 >= 0) lum[idx + w - 1] += err * 5;
              lum[idx + w] += err * 7;
              if (x + 1 < w) lum[idx + w + 1] += err * 5;
              if (x + 2 < w) lum[idx + w + 2] += err * 3;
            }

            if (y + 2 < h) {
              if (x - 2 >= 0) lum[idx + w * 2 - 2] += err * 1;
              if (x - 1 >= 0) lum[idx + w * 2 - 1] += err * 3;
              lum[idx + w * 2] += err * 5;
              if (x + 1 < w) lum[idx + w * 2 + 1] += err * 3;
              if (x + 2 < w) lum[idx + w * 2 + 2] += err * 1;
            }
          }
        }
        break;

      // 8. BAYER 8x8
      case 'bayer8':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var mVal8 = (BAYER_8[y % 8][x % 8] / 64) - 0.5;
            var tVal8 = baseThreshold + mVal8 * 255;
            binary[idx] = lum[idx] > tVal8 ? 1 : 0;
          }
        }
        break;

      // 9. BAYER 4x4
      case 'bayer4':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var mVal4 = (BAYER_4[y % 4][x % 4] / 16) - 0.5;
            var tVal4 = baseThreshold + mVal4 * 255;
            binary[idx] = lum[idx] > tVal4 ? 1 : 0;
          }
        }
        break;

      // 10. BAYER 2x2
      case 'bayer2':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var mVal2 = (BAYER_2[y % 2][x % 2] / 4) - 0.5;
            var tVal2 = baseThreshold + mVal2 * 255;
            binary[idx] = lum[idx] > tVal2 ? 1 : 0;
          }
        }
        break;

      // 11. HALFTONE DOT SCREEN
      case 'halftone':
        var rad = (state.halftoneAngle * Math.PI) / 180;
        var cosA = Math.cos(rad);
        var sinA = Math.sin(rad);
        var freq = (state.halftoneFreq / 100) * 0.5;

        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var u = (x * cosA + y * sinA) * freq * Math.PI * 2;
            var v = (-x * sinA + y * cosA) * freq * Math.PI * 2;
            var dotPattern = (Math.cos(u) + Math.cos(v)) * 0.25 + 0.5; // 0 to 1
            var dotThreshold = dotPattern * 255 + (baseThreshold - 128);
            binary[idx] = lum[idx] > dotThreshold ? 1 : 0;
          }
        }
        break;

      // 12. HALFTONE LINE SCREEN
      case 'line':
        var lRad = (state.halftoneAngle * Math.PI) / 180;
        var lCosA = Math.cos(lRad);
        var lSinA = Math.sin(lRad);
        var lFreq = (state.halftoneFreq / 100) * 0.4;

        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var lu = (x * lCosA + y * lSinA) * lFreq * Math.PI * 2;
            var linePattern = Math.sin(lu) * 0.5 + 0.5;
            var lineThreshold = linePattern * 255 + (baseThreshold - 128);
            binary[idx] = lum[idx] > lineThreshold ? 1 : 0;
          }
        }
        break;

      // 13. BLUE NOISE
      case 'bluenoise':
        // High frequency blue noise synthesis
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var hash = Math.sin(x * 12.9898 + y * 78.233 + (x % 3) * 45.123) * 43758.5453;
            var pseudoNoise = (hash - Math.floor(hash)) - 0.5;
            var bnThreshold = baseThreshold + pseudoNoise * 160;
            binary[idx] = lum[idx] > bnThreshold ? 1 : 0;
          }
        }
        break;

      // 14. RANDOM NOISE
      case 'noise':
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            var randNoise = (Math.random() - 0.5) * 200;
            binary[idx] = (lum[idx] + randNoise) > baseThreshold ? 1 : 0;
          }
        }
        break;

      // 15. PURE 1-BIT THRESHOLD
      case 'threshold':
      default:
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            idx = y * w + x;
            binary[idx] = lum[idx] > baseThreshold ? 1 : 0;
          }
        }
        break;
    }
  }

  // FRAME TYPOGRAPHY
  function drawFrameTypography(destCtx, w, h, colorHex) {
    destCtx.save();
    destCtx.font = state.frameTextSize + 'px "JetBrains Mono", monospace';
    destCtx.fillStyle = colorHex;
    destCtx.textBaseline = 'top';

    var pad = Math.max(16, Math.round(w * 0.022));

    // Top Left
    if (state.frameTL) {
      destCtx.textAlign = 'left';
      destCtx.fillText(state.frameTL, pad, pad);
    }

    // Top Right
    if (state.frameTR) {
      destCtx.textAlign = 'right';
      destCtx.fillText(state.frameTR, w - pad, pad);
    }

    // Bottom Left
    destCtx.textBaseline = 'bottom';
    if (state.frameBL) {
      destCtx.textAlign = 'left';
      destCtx.fillText(state.frameBL, pad, h - pad);
    }

    // Bottom Right
    if (state.frameBR) {
      destCtx.textAlign = 'right';
      destCtx.fillText(state.frameBR, w - pad, h - pad);
    }

    destCtx.restore();
  }

  // EXPORT GENERATORS
  function exportPng(transparent) {
    if (!state.image) {
      alert('Please load or select a file first.');
      return;
    }
    var dim = getActiveDimensions();
    var expCanvas = document.createElement('canvas');
    expCanvas.width = dim.w;
    expCanvas.height = dim.h;
    var expCtx = expCanvas.getContext('2d', { willReadFrequently: true });

    renderDither(expCtx, dim.w, dim.h, transparent);

    var suffix = transparent ? '-transparent' : '';
    var filename = 'dither-' + state.engine + '-' + state.palette + suffix + '-' + Date.now() + '.png';

    expCanvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    }, 'image/png');
  }

  // SVG VECTOR EXPORT (Run-Length Encoded Rectangles)
  function exportSvg() {
    if (!state.image) {
      alert('Please load or select a file first.');
      return;
    }
    var dim = getActiveDimensions();
    var scale = Math.max(1, state.pixelScale);
    var ditherW = Math.max(1, Math.floor(dim.w / scale));
    var ditherH = Math.max(1, Math.floor(dim.h / scale));

    // Render offscreen to get binary output
    offscreenCanvas.width = ditherW;
    offscreenCanvas.height = ditherH;
    offscreenCtx.fillStyle = '#000000';
    offscreenCtx.fillRect(0, 0, ditherW, ditherH);

    var imgW = state.image.naturalWidth || state.image.width || ditherW;
    var imgH = state.image.naturalHeight || state.image.height || ditherH;
    var imgRatio = imgW / imgH;
    var destRatio = ditherW / ditherH;

    var renderW, renderH, renderX, renderY;
    if (imgRatio > destRatio) {
      renderW = ditherW;
      renderH = renderW / imgRatio;
      renderX = 0;
      renderY = (ditherH - renderH) / 2;
    } else {
      renderH = ditherH;
      renderW = renderH * imgRatio;
      renderX = (ditherW - renderW) / 2;
      renderY = 0;
    }
    offscreenCtx.drawImage(state.image, renderX, renderY, renderW, renderH);

    var srcData = offscreenCtx.getImageData(0, 0, ditherW, ditherH);
    var pixels = srcData.data;
    var totalPixels = ditherW * ditherH;
    var lum = new Float32Array(totalPixels);
    var bAdjust = state.brightness * 1.28;
    var cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
    var invGamma = 1 / Math.max(0.1, state.gamma);

    for (var i = 0; i < totalPixels; i++) {
      var p = i * 4;
      var val = 0.2126 * pixels[p] + 0.7152 * pixels[p + 1] + 0.0722 * pixels[p + 2] + bAdjust;
      val = cFactor * (val - 128) + 128;
      val = 255 * Math.pow(Math.max(0, Math.min(1, val / 255)), invGamma);
      lum[i] = Math.max(0, Math.min(255, val));
    }

    var binary = new Uint8Array(totalPixels);
    var threshold = Math.max(0, Math.min(255, 128 + state.thresholdBias * 1.28));
    runDitherEngine(state.engine, lum, binary, ditherW, ditherH, threshold);

    var colors = getColors();

    var svgParts = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim.w + ' ' + dim.h + '" width="' + dim.w + '" height="' + dim.h + '">',
      '<rect width="' + dim.w + '" height="' + dim.h + '" fill="' + colors.bgHex + '"/>',
      '<g fill="' + colors.fgHex + '">'
    ];

    // Merge horizontal runs of foreground pixels
    for (var y = 0; y < ditherH; y++) {
      var runStart = -1;
      for (var x = 0; x < ditherW; x++) {
        var isFg = binary[y * ditherW + x] === 1;
        if (isFg && runStart === -1) {
          runStart = x;
        } else if (!isFg && runStart !== -1) {
          var runLen = x - runStart;
          svgParts.push('<rect x="' + (runStart * scale) + '" y="' + (y * scale) + '" width="' + (runLen * scale) + '" height="' + scale + '"/>');
          runStart = -1;
        }
      }
      if (runStart !== -1) {
        var endLen = ditherW - runStart;
        svgParts.push('<rect x="' + (runStart * scale) + '" y="' + (y * scale) + '" width="' + (endLen * scale) + '" height="' + scale + '"/>');
      }
    }

    svgParts.push('</g>');
    svgParts.push('</svg>');

    var svgContent = svgParts.join('\n');
    var blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.download = 'dither-' + state.engine + '-' + state.palette + '-' + Date.now() + '.svg';
    link.href = url;
    link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }

  // Populate Palette Grid
  function initPaletteGrid() {
    paletteGrid.innerHTML = '';
    var keys = Object.keys(PALETTES);
    keys.forEach(function (key) {
      var item = PALETTES[key];
      var swatch = document.createElement('div');
      swatch.className = 'palette-swatch' + (state.palette === key ? ' active' : '');
      swatch.dataset.palette = key;
      swatch.title = item.name;

      var circle = document.createElement('div');
      circle.className = 'swatch-split-circle';

      var halfBg = document.createElement('div');
      halfBg.className = 'swatch-half-bg';
      halfBg.style.backgroundColor = item.bg;

      var halfFg = document.createElement('div');
      halfFg.className = 'swatch-half-fg';
      halfFg.style.backgroundColor = item.fg;

      circle.appendChild(halfBg);
      circle.appendChild(halfFg);

      var label = document.createElement('span');
      label.className = 'palette-name';
      label.textContent = item.name;

      swatch.appendChild(circle);
      swatch.appendChild(label);

      swatch.addEventListener('click', function () {
        document.querySelectorAll('.palette-swatch').forEach(function (s) { s.classList.remove('active'); });
        swatch.classList.add('active');
        state.palette = key;
        palettePresetVal.textContent = item.name;
        scheduleUpdate();
      });

      paletteGrid.appendChild(swatch);
    });
  }

  // Sync Status Footer
  function updateStatusFooter() {
    var dim = getActiveDimensions();
    var engineLabel = engineSelect.options[engineSelect.selectedIndex] ? engineSelect.options[engineSelect.selectedIndex].text.split(' (')[0] : state.engine;
    var palLabel = PALETTES[state.palette] ? PALETTES[state.palette].name : 'Custom';
    exportStatusText.textContent = dim.w + ' × ' + dim.h + ' · ' + engineLabel + ' · ' + palLabel;
  }

  // Randomizer
  function randomizeAll() {
    var engines = ['atkinson', 'floyd', 'sierra', 'bayer8', 'bayer4', 'halftone', 'line', 'bluenoise', 'stucki'];
    var palettes = Object.keys(PALETTES);
    var scales = [1, 2, 3, 4];

    state.engine = engines[Math.floor(Math.random() * engines.length)];
    state.palette = palettes[Math.floor(Math.random() * palettes.length)];
    state.pixelScale = scales[Math.floor(Math.random() * scales.length)];
    state.brightness = Math.floor(Math.random() * 41) - 20; // -20 to 20
    state.contrast = Math.floor(Math.random() * 51) - 10; // -10 to 40
    state.gamma = parseFloat((0.8 + Math.random() * 0.6).toFixed(2)); // 0.8 to 1.4
    state.thresholdBias = Math.floor(Math.random() * 31) - 15;
    state.halftoneAngle = Math.floor(Math.random() * 91);
    state.halftoneFreq = Math.floor(16 + Math.random() * 32);

    syncUiWithState();
    scheduleUpdate();
  }

  function syncUiWithState() {
    // Engine tabs & select
    engineSelect.value = state.engine;
    engineNameVal.textContent = engineSelect.options[engineSelect.selectedIndex] ? engineSelect.options[engineSelect.selectedIndex].text.split(' (')[0] : state.engine;

    // Topbar & Drawer Engine Preset Tabs/Pills
    document.querySelectorAll('.mode-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.engine === state.engine);
    });
    document.querySelectorAll('.preset-pill-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.engine === state.engine);
    });

    // Halftone group visibility
    halftoneControlsGroup.style.display = (state.engine === 'halftone' || state.engine === 'line') ? 'block' : 'none';

    // Palette grid
    document.querySelectorAll('.palette-swatch').forEach(function (s) {
      s.classList.toggle('active', s.dataset.palette === state.palette);
    });
    palettePresetVal.textContent = PALETTES[state.palette] ? PALETTES[state.palette].name : 'Custom';

    // Pixel Scale buttons
    document.querySelectorAll('#pixelScaleGroup .seg-btn').forEach(function (btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.scale, 10) === state.pixelScale);
    });
    pixelScaleVal.textContent = state.pixelScale + 'x' + (state.pixelScale === 1 ? ' (Hi-Fi)' : '');

    // Sliders
    brightnessSlider.value = state.brightness;
    brightnessVal.textContent = state.brightness;
    contrastSlider.value = state.contrast;
    contrastVal.textContent = state.contrast;
    gammaSlider.value = state.gamma;
    gammaVal.textContent = state.gamma.toFixed(2);
    thresholdBiasSlider.value = state.thresholdBias;
    thresholdBiasVal.textContent = state.thresholdBias;
    edgeSharpenSlider.value = state.edgeSharpen;
    edgeSharpenVal.textContent = state.edgeSharpen + '%';

    halftoneAngleSlider.value = state.halftoneAngle;
    halftoneAngleVal.textContent = state.halftoneAngle + '°';
    halftoneFreqSlider.value = state.halftoneFreq;
    halftoneFreqVal.textContent = state.halftoneFreq;
  }

  // EVENT LISTENERS
  function initEventListeners() {
    // Engine Preset Pills & Tabs
    document.querySelectorAll('.mode-tab, .preset-pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.engine = btn.dataset.engine;
        syncUiWithState();
        scheduleUpdate();
      });
    });

    // Engine Select
    engineSelect.addEventListener('change', function () {
      state.engine = engineSelect.value;
      syncUiWithState();
      scheduleUpdate();
    });

    // Serpentine Toggle
    serpentineToggleBtn.addEventListener('click', function () {
      state.serpentine = !state.serpentine;
      serpentineToggleBtn.classList.toggle('active', state.serpentine);
      serpentineToggleBtn.textContent = state.serpentine ? 'Serpentine Diffusion On' : 'Serpentine Diffusion Off';
      serpentineVal.textContent = state.serpentine ? 'On' : 'Off';
      scheduleUpdate();
    });

    // Halftone Sliders
    halftoneAngleSlider.addEventListener('input', function () {
      state.halftoneAngle = parseInt(halftoneAngleSlider.value, 10);
      halftoneAngleVal.textContent = state.halftoneAngle + '°';
      scheduleUpdate();
    });
    halftoneFreqSlider.addEventListener('input', function () {
      state.halftoneFreq = parseInt(halftoneFreqSlider.value, 10);
      halftoneFreqVal.textContent = state.halftoneFreq;
      scheduleUpdate();
    });

    // File Opacity Slider
    fileOpacitySlider.addEventListener('input', function () {
      state.fileOpacity = parseFloat(fileOpacitySlider.value);
      fileOpacityVal.textContent = state.fileOpacity.toFixed(2);
      scheduleUpdate();
    });

    // Custom Color Pickers
    bgColorPicker.addEventListener('input', function () {
      state.customBg = bgColorPicker.value;
      bgColorText.value = bgColorPicker.value.toUpperCase();
      state.palette = 'custom';
      document.querySelectorAll('.palette-swatch').forEach(function (s) { s.classList.remove('active'); });
      palettePresetVal.textContent = 'Custom';
      scheduleUpdate();
    });
    bgColorText.addEventListener('change', function () {
      if (/^#[0-9A-F]{6}$/i.test(bgColorText.value)) {
        state.customBg = bgColorText.value;
        bgColorPicker.value = bgColorText.value;
        state.palette = 'custom';
        scheduleUpdate();
      }
    });

    fgColorPicker.addEventListener('input', function () {
      state.customFg = fgColorPicker.value;
      fgColorText.value = fgColorPicker.value.toUpperCase();
      state.palette = 'custom';
      document.querySelectorAll('.palette-swatch').forEach(function (s) { s.classList.remove('active'); });
      palettePresetVal.textContent = 'Custom';
      scheduleUpdate();
    });
    fgColorText.addEventListener('change', function () {
      if (/^#[0-9A-F]{6}$/i.test(fgColorText.value)) {
        state.customFg = fgColorText.value;
        fgColorPicker.value = fgColorText.value;
        state.palette = 'custom';
        scheduleUpdate();
      }
    });

    // Invert Colors
    invertToggleBtn.addEventListener('click', function () {
      state.invertPalette = !state.invertPalette;
      invertToggleBtn.classList.toggle('active', state.invertPalette);
      invertToggleBtn.textContent = state.invertPalette ? 'Palette Inverted' : 'Invert Palette (Dark / Light)';
      scheduleUpdate();
    });

    // Pixel Scale Group
    document.querySelectorAll('#pixelScaleGroup .seg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#pixelScaleGroup .seg-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.pixelScale = parseInt(btn.dataset.scale, 10);
        pixelScaleVal.textContent = state.pixelScale + 'x' + (state.pixelScale === 1 ? ' (Hi-Fi)' : '');
        scheduleUpdate();
      });
    });

    // Image Adjustment Sliders
    brightnessSlider.addEventListener('input', function () {
      state.brightness = parseInt(brightnessSlider.value, 10);
      brightnessVal.textContent = state.brightness;
      scheduleUpdate();
    });
    contrastSlider.addEventListener('input', function () {
      state.contrast = parseInt(contrastSlider.value, 10);
      contrastVal.textContent = state.contrast;
      scheduleUpdate();
    });
    gammaSlider.addEventListener('input', function () {
      state.gamma = parseFloat(gammaSlider.value);
      gammaVal.textContent = state.gamma.toFixed(2);
      scheduleUpdate();
    });
    thresholdBiasSlider.addEventListener('input', function () {
      state.thresholdBias = parseInt(thresholdBiasSlider.value, 10);
      thresholdBiasVal.textContent = state.thresholdBias;
      scheduleUpdate();
    });
    edgeSharpenSlider.addEventListener('input', function () {
      state.edgeSharpen = parseInt(edgeSharpenSlider.value, 10);
      edgeSharpenVal.textContent = state.edgeSharpen + '%';
      scheduleUpdate();
    });

    // Format Select
    formatSelect.addEventListener('change', function () {
      state.format = formatSelect.value;
      formatPresetVal.textContent = formatSelect.options[formatSelect.selectedIndex].text.split(' (')[0];
      customDimensionsGroup.style.display = state.format === 'custom' ? 'block' : 'none';
      resizeCanvasViewport();
      scheduleUpdate();
    });

    customWidthInput.addEventListener('change', function () {
      if (state.format === 'custom') {
        resizeCanvasViewport();
        scheduleUpdate();
      }
    });
    customHeightInput.addEventListener('change', function () {
      if (state.format === 'custom') {
        resizeCanvasViewport();
        scheduleUpdate();
      }
    });

    // Frame Text Toggle & Inputs
    frameTextToggleBtn.addEventListener('click', function () {
      state.frameText = !state.frameText;
      frameTextToggleBtn.classList.toggle('active', state.frameText);
      frameTextToggleBtn.textContent = state.frameText ? 'Corner Typography On' : 'Corner Typography Off';
      frameTextStateVal.textContent = state.frameText ? 'On' : 'Off';
      frameTextControls.style.display = state.frameText ? 'block' : 'none';
      scheduleUpdate();
    });

    frameTextTL.addEventListener('input', function () { state.frameTL = frameTextTL.value; scheduleUpdate(); });
    frameTextTR.addEventListener('input', function () { state.frameTR = frameTextTR.value; scheduleUpdate(); });
    frameTextBL.addEventListener('input', function () { state.frameBL = frameTextBL.value; scheduleUpdate(); });
    frameTextBR.addEventListener('input', function () { state.frameBR = frameTextBR.value; scheduleUpdate(); });

    frameTextSizeSlider.addEventListener('input', function () {
      state.frameTextSize = parseInt(frameTextSizeSlider.value, 10);
      frameTextSizeVal.textContent = state.frameTextSize;
      scheduleUpdate();
    });

    // Icon Rail Navigation
    var activeRailPanel = 'file';
    document.querySelectorAll('.rail-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.panel;
        if (activeRailPanel === target && panelDrawer.classList.contains('open')) {
          panelDrawer.classList.remove('open');
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
          activeRailPanel = null;
        } else {
          document.querySelectorAll('.rail-btn').forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          activeRailPanel = target;
          panelDrawer.classList.add('open');

          var targetSection = panelDrawer.querySelector('[data-section="' + target + '"]');
          if (targetSection) {
            setTimeout(function () {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }
        }
      });
    });

    // Section Collapsible Toggles
    document.querySelectorAll('.panel-header').forEach(function (header) {
      header.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') return;
        var panel = header.closest('.panel');
        panel.classList.toggle('collapsed');
      });
    });
    document.querySelectorAll('.toggle-collapse').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var panel = btn.closest('.panel');
        panel.classList.toggle('collapsed');
      });
    });

    // File Picker Triggers
    replaceFileBtn.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function (e) {
      var files = e.target.files;
      if (files && files.length > 0) {
        loadFile(files[0]);
        fileInput.value = '';
      }
    });

    // ========================================================================
    // ZOOM CONTROLS WIRING
    // ========================================================================
    function setZoom(newScale) {
      zoomState.scale = Math.min(5.0, Math.max(0.25, parseFloat(newScale.toFixed(2))));
      if (zoomState.scale <= 1.0) {
        zoomState.panX = 0;
        zoomState.panY = 0;
      }
      applyZoomTransform();
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () { setZoom(zoomState.scale + 0.25); });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () { setZoom(zoomState.scale - 0.25); });
    }
    if (zoomFitBtn) {
      zoomFitBtn.addEventListener('click', function () {
        zoomState.scale = 1.0;
        zoomState.panX = 0;
        zoomState.panY = 0;
        applyZoomTransform();
      });
    }

    // Mouse Wheel Zoom
    wrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom(zoomState.scale + delta);
    }, { passive: false });

    // Drag to Pan when Zoomed In
    wrap.addEventListener('mousedown', function (e) {
      if (zoomState.scale > 1.0) {
        zoomState.isPanning = true;
        zoomState.startX = e.clientX - zoomState.panX;
        zoomState.startY = e.clientY - zoomState.panY;
        applyZoomTransform();
      }
    });

    window.addEventListener('mousemove', function (e) {
      if (zoomState.isPanning) {
        zoomState.panX = e.clientX - zoomState.startX;
        zoomState.panY = e.clientY - zoomState.startY;
        applyZoomTransform();
      }
    });

    window.addEventListener('mouseup', function () {
      if (zoomState.isPanning) {
        zoomState.isPanning = false;
        applyZoomTransform();
      }
    });

    // ========================================================================
    // CROP TOOL WIRING
    // ========================================================================
    if (cropBtn) {
      cropBtn.addEventListener('click', openCropModal);
    }
    if (cropCancelBtn) {
      cropCancelBtn.addEventListener('click', function () { cropModal.style.display = 'none'; });
    }
    if (cropResetBtn) {
      cropResetBtn.addEventListener('click', function () {
        cropState.startX = Math.round(cropCanvas.width * 0.1);
        cropState.startY = Math.round(cropCanvas.height * 0.1);
        cropState.w = Math.round(cropCanvas.width * 0.8);
        cropState.h = Math.round(cropCanvas.height * 0.8);
        drawCropCanvas();
      });
    }
    if (cropApplyBtn) {
      cropApplyBtn.addEventListener('click', applyCrop);
    }

    var cropRatioBtns = document.querySelectorAll('.crop-ratio-btn');
    cropRatioBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        cropRatioBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cropState.ratio = btn.dataset.ratio;

        var maxW = cropCanvas.width;
        var maxH = cropCanvas.height;
        if (cropState.ratio === '1:1') {
          var side = Math.min(cropState.w, cropState.h);
          cropState.w = side;
          cropState.h = side;
        } else if (cropState.ratio === '4:3') {
          cropState.h = Math.round(cropState.w * (3 / 4));
        } else if (cropState.ratio === '16:9') {
          cropState.h = Math.round(cropState.w * (9 / 16));
        } else if (cropState.ratio === '3:4') {
          cropState.h = Math.round(cropState.w * (4 / 3));
        }
        if (cropState.startY + cropState.h > maxH) {
          cropState.startY = Math.max(0, maxH - cropState.h);
        }
        drawCropCanvas();
      });
    });

    // Crop Canvas Dragging
    if (cropCanvas) {
      cropCanvas.addEventListener('mousedown', function (e) {
        var rect = cropCanvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        var hs = 14;
        if (Math.abs(mx - cropState.startX) < hs && Math.abs(my - cropState.startY) < hs) {
          cropState.dragMode = 'nw';
        } else if (Math.abs(mx - (cropState.startX + cropState.w)) < hs && Math.abs(my - cropState.startY) < hs) {
          cropState.dragMode = 'ne';
        } else if (Math.abs(mx - cropState.startX) < hs && Math.abs(my - (cropState.startY + cropState.h)) < hs) {
          cropState.dragMode = 'sw';
        } else if (Math.abs(mx - (cropState.startX + cropState.w)) < hs && Math.abs(my - (cropState.startY + cropState.h)) < hs) {
          cropState.dragMode = 'se';
        } else if (mx >= cropState.startX && mx <= cropState.startX + cropState.w && my >= cropState.startY && my <= cropState.startY + cropState.h) {
          cropState.dragMode = 'move';
        } else {
          cropState.dragMode = null;
          return;
        }

        cropState.dragging = true;
        cropState.offsetX = mx - cropState.startX;
        cropState.offsetY = my - cropState.startY;
      });

      window.addEventListener('mousemove', function (e) {
        if (!cropState.dragging || !cropCanvas || cropModal.style.display === 'none') return;
        var rect = cropCanvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        if (cropState.dragMode === 'move') {
          cropState.startX = Math.max(0, Math.min(cropCanvas.width - cropState.w, mx - cropState.offsetX));
          cropState.startY = Math.max(0, Math.min(cropCanvas.height - cropState.h, my - cropState.offsetY));
        } else if (cropState.dragMode === 'se') {
          cropState.w = Math.max(40, Math.min(cropCanvas.width - cropState.startX, mx - cropState.startX));
          if (cropState.ratio === '1:1') cropState.h = cropState.w;
          else if (cropState.ratio === '4:3') cropState.h = Math.round(cropState.w * (3 / 4));
          else if (cropState.ratio === '16:9') cropState.h = Math.round(cropState.w * (9 / 16));
          else if (cropState.ratio === '3:4') cropState.h = Math.round(cropState.w * (4 / 3));
          else cropState.h = Math.max(40, Math.min(cropCanvas.height - cropState.startY, my - cropState.startY));
        }
        drawCropCanvas();
      });

      window.addEventListener('mouseup', function () {
        cropState.dragging = false;
        cropState.dragMode = null;
      });
    }

    // Sample File & Demo Picker
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', function () {
        if (demoPickerPanel) {
          demoPickerPanel.style.display = demoPickerPanel.style.display === 'none' ? 'block' : 'none';
        }
      });
    }
    if (emptyLoadSampleBtn) {
      emptyLoadSampleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        loadDemoAsset('street');
      });
    }
    document.querySelectorAll('.btn-demo-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var demoKey = btn.dataset.demo;
        loadDemoAsset(demoKey);
        if (demoPickerPanel) demoPickerPanel.style.display = 'none';
      });
    });

    // Empty state & canvas click
    emptyState.addEventListener('click', function () { fileInput.click(); });
    canvas.addEventListener('click', function () {
      if (!state.image) fileInput.click();
    });

    // Drag and drop
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

    // Paste from clipboard
    window.addEventListener('paste', function (e) {
      var items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          var blob = items[i].getAsFile();
          if (blob) {
            loadFile(blob);
            break;
          }
        }
      }
    });

    // Export Triggers
    downloadBtn.addEventListener('click', function () { exportPng(false); });
    topbarDownloadBtn.addEventListener('click', function () { exportPng(false); });
    downloadOverlayBtn.addEventListener('click', function () { exportPng(true); });
    downloadSvgBtn.addEventListener('click', function () { exportSvg(); });

    randomizeSettingsBtn.addEventListener('click', function () { randomizeAll(); });
    topbarRandomBtn.addEventListener('click', function () { randomizeAll(); });

    // Inter-Tool Pipeline Routing & Preset Share
    var sendToAsciiBtn = document.getElementById('sendToAsciiBtn');
    if (sendToAsciiBtn) {
      sendToAsciiBtn.addEventListener('click', function () {
        if (!state.image) {
          if (window.StudioPipeline) StudioPipeline.showToast('Please load an image first');
          return;
        }
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../ascii-gen/index.html', 'ASCII Matrix');
        } else {
          window.location.href = '../ascii-gen/index.html';
        }
      });
    }

    var sendToTrackerBtn = document.getElementById('sendToTrackerBtn');
    if (sendToTrackerBtn) {
      sendToTrackerBtn.addEventListener('click', function () {
        if (!state.image) {
          if (window.StudioPipeline) StudioPipeline.showToast('Please load an image first');
          return;
        }
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../blob-tracker/index.html', 'Blob Tracker');
        } else {
          window.location.href = '../blob-tracker/index.html';
        }
      });
    }

    var sendToCrtBtn = document.getElementById('sendToCrtBtn');
    if (sendToCrtBtn) {
      sendToCrtBtn.addEventListener('click', function () {
        if (!state.image) {
          if (window.StudioPipeline) StudioPipeline.showToast('Please load an image first');
          return;
        }
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../crt-gen/index.html', 'CRT Synthesizer');
        } else {
          window.location.href = '../crt-gen/index.html';
        }
      });
    }

    var sharePresetBtn = document.getElementById('sharePresetBtn');
    if (sharePresetBtn) {
      sharePresetBtn.addEventListener('click', function () {
        var url = getShareablePresetUrl();
        if (window.StudioPipeline) {
          StudioPipeline.copyTextToClipboard(url, 'Preset share link copied to clipboard!');
        }
      });
    }

    // Window Resize
    window.addEventListener('resize', function () {
      resizeCanvasViewport();
      scheduleUpdate();
    });
  }

  function parseUrlHashPreset() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    try {
      var hashStr = window.location.hash.substring(1);
      var params = new URLSearchParams(hashStr);
      if (params.has('engine')) {
        state.engine = params.get('engine');
        var modeTabs = document.querySelectorAll('.mode-tab');
        modeTabs.forEach(function (tab) {
          tab.classList.toggle('active', tab.getAttribute('data-engine') === state.engine);
        });
      }
      if (params.has('palette')) {
        state.palette = params.get('palette');
        updatePaletteSelection(state.palette);
      }
      if (params.has('pixelScale')) {
        state.pixelScale = parseInt(params.get('pixelScale'), 10) || 1;
        var psEl = document.getElementById('pixelScale');
        var psVal = document.getElementById('pixelScaleVal');
        if (psEl) psEl.value = state.pixelScale;
        if (psVal) psVal.textContent = state.pixelScale + 'x';
      }
      if (params.has('brightness')) {
        state.brightness = parseInt(params.get('brightness'), 10) || 0;
        var bEl = document.getElementById('brightness');
        var bVal = document.getElementById('brightnessVal');
        if (bEl) bEl.value = state.brightness;
        if (bVal) bVal.textContent = state.brightness;
      }
      if (params.has('contrast')) {
        state.contrast = parseInt(params.get('contrast'), 10) || 0;
        var cEl = document.getElementById('contrast');
        var cVal = document.getElementById('contrastVal');
        if (cEl) cEl.value = state.contrast;
        if (cVal) cVal.textContent = state.contrast;
      }
      if (params.has('gamma')) {
        state.gamma = parseFloat(params.get('gamma')) || 1.0;
        var gEl = document.getElementById('gamma');
        var gVal = document.getElementById('gammaVal');
        if (gEl) gEl.value = state.gamma;
        if (gVal) gVal.textContent = state.gamma.toFixed(2);
      }
      if (params.has('thresholdBias')) {
        state.thresholdBias = parseInt(params.get('thresholdBias'), 10) || 0;
        var tbEl = document.getElementById('thresholdBias');
        var tbVal = document.getElementById('thresholdBiasVal');
        if (tbEl) tbEl.value = state.thresholdBias;
        if (tbVal) tbVal.textContent = state.thresholdBias;
      }
      if (params.has('edgeSharpen')) {
        state.edgeSharpen = parseInt(params.get('edgeSharpen'), 10) || 0;
        var esEl = document.getElementById('edgeSharpen');
        var esVal = document.getElementById('edgeSharpenVal');
        if (esEl) esEl.value = state.edgeSharpen;
        if (esVal) esVal.textContent = state.edgeSharpen;
      }
      if (params.has('format')) {
        state.format = params.get('format');
        var canvasFormatEl = document.getElementById('canvasFormat');
        if (canvasFormatEl) canvasFormatEl.value = state.format;
      }
      updateStatusFooter();
    } catch (e) {
      console.warn('Could not parse URL hash preset', e);
    }
  }

  function getShareablePresetUrl() {
    var params = new URLSearchParams();
    params.set('engine', state.engine);
    params.set('palette', state.palette);
    params.set('pixelScale', state.pixelScale);
    params.set('brightness', state.brightness);
    params.set('contrast', state.contrast);
    params.set('gamma', state.gamma);
    params.set('thresholdBias', state.thresholdBias);
    params.set('edgeSharpen', state.edgeSharpen);
    params.set('format', state.format);
    return window.location.origin + window.location.pathname + '#' + params.toString();
  }

  // Initialization
  initPaletteGrid();
  initEventListeners();
  resizeCanvasViewport();
  parseUrlHashPreset();

  // Pipeline check for incoming shared image
  if (window.StudioPipeline) {
    StudioPipeline.receiveImage(function (dataUrl) {
      var pipelineImg = new Image();
      pipelineImg.onload = function () {
        applyLoadedFile(pipelineImg);
      };
      pipelineImg.src = dataUrl;
    });
  }

})();
