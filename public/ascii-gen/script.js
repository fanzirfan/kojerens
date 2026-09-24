/* ============================================================================
   GLYPHTRIX - JAVASCRIPT
   ============================================================================
   
   Table of Contents:
   1. UTILITY FUNCTIONS
   2. CHARACTER SET CONFIGURATION
   3. DOM ELEMENT REFERENCES
      3.1 Canvas & Media Elements
      3.2 Image Settings Controls
      3.3 Glyph/Font Settings Controls
      3.4 Output Settings Controls
      3.5 Button & Action Elements
      3.6 Layout & Panel Elements
   4. STATE MANAGEMENT VARIABLES
   5. CONFIGURATION - FONTS & CONSTANTS
   6. HISTORY & UNDO/REDO SYSTEM
   7. FILE UPLOAD & LOADING
   8. IMAGE PROCESSING FUNCTIONS
   9. ASCII RENDERING ENGINE
   10. VIDEO PROCESSING
   11. EXPORT FUNCTIONS
   12. UI EVENT HANDLERS
   13. MOBILE SUPPORT
   14. INITIALIZATION & EVENT LISTENERS
   
   ============================================================================ */


/* ============================================================================
   1. UTILITY FUNCTIONS
   ============================================================================ */

// Global spinner SVG generator
function getSpinner(size = 24) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><g><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".14"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".29" transform="rotate(30 12 12)"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".43" transform="rotate(60 12 12)"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".57" transform="rotate(90 12 12)"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".71" transform="rotate(120 12 12)"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity=".86" transform="rotate(150 12 12)"/><rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>`;
}


/* ============================================================================
   2. CHARACTER SET CONFIGURATION
   ============================================================================ */

let randomNumberMap = {};
const numbersChars = "0123456789";
const latinBasicChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ";
const cyrillicChars = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const devanagariChars = "अआइईउऊऋॠऌएऐओऔअंअःकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़य़ऴक्षत्रज्ञािीुूेैोौं";
const thaiChars = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะาำิีึืุูเแโใไๅๆ็่้๊๋์";
const japaneseChars = "一あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン日一国会人年大十二本中長出三同時政事自行社見月分議後前民生連五発間対上部東者党地合市業内相方法四定今回新場金員九入選立開手米力学問高代明実円関決子動京全目表戦経通外最言氏現理調体化田当八六約主題下首意法";
const koreanChars = "의가은은이하고는에의한을은도를다지지와과는있사기대에고는도한수시나자일내하는로와는생것있적정면위자이에서들중로서나시로를만아지자에서어는국년시기다리리마게명야";
const chineseChars = "一的是不了人在有我他这中大为上个国到说们时要就出会可也你对生能而子那得于着下自之年过发后作里用道行所然家种事成方多经么去法学如都同现当没动面起看定天分还进好小部其些主样理心她本前开但因只从想实日军者无力它与长把机十民第公此已工使情明性知全三又关点正业外将两高间由问很最重并物手应战向头文体政美相见被利什二等产或新己制身果加西斯月话合回特代内信表化老给世位次度门任常先海通教儿原东声提立及比员解水名真论处走义各入几口认条平系气题活尔更别打女变四神总何电数安少报才结反受目太量再感建务做接必场件计管期市直德资命山金指克许统区保至队形社便空决治展马科司五基眼书非则听白却界达光放强即像难且权思王象完设式色路记南品住告类求据程北边风规解";
const arabicChars = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
let customCharSeqIndex = 0;


/* ============================================================================
   3. DOM ELEMENT REFERENCES
   ============================================================================ */

/* 3.1 Canvas & Media Elements */
const imageUpload = document.getElementById('imageUpload');
const condensedImageUpload = document.getElementById('condensedImageUpload');
const inputCanvas = document.getElementById('inputCanvas');
const inputVideo = document.getElementById('inputVideo');
const outputCanvas = document.getElementById('outputCanvas');
const inputCtx = inputCanvas.getContext('2d');
const outputCtx = outputCanvas.getContext('2d');
const loadingSpinner = document.getElementById('loadingSpinner');
const mobileLoadingSpinner = document.getElementById('mobileLoadingSpinner');
const sequenceLoadingOverlay = document.getElementById('sequenceLoadingOverlay');
const sequenceLoadingOverlayText = document.getElementById('sequenceLoadingOverlayText');
const cancelSequenceButton = document.getElementById('cancelSequenceButton');


const condensedUploadZone = document.getElementById('condensedUploadZone');
const condensedFilename = document.getElementById('condensedFilename');
const uploadPanelTitle = document.getElementById('uploadPanelTitle');

/* 3.2 Image Settings Controls */
const levelsSlider = document.getElementById('levelsSlider');
const levelsValueDisplay = document.getElementById('levelsValueDisplay');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValueDisplay = document.getElementById('brightnessValueDisplay');
const shadowInputSlider = document.getElementById('shadowInputSlider');
const shadowInputValueDisplay = document.getElementById('shadowInputValueDisplay');
const midtoneGammaSlider = document.getElementById('midtoneGammaSlider');
const midtoneGammaValueDisplay = document.getElementById('midtoneGammaValueDisplay');
const highlightInputSlider = document.getElementById('highlightInputSlider');
const highlightInputValueDisplay = document.getElementById('highlightInputValueDisplay');
const previewChangesToggle = document.getElementById('previewChangesToggle');
const invertColorsToggle = document.getElementById('invertColorsToggle');
const contrastSlider = document.getElementById('contrastSlider');
const contrastSliderContainer = document.getElementById('contrastSliderContainer');
const contrastValueDisplay = document.getElementById('contrastValueDisplay');
const chromaRemovalToggle = document.getElementById('backgroundRemovalToggle');
const chromaRemovalContainer = document.getElementById('backgroundRemovalContainer');
const invertColorsContainer = document.getElementById('invertColorsContainer');
const previewChangesContainer = document.getElementById('previewChangesContainer');

/* 3.3 Glyph/Font Settings Controls */
const densityInput = document.getElementById('densityInput');
const densityDecrement = document.getElementById('densityDecrement');
const densityIncrement = document.getElementById('densityIncrement');
const gridSizeDisplay = document.getElementById('gridSizeDisplay');
const fontSelect = document.getElementById('fontSelect');
const prevFontButton = document.getElementById('prevFontButton');
const nextFontButton = document.getElementById('nextFontButton');
const characterSetSelect = document.getElementById('characterSetSelect');
const prevCharSetButton = document.getElementById('prevCharSetButton');
const nextCharSetButton = document.getElementById('nextCharSetButton');
const customCharsContainer = document.getElementById('customCharsContainer');
const customCharsInput = document.getElementById('customCharsInput');
const customCharsHelpButton = document.getElementById('customCharsHelpButton');

/* 3.4 Output Settings Controls */
const scaleFactorInput = document.getElementById('scaleFactorInput');
const scaleFactorDecrement = document.getElementById('scaleFactorDecrement');
const scaleFactorIncrement = document.getElementById('scaleFactorIncrement');
const outputResolutionDisplay = document.getElementById('outputResolutionDisplay');
const colorSchemeSelect = document.getElementById('colorSchemeSelect');
const prevColorSchemeButton = document.getElementById('prevColorSchemeButton');
const nextColorSchemeButton = document.getElementById('nextColorSchemeButton');

const gradientMapContainer = document.getElementById('gradientMapContainer');
const gradientMapSelect = document.getElementById('gradientMapSelect');
const prevGradientMapButton = document.getElementById('prevGradientMapButton');
const nextGradientMapButton = document.getElementById('nextGradientMapButton');
const gradientMapPreviewBar = document.getElementById('gradientMapPreviewBar');
const gradientMapInvertToggle = document.getElementById('gradientMapInvertToggle');

const customColorsContainer = document.getElementById('customColorsContainer');
const customTextColor = document.getElementById('customTextColor');
const customBackgroundColor = document.getElementById('customBackgroundColor');
const transparentBgToggle = document.getElementById('transparentBgToggle');
const transparentBgGrid = document.getElementById('transparentBgGrid');
const charSpacingSlider = document.getElementById('charSpacingSlider');
const charSpacingValueDisplay = document.getElementById('charSpacingValueDisplay');
const randomSpacingToggle = document.getElementById('randomSpacingToggle');
const outputBloomSlider = document.getElementById('outputBloomSlider');
const outputBloomValueDisplay = document.getElementById('outputBloomValueDisplay');
const outputExposureSlider = document.getElementById('outputExposureSlider');
const outputExposureValueDisplay = document.getElementById('outputExposureValueDisplay');

let isBgColorTransparent = false;
let currentCharSpacing = 0;
let isRandomSpacingActive = true;
let columnOffsets = [];
let currentOutputExposure = 0;
let currentGradientMap = 'gradient-1';
let isGradientInverted = false;

/* 3.5 Button & Action Elements */
const exportTransparentToggle = document.getElementById('exportTransparentToggle');
const openNewTabButton = document.getElementById('openNewTabButton');
const downloadPngButton = document.getElementById('downloadPngButton');
const downloadTextButton = document.getElementById('downloadTextButton');
const downloadPngSequenceButton = document.getElementById('downloadPngSequenceButton');
const recordWebcamButton = document.getElementById('recordWebcamButton');
const exportSettingsButton = document.getElementById('exportSettingsButton');
const importSettingsButton = document.getElementById('importSettingsButton');
const importSettingsInput = document.getElementById('importSettingsInput');
const fullscreenButton = document.getElementById('fullscreenButton');
const recordingOverlay = document.getElementById('recordingOverlay');
const recordingTimer = document.getElementById('recordingTimer');
const recordingText = document.getElementById('recordingText');

/* 3.6 Layout & Panel Elements */
const mainContainer = document.getElementById('mainContainer');
const desktopSettingsPanelContainer = document.getElementById('desktopSettingsPanel');
const mobileSettingsPanel = document.getElementById('mobileSettingsPanel');
const mobileUploadPanelPlaceholder = document.getElementById('mobileUploadPanelPlaceholder');
const mobileDownloadPanelPlaceholder = document.getElementById('mobileDownloadPanelPlaceholder');

const uploadPanelContent = document.getElementById('uploadPanelContent');
const settingsTitleSection = document.getElementById('settingsTitleSection');
const imageSettingsContent = document.getElementById('imageSettingsContent');
const fontSettingsContent = document.getElementById('fontSettingsContent');
const outputSettingsContent = document.getElementById('outputSettingsContent');
const downloadPanelContent = document.getElementById('downloadPanelContent');


/* ============================================================================
   4. STATE MANAGEMENT VARIABLES
   ============================================================================ */

/* Media & Processing State */
let currentBlobMatrix = null;
let currentMediaElement = null;
let originalPixelData = null;
let rawMediaElement = null;
let rawOriginalPixelData = null;

let currentImageOriginalWidth = 0;
let currentImageOriginalHeight = 0;
let isPreviewChangesActive = false;
let isInvertColorsActive = false;
let isChromaRemovalActive = false;
let currentBackgroundTolerance = 10;
let currentOutputBloom = 0;
let isVideoInput = false;
let videoProcessLoopId = null;

let isWebcamActive = false;
let webcamStream = null;
let isRecordingWebcam = false;
let mediaRecorder = null;
let recordedChunks = [];

let isSequenceRendering = false;
let cancelSequenceRenderFlag = false;
let cachedZipBlob = null;
let sequenceSettingsSnapshot = null;

let actionHistory = [];
let currentHistoryIndex = -1;
const MAX_HISTORY_SIZE = 100;
let isFileJustLoaded = false;
let sliderChangeTimeout = null;
const SLIDER_DEBOUNCE_DELAY = 500;

/* Text Direction State */
let isVerticalTextMode = false;


/* ============================================================================
   5. CONFIGURATION - FONTS & CONSTANTS
   ============================================================================ */

const availableFonts = [
    { name: 'Courier New', cssName: '"Courier New", Courier, monospace' },
    { name: 'Cutive Mono', cssName: '"Cutive Mono", monospace' },
    { name: 'Source Code Pro', cssName: '"Source Code Pro", monospace' },
    { name: 'Victor Mono', cssName: '"Victor Mono", monospace' },
    { name: 'Workbench', cssName: '"Workbench", monospace' },
    { name: 'Doto', cssName: '"Doto", monospace' },
    { name: 'VT323', cssName: '"VT323", monospace' },
    { name: 'Bytesized', cssName: '"Bytesized", monospace' }
];
let currentFontFamily;

let currentNumLevels, currentBrightness, currentContrast, currentShadowInput,
    currentMidtoneGamma, currentHighlightInput, currentDensity = 8,
    currentScaleFactor, currentColorScheme, currentCharacterSet;

const DEFAULT_BASE_FONT_SIZE = 8;

/* Canvas Zoom & Pan State */
let currentCanvasZoom = 1.0;
let canvasPanX = 0;
let canvasPanY = 0;
let isCanvasPanning = false;
let panStartX = 0;
let panStartY = 0;



const GRADIENT_PRESETS = [{"id":"gradient-1","name":"Gradient 1","stops":[[0,0,0,0],[0.25,108,58,222],[0.5,255,180,180],[0.798,253,247,196],[1,255,255,255]]},{"id":"gradient-2","name":"Gradient 2","stops":[[0,0,0,0],[0.3,33,39,255],[0.605,255,212,0],[1,255,255,255]]},{"id":"gradient-3","name":"Gradient 3","stops":[[0,0,0,0],[0.268,0,0,34],[0.372,196,40,71],[0.529,226,132,19],[1,255,255,255]]},{"id":"gradient-4","name":"Gradient 4","stops":[[0,0,0,0],[0.348,0,83,54],[0.597,255,150,255],[0.8,210,225,225],[1,255,255,255]]},{"id":"gradient-5","name":"Gradient 5","stops":[[0,0,0,0],[0.15,37,37,37],[0.446,255,94,29],[0.605,151,237,237],[0.803,210,225,225],[1,255,255,255]]},{"id":"gradient-6","name":"Gradient 6","stops":[[0,0,0,0],[0.2,44,0,0],[0.5,255,25,66],[0.7,255,164,169],[1,255,255,255]]},{"id":"gradient-7","name":"Gradient 7","stops":[[0,0,0,0],[0.2,0,65,53],[0.35,0,178,140],[0.555,255,179,0],[0.8,251,243,214],[1,255,255,255]]},{"id":"gradient-8","name":"Gradient 8","stops":[[0,0,0,0],[0.3,66,23,56],[0.7,236,197,17],[1,255,255,255]]},{"id":"gradient-9","name":"Gradient 9","stops":[[0.142,11,23,28],[0.334,149,179,255],[0.491,255,223,223],[0.63,149,179,255],[0.796,11,23,28]]},{"id":"gradient-10","name":"Gradient 10","stops":[[0,0,0,0],[0.2,91,89,175],[0.4,59,163,171],[0.7,235,196,17],[1,255,255,255]]},{"id":"gradient-11","name":"Gradient 11","stops":[[0,0,0,0],[0.2,0,64,57],[0.5,169,197,255],[0.7,255,247,164],[1,255,255,255]]},{"id":"gradient-12","name":"Gradient 12","stops":[[0,0,0,0],[0.2,0,45,12],[0.5,255,104,0],[0.7,0,226,86],[1,255,255,255]]},{"id":"gradient-13","name":"Gradient 13","stops":[[0,0,0,0],[0.3,60,203,255],[0.5,255,197,215],[0.75,232,255,68],[1,255,255,255]]},{"id":"gradient-14","name":"Gradient 14","stops":[[0,33,33,33],[0.3,246,107,52],[0.35,230,179,30],[0.7,254,248,221],[1,255,255,255]]},{"id":"gradient-15","name":"Gradient 15","stops":[[0.24,14,21,58],[0.362,61,90,241],[0.621,34,209,238],[0.872,255,255,255]]},{"id":"gradient-16","name":"Gradient 16","stops":[[0.101,0,0,0],[0.29,83,86,216],[0.562,255,95,64],[1,255,255,255]]},{"id":"gradient-17","name":"Gradient 17","stops":[[0,0,0,0],[0.23,27,27,30],[0.394,150,3,26],[0.525,109,103,110],[0.763,250,169,22],[1,255,255,255]]},{"id":"gradient-18","name":"Gradient 18","stops":[[0,0,0,0],[0.165,13,59,102],[0.425,249,87,56],[0.661,244,211,94],[0.737,250,240,202],[1,255,255,255]]},{"id":"gradient-19","name":"Gradient 19","stops":[[0,0,0,0],[0.166,31,32,66],[0.303,25,101,127],[0.44,74,62,113],[0.598,17,157,165],[0.789,255,201,86],[1,255,255,255]]},{"id":"gradient-20","name":"Gradient 20","stops":[[0,0,0,0],[0.099,0,38,81],[0.255,119,90,218],[0.45,255,48,79],[0.601,40,199,250],[0.851,255,255,255]]},{"id":"gradient-21","name":"Gradient 21","stops":[[0,0,0,0],[0.103,42,54,59],[0.35,89,64,87],[0.501,232,74,95],[0.753,255,132,124],[1,255,255,255]]},{"id":"gradient-22","name":"Gradient 22","stops":[[0,0,0,0],[0.2,23,19,50],[0.4,42,93,103],[0.6,74,227,181],[0.799,238,238,238],[1,255,255,255]]},{"id":"gradient-23","name":"Gradient 23","stops":[[0.099,0,0,0],[0.252,0,51,199],[0.5,209,149,249],[0.7,205,232,246],[1,255,255,255]]},{"id":"gradient-24","name":"Gradient 24","stops":[[0,0,0,0],[0.2,63,48,56],[0.339,243,97,175],[0.568,253,174,216],[0.786,253,246,250],[1,255,255,255]]},{"id":"gradient-25","name":"Gradient 25","stops":[[0.048,0,0,0],[0.292,0,147,120],[0.495,252,138,21],[1,255,255,255]]},{"id":"gradient-26","name":"Gradient 26","stops":[[0,0,0,0],[0.175,3,37,53],[0.351,97,35,78],[0.534,255,88,88],[0.746,235,255,251],[1,255,255,255]]},{"id":"gradient-27","name":"Gradient 27","stops":[[0.056,0,0,0],[0.21,72,47,247],[0.284,45,108,223],[0.524,70,195,219],[0.777,243,241,105],[1,255,255,255]]},{"id":"gradient-28","name":"Gradient 28","stops":[[0.081,0,0,0],[0.301,252,92,156],[0.474,197,227,246],[0.626,252,205,226],[0.846,252,239,238],[1,255,255,255]]},{"id":"gradient-29","name":"Gradient 29","stops":[[0,0,0,0],[0.2,106,62,55],[0.42,57,147,221],[0.531,224,172,213],[0.781,244,235,232],[1,255,255,255]]},{"id":"gradient-30","name":"Gradient 30","stops":[[0.125,0,0,0],[0.327,117,119,128],[0.531,232,49,81],[0.766,210,204,161],[1,255,255,255]]},{"id":"gradient-31","name":"Gradient 31","stops":[[0,0,0,0],[0.116,5,60,94],[0.269,163,22,33],[0.492,219,34,42],[0.752,191,219,247],[1,255,255,255]]},{"id":"gradient-32","name":"Gradient 32","stops":[[0,0,0,0],[0.193,78,89,140],[0.438,255,140,66],[0.64,249,199,132],[1,255,255,255]]},{"id":"gradient-33","name":"Gradient 33","stops":[[0.03,0,0,0],[0.23,117,119,128],[0.482,152,206,0],[0.748,108,207,246],[1,255,255,255]]},{"id":"gradient-34","name":"Gradient 34","stops":[[0,0,0,0],[0.166,102,46,155],[0.285,248,102,36],[0.435,234,53,70],[0.711,249,200,14],[1,255,255,255]]},{"id":"gradient-35","name":"Gradient 35","stops":[[0,0,0,0],[0.147,9,56,36],[0.361,191,78,48],[0.614,120,254,207],[0.787,229,234,250],[1,255,255,255]]},{"id":"gradient-36","name":"Gradient 36","stops":[[0.395,0,0,0],[0.502,36,108,197],[0.6,255,255,255]]},{"id":"gradient-37","name":"Gradient 37","stops":[[0,0,0,0],[0.066,44,44,44],[0.412,132,107,95],[0.526,255,111,0],[0.707,200,185,168],[1,255,255,255]]},{"id":"gradient-38","name":"Gradient 38","stops":[[0,8,35,83],[0.2,23,105,255],[0.55,255,242,0],[1,255,255,255]]},{"id":"gradient-39","name":"Gradient 39","stops":[[0,0,0,0],[0.1,255,255,255],[0.2,0,0,0],[0.3,255,255,255],[0.4,0,0,0],[0.5,255,255,255],[0.6,0,0,0],[0.7,255,255,255],[0.8,0,0,0],[0.9,255,255,255],[1,0,0,0]]},{"id":"gradient-40","name":"Gradient 40","stops":[[0,24,20,21],[0.498,0,38,81],[0.549,255,48,79],[1,255,255,255]]}];

function getGradientPresetById(id) {
    return GRADIENT_PRESETS.find(p => p.id === id) || GRADIENT_PRESETS[0];
}

function sampleGradientColor(stops, t, invert = false) {
    if (!stops || stops.length === 0) return 'rgb(255, 255, 255)';
    let factor = Math.max(0, Math.min(1, t));
    if (invert) factor = 1 - factor;
    
    if (factor <= stops[0][0]) {
        return `rgb(${stops[0][1]}, ${stops[0][2]}, ${stops[0][3]})`;
    }
    const last = stops[stops.length - 1];
    if (factor >= last[0]) {
        return `rgb(${last[1]}, ${last[2]}, ${last[3]})`;
    }
    
    for (let i = 0; i < stops.length - 1; i++) {
        const s1 = stops[i];
        const s2 = stops[i + 1];
        if (factor >= s1[0] && factor <= s2[0]) {
            const range = s2[0] - s1[0];
            const localT = range > 0 ? (factor - s1[0]) / range : 0;
            const r = Math.round(s1[1] + (s2[1] - s1[1]) * localT);
            const g = Math.round(s1[2] + (s2[2] - s1[2]) * localT);
            const b = Math.round(s1[3] + (s2[3] - s1[3]) * localT);
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    return `rgb(${last[1]}, ${last[2]}, ${last[3]})`;
}

function getGradientCss(stops, invert = false) {
    if (!stops || stops.length === 0) return '#000';
    let pts = stops;
    if (invert) {
        pts = [...stops].map(s => [Math.round((1 - s[0]) * 1000) / 1000, s[1], s[2], s[3]]).sort((a, b) => a[0] - b[0]);
    }
    const parts = pts.map(s => `rgb(${s[1]}, ${s[2]}, ${s[3]}) ${Math.round(s[0] * 100)}%`);
    return `linear-gradient(to right, ${parts.join(', ')})`;
}

function updateGradientMapPreview() {
    if (!gradientMapPreviewBar) return;
    const preset = getGradientPresetById(currentGradientMap);
    gradientMapPreviewBar.style.background = getGradientCss(preset.stops, isGradientInverted);
    if (gradientMapInvertToggle) {
        gradientMapInvertToggle.style.color = isGradientInverted ? 'var(--error-text)' : '';
    }
}

function populateGradientMapOptions() {
    if (!gradientMapSelect || gradientMapSelect.options.length > 0) return;
    GRADIENT_PRESETS.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        gradientMapSelect.appendChild(opt);
    });
    gradientMapSelect.value = currentGradientMap;
    updateGradientMapPreview();
}

/* ============================================================================
   6. HISTORY & UNDO/REDO SYSTEM
   ============================================================================ */

function getCurrentSettingsSnapshot(fps) {
    return JSON.stringify({
        levels: levelsSlider.value,
        brightness: brightnessSlider.value,
        contrast: contrastSlider.value,
        shadow: shadowInputSlider.value,
        midtone: midtoneGammaSlider.value,
        highlight: highlightInputSlider.value,
        density: densityInput.value,
        scale: scaleFactorInput.value,
        colorScheme: colorSchemeSelect.value,
        font: fontSelect.value,
        charSet: characterSetSelect.value,
        customChars: customCharsInput.value,
        invert: invertColorsToggle.checked,
        chromaRemoval: chromaRemovalToggle.checked,
        outputBloom: outputBloomSlider.value,
        outputExposure: outputExposureSlider ? outputExposureSlider.value : 0,
        sequenceFps: fps,

        customText: customTextColor.value,
        customBackground: customBackgroundColor.value,
        transparentBg: isBgColorTransparent,
        charSpacing: charSpacingSlider.value,
        randomSpacing: isRandomSpacingActive,
        isVertical: isVerticalTextMode,
        exportTransparentBg: exportTransparentToggle ? exportTransparentToggle.checked : false,
        gradientMap: gradientMapSelect ? gradientMapSelect.value : 'gradient-1',
        gradientInverted: isGradientInverted
    });
}

function saveActionToHistory() {
    if (isFileJustLoaded) return;
    
    const currentSettings = getCurrentSettingsSnapshot();
    
    actionHistory = actionHistory.slice(0, currentHistoryIndex + 1);
    
    actionHistory.push(currentSettings);
    
    if (actionHistory.length > MAX_HISTORY_SIZE) {
        actionHistory.shift();
    } else {
        currentHistoryIndex++;
    }
    
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');
    
    if (undoButton) undoButton.disabled = currentHistoryIndex <= 0 || isFileJustLoaded;
    if (redoButton) redoButton.disabled = currentHistoryIndex >= actionHistory.length - 1;
}

function initializeHistoryForNewFile() {
    isFileJustLoaded = true;
    actionHistory = [];
    currentHistoryIndex = -1;
    const currentSettings = getCurrentSettingsSnapshot();
    actionHistory.push(currentSettings);
    currentHistoryIndex = 0;
    updateUndoRedoButtons();
    
    if (sliderChangeTimeout) {
        clearTimeout(sliderChangeTimeout);
        sliderChangeTimeout = null;
    }
}

function enableHistoryAfterUserChange() {
    if (isFileJustLoaded) {
        isFileJustLoaded = false;
        updateUndoRedoButtons();
    }
}

function debouncedSaveSliderToHistory() {
    if (sliderChangeTimeout) {
        clearTimeout(sliderChangeTimeout);
    }
    sliderChangeTimeout = setTimeout(() => {
        enableHistoryAfterUserChange();
        saveActionToHistory();
    }, SLIDER_DEBOUNCE_DELAY);
}

function undoAction() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        restoreSettingsFromSnapshot(actionHistory[currentHistoryIndex]);
        updateUndoRedoButtons();
    }
}

function redoAction() {
    if (currentHistoryIndex < actionHistory.length - 1) {
        currentHistoryIndex++;
        restoreSettingsFromSnapshot(actionHistory[currentHistoryIndex]);
        updateUndoRedoButtons();
    }
}

function restoreSettingsFromSnapshot(snapshot) {
    try {
        const settings = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;
        if (!settings || typeof settings !== 'object') return;
        
        if (settings.levels !== undefined) {
            levelsSlider.value = settings.levels;
            levelsValueDisplay.textContent = settings.levels;
            currentNumLevels = parseInt(settings.levels);
        }
        if (settings.brightness !== undefined) {
            brightnessSlider.value = settings.brightness;
            brightnessValueDisplay.textContent = settings.brightness;
            currentBrightness = parseInt(settings.brightness);
        }
        if (settings.contrast !== undefined) {
            contrastSlider.value = settings.contrast;
            contrastValueDisplay.textContent = settings.contrast;
            currentContrast = parseInt(settings.contrast);
        }
        if (settings.shadow !== undefined) {
            shadowInputSlider.value = settings.shadow;
            shadowInputValueDisplay.textContent = settings.shadow;
            currentShadowInput = parseInt(settings.shadow);
        }
        if (settings.midtone !== undefined) {
            midtoneGammaSlider.value = settings.midtone;
            midtoneGammaValueDisplay.textContent = parseFloat(settings.midtone).toFixed(1);
            currentMidtoneGamma = parseFloat(settings.midtone);
        }
        if (settings.highlight !== undefined) {
            highlightInputSlider.value = settings.highlight;
            highlightInputValueDisplay.textContent = settings.highlight;
            currentHighlightInput = parseInt(settings.highlight);
        }
        const densityVal = settings.density !== undefined ? settings.density : settings.fontSize;
        if (densityVal !== undefined) {
            currentDensity = parseInt(densityVal) || DEFAULT_BASE_FONT_SIZE;
            if (densityInput) densityInput.value = currentDensity;
        }
        if (settings.scale !== undefined) {
            scaleFactorInput.value = settings.scale;
            currentScaleFactor = parseFloat(settings.scale);
        }
        if (settings.gradientMap !== undefined) {
            currentGradientMap = settings.gradientMap;
            if (gradientMapSelect) gradientMapSelect.value = settings.gradientMap;
        }
        if (settings.gradientInverted !== undefined) {
            isGradientInverted = Boolean(settings.gradientInverted);
        }
        updateGradientMapPreview();
        if (settings.colorScheme !== undefined) {
            colorSchemeSelect.value = settings.colorScheme;
            currentColorScheme = settings.colorScheme;
            syncCustomColorsWithPreset(settings.colorScheme);
        }
        // Font restore
        if (settings.font !== undefined) {
            if ([...fontSelect.options].some(opt => opt.value === settings.font)) {
                fontSelect.value = settings.font;
            } else {
                fontSelect.selectedIndex = parseInt(settings.font) || 0;
            }
            if (fontSelect.selectedIndex >= 0 && availableFonts[fontSelect.selectedIndex]) {
                currentFontFamily = availableFonts[fontSelect.selectedIndex].cssName;
            }
        }
        if (settings.charSet !== undefined) {
            characterSetSelect.value = settings.charSet;
            currentCharacterSet = settings.charSet;
        }
        if (settings.customChars !== undefined) {
            customCharsInput.value = settings.customChars;
        }
        if (settings.invert !== undefined) {
            invertColorsToggle.checked = Boolean(settings.invert);
            isInvertColorsActive = Boolean(settings.invert);
        }
        if (settings.chromaRemoval !== undefined) {
            chromaRemovalToggle.checked = Boolean(settings.chromaRemoval);
            isChromaRemovalActive = Boolean(settings.chromaRemoval);
        }
        if (settings.outputBloom !== undefined) {
            outputBloomSlider.value = settings.outputBloom;
            outputBloomValueDisplay.textContent = toBloomDisplayValue(outputBloomSlider.value);
            currentOutputBloom = parseInt(settings.outputBloom);
        }
        if (settings.outputExposure !== undefined && outputExposureSlider) {
            outputExposureSlider.value = settings.outputExposure;
            if (outputExposureValueDisplay) outputExposureValueDisplay.textContent = settings.outputExposure;
            currentOutputExposure = parseInt(settings.outputExposure) || 0;
        }
        if (settings.previewChanges !== undefined) {
            previewChangesToggle.checked = Boolean(settings.previewChanges);
        }
        const isMobile = window.innerWidth <= 768;
        isPreviewChangesActive = !isMobile && previewChangesToggle.checked;

        if (settings.customText) {
            customTextColor.value = settings.customText;
            if (!window.savedCustomColors) window.savedCustomColors = {};
            window.savedCustomColors.text = settings.customText;
        }
        if (settings.customBackground) {
            customBackgroundColor.value = settings.customBackground;
            if (!window.savedCustomColors) window.savedCustomColors = {};
            window.savedCustomColors.background = settings.customBackground;
        }
        
        if (settings.transparentBg !== undefined) {
            isBgColorTransparent = Boolean(settings.transparentBg);
            updateTransparentBgUI();
        }
        
        if (settings.charSpacing !== undefined) {
            charSpacingSlider.value = settings.charSpacing;
            charSpacingValueDisplay.textContent = settings.charSpacing;
            currentCharSpacing = parseInt(settings.charSpacing) || 0;
        }

        if (settings.randomSpacing !== undefined) {
            isRandomSpacingActive = Boolean(settings.randomSpacing);
            if (randomSpacingToggle) {
                randomSpacingToggle.style.opacity = isRandomSpacingActive ? '1' : '0.6';
                randomSpacingToggle.style.color = isRandomSpacingActive ? 'var(--primary-text)' : '';
            }
        }

        if (settings.isVertical !== undefined) {
            isVerticalTextMode = Boolean(settings.isVertical);
            const textDirectionToggle = document.getElementById('textDirectionToggle');
            if (textDirectionToggle) {
                if (isVerticalTextMode) {
                    textDirectionToggle.classList.remove('ri-arrow-right-line');
                    textDirectionToggle.classList.add('ri-arrow-down-line');
                    textDirectionToggle.title = 'Toggle text direction (vertical)';
                } else {
                    textDirectionToggle.classList.remove('ri-arrow-down-line');
                    textDirectionToggle.classList.add('ri-arrow-right-line');
                    textDirectionToggle.title = 'Toggle text direction (horizontal)';
                }
            }
        }

        if (settings.exportTransparentBg !== undefined && exportTransparentToggle) {
            exportTransparentToggle.checked = Boolean(settings.exportTransparentBg);
        }
        
        customCharsContainer.style.display = 'flex';
        if (characterSetSelect.value === 'custom') {
            customCharsInput.disabled = false;
            customCharsHelpButton.disabled = false;
        } else {
            customCharsInput.disabled = true;
            customCharsHelpButton.disabled = true;
        }
        
        if (typeof syncAllNumberInputsFromSliders === 'function') {
            syncAllNumberInputsFromSliders();
        }

        clearCachedSequence();
        processImageWithCurrentSettings();
        if (!isVideoInput) updateInputCanvasPreview();
        
    } catch (error) {
        console.error('Error restoring settings:', error);
    }
}

function clearCachedSequence() {
    cachedZipBlob = null;
    sequenceSettingsSnapshot = null;
    customCharSeqIndex = 0;
    updatePngSequenceButtonState();
}

function updatePngSequenceButtonState() {
    if (!isVideoInput || isWebcamActive) {
        downloadPngSequenceButton.style.display = 'none';
        return;
    }
    downloadPngSequenceButton.style.display = 'inline-flex';
    downloadPngSequenceButton.innerHTML = '<i class="ri-download-2-line"></i> Download Sequence';
    downloadPngSequenceButton.disabled = isSequenceRendering;
}

function toggleSequenceRenderingUI(isRendering, message = "") {
    isSequenceRendering = isRendering;
    cancelSequenceRenderFlag = false;

    if (isRendering) {
        outputCanvas.style.display = 'none';
        sequenceLoadingOverlay.style.display = 'flex';
        sequenceLoadingOverlayText.textContent = message || "Rendering Sequence...";
        cancelSequenceButton.style.display = 'block';
    } else {
        outputCanvas.style.display = 'block';
        sequenceLoadingOverlay.style.display = 'none';
        cancelSequenceButton.style.display = 'none';
    }

    const controlsToDisable = [
        imageUpload, condensedImageUpload,
        levelsSlider, brightnessSlider,
        shadowInputSlider, midtoneGammaSlider, highlightInputSlider,
        invertColorsToggle, previewChangesToggle,
        outputBloomSlider,
        outputExposureSlider,
        densityInput, densityDecrement, densityIncrement, fontSelect, prevFontButton, nextFontButton,
        characterSetSelect, prevCharSetButton, nextCharSetButton, customCharsInput,
        scaleFactorInput, scaleFactorDecrement, scaleFactorIncrement, colorSchemeSelect, prevColorSchemeButton, nextColorSchemeButton,
        gradientMapSelect, prevGradientMapButton, nextGradientMapButton, gradientMapInvertToggle,
        openNewTabButton, downloadPngButton, downloadTextButton,
        exportSettingsButton, importSettingsButton,
        document.getElementById('levelsNumberInput'),
        document.getElementById('brightnessNumberInput'),
        document.getElementById('contrastNumberInput'),
        document.getElementById('shadowNumberInput'),
        document.getElementById('midtoneNumberInput'),
        document.getElementById('highlightNumberInput'),
        document.getElementById('charSpacingNumberInput'),
        document.getElementById('outputBloomNumberInput'),
        document.getElementById('outputExposureNumberInput')
    ];

    controlsToDisable.forEach(control => {
        if (control) control.disabled = isRendering;
    });


    updatePngSequenceButtonState();
}

cancelSequenceButton.addEventListener('click', () => {
    cancelSequenceRenderFlag = true;
    sequenceLoadingOverlayText.textContent = "Cancelling rendering...";
});


async function generateGlyphtrixFrameBlob(videoTime, tempCanvas, tempCtx, offscreenRenderCanvas, offscreenRenderCtx) {
    return new Promise(async (resolve, reject) => {
        if (cancelSequenceRenderFlag) {
            return reject(new Error("Sequence rendering cancelled by user."));
        }
        inputVideo.currentTime = videoTime;

        const onSeeked = async () => {
            inputVideo.removeEventListener('seeked', onSeeked);
            inputVideo.removeEventListener('error', onError);
            if (cancelSequenceRenderFlag) {
                return reject(new Error("Sequence rendering cancelled during seek."));
            }
            try {
                tempCtx.drawImage(inputVideo, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
                let framePixelData = tempCtx.getImageData(0, 0, currentImageOriginalWidth, currentImageOriginalHeight).data;

                if (chromaRemovalToggle.checked) {
                    framePixelData = removeChroma(framePixelData, currentImageOriginalWidth, currentImageOriginalHeight, 10);
                }

                if (invertColorsToggle.checked) {
                    framePixelData = invertPixelData(framePixelData);
                }

                let processedData = applyContrast(new Uint8ClampedArray(framePixelData), currentImageOriginalWidth, currentImageOriginalHeight, parseInt(contrastSlider.value));
                processedData = applyLevelsAndBrightness(processedData, currentImageOriginalWidth, currentImageOriginalHeight, parseInt(brightnessSlider.value), parseInt(shadowInputSlider.value), parseFloat(midtoneGammaSlider.value), parseInt(highlightInputSlider.value));

                const frameGrayscaleLevels = generateGrayscaleLevels(parseInt(levelsSlider.value));
                const frameBlobMatrix = generateBlobMatrix(processedData, currentImageOriginalWidth, currentImageOriginalHeight, frameGrayscaleLevels, parseInt(densityInput.value), colorSchemeSelect.value, characterSetSelect.value);

                const baseCharSize = currentDensity || DEFAULT_BASE_FONT_SIZE;
                const effectiveCharSize = baseCharSize * parseFloat(scaleFactorInput.value);
                const charWidth = effectiveCharSize;
                const charHeight = effectiveCharSize;

                if (frameBlobMatrix.length === 0 || frameBlobMatrix[0].length === 0) {
                   return reject(new Error("Empty frame matrix generated"));
                }
                const numOutputRows = frameBlobMatrix.length;
                const numOutputCols = frameBlobMatrix[0].length;
                
                const charSpacing = currentCharSpacing || 0;
                const colsToAdjust = Math.floor(charSpacing);
                const originalCols = numOutputCols + colsToAdjust;
                
                offscreenRenderCanvas.width = Math.max(1, originalCols * charWidth);
                offscreenRenderCanvas.height = Math.max(1, numOutputRows * charHeight);
                const seqBgColor = getCanvasBackgroundColor(colorSchemeSelect.value);
                if (isBgColorTransparent || seqBgColor === 'transparent') {
                    offscreenRenderCtx.clearRect(0, 0, offscreenRenderCanvas.width, offscreenRenderCanvas.height);
                } else {
                    offscreenRenderCtx.fillStyle = seqBgColor;
                    offscreenRenderCtx.fillRect(0, 0, offscreenRenderCanvas.width, offscreenRenderCanvas.height);
                }
                offscreenRenderCtx.font = `${effectiveCharSize}px ${availableFonts[fontSelect.selectedIndex].cssName}`;
                offscreenRenderCtx.textAlign = 'left';
                offscreenRenderCtx.textBaseline = 'top';

                const cellWidth = numOutputCols > 1 ? offscreenRenderCanvas.width / numOutputCols : charWidth;

                let currentY = 0;
                for (let y = 0; y < numOutputRows; y++) {
                    let currentX = 0;
                    for (let x = 0; x < numOutputCols; x++) {
                        if (frameBlobMatrix[y] && frameBlobMatrix[y][x]) {
                            const cellColor = frameBlobMatrix[y][x].color;
                            if (cellColor !== 'rgba(0, 0, 0, 0)') {
                                offscreenRenderCtx.fillStyle = cellColor;
                                offscreenRenderCtx.fillText(frameBlobMatrix[y][x].char, currentX, currentY);
                            }
                        }
                        currentX += cellWidth;
                    }
                    currentY += charHeight;
                }

                if (currentOutputExposure !== 0) {
                    const exposureFactor = Math.pow(2, currentOutputExposure / 50);
                    const imgData = offscreenRenderCtx.getImageData(0, 0, offscreenRenderCanvas.width, offscreenRenderCanvas.height);
                    const d = imgData.data;
                    if (isBgColorTransparent || seqBgColor === 'transparent') {
                        for (let i = 0; i < d.length; i += 4) {
                            if (d[i + 3] > 0) {
                                d[i] = Math.min(255, Math.max(0, d[i] * exposureFactor));
                                d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * exposureFactor));
                                d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * exposureFactor));
                            }
                        }
                    } else {
                        for (let i = 0; i < d.length; i += 4) {
                            d[i] = Math.min(255, Math.max(0, d[i] * exposureFactor));
                            d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * exposureFactor));
                            d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * exposureFactor));
                        }
                    }
                    offscreenRenderCtx.putImageData(imgData, 0, 0);
                }

                offscreenRenderCanvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error("Failed to create blob from offscreen canvas"));
                }, 'image/png');

            } catch (error) {
                reject(error);
            }
        };

        const onError = (e) => {
            inputVideo.removeEventListener('seeked', onSeeked);
            inputVideo.removeEventListener('error', onError);
            reject(new Error("Video seeking error during sequence rendering."));
        };

        inputVideo.addEventListener('seeked', onSeeked, { once: true });
        inputVideo.addEventListener('error', onError, { once: true });
    });
}


async function downloadPngSequenceWithFps(fps) {
    if (!isVideoInput || inputVideo.readyState < inputVideo.HAVE_METADATA || isSequenceRendering) return;

    closeFpsModal();

    const currentSettings = getCurrentSettingsSnapshot(fps);
    if (cachedZipBlob && sequenceSettingsSnapshot === currentSettings) {
        const randomHash = generateRandomHash(8);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(cachedZipBlob);
        link.download = `kojerens_sequence_${randomHash}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return;
    }
    clearCachedSequence();

    const wasPaused = inputVideo.paused;
    if (!wasPaused) inputVideo.pause();

    toggleSequenceRenderingUI(true, "Initializing sequence rendering...");

    const pngBlobs = [];
    const videoDuration = inputVideo.duration;
    const selectedFps = fps;
    const frameInterval = 1 / selectedFps;
    const numFrames = Math.floor(videoDuration / frameInterval);

    const tempCaptureCanvas = document.createElement('canvas');
    tempCaptureCanvas.width = currentImageOriginalWidth;
    tempCaptureCanvas.height = currentImageOriginalHeight;
    const tempCaptureCtx = tempCaptureCanvas.getContext('2d');

    const offscreenRenderCanvas = document.createElement('canvas');
    const offscreenRenderCtx = offscreenRenderCanvas.getContext('2d');

    let renderingCancelled = false;
    try {
        for (let i = 0; i < numFrames; i++) {
            if (cancelSequenceRenderFlag) {
                renderingCancelled = true;
                sequenceLoadingOverlayText.textContent = "Rendering cancelled.";
                await new Promise(r => setTimeout(r, 1500));
                break;
            }
            const currentTime = i * frameInterval;
            const progressMessage = `Rendering frame ${i + 1} of ${numFrames} and creating a .zip archive...`;
            sequenceLoadingOverlayText.textContent = progressMessage;

            const blob = await generateGlyphtrixFrameBlob(currentTime, tempCaptureCanvas, tempCaptureCtx, offscreenRenderCanvas, offscreenRenderCtx);
            pngBlobs.push(blob);
        }

        if (!renderingCancelled && pngBlobs.length > 0) {
            sequenceLoadingOverlayText.textContent = "Zipping frames and creating .zip archive...";
            const zip = new JSZip();
            pngBlobs.forEach((blob, index) => {
                const frameNumber = (index + 1).toString().padStart(4, '0');
                zip.file(`frame_${frameNumber}.png`, blob);
            });

            cachedZipBlob = await zip.generateAsync({ type: "blob" });
            sequenceSettingsSnapshot = currentSettings;

            const randomHash = generateRandomHash(8);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(cachedZipBlob);
            link.download = `kojerens_sequence_${randomHash}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } else if (!renderingCancelled && numFrames > 0) {
            alert("No frames were rendered for the sequence. This might be due to a very short video or an issue.");
        }

    } catch (error) {
        if (!error.message.toLowerCase().includes("cancel")) {
            console.error("Error during PNG sequence rendering: ", error);
            alert(`Error during PNG sequence rendering: ${error.message}`);
        }
    } finally {
        toggleSequenceRenderingUI(false);
        if (!wasPaused && inputVideo.readyState >= inputVideo.HAVE_ENOUGH_DATA && !renderingCancelled) {
 
        }
        updatePngSequenceButtonState();
    }
}


function processCurrentFrame() {
    if (!inputVideo || inputVideo.paused || inputVideo.ended || inputVideo.readyState < inputVideo.HAVE_CURRENT_DATA) {
        stopVideoProcessingLoop();
        return;
    }
    processImageWithCurrentSettings().then(() => {
                if (isPreviewChangesActive) {
        updateInputCanvasPreview();
    }

    if (window.innerWidth <= 768 && mobilePreviewActive) {
        debouncedUpdateMobilePreview();
    }
        
        if (!inputVideo.paused && !inputVideo.ended) {
            videoProcessLoopId = requestAnimationFrame(processCurrentFrame);
        } else {
            stopVideoProcessingLoop();
        }
    }).catch(error => {
        console.error("Error processing video frame:", error);
        stopVideoProcessingLoop();
    });
}

function setDownloadButtonsState(disabled) {
    openNewTabButton.disabled = disabled;
    downloadPngButton.disabled = disabled;
    downloadTextButton.disabled = disabled;
    fullscreenButton.disabled = disabled;
}

function getFailsafeDensity(width) {
    if (width > 2500) {
        return 40;
    } else if (width >= 1000) {
        return 20;
    } else {
        return 10;
    }
}

function setDefaultValues(contentWidth = null) {
    levelsSlider.value = 4; levelsValueDisplay.textContent = '4';
    brightnessSlider.value = 0; brightnessValueDisplay.textContent = '0';
    contrastSlider.value = 0; contrastValueDisplay.textContent = '0';
    shadowInputSlider.value = 0; shadowInputValueDisplay.textContent = '0';
    midtoneGammaSlider.value = 1.0; midtoneGammaValueDisplay.textContent = '1.0';
    highlightInputSlider.value = 255; highlightInputValueDisplay.textContent = '255';
    chromaRemovalToggle.checked = false;
    invertColorsToggle.checked = false;
    outputBloomSlider.value = 0; outputBloomValueDisplay.textContent = '0';
    if (outputExposureSlider) {
        outputExposureSlider.value = 0;
        if (outputExposureValueDisplay) outputExposureValueDisplay.textContent = '0';
    }
    isBgColorTransparent = false;
    updateTransparentBgUI();
    charSpacingSlider.value = 0;
    charSpacingValueDisplay.textContent = '0';
    previewChangesToggle.checked = true;

    showExampleButtons();

    const failsafeDensity = contentWidth ? getFailsafeDensity(contentWidth) : 10;
    densityInput.value = failsafeDensity;
    scaleFactorInput.value = 1.0;
    currentGradientMap = 'gradient-1';
    isGradientInverted = false;
    if (gradientMapSelect) gradientMapSelect.value = 'gradient-1';
    updateGradientMapPreview();
    colorSchemeSelect.value = 'color1';
    syncCustomColorsWithPreset('color1');
    fontSelect.selectedIndex = 0;
    characterSetSelect.value = 'binary';
    customCharsInput.value = '0,1';
    customCharsContainer.style.display = 'flex';
    customCharsInput.disabled = false;
    customCharsHelpButton.disabled = false;
    customTextColor.value = '#00FF00';
    customBackgroundColor.value = '#000000';
    
    if (!window.savedCustomColors) {
        window.savedCustomColors = {
            text: '#00FF00',
            background: '#000000'
        };
    }
    gridSizeDisplay.textContent = '-';

    isChromaRemovalActive = chromaRemovalToggle.checked;
    currentBackgroundTolerance = 10;
    isInvertColorsActive = invertColorsToggle.checked;
    currentOutputBloom = parseInt(outputBloomSlider.value);
    currentOutputExposure = outputExposureSlider ? (parseInt(outputExposureSlider.value) || 0) : 0;
    isPreviewChangesActive = previewChangesToggle.checked;
    currentNumLevels = parseInt(levelsSlider.value);
    currentBrightness = parseInt(brightnessSlider.value);
    currentContrast = parseInt(contrastSlider.value);
    currentShadowInput = parseInt(shadowInputSlider.value);
    currentMidtoneGamma = parseFloat(midtoneGammaSlider.value);
    currentHighlightInput = parseInt(highlightInputSlider.value);
    currentDensity = failsafeDensity;
    currentScaleFactor = parseFloat(scaleFactorInput.value);
    currentColorScheme = colorSchemeSelect.value;
    if (gradientMapSelect) currentGradientMap = gradientMapSelect.value;
    currentFontFamily = availableFonts[fontSelect.selectedIndex].cssName;
    currentCharacterSet = characterSetSelect.value;

    if (typeof syncAllNumberInputsFromSliders === 'function') {
        syncAllNumberInputsFromSliders();
    }

    setDownloadButtonsState(true);
    clearCachedSequence();
}

function resetGlyphSettingsToDefault() {
    clearCachedSequence();
    
    // Character Set
    if (characterSetSelect) {
        characterSetSelect.value = 'binary';
        currentCharacterSet = 'binary';
    }
    if (customCharsContainer) customCharsContainer.style.display = 'flex';
    if (customCharsInput) {
        customCharsInput.value = '0,1';
        customCharsInput.disabled = false;
    }
    if (customCharsHelpButton) customCharsHelpButton.disabled = false;
    
    // Text direction to horizontal
    if (typeof isVerticalTextMode !== 'undefined' && isVerticalTextMode) {
        isVerticalTextMode = false;
        const textDirectionToggle = document.getElementById('textDirectionToggle');
        if (textDirectionToggle) {
            textDirectionToggle.classList.remove('ri-arrow-down-line');
            textDirectionToggle.classList.add('ri-arrow-right-line');
            textDirectionToggle.title = 'Toggle text direction (horizontal)';
        }
    }
    
    // Font Family
    if (fontSelect) {
        fontSelect.selectedIndex = 0;
        if (availableFonts && availableFonts[0]) {
            currentFontFamily = availableFonts[0].cssName;
        }
    }
    
    // Color Scheme
    if (colorSchemeSelect) {
        colorSchemeSelect.value = 'color1';
        currentColorScheme = 'color1';
        syncCustomColorsWithPreset('color1');
    }
    if (customTextColor) customTextColor.value = '#00FF00';
    if (customBackgroundColor) customBackgroundColor.value = '#000000';
    if (!window.savedCustomColors) window.savedCustomColors = {};
    window.savedCustomColors.text = '#00FF00';
    window.savedCustomColors.background = '#000000';
    
    // Transparent Background
    isBgColorTransparent = false;
    updateTransparentBgUI();
    
    // Spacing
    if (charSpacingSlider) charSpacingSlider.value = 0;
    if (charSpacingValueDisplay) charSpacingValueDisplay.textContent = '0';
    currentCharSpacing = 0;
    isRandomSpacingActive = true;
    if (randomSpacingToggle) {
        randomSpacingToggle.style.opacity = '1';
        randomSpacingToggle.style.color = 'var(--primary-text)';
    }
    columnOffsets = [];
    
    // Density
    currentDensity = DEFAULT_BASE_FONT_SIZE;
    if (densityInput) densityInput.value = DEFAULT_BASE_FONT_SIZE;
    
    if (typeof syncAllNumberInputsFromSliders === 'function') {
        syncAllNumberInputsFromSliders();
    }
    
    processImageWithCurrentSettings();
    if (!isVideoInput) updateInputCanvasPreview();
    
    enableHistoryAfterUserChange();
    saveActionToHistory();
}


function generateGrayscaleLevels(numLevels) {
    if (numLevels < 2) return [0, 1];
    const levels = [];
    for (let i = 0; i < numLevels; i++) { levels.push(i / (numLevels - 1)); }
    return levels;
}

function getRandomCharacterForLevel(grayscaleValue, charSet) {
    let charsToUse;
    switch (charSet) {
        case 'numbers': charsToUse = numbersChars; break;
        case 'latin_basic': charsToUse = latinBasicChars; break;
        case 'latin': charsToUse = latinChars; break;
        case 'cyrillic': charsToUse = cyrillicChars; break;
        case 'devanagari': charsToUse = devanagariChars; break;
        case 'thai': charsToUse = thaiChars; break;
        case 'japanese': charsToUse = japaneseChars; break;
        case 'korean': charsToUse = koreanChars; break;
        case 'chinese': charsToUse = chineseChars; break;
        case 'arabic': charsToUse = arabicChars; break;
        default: return '?';
    }
    return charsToUse[Math.floor(Math.random() * charsToUse.length)];
}


function invertPixelData(sourceData) {
    const invertedData = new Uint8ClampedArray(sourceData.length);
    for (let i = 0; i < sourceData.length; i += 4) {
        invertedData[i] = 255 - sourceData[i];
        invertedData[i + 1] = 255 - sourceData[i + 1];
        invertedData[i + 2] = 255 - sourceData[i + 2];
        invertedData[i + 3] = sourceData[i + 3];
    }
    return invertedData;
}

function applyContrast(sourceData, width, height, contrastAmount) {
    if (contrastAmount === 0) return new Uint8ClampedArray(sourceData);
    const outputData = new Uint8ClampedArray(sourceData);
    const factor = (259 * (contrastAmount + 255)) / (255 * (259 - contrastAmount));
    
    for (let i = 0; i < outputData.length; i += 4) {
        for (let c = 0; c < 3; c++) {
            let val = factor * (outputData[i + c] - 128) + 128;
            outputData[i + c] = Math.max(0, Math.min(255, val));
        }
    }
    return outputData;
}

function removeChroma(sourceData, width, height, tolerance) {
    if (!sourceData) return new Uint8ClampedArray(sourceData);
    
    const outputData = new Uint8ClampedArray(sourceData);
    
    // Sample corner pixels to detect chroma key color
    const corners = [
        0,
        (width - 1) * 4,
        (height - 1) * width * 4,
        ((height - 1) * width + (width - 1)) * 4
    ];
    
    let chromaR = 0, chromaG = 0, chromaB = 0;
    let validCorners = 0;
    
    for (let corner of corners) {
        if (corner < sourceData.length - 3) {
            chromaR += sourceData[corner];
            chromaG += sourceData[corner + 1];
            chromaB += sourceData[corner + 2];
            validCorners++;
        }
    }
    
    if (validCorners === 0) return outputData;
    
    chromaR = Math.round(chromaR / validCorners);
    chromaG = Math.round(chromaG / validCorners);
    chromaB = Math.round(chromaB / validCorners);
    
    const toleranceValue = tolerance * 2.55;
    
    for (let i = 0; i < outputData.length; i += 4) {
        const r = outputData[i];
        const g = outputData[i + 1];
        const b = outputData[i + 2];
        
        const diff = Math.sqrt(
            Math.pow(r - chromaR, 2) + 
            Math.pow(g - chromaG, 2) + 
            Math.pow(b - chromaB, 2)
        );
        
        if (diff <= toleranceValue) {
            const replacement = (typeof isInvertColorsActive !== 'undefined' && isInvertColorsActive) ? 255 : 0;
            outputData[i] = replacement;
            outputData[i + 1] = replacement;
            outputData[i + 2] = replacement;
            outputData[i + 3] = 0;
        }
    }
    
    return outputData;
}


function applyLevelsAndBrightness(sourcePixelData, width, height, brightness, shadowIn, gamma, highlightIn) {
    const data = new Uint8ClampedArray(sourcePixelData);
    const bVal = ((brightness || 0) / 100.0) * 127.5;
    const g = (gamma !== undefined && !isNaN(gamma) && gamma > 0) ? gamma : 1.0;
    const invGamma = 1.0 / g;
    const sIn = (shadowIn !== undefined && !isNaN(shadowIn)) ? shadowIn : 0;
    const hIn = (highlightIn !== undefined && !isNaN(highlightIn)) ? highlightIn : 255;
    const inputRange = Math.max(1, hIn - sIn);
    for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
            let val = data[i + c] + bVal;
            if (val <= sIn) { val = 0; }
            else if (val >= hIn) { val = 255; }
            else { val = ((val - sIn) / inputRange) * 255; }
            val = 255 * Math.pow(val / 255, invGamma);
            data[i + c] = Math.max(0, Math.min(255, val));
        }
    }
    return data;
}

function getCharacterDisplayColor(level, scheme, rowIndex = 0, totalRows = 1) {
    const value = Math.round(level * 255);
    if (isBgColorTransparent && value === 0) {
        return 'rgba(0, 0, 0, 0)';
    }
    switch (scheme) {
        case 'color1': return `rgb(0, ${value}, 0)`;
        case 'color2': return `rgb(${value}, ${value}, ${value})`;
        case 'color3': {
            const textColor = {r: 20, g: 238, b: 94};
            const bgColor = hexToRgb(customBackgroundColor.value);
            if (value === 0) return isBgColorTransparent ? 'rgba(0, 0, 0, 0)' : `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
            return `rgb(${bgColor.r + Math.round((textColor.r - bgColor.r) * value / 255)}, ${bgColor.g + Math.round((textColor.g - bgColor.g) * value / 255)}, ${bgColor.b + Math.round((textColor.b - bgColor.b) * value / 255)})`;
        }

        case 'custom': {
            const textColor = hexToRgb(customTextColor.value);
            const bgColor = isBgColorTransparent ? {r: 0, g: 0, b: 0} : hexToRgb(customBackgroundColor.value);
            const brightness = level;
            
            if (brightness === 0) {
                if (isBgColorTransparent) {
                    return 'rgba(0, 0, 0, 0)';
                }
                return `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
            }
            
            return `rgb(${Math.round(textColor.r * brightness)}, ${Math.round(textColor.g * brightness)}, ${Math.round(textColor.b * brightness)})`;
        }
        case 'gradient': {
            const preset = getGradientPresetById(currentGradientMap);
            return sampleGradientColor(preset.stops, level, isGradientInverted);
        }
        default: return `rgb(0, ${value}, 0)`;
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 255, b: 0};
}

function toBloomDisplayValue(rawValue) {
    return Math.round(rawValue / 2);
}

function updateTransparentBgUI() {
    const transparent = isBgColorTransparent;
    if (transparentBgToggle) {
        transparentBgToggle.className = transparent ? 'btn-base ri-eye-off-line' : 'btn-base ri-eye-line';
        transparentBgToggle.title = transparent ? 'Transparent background (click to use color)' : 'Enable transparent background';
    }
    if (customBackgroundColor) {
        customBackgroundColor.disabled = transparent;
        if (transparentBgGrid) {
            transparentBgGrid.style.display = transparent ? 'grid' : 'none';
            customBackgroundColor.style.display = transparent ? 'none' : '';
        } else {
            customBackgroundColor.style.opacity = transparent ? '0.3' : '1';
        }
    }
    if (exportTransparentToggle) {
        exportTransparentToggle.checked = transparent;
    }
    if (outputCanvas) {
        outputCanvas.classList.toggle('transparent-bg', transparent);
    }
    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport) {
        outputViewport.classList.toggle('transparent-bg', transparent);
    }
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    if (mobilePreviewContent) {
        const mobileCanvas = mobilePreviewContent.querySelector('canvas');
        if (mobileCanvas) {
            mobileCanvas.classList.toggle('transparent-bg', transparent);
        }
    }
}

function syncCustomColorsWithPreset(scheme) {
    const customTextColor = document.getElementById('customTextColor');
    const customBackgroundColor = document.getElementById('customBackgroundColor');
    
    if (!customTextColor || !customBackgroundColor) return;
    
    switch (scheme) {
        case 'color1':
            customTextColor.value = '#00FF00';
            customBackgroundColor.value = '#000000';
            break;
        case 'color2':
            customTextColor.value = '#FFFFFF';
            customBackgroundColor.value = '#000000';
            break;
        case 'color3':
            customTextColor.value = '#14ee5e';
            customBackgroundColor.value = '#c80a60';
            break;
        case 'custom':
            if (window.savedCustomColors) {
                customTextColor.value = window.savedCustomColors.text || '#00FF00';
                customBackgroundColor.value = window.savedCustomColors.background || '#000000';
            }
            break;
        case 'source':
            break;
        default:
            customTextColor.value = '#00FF00';
            customBackgroundColor.value = '#000000';
    }
    if (gradientMapContainer && customColorsContainer) {
        if (scheme === 'gradient') {
            gradientMapContainer.style.display = 'block';
            customColorsContainer.style.display = 'none';
            updateGradientMapPreview();
        } else {
            gradientMapContainer.style.display = 'none';
            customColorsContainer.style.display = 'block';
            const isSource = scheme === 'source';
            customColorsContainer.style.pointerEvents = isSource ? 'none' : '';
            customColorsContainer.style.opacity = isSource ? '0.5' : '';
            customColorsContainer.querySelectorAll('input, button').forEach(el => { el.disabled = isSource; });
        }
    } else if (customColorsContainer) {
        const isSource = scheme === 'source';
        customColorsContainer.style.pointerEvents = isSource ? 'none' : '';
        customColorsContainer.style.opacity = isSource ? '0.5' : '';
        customColorsContainer.querySelectorAll('input, button').forEach(el => { el.disabled = isSource; });
    }
    if (levelsSlider) {
        levelsSlider.disabled = false;
        const grayscaleValuesContainer = levelsSlider.closest('.slider-container');
        if (grayscaleValuesContainer) {
            grayscaleValuesContainer.style.pointerEvents = '';
            grayscaleValuesContainer.style.opacity = '';
        }
        const levelsNumberInput = document.getElementById('levelsNumberInput');
        if (levelsNumberInput) levelsNumberInput.disabled = false;
    }
}

function getCanvasBackgroundColor(scheme) {
    if (isBgColorTransparent) return 'transparent';
    switch (scheme) {
        case 'source': case 'color1': case 'color2': return getComputedStyle(document.documentElement).getPropertyValue('--primary-bg');
        case 'color3': case 'custom': 
            return customBackgroundColor.value;
        case 'gradient': {
            const preset = getGradientPresetById(currentGradientMap);
            return sampleGradientColor(preset.stops, 0, isGradientInverted);
        }
        default: return getComputedStyle(document.documentElement).getPropertyValue('--primary-bg');
    }
}

function drawPosterizedPreview(pixelDataToProcess, width, height, levelsArray) {
    inputCanvas.width = width;
    inputCanvas.height = height;
    const previewCtx = inputCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, width, height);
    const outputImageData = previewCtx.createImageData(width, height);
    const outputData = outputImageData.data;
    for (let i = 0; i < pixelDataToProcess.length; i += 4) {
        const r = pixelDataToProcess[i], g = pixelDataToProcess[i + 1], b = pixelDataToProcess[i + 2], a = pixelDataToProcess[i + 3];
        const grayscale = (r + g + b) / 3;
        let closestLevelValue = levelsArray[0];
        let minDiff = Math.abs(grayscale - closestLevelValue * 255);
        for (let j = 1; j < levelsArray.length; j++) {
            const diff = Math.abs(grayscale - levelsArray[j] * 255);
            if (diff < minDiff) { minDiff = diff; closestLevelValue = levelsArray[j];}
        }
        const posterizedVal = Math.round(closestLevelValue * 255);
        outputData[i] = posterizedVal; outputData[i + 1] = posterizedVal; outputData[i + 2] = posterizedVal; outputData[i + 3] = a;
    }
    previewCtx.putImageData(outputImageData, 0, 0);
}

async function updateInputCanvasPreview() {
    if (!currentMediaElement || (isVideoInput && !currentMediaElement.videoWidth) || (!isVideoInput && !originalPixelData)) {
         inputCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
        return;
    }

    const isMobile = window.innerWidth <= 768;
    if (isMobile && isVideoInput) {
        inputVideo.style.display = 'block';
        inputCanvas.style.display = 'none';
        return;
    }

    if (isVideoInput) {
        if (isPreviewChangesActive && !isMobile) {
            inputVideo.style.display = 'none';
            inputCanvas.style.display = 'block';
            
            // Capture current video frame
            inputCanvas.width = currentImageOriginalWidth;
            inputCanvas.height = currentImageOriginalHeight;
            inputCtx.drawImage(inputVideo, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
            
            let framePixelData = inputCtx.getImageData(0, 0, currentImageOriginalWidth, currentImageOriginalHeight).data;
            
            if (isChromaRemovalActive) {
                framePixelData = removeChroma(framePixelData, currentImageOriginalWidth, currentImageOriginalHeight, currentBackgroundTolerance);
            }
            
            if (isInvertColorsActive) {
                framePixelData = invertPixelData(framePixelData);
            }
            
            const tempContrast = parseInt(contrastSlider.value);
            const tempBrightness = parseInt(brightnessSlider.value);
            const tempShadow = parseInt(shadowInputSlider.value);
            const tempGamma = parseFloat(midtoneGammaSlider.value);
            const tempHighlight = parseInt(highlightInputSlider.value);
            const tempNumLevels = parseInt(levelsSlider.value);
            
            let processedForPreview = applyContrast(new Uint8ClampedArray(framePixelData), currentImageOriginalWidth, currentImageOriginalHeight, tempContrast);
            processedForPreview = applyLevelsAndBrightness(processedForPreview, currentImageOriginalWidth, currentImageOriginalHeight, tempBrightness, tempShadow, tempGamma, tempHighlight);
            
            const previewLevels = generateGrayscaleLevels(tempNumLevels);
            drawPosterizedPreview(processedForPreview, currentImageOriginalWidth, currentImageOriginalHeight, previewLevels);
        } else {
        inputVideo.style.display = 'block';
        inputCanvas.style.display = 'none';
        }
        return;
    }

    if(invertColorsContainer) invertColorsContainer.style.display = 'flex';
    if(previewChangesContainer) previewChangesContainer.style.display = 'flex';


    let dataForPreview = new Uint8ClampedArray(originalPixelData);
    
    if (isChromaRemovalActive) {
        dataForPreview = removeChroma(dataForPreview, currentImageOriginalWidth, currentImageOriginalHeight, currentBackgroundTolerance);
    }
    
    if (isInvertColorsActive) {
        dataForPreview = invertPixelData(dataForPreview);
    }

    if (isPreviewChangesActive && !isMobile) {
        loadingSpinner.style.display = 'inline';
    if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
        await new Promise(resolve => setTimeout(resolve, 0));
                const tempContrast = parseInt(contrastSlider.value);
        const tempBrightness = parseInt(brightnessSlider.value);
        const tempShadow = parseInt(shadowInputSlider.value);
        const tempGamma = parseFloat(midtoneGammaSlider.value);
        const tempHighlight = parseInt(highlightInputSlider.value);
        const tempNumLevels = parseInt(levelsSlider.value);
        let processedForPreview = applyContrast(dataForPreview, currentImageOriginalWidth, currentImageOriginalHeight, tempContrast);
        processedForPreview = applyLevelsAndBrightness(processedForPreview, currentImageOriginalWidth, currentImageOriginalHeight, tempBrightness, tempShadow, tempGamma, tempHighlight);
        const previewLevels = generateGrayscaleLevels(tempNumLevels);
        drawPosterizedPreview(processedForPreview, currentImageOriginalWidth, currentImageOriginalHeight, previewLevels);
        loadingSpinner.style.display = 'none';
    if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
    } else {
         inputCanvas.width = currentImageOriginalWidth;
         inputCanvas.height = currentImageOriginalHeight;
         inputCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
         if (isInvertColorsActive) {
            const invertedOnly = invertPixelData(originalPixelData);
            const tempImgData = inputCtx.createImageData(currentImageOriginalWidth, currentImageOriginalHeight);
            tempImgData.data.set(invertedOnly);
            inputCtx.putImageData(tempImgData, 0, 0);
        } else {
            inputCtx.drawImage(currentMediaElement, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
        }
    }
    
    if (currentMobileView === 'input') {
        debouncedUpdateMobilePreview();
    }
}

function generateBlobMatrix(pixelDataToProcess, originalWidth, originalHeight, levelsArray, densityStep, colorScheme, charSet) {
    let blobMatrix = [];
    
    const charSpacing = currentCharSpacing || 0;
    
    if (isVerticalTextMode) {
        // Vertical mode: process columns from left to right, rows from top to bottom
        const totalCols = Math.ceil(originalWidth / densityStep);
        const colsToAdjust = Math.floor(charSpacing);
        const effectiveCols = Math.max(1, totalCols - colsToAdjust);
        const adjustedDensityStep = originalWidth / effectiveCols;
        const totalRows = Math.ceil(originalHeight / densityStep);
        
        // Initialize matrix with empty rows
        for (let i = 0; i < totalRows; i++) {
            blobMatrix.push([]);
        }
        
        // Generate random offsets for each column to break patterns
        const columnOffsets = [];
        for (let i = 0; i < effectiveCols; i++) {
            columnOffsets.push(Math.floor(Math.random() * 10000));
        }
        
        let currentColIndex = 0;
        
        // Process columns from left to right
        for (let colIndex = 0; colIndex < effectiveCols; colIndex++) {
            const x = Math.floor(colIndex * adjustedDensityStep);
            
            // Within each column, process from top to bottom
            for (let y = 0; y < originalHeight; y += densityStep) {
                const rowIndex = Math.floor(y / densityStep);
                
                let avgR = 0, avgG = 0, avgB = 0, avgA = 0, count = 0;
                for (let subY = 0; subY < densityStep && (y + subY) < originalHeight; subY++) {
                    for (let subX = 0; subX < densityStep && (x + subX) < originalWidth; subX++) {
                        const i = ((y + subY) * originalWidth + (x + subX)) * 4;
                        avgR += pixelDataToProcess[i]; avgG += pixelDataToProcess[i+1]; avgB += pixelDataToProcess[i+2];
                        avgA += pixelDataToProcess[i+3];
                        count++;
                    }
                }
                if (count === 0) continue;
                avgR /= count; avgG /= count; avgB /= count; avgA /= count;
                const grayscale = (avgR + avgG + avgB) / 3;
                let closestLevelValue = levelsArray[0];
                let minDiff = Math.abs(grayscale - closestLevelValue * 255);
                for (let j = 1; j < levelsArray.length; j++) {
                    const diff = Math.abs(grayscale - levelsArray[j] * 255);
                    if (diff < minDiff) { minDiff = diff; closestLevelValue = levelsArray[j]; }
                }
                const isCellTransparent = isBgColorTransparent ? (closestLevelValue === 0 || avgA < 128) : (avgA < 10);
                let finalR = Math.round(avgR);
                let finalG = Math.round(avgG);
                let finalB = Math.round(avgB);
                if (grayscale > 0) {
                    const scale = (closestLevelValue * 255) / grayscale;
                    finalR = Math.min(255, Math.round(avgR * scale));
                    finalG = Math.min(255, Math.round(avgG * scale));
                    finalB = Math.min(255, Math.round(avgB * scale));
                } else {
                    finalR = 0; finalG = 0; finalB = 0;
                }
                const cellColorSource = colorScheme === 'source' ? (isCellTransparent ? 'rgba(0, 0, 0, 0)' : `rgb(${finalR}, ${finalG}, ${finalB})`) : null;
                let char = ' '; let color = isCellTransparent ? 'rgba(0, 0, 0, 0)' : (cellColorSource !== null ? cellColorSource : getCharacterDisplayColor(0, colorScheme));
                let shouldDrawChar = !isCellTransparent;
                if (shouldDrawChar) {
                    if (colorScheme === 'blackOnWhite') {
                        shouldDrawChar = closestLevelValue < 1 || (levelsArray.length === 1 && levelsArray[0] === 1 && grayscale > 128);
                    } else {
                        shouldDrawChar = closestLevelValue > 0 || (levelsArray.length === 1 && levelsArray[0] === 0 && grayscale < 128) || (levelsArray.length > 1 && closestLevelValue === 0);
                    }
                }

                if (shouldDrawChar) {
                    if (charSet === 'custom') {
                        const customText = customCharsInput.value;
                        if (customText.length > 0) {
                            const offsetIndex = customCharSeqIndex + columnOffsets[colIndex];
                            if (customText.includes(',')) {
                                const customItems = customText.split(',');
                                if (customItems.length > 0) {
                                    const selectedItem = customItems[Math.floor(Math.random() * customItems.length)];
                                    if (selectedItem.length > 1) {
                                        char = selectedItem[offsetIndex % selectedItem.length];
                                        customCharSeqIndex++;
                                    } else {
                                        char = selectedItem;
                                    }
                                } else { char = '#'; }
                            } else if (customText.includes('.')) {
                                const customItems = customText.split('.');
                                if (customItems.length > 0) {
                                    const flattenedChars = customItems.join('');
                                    char = flattenedChars[offsetIndex % flattenedChars.length];
                                    customCharSeqIndex++;
                                } else { char = '#'; }
                            } else {
                                char = customText[offsetIndex % customText.length];
                                customCharSeqIndex++;
                            }
                        } else { char = '#'; }
                    } else if (charSet.startsWith('preset') || charSet === 'binary') {
                        const presetValues = {
                             'binary': '0,1', 'preset1': 'ABC', 'preset2': 'A,B,C', 'preset3': '⦁', 'preset4': '●',
                             'preset5': '⬤', 'preset6': '〇', 'preset7': '■', 'preset8': '█', 'preset9': '▃',
                             'preset10': '⯁', 'preset11': '✖', 'preset12': '✚', 'preset13': '╋', 'preset14': '⧸,⧹'
                         };
                        const presetText = presetValues[charSet] || '#';
                        if (presetText.includes(',')) {
                            const presetItems = presetText.split(',').map(s => s.trim()).filter(s => s);
                            if (presetItems.length > 0) {
                                char = presetItems[Math.floor(Math.random() * presetItems.length)];
                            } else { char = '#'; }
                        } else {
                            const offsetIndex = customCharSeqIndex + columnOffsets[colIndex];
                            char = presetText[offsetIndex % presetText.length];
                            customCharSeqIndex++;
                        }
                    } else {
                        char = getRandomCharacterForLevel(closestLevelValue, charSet);
                    }
                    if (cellColorSource === null) color = getCharacterDisplayColor(closestLevelValue, colorScheme, currentColIndex, effectiveCols);
                }
                blobMatrix[rowIndex].push({char: char, color: color, brightness: grayscale / 255, level: closestLevelValue, isTransparent: isCellTransparent});
            }
            currentColIndex++;
        }
    } else {
        // Horizontal mode: original logic
        const totalRows = Math.ceil(originalHeight / densityStep);
        let currentRowIndex = 0;
        
        const totalCols = Math.ceil(originalWidth / densityStep);
        const colsToAdjust = Math.floor(charSpacing);
        const effectiveCols = Math.max(1, totalCols - colsToAdjust);
        const adjustedDensityStep = originalWidth / effectiveCols;

        // Generate random offsets for each row to break patterns
        const rowOffsets = [];
        for (let i = 0; i < totalRows; i++) {
            rowOffsets.push(Math.floor(Math.random() * 10000));
        }

        // Process from bottom to top to reverse the movement illusion
        for (let y = originalHeight - densityStep; y >= 0; y -= densityStep) {
            let blobRow = [];
            const currentRowOffset = rowOffsets[currentRowIndex];
            for (let colIndex = 0; colIndex < effectiveCols; colIndex++) {
                const x = Math.floor(colIndex * adjustedDensityStep);
                let avgR = 0, avgG = 0, avgB = 0, avgA = 0, count = 0;
                for (let subY = 0; subY < densityStep && (y + subY) < originalHeight; subY++) {
                    for (let subX = 0; subX < densityStep && (x + subX) < originalWidth; subX++) {
                        const i = ((y + subY) * originalWidth + (x + subX)) * 4;
                        avgR += pixelDataToProcess[i]; avgG += pixelDataToProcess[i+1]; avgB += pixelDataToProcess[i+2];
                        avgA += pixelDataToProcess[i+3];
                        count++;
                    }
                }
                if (count === 0) continue;
                avgR /= count; avgG /= count; avgB /= count; avgA /= count;
                const grayscale = (avgR + avgG + avgB) / 3;
                let closestLevelValue = levelsArray[0];
                let minDiff = Math.abs(grayscale - closestLevelValue * 255);
                for (let j = 1; j < levelsArray.length; j++) {
                    const diff = Math.abs(grayscale - levelsArray[j] * 255);
                    if (diff < minDiff) { minDiff = diff; closestLevelValue = levelsArray[j]; }
                }
                const isCellTransparent = isBgColorTransparent ? (closestLevelValue === 0 || avgA < 128) : (avgA < 10);
                let finalR = Math.round(avgR);
                let finalG = Math.round(avgG);
                let finalB = Math.round(avgB);
                if (grayscale > 0) {
                    const scale = (closestLevelValue * 255) / grayscale;
                    finalR = Math.min(255, Math.round(avgR * scale));
                    finalG = Math.min(255, Math.round(avgG * scale));
                    finalB = Math.min(255, Math.round(avgB * scale));
                } else {
                    finalR = 0; finalG = 0; finalB = 0;
                }
                const cellColorSource = colorScheme === 'source' ? (isCellTransparent ? 'rgba(0, 0, 0, 0)' : `rgb(${finalR}, ${finalG}, ${finalB})`) : null;
                let char = ' '; let color = isCellTransparent ? 'rgba(0, 0, 0, 0)' : (cellColorSource !== null ? cellColorSource : getCharacterDisplayColor(0, colorScheme));
                let shouldDrawChar = !isCellTransparent;
                if (shouldDrawChar) {
                    if (colorScheme === 'blackOnWhite') {
                        shouldDrawChar = closestLevelValue < 1 || (levelsArray.length === 1 && levelsArray[0] === 1 && grayscale > 128);
                    } else {
                        shouldDrawChar = closestLevelValue > 0 || (levelsArray.length === 1 && levelsArray[0] === 0 && grayscale < 128) || (levelsArray.length > 1 && closestLevelValue === 0);
                    }
                }

                if (shouldDrawChar) {
                    if (charSet === 'custom') {
                        const customText = customCharsInput.value;
                        if (customText.length > 0) {
                            const offsetIndex = customCharSeqIndex + currentRowOffset;
                            if (customText.includes(',')) {
                                const customItems = customText.split(',');
                                if (customItems.length > 0) {
                                    const selectedItem = customItems[Math.floor(Math.random() * customItems.length)];
                                    if (selectedItem.length > 1) {
                                        char = selectedItem[offsetIndex % selectedItem.length];
                                        customCharSeqIndex++;
                                    } else {
                                        char = selectedItem;
                                    }
                                } else { char = '#'; }
                            } else if (customText.includes('.')) {
                                const customItems = customText.split('.');
                                if (customItems.length > 0) {
                                    const flattenedChars = customItems.join('');
                                    char = flattenedChars[offsetIndex % flattenedChars.length];
                                    customCharSeqIndex++;
                                } else { char = '#'; }
                            } else {
                                char = customText[offsetIndex % customText.length];
                                customCharSeqIndex++;
                            }
                        } else { char = '#'; }
                    } else if (charSet.startsWith('preset') || charSet === 'binary') {
                        const presetValues = {
                             'binary': '0,1', 'preset1': 'ABC', 'preset2': 'A,B,C', 'preset3': '⦁', 'preset4': '●',
                             'preset5': '⬤', 'preset6': '〇', 'preset7': '■', 'preset8': '█', 'preset9': '▃',
                             'preset10': '⯁', 'preset11': '✖', 'preset12': '✚', 'preset13': '╋', 'preset14': '⧸,⧹'
                         };
                        const presetText = presetValues[charSet] || '#';
                        if (presetText.includes(',')) {
                            const presetItems = presetText.split(',').map(s => s.trim()).filter(s => s);
                            if (presetItems.length > 0) {
                                char = presetItems[Math.floor(Math.random() * presetItems.length)];
                            } else { char = '#'; }
                        } else {
                            const offsetIndex = customCharSeqIndex + currentRowOffset;
                            char = presetText[offsetIndex % presetText.length];
                            customCharSeqIndex++;
                        }
                    } else {
                        char = getRandomCharacterForLevel(closestLevelValue, charSet);
                    }
                    if (cellColorSource === null) color = getCharacterDisplayColor(closestLevelValue, colorScheme, currentRowIndex, totalRows);
                }
                blobRow.push({char: char, color: color, brightness: grayscale / 255, level: closestLevelValue, isTransparent: isCellTransparent});
            }
            if (blobRow.length > 0) { 
                blobMatrix.unshift(blobRow);
                currentRowIndex++;
            }
        }
    }
    return blobMatrix;
}

function drawTextOnCanvas(matrixToDraw, scaleFactor, colorScheme, fontFamily) {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const baseCharSize = currentDensity || DEFAULT_BASE_FONT_SIZE;
            const effectiveCharSize = baseCharSize * scaleFactor;
            const charSpacing = currentCharSpacing || 0;
            const charWidth = effectiveCharSize;
            const charHeight = effectiveCharSize;
            
            if (matrixToDraw.length === 0 || matrixToDraw[0].length === 0) {
                outputCanvas.width = 1; outputCanvas.height = 1; outputCtx.clearRect(0,0,1,1);
                if (outputResolutionDisplay) outputResolutionDisplay.textContent = `${outputCanvas.width}x${outputCanvas.height}`;
                if (gridSizeDisplay) gridSizeDisplay.textContent = `0x0`;
                resolve(); return;
            }
            const numOutputRows = matrixToDraw.length; const numOutputCols = matrixToDraw[0].length;
            
            const colsToAdjust = Math.floor(charSpacing);
            const originalCols = numOutputCols + colsToAdjust;
            
            outputCanvas.width = Math.max(1, originalCols * charWidth);
            outputCanvas.height = Math.max(1, numOutputRows * charHeight);
            if (outputResolutionDisplay) outputResolutionDisplay.textContent = `${outputCanvas.width}x${outputCanvas.height}`;
            if (gridSizeDisplay) gridSizeDisplay.textContent = `${numOutputCols}x${numOutputRows}`;

            const cellWidth = numOutputCols > 1 ? outputCanvas.width / numOutputCols : charWidth;

            if (isRandomSpacingActive && (columnOffsets.length !== numOutputCols || charSpacing !== currentCharSpacing)) {
                columnOffsets = [];
                const maxOffset = Math.abs(charSpacing);
                for (let i = 0; i < numOutputCols; i++) {
                    columnOffsets.push((Math.random() - 0.5) * 2 * maxOffset);
                }
            }

            outputCtx.font = `${effectiveCharSize}px ${fontFamily}`;
            outputCtx.textAlign = 'left'; outputCtx.textBaseline = 'top';
            const canvasBgColor = getCanvasBackgroundColor(colorScheme);
            if (isBgColorTransparent || canvasBgColor === 'transparent') {
                outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            } else {
                outputCtx.fillStyle = canvasBgColor;
                outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            }

            let currentY = 0;
            for (let y = 0; y < numOutputRows; y++) {
                let currentX = 0;
                for (let x = 0; x < numOutputCols; x++) {
                    if (matrixToDraw[y] && matrixToDraw[y][x]) {
                        const cellColor = matrixToDraw[y][x].color;
                        if (cellColor !== 'rgba(0, 0, 0, 0)') {
                            outputCtx.fillStyle = cellColor;
                            const xOffset = isRandomSpacingActive ? (columnOffsets[x] || 0) : 0;
                            outputCtx.fillText(matrixToDraw[y][x].char, currentX + xOffset, currentY);
                        }
                    }
                    currentX += cellWidth;
                }
                currentY += charHeight;
            }

            if (currentOutputBloom > 0) {
                const bloomCanvas = document.createElement('canvas');
                bloomCanvas.width = outputCanvas.width;
                bloomCanvas.height = outputCanvas.height;
                const bloomCtx = bloomCanvas.getContext('2d');
                bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
                bloomCtx.font = outputCtx.font;
                bloomCtx.textAlign = 'left';
                bloomCtx.textBaseline = 'top';

                currentY = 0;
                for (let y = 0; y < numOutputRows; y++) {
                    let currentX = 0;
                    for (let x = 0; x < numOutputCols; x++) {
                        if (matrixToDraw[y] && matrixToDraw[y][x]) {
                            const cellColor = matrixToDraw[y][x].color;
                            if (cellColor !== 'rgba(0, 0, 0, 0)') {
                                bloomCtx.fillStyle = cellColor;
                                const xOffset = isRandomSpacingActive ? (columnOffsets[x] || 0) : 0;
                                bloomCtx.fillText(matrixToDraw[y][x].char, currentX + xOffset, currentY);
                            }
                        }
                        currentX += cellWidth;
                    }
                    currentY += charHeight;
                }

                const bloomStrength = Math.max(0, Math.min(1, 0.2 + currentOutputBloom / 120));
                const blurAmount = Math.max(4, Math.round(4 + currentOutputBloom * 0.25));
                const passCount = Math.min(8, 2 + Math.floor(currentOutputBloom / 60));
                outputCtx.save();
                outputCtx.globalCompositeOperation = 'lighter';
                for (let i = 0; i < passCount; i++) {
                    const passAlpha = Math.min(1, bloomStrength * (1 + i * 0.35));
                    const passBlur = blurAmount * (1 + i * 0.9);
                    outputCtx.globalAlpha = passAlpha;
                    outputCtx.filter = `blur(${passBlur}px)`;
                    outputCtx.drawImage(bloomCanvas, 0, 0);
                }
                outputCtx.restore();
            }

            if (currentOutputExposure !== 0) {
                const exposureFactor = Math.pow(2, currentOutputExposure / 50);
                const imgData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
                const d = imgData.data;
                if (isBgColorTransparent || canvasBgColor === 'transparent') {
                    for (let i = 0; i < d.length; i += 4) {
                        if (d[i + 3] > 0) {
                            d[i] = Math.min(255, Math.max(0, d[i] * exposureFactor));
                            d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * exposureFactor));
                            d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * exposureFactor));
                        }
                    }
                } else {
                    for (let i = 0; i < d.length; i += 4) {
                        d[i] = Math.min(255, Math.max(0, d[i] * exposureFactor));
                        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * exposureFactor));
                        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * exposureFactor));
                    }
                }
                outputCtx.putImageData(imgData, 0, 0);
            }

            const outputPlaceholder = document.getElementById('outputPlaceholder');
            if (outputPlaceholder) {
                outputPlaceholder.classList.add('hidden');
                outputPlaceholder.style.display = 'none';
            }
            const outputViewport = document.getElementById('outputViewport');
            if (outputViewport) {
                outputViewport.classList.add('has-media');
            }

            forceUpdateMobileOutputCanvas();
            resolve();
        });
    });
}
function stopVideoProcessingLoop() {
    if (videoProcessLoopId !== null) {
        cancelAnimationFrame(videoProcessLoopId);
        videoProcessLoopId = null;
    }
}


async function processImageWithCurrentSettings() {
    if (isSequenceRendering) return;

    // Only hide example buttons if there's a file loaded
    if (currentMediaElement || originalPixelData) {
        hideExampleButtons();
    }

    loadingSpinner.style.display = 'inline';
    if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
    if (!isVideoInput || inputVideo.paused) {
         setDownloadButtonsState(true);
    }

    isChromaRemovalActive = chromaRemovalToggle.checked;
    currentBackgroundTolerance = 10;
    isInvertColorsActive = invertColorsToggle.checked;
    currentOutputBloom = parseInt(outputBloomSlider.value);
    currentOutputExposure = outputExposureSlider ? (parseInt(outputExposureSlider.value) || 0) : 0;
    currentNumLevels = parseInt(levelsSlider.value);
    currentBrightness = parseInt(brightnessSlider.value);
    currentContrast = parseInt(contrastSlider.value);
    currentShadowInput = parseInt(shadowInputSlider.value);
    currentMidtoneGamma = parseFloat(midtoneGammaSlider.value);
    currentHighlightInput = parseInt(highlightInputSlider.value);
    currentDensity = densityInput ? (parseInt(densityInput.value) || DEFAULT_BASE_FONT_SIZE) : DEFAULT_BASE_FONT_SIZE;
    currentScaleFactor = parseFloat(scaleFactorInput.value);
    currentCharSpacing = parseInt(charSpacingSlider.value);
    currentColorScheme = colorSchemeSelect.value;
    currentFontFamily = availableFonts[fontSelect.selectedIndex].cssName;
    currentCharacterSet = characterSetSelect.value;

    await new Promise(resolve => setTimeout(resolve, 0));

    let sourcePixelData;
    if (isVideoInput) {
        if (!currentMediaElement || currentMediaElement.readyState < inputVideo.HAVE_CURRENT_DATA ) {
            loadingSpinner.style.display = 'none';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
            setDownloadButtonsState(true);
            return;
        }
        const tempVidCanvas = document.createElement('canvas');
        tempVidCanvas.width = currentImageOriginalWidth;
        tempVidCanvas.height = currentImageOriginalHeight;
        const tempVidCtx = tempVidCanvas.getContext('2d');
        tempVidCtx.drawImage(currentMediaElement, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
        sourcePixelData = tempVidCtx.getImageData(0, 0, currentImageOriginalWidth, currentImageOriginalHeight).data;

        if (isChromaRemovalActive) {
            sourcePixelData = removeChroma(sourcePixelData, currentImageOriginalWidth, currentImageOriginalHeight, currentBackgroundTolerance);
        }
        if (isInvertColorsActive) {
            sourcePixelData = invertPixelData(sourcePixelData);
        }

    } else {
        if (!originalPixelData) {
            loadingSpinner.style.display = 'none';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
            setDownloadButtonsState(true);
            return;
        }
        sourcePixelData = new Uint8ClampedArray(originalPixelData);
        if (isChromaRemovalActive) {
            sourcePixelData = removeChroma(sourcePixelData, currentImageOriginalWidth, currentImageOriginalHeight, currentBackgroundTolerance);
        }
        if (isInvertColorsActive) {
            sourcePixelData = invertPixelData(sourcePixelData);
        }
    }

    let processedData = applyContrast(new Uint8ClampedArray(sourcePixelData), currentImageOriginalWidth, currentImageOriginalHeight, currentContrast);
    processedData = applyLevelsAndBrightness(processedData, currentImageOriginalWidth, currentImageOriginalHeight, currentBrightness, currentShadowInput, currentMidtoneGamma, currentHighlightInput);

    if (!isVideoInput && isPreviewChangesActive) {
        const previewLevels = generateGrayscaleLevels(currentNumLevels);
        let previewBaseData = new Uint8ClampedArray(originalPixelData);
        if (chromaRemovalToggle.checked) {
            previewBaseData = removeChroma(previewBaseData, currentImageOriginalWidth, currentImageOriginalHeight, 10);
        }
        if (invertColorsToggle.checked) {
            previewBaseData = invertPixelData(previewBaseData);
        }
                        let previewProcessed = applyContrast(previewBaseData, currentImageOriginalWidth, currentImageOriginalHeight, parseInt(contrastSlider.value));
        previewProcessed = applyLevelsAndBrightness(previewProcessed, currentImageOriginalWidth, currentImageOriginalHeight, parseInt(brightnessSlider.value), parseInt(shadowInputSlider.value), parseFloat(midtoneGammaSlider.value), parseInt(highlightInputSlider.value));
        drawPosterizedPreview(previewProcessed, currentImageOriginalWidth, currentImageOriginalHeight, previewLevels);

    } else if (isVideoInput && isPreviewChangesActive) {
        updateInputCanvasPreview();
    } else if (isVideoInput) {
         inputVideo.style.display = 'block';
         inputCanvas.style.display = 'none';
    }

    const localGrayscaleLevels = generateGrayscaleLevels(currentNumLevels);
    currentBlobMatrix = generateBlobMatrix(processedData, currentImageOriginalWidth, currentImageOriginalHeight, localGrayscaleLevels, currentDensity, currentColorScheme, currentCharacterSet);
    await drawTextOnCanvas(currentBlobMatrix, currentScaleFactor, currentColorScheme, currentFontFamily);

    const outputPlaceholder = document.getElementById('outputPlaceholder');
    if (outputPlaceholder) {
        outputPlaceholder.classList.add('hidden');
        outputPlaceholder.style.display = 'none';
    }
    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport) {
        outputViewport.classList.add('has-media');
    }

    loadingSpinner.style.display = 'none';
    if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
    setDownloadButtonsState(false);
    updateFullscreenButton();

    if (window.innerWidth <= 768 && mobilePreviewActive) {
        debouncedUpdateMobilePreview();
    }
}

function handleImageUpload(file, isCropped = false) {
    stopVideoProcessingLoop();
    stopWebcam();
    clearCachedSequence();
    resetCanvasZoom(false);
    isVideoInput = false;
    loadingSpinner.style.display = 'inline';
    if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
    setDownloadButtonsState(true);
    downloadPngSequenceButton.style.display = 'none';
    showUploadSpinner();
    hideExampleButtons();

    const outputPlaceholder = document.getElementById('outputPlaceholder');
    if (outputPlaceholder) {
        outputPlaceholder.classList.add('hidden');
        outputPlaceholder.style.display = 'none';
    }
    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport) {
        outputViewport.classList.add('has-media');
    }

    inputVideo.style.display = 'none';
    inputVideo.pause();
    inputVideo.onloadedmetadata = null;
    inputVideo.onerror = null;
    inputVideo.onplay = null;
    inputVideo.onpause = null;
    inputVideo.onended = null;
    inputVideo.onseeked = null;
    inputVideo.src = "";
    inputCanvas.style.display = 'none';

    const reader = new FileReader();
    reader.onload = function(event) {
        if (file.type.startsWith('video/')) {
            isVideoInput = true;
            currentMediaElement = inputVideo;
            if (!isCropped) rawMediaElement = inputVideo;
            inputVideo.src = event.target.result;
            inputVideo.onloadedmetadata = async () => {
                currentImageOriginalWidth = inputVideo.videoWidth;
                currentImageOriginalHeight = inputVideo.videoHeight;
                customCharSeqIndex = 0;

                inputVideo.style.display = 'block';
                inputCanvas.style.display = 'none';

                uploadZone.style.display = 'none';
                if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
                if(condensedUploadZone) condensedUploadZone.style.display = 'inline-block';
                if(condensedFilename) condensedFilename.innerHTML = `<i class="ri-check-line"></i> ${file.name} `;

                hideExampleButtons();

                if(previewChangesContainer) previewChangesContainer.style.display = 'flex';

                setDefaultValues(inputVideo.videoWidth);
                
                previewChangesToggle.checked = false;
                isPreviewChangesActive = false;
                previewChangesToggle.disabled = false;
                currentDensity = parseInt(densityInput.value);

                if(chromaRemovalContainer) chromaRemovalContainer.style.display = 'flex';
                if(invertColorsContainer) invertColorsContainer.style.display = 'flex';

                await processImageWithCurrentSettings();
                loadingSpinner.style.display = 'none';
                if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
                hideUploadSpinner();
                updatePngSequenceButtonState();
                
                initializeHistoryForNewFile();
                
                if (inputVideo.duration > 1) {
                    inputVideo.currentTime = 1;
                }
                
                if (window.innerWidth <= 768 && mobilePreviewActive) {
                    switchMobileView('output');
                } else {
                    debouncedUpdateMobilePreview();
                }

                inputVideo.onplay = () => {
                    clearCachedSequence();
                    stopVideoProcessingLoop();
                    videoProcessLoopId = requestAnimationFrame(processCurrentFrame);
                };
                inputVideo.onpause = () => {
                    processImageWithCurrentSettings();
                };
                inputVideo.onended = () => stopVideoProcessingLoop();
                
                let seekDebounceTimeout;
                inputVideo.onseeked = () => {
                    clearTimeout(seekDebounceTimeout);
                    seekDebounceTimeout = setTimeout(() => {
                        if (inputVideo.paused && inputVideo.readyState >= inputVideo.HAVE_CURRENT_DATA) {
                            syncMobileVideoTime();
                            
                            processImageWithCurrentSettings().then(() => {
                                if (window.innerWidth <= 768 && currentMobileView === 'output') {
                                    debouncedUpdateMobilePreview();
                                }
                            });
                        }
                    }, 100);
                };
            };
             inputVideo.onerror = () => {
                alert("Error loading video.");
                loadingSpinner.style.display = 'none';
                if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
                hideUploadSpinner();
                setDownloadButtonsState(true);
                updatePngSequenceButtonState();
            };
        } else if (file.type.startsWith('image/')) {
            isVideoInput = false;
            const img = new Image();
            currentMediaElement = img;
            if (!isCropped) rawMediaElement = img;
            img.onload = async function() {
                currentImageOriginalWidth = img.width;
                currentImageOriginalHeight = img.height;
                randomNumberMap = {};
                customCharSeqIndex = 0;

                inputCanvas.width = currentImageOriginalWidth;
                inputCanvas.height = currentImageOriginalHeight;

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = currentImageOriginalWidth;
                tempCanvas.height = currentImageOriginalHeight;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(img, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
                originalPixelData = tempCtx.getImageData(0, 0, currentImageOriginalWidth, currentImageOriginalHeight).data;
                if (!isCropped) rawOriginalPixelData = originalPixelData;

                if(chromaRemovalContainer) chromaRemovalContainer.style.display = 'flex';
                if(invertColorsContainer) invertColorsContainer.style.display = 'flex';
                if(previewChangesContainer) previewChangesContainer.style.display = 'flex';

                previewChangesToggle.disabled = false;

                setDefaultValues(img.width);
                currentDensity = parseInt(densityInput.value);

                await processImageWithCurrentSettings();
                await updateInputCanvasPreview();
                inputCanvas.style.display = 'block';
                uploadZone.style.display = 'none';
                if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
                
                hideExampleButtons();
                
                hideUploadSpinner();
                updatePngSequenceButtonState();
                
                initializeHistoryForNewFile();
                
                if (window.innerWidth <= 768 && mobilePreviewActive) {
                    switchMobileView('output');
                } else {
                    debouncedUpdateMobilePreview();
                }
            }
            img.src = event.target.result;
             img.onerror = () => {
                alert("Error loading image.");
                loadingSpinner.style.display = 'none';
                if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
                hideUploadSpinner();
                setDownloadButtonsState(true);
                updatePngSequenceButtonState();
            };
        } else {
            alert('Unsupported file type.');
            loadingSpinner.style.display = 'none';
            if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
            hideUploadSpinner();
            setDownloadButtonsState(true);
            updatePngSequenceButtonState();
        }
    }
    reader.readAsDataURL(file);
}

imageUpload.addEventListener('change', function(e) {
   if (e.target.files && e.target.files[0]) {
       handleImageUpload(e.target.files[0]);
       condensedUploadZone.style.display = 'inline-block';
       condensedFilename.innerHTML = `<i class="ri-check-line"></i> ${e.target.files[0].name} `;
       if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
   }
});
condensedImageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleImageUpload(file);
        condensedFilename.innerHTML = `<i class="ri-check-line"></i> ${file.name} `;
        if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
    }
});

// Enhanced touch handling for sliders to prevent accidental activation during scrolling
function addMobileTouchHandling(slider) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartValue = 0;
    let isDragging = false;
    let hasMovedHorizontally = false;
    const TOUCH_THRESHOLD = 10;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartValue = parseFloat(slider.value);
        isDragging = false;
        hasMovedHorizontally = false;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);

        if (deltaX > TOUCH_THRESHOLD && deltaX > deltaY) {
            hasMovedHorizontally = true;
            isDragging = true;
            e.preventDefault();
        } else if (deltaY > TOUCH_THRESHOLD && !hasMovedHorizontally) {
            return;
        }
    }, { passive: false });

    slider.addEventListener('touchend', (e) => {
        if (!hasMovedHorizontally && Math.abs(parseFloat(slider.value) - touchStartValue) > 0) {
            slider.value = touchStartValue;
            if (slider === contrastSlider) contrastValueDisplay.textContent = slider.value;
            else if (slider === levelsSlider) levelsValueDisplay.textContent = slider.value;
            else if (slider === brightnessSlider) brightnessValueDisplay.textContent = slider.value;
            else if (slider === shadowInputSlider) shadowInputValueDisplay.textContent = slider.value;
            else if (slider === midtoneGammaSlider) midtoneGammaValueDisplay.textContent = parseFloat(slider.value).toFixed(1);
            else if (slider === highlightInputSlider) highlightInputValueDisplay.textContent = slider.value;
            else if (slider === outputBloomSlider) outputBloomValueDisplay.textContent = toBloomDisplayValue(slider.value);
            else if (slider === outputExposureSlider && outputExposureValueDisplay) outputExposureValueDisplay.textContent = slider.value;
        }
        isDragging = false;
        hasMovedHorizontally = false;
    }, { passive: true });
}

function addSettingsChangeListener(element, eventType = 'input') {
    element.addEventListener(eventType, () => {
        clearCachedSequence();
        if (element === previewChangesToggle) {
            const isMobile = window.innerWidth <= 768;
            isPreviewChangesActive = !isMobile && element.checked;
            updateInputCanvasPreview();
        } else {
            if (element === contrastSlider) contrastValueDisplay.textContent = element.value;
            else if (element === levelsSlider) levelsValueDisplay.textContent = element.value;
            else if (element === brightnessSlider) brightnessValueDisplay.textContent = element.value;
            else if (element === shadowInputSlider) shadowInputValueDisplay.textContent = element.value;
            else if (element === midtoneGammaSlider) midtoneGammaValueDisplay.textContent = parseFloat(element.value).toFixed(1);
            else if (element === highlightInputSlider) highlightInputValueDisplay.textContent = element.value;
            else if (element === outputBloomSlider) outputBloomValueDisplay.textContent = toBloomDisplayValue(element.value);
            else if (element === outputExposureSlider) {
                if (outputExposureValueDisplay) outputExposureValueDisplay.textContent = element.value;
                currentOutputExposure = parseInt(element.value) || 0;
            }
            else if (element === charSpacingSlider) charSpacingValueDisplay.textContent = element.value;

            if (typeof syncNumberInputForSlider === 'function') {
                syncNumberInputForSlider(element);
            }

            if (element === densityInput) {
                updateDensity(element.value);
                return;
            }
            else if (element === scaleFactorInput) {
                updateScaleFactor(element.value);
                return;
            }
                            else if (element === characterSetSelect) {
                customCharsContainer.style.display = 'flex';
                
                const isLanguage = ['numbers', 'latin_basic', 'latin', 'cyrillic', 'devanagari', 'thai', 'japanese', 'korean', 'chinese', 'arabic'].includes(element.value);
                customCharsInput.disabled = isLanguage;
                customCharsHelpButton.disabled = isLanguage;
                
                if (element.value === 'binary') {
                    customCharsInput.value = '0,1';
                } else if (element.value === 'custom') {
                    customCharsInput.value = '';
                } else if (element.value.startsWith('preset')) {
                    const presetValues = {
                         'preset1': 'ABC', 'preset2': 'A,B,C', 'preset3': '⦁', 'preset4': '●',
                         'preset5': '⬤', 'preset6': '〇', 'preset7': '■', 'preset8': '█', 'preset9': '▃',
                         'preset10': '⯁', 'preset11': '✖', 'preset12': '✚', 'preset13': '╋', 'preset14': '⧸,⧹'
                     };
                    customCharsInput.value = presetValues[element.value] || '';
                } else if (isLanguage) {
                    customCharsInput.value = '';
                }
            }

            else if (element === colorSchemeSelect) {
                syncCustomColorsWithPreset(element.value);
            }
            else if (element === chromaRemovalToggle) {
                isChromaRemovalActive = element.checked;
            }
            else if (element === invertColorsToggle) isInvertColorsActive = element.checked;
            else if (element === exportTransparentToggle) {
                isBgColorTransparent = element.checked;
                updateTransparentBgUI();
            }

            processImageWithCurrentSettings();
            if (element !== previewChangesToggle) {
                 updateInputCanvasPreview();
            }
            
            // Use debounced history saving for sliders to avoid excessive entries
            if (element.tagName === 'INPUT' && element.type === 'range') {
                debouncedSaveSliderToHistory();
            } else if (element.tagName === 'INPUT' && element.type === 'number') {
                // For number inputs, save history immediately since they don't fire continuously
                enableHistoryAfterUserChange();
                setTimeout(() => saveActionToHistory(), 100);
            } else {
                enableHistoryAfterUserChange();
                setTimeout(() => saveActionToHistory(), 100);
            }
        }
    });
}

addSettingsChangeListener(previewChangesToggle, 'change');
addSettingsChangeListener(chromaRemovalToggle, 'change');
addSettingsChangeListener(invertColorsToggle, 'change');
if (exportTransparentToggle) addSettingsChangeListener(exportTransparentToggle, 'change');
addSettingsChangeListener(contrastSlider);
addSettingsChangeListener(levelsSlider);
addSettingsChangeListener(brightnessSlider);
addSettingsChangeListener(shadowInputSlider);
addSettingsChangeListener(midtoneGammaSlider);
addSettingsChangeListener(highlightInputSlider);
addSettingsChangeListener(outputBloomSlider);
if (outputExposureSlider) addSettingsChangeListener(outputExposureSlider);
addSettingsChangeListener(charSpacingSlider);
addMobileTouchHandling(contrastSlider);
addMobileTouchHandling(levelsSlider);
addMobileTouchHandling(brightnessSlider);
addMobileTouchHandling(shadowInputSlider);
addMobileTouchHandling(midtoneGammaSlider);
addMobileTouchHandling(highlightInputSlider);
addMobileTouchHandling(outputBloomSlider);
if (outputExposureSlider) addMobileTouchHandling(outputExposureSlider);
addMobileTouchHandling(charSpacingSlider);

function syncNumberInputForSlider(slider) {
    if (!slider) return;
    let input = null;
    let isFloat = false;
    let isBloom = false;

    if (slider === levelsSlider) input = document.getElementById('levelsNumberInput');
    else if (slider === brightnessSlider) input = document.getElementById('brightnessNumberInput');
    else if (slider === contrastSlider) input = document.getElementById('contrastNumberInput');
    else if (slider === shadowInputSlider) input = document.getElementById('shadowNumberInput');
    else if (slider === midtoneGammaSlider) { input = document.getElementById('midtoneNumberInput'); isFloat = true; }
    else if (slider === highlightInputSlider) input = document.getElementById('highlightNumberInput');
    else if (slider === charSpacingSlider) input = document.getElementById('charSpacingNumberInput');
    else if (slider === outputBloomSlider) { input = document.getElementById('outputBloomNumberInput'); isBloom = true; }
    else if (slider === outputExposureSlider) input = document.getElementById('outputExposureNumberInput');

    if (input && document.activeElement !== input) {
        if (isBloom) {
            input.value = toBloomDisplayValue(slider.value);
        } else if (isFloat) {
            input.value = parseFloat(slider.value).toFixed(1);
        } else {
            input.value = slider.value;
        }
    }
}

function syncSliderWithNumberInput(slider, numberInput, options = {}) {
    if (!slider || !numberInput) return;
    const isFloat = options.isFloat || false;
    const isBloom = options.isBloom || false;

    slider.addEventListener('input', () => {
        if (document.activeElement !== numberInput) {
            if (isBloom) {
                numberInput.value = toBloomDisplayValue(slider.value);
            } else if (isFloat) {
                numberInput.value = parseFloat(slider.value).toFixed(1);
            } else {
                numberInput.value = slider.value;
            }
        }
    });

    let debounceTimer = null;
    const applyNumberInputValue = (forceClamp = false) => {
        let raw = numberInput.value.trim();
        if (raw === '' || raw === '-' || raw === '.') return;

        let val = isFloat ? parseFloat(raw) : parseInt(raw, 10);
        if (isNaN(val)) return;

        const min = isBloom ? 0 : (isFloat ? parseFloat(slider.min) : parseInt(slider.min, 10));
        const max = isBloom ? 100 : (isFloat ? parseFloat(slider.max) : parseInt(slider.max, 10));

        if (forceClamp) {
            val = Math.max(min, Math.min(max, val));
            numberInput.value = isFloat ? val.toFixed(1) : val;
        } else {
            if (val > max) val = max;
            if (val < min) return;
        }

        const sliderTargetVal = isBloom ? String(val * 2) : (isFloat ? val.toFixed(1) : String(val));
        if (slider.value !== sliderTargetVal) {
            slider.value = sliderTargetVal;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    numberInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => applyNumberInputValue(false), 200);
    });

    numberInput.addEventListener('change', () => {
        clearTimeout(debounceTimer);
        applyNumberInputValue(true);
    });

    numberInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(debounceTimer);
            applyNumberInputValue(true);
            numberInput.blur();
        }
    });
}

function syncAllNumberInputsFromSliders() {
    const pairs = [
        { slider: levelsSlider, input: document.getElementById('levelsNumberInput') },
        { slider: brightnessSlider, input: document.getElementById('brightnessNumberInput') },
        { slider: contrastSlider, input: document.getElementById('contrastNumberInput') },
        { slider: shadowInputSlider, input: document.getElementById('shadowNumberInput') },
        { slider: midtoneGammaSlider, input: document.getElementById('midtoneNumberInput'), isFloat: true },
        { slider: highlightInputSlider, input: document.getElementById('highlightNumberInput') },
        { slider: charSpacingSlider, input: document.getElementById('charSpacingNumberInput') },
        { slider: outputBloomSlider, input: document.getElementById('outputBloomNumberInput'), isBloom: true },
        { slider: outputExposureSlider, input: document.getElementById('outputExposureNumberInput') }
    ];

    pairs.forEach(({ slider, input, isFloat, isBloom }) => {
        if (slider && input && document.activeElement !== input) {
            if (isBloom) {
                input.value = toBloomDisplayValue(slider.value);
            } else if (isFloat) {
                input.value = parseFloat(slider.value).toFixed(1);
            } else {
                input.value = slider.value;
            }
        }
    });
}

function initSliderNumberInputs() {
    syncSliderWithNumberInput(levelsSlider, document.getElementById('levelsNumberInput'));
    syncSliderWithNumberInput(brightnessSlider, document.getElementById('brightnessNumberInput'));
    syncSliderWithNumberInput(contrastSlider, document.getElementById('contrastNumberInput'));
    syncSliderWithNumberInput(shadowInputSlider, document.getElementById('shadowNumberInput'));
    syncSliderWithNumberInput(midtoneGammaSlider, document.getElementById('midtoneNumberInput'), { isFloat: true });
    syncSliderWithNumberInput(highlightInputSlider, document.getElementById('highlightNumberInput'));
    syncSliderWithNumberInput(charSpacingSlider, document.getElementById('charSpacingNumberInput'));
    syncSliderWithNumberInput(outputBloomSlider, document.getElementById('outputBloomNumberInput'), { isBloom: true });
    if (outputExposureSlider) syncSliderWithNumberInput(outputExposureSlider, document.getElementById('outputExposureNumberInput'));
    syncAllNumberInputsFromSliders();
}

initSliderNumberInputs();
addSettingsChangeListener(densityInput, 'input');
addSettingsChangeListener(scaleFactorInput, 'input');
addSettingsChangeListener(colorSchemeSelect, 'change');
if (gradientMapSelect) addSettingsChangeListener(gradientMapSelect, 'change');
if (prevGradientMapButton) addMobileTouchHandling(prevGradientMapButton, () => prevGradientMapButton.click());
if (nextGradientMapButton) addMobileTouchHandling(nextGradientMapButton, () => nextGradientMapButton.click());
if (gradientMapInvertToggle) addMobileTouchHandling(gradientMapInvertToggle, () => gradientMapInvertToggle.click());
addSettingsChangeListener(fontSelect, 'change');
addSettingsChangeListener(characterSetSelect, 'change');
    addSettingsChangeListener(customCharsInput, 'change');

customCharsInput.addEventListener('input', () => {
    if (characterSetSelect.value !== 'custom') {
        characterSetSelect.value = 'custom';
    }
    clearCachedSequence();
    
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});


addSettingsChangeListener(customTextColor, 'input');
addSettingsChangeListener(customBackgroundColor, 'input');

customTextColor.addEventListener('input', () => {
    if (colorSchemeSelect.value !== 'custom') {
        colorSchemeSelect.value = 'custom';
    }
    if (!window.savedCustomColors) window.savedCustomColors = {};
    window.savedCustomColors.text = customTextColor.value;
});

customBackgroundColor.addEventListener('input', () => {
    if (colorSchemeSelect.value !== 'custom') {
        colorSchemeSelect.value = 'custom';
    }
    if (!window.savedCustomColors) window.savedCustomColors = {};
    window.savedCustomColors.background = customBackgroundColor.value;
});

randomSpacingToggle.addEventListener('click', () => {
    isRandomSpacingActive = !isRandomSpacingActive;
    randomSpacingToggle.style.opacity = isRandomSpacingActive ? '1' : '0.6';
    randomSpacingToggle.style.color = isRandomSpacingActive ? 'var(--primary-text)' : '';
    
    clearCachedSequence();
    processImageWithCurrentSettings();
    updateInputCanvasPreview();
    
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});

transparentBgToggle.addEventListener('click', () => {
    isBgColorTransparent = !isBgColorTransparent;
    updateTransparentBgUI();
    
    clearCachedSequence();
    processImageWithCurrentSettings();
    updateInputCanvasPreview();
    
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});

if (exportTransparentToggle) {
    exportTransparentToggle.addEventListener('change', () => {
        isBgColorTransparent = exportTransparentToggle.checked;
        updateTransparentBgUI();
        
        clearCachedSequence();
        processImageWithCurrentSettings();
        updateInputCanvasPreview();
        
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    });
}

customCharsHelpButton.addEventListener('click', () => {
    alert('Custom Characters:\n\nâ€¢ Using commas randomizes item output (e.g., "A,B,C")\nâ€¢ Using dots flattens items into a sequence (e.g., "ABC.DEF" becomes "ABCDEF")\nâ€¢ Supports all Unicode characters (for unique visual effects)');
});

function updateDensity(newValue) {
    clearCachedSequence();
    let val = parseInt(newValue);
    const min = parseInt(densityInput.min) || 4;
    const max = parseInt(densityInput.max) || 80;
    if (isNaN(val)) val = currentDensity;
    if (val < min) val = min;
    if (val > max) val = max;
    densityInput.value = val;
    if (val !== currentDensity) { 
        currentDensity = val; 
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    }
}
densityDecrement.addEventListener('click', function() { updateDensity(parseInt(densityInput.value) - 1); });
densityIncrement.addEventListener('click', function() { updateDensity(parseInt(densityInput.value) + 1); });

prevFontButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = fontSelect.selectedIndex;
    currentIndex = (currentIndex - 1 + availableFonts.length) % availableFonts.length;
    fontSelect.selectedIndex = currentIndex;
    processImageWithCurrentSettings();
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});
nextFontButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = fontSelect.selectedIndex;
    currentIndex = (currentIndex + 1) % availableFonts.length;
    fontSelect.selectedIndex = currentIndex;
    processImageWithCurrentSettings();
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});
prevCharSetButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = characterSetSelect.selectedIndex;
    currentIndex = (currentIndex - 1 + characterSetSelect.options.length) % characterSetSelect.options.length;
    characterSetSelect.selectedIndex = currentIndex;
    characterSetSelect.dispatchEvent(new Event('change'));
});
nextCharSetButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = characterSetSelect.selectedIndex;
    currentIndex = (currentIndex + 1) % characterSetSelect.options.length;
    characterSetSelect.selectedIndex = currentIndex;
    characterSetSelect.dispatchEvent(new Event('change'));
});


function updateScaleFactor(newValue) {
    clearCachedSequence();
    let val = parseFloat(newValue); const min = parseFloat(scaleFactorInput.min); const max = parseFloat(scaleFactorInput.max);
    if (isNaN(val)) val = currentScaleFactor; if (val < min) val = min; if (val > max) val = max;
    scaleFactorInput.value = val.toFixed(1);
    if (val !== currentScaleFactor) { 
        currentScaleFactor = val; 
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    }
}
scaleFactorDecrement.addEventListener('click', function() { updateScaleFactor(parseFloat(scaleFactorInput.value) - 0.5); });
scaleFactorIncrement.addEventListener('click', function() { updateScaleFactor(parseFloat(scaleFactorInput.value) + 0.5); });

if (prevGradientMapButton && nextGradientMapButton && gradientMapSelect) {
    prevGradientMapButton.addEventListener('click', function() {
        clearCachedSequence();
        let idx = gradientMapSelect.selectedIndex;
        idx = (idx - 1 + gradientMapSelect.options.length) % gradientMapSelect.options.length;
        gradientMapSelect.selectedIndex = idx;
        currentGradientMap = gradientMapSelect.value;
        updateGradientMapPreview();
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    });
    nextGradientMapButton.addEventListener('click', function() {
        clearCachedSequence();
        let idx = gradientMapSelect.selectedIndex;
        idx = (idx + 1) % gradientMapSelect.options.length;
        gradientMapSelect.selectedIndex = idx;
        currentGradientMap = gradientMapSelect.value;
        updateGradientMapPreview();
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    });
    gradientMapSelect.addEventListener('change', function() {
        clearCachedSequence();
        currentGradientMap = gradientMapSelect.value;
        updateGradientMapPreview();
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    });
}
if (gradientMapInvertToggle) {
    gradientMapInvertToggle.addEventListener('click', function() {
        clearCachedSequence();
        isGradientInverted = !isGradientInverted;
        updateGradientMapPreview();
        processImageWithCurrentSettings();
        enableHistoryAfterUserChange();
        setTimeout(() => saveActionToHistory(), 100);
    });
}

prevColorSchemeButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = colorSchemeSelect.selectedIndex;
    currentIndex = (currentIndex - 1 + colorSchemeSelect.options.length) % colorSchemeSelect.options.length;
    colorSchemeSelect.selectedIndex = currentIndex;
    syncCustomColorsWithPreset(colorSchemeSelect.value);
    processImageWithCurrentSettings();
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});
nextColorSchemeButton.addEventListener('click', function() {
    clearCachedSequence();
    let currentIndex = colorSchemeSelect.selectedIndex;
    currentIndex = (currentIndex + 1) % colorSchemeSelect.options.length;
    colorSchemeSelect.selectedIndex = currentIndex;
    syncCustomColorsWithPreset(colorSchemeSelect.value);
    processImageWithCurrentSettings();
    enableHistoryAfterUserChange();
    setTimeout(() => saveActionToHistory(), 100);
});

inputCanvas.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile && isVideoInput && isPreviewChangesActive && inputCanvas.style.display !== 'none') {
        previewChangesToggle.checked = false;
        isPreviewChangesActive = false;
        updateInputCanvasPreview();
        
        if (inputVideo.paused) {
            inputVideo.play();
        }
    }
});

uploadZone.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    uploadZone.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--hover-grey'); 
});
uploadZone.addEventListener('dragleave', () => { 
    uploadZone.style.backgroundColor = 'transparent';
});
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault(); 
    uploadZone.style.backgroundColor = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      handleImageUpload(file);
      condensedUploadZone.style.display = 'inline-block';
      condensedFilename.innerHTML = `<i class="ri-check-line"></i> ${file.name} `;
       if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
    } else { alert('Please drop an image or video file.'); }
});

condensedUploadZone.addEventListener('dragover', (e) => { e.preventDefault(); condensedUploadZone.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--hover-grey'); });
condensedUploadZone.addEventListener('dragleave', () => { condensedUploadZone.style.backgroundColor = 'transparent';});
condensedUploadZone.addEventListener('drop', (e) => {
    e.preventDefault(); condensedUploadZone.style.backgroundColor = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      handleImageUpload(file);
      condensedFilename.innerHTML = `<i class="ri-check-line"></i> ${file.name} `;
      if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
    } else { alert('Please drop an image or video file.'); }
});


function generateRandomHash(length = 8) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += latinBasicChars.charAt(Math.floor(Math.random() * latinBasicChars.length));
    }
    return result;
}

function downloadPng() {
    if (!outputCanvas || !currentBlobMatrix) return;
    const randomHash = generateRandomHash(8);
    const imgData = outputCanvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imgData; link.download = `kojerens_ascii_${randomHash}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}
function getAsciiRampForCharacterSet(charSet, customText) {
    if (charSet === 'binary') {
        return [' ', '0', '1'];
    }
    if (charSet === 'numbers') {
        return [' ', '.', '1', '7', '3', '5', '0', '8', '9'];
    }
    if (charSet === 'preset7' || charSet === 'preset8' || charSet === 'preset9') {
        return [' ', '░', '▒', '▓', '█'];
    }
    if (charSet === 'preset3' || charSet === 'preset4' || charSet === 'preset5' || charSet === 'preset6') {
        return [' ', '·', '°', 'o', 'O', '●', '⬤'];
    }
    if (charSet === 'preset10' || charSet === 'preset11' || charSet === 'preset12' || charSet === 'preset13') {
        return [' ', '.', '+', 'x', '✖', '✚', '╋', '█'];
    }
    if (charSet === 'preset14') {
        return [' ', '·', '⧸', '⧹', '╳', '█'];
    }
    if (charSet === 'custom' && customText) {
        const uniqueChars = [...new Set(customText.replace(/[,.\s]/g, ''))];
        if (uniqueChars.length > 0) {
            return [' ', ...uniqueChars];
        }
    }
    // Classic standard ASCII ramp (10 density levels from empty to full)
    return [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
}

function brightnessToAsciiChar(brightness, ramp, isTransparent) {
    if (isTransparent || brightness <= 0.05) {
        return ' ';
    }
    const norm = Math.max(0, Math.min(1, (brightness - 0.05) / 0.95));
    const index = 1 + Math.floor(norm * (ramp.length - 1));
    return ramp[Math.min(ramp.length - 1, index)];
}

function downloadText() {
    if (!currentBlobMatrix || currentBlobMatrix.length === 0) return;
    const numRows = currentBlobMatrix.length;
    const numCols = currentBlobMatrix[0].length;
    if (numCols === 0) return;

    const charSet = characterSetSelect ? characterSetSelect.value : 'latin_basic';
    const customText = customCharsInput ? customCharsInput.value : '';
    const ramp = getAsciiRampForCharacterSet(charSet, customText);

    // Monospace fonts in text editors have an aspect ratio of ~1:2 (twice as tall as wide).
    // To prevent the text art from looking stretched vertically, sample every 2 rows when height allows.
    const rowStep = numRows >= 16 ? 2 : 1;

    const textLines = [];
    for (let y = 0; y < numRows; y += rowStep) {
        let line = '';
        for (let x = 0; x < numCols; x++) {
            const cell1 = currentBlobMatrix[y] ? currentBlobMatrix[y][x] : null;
            if (!cell1) {
                line += ' ';
                continue;
            }

            let effectiveBrightness = typeof cell1.brightness === 'number' ? cell1.brightness : 0;
            let effectiveTransparent = Boolean(cell1.isTransparent);

            if (rowStep === 2 && y + 1 < numRows && currentBlobMatrix[y + 1] && currentBlobMatrix[y + 1][x]) {
                const cell2 = currentBlobMatrix[y + 1][x];
                const b2 = typeof cell2.brightness === 'number' ? cell2.brightness : 0;
                const t2 = Boolean(cell2.isTransparent);

                if (effectiveTransparent && t2) {
                    effectiveTransparent = true;
                } else if (effectiveTransparent) {
                    effectiveBrightness = b2;
                    effectiveTransparent = false;
                } else if (t2) {
                    effectiveTransparent = false;
                } else {
                    effectiveBrightness = (effectiveBrightness + b2) / 2;
                }
            }

            line += brightnessToAsciiChar(effectiveBrightness, ramp, effectiveTransparent);
        }
        textLines.push(line.trimEnd());
    }

    // Clean up empty leading and trailing lines
    while (textLines.length > 0 && textLines[0].trim() === '') textLines.shift();
    while (textLines.length > 0 && textLines[textLines.length - 1].trim() === '') textLines.pop();

    const textToDownload = textLines.join('\n');
    const randomHash = generateRandomHash(8);
    const blob = new Blob([textToDownload], { type: "text/plain;charset=utf-8" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kojerens_ascii_${randomHash}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function exportSettings() {
    try {
        const currentSnapshot = JSON.parse(getCurrentSettingsSnapshot());
        const exportData = {
            app: "KOJERENS",
            version: "1.0",
            exportedAt: new Date().toISOString(),
            settings: currentSnapshot
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        const randomHash = generateRandomHash(8);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `kojerens_settings_${randomHash}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error exporting settings:", error);
        alert("Failed to export settings: " + error.message);
    }
}

function triggerImportSettings() {
    const importInput = document.getElementById('importSettingsInput');
    if (importInput) {
        importInput.value = '';
        importInput.click();
    }
}

function handleImportSettings(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            const settingsToRestore = (data && data.settings) ? data.settings : data;

            if (typeof settingsToRestore !== 'object' || settingsToRestore === null) {
                throw new Error("Invalid configuration file format.");
            }

            restoreSettingsFromSnapshot(JSON.stringify(settingsToRestore));
            enableHistoryAfterUserChange();
            setTimeout(() => saveActionToHistory(), 100);
        } catch (error) {
            console.error("Error importing settings:", error);
            alert("Failed to import settings: " + error.message);
        } finally {
            if (event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
}

function openNewTab() {
   if (!outputCanvas || !currentBlobMatrix) return;
   
   outputCanvas.toBlob((blob) => {
       if (blob) {
           const blobUrl = URL.createObjectURL(blob);
           const newTab = window.open(blobUrl, '_blank');
           
           newTab.addEventListener('beforeunload', () => {
               URL.revokeObjectURL(blobUrl);
           });
       }
   }, 'image/png');
   }

   function toggleFullscreen() {
       const outputColumn = document.getElementById('outputColumn');

       if (!document.fullscreenElement) {
           // Enter fullscreen
           if (outputColumn.requestFullscreen) {
               outputColumn.requestFullscreen();
           } else if (outputColumn.webkitRequestFullscreen) {
               outputColumn.webkitRequestFullscreen();
           } else if (outputColumn.msRequestFullscreen) {
               outputColumn.msRequestFullscreen();
           }
       } else {
           // Exit fullscreen
           if (document.exitFullscreen) {
               document.exitFullscreen();
           } else if (document.webkitExitFullscreen) {
               document.webkitExitFullscreen();
           } else if (document.msExitFullscreen) {
               document.msExitFullscreen();
           }
       }
   }

   function updateFullscreenButton() {
       const fullscreenButton = document.getElementById('fullscreenButton');
       const icon = fullscreenButton.querySelector('i');

       if (document.fullscreenElement) {
           // Show exit button and add click-anywhere-to-exit
           icon.className = 'ri-fullscreen-exit-line';
           fullscreenButton.innerHTML = '<i class="ri-fullscreen-exit-line"></i> Exit Fullscreen';
           fullscreenButton.disabled = false;
           document.addEventListener('click', exitFullscreenOnClick, true);
       } else {
           // Show enter button and enable/disable based on content
           icon.className = 'ri-fullscreen-line';
           fullscreenButton.innerHTML = '<i class="ri-fullscreen-line"></i> Fullscreen';
           fullscreenButton.disabled = !outputCanvas || !currentBlobMatrix || currentBlobMatrix.length === 0;
           document.removeEventListener('click', exitFullscreenOnClick, true);
       }
   }

   function exitFullscreenOnClick(event) {
       if (document.fullscreenElement) {
           event.stopPropagation();
           event.preventDefault();

           if (document.exitFullscreen) {
               document.exitFullscreen();
           } else if (document.webkitExitFullscreen) {
               document.webkitExitFullscreen();
           } else if (document.msExitFullscreen) {
               document.msExitFullscreen();
           }
       }
   }

function openGitHub() {
    window.open('https://github.com/fanzirfan/blob-track', '_blank');
}

function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

async function loadExampleImage() {
    try {
        loadingSpinner.style.display = 'inline';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
        showUploadSpinner();
        
        let file = null;
        
        // 1. Try local fetch first (works on http://, https://, localhost)
        try {
            const response = await fetch('assets/example-image.jpeg');
            if (response.ok) {
                const blob = await response.blob();
                file = new File([blob], 'example-image.jpeg', { type: 'image/jpeg' });
            }
        } catch (fetchErr) {
            console.log('Local fetch failed, falling back to embedded asset...');
        }
        
        // 2. Fallback to embedded local asset (100% offline / file:/// compatible)
        if (!file && typeof window !== 'undefined' && window.EXAMPLE_IMAGE_BASE64) {
            file = dataURLtoFile(window.EXAMPLE_IMAGE_BASE64, 'example-image.jpeg');
        }
        
        if (!file) {
            throw new Error('Failed to load example-image.jpeg from local assets');
        }
        
        handleImageUpload(file);
        
        setTimeout(() => {
            scaleFactorInput.value = '2.0';
            currentScaleFactor = 2.0;
            processImageWithCurrentSettings();
        }, 100);
        
        condensedUploadZone.style.display = 'inline-block';
        condensedFilename.innerHTML = `<i class="ri-check-line"></i> example-image.jpeg`;
        if (uploadPanelTitle) uploadPanelTitle.style.display = 'block';
    } catch (error) {
        console.error('Error loading example image:', error);
        alert('Failed to load example-image.jpeg. Please try uploading an image manually.');
    } finally {
        loadingSpinner.style.display = 'none';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
        hideUploadSpinner();
    }
}

async function loadExampleVideo() {
    try {
        loadingSpinner.style.display = 'inline';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
        showUploadSpinner();
        
        let file = null;
        
        // 1. Try local fetch first (works on http://, https://, localhost)
        try {
            const response = await fetch('assets/example-video.mp4');
            if (response.ok) {
                const blob = await response.blob();
                file = new File([blob], 'example-video.mp4', { type: 'video/mp4' });
            }
        } catch (fetchErr) {
            console.log('Local fetch failed, falling back to embedded asset...');
        }
        
        // 2. Fallback to embedded local asset (100% offline / file:/// compatible)
        if (!file && typeof window !== 'undefined' && window.EXAMPLE_VIDEO_BASE64) {
            file = dataURLtoFile(window.EXAMPLE_VIDEO_BASE64, 'example-video.mp4');
        }
        
        if (!file) {
            throw new Error('Failed to load example-video.mp4 from local assets');
        }
        
        handleImageUpload(file);
        condensedUploadZone.style.display = 'inline-block';
        condensedFilename.innerHTML = `<i class="ri-check-line"></i> example-video.mp4`;
        if (uploadPanelTitle) uploadPanelTitle.style.display = 'block';
    } catch (error) {
        console.error('Error loading example video:', error);
        alert('Failed to load example-video.mp4. Please try uploading a video manually.');
    } finally {
        loadingSpinner.style.display = 'none';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
        hideUploadSpinner();
    }
}

async function startWebcam() {
    try {
        stopVideoProcessingLoop();
        clearCachedSequence();
        
        loadingSpinner.style.display = 'inline';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'inline';
        setDownloadButtonsState(true);
        downloadPngSequenceButton.style.display = 'none';
        showUploadSpinner();
        hideExampleButtons();
        
        // Request webcam access
        webcamStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false 
        });
        
        isVideoInput = true;
        isWebcamActive = true;
        currentMediaElement = inputVideo;
        
        // Set the stream to the video element
        inputVideo.srcObject = webcamStream;
        inputVideo.src = "";
        inputVideo.controls = false; // Remove controls for webcam
        inputVideo.muted = true; // Keep muted
        
        inputVideo.onloadedmetadata = async () => {
            currentImageOriginalWidth = inputVideo.videoWidth;
            currentImageOriginalHeight = inputVideo.videoHeight;
            customCharSeqIndex = 0;
            
            inputVideo.style.display = 'block';
            inputCanvas.style.display = 'none';
            
            uploadZone.style.display = 'none';
            if(uploadPanelTitle) uploadPanelTitle.style.display = 'block';
            if(condensedUploadZone) condensedUploadZone.style.display = 'inline-block';
            if(condensedFilename) condensedFilename.innerHTML = `<i class="ri-webcam-line"></i> Webcam Active`;
            
            hideExampleButtons();
            
            if(previewChangesContainer) previewChangesContainer.style.display = 'flex';
            
            setDefaultValues(inputVideo.videoWidth);
            
            previewChangesToggle.checked = false;
            isPreviewChangesActive = false;
            previewChangesToggle.disabled = true;
            currentDensity = parseInt(densityInput.value);
            
            if(chromaRemovalContainer) chromaRemovalContainer.style.display = 'flex';
            if(invertColorsContainer) invertColorsContainer.style.display = 'flex';
            
            await processImageWithCurrentSettings();
            loadingSpinner.style.display = 'none';
            if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
            hideUploadSpinner();
            updatePngSequenceButtonState();
            
            initializeHistoryForNewFile();
            
            previewChangesToggle.disabled = true;
            
            // Update button text
            const webcamBtn = document.getElementById('webcamButton');
            if (webcamBtn) {
                webcamBtn.innerHTML = '<i class="ri-webcam-line"></i>Stop Webcam';
            }
            
            // Show record webcam button, hide download sequence button
            if (recordWebcamButton) recordWebcamButton.style.display = '';
            if (downloadPngSequenceButton) downloadPngSequenceButton.style.display = 'none';
            
            if (window.innerWidth <= 768 && mobilePreviewActive) {
                switchMobileView('output');
            } else {
                debouncedUpdateMobilePreview();
            }
            
            // Set up event handlers BEFORE playing
            inputVideo.onplay = () => {
                clearCachedSequence();
                stopVideoProcessingLoop();
                if (previewChangesToggle.checked) {
                    previewChangesToggle.checked = false;
                    isPreviewChangesActive = false;
                    updateInputCanvasPreview();
                }
                previewChangesToggle.disabled = true;
                videoProcessLoopId = requestAnimationFrame(processCurrentFrame);
            };
            
            inputVideo.onpause = () => {
                previewChangesToggle.disabled = false;
                processImageWithCurrentSettings();
            };
            
            // Start the video and processing loop
            await inputVideo.play();
            
            // Manually start the processing loop if play didn't trigger onplay
            if (!videoProcessLoopId) {
                videoProcessLoopId = requestAnimationFrame(processCurrentFrame);
            }
        };
        
    } catch (error) {
        console.error('Error accessing webcam:', error);
        let errorMessage = 'Unable to access webcam. ';
        if (error.name === 'NotAllowedError') {
            errorMessage += 'Permission denied.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No webcam found on your device.';
        } else {
            errorMessage += error.message;
        }
        alert(errorMessage);
        
        isWebcamActive = false;
        loadingSpinner.style.display = 'none';
        if (mobileLoadingSpinner) mobileLoadingSpinner.style.display = 'none';
        hideUploadSpinner();
        showExampleButtons();
    }
}

function stopWebcam() {
    if (webcamStream) {
        // Stop all tracks in the stream
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
    
    if (inputVideo.srcObject) {
        inputVideo.srcObject = null;
    }
    
    isWebcamActive = false;
    isVideoInput = false;
    
    stopVideoProcessingLoop();
    
    // Reset video element
    inputVideo.style.display = 'none';
    inputVideo.pause();
    inputVideo.onloadedmetadata = null;
    inputVideo.onerror = null;
    inputVideo.onplay = null;
    inputVideo.onpause = null;
    inputVideo.src = "";
    inputVideo.controls = true; // Restore controls for video files
    
    // Reset UI
    uploadZone.style.display = 'flex';
    inputCanvas.style.display = 'none';
    if(uploadPanelTitle) uploadPanelTitle.style.display = 'none';
    if(condensedUploadZone) condensedUploadZone.style.display = 'none';
    
    showExampleButtons();
    
    // Clear output
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    const outputPlaceholder = document.getElementById('outputPlaceholder');
    if (outputPlaceholder && !currentMediaElement) {
        outputPlaceholder.classList.remove('hidden');
        outputPlaceholder.style.display = '';
    }
    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport && !currentMediaElement) {
        outputViewport.classList.remove('has-media');
    }
    
    // Update button text
    const webcamBtn = document.getElementById('webcamButton');
    if (webcamBtn) {
        webcamBtn.innerHTML = '<i class="ri-webcam-line"></i>Use Webcam';
    }
    
    // Hide record webcam button
    if (recordWebcamButton) recordWebcamButton.style.display = 'none';
    
    downloadPngSequenceButton.style.display = 'none';
    setDownloadButtonsState(true);
}

function toggleWebcam() {
    if (isWebcamActive) {
        stopWebcam();
    } else {
        startWebcam();
    }
}

function recordWebcam() {
    if (!isWebcamActive || !webcamStream) {
        alert('Please start the webcam first before recording.');
        return;
    }
    
    if (isRecordingWebcam) {
        return; // Already recording
    }
    
    // Open the recording duration modal
    openRecordingDurationModal();
}

async function startRecordingWithDuration(duration) {
    // Close the modal
    closeRecordingDurationModal();
    
    if (!isWebcamActive || !webcamStream) {
        alert('Please start the webcam first before recording.');
        return;
    }
    
    if (isRecordingWebcam) {
        return; // Already recording
    }
    
    try {
        isRecordingWebcam = true;
        recordedChunks = [];
        
        // Reset timer display
        if (recordingTimer) recordingTimer.textContent = `${duration}s`;
        if (recordingText) recordingText.textContent = 'Recording...';
        
        // Show recording overlay
        if (recordingOverlay) {
            recordingOverlay.style.display = 'flex';
        }
        
        // Disable record button during recording
        if (recordWebcamButton) recordWebcamButton.disabled = true;
        
        // Create MediaRecorder
        const options = { mimeType: 'video/webm;codecs=vp9' };
        
        // Fallback to vp8 if vp9 is not supported
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/webm;codecs=vp8';
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'video/webm';
            }
        }
        
        mediaRecorder = new MediaRecorder(webcamStream, options);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            // Create blob from recorded chunks
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const file = new File([blob], 'glyphtrix-webcam-recording.webm', { type: 'video/webm' });
            
            // Show processing message
            if (recordingText) recordingText.textContent = 'Processing...';
            
            // Stop the webcam
            stopWebcam();
            
            // Small delay to show processing message
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Hide recording overlay
            if (recordingOverlay) {
                recordingOverlay.style.display = 'none';
            }
            
            // Load the recorded video as a file
            handleImageUpload(file);
            
            // Update filename display
            setTimeout(() => {
                if (condensedFilename) {
                    condensedFilename.innerHTML = `<i class="ri-check-line"></i> glyphtrix-webcam-recording.webm`;
                }
            }, 100);
            
            // Reset recording state
            isRecordingWebcam = false;
            recordedChunks = [];
            mediaRecorder = null;
            
            // Re-enable record button
            if (recordWebcamButton) recordWebcamButton.disabled = false;
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Countdown timer
        let timeLeft = duration;
        
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (recordingTimer) {
                recordingTimer.textContent = `${timeLeft}s`;
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                
                // Stop recording
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error recording webcam:', error);
        alert('Failed to record webcam: ' + error.message);
        
        isRecordingWebcam = false;
        if (recordingOverlay) recordingOverlay.style.display = 'none';
        if (recordWebcamButton) recordWebcamButton.disabled = false;
        if (recordingText) recordingText.textContent = 'Recording...';
        if (recordingTimer) recordingTimer.textContent = '10s';
    }
}

function hideExampleButtons() {
    const exampleButtonsContainer = document.getElementById('exampleButtonsContainer');
    if (exampleButtonsContainer) {
        exampleButtonsContainer.style.display = 'none';
    }
    
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    if (mobilePreviewContent) {
        const mobileExampleButtons = mobilePreviewContent.querySelector('.example-buttons-container');
        if (mobileExampleButtons) {
            mobileExampleButtons.style.display = 'none';
        }
    }
}

function showExampleButtons() {
    const exampleButtonsContainer = document.getElementById('exampleButtonsContainer');
    if (exampleButtonsContainer) {
        exampleButtonsContainer.style.display = 'flex';
    }
}

function showUploadSpinner() {
    const uploadZone = document.getElementById('uploadZone');
    const uploadSpinner = document.getElementById('uploadSpinner');
    if (uploadZone && uploadSpinner) {
        uploadSpinner.innerHTML = getSpinner(48);
        uploadZone.classList.add('loading');
    }
}

function hideUploadSpinner() {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        uploadZone.classList.remove('loading');
    }
}

function resetUploadState() {
    stopVideoProcessingLoop();
    clearCachedSequence();
    isVideoInput = false;
    currentMediaElement = null;
    originalPixelData = null;
    currentBlobMatrix = null;
    updateFullscreenButton();

    inputVideo.style.display = 'none';
    inputVideo.pause();
    inputVideo.src = "";
    inputCanvas.style.display = 'none';
    uploadZone.style.display = 'flex';
    
    showExampleButtons();
    
    condensedUploadZone.style.display = 'none';
    if(uploadPanelTitle) uploadPanelTitle.style.display = 'none';
    
    outputCanvas.width = 1;
    outputCanvas.height = 1;
    outputCtx.clearRect(0, 0, 1, 1);
    resetCanvasZoom(false);
    
    const outputPlaceholder = document.getElementById('outputPlaceholder');
    if (outputPlaceholder) {
        outputPlaceholder.classList.remove('hidden');
        outputPlaceholder.style.display = '';
    }
    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport) {
        outputViewport.classList.remove('has-media');
    }
    
    if(gridSizeDisplay) gridSizeDisplay.textContent = '-';
    if(outputResolutionDisplay) outputResolutionDisplay.textContent = '-';
    
    setDownloadButtonsState(true);
    updatePngSequenceButtonState();
    
    if(chromaRemovalContainer) chromaRemovalContainer.style.display = 'none';
    if(invertColorsContainer) invertColorsContainer.style.display = 'none';
    if(previewChangesContainer) previewChangesContainer.style.display = 'none';
    
    setDefaultValues();
    
    if (window.innerWidth <= 768 && mobilePreviewActive) {
        debouncedUpdateMobilePreview();
    }
    
    actionHistory = [];
    currentHistoryIndex = -1;
    updateUndoRedoButtons();
    
    if (sliderChangeTimeout) {
        clearTimeout(sliderChangeTimeout);
        sliderChangeTimeout = null;
    }
}

function openInfoModal() {
    document.getElementById('infoModal').style.display = 'flex';
}

function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}



function getVideoMetadata() {
    if (!inputVideo) return {};

    // Calculate optimized output based on current density and scale settings
    const density = parseInt(densityInput.value) || 7;
    const outputCols = Math.ceil(inputVideo.videoWidth / density);
    const outputRows = Math.ceil(inputVideo.videoHeight / density);
    const scaleFactor = parseFloat(scaleFactorInput.value) || 1;
    const charSize = 8 * scaleFactor;
    const outputWidth = outputCols * charSize;
    const outputHeight = outputRows * charSize;

    return {
        duration: inputVideo.duration ? formatDuration(inputVideo.duration) : 'Unknown',
        outputResolution: `${Math.round(outputWidth)} x ${Math.round(outputHeight)}`
    };
}

function calculateEstimatedFrames(fps) {
    if (!inputVideo || !inputVideo.duration) return 0;
    return Math.floor(inputVideo.duration * fps);
}

function populateVideoMetadata() {
    const metadataContainer = document.getElementById('videoMetadata');
    if (!metadataContainer) return;

    const metadata = getVideoMetadata();
    
    metadataContainer.innerHTML = `
        <div class="metadata-grid">
            <div class="metadata-item">
                <span class="metadata-label">Duration</span>
                <span class="metadata-value">${metadata.duration}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Resolution
                    <span style="display: inline-flex; gap: 6px; margin-left: 8px;">
                        <button class="btn-base" id="modalScaleDecrement" style="padding: 2px 6px;">-</button>
                        <button class="btn-base" id="modalScaleIncrement" style="padding: 2px 6px;">+</button>
                    </span>
                </span>
                <span class="metadata-value"><span id="modalResolutionValue">${metadata.outputResolution}</span></span>
            </div>
        </div>
    `;

    const modalScaleDecrement = document.getElementById('modalScaleDecrement');
    const modalScaleIncrement = document.getElementById('modalScaleIncrement');
    if (modalScaleDecrement) {
        modalScaleDecrement.addEventListener('click', (e) => {
            e.stopPropagation();
            updateScaleFactor(parseFloat(scaleFactorInput.value) - 0.5);
            populateVideoMetadata();
        });
    }
    if (modalScaleIncrement) {
        modalScaleIncrement.addEventListener('click', (e) => {
            e.stopPropagation();
            updateScaleFactor(parseFloat(scaleFactorInput.value) + 0.5);
            populateVideoMetadata();
        });
    }
}

function populateFpsOptions() {
    const fpsOptionsGrid = document.getElementById('fpsOptionsGrid');
    if (!fpsOptionsGrid) return;

    const fpsOptions = [
        { fps: 1, label: '1 FPS' },
        { fps: 2, label: '2 FPS' },
        { fps: 5, label: '5 FPS' },
        { fps: 24, label: '24 FPS' },
        { fps: 25, label: '25 FPS' },
        { fps: 30, label: '30 FPS' },
        { fps: 60, label: '60 FPS' },
        { fps: 120, label: '120 FPS' }
    ];

    fpsOptionsGrid.innerHTML = '';

    fpsOptions.forEach(option => {
        const estimatedFrames = calculateEstimatedFrames(option.fps);
        
        const button = document.createElement('button');
        button.className = 'fps-option-button';
        button.onclick = () => downloadPngSequenceWithFps(option.fps);

        button.innerHTML = `
            <div class="fps-number"><i class="ri-download-2-line"></i> ${option.label}</div>
            <div class="fps-description">${estimatedFrames.toLocaleString()} frames</div>
        `;

        fpsOptionsGrid.appendChild(button);
    });
    
    populateVideoMetadata();
}

function openFpsModal() {
    if (!isVideoInput || inputVideo.readyState < inputVideo.HAVE_METADATA || isSequenceRendering) return;
    populateFpsOptions();
    document.getElementById('fpsModal').style.display = 'flex';
}

function closeFpsModal() {
    document.getElementById('fpsModal').style.display = 'none';
}

function openRecordingDurationModal() {
    document.getElementById('recordingDurationModal').style.display = 'flex';
}

function closeRecordingDurationModal() {
    document.getElementById('recordingDurationModal').style.display = 'none';
}

// Close modal
document.addEventListener('click', function(event) {
    const infoModal = document.getElementById('infoModal');
    const fpsModal = document.getElementById('fpsModal');
    const recordingDurationModal = document.getElementById('recordingDurationModal');
    if (event.target === infoModal) {
        closeInfoModal();
    }
    if (event.target === fpsModal) {
        closeFpsModal();
    }
    if (event.target === recordingDurationModal) {
        closeRecordingDurationModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeInfoModal();
        closeFpsModal();
        closeRecordingDurationModal();

        // Exit fullscreen if active
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});

function applyCanvasZoom(newZoom, newPanX, newPanY, animate = false) {
    const MIN_ZOOM = 0.25;
    const MAX_ZOOM = 8.0;

    currentCanvasZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    if (currentCanvasZoom <= 1.0) {
        canvasPanX = 0;
        canvasPanY = 0;
    } else {
        canvasPanX = newPanX;
        canvasPanY = newPanY;
    }

    if (outputCanvas) {
        outputCanvas.style.transition = animate ? 'transform 0.15s ease-out' : 'none';
        outputCanvas.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${currentCanvasZoom})`;
    }

    const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
    if (zoomLevelDisplay) {
        zoomLevelDisplay.textContent = `${Math.round(currentCanvasZoom * 100)}%`;
    }

    const outputViewport = document.getElementById('outputViewport');
    if (outputViewport) {
        outputViewport.classList.toggle('can-pan', currentCanvasZoom > 1.0);
    }
}

function resetCanvasZoom(animate = true) {
    applyCanvasZoom(1.0, 0, 0, animate);
}

function setupCanvasZoom() {
    const outputViewport = document.getElementById('outputViewport');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
    const zoomFitBtn = document.getElementById('zoomFitBtn');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            const step = currentCanvasZoom >= 2 ? 0.5 : 0.25;
            applyCanvasZoom(currentCanvasZoom + step, canvasPanX, canvasPanY, true);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            const step = currentCanvasZoom > 2 ? 0.5 : 0.25;
            applyCanvasZoom(currentCanvasZoom - step, canvasPanX, canvasPanY, true);
        });
    }

    if (zoomLevelDisplay) {
        zoomLevelDisplay.addEventListener('click', () => resetCanvasZoom(true));
    }

    if (zoomFitBtn) {
        zoomFitBtn.addEventListener('click', () => resetCanvasZoom(true));
    }

    if (!outputViewport) return;

    // Mouse wheel zoom centered on cursor
    outputViewport.addEventListener('wheel', (e) => {
        if (!outputCanvas || outputCanvas.width <= 1) return;
        e.preventDefault();

        const zoomFactor = e.deltaY < 0 ? 1.15 : (1 / 1.15);
        const nextZoom = Math.max(0.25, Math.min(8.0, currentCanvasZoom * zoomFactor));
        if (nextZoom === currentCanvasZoom) return;

        const rect = outputViewport.getBoundingClientRect();
        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);

        const zoomRatio = nextZoom / currentCanvasZoom;
        const newPanX = mouseX - (mouseX - canvasPanX) * zoomRatio;
        const newPanY = mouseY - (mouseY - canvasPanY) * zoomRatio;

        applyCanvasZoom(nextZoom, newPanX, newPanY, false);
    }, { passive: false });

    // Drag to pan when zoomed
    outputViewport.addEventListener('mousedown', (e) => {
        if (currentCanvasZoom <= 1.0 || e.button !== 0) return;
        isCanvasPanning = true;
        panStartX = e.clientX - canvasPanX;
        panStartY = e.clientY - canvasPanY;
        outputViewport.classList.add('is-panning');
        if (outputCanvas) outputCanvas.style.transition = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isCanvasPanning) return;
        canvasPanX = e.clientX - panStartX;
        canvasPanY = e.clientY - panStartY;
        if (outputCanvas) {
            outputCanvas.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${currentCanvasZoom})`;
        }
    });

    window.addEventListener('mouseup', () => {
        if (isCanvasPanning) {
            isCanvasPanning = false;
            outputViewport.classList.remove('is-panning');
        }
    });

    // Double click to toggle 100% / 200%
    outputViewport.addEventListener('dblclick', (e) => {
        if (!outputCanvas || outputCanvas.width <= 1) return;
        if (currentCanvasZoom !== 1.0) {
            resetCanvasZoom(true);
        } else {
            const rect = outputViewport.getBoundingClientRect();
            const mouseX = e.clientX - (rect.left + rect.width / 2);
            const mouseY = e.clientY - (rect.top + rect.height / 2);
            applyCanvasZoom(2.0, -mouseX * 0.5, -mouseY * 0.5, true);
        }
    });

    // Touch pan support
    let touchStartX = 0, touchStartY = 0;
    outputViewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && currentCanvasZoom > 1.0) {
            isCanvasPanning = true;
            touchStartX = e.touches[0].clientX - canvasPanX;
            touchStartY = e.touches[0].clientY - canvasPanY;
            if (outputCanvas) outputCanvas.style.transition = 'none';
        }
    }, { passive: true });

    outputViewport.addEventListener('touchmove', (e) => {
        if (isCanvasPanning && e.touches.length === 1) {
            canvasPanX = e.touches[0].clientX - touchStartX;
            canvasPanY = e.touches[0].clientY - touchStartY;
            if (outputCanvas) {
                outputCanvas.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${currentCanvasZoom})`;
            }
        }
    }, { passive: true });

    outputViewport.addEventListener('touchend', () => {
        isCanvasPanning = false;
    }, { passive: true });
}

