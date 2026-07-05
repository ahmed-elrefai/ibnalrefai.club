/**
 * ----------------------------------------------------
 * CODE VISUALIZER INTERACTIVE ENGINE
 * Ahmed Elrefai - ibnalrefai.com
 * ----------------------------------------------------
 */

// ----------------------------------------------------
// STATE VARIABLES
// ----------------------------------------------------
let currentLang = 'ar'; // Default language is Arabic (RTL)
let soundEnabled = true;
let activeTab = 'python'; // 'python' or 'js'
let currentPreset = 'linear'; // 'linear', 'binary', 'bubble', 'implicit'
let currentStep = 0;
let isPlaying = false;
let simulationInterval = null;
let traces = {
    linear: [],
    binary: [],
    bubble: [],
    implicit: []
};

// ----------------------------------------------------
// TRANSLATION DICTIONARY
// ----------------------------------------------------
const translations = {
    ar: {
        'vis-title': 'المحاكي البرمجي // Code Visualizer',
        'vis-panel-editor': 'نصل الكود // CODE FIELD',
        'vis-preset-label': 'أمثلة جاهزة:',
        'preset-linear': 'البحث الخطي // Linear Search',
        'preset-binary': 'البحث الثنائي // Binary Search',
        'preset-bubble': 'فرز الفقاعات // Bubble Sort',
        'preset-implicit': 'مصفوفة غير محددة // Implicit Size Array',
        'vis-panel-stack': 'مكدس المتغيرات // VARIABLES STACK',
        'empty-stack': 'لا توجد متغيرات حالياً',
        'vis-panel-arena': 'ساحة التصور // VISUALIZATION BATTLEFIELD',
        'nav-home': 'الرئيسية // BACK TO HOME',
        'empty-battlefield': 'ساحة المحاكاة فارغة. اكتب الكود لرؤية النصل!',
        'sim-ready-msg': 'المحاكي جاهز. اختر كوداً واضغط تشغيل لترى التدفق!',
        'footer-desc': 'لا ترضى بالوقوف في الظلال. كن وحشاً دائماً.',
        'f-ranks-title': 'مستويات التقييم',
        'footer-copy': '© 2026 احمد الرفاعي. جميع الحقوق محفوظة. // تصميم وتطوير محرك الوحش',
        'unsupported-title': 'تقنية غير مدعومة // UNSUPPORTED CODE',
        'unsupported-desc': 'هذا المحاكي مصمم حالياً لتجسيد خوارزميات البحث والفرز الشهيرة. يرجى استخدام أحد الأمثلة الجاهزة لرؤية نصل المحاكاة!',
        'sound-on-text': 'صوت: تفعيل',
        'sound-off-text': 'صوت: كتم',
        'param-arr-label': 'المصفوفة // Array',
        'param-target-label': 'الهدف // Target',
        'param-arr-invalid': 'يرجى إدخال مصفوفة صالحة (أرقام مفصولة بفواصل)',
        'param-target-invalid': 'يرجى إدخال قيمة هدف صالحة'
    },
    en: {
        'vis-title': 'Code Visualizer',
        'vis-panel-editor': 'CODE FIELD',
        'vis-preset-label': 'Presets:',
        'preset-linear': 'Linear Search',
        'preset-binary': 'Binary Search',
        'preset-bubble': 'Bubble Sort',
        'preset-implicit': 'Implicit Size Array',
        'vis-panel-stack': 'VARIABLES STACK',
        'empty-stack': 'No variables currently active',
        'vis-panel-arena': 'VISUALIZATION BATTLEFIELD',
        'nav-home': 'BACK TO HOME',
        'empty-battlefield': 'Simulation battlefield is empty. Select a preset or write code!',
        'sim-ready-msg': 'Simulator ready. Choose a preset and click Play!',
        'footer-desc': 'Never settle for standing in shadows. Always be a beast.',
        'f-ranks-title': 'EVALUATION LEVELS',
        'footer-copy': '© 2026 AHMED ELREFAI. ALL RIGHTS RESERVED. // DESIGN & ENGINE BY AHMED ELREFAI',
        'unsupported-title': 'UNSUPPORTED CODE',
        'unsupported-desc': 'This visualizer is optimized to trace key search and sorting algorithms. Please load one of the presets to see the visualization!',
        'sound-on-text': 'SOUND: ON',
        'sound-off-text': 'MUTED',
        'param-arr-label': 'Array',
        'param-target-label': 'Target',
        'param-arr-invalid': 'Please enter a valid array (comma-separated numbers)',
        'param-target-invalid': 'Please enter a valid target value'
    }
};

// Preset Codes (function-only, no variable assignments)
const presetCodes = {
    python: {
        linear: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
        binary: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
        bubble: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        implicit: `# مصفوفة غير محددة الحجم
# Implicit Size Array
arr = [10, 20, 30, 40, 50, ...]
val0 = arr[0]
val3 = arr[3]
val5 = arr[5]`
    },
    js: {
        linear: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,
        binary: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
        bubble: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,
        implicit: `// مصفوفة غير محددة الحجم
// Implicit Size Array
const arr = [10, 20, 30, 40, 50, ...];
const val0 = arr[0];
const val3 = arr[3];
const val5 = arr[5];`
    }
};

// Preset parameter configuration: default values & which fields to show
const presetParams = {
    linear:   { arr: [12, 5, 8, 19, 3, 7, 21], target: 7,  showTarget: true  },
    binary:   { arr: [2, 5, 8, 12, 16, 23, 38, 56, 72], target: 23, showTarget: true  },
    bubble:   { arr: [5, 1, 4, 2, 8],           target: null, showTarget: false },
    implicit: { arr: [10, 20, 30, 40, 50],      target: null, showTarget: false }
};

