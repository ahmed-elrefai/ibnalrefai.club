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
let traces = null;

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
        'sound-off-text': 'صوت: كتم'
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
        'sound-off-text': 'MUTED'
    }
};

// Preset Codes
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
        implicit: `# مصفوفة غير محددة الحجم // Implicit Size Array
arr = [10, 20, 30, 40, 50, ...]
val0 = arr[0] # الوصول للفهرس 0
val3 = arr[3] # الوصول للفهرس 3
val5 = arr[5] # وصول الفهرس 5 (ديناميكي)`
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
        implicit: `// مصفوفة غير محددة الحجم // Implicit Size Array
const arr = [10, 20, 30, 40, 50, ...];
const val0 = arr[0]; // الوصول للفهرس 0
const val3 = arr[3]; // الوصول للفهرس 3
const val5 = arr[5]; // وصول الفهرس 5 (ديناميكي)`
    }
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
// TRACE GENERATION (Simulation Database)
// ----------------------------------------------------
function getTraceDatabase() {
    return {
        linear: [
            {
                linePy: 1, lineJs: 1,
                statusAr: "تم تهيئة البحث الخطي. سنبحث عن الرقم 7 في المصفوفة [12, 5, 8, 19, 3, 7, 21].",
                statusEn: "Linear search initialized. We will search for target 7 in the array [12, 5, 8, 19, 3, 7, 21].",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: {},
                activeSlots: [],
                variables: { target: 7 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "بدء الحلقة التكرارية. فحص العنصر الأول عند الفهرس i = 0.",
                statusEn: "Starting loop. Checking first element at index i = 0.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 0 },
                activeSlots: [0],
                variables: { target: 7, i: 0 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "هل القيمة 12 تساوي 7؟ لا. سنستمر في البحث.",
                statusEn: "Does 12 equal 7? No. Continuing the search.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 0 },
                activeSlots: [0],
                variables: { target: 7, i: 0 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "الانتقال للعنصر التالي عند الفهرس i = 1.",
                statusEn: "Moving to the next element at index i = 1.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 1 },
                activeSlots: [1],
                variables: { target: 7, i: 1 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "هل القيمة 5 تساوي 7؟ لا. سنستمر في البحث.",
                statusEn: "Does 5 equal 7? No. Continuing the search.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 1 },
                activeSlots: [1],
                variables: { target: 7, i: 1 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "الانتقال للعنصر التالي عند الفهرس i = 2.",
                statusEn: "Moving to the next element at index i = 2.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 2 },
                activeSlots: [2],
                variables: { target: 7, i: 2 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "هل القيمة 8 تساوي 7؟ لا. سنستمر في البحث.",
                statusEn: "Does 8 equal 7? No. Continuing the search.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 2 },
                activeSlots: [2],
                variables: { target: 7, i: 2 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "الانتقال للعنصر التالي عند الفهرس i = 3.",
                statusEn: "Moving to the next element at index i = 3.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 3 },
                activeSlots: [3],
                variables: { target: 7, i: 3 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "هل القيمة 19 تساوي 7؟ لا. سنستمر في البحث.",
                statusEn: "Does 19 equal 7? No. Continuing the search.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 3 },
                activeSlots: [3],
                variables: { target: 7, i: 3 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "الانتقال للعنصر التالي عند الفهرس i = 4.",
                statusEn: "Moving to the next element at index i = 4.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 4 },
                activeSlots: [4],
                variables: { target: 7, i: 4 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "هل القيمة 3 تساوي 7؟ لا. سنستمر في البحث.",
                statusEn: "Does 3 equal 7? No. Continuing the search.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 4 },
                activeSlots: [4],
                variables: { target: 7, i: 4 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "الانتقال للعنصر التالي عند الفهرس i = 5.",
                statusEn: "Moving to the next element at index i = 5.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 5 },
                activeSlots: [5],
                variables: { target: 7, i: 5 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "مقارنة العنصر: هل القيمة 7 تساوي 7؟ نعم! لقد وجدنا الهدف.",
                statusEn: "Comparing element: Does value 7 equal 7? Yes! Target found.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 5 },
                activeSlots: [5],
                variables: { target: 7, i: 5 },
                isSuccess: true
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "إرجاع الفهرس 5 كـ نتيجة نجاح للبحث.",
                statusEn: "Returning index 5 as successful search result.",
                array: [12, 5, 8, 19, 3, 7, 21],
                pointers: { i: 5 },
                activeSlots: [5],
                variables: { target: 7, i: 5, result: 5 },
                isSuccess: true
            }
        ],
        binary: [
            {
                linePy: 1, lineJs: 1,
                statusAr: "تم تهيئة البحث الثنائي للبحث عن الهدف 23 في مصفوفة مرتبة.",
                statusEn: "Binary search initialized. We will search for target 23 in a sorted array.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: {},
                activeSlots: [],
                variables: { target: 23 }
            },
            {
                linePy: 2, lineJs: 2,
                statusAr: "تعيين المؤشر الأيسر left = 0.",
                statusEn: "Setting left boundary pointer left = 0.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0 },
                activeSlots: [],
                variables: { target: 23, left: 0 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "تعيين المؤشر الأيمن right = 8 (آخر عنصر في المصفوفة).",
                statusEn: "Setting right boundary pointer right = 8 (last element).",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0, right: 8 },
                activeSlots: [],
                variables: { target: 23, left: 0, right: 8 }
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "التحقق من شرط حلقة التكرار: هل left (0) <= right (8)؟ نعم.",
                statusEn: "Checking loop condition: Is left (0) <= right (8)? Yes.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0, right: 8 },
                activeSlots: [],
                variables: { target: 23, left: 0, right: 8 }
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "حساب مؤشر المنتصف: mid = (left + right) // 2 = (0 + 8) // 2 = 4.",
                statusEn: "Calculating middle pointer: mid = (left + right) // 2 = 4.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0, right: 8, mid: 4 },
                activeSlots: [4],
                variables: { target: 23, left: 0, right: 8, mid: 4 }
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "مقارنة القيمة الوسطى: هل arr[mid] (16) تساوي 23؟ لا.",
                statusEn: "Comparing middle value: Does arr[mid] (16) equal 23? No.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0, right: 8, mid: 4 },
                activeSlots: [4],
                variables: { target: 23, left: 0, right: 8, mid: 4 }
            },
            {
                linePy: 8, lineJs: 8,
                statusAr: "هل القيمة الوسطى arr[mid] (16) أصغر من 23؟ نعم. النصف الأيسر مستبعد.",
                statusEn: "Is arr[mid] (16) < 23? Yes. Eliminating the left half.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 0, right: 8, mid: 4 },
                activeSlots: [4],
                variables: { target: 23, left: 0, right: 8, mid: 4 },
                grayedRange: [0, 4]
            },
            {
                linePy: 9, lineJs: 9,
                statusAr: "تحديث المؤشر الأيسر ليصبح left = mid + 1 = 5.",
                statusEn: "Updating left pointer to left = mid + 1 = 5.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 8 },
                activeSlots: [],
                variables: { target: 23, left: 5, right: 8 },
                grayedRange: [0, 4]
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "التحقق من شرط حلقة التكرار: هل left (5) <= right (8)؟ نعم.",
                statusEn: "Checking loop condition: Is left (5) <= right (8)? Yes.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 8 },
                activeSlots: [],
                variables: { target: 23, left: 5, right: 8 },
                grayedRange: [0, 4]
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "حساب مؤشر المنتصف الجديد: mid = (5 + 8) // 2 = 6.",
                statusEn: "Calculating new middle pointer: mid = (5 + 8) // 2 = 6.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 8, mid: 6 },
                activeSlots: [6],
                variables: { target: 23, left: 5, right: 8, mid: 6 },
                grayedRange: [0, 4]
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "مقارنة القيمة الوسطى: هل arr[mid] (38) تساوي 23؟ لا.",
                statusEn: "Comparing middle value: Does arr[mid] (38) equal 23? No.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 8, mid: 6 },
                activeSlots: [6],
                variables: { target: 23, left: 5, right: 8, mid: 6 },
                grayedRange: [0, 4]
            },
            {
                linePy: 8, lineJs: 8,
                statusAr: "هل arr[mid] (38) أصغر من 23؟ لا. وبالتالي هي أكبر. النصف الأيمن مستبعد.",
                statusEn: "Is arr[mid] (38) < 23? No. Thus it is larger. Eliminating the right half.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 8, mid: 6 },
                activeSlots: [6],
                variables: { target: 23, left: 5, right: 8, mid: 6 },
                grayedRange: [0, 4, 6, 8]
            },
            {
                linePy: 11, lineJs: 11,
                statusAr: "تحديث المؤشر الأيمن ليصبح right = mid - 1 = 5.",
                statusEn: "Updating right pointer to right = mid - 1 = 5.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 5 },
                activeSlots: [],
                variables: { target: 23, left: 5, right: 5 },
                grayedRange: [0, 4, 6, 8]
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "التحقق من شرط حلقة التكرار: هل left (5) <= right (5)؟ نعم.",
                statusEn: "Checking loop condition: Is left (5) <= right (5)? Yes.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 5 },
                activeSlots: [],
                variables: { target: 23, left: 5, right: 5 },
                grayedRange: [0, 4, 6, 8]
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "حساب مؤشر المنتصف: mid = (5 + 5) // 2 = 5.",
                statusEn: "Calculating middle pointer: mid = (5 + 5) // 2 = 5.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 5, mid: 5 },
                activeSlots: [5],
                variables: { target: 23, left: 5, right: 5, mid: 5 },
                grayedRange: [0, 4, 6, 8]
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "هل arr[mid] (23) تساوي الهدف 23؟ نعم! لقد عثرنا على الهدف.",
                statusEn: "Does arr[mid] (23) equal target 23? Yes! Target found.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 5, mid: 5 },
                activeSlots: [5],
                variables: { target: 23, left: 5, right: 5, mid: 5 },
                isSuccess: true,
                grayedRange: [0, 4, 6, 8]
            },
            {
                linePy: 7, lineJs: 7,
                statusAr: "إرجاع الفهرس 5 بنجاح.",
                statusEn: "Returning index 5 successfully.",
                array: [2, 5, 8, 12, 16, 23, 38, 56, 72],
                pointers: { left: 5, right: 5, mid: 5 },
                activeSlots: [5],
                variables: { target: 23, left: 5, right: 5, mid: 5, result: 5 },
                isSuccess: true,
                grayedRange: [0, 4, 6, 8]
            }
        ],
        bubble: [
            {
                linePy: 1, lineJs: 1,
                statusAr: "فرز الفقاعات مجهّز لترتيب المصفوفة تصاعدياً: [5, 1, 4, 2, 8].",
                statusEn: "Bubble sort initialized to sort array in ascending order: [5, 1, 4, 2, 8].",
                array: [5, 1, 4, 2, 8],
                pointers: {},
                activeSlots: [],
                variables: {}
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "بدء المرور الخارجي i = 0.",
                statusEn: "Starting outer loop iteration i = 0.",
                array: [5, 1, 4, 2, 8],
                pointers: {},
                activeSlots: [],
                variables: { i: 0 }
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "بدء الحلقة الداخلية j = 0. مقارنة العنصرين 5 و 1.",
                statusEn: "Starting inner loop iteration j = 0. Comparing elements 5 and 1.",
                array: [5, 1, 4, 2, 8],
                pointers: { j: 0 },
                activeSlots: [0, 1],
                variables: { i: 0, j: 0 }
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "بما أن 5 > 1، يجب مبادلة العنصرين لترتيبهما.",
                statusEn: "Since 5 > 1, we must swap them to sort.",
                array: [5, 1, 4, 2, 8],
                pointers: { j: 0 },
                activeSlots: [0, 1],
                variables: { i: 0, j: 0 }
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "إجراء عملية المبادلة. أصبحت المصفوفة الآن: [1, 5, 4, 2, 8].",
                statusEn: "Performing swap. The array is now: [1, 5, 4, 2, 8].",
                array: [1, 5, 4, 2, 8],
                pointers: { j: 0 },
                activeSlots: [0, 1],
                variables: { i: 0, j: 0 },
                isSwap: true
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "الخطوة التالية j = 1. مقارنة العنصرين 5 و 4.",
                statusEn: "Next step j = 1. Comparing elements 5 and 4.",
                array: [1, 5, 4, 2, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 0, j: 1 }
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "بما أن 5 > 4، يجب مبادلة العنصرين.",
                statusEn: "Since 5 > 4, we must swap them.",
                array: [1, 5, 4, 2, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 0, j: 1 }
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "إجراء المبادلة. أصبحت المصفوفة الآن: [1, 4, 5, 2, 8].",
                statusEn: "Performing swap. The array is now: [1, 4, 5, 2, 8].",
                array: [1, 4, 5, 2, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 0, j: 1 },
                isSwap: true
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "الخطوة التالية j = 2. مقارنة العنصرين 5 و 2.",
                statusEn: "Next step j = 2. Comparing elements 5 and 2.",
                array: [1, 4, 5, 2, 8],
                pointers: { j: 2 },
                activeSlots: [2, 3],
                variables: { i: 0, j: 2 }
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "بما أن 5 > 2، يجب مبادلة العنصرين.",
                statusEn: "Since 5 > 2, we must swap them.",
                array: [1, 4, 5, 2, 8],
                pointers: { j: 2 },
                activeSlots: [2, 3],
                variables: { i: 0, j: 2 }
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "إجراء المبادلة. أصبحت المصفوفة الآن: [1, 4, 2, 5, 8].",
                statusEn: "Performing swap. The array is now: [1, 4, 2, 5, 8].",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 2 },
                activeSlots: [2, 3],
                variables: { i: 0, j: 2 },
                isSwap: true
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "الخطوة التالية j = 3. مقارنة العنصرين 5 و 8.",
                statusEn: "Next step j = 3. Comparing elements 5 and 8.",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 3 },
                activeSlots: [3, 4],
                variables: { i: 0, j: 3 }
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "هل 5 > 8؟ لا. لا تحتاج المصفوفة لمبادلة هنا.",
                statusEn: "Is 5 > 8? No. No swap needed here.",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 3 },
                activeSlots: [3, 4],
                variables: { i: 0, j: 3 }
            },
            {
                linePy: 3, lineJs: 3,
                statusAr: "انتهى المرور الأول. العنصر الأكبر 8 استقر في الفهرس الأخير. بدء المرور i = 1.",
                statusEn: "First pass complete. Largest element 8 settled at the last index. Starting pass i = 1.",
                array: [1, 4, 2, 5, 8],
                pointers: {},
                activeSlots: [],
                variables: { i: 1 },
                sortedRange: [4]
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "مقارنة جولة i=1، الفهرس j = 0: هل 1 > 4؟ لا. لا مبادلة.",
                statusEn: "Pass i=1, compare j = 0: Is 1 > 4? No. No swap.",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 0 },
                activeSlots: [0, 1],
                variables: { i: 1, j: 0 },
                sortedRange: [4]
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "الانتقال إلى الفهرس j = 1: مقارنة 4 و 2.",
                statusEn: "Moving to index j = 1: Comparing 4 and 2.",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 1, j: 1 },
                sortedRange: [4]
            },
            {
                linePy: 5, lineJs: 5,
                statusAr: "بما أن 4 > 2، يجب مبادلة العنصرين.",
                statusEn: "Since 4 > 2, we must swap them.",
                array: [1, 4, 2, 5, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 1, j: 1 },
                sortedRange: [4]
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "إجراء المبادلة. أصبحت المصفوفة الآن: [1, 2, 4, 5, 8].",
                statusEn: "Performing swap. The array is now: [1, 2, 4, 5, 8].",
                array: [1, 2, 4, 5, 8],
                pointers: { j: 1 },
                activeSlots: [1, 2],
                variables: { i: 1, j: 1 },
                isSwap: true,
                sortedRange: [4]
            },
            {
                linePy: 7, lineJs: 7,
                statusAr: "اكتمل فرز المصفوفة تصاعدياً بنجاح! جميع العناصر مرتبة.",
                statusEn: "Bubble sort completed successfully! All elements are sorted.",
                array: [1, 2, 4, 5, 8],
                pointers: {},
                activeSlots: [],
                variables: {},
                isSuccess: true,
                sortedRange: [0, 1, 2, 3, 4]
            }
        ],
        implicit: [
            {
                linePy: 2, lineJs: 2,
                statusAr: "تهيئة مصفوفة غير محددة الحجم. تظهر العناصر الخمسة الأولى، بينما تتلاشى بقية المساحة.",
                statusEn: "Initializing Implicit Size Array. The first five elements are shown, while the rest fades.",
                array: [10, 20, 30, 40, 50],
                pointers: {},
                activeSlots: [],
                variables: {},
                isImplicit: true
            },
            {
                linePy: 4, lineJs: 4,
                statusAr: "قراءة العنصر عند الفهرس 0: القيمة هي 10.",
                statusEn: "Reading element at index 0: Value is 10.",
                array: [10, 20, 30, 40, 50],
                pointers: { ptr: 0 },
                activeSlots: [0],
                variables: { index: 0, val: 10 },
                isImplicit: true
            },
            {
                linePy: 6, lineJs: 6,
                statusAr: "الوصول المباشر للعنصر عند الفهرس 3: القيمة هي 40.",
                statusEn: "Directly accessing element at index 3: Value is 40.",
                array: [10, 20, 30, 40, 50],
                pointers: { ptr: 3 },
                activeSlots: [3],
                variables: { index: 3, val: 40 },
                isImplicit: true
            },
            {
                linePy: 8, lineJs: 8,
                statusAr: "الوصول إلى الفهرس 5 (في المنطقة الافتراضية المتلاشية). هذا يوضح كيف يمكن للمصفوفة أن تنمو ديناميكياً.",
                statusEn: "Accessing index 5 (inside the virtual fading zone). This illustrates how the array expands dynamically.",
                array: [10, 20, 30, 40, 50],
                pointers: { ptr: 5 },
                activeSlots: [5],
                variables: { index: 5, val: "..." },
                isImplicit: true,
                isSuccess: true
            }
        ]
    };
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

            ptrNames.forEach(name => {
                const marker = document.createElement('div');
                marker.className = 'pointer-marker';

                const label = document.createElement('div');
                label.className = 'pointer-label';
                label.innerText = name;

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
            });
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

// Load default presets code into the editor
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

    // Sync input code
    codeInput.value = presetCodes[activeTab][presetKey];
    syncLineNumbers();
    
    // Select option in dropdown if not already selected
    presetSelect.value = presetKey;

    // Render step 0
    renderStep(0);
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

    // 5. Code Editor scroll synchronization and manual edits
    codeInput.addEventListener('input', () => {
        syncLineNumbers();
        
        // Try to match preset
        const matched = validateAndMatchPreset();
        if (matched) {
            if (currentPreset !== matched) {
                currentPreset = matched;
                currentStep = 0;
                presetSelect.value = matched;
            }
            renderStep(currentStep);
        } else {
            showUnsupportedPlaceholder();
        }
    });

    codeInput.addEventListener('scroll', () => {
        lineNumbersContainer.scrollTop = codeInput.scrollTop;
    });

    // Handle Tab key inside editor
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeInput.selectionStart;
            const end = codeInput.selectionEnd;
            const value = codeInput.value;
            codeInput.value = value.substring(0, start) + "    " + value.substring(end);
            codeInput.selectionStart = codeInput.selectionEnd = start + 4;
            syncLineNumbers();
        }
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
    // Generate static simulation traces database
    traces = getTraceDatabase();

    // Default configuration (RTL - Arabic)
    updateLanguageUI('ar');

    // Register UI & simulation events
    registerEvents();

    // Load initial preset (Linear search)
    loadPreset('linear');
}

// Start visualizer on page load
document.addEventListener('DOMContentLoaded', init);
