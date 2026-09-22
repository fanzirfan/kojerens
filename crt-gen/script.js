/**
 * KOJERENS ANALOG CRT BEAM & GLITCH SYNTHESIZER : CORE ENGINE
 * Generative Visual & Computational Laboratory
 * Author: Fanz Irfan | URL: manji.eu.org
 */

(function () {
  'use strict';

  // Application State
  var state = {
    image: null,
    rawImage: null,      // Preserves original image for crop resets
    preset: 'trinitron',
    fileOpacity: 1.0,

    // Tube & Geometry
    curvature: 14,      // 0 - 40 %
    cornerRound: 12,    // 0 - 48 px
    vignette: 50,       // 0 - 100 %
    glassGlow: 25,      // 0 - 80 %

    // Beam & Scanlines
    scanlineCount: 320, // 120 - 640 lines
    scanlineOpacity: 65,// 0 - 100 %
    beamBloom: 45,      // 0 - 100 %
    interlace: 'even',  // 'even', 'odd', 'off'

    // Phosphor Mask
    maskType: 'aperture', // 'aperture', 'shadow', 'slot', 'mesh', 'none'
    maskPitch: 2,         // 1 - 6 px
    maskOpacity: 50,      // 0 - 90 %

    // Analog Glitch & Noise
    rgbSplit: 4,          // 0 - 24 px
    syncJitter: 6,        // 0 - 32 px
    chromaBleed: 8,       // 0 - 28 px
    vhsNoise: 20,         // 0 - 100 %
    rfSnow: 15,           // 0 - 70 %
    ghosting: 0,          // 0 - 60 %

    // Tone & Color
    palette: 'rgb',       // 'rgb', 'green_p1', 'amber_p3', 'white_p4', 'cyan', 'plasma', 'blood'
    brightness: 0,        // -50 - 50
    contrast: 10,         // -40 - 60
    saturation: 110,      // 0 - 250 %

    // Dimensions
    format: 'ntsc_4_3',

    // OSD & Telemetry
    showOsd: true,
    osdText: 'CH 03 [NTSC] · STEREO · 15.75 kHz',
    showSmpte: true,
    showFrameText: true,
    frameTL: 'Design & Strategy',
    frameTR: 'Fanz Irfan',
    frameBL: 'manji.eu.org',
    frameBR: 'Indonesia'
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

  var PRESETS = {
    trinitron: {
      name: 'Trinitron PVM',
      curvature: 8,
      cornerRound: 6,
      vignette: 35,
      glassGlow: 20,
      scanlineCount: 400,
      scanlineOpacity: 60,
      beamBloom: 40,
      interlace: 'even',
      maskType: 'aperture',
      maskPitch: 2,
      maskOpacity: 45,
      rgbSplit: 2,
      syncJitter: 0,
      chromaBleed: 4,
      vhsNoise: 0,
      rfSnow: 5,
      ghosting: 0,
      palette: 'rgb',
      brightness: 4,
      contrast: 15,
      saturation: 115
    },
    consumer: {
      name: 'Consumer 90s',
      curvature: 22,
      cornerRound: 24,
      vignette: 65,
      glassGlow: 40,
      scanlineCount: 280,
      scanlineOpacity: 70,
      beamBloom: 55,
      interlace: 'even',
      maskType: 'shadow',
      maskPitch: 3,
      maskOpacity: 55,
      rgbSplit: 7,
      syncJitter: 6,
      chromaBleed: 14,
      vhsNoise: 15,
      rfSnow: 20,
      ghosting: 12,
      palette: 'rgb',
      brightness: -2,
      contrast: 18,
      saturation: 125
    },
    green_p1: {
      name: 'P1 Emerald Phosphor',
      curvature: 16,
      cornerRound: 14,
      vignette: 55,
      glassGlow: 30,
      scanlineCount: 360,
      scanlineOpacity: 75,
      beamBloom: 60,
      interlace: 'off',
      maskType: 'mesh',
      maskPitch: 2,
      maskOpacity: 50,
      rgbSplit: 0,
      syncJitter: 3,
      chromaBleed: 0,
      vhsNoise: 0,
      rfSnow: 10,
      ghosting: 0,
      palette: 'green_p1',
      brightness: 10,
      contrast: 25,
      saturation: 100
    },
    amber_p3: {
      name: 'P3 Amber Phosphor',
      curvature: 14,
      cornerRound: 14,
      vignette: 55,
      glassGlow: 30,
      scanlineCount: 360,
      scanlineOpacity: 75,
      beamBloom: 60,
      interlace: 'off',
      maskType: 'mesh',
      maskPitch: 2,
      maskOpacity: 50,
      rgbSplit: 0,
      syncJitter: 2,
      chromaBleed: 0,
      vhsNoise: 0,
      rfSnow: 8,
      ghosting: 0,
      palette: 'amber_p3',
      brightness: 8,
      contrast: 22,
      saturation: 100
    },
    vhs_glitch: {
      name: 'VHS Tape Glitch',
      curvature: 12,
      cornerRound: 10,
      vignette: 45,
      glassGlow: 25,
      scanlineCount: 260,
      scanlineOpacity: 65,
      beamBloom: 50,
      interlace: 'odd',
      maskType: 'slot',
      maskPitch: 3,
      maskOpacity: 40,
      rgbSplit: 14,
      syncJitter: 22,
      chromaBleed: 24,
      vhsNoise: 75,
      rfSnow: 35,
      ghosting: 25,
      palette: 'rgb',
      brightness: 2,
      contrast: 10,
      saturation: 140
    },
    cyberpunk: {
      name: 'Cyber Fringes',
      curvature: 6,
      cornerRound: 8,
      vignette: 40,
      glassGlow: 35,
      scanlineCount: 440,
      scanlineOpacity: 55,
      beamBloom: 70,
      interlace: 'even',
      maskType: 'aperture',
      maskPitch: 2,
      maskOpacity: 35,
      rgbSplit: 18,
      syncJitter: 12,
      chromaBleed: 10,
      vhsNoise: 25,
      rfSnow: 15,
      ghosting: 15,
      palette: 'cyan',
      brightness: 5,
      contrast: 30,
      saturation: 160
    },
    arcade_slot: {
      name: 'Arcade 240p',
      curvature: 18,
      cornerRound: 16,
      vignette: 60,
      glassGlow: 20,
      scanlineCount: 240,
      scanlineOpacity: 85,
      beamBloom: 40,
      interlace: 'off',
      maskType: 'slot',
      maskPitch: 4,
      maskOpacity: 65,
      rgbSplit: 3,
      syncJitter: 0,
      chromaBleed: 6,
      vhsNoise: 0,
      rfSnow: 5,
      ghosting: 0,
      palette: 'rgb',
      brightness: 6,
      contrast: 20,
      saturation: 130
    },
    lofi_rf: {
      name: 'Lo-Fi Broadcast',
      curvature: 26,
      cornerRound: 28,
      vignette: 75,
      glassGlow: 45,
      scanlineCount: 300,
      scanlineOpacity: 70,
      beamBloom: 65,
      interlace: 'odd',
      maskType: 'shadow',
      maskPitch: 3,
      maskOpacity: 60,
      rgbSplit: 12,
      syncJitter: 16,
      chromaBleed: 20,
      vhsNoise: 50,
      rfSnow: 55,
      ghosting: 40,
      palette: 'rgb',
      brightness: 0,
      contrast: 15,
      saturation: 90
    }
  };

  var FORMATS = {
    ntsc_4_3: { w: 1600, h: 1200, name: '4:3 Vintage NTSC' },
    square_1_1: { w: 1400, h: 1400, name: '1:1 Square' },
    broadcast_16_9: { w: 1920, h: 1080, name: '16:9 Broadcast HD' },
    portrait_9_16: { w: 1080, h: 1920, name: '9:16 Mobile Story' },
    portrait_3_4: { w: 1200, h: 1600, name: '3:4 Retro Portrait' },
    original: { w: 1600, h: 1200, name: 'Original Image' }
  };

  var DEMO_FILES = {
    street: '../assets/demo/jack-berry-aVu_orLM3Mc-unsplash.jpg',
    arch: '../assets/demo/dmytro-koplyk-kdN49Gc01_0-unsplash.jpg',
    portrait: '../assets/demo/karsten-winegeart-MB2JolPeFcg-unsplash.jpg'
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
  var cropBtn = document.getElementById('cropBtn');
  var panelDrawer = document.getElementById('panelDrawer');

  // Zoom Controls
  var zoomOutBtn = document.getElementById('zoomOutBtn');
  var zoomInBtn = document.getElementById('zoomInBtn');
  var zoomFitBtn = document.getElementById('zoomFitBtn');
  var zoomValText = document.getElementById('zoomVal');

  // Value Display Elements
  var fileOpacityEl = document.getElementById('fileOpacity');
  var fileOpacityVal = document.getElementById('fileOpacityVal');
  var curvatureEl = document.getElementById('curvature');
  var curvatureVal = document.getElementById('curvatureVal');
  var cornerRoundEl = document.getElementById('cornerRound');
  var cornerRoundVal = document.getElementById('cornerRoundVal');
  var vignetteEl = document.getElementById('vignette');
  var vignetteVal = document.getElementById('vignetteVal');
  var glassGlowEl = document.getElementById('glassGlow');
  var glassGlowVal = document.getElementById('glassGlowVal');
  var scanlineCountEl = document.getElementById('scanlineCount');
  var scanlineCountVal = document.getElementById('scanlineCountVal');
  var scanlineOpacityEl = document.getElementById('scanlineOpacity');
  var scanlineOpacityVal = document.getElementById('scanlineOpacityVal');
  var beamBloomEl = document.getElementById('beamBloom');
  var beamBloomVal = document.getElementById('beamBloomVal');
  var interlaceVal = document.getElementById('interlaceVal');
  var maskTypeSelect = document.getElementById('maskTypeSelect');
  var maskTypeVal = document.getElementById('maskTypeVal');
  var maskPitchEl = document.getElementById('maskPitch');
  var maskPitchVal = document.getElementById('maskPitchVal');
  var maskOpacityEl = document.getElementById('maskOpacity');
  var maskOpacityVal = document.getElementById('maskOpacityVal');
  var rgbSplitEl = document.getElementById('rgbSplit');
  var rgbSplitVal = document.getElementById('rgbSplitVal');
  var syncJitterEl = document.getElementById('syncJitter');
  var syncJitterVal = document.getElementById('syncJitterVal');
  var chromaBleedEl = document.getElementById('chromaBleed');
  var chromaBleedVal = document.getElementById('chromaBleedVal');
  var vhsNoiseEl = document.getElementById('vhsNoise');
  var vhsNoiseVal = document.getElementById('vhsNoiseVal');
  var rfSnowEl = document.getElementById('rfSnow');
  var rfSnowVal = document.getElementById('rfSnowVal');
  var ghostingEl = document.getElementById('ghosting');
  var ghostingVal = document.getElementById('ghostingVal');
  var paletteSelect = document.getElementById('paletteSelect');
  var paletteNameVal = document.getElementById('paletteNameVal');
  var brightnessEl = document.getElementById('brightness');
  var brightnessVal = document.getElementById('brightnessVal');
  var contrastEl = document.getElementById('contrast');
  var contrastVal = document.getElementById('contrastVal');
  var saturationEl = document.getElementById('saturation');
  var saturationVal = document.getElementById('saturationVal');
  var canvasFormatEl = document.getElementById('canvasFormat');
  var formatVal = document.getElementById('formatVal');
  var exportStatusText = document.getElementById('exportStatusText');

  // OSD & Telemetry
  var toggleOsd = document.getElementById('toggleOsd');
  var osdTextInput = document.getElementById('osdText');
  var toggleSmpte = document.getElementById('toggleSmpte');
  var toggleFrameText = document.getElementById('toggleFrameText');
  var frameTLInput = document.getElementById('frameTL');
  var frameTRInput = document.getElementById('frameTR');
  var frameBLInput = document.getElementById('frameBL');
  var frameBRInput = document.getElementById('frameBR');
  var frameTextControls = document.getElementById('frameTextControls');

  // Buttons
  var downloadBtn = document.getElementById('downloadBtn');
  var downloadOverlayBtn = document.getElementById('downloadOverlayBtn');
  var topbarDownloadBtn = document.getElementById('topbarDownloadBtn');
  var randomizeSettingsBtn = document.getElementById('randomizeSettingsBtn');
  var topbarRandomBtn = document.getElementById('topbarRandomBtn');
  var sendToTrackerBtn = document.getElementById('sendToTrackerBtn');
  var sendToAsciiBtn = document.getElementById('sendToAsciiBtn');
  var sendToDitherBtn = document.getElementById('sendToDitherBtn');
  var sharePresetBtn = document.getElementById('sharePresetBtn');

  // Crop Modal Elements
  var cropModal = document.getElementById('cropModal');
  var cropCanvas = document.getElementById('cropCanvas');
  var cropCtx = cropCanvas ? cropCanvas.getContext('2d') : null;
  var cropApplyBtn = document.getElementById('cropApplyBtn');
  var cropCancelBtn = document.getElementById('cropCancelBtn');
  var cropResetBtn = document.getElementById('cropResetBtn');
  var cropInfoText = document.getElementById('cropInfoText');

  // Crop Internal State
  var cropState = {
    ratio: 'free',
    startX: 0,
    startY: 0,
    w: 0,
    h: 0,
    dragging: false,
    dragMode: null, // 'move', 'nw', 'ne', 'sw', 'se'
    imgW: 0,
    imgH: 0,
    scale: 1.0,
    offsetX: 0,
    offsetY: 0
  };

  // Offscreen Buffers
  var bufferCanvas = document.createElement('canvas');
  var bufferCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });
  var bloomCanvas = document.createElement('canvas');
  var bloomCtx = bloomCanvas.getContext('2d');
  var maskPatternCanvas = document.createElement('canvas');
  var maskPatternCtx = maskPatternCanvas.getContext('2d');

  var updateScheduled = false;

  function scheduleUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    requestAnimationFrame(function () {
      updateScheduled = false;
      if (state.image) {
        renderCrt();
      }
    });
  }

  // Active Dimensions
  function getActiveDimensions() {
    if (state.format === 'original' && state.image) {
      var imgW = state.image.naturalWidth || state.image.width || 1600;
      var imgH = state.image.naturalHeight || state.image.height || 1200;
      var maxDim = 1920;
      var s = Math.min(1, maxDim / Math.max(imgW, imgH));
      return {
        w: Math.round(imgW * s),
        h: Math.round(imgH * s),
        name: 'Original (' + Math.round(imgW * s) + 'x' + Math.round(imgH * s) + ')'
      };
    }
    var fmt = FORMATS[state.format] || FORMATS.ntsc_4_3;
    return { w: fmt.w, h: fmt.h, name: fmt.name };
  }

  // Viewport resize and Zoom Transform Application
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

  function applyZoomTransform() {
    canvas.style.transform = 'translate(' + zoomState.panX + 'px, ' + zoomState.panY + 'px) scale(' + zoomState.scale + ')';
    canvas.style.transformOrigin = 'center center';
    canvas.style.cursor = zoomState.scale > 1 ? (zoomState.isPanning ? 'grabbing' : 'grab') : 'default';
    if (zoomValText) {
      zoomValText.textContent = Math.round(zoomState.scale * 100) + '%';
    }
  }

  // Procedural Demo Graphic
  function createDemoImage() {
    var c = document.createElement('canvas');
    c.width = 1600;
    c.height = 1200;
    var cx = c.getContext('2d');

    // Deep studio gradient background
    var bgGrad = cx.createRadialGradient(800, 600, 80, 800, 600, 950);
    bgGrad.addColorStop(0, '#26294a');
    bgGrad.addColorStop(0.5, '#0c1024');
    bgGrad.addColorStop(1, '#02040a');
    cx.fillStyle = bgGrad;
    cx.fillRect(0, 0, 1600, 1200);

    // Wireframe grid lines
    cx.strokeStyle = 'rgba(182, 217, 252, 0.15)';
    cx.lineWidth = 1;
    for (var x = 0; x <= 1600; x += 80) {
      cx.beginPath();
      cx.moveTo(x, 0);
      cx.lineTo(x, 1200);
      cx.stroke();
    }
    for (var y = 0; y <= 1200; y += 80) {
      cx.beginPath();
      cx.moveTo(0, y);
      cx.lineTo(1600, y);
      cx.stroke();
    }

    // High-impact neon geometric vector target
    cx.save();
    cx.translate(800, 560);

    // Glowing concentric rings
    for (var r = 80; r <= 380; r += 60) {
      cx.beginPath();
      cx.arc(0, 0, r, 0, Math.PI * 2);
      cx.strokeStyle = r === 260 ? '#663af3' : 'rgba(209, 228, 250, 0.4)';
      cx.lineWidth = r === 260 ? 3 : 1.5;
      cx.stroke();
    }

    // Crosshairs
    cx.strokeStyle = '#33ff66';
    cx.lineWidth = 2;
    cx.beginPath();
    cx.moveTo(-420, 0); cx.lineTo(-30, 0);
    cx.moveTo(30, 0); cx.lineTo(420, 0);
    cx.moveTo(0, -320); cx.lineTo(0, -30);
    cx.moveTo(0, 30); cx.lineTo(0, 320);
    cx.stroke();

    // Corner brackets
    cx.strokeStyle = '#00f0ff';
    cx.lineWidth = 3;
    var bSize = 340;
    var bArm = 40;
    cx.beginPath(); cx.moveTo(-bSize, -bSize + bArm); cx.lineTo(-bSize, -bSize); cx.lineTo(-bSize + bArm, -bSize); cx.stroke();
    cx.beginPath(); cx.moveTo(bSize - bArm, -bSize); cx.lineTo(bSize, -bSize); cx.lineTo(bSize, -bSize + bArm); cx.stroke();
    cx.beginPath(); cx.moveTo(-bSize, bSize - bArm); cx.lineTo(-bSize, bSize); cx.lineTo(-bSize + bArm, bSize); cx.stroke();
    cx.beginPath(); cx.moveTo(bSize - bArm, bSize); cx.lineTo(bSize, bSize); cx.lineTo(bSize, bSize - bArm); cx.stroke();

    // Central core
    cx.beginPath();
    cx.arc(0, 0, 18, 0, Math.PI * 2);
    cx.fillStyle = '#ffffff';
    cx.fill();
    cx.restore();

    // SMPTE calibration block inside demo graphic
    var smpteColors = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    var barW = 80;
    var startX = 800 - (smpteColors.length * barW) / 2;
    for (var i = 0; i < smpteColors.length; i++) {
      cx.fillStyle = smpteColors[i];
      cx.fillRect(startX + i * barW, 920, barW, 36);
    }

    // Typography
    cx.fillStyle = '#ffffff';
    cx.font = '600 52px "Space Grotesk", sans-serif';
    cx.textAlign = 'center';
    cx.fillText('KOJERENS CRT SYNTHESIZER', 800, 1020);

    cx.font = '500 20px "JetBrains Mono", monospace';
    cx.fillStyle = '#9da7ba';
    cx.fillText('BEAM DYNAMICS // PHOSPHOR MASK // NTSC TIMEBASE', 800, 1065);

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
        alert('Could not render image file. Please select a valid graphic (PNG, JPG, WebP, SVG, GIF).');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
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
    // Draw base scaled image
    cropCtx.drawImage(sourceImg, 0, 0, cw, ch);

    // Dimmed overlay outside crop box
    cropCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    cropCtx.fillRect(0, 0, cw, cropState.startY);
    cropCtx.fillRect(0, cropState.startY + cropState.h, cw, ch - (cropState.startY + cropState.h));
    cropCtx.fillRect(0, cropState.startY, cropState.startX, cropState.h);
    cropCtx.fillRect(cropState.startX + cropState.w, cropState.startY, cw - (cropState.startX + cropState.w), cropState.h);

    // Crop box outline
    cropCtx.strokeStyle = '#ffffff';
    cropCtx.lineWidth = 1.5;
    cropCtx.strokeRect(cropState.startX, cropState.startY, cropState.w, cropState.h);

    // Rule of thirds grid
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

  // Build Phosphor Mask Pattern
  function createPhosphorPattern(maskType, pitch, opacity) {
    if (maskType === 'none' || opacity <= 0) return null;
    pitch = Math.max(1, pitch);

    if (maskType === 'aperture') {
      var pW = pitch * 3;
      var pH = 2;
      maskPatternCanvas.width = pW;
      maskPatternCanvas.height = pH;
      maskPatternCtx.clearRect(0, 0, pW, pH);

      maskPatternCtx.fillStyle = 'rgba(255, 30, 30, ' + opacity + ')';
      maskPatternCtx.fillRect(0, 0, pitch, pH);

      maskPatternCtx.fillStyle = 'rgba(30, 255, 30, ' + opacity + ')';
      maskPatternCtx.fillRect(pitch, 0, pitch, pH);

      maskPatternCtx.fillStyle = 'rgba(30, 80, 255, ' + opacity + ')';
      maskPatternCtx.fillRect(pitch * 2, 0, pitch, pH);

      return ctx.createPattern(maskPatternCanvas, 'repeat');
    }

    if (maskType === 'shadow') {
      var sW = pitch * 4;
      var sH = pitch * 4;
      maskPatternCanvas.width = sW;
      maskPatternCanvas.height = sH;
      maskPatternCtx.fillStyle = '#000000';
      maskPatternCtx.fillRect(0, 0, sW, sH);

      var dotR = pitch * 0.9;
      maskPatternCtx.fillStyle = 'rgba(255, 40, 40, ' + opacity + ')';
      maskPatternCtx.beginPath(); maskPatternCtx.arc(pitch, pitch, dotR, 0, Math.PI * 2); maskPatternCtx.fill();
      maskPatternCtx.fillStyle = 'rgba(40, 255, 40, ' + opacity + ')';
      maskPatternCtx.beginPath(); maskPatternCtx.arc(pitch * 3, pitch, dotR, 0, Math.PI * 2); maskPatternCtx.fill();

      maskPatternCtx.fillStyle = 'rgba(40, 80, 255, ' + opacity + ')';
      maskPatternCtx.beginPath(); maskPatternCtx.arc(pitch * 2, pitch * 3, dotR, 0, Math.PI * 2); maskPatternCtx.fill();

      return ctx.createPattern(maskPatternCanvas, 'repeat');
    }

    if (maskType === 'slot') {
      var bW = pitch * 3;
      var bH = pitch * 4;
      maskPatternCanvas.width = bW;
      maskPatternCanvas.height = bH;
      maskPatternCtx.fillStyle = '#000000';
      maskPatternCtx.fillRect(0, 0, bW, bH);

      maskPatternCtx.fillStyle = 'rgba(255, 40, 40, ' + opacity + ')';
      maskPatternCtx.fillRect(0, 0, pitch, pitch * 2);
      maskPatternCtx.fillStyle = 'rgba(40, 255, 40, ' + opacity + ')';
      maskPatternCtx.fillRect(pitch, pitch * 2, pitch, pitch * 2);
      maskPatternCtx.fillStyle = 'rgba(40, 90, 255, ' + opacity + ')';
      maskPatternCtx.fillRect(pitch * 2, 0, pitch, pitch * 2);

      return ctx.createPattern(maskPatternCanvas, 'repeat');
    }

    if (maskType === 'mesh') {
      var mW = pitch * 2;
      var mH = pitch * 2;
      maskPatternCanvas.width = mW;
      maskPatternCanvas.height = mH;
      maskPatternCtx.fillStyle = '#000000';
      maskPatternCtx.fillRect(0, 0, mW, mH);
      maskPatternCtx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
      maskPatternCtx.fillRect(0, 0, pitch, pitch);
      maskPatternCtx.fillRect(pitch, pitch, pitch, pitch);
      return ctx.createPattern(maskPatternCanvas, 'repeat');
    }

    return null;
  }

  // ==========================================================================
  // CORE CRT SYNTHESIS PIPELINE
  // ==========================================================================
  function renderCrt(targetCtx, targetW, targetH, isOverlayOnly) {
    var destCtx = targetCtx || ctx;
    var dim = getActiveDimensions();
    var W = targetW || dim.w;
    var H = targetH || dim.h;

    // Configure main offscreen buffer
    bufferCanvas.width = W;
    bufferCanvas.height = H;
    bufferCtx.clearRect(0, 0, W, H);

    // 1. BASE IMAGE DRAWING
    if (!isOverlayOnly && state.image) {
      var imgW = state.image.naturalWidth || state.image.width || W;
      var imgH = state.image.naturalHeight || state.image.height || H;
      var scale = Math.max(W / imgW, H / imgH);
      var drawW = imgW * scale;
      var drawH = imgH * scale;
      var drawX = (W - drawW) / 2;
      var drawY = (H - drawH) / 2;

      bufferCtx.drawImage(state.image, drawX, drawY, drawW, drawH);

      if (state.ghosting > 0) {
        var ghostOffset = Math.round(W * 0.025);
        bufferCtx.save();
        bufferCtx.globalAlpha = (state.ghosting / 100) * 0.45;
        bufferCtx.drawImage(state.image, drawX + ghostOffset, drawY, drawW, drawH);
        bufferCtx.restore();
      }

      applyPixelProcessing(bufferCtx, W, H);
    } else {
      bufferCtx.fillStyle = isOverlayOnly ? 'rgba(0, 0, 0, 0)' : '#020308';
      bufferCtx.fillRect(0, 0, W, H);
    }

    // 2. ELECTRON BEAM BLOOM (Halation)
    if (!isOverlayOnly && state.beamBloom > 0 && state.image) {
      bloomCanvas.width = Math.round(W / 2);
      bloomCanvas.height = Math.round(H / 2);
      bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
      bloomCtx.filter = 'blur(6px) brightness(1.2)';
      bloomCtx.drawImage(bufferCanvas, 0, 0, bloomCanvas.width, bloomCanvas.height);
      bloomCtx.filter = 'none';

      bufferCtx.save();
      bufferCtx.globalCompositeOperation = 'screen';
      bufferCtx.globalAlpha = (state.beamBloom / 100) * 0.6;
      bufferCtx.drawImage(bloomCanvas, 0, 0, W, H);
      bufferCtx.restore();
    }

    // 3. PHOSPHOR MASK GRID
    if (state.maskType !== 'none' && state.maskOpacity > 0) {
      var maskNorm = state.maskOpacity / 100;
      var pattern = createPhosphorPattern(state.maskType, state.maskPitch, maskNorm);
      if (pattern) {
        bufferCtx.save();
        bufferCtx.globalCompositeOperation = isOverlayOnly ? 'source-over' : 'multiply';
        bufferCtx.fillStyle = pattern;
        bufferCtx.fillRect(0, 0, W, H);
        bufferCtx.restore();
      }
    }

    // 4. SCANLINES & INTERLACING
    if (state.scanlineOpacity > 0 && state.scanlineCount > 0) {
      applyScanlines(bufferCtx, W, H);
    }

    // 5. TUBE CURVATURE & BARREL DISTORTION
    destCtx.save();
    destCtx.clearRect(0, 0, W, H);

    if (state.curvature > 0) {
      applyBarrelDistortion(destCtx, bufferCanvas, W, H, state.curvature / 100);
    } else {
      destCtx.drawImage(bufferCanvas, 0, 0, W, H);
    }

    // 6. BEZEL VIGNETTE & CORNER DARKENING
    if (state.vignette > 0) {
      applyVignette(destCtx, W, H, state.vignette / 100);
    }

    // 7. GLASS SPECULAR GLOW
    if (state.glassGlow > 0) {
      applyGlassGlow(destCtx, W, H, state.glassGlow / 100);
    }

    // 8. CORNER BEZEL ROUNDING
    if (state.cornerRound > 0) {
      applyCornerRounding(destCtx, W, H, state.cornerRound);
    }

    // 9. TELEMETRY, OSD & SMPTE BADGE
    if (state.showOsd) {
      drawOsdHud(destCtx, W, H);
    }
    if (state.showSmpte) {
      drawSmpteBadge(destCtx, W, H);
    }
    if (state.showFrameText) {
      drawFrameTelemetry(destCtx, W, H);
    }

    destCtx.restore();
    updateStatusFooter();
  }

  // ==========================================================================
  // PIXEL PROCESSING: TONE, RGB SPLIT, JITTER, BLEED & RF NOISE
  // ==========================================================================
  function applyPixelProcessing(bCtx, W, H) {
    var imgData = bCtx.getImageData(0, 0, W, H);
    var data = imgData.data;
    var len = data.length;

    var bAdd = state.brightness * 2.5;
    var cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
    var sat = state.saturation / 100;
    var pal = state.palette;

    for (var i = 0; i < len; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];

      r = cFactor * (r - 128) + 128 + bAdd;
      g = cFactor * (g - 128) + 128 + bAdd;
      b = cFactor * (b - 128) + 128 + bAdd;

      var luma = 0.299 * r + 0.587 * g + 0.114 * b;

      if (pal === 'rgb') {
        r = luma + sat * (r - luma);
        g = luma + sat * (g - luma);
        b = luma + sat * (b - luma);
      } else if (pal === 'green_p1') {
        r = luma * 0.15; g = luma * 1.15; b = luma * 0.35;
      } else if (pal === 'amber_p3') {
        r = luma * 1.15; g = luma * 0.72; b = luma * 0.04;
      } else if (pal === 'white_p4') {
        r = luma; g = luma; b = luma;
      } else if (pal === 'cyan') {
        r = luma * 0.05; g = luma * 0.95; b = luma * 1.10;
      } else if (pal === 'plasma') {
        r = luma * 1.25; g = luma * 0.45; b = luma * 0.05;
      } else if (pal === 'blood') {
        r = luma * 1.25; g = luma * 0.12; b = luma * 0.18;
      }

      data[i] = r < 0 ? 0 : r > 255 ? 255 : r;
      data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
      data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }

    // Chromatic Aberration
    if (state.rgbSplit > 0) {
      var shift = Math.round(state.rgbSplit);
      var srcData = new Uint8ClampedArray(data);
      for (var y = 0; y < H; y++) {
        var rowStart = y * W * 4;
        for (var x = 0; x < W; x++) {
          var idx = rowStart + x * 4;
          var redX = Math.max(0, x - shift);
          data[idx] = srcData[rowStart + redX * 4];
          var blueX = Math.min(W - 1, x + shift);
          data[idx + 2] = srcData[rowStart + blueX * 4 + 2];
        }
      }
    }

    // NTSC Chroma Bleed
    if (state.chromaBleed > 0) {
      var bleed = Math.round(state.chromaBleed);
      for (var cy = 0; cy < H; cy++) {
        var cRow = cy * W * 4;
        for (var cx = 1; cx < W; cx++) {
          var cIdx = cRow + cx * 4;
          var prevIdx = cRow + (cx - 1) * 4;
          var bleedWeight = Math.min(0.7, bleed * 0.05);
          data[cIdx] = data[cIdx] * (1 - bleedWeight) + data[prevIdx] * bleedWeight;
          data[cIdx + 2] = data[cIdx + 2] * (1 - bleedWeight) + data[prevIdx + 2] * bleedWeight;
        }
      }
    }

    // Sync Jitter
    if (state.syncJitter > 0) {
      var jitterMax = Math.round(state.syncJitter);
      var jitSrc = new Uint8ClampedArray(data);
      for (var jy = 0; jy < H; jy++) {
        var lineShift = 0;
        if (Math.random() < 0.35) {
          lineShift = Math.round((Math.random() - 0.5) * jitterMax * 2);
        } else if (jy % 8 === 0) {
          lineShift = Math.round(Math.sin(jy * 0.15) * jitterMax);
        }

        if (lineShift !== 0) {
          var jRow = jy * W * 4;
          for (var jx = 0; jx < W; jx++) {
            var targetX = jx + lineShift;
            if (targetX >= 0 && targetX < W) {
              var tIdx = jRow + targetX * 4;
              var sIdx = jRow + jx * 4;
              data[tIdx] = jitSrc[sIdx];
              data[tIdx + 1] = jitSrc[sIdx + 1];
              data[tIdx + 2] = jitSrc[sIdx + 2];
            }
          }
        }
      }
    }

    // VHS Tracking Noise
    if (state.vhsNoise > 0) {
      var barH = Math.round(H * 0.06);
      var barY = Math.round(H * 0.72);
      var noiseStrength = state.vhsNoise / 100;
      for (var vy = barY; vy < barY + barH && vy < H; vy++) {
        var vRow = vy * W * 4;
        var rowTear = Math.round((Math.random() - 0.5) * noiseStrength * 36);
        for (var vx = 0; vx < W; vx++) {
          var vIdx = vRow + vx * 4;
          if (Math.random() < noiseStrength * 0.75) {
            var saltVal = Math.random() < 0.5 ? 255 : 0;
            data[vIdx] = saltVal;
            data[vIdx + 1] = saltVal;
            data[vIdx + 2] = saltVal;
          } else if (rowTear !== 0 && vx + rowTear >= 0 && vx + rowTear < W) {
            var shiftIdx = vRow + (vx + rowTear) * 4;
            data[vIdx] = data[shiftIdx];
            data[vIdx + 1] = data[shiftIdx + 1];
            data[vIdx + 2] = data[shiftIdx + 2];
          }
        }
      }
    }

    // RF Snow
    if (state.rfSnow > 0) {
      var snowIntensity = (state.rfSnow / 100) * 0.25;
      for (var n = 0; n < len; n += 4) {
        if (Math.random() < 0.4) {
          var noiseDelta = (Math.random() - 0.5) * snowIntensity * 255;
          data[n] = Math.min(255, Math.max(0, data[n] + noiseDelta));
          data[n + 1] = Math.min(255, Math.max(0, data[n + 1] + noiseDelta));
          data[n + 2] = Math.min(255, Math.max(0, data[n + 2] + noiseDelta));
        }
      }
    }

    bCtx.putImageData(imgData, 0, 0);
  }

  // ==========================================================================
  // SCANLINES & INTERLACING
  // ==========================================================================
  function applyScanlines(bCtx, W, H) {
    var count = Math.max(80, state.scanlineCount);
    var scanHeight = H / count;
    var opacity = state.scanlineOpacity / 100;
    var isOdd = state.interlace === 'odd';
    var isOff = state.interlace === 'off';

    bCtx.save();
    for (var i = 0; i < count; i++) {
      var y = i * scanHeight;
      if (!isOff) {
        var isFieldLine = (i % 2 === (isOdd ? 1 : 0));
        var lineAlpha = isFieldLine ? opacity * 0.4 : opacity;
        bCtx.fillStyle = 'rgba(0, 0, 0, ' + lineAlpha + ')';
      } else {
        bCtx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
      }
      bCtx.fillRect(0, y + scanHeight * 0.45, W, scanHeight * 0.55);
    }
    bCtx.restore();
  }

  // ==========================================================================
  // TUBE CURVATURE (BARREL DISTORTION)
  // ==========================================================================
  function applyBarrelDistortion(destCtx, srcCanvas, W, H, k) {
    var sw = srcCanvas.width;
    var sh = srcCanvas.height;
    var srcCtx = srcCanvas.getContext('2d');
    var srcData = srcCtx.getImageData(0, 0, sw, sh);
    var srcPixels = new Uint32Array(srcData.data.buffer);

    var destData = destCtx.createImageData(W, H);
    var destPixels = new Uint32Array(destData.data.buffer);

    var cx = W / 2;
    var cy = H / 2;
    var invCx = 1 / cx;
    var invCy = 1 / cy;
    var distFactor = k * 0.28;

    for (var y = 0; y < H; y++) {
      var dy = (y - cy) * invCy;
      var dy2 = dy * dy;
      var rowOffset = y * W;

      for (var x = 0; x < W; x++) {
        var dx = (x - cx) * invCx;
        var r2 = dx * dx + dy2;
        var f = 1 + distFactor * r2;
        var sx = Math.round(cx + dx * f * cx);
        var sy = Math.round(cy + dy * f * cy);

        if (sx >= 0 && sx < sw && sy >= 0 && sy < sh) {
          destPixels[rowOffset + x] = srcPixels[sy * sw + sx];
        } else {
          destPixels[rowOffset + x] = 0xff000000;
        }
      }
    }

    destCtx.putImageData(destData, 0, 0);
  }

  function applyVignette(dCtx, W, H, intensity) {
    dCtx.save();
    var maxR = Math.sqrt(W * W + H * H) * 0.5;
    var vigGrad = dCtx.createRadialGradient(W / 2, H / 2, maxR * 0.35, W / 2, H / 2, maxR * 0.95);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.7, 'rgba(0, 0, 0, ' + (intensity * 0.45) + ')');
    vigGrad.addColorStop(1, 'rgba(0, 0, 0, ' + (intensity * 0.98) + ')');
    dCtx.fillStyle = vigGrad;
    dCtx.fillRect(0, 0, W, H);
    dCtx.restore();
  }

  function applyGlassGlow(dCtx, W, H, intensity) {
    dCtx.save();
    var glowGrad = dCtx.createLinearGradient(0, 0, W * 0.6, H * 0.45);
    glowGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (intensity * 0.28) + ')');
    glowGrad.addColorStop(0.35, 'rgba(200, 225, 255, ' + (intensity * 0.08) + ')');
    glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    dCtx.fillStyle = glowGrad;
    dCtx.fillRect(0, 0, W, H);
    dCtx.restore();
  }

  function applyCornerRounding(dCtx, W, H, r) {
    dCtx.save();
    dCtx.fillStyle = '#05060f';
    dCtx.beginPath(); dCtx.moveTo(0, 0); dCtx.lineTo(r, 0); dCtx.arcTo(0, 0, 0, r, r); dCtx.closePath(); dCtx.fill();
    dCtx.beginPath(); dCtx.moveTo(W, 0); dCtx.lineTo(W - r, 0); dCtx.arcTo(W, 0, W, r, r); dCtx.closePath(); dCtx.fill();
    dCtx.beginPath(); dCtx.moveTo(0, H); dCtx.lineTo(r, H); dCtx.arcTo(0, H, 0, H - r, r); dCtx.closePath(); dCtx.fill();
    dCtx.beginPath(); dCtx.moveTo(W, H); dCtx.lineTo(W - r, H); dCtx.arcTo(W, H, W, H - r, r); dCtx.closePath(); dCtx.fill();
    dCtx.restore();
  }

  // ==========================================================================
  // OSD HUD OVERLAY (NO EMOJI)
  // ==========================================================================
  function drawOsdHud(dCtx, W, H) {
    dCtx.save();
    var osdSize = Math.max(14, Math.round(W * 0.016));
    dCtx.font = 'bold ' + osdSize + 'px "JetBrains Mono", monospace';
    dCtx.fillStyle = '#33ff66';
    dCtx.shadowColor = '#33ff66';
    dCtx.shadowBlur = 8;
    dCtx.textAlign = 'left';

    var margin = Math.round(W * 0.035);
    dCtx.fillText(state.osdText, margin, margin + osdSize);

    // Canvas-drawn red circle for REC (No unicode emoji)
    dCtx.textAlign = 'right';
    var recTextX = W - margin - 120;
    dCtx.fillStyle = '#ff3344';
    dCtx.shadowColor = '#ff3344';
    dCtx.beginPath();
    dCtx.arc(recTextX - 44, margin + osdSize - osdSize * 0.35, osdSize * 0.32, 0, Math.PI * 2);
    dCtx.fill();
    dCtx.fillText('REC', recTextX, margin + osdSize);

    dCtx.fillStyle = '#ffffff';
    dCtx.shadowColor = '#ffffff';
    dCtx.fillText('00:24:18:09', W - margin, margin + osdSize);
    dCtx.restore();
  }

  function drawSmpteBadge(dCtx, W, H) {
    dCtx.save();
    var barColors = ['#ffffff', '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#0000ff', '#111111'];
    var barW = Math.max(6, Math.round(W * 0.009));
    var barH = Math.max(14, Math.round(H * 0.018));
    var margin = Math.round(W * 0.035);
    var startX = margin;
    var startY = H - margin - barH;

    dCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    dCtx.lineWidth = 1;
    dCtx.strokeRect(startX - 1, startY - 1, barColors.length * barW + 2, barH + 2);

    for (var i = 0; i < barColors.length; i++) {
      dCtx.fillStyle = barColors[i];
      dCtx.fillRect(startX + i * barW, startY, barW, barH);
    }
    dCtx.restore();
  }

  function drawFrameTelemetry(dCtx, W, H) {
    dCtx.save();
    var fSize = Math.max(10, Math.round(W * 0.009));
    dCtx.font = '500 ' + fSize + 'px "JetBrains Mono", monospace';
    dCtx.fillStyle = 'rgba(209, 228, 250, 0.7)';
    dCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    dCtx.shadowBlur = 4;

    var padX = Math.round(W * 0.035);
    var padY = Math.round(H * 0.035);

    dCtx.textAlign = 'left';
    dCtx.fillText(state.frameTL, padX, padY + (state.showOsd ? fSize * 2.8 : 0));

    dCtx.textAlign = 'right';
    dCtx.fillText(state.frameTR, W - padX, padY + (state.showOsd ? fSize * 2.8 : 0));

    dCtx.textAlign = 'left';
    dCtx.fillText(state.frameBL, padX + (state.showSmpte ? 90 : 0), H - padY);

    dCtx.textAlign = 'right';
    dCtx.fillText(state.frameBR, W - padX, H - padY);
    dCtx.restore();
  }

  function updateStatusFooter() {
    var dim = getActiveDimensions();
    var pName = PRESETS[state.preset] ? PRESETS[state.preset].name : 'Custom CRT';
    var mName = state.maskType.toUpperCase();
    if (exportStatusText) {
      exportStatusText.textContent = dim.w + ' x ' + dim.h + ' · ' + pName + ' · ' + mName;
    }
  }

  // ==========================================================================
  // PRESET & PARAMETER BINDINGS
  // ==========================================================================
  function applyPreset(presetKey) {
    var p = PRESETS[presetKey];
    if (!p) return;
    state.preset = presetKey;
    state.curvature = p.curvature;
    state.cornerRound = p.cornerRound;
    state.vignette = p.vignette;
    state.glassGlow = p.glassGlow;
    state.scanlineCount = p.scanlineCount;
    state.scanlineOpacity = p.scanlineOpacity;
    state.beamBloom = p.beamBloom;
    state.interlace = p.interlace;
    state.maskType = p.maskType;
    state.maskPitch = p.maskPitch;
    state.maskOpacity = p.maskOpacity;
    state.rgbSplit = p.rgbSplit;
    state.syncJitter = p.syncJitter;
    state.chromaBleed = p.chromaBleed;
    state.vhsNoise = p.vhsNoise;
    state.rfSnow = p.rfSnow;
    state.ghosting = p.ghosting;
    state.palette = p.palette;
    state.brightness = p.brightness;
    state.contrast = p.contrast;
    state.saturation = p.saturation;

    syncControlsWithState();
    scheduleUpdate();
  }

  function syncControlsWithState() {
    if (curvatureEl) { curvatureEl.value = state.curvature; curvatureVal.textContent = state.curvature + '%'; }
    if (cornerRoundEl) { cornerRoundEl.value = state.cornerRound; cornerRoundVal.textContent = state.cornerRound + 'px'; }
    if (vignetteEl) { vignetteEl.value = state.vignette; vignetteVal.textContent = state.vignette + '%'; }
    if (glassGlowEl) { glassGlowEl.value = state.glassGlow; glassGlowVal.textContent = state.glassGlow + '%'; }
    if (scanlineCountEl) { scanlineCountEl.value = state.scanlineCount; scanlineCountVal.textContent = state.scanlineCount + ' lines'; }
    if (scanlineOpacityEl) { scanlineOpacityEl.value = state.scanlineOpacity; scanlineOpacityVal.textContent = state.scanlineOpacity + '%'; }
    if (beamBloomEl) { beamBloomEl.value = state.beamBloom; beamBloomVal.textContent = state.beamBloom + '%'; }
    if (maskTypeSelect) { maskTypeSelect.value = state.maskType; maskTypeVal.textContent = state.maskType; }
    if (maskPitchEl) { maskPitchEl.value = state.maskPitch; maskPitchVal.textContent = state.maskPitch + 'px'; }
    if (maskOpacityEl) { maskOpacityEl.value = state.maskOpacity; maskOpacityVal.textContent = state.maskOpacity + '%'; }
    if (rgbSplitEl) { rgbSplitEl.value = state.rgbSplit; rgbSplitVal.textContent = state.rgbSplit + 'px'; }
    if (syncJitterEl) { syncJitterEl.value = state.syncJitter; syncJitterVal.textContent = state.syncJitter + 'px'; }
    if (chromaBleedEl) { chromaBleedEl.value = state.chromaBleed; chromaBleedVal.textContent = state.chromaBleed + 'px'; }
    if (vhsNoiseEl) { vhsNoiseEl.value = state.vhsNoise; vhsNoiseVal.textContent = state.vhsNoise + '%'; }
    if (rfSnowEl) { rfSnowEl.value = state.rfSnow; rfSnowVal.textContent = state.rfSnow + '%'; }
    if (ghostingEl) { ghostingEl.value = state.ghosting; ghostingVal.textContent = state.ghosting + '%'; }
    if (paletteSelect) { paletteSelect.value = state.palette; paletteNameVal.textContent = state.palette; }
    if (brightnessEl) { brightnessEl.value = state.brightness; brightnessVal.textContent = state.brightness; }
    if (contrastEl) { contrastEl.value = state.contrast; contrastVal.textContent = state.contrast; }
    if (saturationEl) { saturationEl.value = state.saturation; saturationVal.textContent = state.saturation + '%'; }

    // Interlace buttons
    var interlaceBtns = document.querySelectorAll('[data-interlace]');
    interlaceBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-interlace') === state.interlace);
    });
    if (interlaceVal) {
      interlaceVal.textContent = state.interlace === 'even' ? 'Even Fields' : state.interlace === 'odd' ? 'Odd Fields' : 'Progressive';
    }

    // Preset tabs, pills, & cards
    var presetTabs = document.querySelectorAll('.mode-tab, .preset-pill-btn, .preset-card-btn');
    presetTabs.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === state.preset);
    });
  }

  // ==========================================================================
  // EVENT LISTENERS & UI WIRING
  // ==========================================================================
  function initEventListeners() {
    // Preset buttons (drawer pills & right sidebar cards)
    var presetBtns = document.querySelectorAll('.mode-tab, .preset-pill-btn, .preset-card-btn');
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pKey = btn.getAttribute('data-preset');
        applyPreset(pKey);
      });
    });

    // Icon Rail navigation (far right)
    var railBtns = document.querySelectorAll('.rail-btn');
    railBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panelTarget = btn.getAttribute('data-panel');
        var wasActive = btn.classList.contains('active');

        railBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });

        if (wasActive && panelDrawer.classList.contains('open')) {
          panelDrawer.classList.remove('open');
        } else {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          panelDrawer.classList.add('open');

          var sec = document.querySelector('section[data-section="' + panelTarget + '"]');
          if (sec) {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Collapse panel buttons
    var collapseBtns = document.querySelectorAll('.toggle-collapse');
    collapseBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var body = btn.closest('.panel').querySelector('.panel-body');
        if (body) {
          var isHidden = body.style.display === 'none';
          body.style.display = isHidden ? 'block' : 'none';
          btn.textContent = isHidden ? '−' : '+';
        }
      });
    });

    // File Input & Drag and Drop
    if (replaceFileBtn) {
      replaceFileBtn.addEventListener('click', function () { fileInput.click(); });
    }
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          loadFile(e.target.files[0]);
        }
      });
    }

    // Demo Library Picker
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', function () {
        if (demoPickerPanel) {
          demoPickerPanel.style.display = demoPickerPanel.style.display === 'none' ? 'block' : 'none';
        }
      });
    }
    if (emptyLoadSampleBtn) {
      emptyLoadSampleBtn.addEventListener('click', function () {
        loadDemoAsset('street');
      });
    }

    var demoItems = document.querySelectorAll('.btn-demo-item');
    demoItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var demoKey = item.getAttribute('data-demo');
        loadDemoAsset(demoKey);
        if (demoPickerPanel) demoPickerPanel.style.display = 'none';
      });
    });

    // Drag and Drop
    wrap.addEventListener('dragover', function (e) {
      e.preventDefault();
      wrap.classList.add('drag-over');
    });
    wrap.addEventListener('dragleave', function () {
      wrap.classList.remove('drag-over');
    });
    wrap.addEventListener('drop', function (e) {
      e.preventDefault();
      wrap.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadFile(e.dataTransfer.files[0]);
      }
    });

    // ========================================================================
    // ZOOM & PAN CONTROLS
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
        cropState.ratio = btn.getAttribute('data-ratio');

        if (cropState.ratio === '1:1') {
          var side = Math.min(cropState.w, cropState.h);
          cropState.w = side; cropState.h = side;
        } else if (cropState.ratio === '4:3') {
          cropState.h = Math.round(cropState.w * (3 / 4));
        } else if (cropState.ratio === '16:9') {
          cropState.h = Math.round(cropState.w * (9 / 16));
        } else if (cropState.ratio === '3:4') {
          cropState.h = Math.round(cropState.w * (4 / 3));
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

        // Check if clicked near corners or inside box
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

    // Range Slider Inputs
    function bindSlider(el, valEl, prop, unit, scale) {
      if (!el) return;
      el.addEventListener('input', function () {
        var v = parseFloat(el.value);
        state[prop] = v;
        if (valEl) {
          valEl.textContent = (scale ? (v * scale).toFixed(1) : v) + (unit || '');
        }
        scheduleUpdate();
      });
    }

    bindSlider(fileOpacityEl, fileOpacityVal, 'fileOpacity', '', null);
    bindSlider(curvatureEl, curvatureVal, 'curvature', '%', null);
    bindSlider(cornerRoundEl, cornerRoundVal, 'cornerRound', 'px', null);
    bindSlider(vignetteEl, vignetteVal, 'vignette', '%', null);
    bindSlider(glassGlowEl, glassGlowVal, 'glassGlow', '%', null);
    bindSlider(scanlineCountEl, scanlineCountVal, 'scanlineCount', ' lines', null);
    bindSlider(scanlineOpacityEl, scanlineOpacityVal, 'scanlineOpacity', '%', null);
    bindSlider(beamBloomEl, beamBloomVal, 'beamBloom', '%', null);
    bindSlider(maskPitchEl, maskPitchVal, 'maskPitch', 'px', null);
    bindSlider(maskOpacityEl, maskOpacityVal, 'maskOpacity', '%', null);
    bindSlider(rgbSplitEl, rgbSplitVal, 'rgbSplit', 'px', null);
    bindSlider(syncJitterEl, syncJitterVal, 'syncJitter', 'px', null);
    bindSlider(chromaBleedEl, chromaBleedVal, 'chromaBleed', 'px', null);
    bindSlider(vhsNoiseEl, vhsNoiseVal, 'vhsNoise', '%', null);
    bindSlider(rfSnowEl, rfSnowVal, 'rfSnow', '%', null);
    bindSlider(ghostingEl, ghostingVal, 'ghosting', '%', null);
    bindSlider(brightnessEl, brightnessVal, 'brightness', '', null);
    bindSlider(contrastEl, contrastVal, 'contrast', '', null);
    bindSlider(saturationEl, saturationVal, 'saturation', '%', null);

    // Selects
    if (maskTypeSelect) {
      maskTypeSelect.addEventListener('change', function () {
        state.maskType = maskTypeSelect.value;
        if (maskTypeVal) maskTypeVal.textContent = maskTypeSelect.options[maskTypeSelect.selectedIndex].text.split(' ')[0];
        scheduleUpdate();
      });
    }

    if (paletteSelect) {
      paletteSelect.addEventListener('change', function () {
        state.palette = paletteSelect.value;
        if (paletteNameVal) paletteNameVal.textContent = paletteSelect.options[paletteSelect.selectedIndex].text.split(' ')[0];
        scheduleUpdate();
      });
    }

    if (canvasFormatEl) {
      canvasFormatEl.addEventListener('change', function () {
        state.format = canvasFormatEl.value;
        if (formatVal) formatVal.textContent = FORMATS[state.format] ? FORMATS[state.format].name : 'Custom';
        resizeCanvasViewport();
        scheduleUpdate();
      });
    }

    // Interlace segmented controls
    var interlaceBtns = document.querySelectorAll('[data-interlace]');
    interlaceBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        interlaceBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.interlace = btn.getAttribute('data-interlace');
        if (interlaceVal) {
          interlaceVal.textContent = state.interlace === 'even' ? 'Even Fields' : state.interlace === 'odd' ? 'Odd Fields' : 'Progressive';
        }
        scheduleUpdate();
      });
    });

    // OSD & Telemetry Toggles
    if (toggleOsd) {
      toggleOsd.addEventListener('change', function () {
        state.showOsd = toggleOsd.checked;
        scheduleUpdate();
      });
    }
    if (osdTextInput) {
      osdTextInput.addEventListener('input', function () {
        state.osdText = osdTextInput.value;
        scheduleUpdate();
      });
    }
    if (toggleSmpte) {
      toggleSmpte.addEventListener('change', function () {
        state.showSmpte = toggleSmpte.checked;
        scheduleUpdate();
      });
    }
    if (toggleFrameText) {
      toggleFrameText.addEventListener('change', function () {
        state.showFrameText = toggleFrameText.checked;
        frameTextControls.style.display = state.showFrameText ? 'block' : 'none';
        scheduleUpdate();
      });
    }

    if (frameTLInput) {
      frameTLInput.addEventListener('input', function () { state.frameTL = frameTLInput.value; scheduleUpdate(); });
    }
    if (frameTRInput) {
      frameTRInput.addEventListener('input', function () { state.frameTR = frameTRInput.value; scheduleUpdate(); });
    }
    if (frameBLInput) {
      frameBLInput.addEventListener('input', function () { state.frameBL = frameBLInput.value; scheduleUpdate(); });
    }
    if (frameBRInput) {
      frameBRInput.addEventListener('input', function () { state.frameBR = frameBRInput.value; scheduleUpdate(); });
    }

    // Randomize
    function randomizeParams() {
      var presetKeys = Object.keys(PRESETS);
      var rPreset = presetKeys[Math.floor(Math.random() * presetKeys.length)];
      applyPreset(rPreset);
      state.rgbSplit = Math.floor(Math.random() * 16);
      state.syncJitter = Math.floor(Math.random() * 18);
      state.chromaBleed = Math.floor(Math.random() * 20);
      syncControlsWithState();
      scheduleUpdate();
      if (window.StudioPipeline) {
        StudioPipeline.showToast('Randomized CRT beam parameters: ' + PRESETS[rPreset].name);
      }
    }

    if (randomizeSettingsBtn) randomizeSettingsBtn.addEventListener('click', randomizeParams);
    if (topbarRandomBtn) topbarRandomBtn.addEventListener('click', randomizeParams);

    // Export Buttons
    function triggerDownload(canvasToSave, filename) {
      var link = document.createElement('a');
      link.download = filename;
      link.href = canvasToSave.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (window.StudioPipeline) {
        StudioPipeline.showToast('Exported ' + filename);
      }
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var dim = getActiveDimensions();
        var expCanvas = document.createElement('canvas');
        expCanvas.width = dim.w;
        expCanvas.height = dim.h;
        var expCtx = expCanvas.getContext('2d');
        renderCrt(expCtx, dim.w, dim.h, false);
        var ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
        triggerDownload(expCanvas, 'tracker-crt-' + state.preset + '-' + ts + '.png');
      });
    }

    if (topbarDownloadBtn) {
      topbarDownloadBtn.addEventListener('click', function () {
        if (downloadBtn) downloadBtn.click();
      });
    }

    if (downloadOverlayBtn) {
      downloadOverlayBtn.addEventListener('click', function () {
        var dim = getActiveDimensions();
        var expCanvas = document.createElement('canvas');
        expCanvas.width = dim.w;
        expCanvas.height = dim.h;
        var expCtx = expCanvas.getContext('2d');
        renderCrt(expCtx, dim.w, dim.h, true);
        var ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
        triggerDownload(expCanvas, 'tracker-crt-overlay-' + ts + '.png');
      });
    }

    // Studio Pipeline Routing
    if (sendToTrackerBtn) {
      sendToTrackerBtn.addEventListener('click', function () {
        if (!state.image && !canvas.width) return;
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../blob-tracker/index.html', 'Blob Tracker');
        } else {
          window.location.href = '../blob-tracker/index.html';
        }
      });
    }

    if (sendToAsciiBtn) {
      sendToAsciiBtn.addEventListener('click', function () {
        if (!state.image && !canvas.width) return;
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../ascii-gen/index.html', 'ASCII Matrix');
        } else {
          window.location.href = '../ascii-gen/index.html';
        }
      });
    }

    if (sendToDitherBtn) {
      sendToDitherBtn.addEventListener('click', function () {
        if (!state.image && !canvas.width) return;
        var dataUrl = canvas.toDataURL('image/png');
        if (window.StudioPipeline) {
          StudioPipeline.sendImage(dataUrl, '../dither-gen/index.html', '1-Bit Dither');
        } else {
          window.location.href = '../dither-gen/index.html';
        }
      });
    }

    if (sharePresetBtn) {
      sharePresetBtn.addEventListener('click', function () {
        var url = getShareablePresetUrl();
        if (window.StudioPipeline) {
          StudioPipeline.copyTextToClipboard(url, 'Copied CRT preset URL');
        } else {
          navigator.clipboard.writeText(url);
          alert('Preset link copied to clipboard!');
        }
      });
    }

    // Global Paste Support
    if (window.StudioPipeline) {
      StudioPipeline.setupPasteHandler(function (file) {
        loadFile(file);
      });
    }

    window.addEventListener('resize', function () {
      resizeCanvasViewport();
      if (state.image) scheduleUpdate();
    });
  }

  // ==========================================================================
  // PRESET HASH SERIALIZATION
  // ==========================================================================
  function parseUrlHashPreset() {
    try {
      var hashStr = window.location.hash.replace(/^#/, '');
      if (!hashStr) return;
      var params = new URLSearchParams(hashStr);

      if (params.has('preset')) {
        state.preset = params.get('preset');
        applyPreset(state.preset);
      }
      if (params.has('curvature')) state.curvature = parseInt(params.get('curvature'), 10) || state.curvature;
      if (params.has('scanlineCount')) state.scanlineCount = parseInt(params.get('scanlineCount'), 10) || state.scanlineCount;
      if (params.has('rgbSplit')) state.rgbSplit = parseInt(params.get('rgbSplit'), 10) || state.rgbSplit;
      if (params.has('syncJitter')) state.syncJitter = parseInt(params.get('syncJitter'), 10) || state.syncJitter;
      if (params.has('format')) state.format = params.get('format');

      syncControlsWithState();
      updateStatusFooter();
    } catch (e) {
      console.warn('Could not parse CRT URL hash', e);
    }
  }

  function getShareablePresetUrl() {
    var params = new URLSearchParams();
    params.set('preset', state.preset);
    params.set('curvature', state.curvature);
    params.set('scanlineCount', state.scanlineCount);
    params.set('rgbSplit', state.rgbSplit);
    params.set('syncJitter', state.syncJitter);
    params.set('format', state.format);
    return window.location.origin + window.location.pathname + '#' + params.toString();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  initEventListeners();
  resizeCanvasViewport();
  parseUrlHashPreset();
  syncControlsWithState();
  updateStatusFooter();

  // Check Studio Pipeline for incoming transferred graphic
  if (window.StudioPipeline) {
    StudioPipeline.receiveImage(function (dataUrl) {
      var pImg = new Image();
      pImg.onload = function () {
        state.rawImage = pImg;
        applyLoadedFile(pImg);
      };
      pImg.src = dataUrl;
    });
  }

})();