// ----------------------------------------------------
// SOUND SYNTHESIS ENGINE (Web Audio API)
// ----------------------------------------------------
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSlashSound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);
    filter.Q.setValueAtTime(3.0, now);

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.25);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
    noiseNode.start(now);
    noiseNode.stop(now + 0.3);
}

function playKeySound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300 + Math.random() * 100, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(5.0, now);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
}

function playSwapSound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(480, now + 0.15);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
}

function playSuccessSound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chime
    notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        gainNode.gain.setValueAtTime(0.12, now + idx * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
    });
}

// ----------------------------------------------------
// VISUAL ANIMATIONS (Slash Canvas & Speed Lines)
// ----------------------------------------------------
const slashCanvas = document.getElementById('slash-canvas');
const ctxSlash = slashCanvas.getContext('2d');
const speedLines = document.getElementById('speed-lines');

function resizeSlashCanvas() {
    slashCanvas.width = window.innerWidth;
    slashCanvas.height = window.innerHeight;
}
resizeSlashCanvas();
window.addEventListener('resize', resizeSlashCanvas);

function drawScreenSlash() {
    const w = slashCanvas.width;
    const h = slashCanvas.height;
    const startX = Math.random() > 0.5 ? 0 : w;
    const startY = Math.random() * (h * 0.4) + h * 0.1;
    const endX = startX === 0 ? w : 0;
    const endY = Math.random() * (h * 0.4) + h * 0.5;

    let progress = 0;

    function animateSlash() {
        ctxSlash.clearRect(0, 0, w, h);
        ctxSlash.strokeStyle = 'var(--color-crimson)';
        ctxSlash.lineWidth = 14;
        ctxSlash.shadowColor = '#fff';
        ctxSlash.shadowBlur = 10;
        ctxSlash.lineCap = 'round';

        ctxSlash.beginPath();
        const curX = startX + (endX - startX) * progress;
        const curY = startY + (endY - startY) * progress;
        ctxSlash.moveTo(startX, startY);
        ctxSlash.lineTo(curX, curY);
        ctxSlash.stroke();

        progress += 0.15;

        if (progress <= 1.05) {
            requestAnimationFrame(animateSlash);
        } else {
            fadeSlash(startX, startY, endX, endY);
        }
    }

    function fadeSlash(sx, sy, ex, ey) {
        let opacity = 1.0;

        function animateFade() {
            ctxSlash.clearRect(0, 0, w, h);
            ctxSlash.strokeStyle = `rgba(17, 17, 17, ${opacity})`;
            ctxSlash.lineWidth = 6;
            ctxSlash.shadowBlur = 0;

            ctxSlash.beginPath();
            ctxSlash.moveTo(sx, sy);
            ctxSlash.lineTo(ex, ey);
            ctxSlash.stroke();

            opacity -= 0.05;

            if (opacity > 0) {
                requestAnimationFrame(animateFade);
            } else {
                ctxSlash.clearRect(0, 0, w, h);
            }
        }
        animateFade();
    }

    animateSlash();
}

// ----------------------------------------------------
// DYNAMIC TRACE GENERATION (Simulation Sandbox Engine)
// ----------------------------------------------------

// Read array from the dedicated input field
function parseArrFromField() {
    const field = document.getElementById('param-arr');
    if (!field) return { valid: false, arr: [] };

    const raw = field.value.trim();
    if (!raw) return { valid: false, arr: [] };

    // Remove surrounding brackets if user typed them
    const cleaned = raw.replace(/^\[/, '').replace(/\]$/, '').replace(/\.{2,}\s*$/, '').trim();
    if (!cleaned) return { valid: false, arr: [] };

    const parts = cleaned.split(',').map(s => s.trim()).filter(s => s !== '');
    if (parts.length === 0) return { valid: false, arr: [] };

    const arr = parts.map(s => {
        const num = Number(s);
        return isNaN(num) ? s : num;
    });

    // Check all elements are valid numbers
    if (arr.some(v => typeof v === 'string' && v !== '')) {
        // Allow strings but they must be non-empty
        if (arr.some(v => v === '')) return { valid: false, arr: [] };
    }

    return { valid: true, arr };
}

// Read target from the dedicated input field
function parseTargetFromField() {
    const field = document.getElementById('param-target');
    if (!field) return { valid: false, target: null };

    const raw = field.value.trim();
    if (!raw) return { valid: false, target: null };

    const num = Number(raw);
    const target = isNaN(num) ? raw : num;
    return { valid: true, target };
}

// Validate param fields and return parsed values or error
function validateParamFields(presetKey) {
    const arrResult = parseArrFromField();
    if (!arrResult.valid) {
        return {
            valid: false,
            errorAr: translations.ar['param-arr-invalid'],
            errorEn: translations.en['param-arr-invalid']
        };
    }

    let target = null;
    if (presetKey === 'linear' || presetKey === 'binary') {
        const targetResult = parseTargetFromField();
        if (!targetResult.valid) {
            return {
                valid: false,
                errorAr: translations.ar['param-target-invalid'],
                errorEn: translations.en['param-target-invalid']
            };
        }
        target = targetResult.target;
    }

    return { valid: true, arr: arrResult.arr, target };
}

