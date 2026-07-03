// ----------------------------------------------------
// TRANSLATION DICTIONARY
// ----------------------------------------------------
let currentLang = 'ar'; // Default language

const translations = {
    ar: {
        'nav-home': 'الرئيسية',
        'nav-manga': 'المشاريع',
        'nav-stats': 'الترويج',
        'nav-about': 'عني',
        'nav-arena': 'تحدي سرعة الكتابة',
        'btn-coffee': '☕ ادعمنا',
        'bg-brush-1': 'عزيمة',
        'bg-brush-2': 'الوحش',
        'hero-name-label': 'أحمد الرفاعي',
        'hero-role-label': 'صانع البرمجيات',
        'hero-main-title': 'البرمجة طاقة وتأثير',
        'hero-philosophy': 'أطور برمجيات عالية الكفاءة لمساعدة المحلات والشركات المحلية في مصر على النمو والتطور.',
        'hero-status': 'خريج حاسبات عين شمس // مؤسس E5traat',
        'panel-label-stats': 'بطاقة القوة',
        'badge-rank': 'الرتبة: SSS',
        'badge-class': 'الفئة: بايثون',
        'btn-be-cool': 'كن رائعاً!',
        'btn-contact': 'اتصل بنا',
        'projects-title': 'مشاريع البرمجة',
        'p1-header': 'المشروع 01 // [CSHub]',
        'p1-title': 'CSHub (مشروع التخرج)',
        'p1-desc': 'قائد هندسة الخلفية والذكاء الاصطناعي. قمنا ببناء معالج صوتي لتلخيص الاجتماعات ومحلل أكواد برمجية معقدة بتقنية شجرة البناء المجردة.',
        'p2-header': 'المشروع 02 // [محرك إيسترات]',
        'p2-title': 'محرك E5traat التجاري',
        'p2-desc': 'منصة تجارة وتحليلات ذكية متعددة المستأجرين لمساعدة المحلات التجارية والشركات الصغيرة في مصر على التطور وإدارة المبيعات بكفاءة.',
        'p3-header': 'المشروع 03 // [طريق العودة للديار]',
        'p3-title': 'Way Back Home (سحابي)',
        'p3-desc': 'مشروع سحابي متطور لتصميم وبناء نموذج توليد نصوص مدعم باسترجاع معتمد على الرسوم البيانية (Graph-RAG).',
        'p4-header': 'المشروع 04 // [ريزوميزر]',
        'p4-title': 'Resumizer (معالج السير الذاتية)',
        'p4-desc': 'تطبيق واجهة خلفية مبني على معالجة اللغات الطبيعية (NLP) لاستقبال السير الذاتية وتحليلها وتلخيصها بكفاءة عالية.',
        'p5-header': 'المشروع 05 // [أوتو بي دي إف]',
        'p5-title': 'Auto PDF (ميكنة التقارير)',
        'p5-desc': 'أداة مساعدة خفيفة للمطورين لأتمتة سحب البيانات من ملفات CSV وتحويلها إلى تقارير PDF منسقة وجميلة.',
        'arena-title': 'تحدي سرعة الكتابة',
        'arena-subtitle': 'اختبر مهارتك وسرعتك في البرمجة',
        'arena-desc': '"أنا أحمد الرفاعي، وأؤمن بأن سرعة الكتابة والإنتاجية هما مفتاح التميز البرمجي. اختبر سرعتك وتعرف على مستواك الحقيقي."',
        'hud-wpm': 'الكلمات/الدقيقة',
        'hud-accuracy': 'الدقة',
        'hud-timer': 'الوقت المتبقي',
        'hud-timer-unlimited': 'الوقت المنقضي',
        'hud-streak': 'الضربات المتتالية',
        'input-placeholder': 'ابدأ بكتابة الكلمة الأولى واضغط مسافة لتشغيل المؤقت...',
        'btn-reset': 'إعادة المحاولة',
        'select-label': 'اختر نمط التحدي:',
        'rank-heading': 'التقييم النهائي',
        'rank-wpm-label': 'السرعة:',
        'rank-acc-label': 'الدقة:',
        'rank-time-label': 'الوقت المستغرق:',
        'rank-btn-close': 'تابع التدريب',
        'footer-desc': 'نطور برمجيات للمستقبل، ونبني حلولاً مخصصة لتمكين الأعمال.',
        'f-ranks-title': 'مستويات التقييم',
        'footer-copy': '© 2026 احمد الرفاعي. جميع الحقوق محفوظة. // تصميم وتطوير محرك التقييم',
        'modal-signin-title': 'تسجيل الدخول',
        'modal-signup-title': 'إنشاء حساب جديد',
        'label-username': 'اسم المستخدم / البريد الإلكتروني',
        'label-password': 'كلمة المرور',
        'label-fullname': 'الاسم الكامل',
        'label-confirm-password': 'تأكيد كلمة المرور',
        'btn-signin-submit': 'دخول',
        'btn-signup-submit': 'إنشاء الحساب',
        'test-type-label': 'نوع التحدي:',
        'opt-code': 'كود برمجي (بايثون)',
        'opt-text': 'نص عادي',
        'nav-contact': 'تواصل معي',
        'contact-title': 'تواصل معي',
        'contact-subtitle': 'مهتم بالعمل معي لبناء مشروعك؟ أرسل تفاصيل مشروعك وسأرد عليك قريباً.',
        'label-email': 'البريد الإلكتروني',
        'label-subject': 'الموضوع',
        'label-message': 'تفاصيل المشروع / الرسالة',
        'btn-submit-contact': 'إرسال الرسالة',
        'email-placeholder': 'بريدك الإلكتروني...',
        'subject-placeholder': 'طلب مشروع جديد، عمل، إلخ...',
        'message-placeholder': 'اكتب تفاصيل مشروعك أو فكرتك وسأتواصل معك في أقرب وقت...'
    },
    en: {
        'nav-home': 'HOME',
        'nav-manga': 'PROJECTS',
        'nav-stats': 'PROMO',
        'nav-about': 'ABOUT ME',
        'nav-arena': 'TYPING TEST',
        'btn-coffee': '☕ Buy Me a Coffee',
        'bg-brush-1': 'WILLPOWER',
        'bg-brush-2': 'BEAST',
        'hero-name-label': 'AHMED ELREFAI',
        'hero-role-label': 'SOFTWARE CREATOR',
        'hero-main-title': 'HIGH-ENERGY CODE',
        'hero-philosophy': 'I build high-performance backend systems to optimize, scale, and level up local businesses in Egypt.',
        'hero-status': 'Ain Shams CS Graduate (2026) // Founder of E5traat',
        'panel-label-stats': 'BATTLE STATS',
        'badge-rank': 'RANK: SSS',
        'badge-class': 'CLASS: PYTHON',
        'btn-be-cool': 'BE COOL!',
        'btn-contact': 'CONTACT ME',
        'projects-title': 'PROGRAMMING PROJECTS',
        'p1-header': 'PROJECT 01 // [CSHub]',
        'p1-title': 'CSHub (Graduation Project)',
        'p1-desc': 'Lead backend & AI pipeline engineer. Built an automated audio speech transcriber and Abstract Syntax Tree (AST) code analyzer.',
        'p2-header': 'PROJECT 02 // [E5traat Engine]',
        'p2-title': 'E5traat Commerce Engine',
        'p2-desc': 'A multi-tenant commerce and semantic insights MVP platform helping small local Egyptian shops scale efficiently.',
        'p3-header': 'PROJECT 03 // [Way Back Home]',
        'p3-title': 'Way Back Home (Cloud RAG)',
        'p3-desc': 'A specialized cloud-native Graph-RAG pipeline deployed on Google Cloud Spanner using networkx for node-link mapping.',
        'p4-header': 'PROJECT 04 // [Resumizer]',
        'p4-title': 'Resumizer Parsing Engine',
        'p4-desc': 'FastAPI resume summarization API parsing natural text and extracting semantic insights, packaged inside Docker containers.',
        'p5-header': 'PROJECT 05 // [Auto PDF]',
        'p5-title': 'Auto PDF Document Pipeline',
        'p5-desc': 'Lightweight CLI/utility automating CSV ingestion and converting tabular data into styled PDF reports via HTML/CSS templates.',
        'arena-title': 'TYPING TEST',
        'arena-subtitle': 'TEST YOUR CODING SPEED',
        'arena-desc': '"I am Ahmed Elrefai, and I believe typing speed and productivity are key to engineering excellence. Test your speed and evaluate your level."',
        'hud-wpm': 'WORDS/MIN',
        'hud-accuracy': 'ACCURACY',
        'hud-timer': 'TIME REMAINING',
        'hud-timer-unlimited': 'ELAPSED TIME',
        'hud-streak': 'COMBO STREAK',
        'input-placeholder': 'Type the first word and press Space to start the countdown...',
        'btn-reset': 'RESET TEST',
        'select-label': 'SELECT CHALLENGE STYLE:',
        'rank-heading': 'FINAL EVALUATION',
        'rank-wpm-label': 'SPEED:',
        'rank-acc-label': 'ACCURACY:',
        'rank-time-label': 'TIME ELAPSED:',
        'rank-btn-close': 'CONTINUE TRAINING',
        'footer-desc': 'Engineering for the future, building custom solutions to empower businesses.',
        'f-ranks-title': 'EVALUATION LEVELS',
        'footer-copy': '© 2026 AHMED ELREFAI. ALL RIGHTS RESERVED. // DESIGN & ENGINE BY AHMED ELREFAI',
        'modal-signin-title': 'SIGN IN',
        'modal-signup-title': 'CREATE ACCOUNT',
        'label-username': 'USERNAME / EMAIL',
        'label-password': 'PASSWORD',
        'label-fullname': 'FULL NAME',
        'label-confirm-password': 'CONFIRM PASSWORD',
        'btn-signin-submit': 'SIGN IN',
        'btn-signup-submit': 'CREATE ACCOUNT',
        'test-type-label': 'CHALLENGE TYPE:',
        'opt-code': 'Coding (Python)',
        'opt-text': 'Regular Text',
        'nav-contact': 'CONTACT ME',
        'contact-title': 'CONTACT ME',
        'contact-subtitle': 'Interested in working with me to build your project? Send your details and I\'ll get back to you soon.',
        'label-email': 'Email Address',
        'label-subject': 'Subject',
        'label-message': 'Project Details / Message',
        'btn-submit-contact': 'SEND MESSAGE',
        'email-placeholder': 'Your email address...',
        'subject-placeholder': 'Project request, business inquiry, etc...',
        'message-placeholder': 'Describe your project or ideas and I will get back to you as soon as possible...'
    }
};