function layoutPanels() {
    const isMobile = window.innerWidth <= 768;
    const isMediumScreen = window.innerWidth >= 769 && window.innerWidth <= 2000;
    const isDesktop = window.innerWidth >= 2001;
    
    desktopSettingsPanelContainer.style.display = isMobile ? 'none' : 'flex';
    mobileUploadPanelPlaceholder.style.display = isMobile ? 'flex' : 'none';
    mobileSettingsPanel.style.display = isMobile ? 'flex' : 'none';
    mobileDownloadPanelPlaceholder.style.display = isMobile ? 'flex' : 'none';

    if (isMobile) {
        if (uploadPanelContent.parentNode !== mobileUploadPanelPlaceholder) mobileUploadPanelPlaceholder.appendChild(uploadPanelContent);
        if (settingsTitleSection.parentNode !== mobileSettingsPanel) mobileSettingsPanel.appendChild(settingsTitleSection);
        if (imageSettingsContent.parentNode !== mobileSettingsPanel) mobileSettingsPanel.appendChild(imageSettingsContent);
        if (fontSettingsContent.parentNode !== mobileSettingsPanel) mobileSettingsPanel.appendChild(fontSettingsContent);
        if (outputSettingsContent.parentNode !== mobileSettingsPanel) mobileSettingsPanel.appendChild(outputSettingsContent);
        if (downloadPanelContent.parentNode !== mobileDownloadPanelPlaceholder) mobileDownloadPanelPlaceholder.appendChild(downloadPanelContent);
        
        // Let CSS handle mobile layout
        mainContainer.style.height = '';
    } else {
        desktopSettingsPanelContainer.appendChild(uploadPanelContent);
        desktopSettingsPanelContainer.appendChild(settingsTitleSection);
        desktopSettingsPanelContainer.appendChild(imageSettingsContent);
        desktopSettingsPanelContainer.appendChild(fontSettingsContent);
        desktopSettingsPanelContainer.appendChild(outputSettingsContent);
        desktopSettingsPanelContainer.appendChild(downloadPanelContent);
        
        mainContainer.style.height = '';
        mainContainer.style.maxHeight = '';
    }
}