function generateLinearSearchTrace(arr, target) {
    const trace = [];
    
    // Step 0: Initial state
    trace.push({
        linePy: 5, lineJs: 5,
        statusAr: `تم تهيئة البحث الخطي. سنبحث عن الهدف ${target} في مصفوفة مخصصة: [${arr.join(', ')}].`,
        statusEn: `Linear search initialized. We will search for target ${target} in your custom array: [${arr.join(', ')}].`,
        array: [...arr],
        pointers: {},
        activeSlots: [],
        variables: { target: target }
    });

    let foundIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        // Step A: Loop iteration i
        trace.push({
            linePy: 6, lineJs: 6,
            statusAr: `بدء الحلقة التكرارية. فحص العنصر عند الفهرس i = ${i}.`,
            statusEn: `Loop iteration. Checking element at index i = ${i}.`,
            array: [...arr],
            pointers: { i: i },
            activeSlots: [i],
            variables: { target: target, i: i }
        });

        // Step B: Compare
        if (arr[i] == target) {
            trace.push({
                linePy: 7, lineJs: 7,
                statusAr: `مقارنة العنصر: هل القيمة ${arr[i]} تساوي ${target}؟ نعم! لقد وجدنا الهدف.`,
                statusEn: `Comparing element: Does value ${arr[i]} equal ${target}? Yes! Target found.`,
                array: [...arr],
                pointers: { i: i },
                activeSlots: [i],
                variables: { target: target, i: i },
                isSuccess: true
            });

            trace.push({
                linePy: 8, lineJs: 8,
                statusAr: `إرجاع الفهرس ${i} كـ نتيجة نجاح للبحث.`,
                statusEn: `Returning index ${i} as successful search result.`,
                array: [...arr],
                pointers: { i: i },
                activeSlots: [i],
                variables: { target: target, i: i, result: i },
                isSuccess: true
            });
            foundIndex = i;
            break;
        } else {
            trace.push({
                linePy: 7, lineJs: 7,
                statusAr: `هل القيمة ${arr[i]} تساوي ${target}؟ لا. سنستمر في البحث.`,
                statusEn: `Does value ${arr[i]} equal ${target}? No. Continuing the search.`,
                array: [...arr],
                pointers: { i: i },
                activeSlots: [i],
                variables: { target: target, i: i }
            });
        }
    }

    if (foundIndex === -1) {
        trace.push({
            linePy: 9, lineJs: 11,
            statusAr: `تم فحص جميع العناصر ولم يتم العثور على الهدف ${target}. إرجاع -1.`,
            statusEn: `All elements checked. Target ${target} not found. Returning -1.`,
            array: [...arr],
            pointers: {},
            activeSlots: [],
            variables: { target: target, result: -1 }
        });
    }

    return trace;
}