// Update dynamic options for quote select
function updateQuoteSelectOptions() {
    const typeSelect = document.getElementById('test-type-select');
    const quoteSelect = document.getElementById('quote-select');
    if (!typeSelect || !quoteSelect) return;

    const testType = typeSelect.value;
    const isRtl = (currentLang === 'ar');

    // Store current value to restore if possible
    const currentVal = quoteSelect.value;

    quoteSelect.innerHTML = '';

    if (testType === 'code') {
        const options = [
            { value: 'linear_search', textAr: 'البحث الخطي // Linear Search', textEn: 'Linear Search (Python)' },
            { value: 'binary_search', textAr: 'البحث الثنائي // Binary Search', textEn: 'Binary Search (Python)' },
            { value: 'bubble_sort', textAr: 'فرز الفقاعات // Bubble Sort', textEn: 'Bubble Sort (Python)' },
            { value: 'insertion_sort', textAr: 'فرز الإدخال // Insertion Sort', textEn: 'Insertion Sort (Python)' },
            { value: 'selection_sort', textAr: 'فرز الاختيار // Selection Sort', textEn: 'Selection Sort (Python)' },
            { value: 'merge_sort', textAr: 'فرز الدمج // Merge Sort', textEn: 'Merge Sort (Python)' },
            { value: 'kadane_algorithm', textAr: 'خوارزمية كادان // Kadane\'s Algorithm', textEn: 'Kadane\'s Algorithm (Python)' }
        ];
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.text = isRtl ? opt.textAr : opt.textEn;
            quoteSelect.appendChild(el);
        });
    } else {
        const options = [
            { value: 'samurai', textAr: 'أساسيات البرمجة // بايثون', textEn: 'Programming Basics // Python' },
            { value: 'beast', textAr: 'هندسة الأنظمة // FastAPI', textEn: 'System Engineering // FastAPI' },
            { value: 'speed', textAr: 'ميكنة وتدفق البيانات', textEn: 'Automation & Data Pipelines' }
        ];
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.text = isRtl ? opt.textAr : opt.textEn;
            quoteSelect.appendChild(el);
        });
    }

    // Restore value if valid
    if ([...quoteSelect.options].some(o => o.value === currentVal)) {
        quoteSelect.value = currentVal;
    } else {
        quoteSelect.selectedIndex = 0;
    }
}