let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                destroyMobilePreview();
            }
            
        layoutPanels();
            
            if (window.innerWidth <= 768) {
                initMobilePreview();
            }
            
        if (currentMediaElement || originalPixelData) {
            setTimeout(() => {
                processImageWithCurrentSettings();
                if (!isVideoInput) updateInputCanvasPreview();
            }, 100);
        }
    }, 300);
});

function scrambleText(element, originalText, duration = 250) {
    if (element.dataset.scrambling === 'true') return;
    
    element.dataset.scrambling = 'true';
    element.classList.add('scrambling');
    
    const uniqueChars = [...new Set(originalText.split(''))].filter(char => char !== ' ');
    const steps = 8;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const scrambleInterval = setInterval(() => {
        if (currentStep < steps * 0.6) {
            const scrambled = originalText.split('').map((char, index) => {
                if (char === ' ') return ' ';
                if (Math.random() < 0.4) {
                    return uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
                }
                return char;
            }).join('');
            element.textContent = scrambled;
        } else {
            const progress = (currentStep - steps * 0.6) / (steps * 0.4);
            const restored = originalText.split('').map((char, index) => {
                if (char === ' ') return ' ';
                if (Math.random() < progress * 0.8) {
                    return char;
                }
                return uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
            }).join('');
            element.textContent = restored;
        }
        
        currentStep++;
        
        if (currentStep >= steps) {
            clearInterval(scrambleInterval);
            element.textContent = originalText;
            element.classList.remove('scrambling');
            element.dataset.scrambling = 'false';
        }
    }, stepDuration);
}