function generateBinarySearchTrace(arr, target) {
    const isSorted = arr.every((v, i) => i === 0 || v >= arr[i - 1]);
    const workingArr = [...arr];
    if (!isSorted) {
        workingArr.sort((a, b) => (typeof a === 'number' && typeof b === 'number') ? a - b : String(a).localeCompare(String(b)));
    }

    const trace = [];
    
    // Step 0: Init
    trace.push({
        linePy: 5, lineJs: 5,
        statusAr: `تم تهيئة البحث الثنائي. الهدف هو ${target}. المصفوفة المرتبة هي [${workingArr.join(', ')}].` + (!isSorted ? " (تم ترتيب مصفوفتك تلقائياً للبحث الثنائي)" : ""),
        statusEn: `Binary search initialized. Target is ${target}. Sorted array is [${workingArr.join(', ')}].` + (!isSorted ? " (Your array was auto-sorted for binary search)" : ""),
        array: [...workingArr],
        pointers: {},
        activeSlots: [],
        variables: { target: target }
    });

    let left = 0;
    let right = workingArr.length - 1;
    
    trace.push({
        linePy: 6, lineJs: 6,
        statusAr: `تعيين المؤشر الأيسر left = 0.`,
        statusEn: `Setting left boundary pointer left = 0.`,
        array: [...workingArr],
        pointers: { left: 0 },
        activeSlots: [],
        variables: { target: target, left: 0 }
    });

    trace.push({
        linePy: 7, lineJs: 7,
        statusAr: `تعيين المؤشر الأيمن right = ${right}.`,
        statusEn: `Setting right boundary pointer right = ${right}.`,
        array: [...workingArr],
        pointers: { left: 0, right: right },
        activeSlots: [],
        variables: { target: target, left: 0, right: right }
    });

    let foundIndex = -1;
    let iterations = 0;
    const maxIterations = 20;

    while (left <= right && iterations < maxIterations) {
        iterations++;
        
        trace.push({
            linePy: 8, lineJs: 8,
            statusAr: `التحقق من شرط التكرار: هل left (${left}) <= right (${right})؟ نعم.`,
            statusEn: `Checking loop condition: Is left (${left}) <= right (${right})? Yes.`,
            array: [...workingArr],
            pointers: { left: left, right: right },
            activeSlots: [],
            variables: { target: target, left: left, right: right },
            grayedRange: getGrayedRange(workingArr.length, left, right)
        });

        const mid = Math.floor((left + right) / 2);

        trace.push({
            linePy: 9, lineJs: 9,
            statusAr: `حساب مؤشر المنتصف: mid = (${left} + ${right}) // 2 = ${mid}. قيمة العنصر الوسط هي ${workingArr[mid]}.`,
            statusEn: `Calculating middle pointer: mid = (${left} + ${right}) // 2 = ${mid}. Middle element is ${workingArr[mid]}.`,
            array: [...workingArr],
            pointers: { left: left, right: right, mid: mid },
            activeSlots: [mid],
            variables: { target: target, left: left, right: right, mid: mid },
            grayedRange: getGrayedRange(workingArr.length, left, right)
        });

        if (workingArr[mid] == target) {
            trace.push({
                linePy: 10, lineJs: 10,
                statusAr: `هل العنصر الأوسط ${workingArr[mid]} يساوي الهدف ${target}؟ نعم! لقد وجدنا الهدف.`,
                statusEn: `Does middle element ${workingArr[mid]} equal target ${target}? Yes! Target found.`,
                array: [...workingArr],
                pointers: { left: left, right: right, mid: mid },
                activeSlots: [mid],
                variables: { target: target, left: left, right: right, mid: mid },
                isSuccess: true,
                grayedRange: getGrayedRange(workingArr.length, left, right)
            });

            trace.push({
                linePy: 11, lineJs: 11,
                statusAr: `إرجاع الفهرس ${mid} كـ نتيجة نجاح للبحث.`,
                statusEn: `Returning index ${mid} as successful search result.`,
                array: [...workingArr],
                pointers: { left: left, right: right, mid: mid },
                activeSlots: [mid],
                variables: { target: target, left: left, right: right, mid: mid, result: mid },
                isSuccess: true,
                grayedRange: getGrayedRange(workingArr.length, left, right)
            });
            foundIndex = mid;
            break;
        } else if (workingArr[mid] < target) {
            trace.push({
                linePy: 12, lineJs: 12,
                statusAr: `هل العنصر الأوسط ${workingArr[mid]} أصغر من الهدف ${target}؟ نعم. النصف الأيسر مستبعد.`,
                statusEn: `Is middle element ${workingArr[mid]} < target ${target}? Yes. Eliminating left half.`,
                array: [...workingArr],
                pointers: { left: left, right: right, mid: mid },
                activeSlots: [mid],
                variables: { target: target, left: left, right: right, mid: mid },
                grayedRange: getGrayedRange(workingArr.length, left, mid)
            });

            left = mid + 1;

            trace.push({
                linePy: 13, lineJs: 13,
                statusAr: `تحديث المؤشر الأيسر ليصبح left = mid + 1 = ${left}.`,
                statusEn: `Updating left pointer to left = mid + 1 = ${left}.`,
                array: [...workingArr],
                pointers: { left: left, right: right },
                activeSlots: [],
                variables: { target: target, left: left, right: right },
                grayedRange: getGrayedRange(workingArr.length, left, right)
            });
        } else {
            trace.push({
                linePy: 14, lineJs: 14,
                statusAr: `هل العنصر الأوسط ${workingArr[mid]} أصغر من الهدف ${target}؟ لا، بل هو أكبر. النصف الأيمن مستبعد.`,
                statusEn: `Is middle element ${workingArr[mid]} < target ${target}? No, it is larger. Eliminating right half.`,
                array: [...workingArr],
                pointers: { left: left, right: right, mid: mid },
                activeSlots: [mid],
                variables: { target: target, left: left, right: right, mid: mid },
                grayedRange: getGrayedRange(workingArr.length, mid, right)
            });

            right = mid - 1;

            trace.push({
                linePy: 15, lineJs: 15,
                statusAr: `تحديث المؤشر الأيمن ليصبح right = mid - 1 = ${right}.`,
                statusEn: `Updating right pointer to right = mid - 1 = ${right}.`,
                array: [...workingArr],
                pointers: { left: left, right: right },
                activeSlots: [],
                variables: { target: target, left: left, right: right },
                grayedRange: getGrayedRange(workingArr.length, left, right)
            });
        }
    }

    if (foundIndex === -1) {
        trace.push({
            linePy: 16, lineJs: 18,
            statusAr: `انتهت الحلقة ولم يتم العثور على الهدف ${target}. إرجاع -1.`,
            statusEn: `Loop finished. Target ${target} not found. Returning -1.`,
            array: [...workingArr],
            pointers: {},
            activeSlots: [],
            variables: { target: target, result: -1 }
        });
    }

    return trace;
}

function getGrayedRange(length, left, right) {
    const range = [];
    for (let i = 0; i < length; i++) {
        if (i < left || i > right) {
            range.push(i);
        }
    }
    return range;
}