// Switch language function
function setLanguage(lang) {
    currentLang = lang;
    const isRtl = (lang === 'ar');

    // Set HTML attribute direction and lang
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    // Update elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            // Check if element is an input or textarea with placeholder
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translations[lang][key]);
            } else {
                // Keep the structural span elements in BE COOL! button, submit button or logos
                const textNode = translations[lang][key];
                if (key === 'btn-be-cool' || key === 'btn-submit-contact') {
                    const btnTextSpan = el.querySelector('.btn-text');
                    if (btnTextSpan) {
                        btnTextSpan.innerText = textNode;
                    } else {
                        el.innerText = textNode;
                    }
                } else {
                    el.innerText = textNode;
                }
            }
        }
    });

    // Update quote selector options dynamically
    updateQuoteSelectOptions();

    if (isRtl) {
        soundToggle.innerText = soundEnabled ? '🔊 صوت: تفعيل' : '🔇 صامت';
        langToggle.innerText = '🌐 English';
    } else {
        soundToggle.innerText = soundEnabled ? '🔊 SOUND ON' : '🔇 MUTED';
        langToggle.innerText = '🌐 العربية';
    }

    // Update input field placeholder attributes
    const input = document.getElementById('typing-input');
    input.setAttribute('placeholder', translations[lang]['input-placeholder']);

    // Load a quote in the selected language
    loadNewQuote();

    // Update session header labels if initialized
    if (typeof checkUserSession === 'function') {
        checkUserSession();
    }
}

// ----------------------------------------------------
// SOUND SYNTHESIS ENGINE (Web Audio API)
// ----------------------------------------------------
let soundEnabled = true;
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

function playRankChime() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    playSlashSound();
    setTimeout(() => playSlashSound(), 150);

    const notes = [220, 261.63, 293.66, 329.63, 392];
    notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq * 2, now + idx * 0.1 + 0.5);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.2);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.2);
    });
}

// ----------------------------------------------------
// VISUAL INTERACTIVE ELEMENTS (Cursor & Canvas Slashes)
// ----------------------------------------------------
const customCursor = document.getElementById('custom-cursor');
const soundToggle = document.getElementById('sound-toggle');
const langToggle = document.getElementById('lang-toggle');
const slashCanvas = document.getElementById('slash-canvas');
const ctxSlash = slashCanvas.getContext('2d');

function resizeSlashCanvas() {
    slashCanvas.width = window.innerWidth;
    slashCanvas.height = window.innerHeight;
}
resizeSlashCanvas();
window.addEventListener('resize', resizeSlashCanvas);

// Cursor listeners disabled to restore standard performance

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

// Audio Toggle handler
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundToggle.innerText = currentLang === 'ar' ? '🔊 صوت: تفعيل' : '🔊 SOUND ON';
        soundToggle.classList.remove('muted');
        initAudio();
    } else {
        soundToggle.innerText = currentLang === 'ar' ? '🔇 صامت' : '🔇 MUTED';
        soundToggle.classList.add('muted');
    }
});

// Language Toggle handler
langToggle.addEventListener('click', () => {
    playSlashSound();
    drawScreenSlash();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
});

// "BE COOL!" Navigation & Slash Effect
const btnBeCool = document.getElementById('btn-be-cool');
btnBeCool.addEventListener('click', () => {
    playSlashSound();
    drawScreenSlash();
    setTimeout(() => {
        document.getElementById('typing-arena').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            document.getElementById('typing-input').focus();
        }, 800);
    }, 200);
});