// Mobile preview panel functionality
let mobilePreviewActive = false;
let currentMobileView = 'input';

function initMobilePreview() {
    if (window.innerWidth > 768) return;
    
    const mobilePreviewPanel = document.getElementById('mobilePreviewPanel');
    const mobilePreviewSpacer = document.getElementById('mobilePreviewSpacer');
    const mobileInputToggle = document.getElementById('mobileInputToggle');
    const mobileOutputToggle = document.getElementById('mobileOutputToggle');
    const inputColumn = document.getElementById('inputColumn');
    const outputColumn = document.getElementById('outputColumn');
    
    if (!mobilePreviewPanel || !mobilePreviewSpacer) return;
    
    // Activate mobile preview by default
    mobilePreviewPanel.classList.add('active');
    mobilePreviewSpacer.classList.add('active');
    mobilePreviewActive = true;
    
    if (inputColumn) inputColumn.style.display = 'none';
    if (outputColumn) outputColumn.style.display = 'none';
    
    if (mobileInputToggle) {
        mobileInputToggle.addEventListener('click', () => switchMobileView('input'));
    }
    if (mobileOutputToggle) {
        mobileOutputToggle.addEventListener('click', () => switchMobileView('output'));
    }
    
    if (currentMediaElement) {
        currentMobileView = 'output';
        if (mobileInputToggle) mobileInputToggle.classList.remove('active');
        if (mobileOutputToggle) mobileOutputToggle.classList.add('active');
    } else {
        currentMobileView = 'input';
        if (mobileInputToggle) mobileInputToggle.classList.add('active');
        if (mobileOutputToggle) mobileOutputToggle.classList.remove('active');
    }
    
    updateMobilePreviewContent();
}