function generateBubbleSortTrace(arr) {
    const trace = [];
    const workingArr = [...arr];
    const n = workingArr.length;

    trace.push({
        linePy: 4, lineJs: 4,
        statusAr: `بدء فرز الفقاعات لترتيب المصفوفة تصاعدياً: [${workingArr.join(', ')}].`,
        statusEn: `Bubble sort initialized to sort array in ascending order: [${workingArr.join(', ')}].`,
        array: [...workingArr],
        pointers: {},
        activeSlots: [],
        variables: {}
    });

    const sortedIndices = [];

    for (let i = 0; i < n; i++) {
        trace.push({
            linePy: 6, lineJs: 6,
            statusAr: `بدء المرور الخارجي i = ${i}.`,
            statusEn: `Starting outer loop iteration i = ${i}.`,
            array: [...workingArr],
            pointers: {},
            activeSlots: [],
            variables: { i: i },
            sortedRange: [...sortedIndices]
        });

        for (let j = 0; j < n - i - 1; j++) {
            trace.push({
                linePy: 7, lineJs: 7,
                statusAr: `مقارنة العنصرين عند الفهرس j = ${j} و ${j + 1}: هل ${workingArr[j]} > ${workingArr[j + 1]}؟`,
                statusEn: `Comparing elements at index j = ${j} and ${j + 1}: Is ${workingArr[j]} > ${workingArr[j + 1]}?`,
                array: [...workingArr],
                pointers: { j: j },
                activeSlots: [j, j + 1],
                variables: { i: i, j: j },
                sortedRange: [...sortedIndices]
            });

            if (workingArr[j] > workingArr[j + 1]) {
                trace.push({
                    linePy: 8, lineJs: 8,
                    statusAr: `نعم، ${workingArr[j]} > ${workingArr[j + 1]}. يجب مبادلة العنصرين لترتيبهما.`,
                    statusEn: `Yes, ${workingArr[j]} > ${workingArr[j + 1]}. We must swap them to sort.`,
                    array: [...workingArr],
                    pointers: { j: j },
                    activeSlots: [j, j + 1],
                    variables: { i: i, j: j },
                    sortedRange: [...sortedIndices]
                });

                const temp = workingArr[j];
                workingArr[j] = workingArr[j + 1];
                workingArr[j + 1] = temp;

                trace.push({
                    linePy: 9, lineJs: 10,
                    statusAr: `إجراء عملية المبادلة. أصبحت المصفوفة الآن: [${workingArr.join(', ')}].`,
                    statusEn: `Performing swap. The array is now: [${workingArr.join(', ')}].`,
                    array: [...workingArr],
                    pointers: { j: j },
                    activeSlots: [j, j + 1],
                    variables: { i: i, j: j },
                    isSwap: true,
                    sortedRange: [...sortedIndices]
                });
            } else {
                trace.push({
                    linePy: 8, lineJs: 8,
                    statusAr: `لا، ${workingArr[j]} ليست أكبر من ${workingArr[j + 1]}. لا مبادلة.`,
                    statusEn: `No, ${workingArr[j]} is not > ${workingArr[j + 1]}. No swap needed.`,
                    array: [...workingArr],
                    pointers: { j: j },
                    activeSlots: [j, j + 1],
                    variables: { i: i, j: j },
                    sortedRange: [...sortedIndices]
                });
            }
        }

        sortedIndices.push(n - i - 1);
        
        trace.push({
            linePy: 6, lineJs: 6,
            statusAr: `اكتمل المرور الخارجي i = ${i}. العنصر عند الفهرس ${n - i - 1} استقر في مكانه النهائي.`,
            statusEn: `Outer loop iteration i = ${i} complete. Element at index ${n - i - 1} is now in its sorted position.`,
            array: [...workingArr],
            pointers: {},
            activeSlots: [],
            variables: { i: i },
            sortedRange: [...sortedIndices]
        });
    }

    trace.push({
        linePy: 10, lineJs: 15,
        statusAr: `اكتمل فرز المصفوفة تصاعدياً بنجاح! جميع العناصر مرتبة.`,
        statusEn: `Bubble sort completed successfully! All elements are sorted.`,
        array: [...workingArr],
        pointers: {},
        activeSlots: [],
        variables: {},
        isSuccess: true,
        sortedRange: Array.from({ length: n }, (_, k) => k)
    });

    return trace;
}

function generateImplicitTrace(arr) {
    const trace = [];
    const workingArr = [...arr];

    trace.push({
        linePy: 2, lineJs: 2,
        statusAr: "تهيئة مصفوفة غير محددة الحجم. تظهر العناصر الأولى، بينما تتلاشى بقية المساحة.",
        statusEn: "Initializing Implicit Size Array. The first elements are shown, while the rest fades.",
        array: [...workingArr],
        pointers: {},
        activeSlots: [],
        variables: {},
        isImplicit: true
    });

    trace.push({
        linePy: 3, lineJs: 3,
        statusAr: `قراءة العنصر عند الفهرس 0: القيمة هي ${workingArr[0] !== undefined ? workingArr[0] : '?'}.`,
        statusEn: `Reading element at index 0: Value is ${workingArr[0] !== undefined ? workingArr[0] : '?'}.`,
        array: [...workingArr],
        pointers: { ptr: 0 },
        activeSlots: [0],
        variables: { index: 0, val: workingArr[0] !== undefined ? workingArr[0] : '?' },
        isImplicit: true
    });

    const idx = Math.min(3, workingArr.length - 1);
    trace.push({
        linePy: 4, lineJs: 4,
        statusAr: `الوصول المباشر للعنصر عند الفهرس ${idx}: القيمة هي ${workingArr[idx] !== undefined ? workingArr[idx] : '?'}.`,
        statusEn: `Directly accessing element at index ${idx}: Value is ${workingArr[idx] !== undefined ? workingArr[idx] : '?'}.`,
        array: [...workingArr],
        pointers: { ptr: idx },
        activeSlots: [idx],
        variables: { index: idx, val: workingArr[idx] !== undefined ? workingArr[idx] : '?' },
        isImplicit: true
    });

    trace.push({
        linePy: 5, lineJs: 5,
        statusAr: "الوصول إلى الفهرس 5 (في المنطقة الافتراضية المتلاشية). هذا يوضح كيف يمكن للمصفوفة أن تنمو ديناميكياً.",
        statusEn: "Accessing index 5 (inside the virtual fading zone). This illustrates how the array expands dynamically.",
        array: [...workingArr],
        pointers: { ptr: 5 },
        activeSlots: [5],
        variables: { index: 5, val: "..." },
        isImplicit: true,
        isSuccess: true
    });

    return trace;
}
function showValidationErrorPlaceholder(errorAr, errorEn) {
    visualArena.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'unsupported-visualization-placeholder validation-error';

    const title = document.createElement('div');
    title.className = 'unsupported-title';
    title.style.color = 'var(--color-crimson)';
    title.innerText = (currentLang === 'ar') ? 'تنبيه: مدخلات غير صالحة' : 'WARNING: INVALID INPUT';

    const desc = document.createElement('p');
    desc.className = 'unsupported-desc';
    desc.innerText = (currentLang === 'ar') ? errorAr : errorEn;

    placeholder.appendChild(title);
    placeholder.appendChild(desc);
    visualArena.appendChild(placeholder);

    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnPlayPause.innerText = '▶️';
    isPlaying = false;
    clearInterval(simulationInterval);
    if (speedLines) speedLines.classList.remove('active');
}