// ----------------------------------------------------
// BILINGUAL QUOTES BANK
// ----------------------------------------------------
const quotesBank = {
    ar: {
        samurai: [
            "قال كينجي ذات مرة النصل الحاد لا يفيد بدون يد ثابتة. بايثون أداة قوية لكنها تتطلب مطورا يكتب كودا نظيفا وذكيا.",
            "السيف هو امتداد للروح والبدن. محرر نيو فيم هو امتداد لأصابع المبرمج. اقطع البطء واكتب بسرعة نصل كاتانا حاسم.",
            "مطور بايثون يرى الكود كلوحة فنية. نصلنا هو FastAPI وسرعتنا تقاس بالملي ثانية. صمم بدقة واضرب كالصاعقة."
        ],
        beast: [
            "محرك إيسترات هو وحش من التحليلات وقواعد البيانات متعددة المستأجرين لمساعدة المحلات المحلية على الارتقاء لأقصى حد.",
            "البرمجة ليست وظيفة مكتبية بل هي طاقة لتمكين الناس. أنا أصنع برمجيات مجانية للمحلات البسيطة لأوثق الرحلة للعالم.",
            "مشروع تخرجنا CSHub يدمج الذكاء الاصطناعي مع شجرة البناء المجردة للبرمجة. لا ترضى بالحلول البسيطة بل ابن وحشا تقنيا."
        ],
        speed: [
            "البيانات تتدفق بسرعة الضوء عبر قنوات ريديس وكافكا. وقاعدة بيانات سبانر تنسق حركة الرسوم البيانية بدقة متناهية.",
            "البرق يضرب دون سابق إنذار. محرك FastAPI يخدم آلاف الطلبات في الثواني المعدودة. ركز جيدا واضرب لوحة المفاتيح بقوة.",
            "أتمتة المهام تجعل العمليات المعقدة تتم بضغطة زر. ميكنة التقارير أوتو بي دي إف تخلصنا من العمل اليدوي المزعج."
        ],
        linear_search: [
            "def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1"
        ],
        binary_search: [
            "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1"
        ],
        bubble_sort: [
            "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr"
        ],
        insertion_sort: [
            "def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr"
        ],
        selection_sort: [
            "def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr"
        ],
        merge_sort: [
            "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    L = merge_sort(arr[:mid])\n    R = merge_sort(arr[mid:])\n    return merge(L, R)\n\ndef merge(L, R):\n    res = []\n    i = j = 0\n    while i < len(L) and j < len(R):\n        if L[i] < R[j]:\n            res.append(L[i])\n            i += 1\n        else:\n            res.append(R[j])\n            j += 1\n    res.extend(L[i:])\n    res.extend(R[j:])\n    return res"
        ],
        kadane_algorithm: [
            "def max_subarray_sum(arr):\n    max_so_far = arr[0]\n    curr_max = arr[0]\n    for i in range(1, len(arr)):\n        curr_max = max(arr[i], curr_max + arr[i])\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far"
        ]
    },
    en: {
        samurai: [
            "Kenji once said a sharp blade is only as good as the hand that guides it. Python is powerful but demands clean logic.",
            "The sword is an extension of the soul; Neovim is an extension of the developer. Cut the delay and strike instantly.",
            "A backend engineer designs interfaces with absolute precision. FastAPI is our blade, and speed is measured in milliseconds."
        ],
        beast: [
            "E5traat Commerce Engine is a multi-tenant beast engineered to bring semantic insights to small Egyptian merchants.",
            "Software engineering is not a desk job; it is raw creation. I build platforms for local businesses to level up their growth.",
            "CSHub incorporates advanced audio AI transcription and Abstract Syntax Tree parsing. Do not settle for basic scripts."
        ],
        speed: [
            "Data flows at lightning speed through Redis channels while Cloud Spanner coordinates graph retrieval with high efficiency.",
            "FastAPI serves thousands of concurrent requests in milliseconds. Focus your mind, strike the keys, conquer complexity.",
            "Pipeline automation turns tedious labor into millisecond executions. Let automation handle the repetition so you can build."
        ],
        linear_search: [
            "def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1"
        ],
        binary_search: [
            "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1"
        ],
        bubble_sort: [
            "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr"
        ],
        insertion_sort: [
            "def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr"
        ],
        selection_sort: [
            "def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr"
        ],
        merge_sort: [
            "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    L = merge_sort(arr[:mid])\n    R = merge_sort(arr[mid:])\n    return merge(L, R)\n\ndef merge(L, R):\n    res = []\n    i = j = 0\n    while i < len(L) and j < len(R):\n        if L[i] < R[j]:\n            res.append(L[i])\n            i += 1\n        else:\n            res.append(R[j])\n            j += 1\n    res.extend(L[i:])\n    res.extend(R[j:])\n    return res"
        ],
        kadane_algorithm: [
            "def max_subarray_sum(arr):\n    max_so_far = arr[0]\n    curr_max = arr[0]\n    for i in range(1, len(arr)):\n        curr_max = max(arr[i], curr_max + arr[i])\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far"
        ]
    }
};

// ----------------------------------------------------
// MONKEYTYPE-STYLE TYPING SPEED TEST SYSTEM
// ----------------------------------------------------
// Arabic Connection Helper to prevent character breaking inside spans
function getArabicCharVisual(char, i, length) {
    const isArabic = /[\u0600-\u06FF]/.test(char);
    if (!isArabic) return char;

    let prefix = (i > 0) ? '\u200D' : '';
    let suffix = (i < length - 1) ? '\u200D' : '';
    return prefix + char + suffix;
}

let currentQuote = "";
let currentQuoteChars = [];
let totalTypedCount = 0;
let errorsCount = 0;
let totalKeypresses = 0;
let mistakesCount = 0;
let testRunning = false;
let timerStarted = false;
let comboStreak = 0;
let maxComboStreak = 0;

// Countdown Timer settings
const TIMER_LIMIT = 30; // 30 seconds countdown
let timeRemaining = TIMER_LIMIT;
let timeElapsed = 0; // Tracks elapsed seconds
let isUnlimitedMode = false;
let timerInterval = null;
let firstSpaceIndex = -1; // Index of the space ending the first word