function switchMobileView(view) {
    if (currentMobileView === view) return;
    
    currentMobileView = view;
    
    const mobileInputToggle = document.getElementById('mobileInputToggle');
    const mobileOutputToggle = document.getElementById('mobileOutputToggle');
    
    if (mobileInputToggle && mobileOutputToggle) {
        mobileInputToggle.classList.toggle('active', view === 'input');
        mobileOutputToggle.classList.toggle('active', view === 'output');
    }
    
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    if (mobilePreviewContent) {
        mobilePreviewContent.innerHTML = '';
    }
    updateMobilePreviewContent();
}

let mobilePreviewUpdateTimeout;
function debouncedUpdateMobilePreview() {
    clearTimeout(mobilePreviewUpdateTimeout);
    mobilePreviewUpdateTimeout = setTimeout(() => {
        if (window.innerWidth <= 768 && mobilePreviewActive) {
            updateMobilePreviewContent();
        }
    }, 50);
}

function forceUpdateMobileOutputCanvas() {
    if (window.innerWidth <= 768 && mobilePreviewActive && currentMobileView === 'output') {
        const mobilePreviewContent = document.getElementById('mobilePreviewContent');
        if (mobilePreviewContent) {
            const existingContent = mobilePreviewContent.firstElementChild;
            if (existingContent && existingContent.tagName === 'CANVAS') {
                const outputCanvas = document.getElementById('outputCanvas');
                if (outputCanvas && currentBlobMatrix && currentBlobMatrix.length > 0) {
                    if (existingContent.width !== outputCanvas.width || existingContent.height !== outputCanvas.height) {
                        existingContent.width = outputCanvas.width;
                        existingContent.height = outputCanvas.height;
                    }
                    existingContent.classList.toggle('transparent-bg', isBgColorTransparent);
                    const ctx = existingContent.getContext('2d');
                    ctx.clearRect(0, 0, existingContent.width, existingContent.height);
                    ctx.drawImage(outputCanvas, 0, 0);
                }
            }
        }
    }
}

