// recognition-light.js - Viegla versija bez Whisper
class LightRecognitionManager {
    constructor() {
        this.isListening = false;
        this.isWakeWordActivated = false;
        this.currentDevice = null;
        this.devices = [];
        this.recognition = null;
        this.isRestartPending = false;
        
        this.controlCommands = {
            stop: ['stop', 'apstas ties', 'beidz', 'beigt', 'pietiek', 'partrauc'],
            pause: ['pauze', 'pauzt', 'nopauze', 'nopauzet', 'pagaidi'],
            resume: ['turpini', 'turpinat', 'atsakt', 'atsac']
        };
        
        this.commands = {
            wakeWords: ['aivar', 'ada', 'dj', 'adi'],
            dances: [
                'bērzgale', 'bērzgali', 'berliņš', 'berliūu', 'kvadrāts', 'kvadrātu', 
                'rikava', 'rikavu', 'krusta kazāks', 'kazaks', 'lancis', 'lants',
                'ciganovskis', 'ciganovski', 'lancejots', 'balabaska', 'rusins',
                'narecenka', 'family jig', 'dziga', 'ziga', 'padespans', 'spainis',
                'spain', 'sarkano', 'sarkanais', 'flamingo', 'uz upiti', 'uz upi'
            ],
            parts: [
                'sakums', 'otrais sakums', 'vidus', 'beigas', 'solo', 'maina',
                'darzins', 'pirmais darzins', 'otrais darzins', 'tresais darzins',
                'meitu darzins', 'puisu darzins', 'lielais darzins',
                'pirmie mazie darzini', 'otrie mazie darzini', 'mazie darzini',
                'pirmais', 'otrais', 'tresais', 'ceturtais', 'piektais', 'sestais',
                'pirma dala', '3', '3gabals', '3 gabals', '4', '4gabals', '5gabals', '5 gabals',
                'vartini', 'vartini otrie', 'puisi', 'puisi pirmais', 'puisi otrie',
                'vija', 'vija pirma', 'vija otra', 'valsis', 'valsis otrais',
                'dzirnavas', 'puisu dzirnavas', 'meitu dzirnavas', 'meitas', 'meitas vidu',
                'do za do', 'pirmais gabals', 'otrais gabals', 'tresais gabals', 'ceturtais gabals',
                'piektais gabals', 'sestais gabals', 'domasanas gabals', 'dancosanas gabals',
                'spardisanas gabals', 'kumela gabals', 'cirula gabals',
                'pirmais gajiens', 'otrais gajiens', 'pa trim', 'stikis',
                'diognales pirmas', 'diognales otras', 'piedziedajums'
            ],
            controls: ['stop', 'beidz', 'apstas ties', 'pauze', 'turpini', 'atsakt']
        };

        this.setupSpeechRecognition();
        this.initializeAudioDevices();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Parlukprogramma neatbalsta runas atpazisanu');
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Parlukprogramma neatbalsta runas atpazisanu');
            }
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'lv-LV';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
                
        this.recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            
            if (!result.isFinal) {
                const text = result[0].transcript.toLowerCase();
                console.log('Interim rezultats:', text);
                
                if (this.controlCommands.stop.some(cmd => text.includes(cmd)) ||
                    this.controlCommands.pause.some(cmd => text.includes(cmd)) ||
                    this.controlCommands.resume.some(cmd => text.includes(cmd))) {
                    
                    if (window.uiManager) {
                        window.uiManager.updateChatLog('Jus: ' + text);
                    }
                    
                    if (window.audioManager) {
                        const response = window.audioManager.handleCommand(text);
                        if (response && window.uiManager) {
                            window.uiManager.handleResponse(response);
                            this.stopRecognition();
                            this.restartRecognition();
                        }
                    }
                    return;
                }
                return;
            }

            const alternatives = Array.from(result).map(r => r.transcript.toLowerCase());
            console.log('Galagie rezultati:', alternatives);
            
            const bestMatch = this.findBestMatch(alternatives);
            if (!bestMatch) {
                console.log('Nav atrasta atbilstosa komanda');
                return;
            }

            const text = bestMatch;
            console.log('Izmantota komanda:', text);

            if (!this.isWakeWordActivated) {
                const isWakeWord = this.commands.wakeWords.some(word => text.includes(word));
                if (isWakeWord) {
                    this.isWakeWordActivated = true;
                    if (window.uiManager) {
                        window.uiManager.updateStatusText('Aktivizets - klausos...');
                        window.uiManager.updateChatLog('Jus: ' + text);
                    }
                    
                    if (window.responseManager) {
                        const response = window.responseManager.findResponse('wake_word');
                        if (response && window.uiManager) {
                            window.uiManager.handleResponse(response);
                        }
                    }
                }
                this.stopRecognition();
                this.restartRecognition();
                return;
            }

            if (window.uiManager) {
                window.uiManager.updateChatLog('Jus: ' + text);
            }
            
            if (window.audioManager) {
                const response = window.audioManager.handleCommand(text);
                
                if (response && window.uiManager) {
                    this.isWakeWordActivated = false;
                    window.uiManager.updateStatusText('Gaidu aktivizaciju...');
                    window.uiManager.handleResponse(response);
                }
            }
            