const wordsContainer = document.getElementById('words-container');
const typingInput = document.getElementById('typing-input');
const quoteSelect = document.getElementById('quote-select');
const btnRestart = document.getElementById('btn-restart');
const speedLines = document.getElementById('speed-lines');

// HUD indicators
const hudWpmValue = document.querySelector('#hud-wpm .hud-stat-value');
const hudWpmBar = document.querySelector('#hud-wpm .bar-fill');
const hudAccValue = document.querySelector('#hud-accuracy .hud-stat-value');
const hudAccBar = document.querySelector('#hud-accuracy .bar-fill');
const hudTimerValue = document.querySelector('#hud-timer .hud-stat-value');
const hudTimerBar = document.querySelector('#hud-timer .bar-fill');
const hudStreakValue = document.querySelector('#hud-streak .hud-stat-value');
const hudStreakBar = document.querySelector('#hud-streak .bar-fill');

// Rank overlay elements
const rankOverlay = document.getElementById('rank-overlay');
const btnRankClose = document.getElementById('btn-rank-close');
const rankTitle = document.getElementById('rank-title');
const rankAlgoBadge = document.getElementById('rank-algo-badge');
const rankWpm = document.getElementById('rank-wpm');
const rankAcc = document.getElementById('rank-acc');
const rankTime = document.getElementById('rank-time');
const rankCommentary = document.getElementById('rank-commentary');

// Map of algorithm categories to their YouTube links
const algorithmVideos = {
    kadane_algorithm: {
        title: "Kadane's Algorithm",
        link: "https://youtu.be/3dYS0KE31WY?si=1_15UASMrcRIfkAp"
    },
    insertion_sort: {
        title: "Insertion Sort",
        link: "https://youtu.be/8NUQ0juUO2I?si=yErV0Lvco74lFVLO"
    },
    selection_sort: {
        title: "Selection Sort",
        link: "https://youtu.be/0MYJ42hBwHI?si=cPgVXmM3uFeEXnnG"
    }
};

// Initialize a new test
function loadNewQuote() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStarted = false;
    testRunning = false;
    timeRemaining = TIMER_LIMIT;

    const hudTimerBox = document.getElementById('hud-timer');
    if (hudTimerBox) {
        hudTimerBox.classList.remove('disabled');
    }

    const category = quoteSelect.value;
    const languageQuotes = quotesBank[currentLang][category];
    const randomIndex = Math.floor(Math.random() * languageQuotes.length);
    currentQuote = languageQuotes[randomIndex];

    // Set text direction dynamically based on content (code/English should be LTR, Arabic RTL)
    const hasLatin = /[a-zA-Z]/.test(currentQuote);
    if (hasLatin) {
        wordsContainer.style.direction = 'ltr';
        typingInput.style.direction = 'ltr';
        typingInput.style.textAlign = 'left';
    } else {
        wordsContainer.style.direction = 'rtl';
        typingInput.style.direction = 'rtl';
        typingInput.style.textAlign = 'right';
    }

    // Show/hide YouTube video hint
    const videoHintEl = document.getElementById('video-hint');
    if (videoHintEl) {
        if (algorithmVideos[category]) {
            const videoInfo = algorithmVideos[category];
            if (currentLang === 'ar') {
                videoHintEl.innerHTML = `🎥 شرح ابن الرفاعي خوارزمية ${videoInfo.title} في فيديو، شاهد الشرح من هنا: <a href="${videoInfo.link}" target="_blank">رابط يوتيوب ➔</a>`;
            } else {
                videoHintEl.innerHTML = `🎥 ibnalrefai made a video about ${videoInfo.title}, go check it here: <a href="${videoInfo.link}" target="_blank">YouTube Video ➔</a>`;
            }
            videoHintEl.classList.remove('hidden');
        } else {
            videoHintEl.classList.add('hidden');
        }
    }

    // Find index of the first space in the quote (end of the first word)
    firstSpaceIndex = currentQuote.indexOf(' ');

    // Parse into visual character elements
    wordsContainer.innerHTML = '';
    currentQuoteChars = [];

    const testType = document.getElementById('test-type-select').value;

    if (testType === 'code') {
        wordsContainer.classList.add('mode-code');
        wordsContainer.classList.remove('mode-text');

        const lines = currentQuote.split('\n');
        lines.forEach((lineText, lineIdx) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'code-line';

            for (let i = 0; i < lineText.length; i++) {
                const charEl = document.createElement('span');
                charEl.className = 'char';
                charEl.innerText = getArabicCharVisual(lineText[i], i, lineText.length);
                lineEl.appendChild(charEl);
                currentQuoteChars.push(charEl);
            }

            // Add newline character at the end of the line (except for the last line)
            if (lineIdx < lines.length - 1) {
                const newlineEl = document.createElement('span');
                newlineEl.className = 'char newline-char';
                newlineEl.innerText = '↵';
                lineEl.appendChild(newlineEl);
                currentQuoteChars.push(newlineEl);
            }

            wordsContainer.appendChild(lineEl);
        });
    } else {
        wordsContainer.classList.add('mode-text');
        wordsContainer.classList.remove('mode-code');

        const wordsArray = currentQuote.split(' ');
        wordsArray.forEach((wordText, wordIdx) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'word';

            for (let i = 0; i < wordText.length; i++) {
                const charEl = document.createElement('span');
                charEl.className = 'char';
                charEl.innerText = getArabicCharVisual(wordText[i], i, wordText.length);
                wordEl.appendChild(charEl);
                currentQuoteChars.push(charEl);
            }

            // Add spaces between words
            if (wordIdx < wordsArray.length - 1) {
                const spaceEl = document.createElement('span');
                spaceEl.className = 'char';
                spaceEl.innerText = ' ';
                wordEl.appendChild(spaceEl);
                currentQuoteChars.push(spaceEl);
            }

            wordsContainer.appendChild(wordEl);
        });
    }

    // Reset indices and counts
    totalTypedCount = 0;
    errorsCount = 0;
    totalKeypresses = 0;
    mistakesCount = 0;
    comboStreak = 0;
    maxComboStreak = 0;
    timeElapsed = 0;

    // Set first character as active
    if (currentQuoteChars.length > 0) {
        currentQuoteChars[0].classList.add('current');
    }

    // Reset input value
    typingInput.value = '';

    // Reset typing box scroll position
    const typingBox = document.getElementById('typing-box');
    if (typingBox) {
        typingBox.scrollTop = 0;
    }

    // Reset HUD displays
    if (isUnlimitedMode) {
        updateHUD(0, 100, 0, 0);
    } else {
        updateHUD(0, 100, TIMER_LIMIT, 0);
    }
    updateTimerHUD();
    speedLines.classList.remove('active');
}