function updateTraceFromParams() {
    const algo = currentPreset;

    const validation = validateParamFields(algo);
    if (!validation.valid) {
        showValidationErrorPlaceholder(validation.errorAr, validation.errorEn);
        return;
    }

    const { arr, target } = validation;
    
    if (algo === 'linear') {
        traces['linear'] = generateLinearSearchTrace(arr, target);
    } else if (algo === 'binary') {
        traces['binary'] = generateBinarySearchTrace(arr, target);
    } else if (algo === 'bubble') {
        traces['bubble'] = generateBubbleSortTrace(arr);
    } else if (algo === 'implicit') {
        traces['implicit'] = generateImplicitTrace(arr);
    }
    
    const trace = traces[algo];
    if (trace) {
        if (currentStep >= trace.length) {
            currentStep = Math.max(0, trace.length - 1);
        }
        renderStep(currentStep);
    }
}

// ----------------------------------------------------
// UI RENDERING LOGIC
// ----------------------------------------------------
const codeInput = document.getElementById('code-input');
const lineNumbersContainer = document.getElementById('line-numbers');
const variablesList = document.getElementById('variables-list');
const visualArena = document.getElementById('visual-arena-content');
const simStatus = document.getElementById('sim-status');
const presetSelect = document.getElementById('preset-select');
const btnPrev = document.getElementById('btn-step-prev');
const btnNext = document.getElementById('btn-step-next');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnReset = document.getElementById('btn-reset-sim');
const btnPython = document.getElementById('btn-lang-python');
const btnJS = document.getElementById('btn-lang-js');
const soundToggle = document.getElementById('sound-toggle');
const langToggle = document.getElementById('lang-toggle');

// Sync Line Numbers with textarea content
function syncLineNumbers() {
    const lines = codeInput.value.split('\n');
    lineNumbersContainer.innerHTML = '';
    lines.forEach((_, idx) => {
        const span = document.createElement('span');
        span.innerText = idx + 1;
        lineNumbersContainer.appendChild(span);
    });
}

// Highlights the active line number
function highlightLineNumber(lineNum) {
    const spans = lineNumbersContainer.querySelectorAll('span');
    spans.forEach((span, idx) => {
        if (idx === lineNum - 1) {
            span.classList.add('active-line');
        } else {
            span.classList.remove('active-line');
        }
    });
}

// Check if user edits still match one of our presets
function validateAndMatchPreset() {
    const code = codeInput.value.toLowerCase();
    
    if (code.includes('linear') || code.includes('خط')) {
        return 'linear';
    } else if (code.includes('binary') || code.includes('ثنائ')) {
        return 'binary';
    } else if (code.includes('bubble') || code.includes('فقاع')) {
        return 'bubble';
    } else if (code.includes('implicit') || code.includes('غير محدد') || code.includes('...')) {
        return 'implicit';
    }
    return null;
}