            this.stopRecognition();
            this.restartRecognition();
        };

        this.recognition.onerror = (event) => {
            console.error('Runas atpazisanas kluda:', event.error);
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Runas atpazisanas kluda: ' + event.error);
                if (event.error === 'not-allowed') {
                    window.uiManager.updateSystemLog('Parlukam nav piekluves mikrofonam. Ludzu, atlaujiet pieklavi.');
                }
            }
            
            this.stopRecognition();
            this.restartRecognition();
        };

        this.recognition.onend = () => {
            if (this.isListening && !this.isRestartPending) {
                this.restartRecognition();
            }
        };

        console.log('Web Speech API inicializets');
        if (window.uiManager) {
            window.uiManager.updateSystemLog('Web Speech API gatavs');
            window.uiManager.updateStatusText('Gatavs - aktivizejiet mikrofonu');
        }
    }

    stopRecognition() {
        if (this.recognition) {
            try {
                this.recognition.abort();
            } catch (error) {
                console.error('Kluda apturot atpazisanu:', error);
            }
        }
    }

    restartRecognition() {
        if (this.isRestartPending) {
            return;
        }
        
        if (this.isListening) {
            this.isRestartPending = true;
            
            setTimeout(() => {
                this.isRestartPending = false;
                
                try {
                    if (this.recognition) {
                        try {
                            this.recognition.abort();
                        } catch (e) {
                            // Ignore
                        }
                        
                        setTimeout(() => {
                            try {
                                this.recognition.start();
                                console.log("Runas atpazisana restarteta");
                            } catch (error) {
                                console.error('Kluda sakot atpazisanu:', error);
                                
                                this.setupSpeechRecognition();
                                
                                try {
                                    this.recognition.start();
                                } catch (secondError) {
                                    console.error('Atkartota kluda sakot atpazisanu:', secondError);
                                }
                            }
                        }, 200);
                    }
                } catch (error) {
                    console.error('Kluda restatrejot atpazisanu:', error);
                }
            }, 300);
        }
    }

    findBestMatch(alternatives) {
        const allCommands = [
            ...this.commands.wakeWords,
            ...this.commands.dances,
            ...this.commands.parts,
            ...this.commands.controls
        ];

        for (const alternative of alternatives) {
            for (const command of allCommands) {
                if (alternative.includes(command)) {
                    return alternative;
                }
            }
        }

        return null;
    }

    async initializeAudioDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'audioinput');
            
            console.log('Pieejamas audio ierices:', this.devices);
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Atrastas audio ierices: ' + 
                    this.devices.map(d => d.label || 'Ierice ' + d.deviceId).join(', '));
            }

            this.createDeviceSelector();

            navigator.mediaDevices.addEventListener('devicechange', async () => {
                const devices = await navigator.mediaDevices.enumerateDevices();
                this.devices = devices.filter(device => device.kind === 'audioinput');
                this.createDeviceSelector();
                if (window.uiManager) {
                    window.uiManager.updateSystemLog('Audio ieracu saraksts atjauninats');
                }
            });

        } catch (error) {
            console.error('Kluda iegustot audio ierices:', error);
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Kluda iegustot audio ierices: ' + error.message);
            }
        }
    }

    createDeviceSelector() {
        let select = document.getElementById('audioDeviceSelect');
        if (!select) {
            select = document.createElement('select');
            select.id = 'audioDeviceSelect';
            select.className = 'audio-device-select';
            const inputSection = document.querySelector('.input-section');
            if (inputSection) {
                inputSection.insertBefore(select, inputSection.firstChild);
            }
        }

        select.innerHTML = '';

        this.devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || 'Mikrofons ' + device.deviceId.slice(0, 5);
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.switchAudioDevice(e.target.value);
        });
    }

    async switchAudioDevice(deviceId) {
        try {
            if (this.isListening) {
                this.stopListening();
            }

            await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: {exact: deviceId}
                }
            });

            this.currentDevice = deviceId;
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Audio ierice nomainita');
            }

            if (this.isListening) {
                await this.startListening();
            }

        } catch (error) {
            console.error('Kluda mainot audio ierici:', error);
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Kluda mainot audio ierici: ' + error.message);
            }
        }
    }

    async startListening() {
        try {
            if (this.currentDevice) {
                await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: {exact: this.currentDevice}
                    }
                });
            } else {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            if (!this.recognition) {
                this.setupSpeechRecognition();
            }
            
            this.stopRecognition();
            
            this.isListening = true;
            const micBtn = document.querySelector('.mic-btn');
            if (micBtn) {
                micBtn.classList.add('active');
            }
            
            if (window.uiManager) {
                window.uiManager.updateStatusText('Klausos...');
            }
            
            try {
                this.recognition.start();
                console.log("Runas atpazisana sakta");
                if (window.uiManager) {
                    window.uiManager.updateSystemLog("Runas atpazisana sakta");
                }
            } catch (error) {
                console.error('Kluda sakot atpazisanu:', error);
                
                const playAudioOnInteraction = () => {
                    this.recognition.start()
                        .then(() => {
                            console.log("Audio atskansana aktivizeta pec interakcijas");
                        })
                        .catch(e => console.error("Atkartota kluda ar audio:", e));
                    document.removeEventListener('click', playAudioOnInteraction);
                };
                document.addEventListener('click', playAudioOnInteraction);
            }

        } catch (error) {
            console.error('Mikrofonam nav piekluves:', error);
            if (window.uiManager) {
                window.uiManager.updateSystemLog('Mikrofonam nav piekluves: ' + error.message);
            }
        }
    }

    stopListening() {
        if (!this.recognition) return;
        
        this.isListening = false;
        const micBtn = document.querySelector('.mic-btn');
        if (micBtn) {
            micBtn.classList.remove('active');
        }
        
        if (window.uiManager) {
            window.uiManager.updateStatusText('Gaidisanas rezima');
        }
        
        this.stopRecognition();
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    getIsListening() {
        return this.isListening;
    }
}

export const recognitionManager = new LightRecognitionManager();