// Update live dashboard HUD
function updateHUD(wpm, accuracy, timeLeft, streak) {
    // Speed WPM (capped at 120 for bar fill visual)
    hudWpmValue.innerText = String(Math.round(wpm)).padStart(3, '0');
    const wpmPercent = Math.min((wpm / 120) * 100, 100);
    hudWpmBar.style.width = `${wpmPercent}%`;

    // Accuracy
    hudAccValue.innerText = `${Math.round(accuracy)}%`;
    hudAccBar.style.width = `${accuracy}%`;

    // Countdown Timer or Unlimited Timer
    if (isUnlimitedMode) {
        hudTimerValue.innerText = String(timeLeft);
        const progressPercent = currentQuote.length > 0 ? (totalTypedCount / currentQuote.length) * 100 : 0;
        hudTimerBar.style.width = `${progressPercent}%`;
    } else {
        hudTimerValue.innerText = String(Math.max(0, timeLeft));
        const timerPercent = (timeLeft / TIMER_LIMIT) * 100;
        hudTimerBar.style.width = `${Math.max(0, timerPercent)}%`;
    }

    // Combo Streak
    hudStreakValue.innerText = `x${streak}`;
    const streakPercent = Math.min((streak / 30) * 100, 100);
    hudStreakBar.style.width = `${streakPercent}%`;

    // Combo speeds lines trigger
    if (streak >= 15) {
        speedLines.classList.add('active');
    } else {
        speedLines.classList.remove('active');
    }
}

// Timer tick action
function startCountdownTimer() {
    timerStarted = true;
    testRunning = true;

    const hudTimerBox = document.getElementById('hud-timer');
    if (hudTimerBox) {
        hudTimerBox.classList.add('disabled');
    }

    if (isUnlimitedMode) {
        timerInterval = setInterval(() => {
            timeElapsed++;

            // Calculate WPM and Accuracy
            const correctCharsCount = currentQuoteChars.slice(0, totalTypedCount).filter(el => el.classList.contains('correct')).length;
            const liveWpm = timeElapsed > 0 ? (correctCharsCount / 5) / (timeElapsed / 60) : 0;
            const liveAccuracy = totalKeypresses > 0 ? ((totalKeypresses - mistakesCount) / totalKeypresses) * 100 : 100;

            updateHUD(liveWpm, Math.max(0, liveAccuracy), timeElapsed, comboStreak);
        }, 1000);
    } else {
        timerInterval = setInterval(() => {
            timeRemaining--;
            timeElapsed = TIMER_LIMIT - timeRemaining;

            // Calculate WPM and Accuracy
            const correctCharsCount = currentQuoteChars.slice(0, totalTypedCount).filter(el => el.classList.contains('correct')).length;
            const liveWpm = timeElapsed > 0 ? (correctCharsCount / 5) / (timeElapsed / 60) : 0;
            const liveAccuracy = totalKeypresses > 0 ? ((totalKeypresses - mistakesCount) / totalKeypresses) * 100 : 100;

            updateHUD(liveWpm, Math.max(0, liveAccuracy), timeRemaining, comboStreak);

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                endTypingTest(liveWpm, liveAccuracy);
            }
        }, 1000);
    }
}

