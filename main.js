// main.js
import { audioManager } from './audio.js';
import { uiManager } from './ui.js';
import { recognitionManager } from './recognition.js';
import { responseManager, videoManager } from './utils.js';
import { emotionManager } from './emotion.js';

// Globālie mainīgie
window.audioManager = audioManager;
window.uiManager = uiManager;
window.recognitionManager = recognitionManager;
window.responseManager = responseManager;
window.videoManager = videoManager;
window.emotionManager = emotionManager;

// Objekts ar saskaņotiem audio un teksta pāriem
window.responseManager.responses = {
    wake_word: {
        pairs: [
            {
                text: 'Esmu pati uzmanība!',
                audio: 'MUSIC/voice_responses/esmupatiuzmaniba.mp3',
                video: 'VIDEO/esmupatiuzmaniba.mp4'
            },
            {
                text: 'Gatavs darbam!',
                audio: 'MUSIC/voice_responses/gatavsdarbam.mp3',
                video: 'VIDEO/gatavsdarbam.mp4'
            },
            {
                text: 'Jā?',
                audio: 'MUSIC/voice_responses/uzmanigiklausos.mp3',
                video: 'VIDEO/responses/varu_palidzet.mp4'
            },
            {
                text: 'Kā varu palīdzēt?',
                audio: 'MUSIC/voice_responses/kavarupalidzet.mp3',
                video: 'VIDEO/kavarupalidzet.mp4'
            }
        ],
        triggers: ['ada', 'adi', 'aivar', 'dj']
    }
};

// Emociju integrācija ar asistenta funkcionalitāti
function setupEmotionIntegration() {
    // Integrācija ar audio manager
    if (window.audioManager) {
        const originalPlaySong = window.audioManager.playSong;
        window.audioManager.playSong = function(kadrilKey, fragmentKey) {
            window.emotionManager.onMusicStart();
            return originalPlaySong.call(this, kadrilKey, fragmentKey);
        };

        const originalStopPlayback = window.audioManager.stopPlayback;
        window.audioManager.stopPlayback = function() {
            window.emotionManager.onMusicStop();
            return originalStopPlayback.call(this);
        };
    }

    // Integrācija ar recognition manager
    if (window.recognitionManager) {
        const originalStartListening = window.recognitionManager.startListening;
        window.recognitionManager.startListening = function() {
            window.emotionManager.onListening();
            return originalStartListening.call(this);
        };

        // Emociju maiņa atkarībā no atpazīšanas rezultātiem
        const originalRecognitionResult = window.recognitionManager.recognition?.onresult;
        if (window.recognitionManager.recognition) {
            window.recognitionManager.recognition.onresult = function(event) {
                window.emotionManager.onProcessing();
                
                // Izsaucam oriģinālo funkciju
                if (originalRecognitionResult) {
                    return originalRecognitionResult.call(this, event);
                }
            };

            window.recognitionManager.recognition.onerror = function(event) {
                window.emotionManager.onError();
                console.error('Runas atpazīšanas kļūda:', event.error);
            };
        }
    }
}

// Inicializācija pēc DOM ielādes
document.addEventListener('DOMContentLoaded', function() {
    // Uzgaidām īsu brīdi, lai visas komponentes tiktu pilnībā inicializētas
    setTimeout(() => {
        try {
            // Inicializējam emocionālo sistēmu
            if (window.emotionManager) {
                console.log('Emociju sistēma inicializēta');
                window.emotionManager.setEmotion('neutral');
            }
            
            // Iestatām emociju integrāciju
            setupEmotionIntegration();
            
            // Inicializējam asistenta UI, bet neaktivizējam mikrofonu automātiski
            if (window.uiManager) {
                window.uiManager.updateStatusText('Lūdzu, aktivizējiet manuāli');
                window.uiManager.updateSystemLog('Asistents gaida aktivizāciju');
            } else {
                console.error('UI manager nav pieejams!');
            }
            
            // Inicializējam fona video
            const backgroundVideo = document.getElementById('backgroundVideo');
            if (backgroundVideo) {
                backgroundVideo.play()
                    .then(() => {
                        console.log('Fona video sākts');
                        window.emotionManager.setEmotion('happy');
                    })
                    .catch(error => {
                        console.warn('Fona video nevar automātiski atskaņot:', error);
                        window.emotionManager.onError();
                    });
            }
        } catch (error) {
            console.error('Kļūda inicializējot asistentu:', error);
            if (window.uiManager) {
                window.uiManager.updateSystemLog(`Kļūda inicializējot: ${error.message}`);
                window.uiManager.updateStatusText('Kļūda inicializējot');
            }
            if (window.emotionManager) {
                window.emotionManager.onError();
            }
        }
    }, 500);
});

// Metode asistenta palaišanai no UI
function activateAssistant() {
    if (window.recognitionManager && window.uiManager) {
        // Emociju maiņa uz listening
        if (window.emotionManager) {
            window.emotionManager.onListening();
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                window.recognitionManager.startListening();
                window.recognitionManager.isWakeWordActivated = true;
                document.querySelector('.mic-btn').classList.add('active');
                window.uiManager.updateStatusText('Aktivizēts - klausos...');
                window.uiManager.updateSystemLog('Balss asistents aktivizēts');
                
                // Emociju maiņa uz processing
                if (window.emotionManager) {
                    setTimeout(() => {
                        window.emotionManager.onProcessing();
                    }, 1000);
                }
                
                // Atskaņojam aktivizācijas skaņu un parādam saskaņotu tekstu
                if (window.responseManager && window.responseManager.responses.wake_word.pairs.length > 0) {
                    const pairs = window.responseManager.responses.wake_word.pairs;
                    const randomIndex = Math.floor(Math.random() * pairs.length);
                    const selectedPair = pairs[randomIndex];
                    
                    window.audioManager.playParallel(selectedPair.audio, selectedPair.video);
                    window.uiManager.updateChatLog(`Asistents: ${selectedPair.text}`);
                    
                    // Pozitīva emociju atbildes reakcija
                    if (window.emotionManager) {
                        window.emotionManager.onSuccess();
                    }
                }
            })
            .catch(error => {
                console.error('Mikrofonam nav piekļuves:', error);
                if (window.uiManager) {
                    window.uiManager.updateSystemLog(`Mikrofonam nav piekļuves: ${error.message}`);
                    window.uiManager.updateStatusText('Lūdzu, atļaujiet piekļuvi mikrofonam');
                }
                if (window.emotionManager) {
                    window.emotionManager.onError();
                }
            });
    }
}

// Globāla asistenta aktivizācijas funkcija
window.activateAssistant = activateAssistant;

// Cleanup, kad lapa tiek aizvērta
window.addEventListener('beforeunload', () => {
    if (window.emotionManager) {
        window.emotionManager.cleanup();
    }
});