// Renders visual arena for the current step
function renderStep(stepIndex) {
    const trace = traces[currentPreset];
    if (!trace || !trace[stepIndex]) {
        showUnsupportedPlaceholder();
        return;
    }

    const step = trace[stepIndex];
    
    // Play sound based on state
    if (step.isSwap) {
        playSwapSound();
    } else if (step.isSuccess) {
        playSuccessSound();
    } else {
        playKeySound();
    }

    // 1. Highlight line number in editor
    const lineNum = (activeTab === 'python') ? step.linePy : step.lineJs;
    highlightLineNumber(lineNum);

    // 2. Render Status Box
    simStatus.innerText = (currentLang === 'ar') ? step.statusAr : step.statusEn;

    // 3. Render Variables Stack
    variablesList.innerHTML = '';
    const varKeys = Object.keys(step.variables);
    if (varKeys.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-stack-placeholder';
        placeholder.innerText = translations[currentLang]['empty-stack'];
        variablesList.appendChild(placeholder);
    } else {
        varKeys.forEach(key => {
            const card = document.createElement('div');
            card.className = 'variable-card';
            
            const nameBadge = document.createElement('span');
            nameBadge.className = 'var-name-badge';
            nameBadge.innerText = key;

            const valBadge = document.createElement('span');
            valBadge.className = 'var-val-badge';
            valBadge.innerText = step.variables[key];

            card.appendChild(nameBadge);
            card.appendChild(valBadge);
            variablesList.appendChild(card);
        });
    }

    // 4. Render Visualization Battlefield (Array slots & pointers)
    visualArena.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'array-container';

    // Title
    const title = document.createElement('div');
    title.className = 'array-title';
    title.innerText = (currentLang === 'ar') ? 'مصفوفة المحاكاة // ARRAY' : 'VISUALIZED ARRAY';
    container.appendChild(title);

    // Row of slots
    const row = document.createElement('div');
    row.className = 'array-row';

    const arr = step.array;

    // Dynamically calculate slot size to fit container width without cropping
    const totalSlots = arr.length + (step.isImplicit ? 3 : 0);
    const containerMaxWidth = 720; // safe width to fit within 850px max-width including padding
    const gap = 8;
    const computedSize = Math.floor((containerMaxWidth - (totalSlots - 1) * gap) / totalSlots);
    const slotSize = Math.min(88, Math.max(45, computedSize));
    container.style.setProperty('--slot-size', `${slotSize}px`);

    arr.forEach((val, idx) => {
        const slot = document.createElement('div');
        slot.className = 'array-slot';

        // Check if active or operation highlight
        if (step.activeSlots.includes(idx)) {
            slot.classList.add('active-operation');
        }

        // Check if sorted element in Bubble sort
        if (step.sortedRange && step.sortedRange.includes(idx)) {
            slot.style.backgroundColor = '#dcfce7'; // Light green for sorted
            slot.style.borderColor = '#22c55e';
        }

        // Check if grayed out / eliminated range in Binary search
        if (step.grayedRange && step.grayedRange.includes(idx)) {
            slot.style.opacity = '0.3';
        }

        // Value & Index
        const valEl = document.createElement('span');
        valEl.className = 'slot-value';
        valEl.innerText = val;

        const idxEl = document.createElement('span');
        idxEl.className = 'slot-index';
        idxEl.innerText = idx;

        slot.appendChild(valEl);
        slot.appendChild(idxEl);

        // Append pointer annotations if any point to this index
        const ptrNames = [];
        Object.keys(step.pointers).forEach(ptrKey => {
            if (step.pointers[ptrKey] === idx) {
                ptrNames.push(ptrKey);
            }
        });

        if (ptrNames.length > 0) {
            const pointersContainer = document.createElement('div');
            pointersContainer.className = 'slot-pointers';

            const marker = document.createElement('div');
            marker.className = 'pointer-marker';

            const label = document.createElement('div');
            label.className = 'pointer-label';
            // Combine multiple pointers pointing to the same index into a single, clean label
            label.innerText = ptrNames.join(currentLang === 'ar' ? '، ' : ', ');

            // Create SVG arrow pointing down
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'pointer-arrow-svg');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 20 20');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'arrow-shaft');
            path.setAttribute('d', 'M10,0 L10,12');

            const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            poly.setAttribute('class', 'arrow-head');
            poly.setAttribute('points', '6,10 10,18 14,10');

            svg.appendChild(path);
            svg.appendChild(poly);

            marker.appendChild(label);
            marker.appendChild(svg);
            pointersContainer.appendChild(marker);
            slot.appendChild(pointersContainer);
        }

        row.appendChild(slot);
    });

    // Add virtual fading slots for Implicit Array demo
    if (step.isImplicit) {
        // Fading 1
        const f1 = document.createElement('div');
        f1.className = 'array-slot slot-fading-1';
        const val1 = document.createElement('span');
        val1.className = 'slot-value';
        val1.innerText = '?';
        const idx1 = document.createElement('span');
        idx1.className = 'slot-index';
        idx1.innerText = '5';
        f1.appendChild(val1);
        f1.appendChild(idx1);
        
        // Add pointer to fading index 5 if active
        if (step.pointers.ptr === 5) {
            const f1Pointers = document.createElement('div');
            f1Pointers.className = 'slot-pointers';
            const marker = document.createElement('div');
            marker.className = 'pointer-marker';
            const label = document.createElement('div');
            label.className = 'pointer-label';
            label.innerText = 'ptr';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'pointer-arrow-svg');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 20 20');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'arrow-shaft');
            path.setAttribute('d', 'M10,0 L10,12');
            
            const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            poly.setAttribute('class', 'arrow-head');
            poly.setAttribute('points', '6,10 10,18 14,10');
            
            svg.appendChild(path);
            svg.appendChild(poly);
            marker.appendChild(label);
            marker.appendChild(svg);
            f1Pointers.appendChild(marker);
            f1.appendChild(f1Pointers);
        }
        row.appendChild(f1);

        // Fading 2
        const f2 = document.createElement('div');
        f2.className = 'array-slot slot-fading-2';
        const val2 = document.createElement('span');
        val2.className = 'slot-value';
        val2.innerText = '?';
        const idx2 = document.createElement('span');
        idx2.className = 'slot-index';
        idx2.innerText = '6';
        f2.appendChild(val2);
        f2.appendChild(idx2);
        row.appendChild(f2);

        // Fading 3
        const f3 = document.createElement('div');
        f3.className = 'array-slot slot-fading-3';
        const val3 = document.createElement('span');
        val3.className = 'slot-value';
        val3.innerText = '...';
        const idx3 = document.createElement('span');
        idx3.className = 'slot-index';
        idx3.innerText = 'n';
        f3.appendChild(val3);
        f3.appendChild(idx3);
        row.appendChild(f3);
    }

    container.appendChild(row);
    visualArena.appendChild(container);

    // 5. Update Control Buttons State
    btnPrev.disabled = (currentStep === 0);
    btnNext.disabled = (currentStep === trace.length - 1);
}

// Shows "Unsupported Code" layout inside visual battlefield
function showUnsupportedPlaceholder() {
    visualArena.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'unsupported-visualization-placeholder';

    const title = document.createElement('div');
    title.className = 'unsupported-title';
    title.setAttribute('data-key', 'unsupported-title');
    title.innerText = translations[currentLang]['unsupported-title'];

    const desc = document.createElement('p');
    desc.className = 'unsupported-desc';
    desc.setAttribute('data-key', 'unsupported-desc');
    desc.innerText = translations[currentLang]['unsupported-desc'];

    placeholder.appendChild(title);
    placeholder.appendChild(desc);
    visualArena.appendChild(placeholder);

    // Disable execution step buttons since we are unsupported
    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnPlayPause.innerText = '▶️';
    isPlaying = false;
    clearInterval(simulationInterval);
    speedLines.classList.remove('active');
}

// ----------------------------------------------------
// TRANSLATION ENGINE & UI UPDATE
// ----------------------------------------------------
function updateLanguageUI(lang) {
    currentLang = lang;
    const isRtl = (lang === 'ar');

    // Document styling configuration
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    // Translate statically tagged elements
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update preset option texts inside select
    const presetOptions = presetSelect.querySelectorAll('option');
    presetOptions.forEach(opt => {
        const key = opt.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            opt.text = translations[lang][key];
        }
    });

    // Set toggle label texts
    if (isRtl) {
        soundToggle.innerText = soundEnabled ? '🔊 صوت: تفعيل' : '🔇 صامت';
        langToggle.innerText = '🌐 English';
    } else {
        soundToggle.innerText = soundEnabled ? '🔊 SOUND ON' : '🔇 MUTED';
        langToggle.innerText = '🌐 العربية';
    }

    // Refresh simulation status text / arena to match language
    const currentTrace = traces[currentPreset];
    if (currentTrace && currentTrace[currentStep]) {
        renderStep(currentStep);
    }
}

