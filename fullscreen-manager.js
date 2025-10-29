// fullscreen-manager.js - Pilnekrāna un ESC funkcionalitāte
class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
        this.setupEventListeners();
        this.createFullscreenButton();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Fullscreen izmaiņu klausītājs
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
            this.updateUI();
            console.log('Fullscreen status:', this.isFullscreen);
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.isFullscreen = !!document.webkitFullscreenElement;
            this.updateFullscreenButton();
            this.updateUI();
        });

        document.addEventListener('mozfullscreenchange', () => {
            this.isFullscreen = !!document.mozFullScreenElement;
            this.updateFullscreenButton();
            this.updateUI();
        });

        document.addEventListener('msfullscreenchange', () => {
            this.isFullscreen = !!document.msFullscreenElement;
            this.updateFullscreenButton();
            this.updateUI();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // F11 - toggle fullscreen
            if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullscreen();
            }

            // ESC - exit fullscreen
            if (event.key === 'Escape') {
                if (this.isFullscreen) {
                    this.exitFullscreen();
                }
            }

            // Ctrl + Enter - toggle fullscreen (alternative)
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                this.toggleFullscreen();
            }

            // F - toggle fullscreen (when not in input field)
            if (event.key === 'f' && !this.isInputFocused()) {
                event.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }

    createFullscreenButton() {
        // Pievienojam fullscreen pogu pie header
        const header = document.querySelector('.header');
        if (!header) {
            console.warn('Header elements nav atrasts fullscreen pogai');
            return;
        }

        const fullscreenBtn = document.createElement('div');
        fullscreenBtn.id = 'fullscreenBtn';
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Pilnekrāns (F11)';

        // Pievienojam click handler
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Ievietojam pirms menu-icon
        const menuIcon = header.querySelector('.menu-icon');
        if (menuIcon) {
            header.insertBefore(fullscreenBtn, menuIcon);
        } else {
            header.appendChild(fullscreenBtn);
        }

        // Pievienojam CSS stilus
        this.addFullscreenStyles();
    }

    addFullscreenStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fullscreen-btn {
                cursor: pointer;
                font-size: 18px;
                color: #e6ff00;
                padding: 8px;
                border-radius: 3px;
                transition: all 0.3s;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
            }

            .fullscreen-btn:hover {
                background: rgba(230, 255, 0, 0.1);
                transform: scale(1.1);
            }

            .fullscreen-btn.active {
                background: rgba(230, 255, 0, 0.2);
                color: #ffffff;
            }

            /* Fullscreen stilizācija */
            .fullscreen-mode {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: #1a2724 !important;
            }

            .fullscreen-mode .main-container {
                height: 100vh !important;
                max-height: 100vh !important;
            }

            /* Fullscreen indikators */
            .fullscreen-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(230, 255, 0, 0.9);
                color: #1a2724;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }

            .fullscreen-indicator.show {
                opacity: 1;
            }

            /* ESC hint */
            .esc-hint {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: #e6ff00;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }

            .esc-hint.show {
                opacity: 1;
            }

            /* Responsive pilnekrāna režīmā */
            @media (max-width: 768px) {
                .fullscreen-mode .main-container {
                    flex-direction: column;
                }
                
                .fullscreen-mode .song-list-container {
                    max-width: none;
                    height: 30vh;
                }
                
                .fullscreen-mode .control-panel {
                    max-width: none;
                    height: 40vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async enterFullscreen() {
        if (this.isFullscreen) return;

        const element = document.documentElement;
        
        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            
            console.log('Ieejam pilnekrāna režīmā');
            
        } catch (error) {
            console.error('Neizdevās ieiet pilnekrāna režīmā:', error);
            
            // Fallback ar CSS
            this.enterCSSFullscreen();
        }
    }

    async exitFullscreen() {
        if (!this.isFullscreen) return;

        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
            
            console.log('Izejam no pilnekrāna režīma');
            
        } catch (error) {
            console.error('Neizdevās iziet no pilnekrāna režīma:', error);
            
            // Fallback ar CSS
            this.exitCSSFullscreen();
        }
    }

    enterCSSFullscreen() {
        document.body.classList.add('fullscreen-mode');
        this.isFullscreen = true;
        this.updateUI();
        this.updateFullscreenButton();
        console.log('CSS pilnekrāna režīms aktivizēts');
    }

    exitCSSFullscreen() {
        document.body.classList.remove('fullscreen-mode');
        this.isFullscreen = false;
        this.updateUI();
        this.updateFullscreenButton();
        console.log('CSS pilnekrāna režīms deaktivizēts');
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    updateFullscreenButton() {
        const btn = document.getElementById('fullscreenBtn');
        if (!btn) return;

        if (this.isFullscreen) {
            btn.innerHTML = '⛶'; // vai '⮹' exit fullscreen icon
            btn.title = 'Iziet no pilnekrāna (ESC)';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '⛶'; // vai '⮺' enter fullscreen icon  
            btn.title = 'Pilnekrāns (F11)';
            btn.classList.remove('active');
        }
    }

    updateUI() {
        // Atjauninām UI sistēmas statusu
        if (window.uiManager) {
            const statusText = this.isFullscreen 
                ? 'Pilnekrāna režīms (ESC - iziet)'
                : 'Parastais režīms (F11 - pilnekrāns)';
            
            window.uiManager.updateSystemLog(statusText);
        }

        // Rādām/slēpjam indikatorus
        this.showFullscreenIndicator();
        
        if (this.isFullscreen) {
            this.showEscHint();
        } else {
            this.hideEscHint();
        }
    }

    showFullscreenIndicator() {
        // Noņemam veco indikatoru, ja tāds ir
        const existingIndicator = document.querySelector('.fullscreen-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Izveidojam jaunu indikatoru
        const indicator = document.createElement('div');
        indicator.className = 'fullscreen-indicator';
        indicator.textContent = this.isFullscreen ? 'Pilnekrāns' : 'Parastais režīms';
        document.body.appendChild(indicator);

        // Rādām ar delay
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);

        // Slēpjam pēc 2 sekundēm
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 300);
        }, 2000);
    }

    showEscHint() {
        const existingHint = document.querySelector('.esc-hint');
        if (existingHint) return;

        const hint = document.createElement('div');
        hint.className = 'esc-hint';
        hint.textContent = 'Spiediet ESC, lai izietu no pilnekrāna';
        document.body.appendChild(hint);

        setTimeout(() => {
            hint.classList.add('show');
        }, 500);

        // Slēpjam pēc 4 sekundēm
        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 300);
        }, 4000);
    }

    hideEscHint() {
        const hint = document.querySelector('.esc-hint');
        if (hint) {
            hint.classList.remove('show');
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 300);
        }
    }

    // Publiskās metodes citiem moduļiem
    getFullscreenStatus() {
        return this.isFullscreen;
    }

    // Voice komandu atbalsts
    handleVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('pilnekrans') || 
            lowerCommand.includes('full screen') ||
            lowerCommand.includes('pilnu ekranu')) {
            
            if (!this.isFullscreen) {
                this.enterFullscreen();
                return 'Ieejam pilnekrāna režīmā';
            } else {
                return 'Jau esam pilnekrāna režīmā';
            }
        }
        
        if (lowerCommand.includes('iziet') && 
           (lowerCommand.includes('pilnekrans') || lowerCommand.includes('full screen'))) {
            
            if (this.isFullscreen) {
                this.exitFullscreen();
                return 'Izejam no pilnekrāna režīma';
            } else {
                return 'Neesam pilnekrāna režīmā';
            }
        }
        
        return null;
    }
}

// Izveidojam globālo fullscreen manager
export const fullscreenManager = new FullscreenManager();