function syncMobileVideoTime() {
    if (!mobilePreviewActive || window.innerWidth > 768 || currentMobileView !== 'input' || !isVideoInput) return;
    
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    if (!mobilePreviewContent) return;
    
    const existingContent = mobilePreviewContent.firstElementChild;
    if (existingContent && existingContent.tagName === 'VIDEO') {
        const inputVideo = document.getElementById('inputVideo');
        if (inputVideo && Math.abs(existingContent.currentTime - inputVideo.currentTime) > 0.1) {
            existingContent.currentTime = inputVideo.currentTime;
        }
    }
}

// Track the current mobile video clone globally
window.currentMobileVideoClone = null;
window.currentMobileVideoCloneSeekedHandler = null;
window.inputVideoSeekedHandler = null;

function updateMobilePreviewContent() {
    if (!mobilePreviewActive || window.innerWidth > 768) return;
    
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    if (!mobilePreviewContent) return;
    
    // Check if content already exists and is the correct type
    const existingContent = mobilePreviewContent.firstElementChild;
    const shouldUpdate = !existingContent || 
        (currentMobileView === 'input' && existingContent.tagName !== 'VIDEO' && existingContent.tagName !== 'CANVAS' && existingContent.id !== 'mobileUploadZone') ||
        (currentMobileView === 'output' && existingContent.tagName !== 'CANVAS' && !existingContent.style.cssText.includes('placeholder'));
    
    if (!shouldUpdate) {
        if (currentMobileView === 'input' && isVideoInput && existingContent.tagName === 'VIDEO') {
            syncMobileVideoTime();
        } else if (currentMobileView === 'output' && existingContent.tagName === 'CANVAS') {
            const outputCanvas = document.getElementById('outputCanvas');
            if (outputCanvas && currentBlobMatrix && currentBlobMatrix.length > 0) {
                if (existingContent.width !== outputCanvas.width || existingContent.height !== outputCanvas.height) {
                    existingContent.width = outputCanvas.width;
                    existingContent.height = outputCanvas.height;
                }
                existingContent.classList.toggle('transparent-bg', isBgColorTransparent);
                const ctx = existingContent.getContext('2d');
                ctx.clearRect(0, 0, existingContent.width, existingContent.height);
                ctx.drawImage(outputCanvas, 0, 0);
            }
        }
        return;
    }
    
    mobilePreviewContent.innerHTML = '';
    
    if (window.currentMobileVideoClone && window.currentMobileVideoCloneSeekedHandler) {
        window.currentMobileVideoClone.removeEventListener('seeked', window.currentMobileVideoCloneSeekedHandler);
        window.currentMobileVideoClone = null;
        window.currentMobileVideoCloneSeekedHandler = null;
    }
    if (window.inputVideoSeekedHandler && document.getElementById('inputVideo')) {
        document.getElementById('inputVideo').removeEventListener('seeked', window.inputVideoSeekedHandler);
        window.inputVideoSeekedHandler = null;
    }

    if (currentMobileView === 'input') {
        const inputCanvas = document.getElementById('inputCanvas');
        const inputVideo = document.getElementById('inputVideo');
        const uploadZone = document.getElementById('uploadZone');
        
        if (isVideoInput && inputVideo && inputVideo.style.display !== 'none') {
            const videoClone = inputVideo.cloneNode(true);
            videoClone.id = 'mobilePreviewVideo';
            videoClone.currentTime = inputVideo.currentTime;
            
            const videoCloneSeekedHandler = () => {
                if (Math.abs(inputVideo.currentTime - videoClone.currentTime) > 0.1) {
                    inputVideo.currentTime = videoClone.currentTime;
                    const seekedEvent = new Event('seeked');
                    inputVideo.dispatchEvent(seekedEvent);
                }
            };
            videoClone.addEventListener('seeked', videoCloneSeekedHandler);
            window.currentMobileVideoClone = videoClone;
            window.currentMobileVideoCloneSeekedHandler = videoCloneSeekedHandler;

            const inputVideoSeekedHandler = () => {
                if (Math.abs(videoClone.currentTime - inputVideo.currentTime) > 0.1) {
                    videoClone.currentTime = inputVideo.currentTime;
                }
            };
            inputVideo.addEventListener('seeked', inputVideoSeekedHandler);
            window.inputVideoSeekedHandler = inputVideoSeekedHandler;

            mobilePreviewContent.appendChild(videoClone);
        } else if (inputCanvas && inputCanvas.style.display !== 'none' && currentMediaElement) {
            const canvasClone = document.createElement('canvas');
            canvasClone.width = inputCanvas.width;
            canvasClone.height = inputCanvas.height;
            const ctx = canvasClone.getContext('2d');
            ctx.drawImage(inputCanvas, 0, 0);
            mobilePreviewContent.appendChild(canvasClone);
        } else if (uploadZone) {
            const uploadClone = uploadZone.cloneNode(true);
            uploadClone.id = 'mobileUploadZone';
            uploadClone.addEventListener('click', (e) => {
                if (e.target.closest('.example-buttons-container')) {
                    return;
                }
                document.getElementById('imageUpload').click();
            });
            mobilePreviewContent.appendChild(uploadClone);

        }
    } else {
        const outputCanvas = document.getElementById('outputCanvas');
        if (outputCanvas && currentBlobMatrix && currentBlobMatrix.length > 0) {
            const canvasClone = document.createElement('canvas');
            canvasClone.width = outputCanvas.width;
            canvasClone.height = outputCanvas.height;
            const ctx = canvasClone.getContext('2d');
            ctx.drawImage(outputCanvas, 0, 0);
            canvasClone.classList.toggle('transparent-bg', isBgColorTransparent);
            mobilePreviewContent.appendChild(canvasClone);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'mobile-output-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-icon-wrap" style="width: 40px; height: 40px; font-size: 18px; margin-bottom: 4px;">
                    <i class="ri-terminal-box-line"></i>
                </div>
                <span class="placeholder-title" style="font-size: 10px;">NO STREAM ACTIVE</span>
                <span class="placeholder-desc" style="font-size: 10px; max-width: 220px;">Switch to "Input" to upload media or connect webcam</span>
            `;
            mobilePreviewContent.appendChild(placeholder);
        }
    }
}

function showDesktopLayout() {
    const inputColumn = document.getElementById('inputColumn');
    const outputColumn = document.getElementById('outputColumn');
    
    if (inputColumn) inputColumn.style.display = 'flex';
    if (outputColumn) outputColumn.style.display = 'flex';
}

function hideMobilePreview() {
    const mobilePreviewPanel = document.getElementById('mobilePreviewPanel');
    const mobilePreviewSpacer = document.getElementById('mobilePreviewSpacer');
    
    if (mobilePreviewPanel) mobilePreviewPanel.classList.remove('active');
    if (mobilePreviewSpacer) mobilePreviewSpacer.classList.remove('active');
}

function destroyMobilePreview() {
    const mobilePreviewPanel = document.getElementById('mobilePreviewPanel');
    const mobilePreviewSpacer = document.getElementById('mobilePreviewSpacer');
    const mobilePreviewContent = document.getElementById('mobilePreviewContent');
    
    if (mobilePreviewContent) {
        mobilePreviewContent.innerHTML = '';
    }
    
    const mobileInputToggle = document.getElementById('mobileInputToggle');
    const mobileOutputToggle = document.getElementById('mobileOutputToggle');
    
    if (currentMediaElement) {
        currentMobileView = 'output';
        if (mobileInputToggle) mobileInputToggle.classList.remove('active');
        if (mobileOutputToggle) mobileOutputToggle.classList.add('active');
    } else {
        currentMobileView = 'input';
        if (mobileInputToggle) mobileInputToggle.classList.add('active');
        if (mobileOutputToggle) mobileOutputToggle.classList.remove('active');
    }
    
    hideMobilePreview();
    showDesktopLayout();
    
    mobilePreviewActive = false;
}

document.addEventListener('DOMContentLoaded', () => {
    populateGradientMapOptions();
    loadingSpinner.innerHTML = getSpinner(24);
    if (mobileLoadingSpinner) mobileLoadingSpinner.innerHTML = getSpinner(24);
    const sequenceSpinner = document.getElementById('sequenceLoadingSpinner');
    if (sequenceSpinner) sequenceSpinner.innerHTML = getSpinner(64);
    
    availableFonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.cssName;
        option.textContent = font.name;
        fontSelect.appendChild(option);
    });
    setDefaultValues();
    if(uploadPanelTitle) uploadPanelTitle.style.display = 'none';
    layoutPanels();
    updatePngSequenceButtonState();
    setupCanvasZoom();
    
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');
    if (undoButton) undoButton.addEventListener('click', undoAction);
    if (redoButton) redoButton.addEventListener('click', redoAction);
    
    // Reset to Default
    const resetToDefaultText = document.getElementById('resetToDefaultText');
    if (resetToDefaultText) {
        resetToDefaultText.addEventListener('click', () => {
            setDefaultValues();
            
            processImageWithCurrentSettings();
            if (!isVideoInput) updateInputCanvasPreview();
            
            saveActionToHistory();
        });
    }

    // Reset Glyph to Default
    const resetGlyphToDefaultText = document.getElementById('resetGlyphToDefaultText');
    if (resetGlyphToDefaultText) {
        resetGlyphToDefaultText.addEventListener('click', () => {
            resetGlyphSettingsToDefault();
        });
    }

    // Fullscreen event listeners
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('mozfullscreenchange', updateFullscreenButton);
    document.addEventListener('MSFullscreenChange', updateFullscreenButton);

    updateUndoRedoButtons();
    
    setTimeout(() => {
        if (window.innerWidth <= 768) {
            initMobilePreview();
        } else {
            showDesktopLayout();
        }
    }, 100);
    
    if (colorSchemeSelect) colorSchemeSelect.value = 'color1';
    syncCustomColorsWithPreset('color1');
    

    const glyphtrixLogo = document.getElementById('glyphtrixLogo');
    if (glyphtrixLogo) {
        glyphtrixLogo.addEventListener('mouseenter', () => {
            scrambleText(glyphtrixLogo, 'KOJERENS');
        });
        glyphtrixLogo.addEventListener('click', () => {
            location.reload();
        });
    }
    
    if (window.innerWidth > 768) {
        showDesktopLayout();
    }
});
inputCanvas.style.display = 'none';

// Glyph Randomizer
function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function randomizeCustomColors() {
    const originalSliderTimeout = sliderChangeTimeout;
    if (sliderChangeTimeout) {
        clearTimeout(sliderChangeTimeout);
        sliderChangeTimeout = null;
    }

    const wasFileJustLoaded = isFileJustLoaded;
    isFileJustLoaded = true;

    if (colorSchemeSelect) {
        colorSchemeSelect.selectedIndex = Math.floor(Math.random() * colorSchemeSelect.options.length);
        syncCustomColorsWithPreset(colorSchemeSelect.value);
    }
    if (colorSchemeSelect && colorSchemeSelect.value === 'custom' && customTextColor && customBackgroundColor) {
        const newTextColor = getRandomColor();
        const newBackgroundColor = getRandomColor();
        customTextColor.value = newTextColor;
        customBackgroundColor.value = newBackgroundColor;
        if (!window.savedCustomColors) window.savedCustomColors = {};
        window.savedCustomColors.text = newTextColor;
        window.savedCustomColors.background = newBackgroundColor;
    }
    if (colorSchemeSelect && colorSchemeSelect.value === 'gradient' && gradientMapSelect) {
        gradientMapSelect.selectedIndex = Math.floor(Math.random() * gradientMapSelect.options.length);
        currentGradientMap = gradientMapSelect.value;
        updateGradientMapPreview();
    }

    processImageWithCurrentSettings();
    if (!isVideoInput) updateInputCanvasPreview();

    setTimeout(() => {
        isFileJustLoaded = wasFileJustLoaded;
        enableHistoryAfterUserChange();
        saveActionToHistory();
    }, 100);
}

function randomizeGlyphSettings() {
    // Temporarily disable automatic history saving to prevent multiple entries
    const originalSliderTimeout = sliderChangeTimeout;
    if (sliderChangeTimeout) {
        clearTimeout(sliderChangeTimeout);
        sliderChangeTimeout = null;
    }
    
    const wasFileJustLoaded = isFileJustLoaded;
    isFileJustLoaded = true;
    
    const charSetSelect = document.getElementById('characterSetSelect');
    if (charSetSelect) {
        charSetSelect.selectedIndex = getRandomIndex(charSetSelect.options.length);
        
        customCharsContainer.style.display = 'flex';
        const isLanguage = ['numbers', 'latin_basic', 'latin', 'cyrillic', 'devanagari', 'thai', 'japanese', 'korean', 'chinese', 'arabic'].includes(charSetSelect.value);
        customCharsInput.disabled = isLanguage;
        customCharsHelpButton.disabled = isLanguage;
        
        if (charSetSelect.value === 'binary') {
            customCharsInput.value = '0,1';
        } else if (charSetSelect.value === 'custom') {
            customCharsInput.value = '';
        } else if (charSetSelect.value.startsWith('preset')) {
            const presetValues = {
                 'preset1': 'ABC', 'preset2': 'A,B,C', 'preset3': '⦁', 'preset4': '●',
                         'preset5': '⬤', 'preset6': '〇', 'preset7': '■', 'preset8': '█', 'preset9': '▃',
                         'preset10': '⯁', 'preset11': '✖', 'preset12': '✚', 'preset13': '╋', 'preset14': '⧸,⧹'
             };
            customCharsInput.value = presetValues[charSetSelect.value] || '';
        } else if (isLanguage) {
            customCharsInput.value = '';
        }
    }
    
    const fontSelect = document.getElementById('fontSelect');
    if (fontSelect) {
        fontSelect.selectedIndex = getRandomIndex(fontSelect.options.length);
    }
    
    const colorSchemeSelect = document.getElementById('colorSchemeSelect');
    if (colorSchemeSelect) {
        colorSchemeSelect.selectedIndex = getRandomIndex(colorSchemeSelect.options.length);
        syncCustomColorsWithPreset(colorSchemeSelect.value);
        if (colorSchemeSelect.value === 'custom') {
            const customTextColor = document.getElementById('customTextColor');
            const customBackgroundColor = document.getElementById('customBackgroundColor');
            if (customTextColor && customBackgroundColor) {
                customTextColor.value = getRandomColor();
                customBackgroundColor.value = getRandomColor();
            }
        }
    }
    
    // Randomize spacing
    if (charSpacingSlider) {
        const randomSpacing = Math.floor(Math.random() * 151) - 100; // Range: -100 to 50
        charSpacingSlider.value = randomSpacing;
        charSpacingValueDisplay.textContent = randomSpacing;
        if (typeof syncAllNumberInputsFromSliders === 'function') {
            syncAllNumberInputsFromSliders();
        }
    }
    
    processImageWithCurrentSettings();
    if (!isVideoInput) updateInputCanvasPreview();
    
    // Re-enable history and save the complete randomized state
    setTimeout(() => {
        isFileJustLoaded = wasFileJustLoaded;
        enableHistoryAfterUserChange();
        saveActionToHistory();
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    const glyphRandomizeButton = document.getElementById('glyphRandomizeButton');
    if (glyphRandomizeButton) {
        glyphRandomizeButton.addEventListener('click', function() {
            randomizeGlyphSettings();
            glyphRandomizeButton.classList.remove('dice-animate');
            void glyphRandomizeButton.offsetWidth;
            glyphRandomizeButton.classList.add('dice-animate');
        });
        glyphRandomizeButton.addEventListener('animationend', function() {
            glyphRandomizeButton.classList.remove('dice-animate');
        });
    }

    const customColorsRandomizeButton = document.getElementById('customColorsRandomizeButton');
    if (customColorsRandomizeButton) {
        customColorsRandomizeButton.addEventListener('click', function() {
            randomizeCustomColors();
            customColorsRandomizeButton.classList.remove('dice-animate');
            void customColorsRandomizeButton.offsetWidth;
            customColorsRandomizeButton.classList.add('dice-animate');
        });
        customColorsRandomizeButton.addEventListener('animationend', function() {
            customColorsRandomizeButton.classList.remove('dice-animate');
        });
    }
    
    const textDirectionToggle = document.getElementById('textDirectionToggle');
    if (textDirectionToggle) {
        textDirectionToggle.addEventListener('click', function() {
            isVerticalTextMode = !isVerticalTextMode;
            
            // Toggle icon between arrow-right and arrow-down
            if (isVerticalTextMode) {
                textDirectionToggle.classList.remove('ri-arrow-right-line');
                textDirectionToggle.classList.add('ri-arrow-down-line');
                textDirectionToggle.title = 'Toggle text direction (vertical)';
            } else {
                textDirectionToggle.classList.remove('ri-arrow-down-line');
                textDirectionToggle.classList.add('ri-arrow-right-line');
                textDirectionToggle.title = 'Toggle text direction (horizontal)';
            }
            
            // Clear cached sequence when direction changes
            clearCachedSequence();
            
            // Reprocess the image with new direction
            processImageWithCurrentSettings();
            
            // Save to history
            enableHistoryAfterUserChange();
            setTimeout(() => saveActionToHistory(), 100);
        });
    }
    
});

// ============================================================================
// KOJERENS STUDIO PIPELINE & INTER-TOOL ROUTING
// ============================================================================

function routeToDither() {
    if (!currentMediaElement) {
        if (window.StudioPipeline) StudioPipeline.showToast('Please load an image or video first');
        return;
    }
    const dataUrl = outputCanvas.toDataURL('image/png');
    if (window.StudioPipeline) {
        StudioPipeline.sendImage(dataUrl, '../dither-gen/index.html', '1-Bit Dither');
    } else {
        window.location.href = '../dither-gen/index.html';
    }
}

function routeToTracker() {
    if (!currentMediaElement) {
        if (window.StudioPipeline) StudioPipeline.showToast('Please load an image or video first');
        return;
    }
    const dataUrl = outputCanvas.toDataURL('image/png');
    if (window.StudioPipeline) {
        StudioPipeline.sendImage(dataUrl, '../blob-tracker/index.html', 'Blob Tracker');
    } else {
        window.location.href = '../blob-tracker/index.html';
    }
}

function routeToCrt() {
    if (!currentMediaElement) {
        if (window.StudioPipeline) StudioPipeline.showToast('Please load an image or video first');
        return;
    }
    const dataUrl = outputCanvas.toDataURL('image/png');
    if (window.StudioPipeline) {
        StudioPipeline.sendImage(dataUrl, '../crt-gen/index.html', 'CRT Synthesizer');
    } else {
        window.location.href = '../crt-gen/index.html';
    }
}
window.routeToDither = routeToDither;
window.routeToTracker = routeToTracker;
window.routeToCrt = routeToCrt;

document.addEventListener('DOMContentLoaded', function () {
    const btnTracker = document.getElementById('sendToTrackerBtn');
    if (btnTracker) btnTracker.addEventListener('click', routeToTracker);
    const btnDither = document.getElementById('sendToDitherBtn');
    if (btnDither) btnDither.addEventListener('click', routeToDither);
    const btnCrt = document.getElementById('sendToCrtBtn');
    if (btnCrt) btnCrt.addEventListener('click', routeToCrt);
});

function copyPresetShareLink() {
    const params = new URLSearchParams();
    if (densityInput) params.set('density', densityInput.value);
    if (contrastSlider) params.set('contrast', contrastSlider.value);
    if (brightnessSlider) params.set('brightness', brightnessSlider.value);
    if (bloomSlider) params.set('bloom', bloomSlider.value);
    const url = window.location.origin + window.location.pathname + '#' + params.toString();
    if (window.StudioPipeline) {
        StudioPipeline.copyTextToClipboard(url, 'Preset share link copied to clipboard!');
    }
}

function parseAsciiUrlHash() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    try {
        const hashStr = window.location.hash.substring(1);
        const params = new URLSearchParams(hashStr);
        if (params.has('density') && densityInput) {
            densityInput.value = params.get('density');
            currentDensity = parseInt(densityInput.value);
        }
        if (params.has('contrast') && contrastSlider) {
            contrastSlider.value = params.get('contrast');
        }
        if (params.has('brightness') && brightnessSlider) {
            brightnessSlider.value = params.get('brightness');
        }
        if (params.has('bloom') && bloomSlider) {
            bloomSlider.value = params.get('bloom');
        }
    } catch (e) {
        console.warn('Could not parse ASCII URL hash preset', e);
    }
}

/* ============================================================================
   DEMO ASSET LOADER
   ============================================================================ */
const DEMO_FILES = {
    street: '../assets/demo/jack-berry-aVu_orLM3Mc-unsplash.jpg',
    arch: '../assets/demo/dmytro-koplyk-kdN49Gc01_0-unsplash.jpg',
    portrait: '../assets/demo/karsten-winegeart-MB2JolPeFcg-unsplash.jpg'
};

function toggleDemoPicker() {
    const p = document.getElementById('demoPickerPanel');
    if (p) {
        p.style.display = (p.style.display === 'none' || !p.style.display) ? 'block' : 'none';
    }
}
window.toggleDemoPicker = toggleDemoPicker;

async function loadDemoPhoto(key) {
    try {
        const p = document.getElementById('demoPickerPanel');
        if (p) p.style.display = 'none';

        let file = null;
        if (typeof window !== 'undefined' && window.DEMO_ASSETS && window.DEMO_ASSETS[key]) {
            file = dataURLtoFile(window.DEMO_ASSETS[key], key + '.jpg');
        }

        if (!file) {
            const path = DEMO_FILES[key];
            if (path) {
                const res = await fetch(path);
                if (res.ok) {
                    const blob = await res.blob();
                    file = new File([blob], key + '.jpg', { type: 'image/jpeg' });
                }
            }
        }

        if (!file) throw new Error('No asset available for ' + key);

        handleImageUpload(file);
        if (window.StudioPipeline) StudioPipeline.showToast('Loaded ' + key + ' demo asset');
    } catch (err) {
        console.warn('Could not load demo asset:', err);
        if (window.StudioPipeline) StudioPipeline.showToast('Could not load demo asset');
    }
}
window.loadDemoPhoto = loadDemoPhoto;

/* ============================================================================
   INTERACTIVE CROP TOOL
   ============================================================================ */
let cropState = {
    ratio: 'free',
    imgW: 0,
    imgH: 0,
    scale: 1,
    startX: 0,
    startY: 0,
    w: 0,
    h: 0,
    dragging: false,
    dragMode: null,
    offsetX: 0,
    offsetY: 0
};

function openCropModal() {
    const source = rawMediaElement || currentMediaElement;
    if (!source) {
        if (window.StudioPipeline) StudioPipeline.showToast('Please load an image first to crop');
        else alert('Please load an image first to crop');
        return;
    }
    const cropModal = document.getElementById('cropModal');
    const cropCanvas = document.getElementById('cropCanvas');
    const cropStageWrap = document.getElementById('cropStageWrap');
    if (!cropModal || !cropCanvas || !cropStageWrap) return;

    cropModal.style.display = 'flex';
    const wrapRect = cropStageWrap.getBoundingClientRect();
    const maxW = Math.min(800, Math.max(300, wrapRect.width - 32));
    const maxH = Math.min(500, Math.max(250, wrapRect.height - 32));

    const sourceW = source.videoWidth || source.naturalWidth || source.width || inputCanvas.width;
    const sourceH = source.videoHeight || source.naturalHeight || source.height || inputCanvas.height;

    cropState.imgW = sourceW;
    cropState.imgH = sourceH;

    const s = Math.min(maxW / cropState.imgW, maxH / cropState.imgH, 1);
    cropState.scale = s;
    cropCanvas.width = Math.round(cropState.imgW * s);
    cropCanvas.height = Math.round(cropState.imgH * s);

    cropState.ratio = 'free';
    document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ratio === 'free');
    });

    // Default crop box: 88% centered frame so handles and move are immediately usable
    cropState.w = Math.max(30, Math.round(cropCanvas.width * 0.88));
    cropState.h = Math.max(30, Math.round(cropCanvas.height * 0.88));
    cropState.startX = Math.round((cropCanvas.width - cropState.w) / 2);
    cropState.startY = Math.round((cropCanvas.height - cropState.h) / 2);

    drawCropCanvas();
}
window.openCropModal = openCropModal;

function closeCropModal() {
    const cropModal = document.getElementById('cropModal');
    if (cropModal) cropModal.style.display = 'none';
}
window.closeCropModal = closeCropModal;

function resetCropBox() {
    const cropCanvas = document.getElementById('cropCanvas');
    if (!cropCanvas) return;
    cropState.ratio = 'free';
    document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ratio === 'free');
    });
    cropState.startX = 0;
    cropState.startY = 0;
    cropState.w = cropCanvas.width;
    cropState.h = cropCanvas.height;
    drawCropCanvas();
}
window.resetCropBox = resetCropBox;

function setCropRatio(ratio) {
    const cropCanvas = document.getElementById('cropCanvas');
    if (!cropCanvas) return;
    cropState.ratio = ratio;
    document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ratio === ratio);
    });

    const maxH = cropCanvas.height;
    if (ratio === '1:1') {
        const side = Math.min(cropState.w, cropState.h);
        cropState.w = side;
        cropState.h = side;
    } else if (ratio === '4:3') {
        cropState.h = Math.round(cropState.w * (3 / 4));
    } else if (ratio === '16:9') {
        cropState.h = Math.round(cropState.w * (9 / 16));
    } else if (ratio === '3:4') {
        cropState.h = Math.round(cropState.w * (4 / 3));
    }
    if (cropState.startY + cropState.h > maxH) {
        cropState.startY = Math.max(0, maxH - cropState.h);
    }
    drawCropCanvas();
}
window.setCropRatio = setCropRatio;

function drawCropCanvas() {
    const cropCanvas = document.getElementById('cropCanvas');
    if (!cropCanvas) return;
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;
    const cw = cropCanvas.width;
    const ch = cropCanvas.height;

    ctx.clearRect(0, 0, cw, ch);
    const source = rawMediaElement || currentMediaElement || inputCanvas;
    ctx.drawImage(source, 0, 0, cw, ch);

    // Dim overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, cw, cropState.startY);
    ctx.fillRect(0, cropState.startY + cropState.h, cw, ch - (cropState.startY + cropState.h));
    ctx.fillRect(0, cropState.startY, cropState.startX, cropState.h);
    ctx.fillRect(cropState.startX + cropState.w, cropState.startY, cw - (cropState.startX + cropState.w), cropState.h);

    // Crop box outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cropState.startX, cropState.startY, cropState.w, cropState.h);

    // Rule of thirds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    const thirdW = cropState.w / 3;
    const thirdH = cropState.h / 3;
    ctx.beginPath();
    ctx.moveTo(cropState.startX + thirdW, cropState.startY); ctx.lineTo(cropState.startX + thirdW, cropState.startY + cropState.h);
    ctx.moveTo(cropState.startX + thirdW * 2, cropState.startY); ctx.lineTo(cropState.startX + thirdW * 2, cropState.startY + cropState.h);
    ctx.moveTo(cropState.startX, cropState.startY + thirdH); ctx.lineTo(cropState.startX + cropState.w, cropState.startY + thirdH);
    ctx.moveTo(cropState.startX, cropState.startY + thirdH * 2); ctx.lineTo(cropState.startX + cropState.w, cropState.startY + thirdH * 2);
    ctx.stroke();

    // Corner handle blocks
    ctx.fillStyle = '#663af3';
    const hs = 8;
    ctx.fillRect(cropState.startX - hs/2, cropState.startY - hs/2, hs, hs);
    ctx.fillRect(cropState.startX + cropState.w - hs/2, cropState.startY - hs/2, hs, hs);
    ctx.fillRect(cropState.startX - hs/2, cropState.startY + cropState.h - hs/2, hs, hs);
    ctx.fillRect(cropState.startX + cropState.w - hs/2, cropState.startY + cropState.h - hs/2, hs, hs);

    // Mid-edge handle bars
    const midX = cropState.startX + cropState.w / 2;
    const midY = cropState.startY + cropState.h / 2;
    const edgeLen = 14;
    const edgeThick = 4;
    ctx.fillRect(midX - edgeLen/2, cropState.startY - edgeThick/2, edgeLen, edgeThick);
    ctx.fillRect(midX - edgeLen/2, cropState.startY + cropState.h - edgeThick/2, edgeLen, edgeThick);
    ctx.fillRect(cropState.startX - edgeThick/2, midY - edgeLen/2, edgeThick, edgeLen);
    ctx.fillRect(cropState.startX + cropState.w - edgeThick/2, midY - edgeLen/2, edgeThick, edgeLen);

    // Pixel readout
    const origW = Math.round(cropState.w / cropState.scale);
    const origH = Math.round(cropState.h / cropState.scale);
    const info = document.getElementById('cropInfoText');
    if (info) {
        info.textContent = `Crop Area: ${origW} × ${origH} px (${cropState.ratio.toUpperCase()})`;
    }
}

function restoreRawAsciiMedia() {
    if (!rawMediaElement) return;
    currentMediaElement = rawMediaElement;
    currentImageOriginalWidth = rawMediaElement.naturalWidth || rawMediaElement.width || inputCanvas.width;
    currentImageOriginalHeight = rawMediaElement.naturalHeight || rawMediaElement.height || inputCanvas.height;
    inputCanvas.width = currentImageOriginalWidth;
    inputCanvas.height = currentImageOriginalHeight;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = currentImageOriginalWidth;
    tempCanvas.height = currentImageOriginalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(rawMediaElement, 0, 0, currentImageOriginalWidth, currentImageOriginalHeight);
    originalPixelData = rawOriginalPixelData || tempCtx.getImageData(0, 0, currentImageOriginalWidth, currentImageOriginalHeight).data;
    setDefaultValues(currentImageOriginalWidth);
    processImageWithCurrentSettings();
    updateInputCanvasPreview();
}
window.restoreRawAsciiMedia = restoreRawAsciiMedia;

function applyAsciiCrop() {
    const source = rawMediaElement || currentMediaElement;
    if (!source) return;

    const fullW = source.videoWidth || source.naturalWidth || source.width || inputCanvas.width;
    const fullH = source.videoHeight || source.naturalHeight || source.height || inputCanvas.height;

    let origX = Math.round(cropState.startX / cropState.scale);
    let origY = Math.round(cropState.startY / cropState.scale);
    let origW = Math.round(cropState.w / cropState.scale);
    let origH = Math.round(cropState.h / cropState.scale);

    origX = Math.max(0, Math.min(fullW - 1, origX));
    origY = Math.max(0, Math.min(fullH - 1, origY));
    origW = Math.max(1, Math.min(fullW - origX, origW));
    origH = Math.max(1, Math.min(fullH - origY, origH));

    // If selected area encompasses full image (within 2px tolerance), restore full original
    if (origX <= 2 && origY <= 2 && origW >= fullW - 4 && origH >= fullH - 4) {
        closeCropModal();
        if (rawMediaElement) {
            restoreRawAsciiMedia();
        }
        if (window.StudioPipeline) {
            StudioPipeline.showToast('Restored full original image');
        }
        return;
    }

    const cCanvas = document.createElement('canvas');
    cCanvas.width = Math.max(1, origW);
    cCanvas.height = Math.max(1, origH);
    const cCtx = cCanvas.getContext('2d');
    cCtx.drawImage(source, origX, origY, origW, origH, 0, 0, origW, origH);

    cCanvas.toBlob(blob => {
        if (blob) {
            closeCropModal();
            handleImageUpload(blob, true);
            if (window.StudioPipeline) StudioPipeline.showToast(`Cropped to ${origW} × ${origH} px`);
        }
    }, 'image/png');
}
window.applyAsciiCrop = applyAsciiCrop;

function getCropCoords(e) {
    const cropCanvas = document.getElementById('cropCanvas');
    const rect = cropCanvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    }
    const scaleX = rect.width > 0 ? (cropCanvas.width / rect.width) : 1;
    const scaleY = rect.height > 0 ? (cropCanvas.height / rect.height) : 1;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function getCropHitMode(mx, my, isTouch) {
    const cropCanvas = document.getElementById('cropCanvas');
    const x = cropState.startX;
    const y = cropState.startY;
    const w = cropState.w;
    const h = cropState.h;
    const hs = isTouch ? 28 : 16;
    const edgeHs = isTouch ? 20 : 12;

    // Corners
    const nearL = Math.abs(mx - x) <= hs;
    const nearR = Math.abs(mx - (x + w)) <= hs;
    const nearT = Math.abs(my - y) <= hs;
    const nearB = Math.abs(my - (y + h)) <= hs;

    if (nearT && nearL) return 'nw';
    if (nearT && nearR) return 'ne';
    if (nearB && nearL) return 'sw';
    if (nearB && nearR) return 'se';

    // Edges
    if (Math.abs(my - y) <= edgeHs && mx >= x - hs && mx <= x + w + hs) return 'n';
    if (Math.abs(my - (y + h)) <= edgeHs && mx >= x - hs && mx <= x + w + hs) return 's';
    if (Math.abs(mx - x) <= edgeHs && my >= y - hs && my <= y + h + hs) return 'w';
    if (Math.abs(mx - (x + w)) <= edgeHs && my >= y - hs && my <= y + h + hs) return 'e';

    // Inside
    if (mx > x && mx < x + w && my > y && my < y + h) {
        if (cropCanvas && w >= cropCanvas.width - 4 && h >= cropCanvas.height - 4) {
            return 'draw';
        }
        return 'move';
    }

    // Outside
    return 'draw';
}

function setupCropCanvasEvents() {
    const cropCanvas = document.getElementById('cropCanvas');
    const cropModal = document.getElementById('cropModal');
    if (!cropCanvas) return;

    cropCanvas.addEventListener('mousemove', function(e) {
        if (cropState.dragging) return;
        const coords = getCropCoords(e);
        const mode = getCropHitMode(coords.x, coords.y, false);
        if (mode === 'nw' || mode === 'se') cropCanvas.style.cursor = 'nwse-resize';
        else if (mode === 'ne' || mode === 'sw') cropCanvas.style.cursor = 'nesw-resize';
        else if (mode === 'n' || mode === 's') cropCanvas.style.cursor = 'ns-resize';
        else if (mode === 'e' || mode === 'w') cropCanvas.style.cursor = 'ew-resize';
        else if (mode === 'move') cropCanvas.style.cursor = 'move';
        else cropCanvas.style.cursor = 'crosshair';
    });

    function handleCropStart(e) {
        const isTouch = !!(e.touches && e.touches.length > 0);
        const coords = getCropCoords(e);
        const mode = getCropHitMode(coords.x, coords.y, isTouch);

        cropState.dragging = true;
        cropState.dragMode = mode;
        cropState.offsetX = coords.x - cropState.startX;
        cropState.offsetY = coords.y - cropState.startY;
        cropState.drawStartX = coords.x;
        cropState.drawStartY = coords.y;

        if (mode === 'draw') {
            cropState.startX = coords.x;
            cropState.startY = coords.y;
            cropState.w = 1;
            cropState.h = 1;
            drawCropCanvas();
        }
        if (e.cancelable) e.preventDefault();
    }

    function handleCropMove(e) {
        if (!cropState.dragging || !cropCanvas || cropModal.style.display === 'none') return;
        if (e.cancelable) e.preventDefault();
        const coords = getCropCoords(e);
        const mx = coords.x;
        const my = coords.y;
        const cw = cropCanvas.width;
        const ch = cropCanvas.height;
        const minSize = 25;

        if (cropState.dragMode === 'draw') {
            let x1 = Math.max(0, Math.min(cw, Math.min(cropState.drawStartX, mx)));
            let y1 = Math.max(0, Math.min(ch, Math.min(cropState.drawStartY, my)));
            let x2 = Math.max(0, Math.min(cw, Math.max(cropState.drawStartX, mx)));
            let y2 = Math.max(0, Math.min(ch, Math.max(cropState.drawStartY, my)));
            let newW = Math.max(minSize, x2 - x1);
            let newH = Math.max(minSize, y2 - y1);

            if (cropState.ratio === '1:1') {
                const side = Math.min(newW, newH);
                newW = side; newH = side;
                if (mx < cropState.drawStartX) x1 = Math.max(0, cropState.drawStartX - side);
                if (my < cropState.drawStartY) y1 = Math.max(0, cropState.drawStartY - side);
            } else if (cropState.ratio === '4:3') {
                newH = Math.round(newW * 0.75);
            } else if (cropState.ratio === '16:9') {
                newH = Math.round(newW * (9 / 16));
            } else if (cropState.ratio === '3:4') {
                newH = Math.round(newW * (4 / 3));
            }

            cropState.startX = Math.min(x1, cw - newW);
            cropState.startY = Math.min(y1, ch - newH);
            cropState.w = Math.min(cw - cropState.startX, newW);
            cropState.h = Math.min(ch - cropState.startY, newH);
        } else if (cropState.dragMode === 'move') {
            cropState.startX = Math.max(0, Math.min(cw - cropState.w, mx - cropState.offsetX));
            cropState.startY = Math.max(0, Math.min(ch - cropState.h, my - cropState.offsetY));
        } else if (cropState.dragMode === 'e') {
            const newW = Math.max(minSize, Math.min(cw - cropState.startX, mx - cropState.startX));
            cropState.w = newW;
            if (cropState.ratio === '1:1') cropState.h = Math.min(ch - cropState.startY, newW);
            else if (cropState.ratio === '4:3') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * 0.75));
            else if (cropState.ratio === '16:9') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * (9 / 16)));
            else if (cropState.ratio === '3:4') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * (4 / 3)));
        } else if (cropState.dragMode === 'w') {
            const right = cropState.startX + cropState.w;
            const newX = Math.max(0, Math.min(right - minSize, mx));
            const newW = right - newX;
            cropState.startX = newX;
            cropState.w = newW;
            if (cropState.ratio === '1:1') cropState.h = Math.min(ch - cropState.startY, newW);
            else if (cropState.ratio === '4:3') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * 0.75));
            else if (cropState.ratio === '16:9') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * (9 / 16)));
            else if (cropState.ratio === '3:4') cropState.h = Math.min(ch - cropState.startY, Math.round(newW * (4 / 3)));
        } else if (cropState.dragMode === 's') {
            const newH = Math.max(minSize, Math.min(ch - cropState.startY, my - cropState.startY));
            cropState.h = newH;
            if (cropState.ratio === '1:1') cropState.w = Math.min(cw - cropState.startX, newH);
            else if (cropState.ratio === '4:3') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * (4 / 3)));
            else if (cropState.ratio === '16:9') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * (16 / 9)));
            else if (cropState.ratio === '3:4') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * 0.75));
        } else if (cropState.dragMode === 'n') {
            const bottom = cropState.startY + cropState.h;
            const newY = Math.max(0, Math.min(bottom - minSize, my));
            const newH = bottom - newY;
            cropState.startY = newY;
            cropState.h = newH;
            if (cropState.ratio === '1:1') cropState.w = Math.min(cw - cropState.startX, newH);
            else if (cropState.ratio === '4:3') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * (4 / 3)));
            else if (cropState.ratio === '16:9') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * (16 / 9)));
            else if (cropState.ratio === '3:4') cropState.w = Math.min(cw - cropState.startX, Math.round(newH * 0.75));
        } else if (cropState.dragMode === 'se') {
            const newW = Math.max(minSize, Math.min(cw - cropState.startX, mx - cropState.startX));
            const newH = Math.max(minSize, Math.min(ch - cropState.startY, my - cropState.startY));
            if (cropState.ratio === '1:1') newH = newW;
            else if (cropState.ratio === '4:3') newH = Math.round(newW * 0.75);
            else if (cropState.ratio === '16:9') newH = Math.round(newW * (9 / 16));
            else if (cropState.ratio === '3:4') newH = Math.round(newW * (4 / 3));
            if (cropState.startY + newH <= ch) {
                cropState.w = newW;
                cropState.h = newH;
            }
        } else if (cropState.dragMode === 'nw') {
            const right = cropState.startX + cropState.w;
            const bottom = cropState.startY + cropState.h;
            const newX = Math.max(0, Math.min(right - minSize, mx));
            const newY = Math.max(0, Math.min(bottom - minSize, my));
            const nwW = right - newX;
            const nwH = bottom - newY;
            if (cropState.ratio === '1:1') { nwH = nwW; newY = bottom - nwH; }
            else if (cropState.ratio === '4:3') { nwH = Math.round(nwW * 0.75); newY = bottom - nwH; }
            else if (cropState.ratio === '16:9') { nwH = Math.round(nwW * (9 / 16)); newY = bottom - nwH; }
            else if (cropState.ratio === '3:4') { nwH = Math.round(nwW * (4 / 3)); newY = bottom - nwH; }
            if (newY >= 0) {
                cropState.startX = newX;
                cropState.startY = newY;
                cropState.w = nwW;
                cropState.h = nwH;
            }
        } else if (cropState.dragMode === 'ne') {
            const bottom = cropState.startY + cropState.h;
            const newW = Math.max(minSize, Math.min(cw - cropState.startX, mx - cropState.startX));
            const newY = Math.max(0, Math.min(bottom - minSize, my));
            const neH = bottom - newY;
            if (cropState.ratio === '1:1') { neH = newW; newY = bottom - neH; }
            else if (cropState.ratio === '4:3') { neH = Math.round(newW * 0.75); newY = bottom - neH; }
            else if (cropState.ratio === '16:9') { neH = Math.round(newW * (9 / 16)); newY = bottom - neH; }
            else if (cropState.ratio === '3:4') { neH = Math.round(newW * (4 / 3)); newY = bottom - neH; }
            if (newY >= 0) {
                cropState.startY = newY;
                cropState.w = newW;
                cropState.h = neH;
            }
        } else if (cropState.dragMode === 'sw') {
            const right = cropState.startX + cropState.w;
            const newX = Math.max(0, Math.min(right - minSize, mx));
            const swW = right - newX;
            const newH = Math.max(minSize, Math.min(ch - cropState.startY, my - cropState.startY));
            if (cropState.ratio === '1:1') newH = swW;
            else if (cropState.ratio === '4:3') newH = Math.round(swW * 0.75);
            else if (cropState.ratio === '16:9') newH = Math.round(swW * (9 / 16));
            else if (cropState.ratio === '3:4') newH = Math.round(swW * (4 / 3));
            if (cropState.startY + newH <= ch) {
                cropState.startX = newX;
                cropState.w = swW;
                cropState.h = newH;
            }
        }
        drawCropCanvas();
    }

    function handleCropEnd() {
        cropState.dragging = false;
        cropState.dragMode = null;
    }

    cropCanvas.addEventListener('mousedown', handleCropStart);
    cropCanvas.addEventListener('touchstart', handleCropStart, { passive: false });

    window.addEventListener('mousemove', handleCropMove);
    window.addEventListener('touchmove', handleCropMove, { passive: false });

    window.addEventListener('mouseup', handleCropEnd);
    window.addEventListener('touchend', handleCropEnd);
    window.addEventListener('touchcancel', handleCropEnd);
}

/* ============================================================================
   STYLE PRESETS (RIGHT PANEL)
   ============================================================================ */
function applyAsciiStylePreset(preset) {
    document.querySelectorAll('.preset-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(preset));
    });

    if (preset === 'classic') {
        colorSchemeSelect.value = 'color1';
        currentColorScheme = 'color1';
        characterSetSelect.value = 'latinBasic';
        currentCharacterSet = 'latinBasic';
        densityInput.value = '8';
        currentDensity = 8;
        if (outputBloomSlider) {
            outputBloomSlider.value = '0';
            currentOutputBloom = 0;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '0';
        }
    } else if (preset === 'matrix') {
        colorSchemeSelect.value = 'custom';
        currentColorScheme = 'custom';
        customTextColor.value = '#00ff66';
        customBackgroundColor.value = '#050c05';
        isBgColorTransparent = false;
        characterSetSelect.value = 'japanese';
        currentCharacterSet = 'japanese';
        densityInput.value = '10';
        currentDensity = 10;
        if (outputBloomSlider) {
            outputBloomSlider.value = '30';
            currentOutputBloom = 30;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '30';
        }
    } else if (preset === 'cyberpunk') {
        colorSchemeSelect.value = 'custom';
        currentColorScheme = 'custom';
        customTextColor.value = '#00f0ff';
        customBackgroundColor.value = '#120024';
        isBgColorTransparent = false;
        characterSetSelect.value = 'latinBasic';
        currentCharacterSet = 'latinBasic';
        densityInput.value = '8';
        currentDensity = 8;
        if (outputBloomSlider) {
            outputBloomSlider.value = '40';
            currentOutputBloom = 40;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '40';
        }
    } else if (preset === 'amber') {
        colorSchemeSelect.value = 'custom';
        currentColorScheme = 'custom';
        customTextColor.value = '#ffb000';
        customBackgroundColor.value = '#1a0e00';
        isBgColorTransparent = false;
        characterSetSelect.value = 'preset8';
        currentCharacterSet = 'preset8';
        densityInput.value = '8';
        currentDensity = 8;
        if (outputBloomSlider) {
            outputBloomSlider.value = '25';
            currentOutputBloom = 25;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '25';
        }
    } else if (preset === 'blocks') {
        colorSchemeSelect.value = 'color1';
        currentColorScheme = 'color1';
        characterSetSelect.value = 'preset8';
        currentCharacterSet = 'preset8';
        densityInput.value = '12';
        currentDensity = 12;
        if (outputBloomSlider) {
            outputBloomSlider.value = '0';
            currentOutputBloom = 0;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '0';
        }
    } else if (preset === 'dense') {
        colorSchemeSelect.value = 'color1';
        currentColorScheme = 'color1';
        characterSetSelect.value = 'latin';
        currentCharacterSet = 'latin';
        densityInput.value = '4';
        currentDensity = 4;
        if (outputBloomSlider) {
            outputBloomSlider.value = '0';
            currentOutputBloom = 0;
            if (outputBloomValueDisplay) outputBloomValueDisplay.textContent = '0';
        }
    }

    if (customColorsContainer) {
        customColorsContainer.style.display = currentColorScheme === 'custom' ? 'block' : 'none';
    }
    if (gradientMapContainer) {
        gradientMapContainer.style.display = currentColorScheme === 'gradient' ? 'block' : 'none';
    }

    if (currentMediaElement || originalPixelData) {
        processImageWithCurrentSettings();
    }
}
window.applyAsciiStylePreset = applyAsciiStylePreset;

// Global Clipboard Paste Support
window.addEventListener('paste', function(e) {
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.type !== 'range') {
        return;
    }
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
                e.preventDefault();
                if (window.StudioPipeline) StudioPipeline.showToast('Pasted image from clipboard');
                handleImageUpload(blob);
                break;
            }
        }
    }
});

// Check incoming pipeline image on startup
window.addEventListener('DOMContentLoaded', function() {
    parseAsciiUrlHash();
    setupCropCanvasEvents();
    if (window.StudioPipeline) {
        StudioPipeline.receiveImage(function(dataUrl) {
            fetch(dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    handleImageUpload(blob);
                })
                .catch(err => console.error('Pipeline blob conversion failed', err));
        });
    }
});