// Typing input processing (Monkeytype comparison method)
typingInput.addEventListener('input', (e) => {
    const typedVal = typingInput.value;
    totalTypedCount = typedVal.length;

    // Sound on keypress
    playKeySound();

    // Track stats
    if (e.inputType !== 'deleteContentBackward') {
        totalKeypresses++;
    }

    // Loop through quote and evaluate letters
    let liveCorrectCount = 0;
    let liveErrorsCount = 0;

    for (let i = 0; i < currentQuoteChars.length; i++) {
        const charEl = currentQuoteChars[i];

        if (i < totalTypedCount) {
            // Evaluated characters
            charEl.classList.remove('current');

            if (typedVal[i] === currentQuote[i]) {
                charEl.classList.remove('incorrect');
                charEl.classList.add('correct');
                liveCorrectCount++;
            } else {
                charEl.classList.remove('correct');
                charEl.classList.add('incorrect');
                liveErrorsCount++;

                // Track mistakes on first match failure at this index
                if (e.inputType !== 'deleteContentBackward' && i === totalTypedCount - 1) {
                    mistakesCount++;
                    comboStreak = 0;
                }
            }
        } else if (i === totalTypedCount) {
            // Blinking cursor character
            charEl.classList.remove('correct', 'incorrect');
            charEl.classList.add('current');
        } else {
            // Untyped characters
            charEl.classList.remove('correct', 'incorrect', 'current');
        }
    }

    // Update streak on successful matching key
    if (e.inputType !== 'deleteContentBackward' && totalTypedCount > 0) {
        if (typedVal[totalTypedCount - 1] === currentQuote[totalTypedCount - 1]) {
            comboStreak++;
            if (comboStreak > maxComboStreak) maxComboStreak = comboStreak;
        }
    } else if (e.inputType === 'deleteContentBackward') {
        // Decrease combo streak on backspaces slightly or keep
        comboStreak = Math.max(0, comboStreak - 1);
    }

    // TIMER TRIGGER RULE: "works only when typing the first word, after the space.."
    // Trigger timer after typing the first word and hitting the first space
    if (!timerStarted && firstSpaceIndex !== -1 && totalTypedCount > firstSpaceIndex) {
        if (typedVal[firstSpaceIndex] === ' ') {
            startCountdownTimer();
        }
    }

    // Live feedback stats calculations
    const elapsedSeconds = timerStarted ? (isUnlimitedMode ? timeElapsed : (TIMER_LIMIT - timeRemaining)) : 0.1;
    const liveWpm = timerStarted ? (liveCorrectCount / 5) / (elapsedSeconds / 60) : 0;
    const liveAccuracy = totalKeypresses > 0 ? ((totalKeypresses - mistakesCount) / totalKeypresses) * 100 : 100;

    updateHUD(liveWpm, Math.max(0, liveAccuracy), (isUnlimitedMode ? timeElapsed : timeRemaining), comboStreak);

    // Check if quote completed fully
    if (totalTypedCount >= currentQuote.length && liveErrorsCount === 0) {
        clearInterval(timerInterval);
        endTypingTest(liveWpm, liveAccuracy);
    }

    // Auto scroll textarea to follow typing cursor
    typingInput.scrollTop = typingInput.scrollHeight;

    // Auto scroll typing box to keep current character in view
    const activeChar = wordsContainer.querySelector('.char.current');
    if (activeChar) {
        const typingBox = document.getElementById('typing-box');
        if (typingBox) {
            const charRect = activeChar.getBoundingClientRect();
            const boxRect = typingBox.getBoundingClientRect();
            const relativeTop = charRect.top - boxRect.top + typingBox.scrollTop;
            const containerHeight = typingBox.clientHeight;
            const charHeight = charRect.height || 28;
            const targetScrollTop = relativeTop - (containerHeight / 2) + (charHeight / 2);
            typingBox.scrollTop = targetScrollTop;
        }
    }
});

// Intercept Tab and Enter keys for Code Indentation in Code Mode
typingInput.addEventListener('keydown', (e) => {
    const isCodeMode = (testTypeSelect && testTypeSelect.value === 'code');
    if (!isCodeMode) return;

    // 1. Tab Key: Insert 4 spaces
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent focus loss

        const start = typingInput.selectionStart;
        const end = typingInput.selectionEnd;
        const value = typingInput.value;

        typingInput.value = value.substring(0, start) + "    " + value.substring(end);
        typingInput.selectionStart = typingInput.selectionEnd = start + 4;

        // Trigger the input event to run validation
        typingInput.dispatchEvent(new Event('input'));
        return;
    }

    // 2. Enter Key: Auto-indent to match target code indentation
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent standard line break

        const start = typingInput.selectionStart;
        const end = typingInput.selectionEnd;
        const value = typingInput.value;

        const currentPosInQuote = start;
        if (currentQuote[currentPosInQuote] === '\n') {
            // Find how many spaces follow this '\n' in the target quote
            let spacesToInsert = "";
            let nextIdx = currentPosInQuote + 1;
            while (nextIdx < currentQuote.length && currentQuote[nextIdx] === ' ') {
                spacesToInsert += " ";
                nextIdx++;
            }

            typingInput.value = value.substring(0, start) + "\n" + spacesToInsert + value.substring(end);
            typingInput.selectionStart = typingInput.selectionEnd = start + 1 + spacesToInsert.length;
        } else {
            // Fallback: insert standard newline
            typingInput.value = value.substring(0, start) + "\n" + value.substring(end);
            typingInput.selectionStart = typingInput.selectionEnd = start + 1;
        }

        // Trigger the input event to run validation
        typingInput.dispatchEvent(new Event('input'));
    }
});

// Finalize typing test and open Rank modal
function endTypingTest(finalWpm, finalAccuracy) {
    testRunning = false;
    const cleanWpm = Math.round(finalWpm);
    const cleanAccuracy = Math.round(finalAccuracy);

    playRankChime();
    drawScreenSlash();

    // Rank evaluation (Bilingual labels)
    let title = "";
    let commentary = "";

    if (currentLang === 'ar') {
        if (cleanWpm >= 90 && cleanAccuracy >= 95) {
            title = "مهندس خبير 👑";
            commentary = `"مذهل للغاية! سرعة جبارة مع دقة مميتة. أداؤك يثبت تميزك البرمجي العالي وقدرتك على الإنتاج بكفاءة."`;
        } else if (cleanWpm >= 60) {
            title = "مطور متميز ⚔️";
            commentary = `"أداء متميز. أصابعك سريعة وضرباتك متقنة تحت الضغط. قليل من التدريب وتصل لرتبة خبير."`;
        } else if (cleanWpm >= 30) {
            title = "مطور مبتدئ 🍃";
            commentary = `"لديك أساس متين ولكنك تحتاج لزيادة سرعتك وتدفق أفكارك أثناء الكتابة. واصل التدريب!"`;
        } else {
            title = "متدرب 🌾";
            commentary = `"سرعة بطيئة مع أخطاء متعددة. تحتاج لمزيد من الممارسة والتركيز على موضع الحروف لتعتاد سرعة المطورين."`;
        }
    } else {
        if (cleanWpm >= 90 && cleanAccuracy >= 95) {
            title = "ELITE ENGINEER 👑";
            commentary = `"Spectacular! Extraordinary speed combined with lethal accuracy. Your performance demonstrates premium coding capabilities."`;
        } else if (cleanWpm >= 60) {
            title = "SENIOR DEVELOPER ⚔️";
            commentary = `"Excellent performance! You type quickly and maintain focus under pressure. Just a little more training to reach the elite level."`;
        } else if (cleanWpm >= 30) {
            title = "JUNIOR DEVELOPER 🍃";
            commentary = `"A solid foundation, but your keystrokes lack high-speed consistency. Keep practicing to refine your rhythm."`;
        } else {
            title = "INTERN 🌾";
            commentary = `"Slow and unsteady pace. You need to focus more on key muscle memory and precision to type at a professional speed."`;
        }
    }

    // Populate overlay metrics
    rankTitle.innerText = title;
    if (rankAlgoBadge) {
        const selectedOptionText = quoteSelect.options[quoteSelect.selectedIndex] ? quoteSelect.options[quoteSelect.selectedIndex].text : '';
        rankAlgoBadge.innerText = selectedOptionText;
    }
    rankWpm.innerText = `${cleanWpm} WPM`;
    rankAcc.innerText = `${cleanAccuracy}%`;
    if (rankTime) {
        rankTime.innerText = currentLang === 'ar' ? `${timeElapsed}ث` : `${timeElapsed}s`;
    }
    rankCommentary.innerText = commentary;

    // Show overlay
    setTimeout(() => {
        rankOverlay.classList.remove('hidden');
    }, 500);
}

