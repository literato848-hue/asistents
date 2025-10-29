// emotion.js
class EmotionManager {
    constructor() {
        this.currentEmotion = 'neutral';
        this.isRandomMode = true;
        this.randomTimer = null;
        this.blinkTimer = null;
        this.mouseMoving = false;
        this.mouseMoveTimeout = null;
        
        // Emociju dati ar latviešu tekstiem
        this.emotionData = {
            neutral: { 
                text: 'Klausos tevi attentīgi', 
                blink: [2000, 6000],
                color: '#e6ff00'
            },
            happy: { 
                text: 'Prieku man sagādā mūzika!', 
                blink: [1500, 4000],
                color: '#90EE90'
            },
            thinking: { 
                text: 'Analizēju tavu lūgumu...', 
                blink: [3000, 8000],
                color: '#FFD700'
            },
            surprised: { 
                text: 'Ieinteresanti! Turpini!', 
                blink: [500, 2000],
                color: '#FF6347'
            },
            sleepy: { 
                text: 'Esmu mazliet nogurusi...', 
                blink: [800, 2000],
                color: '#9370DB'
            },
            angry: { 
                text: 'Kaut kas nav kārtībā!', 
                blink: [2000, 4000],
                color: '#FF4500'
            },
            sad: { 
                text: 'Šoreiz neizdevās...', 
                blink: [3000, 6000],
                color: '#4682B4'
            },
            crazy: { 
                text: 'Dejosim kopā!', 
                blink: [1000, 3000],
                color: '#FF1493'
            },
            skeptical: { 
                text: 'Vai tiešām tā domā?', 
                blink: [2500, 5000],
                color: '#FFA500'
            },
            listening: {
                text: 'Uzmanīgi klausos...',
                blink: [1500, 3000],
                color: '#00FF7F'
            },
            processing: {
                text: 'Apstrādāju komandu...',
                blink: [1000, 2500],
                color: '#20B2AA'
            }
        };
        
        this.emotionTriggers = {
            'greetings': ['happy', 'neutral'],
            'music_play': ['happy', 'crazy'],
            'music_stop': ['neutral', 'sad'],
            'error': ['surprised', 'skeptical'],
            'listening': ['listening', 'thinking'],
            'success': ['happy', 'satisfied']
        };
        
        this.init();
    }
    
    init() {
        this.createEyeElements();
        this.setupEventListeners();
        this.startRandomBehavior();
        this.setEmotion('neutral');
    }
    
    createEyeElements() {
        // Pārbauda, vai elementi jau eksistē
        if (document.getElementById('aiEyesContainer')) {
            return;
        }
        
        // Izveido acu konteineri
        const eyesContainer = document.createElement('div');
        eyesContainer.id = 'aiEyesContainer';
        eyesContainer.className = 'ai-eyes-container';
        
        eyesContainer.innerHTML = `
            <div class="emotion-controls">
                <button class="emotion-toggle" id="randomToggle">🎲 Random</button>
                <select class="emotion-selector" id="emotionSelector">
                    <option value="neutral">😐 Neitrāls</option>
                    <option value="happy">😊 Priecīgs</option>
                    <option value="thinking">🤔 Domā</option>
                    <option value="surprised">😲 Pārsteigts</option>
                    <option value="angry">😠 Dusmīgs</option>
                    <option value="sleepy">😴 Miegains</option>
                    <option value="sad">😢 Skumjš</option>
                    <option value="crazy">🤪 Jucis</option>
                    <option value="skeptical">🤨 Skeptisks</option>
                    <option value="listening">👂 Klausās</option>
                    <option value="processing">⚙️ Apstrādā</option>
                </select>
            </div>
            
            <div class="eyes-wrapper">
                <div class="eye-wrapper">
                    <div class="eyebrow" id="leftBrow"></div>
                    <div class="eye neutral" id="leftEye">
                        <div class="iris" id="leftIris">
                            <div class="pupil">
                                <div class="highlight"></div>
                            </div>
                        </div>
                        <div class="tear"></div>
                        <div class="eyelid"></div>
                    </div>
                </div>
                
                <div class="eye-wrapper">
                    <div class="eyebrow right" id="rightBrow"></div>
                    <div class="eye neutral" id="rightEye">
                        <div class="iris" id="rightIris">
                            <div class="pupil">
                                <div class="highlight"></div>
                            </div>
                        </div>
                        <div class="tear"></div>
                        <div class="eyelid"></div>
                    </div>
                </div>
            </div>
            
            <div class="emotion-status" id="emotionStatus">Gatava palīdzēt!</div>
        `;
        
        // Ievieto acis starp statusu un logiem
        const controlPanel = document.querySelector('.control-panel');
        const status = document.querySelector('.status');
        if (controlPanel && status) {
            controlPanel.insertBefore(eyesContainer, status.nextSibling);
        }
        
        this.addEyeStyles();
    }
    
    addEyeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-eyes-container {
                margin: 15px 0;
                text-align: center;
                background: rgba(18, 26, 24, 0.8);
                border: 1px solid #e6ff00;
                border-radius: 5px;
                padding: 15px;
            }
            
            .emotion-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                justify-content: center;
                align-items: center;
            }
            
            .emotion-toggle {
                background: #233024;
                border: 1px solid #e6ff00;
                color: #e6ff00;
                padding: 6px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .emotion-toggle:hover {
                background: rgba(230, 255, 0, 0.1);
            }
            
            .emotion-toggle.active {
                background: #e6ff00;
                color: #121a18;
            }
            
            .emotion-selector {
                background: #233024;
                border: 1px solid #e6ff00;
                color: #e6ff00;
                padding: 6px;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
            }
            
            .emotion-selector option {
                background: #233024;
                color: #e6ff00;
            }
            
            .eyes-wrapper {
                display: flex;
                gap: 30px;
                justify-content: center;
                margin-bottom: 10px;
            }
            
            .eye-wrapper {
                position: relative;
            }
            
            .eyebrow {
                position: absolute;
                width: 60px;
                height: 8px;
                background: #1a1a1a;
                border-radius: 50%;
                top: -15px;
                left: 3px;
                transition: all 0.3s ease;
                transform-origin: center;
                z-index: 10;
            }
            
            .eye {
                width: 65px;
                height: 65px;
                background: linear-gradient(145deg, #ffffff, #e8e8e8);
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                position: relative;
                overflow: hidden;
                box-shadow: 
                    0 3px 8px rgba(0,0,0,0.3),
                    inset 0 -2px 5px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }
            
            .iris {
                width: 40px;
                height: 40px;
                background: radial-gradient(circle at 35% 35%, #e6ff00, #ccdd00, #99aa00);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.2s ease;
                box-shadow: 
                    inset 0 0 8px rgba(0,0,0,0.3),
                    0 0 5px rgba(230,255,0,0.4);
            }
            
            .iris::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background: repeating-conic-gradient(
                    from 0deg,
                    transparent 0deg 6deg,
                    rgba(0,0,0,0.15) 6deg 8deg
                );
                border-radius: 50%;
            }
            
            .pupil {
                width: 20px;
                height: 20px;
                background: #000;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.2s ease;
                box-shadow: 0 0 3px rgba(0,0,0,0.8);
            }
            
            .highlight {
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 20%;
                left: 30%;
                opacity: 0.9;
                box-shadow: 0 0 2px rgba(255,255,255,0.6);
            }
            
            .emotion-status {
                font-size: 12px;
                color: #e6ff00;
                font-style: italic;
                transition: color 0.3s ease;
            }
            
            .tear {
                position: absolute;
                width: 5px;
                height: 8px;
                background: linear-gradient(to bottom, #6699ff, #3366ff);
                border-radius: 50% 50% 50% 0;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: all 0.5s ease;
            }
            
            .eyelid {
                position: absolute;
                width: 100%;
                height: 100%;
                background: #2a2a2a;
                top: -100%;
                transition: top 0.15s ease;
            }
            
            .eye.blinking .eyelid {
                top: 0;
            }
            
            /* Emociju stili */
            .eye.happy { 
                border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
                height: 70px;
                transform: scaleX(0.95);
            }
            .eye.happy .iris {
                transform: translate(-50%, -60%);
            }
            .happy-brow { 
                transform: rotate(-8deg) translateY(-2px);
                border-radius: 50% 50% 30% 30%;
            }
            .happy-brow.right { 
                transform: rotate(8deg) translateY(-2px);
            }
            
            .eye.thinking { 
                height: 55px;
                border-radius: 45% 55% 50% 50% / 55% 60% 40% 45%;
                transform: translateX(-2px);
            }
            .eye.thinking .iris {
                transform: translate(-70%, -40%);
            }
            .thinking-brow { 
                transform: rotate(12deg) translateY(-3px);
            }
            .thinking-brow.right { 
                transform: rotate(-3deg);
            }
            
            .eye.surprised { 
                border-radius: 50%; 
                transform: scale(1.2);
                width: 70px;
                height: 70px;
            }
            .eye.surprised .iris {
                transform: translate(-50%, -50%) scale(1.2);
            }
            .eye.surprised .pupil {
                width: 22px;
                height: 22px;
            }
            .surprised-brow { 
                transform: rotate(-15deg) translateY(-8px);
                width: 50px;
            }
            .surprised-brow.right { 
                transform: rotate(15deg) translateY(-8px);
            }
            
            .eye.angry { 
                border-radius: 50% 50% 50% 50% / 75% 75% 25% 25%;
                height: 45px;
                transform: scaleX(1.1);
            }
            .eye.angry .iris {
                background: radial-gradient(circle at 35% 35%, #ff3333, #cc0000, #660000);
                transform: translate(-50%, -35%);
            }
            .angry-brow { 
                transform: rotate(28deg) translateY(5px);
                background: #ff0000;
            }
            .angry-brow.right { 
                transform: rotate(-28deg) translateY(5px);
            }
            
            .eye.sleepy { 
                height: 20px;
                border-radius: 50% 50% 50% 50% / 15% 15% 85% 85%;
                width: 60px;
            }
            .eye.sleepy .iris {
                opacity: 0.5;
                transform: translate(-50%, -30%);
            }
            .sleepy-brow { 
                transform: rotate(8deg) translateY(3px);
                opacity: 0.6;
            }
            .sleepy-brow.right { 
                transform: rotate(-8deg) translateY(3px);
            }
            
            .eye.crazy {
                border-radius: 45% 55% 52% 48% / 58% 48% 52% 42%;
                transform: rotate(-2deg);
            }
            .eye.crazy .iris {
                animation: spin 2s linear infinite;
            }
            .crazy-brow { 
                transform: rotate(-30deg) translateY(-2px);
                animation: wiggle 0.3s ease-in-out infinite;
            }
            .crazy-brow.right { 
                transform: rotate(40deg) translateY(-4px);
                animation: wiggle 0.3s ease-in-out infinite reverse;
            }
            
            .eye.sad { 
                border-radius: 50% 50% 50% 50% / 68% 68% 32% 32%;
                height: 60px;
                transform: scaleX(0.9);
            }
            .eye.sad .iris {
                transform: translate(-50%, -35%);
            }
            .eye.sad .tear {
                opacity: 0.8;
                animation: tearDrop 2s ease-in-out infinite;
            }
            .sad-brow { 
                transform: rotate(20deg) translateY(-1px);
            }
            .sad-brow.right { 
                transform: rotate(-20deg) translateY(-1px);
            }
            
            .eye.skeptical {
                border-radius: 48% 52% 50% 50% / 55% 65% 35% 45%;
                height: 60px;
            }
            .eye.skeptical .iris {
                transform: translate(-60%, -45%);
            }
            .skeptical-brow { 
                transform: rotate(35deg) translateY(-3px);
            }
            .skeptical-brow.right { 
                transform: rotate(-5deg);
            }
            
            .eye.listening {
                border-radius: 50%;
                animation: listenPulse 2s ease-in-out infinite;
            }
            .eye.listening .iris {
                background: radial-gradient(circle at 35% 35%, #00FF7F, #00CC66, #009944);
            }
            
            .eye.processing {
                border-radius: 50%;
            }
            .eye.processing .iris {
                background: radial-gradient(circle at 35% 35%, #20B2AA, #1E9999, #1A7777);
                animation: processingPulse 1.5s ease-in-out infinite;
            }
            
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            @keyframes wiggle {
                0%, 100% { transform: rotate(-30deg) translateY(-2px); }
                50% { transform: rotate(-25deg) translateY(-1px); }
            }
            
            @keyframes tearDrop {
                0%, 100% { bottom: -10px; opacity: 0; }
                50% { bottom: -20px; opacity: 0.8; }
            }
            
            @keyframes listenPulse {
                0%, 100% { box-shadow: 0 0 5px rgba(0,255,127,0.3); }
                50% { box-shadow: 0 0 15px rgba(0,255,127,0.6); }
            }
            
            @keyframes processingPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Random toggle
        const randomToggle = document.getElementById('randomToggle');
        if (randomToggle) {
            randomToggle.addEventListener('click', () => {
                this.toggleRandomMode();
            });
        }
        
        // Emociju selector
        const emotionSelector = document.getElementById('emotionSelector');
        if (emotionSelector) {
            emotionSelector.addEventListener('change', (e) => {
                if (!this.isRandomMode) {
                    this.setEmotion(e.target.value);
                }
            });
        }
        
        // Peles kustība
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Klikšķis uz acīm
        document.getElementById('leftEye')?.addEventListener('click', () => this.blink());
        document.getElementById('rightEye')?.addEventListener('click', () => this.blink());
    }
    
    handleMouseMove(e) {
        if (this.currentEmotion !== 'sleepy' && this.currentEmotion !== 'crazy') {
            const leftIris = document.getElementById('leftIris');
            const rightIris = document.getElementById('rightIris');
            const leftEye = document.getElementById('leftEye');
            const rightEye = document.getElementById('rightEye');
            
            if (leftIris && rightIris && leftEye && rightEye) {
                this.moveIris(leftIris, leftEye, e.clientX, e.clientY);
                this.moveIris(rightIris, rightEye, e.clientX, e.clientY);
            }
        }
        
        this.mouseMoving = true;
        clearTimeout(this.mouseMoveTimeout);
        this.mouseMoveTimeout = setTimeout(() => {
            this.mouseMoving = false;
        }, 1000);
    }
    
    moveIris(iris, eye, mouseX, mouseY) {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
        const distance = Math.min(8, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 15);

        const irisX = Math.cos(angle) * distance;
        const irisY = Math.sin(angle) * distance;

        if (this.currentEmotion !== 'crazy') {
            iris.style.transform = `translate(calc(-50% + ${irisX}px), calc(-50% + ${irisY}px))`;
        }
    }
    
    toggleRandomMode() {
        this.isRandomMode = !this.isRandomMode;
        const toggleBtn = document.getElementById('randomToggle');
        const selector = document.getElementById('emotionSelector');
        
        if (toggleBtn) {
            toggleBtn.classList.toggle('active', this.isRandomMode);
            toggleBtn.textContent = this.isRandomMode ? '🎲 Random ON' : '🎯 Manual';
        }
        
        if (selector) {
            selector.disabled = this.isRandomMode;
        }
        
        if (this.isRandomMode) {
            this.startRandomEmotions();
        } else {
            this.stopRandomEmotions();
        }
    }
    
    setEmotion(emotion) {
        if (!this.emotionData[emotion]) return;
        
        this.currentEmotion = emotion;
        
        const leftEye = document.getElementById('leftEye');
        const rightEye = document.getElementById('rightEye');
        const leftBrow = document.getElementById('leftBrow');
        const rightBrow = document.getElementById('rightBrow');
        const status = document.getElementById('emotionStatus');
        
        if (leftEye && rightEye) {
            leftEye.className = `eye ${emotion}`;
            rightEye.className = `eye ${emotion}`;
        }
        
        if (leftBrow && rightBrow) {
            leftBrow.className = `eyebrow ${emotion}-brow`;
            rightBrow.className = `eyebrow ${emotion}-brow right`;
        }
        
        if (status) {
            status.textContent = this.emotionData[emotion].text;
            status.style.color = this.emotionData[emotion].color;
        }
        
        // Atjauno selector, ja nav random mode
        if (!this.isRandomMode) {
            const selector = document.getElementById('emotionSelector');
            if (selector) {
                selector.value = emotion;
            }
        }
    }
    
    blink() {
        const leftEye = document.getElementById('leftEye');
        const rightEye = document.getElementById('rightEye');
        
        if (leftEye && rightEye) {
            leftEye.classList.add('blinking');
            rightEye.classList.add('blinking');
            
            setTimeout(() => {
                leftEye.classList.remove('blinking');
                rightEye.classList.remove('blinking');
            }, this.currentEmotion === 'sleepy' ? 400 : 150);
        }
    }
    
    startRandomBehavior() {
        this.startRandomBlinks();
        this.startRandomEyeMovement();
        if (this.isRandomMode) {
            this.startRandomEmotions();
        }
    }
    
    startRandomBlinks() {
        const randomBlink = () => {
            this.blink();
            const [min, max] = this.emotionData[this.currentEmotion].blink;
            const nextBlink = Math.random() * (max - min) + min;
            this.blinkTimer = setTimeout(randomBlink, nextBlink);
        };
        
        this.blinkTimer = setTimeout(randomBlink, 2000);
    }
    
    startRandomEyeMovement() {
        const randomMovement = () => {
            if (!this.mouseMoving && this.currentEmotion !== 'sleepy' && this.currentEmotion !== 'crazy') {
                const container = document.querySelector('.ai-eyes-container');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const randomX = rect.left + Math.random() * rect.width;
                    const randomY = rect.top + Math.random() * rect.height;
                    
                    const leftIris = document.getElementById('leftIris');
                    const rightIris = document.getElementById('rightIris');
                    const leftEye = document.getElementById('leftEye');
                    const rightEye = document.getElementById('rightEye');
                    
                    if (leftIris && rightIris && leftEye && rightEye) {
                        this.moveIris(leftIris, leftEye, randomX, randomY);
                        this.moveIris(rightIris, rightEye, randomX, randomY);
                    }
                }
            }
            
            setTimeout(randomMovement, Math.random() * 3000 + 1500);
        };
        
        setTimeout(randomMovement, 3000);
    }
    
    startRandomEmotions() {
        if (this.randomTimer) {
            clearTimeout(this.randomTimer);
        }
        
        const changeEmotion = () => {
            const emotions = Object.keys(this.emotionData);
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
            this.setEmotion(randomEmotion);
            
            // Nākamā maiņa pēc 5-15 sekundēm
            const nextChange = Math.random() * 10000 + 5000;
            this.randomTimer = setTimeout(changeEmotion, nextChange);
        };
        
        this.randomTimer = setTimeout(changeEmotion, 5000);
    }
    
    stopRandomEmotions() {
        if (this.randomTimer) {
            clearTimeout(this.randomTimer);
            this.randomTimer = null;
        }
    }
    
    // Publiskās metodes sasaistei ar asistenta funkcionalitāti
    onListening() {
        this.setEmotion('listening');
    }
    
    onProcessing() {
        this.setEmotion('processing');
    }
    
    onMusicStart() {
        const happyEmotions = ['happy', 'crazy'];
        const emotion = happyEmotions[Math.floor(Math.random() * happyEmotions.length)];
        this.setEmotion(emotion);
    }
    
    onMusicStop() {
        this.setEmotion('neutral');
    }
    
    onError() {
        const errorEmotions = ['surprised', 'skeptical'];
        const emotion = errorEmotions[Math.floor(Math.random() * errorEmotions.length)];
        this.setEmotion(emotion);
    }
    
    onSuccess() {
        this.setEmotion('happy');
    }
    
    triggerEmotionByType(type) {
        if (this.emotionTriggers[type]) {
            const emotions = this.emotionTriggers[type];
            const emotion = emotions[Math.floor(Math.random() * emotions.length)];
            this.setEmotion(emotion);
        }
    }
    
    cleanup() {
        if (this.randomTimer) clearTimeout(this.randomTimer);
        if (this.blinkTimer) clearTimeout(this.blinkTimer);
        if (this.mouseMoveTimeout) clearTimeout(this.mouseMoveTimeout);
    }
}

export const emotionManager = new EmotionManager();