// Load default presets code into the editor and populate param fields
function loadPreset(presetKey) {
    currentPreset = presetKey;
    currentStep = 0;
    
    // Clear playback interval
    if (isPlaying) {
        isPlaying = false;
        clearInterval(simulationInterval);
        btnPlayPause.innerText = '▶️';
        speedLines.classList.remove('active');
    }

    // Sync input code (read-only display)
    codeInput.value = presetCodes[activeTab][presetKey];
    syncLineNumbers();
    
    // Select option in dropdown if not already selected
    presetSelect.value = presetKey;

    // Populate parameter fields from preset defaults
    const params = presetParams[presetKey];
    const arrField = document.getElementById('param-arr');
    const targetField = document.getElementById('param-target');
    const targetWrapper = document.getElementById('param-field-target');

    if (arrField && params) {
        arrField.value = params.arr.join(', ');
    }
    if (targetField && params) {
        targetField.value = params.showTarget ? params.target : '';
    }
    // Show/hide target field based on algorithm
    if (targetWrapper) {
        if (params && params.showTarget) {
            targetWrapper.classList.remove('hidden');
        } else {
            targetWrapper.classList.add('hidden');
        }
    }

    // Generate trace from param fields
    updateTraceFromParams();
}

// ----------------------------------------------------
// CONTROLS & EVENTS REGISTRATION
// ----------------------------------------------------
function registerEvents() {
    // 1. Language Toggle
    langToggle.addEventListener('click', () => {
        playSlashSound();
        drawScreenSlash();
        const nextLang = (currentLang === 'ar') ? 'en' : 'ar';
        updateLanguageUI(nextLang);
    });

    // 2. Sound Toggle
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        playSlashSound();
        if (currentLang === 'ar') {
            soundToggle.innerText = soundEnabled ? '🔊 صوت: تفعيل' : '🔇 صامت';
        } else {
            soundToggle.innerText = soundEnabled ? '🔊 SOUND ON' : '🔇 MUTED';
        }
        if (soundEnabled) {
            soundToggle.classList.remove('muted');
        } else {
            soundToggle.classList.add('muted');
        }
    });

    // 3. Tab Buttons (Python vs JS)
    btnPython.addEventListener('click', () => {
        if (activeTab === 'python') return;
        playSlashSound();
        btnPython.classList.add('active');
        btnJS.classList.remove('active');
        activeTab = 'python';
        loadPreset(currentPreset);
    });

    btnJS.addEventListener('click', () => {
        if (activeTab === 'js') return;
        playSlashSound();
        btnJS.classList.add('active');
        btnPython.classList.remove('active');
        activeTab = 'js';
        loadPreset(currentPreset);
    });

    // 4. Preset Selector dropdown
    presetSelect.addEventListener('change', () => {
        playSlashSound();
        loadPreset(presetSelect.value);
    });

    // 5. Parameter field input listeners (re-generate trace on change)
    const paramArr = document.getElementById('param-arr');
    const paramTarget = document.getElementById('param-target');

    if (paramArr) {
        paramArr.addEventListener('input', () => {
            currentStep = 0;
            updateTraceFromParams();
        });
    }
    if (paramTarget) {
        paramTarget.addEventListener('input', () => {
            currentStep = 0;
            updateTraceFromParams();
        });
    }

    // Code editor scroll sync (read-only, but still scrollable)
    codeInput.addEventListener('scroll', () => {
        lineNumbersContainer.scrollTop = codeInput.scrollTop;
    });

    // 6. Execution controls: Next, Prev, Reset, Play/Pause
    btnNext.addEventListener('click', () => {
        const trace = traces[currentPreset];
        if (currentStep < trace.length - 1) {
            currentStep++;
            renderStep(currentStep);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep(currentStep);
        }
    });

    btnReset.addEventListener('click', () => {
        playSlashSound();
        currentStep = 0;
        if (isPlaying) {
            isPlaying = false;
            clearInterval(simulationInterval);
            btnPlayPause.innerText = '▶️';
            speedLines.classList.remove('active');
        }
        renderStep(0);
    });

    btnPlayPause.addEventListener('click', () => {
        playSlashSound();
        if (isPlaying) {
            // Pause
            isPlaying = false;
            clearInterval(simulationInterval);
            btnPlayPause.innerText = '▶️';
            speedLines.classList.remove('active');
        } else {
            // Play
            isPlaying = true;
            btnPlayPause.innerText = '⏸️';
            speedLines.classList.add('active');
            
            const trace = traces[currentPreset];
            // If already at end, reset to step 0
            if (currentStep >= trace.length - 1) {
                currentStep = 0;
                renderStep(0);
            }

            simulationInterval = setInterval(() => {
                if (currentStep < trace.length - 1) {
                    currentStep++;
                    renderStep(currentStep);
                } else {
                    // Loop completed - stop play
                    isPlaying = false;
                    clearInterval(simulationInterval);
                    btnPlayPause.innerText = '▶️';
                    speedLines.classList.remove('active');
                }
            }, 1800);
        }
    });
}

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
function init() {
    // Default configuration (RTL - Arabic)
    updateLanguageUI('ar');

    // Register UI & simulation events
    registerEvents();

    // Load initial preset (Linear search)
    loadPreset('linear');
}

// Start visualizer on page load
document.addEventListener('DOMContentLoaded', init);