// Reset button
btnRestart.addEventListener('click', () => {
    playSlashSound();
    loadNewQuote();
    typingInput.focus();
});

// Category selector change
quoteSelect.addEventListener('change', () => {
    loadNewQuote();
    typingInput.focus();
});

// Close evaluation modal
btnRankClose.addEventListener('click', () => {
    rankOverlay.classList.add('hidden');
    loadNewQuote();
});

// ----------------------------------------------------
// AUTHENTICATION & MODAL INTERACTION SYSTEM (DEPRECATED)
// ----------------------------------------------------
function checkUserSession() {
    // Session management disabled since auth is replaced by Buy Me A Coffee
}

// ----------------------------------------------------
// COMING SOON TOAST NOTIFICATION
// ----------------------------------------------------
const navPromo = document.getElementById('nav-promo');
const toastEl = document.createElement('div');
toastEl.className = 'manga-toast';
document.body.appendChild(toastEl);

function showToast(message) {
    toastEl.innerText = message;
    toastEl.classList.add('show');
    playSlashSound();

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 4000);
}

function showPromoToast() {
    const message = currentLang === 'ar'
        ? 'صفحة الترويج قريباً إن شاء الله! 🚀'
        : 'Promo page is coming soon! 🚀';
    showToast(message);
}

if (navPromo) {
    navPromo.addEventListener('click', (e) => {
        e.preventDefault();
        showPromoToast();
    });
}

// ----------------------------------------------------
// CHALLENGE TYPE SELECTOR LISTENER
// ----------------------------------------------------
const testTypeSelect = document.getElementById('test-type-select');
if (testTypeSelect) {
    testTypeSelect.addEventListener('change', () => {
        updateQuoteSelectOptions();
        loadNewQuote();
        typingInput.focus();
    });
}

// ----------------------------------------------------
// UNLIMITED TIMER TOGGLE FUNCTIONALITY
// ----------------------------------------------------
const hudTimerBox = document.getElementById('hud-timer');

function updateTimerHUD() {
    const timerLabel = document.querySelector('#hud-timer .hud-stat-label');
    if (!timerLabel) return;
    if (isUnlimitedMode) {
        timerLabel.innerText = currentLang === 'ar' ? 'الوقت المنقضي' : 'ELAPSED TIME';
        timerLabel.setAttribute('data-key', 'hud-timer-unlimited');
    } else {
        timerLabel.innerText = currentLang === 'ar' ? 'الوقت المتبقي' : 'TIME REMAINING';
        timerLabel.setAttribute('data-key', 'hud-timer');
    }
}

if (hudTimerBox) {
    hudTimerBox.addEventListener('click', () => {
        // Toggle only if the test hasn't started yet
        if (!timerStarted && !testRunning) {
            isUnlimitedMode = !isUnlimitedMode;
            playSlashSound();
            loadNewQuote();
            typingInput.focus();
        }
    });
}

// ----------------------------------------------------
// CONTACT FORM SUBMISSION SYSTEM
// ----------------------------------------------------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual slash feedback
        playSlashSound();
        drawScreenSlash();

        const submitBtn = document.getElementById('btn-submit-contact');
        let originalText = "";
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnTextSpan = submitBtn.querySelector('.btn-text');
            if (btnTextSpan) {
                originalText = btnTextSpan.innerText;
                btnTextSpan.innerText = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
            }
        }

        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        fetch("https://formsubmit.co/ajax/55c9fb9144da9e7d805c9e089a4d2c9a", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                subject: subject,
                message: message
            })
        })
            .then(response => {
                if (response.ok) {
                    showToast(currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً. 👍' : 'Message sent successfully! I will get back to you soon. 👍');
                    contactForm.reset();
                } else {
                    throw new Error("Failed to send");
                }
            })
            .catch(error => {
                showToast(currentLang === 'ar' ? 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى. ❌' : 'Sorry, something went wrong. Please try again. ❌');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnTextSpan = submitBtn.querySelector('.btn-text');
                    if (btnTextSpan && originalText) {
                        btnTextSpan.innerText = originalText;
                    }
                }
            });
    });
}

// Set default language on load
setLanguage('ar');
checkUserSession();
