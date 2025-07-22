/**
 * Background Music Player
 * Plays music in light mode and manages audio controls
 */
class BackgroundMusic {
    constructor() {
        this.audio = null;
        this.switchSound = null;
        this.isPlaying = false;
        this.volume = 0.3; // Default volume (30%)
        this.currentTheme = document.body.getAttribute('data-theme') || 'dark';
        
        // Music tracks for different modes
        this.musicTracks = {
            dark: 'music/FREE TRAVIS SCOTT Type Beat - _KICK OUT_ [w9T3IoCNT6Q].mp3',
            light: 'music/[FREE] JID Type Beat _The Recreation_ [GSb3JGYSEI4].mp3'
        };
        
        // Switch sound effect
        this.switchSoundUrl = 'music/radio switch sound effect.wav';
        
        // Audio context for effects
        this.audioContext = null;
        this.gainNode = null;
        this.musicControls = null;
        
        this.init();
    }
    
    init() {
        // Initialize Web Audio API
        this.initAudioContext();
        
        // Create audio elements with preload
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous"; // Add CORS header
        this.audio.src = this.musicTracks[this.currentTheme];
        this.audio.loop = true;
        this.audio.volume = this.volume;
        this.audio.preload = 'auto';
        
        // Create switch sound effect
        this.switchSound = new Audio();
        this.switchSound.crossOrigin = "anonymous"; // Add CORS header
        this.switchSound.src = this.switchSoundUrl;
        this.switchSound.preload = 'auto';
        
        // Create music controls
        this.createMusicControls();
        
        // Add music visualizer
        this.createVisualizer();
        
        // Add event listeners
        this.addEventListeners();
        
        // Try to play immediately on page load
        this.setupAutoplay();
    }
    
    initAudioContext() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            this.audioContext = new AudioContext();
            
            // Create gain node for volume control and effects
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume;
            this.gainNode.connect(this.audioContext.destination);
            
            console.log("Audio Context initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Audio Context:", error);
        }
    }
    
    setupAutoplay() {
        // Only try once on window load
        window.addEventListener('load', () => {
            // Show message immediately rather than trying autoplay
            this.showSimplifiedAutoplayMessage();
        }, { once: true });
        
        // Try on first user interaction with the page
        const userInteractionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
        const handleUserInteraction = () => {
            if (!this.isPlaying) {
                // Remove any existing messages
                const existingMessage = document.getElementById('music-autoplay-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Play music
                this.play();
            }
            
            // Remove event listeners once played
            userInteractionEvents.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
        
        userInteractionEvents.forEach(event => {
            document.addEventListener(event, handleUserInteraction);
        });
    }
    
    showSimplifiedAutoplayMessage() {
        // Check if message already exists
        if (document.querySelector('.autoplay-message')) {
            return;
        }
        
        // Create a simpler message that doesn't block the screen
        const message = document.createElement('div');
        message.className = 'simplified-autoplay-message';
        message.id = 'music-autoplay-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-music"></i>
                <span>Click anywhere to play music</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .simplified-autoplay-message {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(108, 68, 252, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 30px;
                font-size: 14px;
                z-index: 1001;
                animation: fadeIn 0.5s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .simplified-autoplay-message .message-content {
                display: flex;
                align-items: center;
            }
            
            .simplified-autoplay-message i {
                margin-right: 8px;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        // Add click event to play music
        message.addEventListener('click', () => {
            this.play();
            message.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.remove();
            }
        }, 10000);
    }
    
    createVisualizer() {
        // Create visualizer container
        const visualizer = document.createElement('div');
        visualizer.className = 'music-visualizer';
        
        // Create bars
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            visualizer.appendChild(bar);
        }
        
        // Add to music controls
        if (this.musicControls) {
            const inner = this.musicControls.querySelector('.music-control-inner');
            if (inner) {
                inner.appendChild(visualizer);
            }
        }
        
        // Store reference to visualizer
        this.visualizer = visualizer;
        this.visualizerBars = Array.from(visualizer.querySelectorAll('.visualizer-bar'));
        
        // Add visualizer styles
        let styleEl = document.getElementById('music-controls-styles');
        if (styleEl) {
            const visualizerStyles = `
                .music-visualizer {
                    display: flex;
                    align-items: flex-end;
                    height: 20px;
                    margin-left: 10px;
                    gap: 2px;
                }
                
                .visualizer-bar {
                    width: 3px;
                    height: 5px;
                    background: var(--primary-color);
                    border-radius: 1px;
                    opacity: 0.7;
                    transition: height 0.1s ease-out;
                }
                
                [data-theme="dark"] .visualizer-bar {
                    background: var(--secondary-color);
                }
                
                .music-playing .visualizer-bar:nth-child(1) {
                    animation: sound-wave-1 0.8s infinite ease-in-out;
                }
                
                .music-playing .visualizer-bar:nth-child(2) {
                    animation: sound-wave-2 0.7s infinite ease-in-out;
                }
                
                .music-playing .visualizer-bar:nth-child(3) {
                    animation: sound-wave-3 1.1s infinite ease-in-out;
                }
                
                .music-playing .visualizer-bar:nth-child(4) {
                    animation: sound-wave-2 0.9s infinite ease-in-out;
                }
                
                .music-playing .visualizer-bar:nth-child(5) {
                    animation: sound-wave-1 1.0s infinite ease-in-out;
                }
                
                @keyframes sound-wave-1 {
                    0%, 100% {
                        height: 5px;
                    }
                    50% {
                        height: 15px;
                    }
                }
                
                @keyframes sound-wave-2 {
                    0%, 100% {
                        height: 5px;
                    }
                    50% {
                        height: 18px;
                    }
                }
                
                @keyframes sound-wave-3 {
                    0%, 100% {
                        height: 5px;
                    }
                    50% {
                        height: 20px;
                    }
                }
                
                /* Theme-specific animations */
                [data-theme="dark"] .music-playing .visualizer-bar {
                    animation-timing-function: cubic-bezier(0.1, 0.8, 0.1, 1);
                }
                
                [data-theme="light"] .music-playing .visualizer-bar {
                    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
                }
                
                /* Switch animation */
                .visualizer-bar.switching {
                    animation: bar-switch 0.5s ease-in-out !important;
                }
                
                @keyframes bar-switch {
                    0% {
                        height: 5px;
                        transform: scaleY(1);
                    }
                    50% {
                        height: 2px;
                        transform: scaleY(0.5);
                    }
                    100% {
                        height: 5px;
                        transform: scaleY(1);
                    }
                }
                
                @media (max-width: 768px) {
                    .music-visualizer {
                        display: none;
                    }
                }
            `;
            
            styleEl.textContent += visualizerStyles;
        }
        
        // Set up audio analysis if Web Audio API is available
        this.setupAudioAnalysis();
    }
    
    setupAudioAnalysis() {
        try {
            if (!this.audioContext || !this.audio) return;
            
            // Create analyzer node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            // Use a safer way to connect audio
            this.audio.addEventListener('canplaythrough', () => {
                try {
                    // Only create source once to avoid errors
                    if (!this.audioSource) {
                        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
                        this.audioSource.connect(this.analyser);
                        this.analyser.connect(this.gainNode);
                        
                        // Start visualization
                        this.visualize();
                        console.log("Audio analysis setup successful");
                    }
                } catch (err) {
                    console.log("Audio visualization will run without frequency analysis:", err);
                    // Still run visualization with fallback animation
                    this.visualize();
                }
            }, { once: true });
            
        } catch (error) {
            console.error("Failed to setup audio analysis:", error);
        }
    }
    
    visualize() {
        if (!this.visualizerBars) {
            return; // Exit if no visualizer bars
        }
        
        if (this.analyser && this.isPlaying) {
            try {
                // Get frequency data
                const bufferLength = this.analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                this.analyser.getByteFrequencyData(dataArray);
                
                // Calculate frequency bands for visualization
                const bands = [
                    this.getAverageFrequency(dataArray, 0, 10),    // Bass
                    this.getAverageFrequency(dataArray, 10, 30),   // Low-mid
                    this.getAverageFrequency(dataArray, 30, 60),   // Mid
                    this.getAverageFrequency(dataArray, 60, 90),   // High-mid
                    this.getAverageFrequency(dataArray, 90, 120)   // High
                ];
                
                // Update visualizer bars if not using CSS animations
                if (!this.musicControls?.classList.contains('music-playing')) {
                    this.visualizerBars.forEach((bar, i) => {
                        const height = Math.max(5, bands[i] / 255 * 20);
                        bar.style.height = `${height}px`;
                    });
                }
            } catch (error) {
                // Fallback to CSS animations if there's an error
                if (this.musicControls && this.isPlaying) {
                    this.musicControls.classList.add('music-playing');
                }
            }
        } else {
            // Fallback to CSS animations if analyzer isn't available
            if (this.musicControls && this.isPlaying) {
                this.musicControls.classList.add('music-playing');
            }
        }
        
        // Continue animation loop
        requestAnimationFrame(() => this.visualize());
    }
    
    getAverageFrequency(dataArray, startIndex, endIndex) {
        let sum = 0;
        for (let i = startIndex; i < endIndex; i++) {
            sum += dataArray[i];
        }
        return sum / (endIndex - startIndex);
    }
    
    createMusicControls() {
        // Create container
        const controls = document.createElement('div');
        controls.className = 'music-controls';
        
        // Get track name based on current theme
        const trackName = this.currentTheme === 'dark' ? 
            'Travis Scott Type Beat - KICK OUT' : 
            'JID Type Beat - The Recreation';
        
        controls.innerHTML = `
            <div class="music-control-inner">
                <button class="music-toggle">
                    <i class="fas fa-play"></i>
                </button>
                <div class="music-info">
                    <div class="track-info-container">
                        <span class="music-title">Echos - ${trackName}</span>
                        <div class="theme-indicator">
                            <span class="theme-dot dark-dot ${this.currentTheme === 'dark' ? 'active' : ''}"></span>
                            <span class="theme-dot light-dot ${this.currentTheme === 'light' ? 'active' : ''}"></span>
                        </div>
                    </div>
                    <div class="volume-slider-container">
                        <i class="fas fa-volume-up volume-icon"></i>
                        <input type="range" class="volume-slider" min="0" max="100" value="${this.volume * 100}">
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(controls);
        
        // Store references
        this.musicControls = controls;
        this.playButton = controls.querySelector('.music-toggle');
        this.volumeSlider = controls.querySelector('.volume-slider');
        this.volumeIcon = controls.querySelector('.volume-icon');
        
        // Add styles
        this.addStyles();
    }
    
    addStyles() {
        // Create style element if it doesn't exist
        let styleEl = document.getElementById('music-controls-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'music-controls-styles';
            document.head.appendChild(styleEl);
        }
        
        // Add styles
        styleEl.textContent = `
            .music-controls {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0.7;
            }
            
            .music-controls:hover {
                opacity: 1;
            }
            
                         .music-control-inner {
                display: flex;
                align-items: center;
                background: rgba(0, 0, 0, 0.6);
                padding: 8px 15px;
                border-radius: 30px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(108, 68, 252, 0.2);
            }
            
            [data-theme="light"] .music-control-inner {
                background: rgba(255, 255, 255, 0.8);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(108, 68, 252, 0.3);
            }
            
            .music-toggle {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: var(--primary-color);
                border: none;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-right: 10px;
                transition: all 0.3s ease;
            }
            
            .music-toggle:hover {
                transform: scale(1.1);
                background: var(--secondary-color);
            }
            
            .music-info {
                display: flex;
                flex-direction: column;
            }
            
            .track-info-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 5px;
                width: 100%;
            }
            
            .music-title {
                font-size: 12px;
                color: white;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 150px;
            }
            
            [data-theme="light"] .music-title {
                color: #333;
            }
            
            .theme-indicator {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-left: 8px;
            }
            
            .theme-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                opacity: 0.3;
                transition: all 0.3s ease;
            }
            
            .theme-dot.active {
                opacity: 1;
                transform: scale(1.2);
            }
            
            .dark-dot {
                background: #333;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
            }
            
            .light-dot {
                background: #fff;
                box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
            }
            
            .volume-slider-container {
                display: flex;
                align-items: center;
            }
            
            .volume-icon {
                color: white;
                font-size: 12px;
                margin-right: 5px;
            }
            
            [data-theme="light"] .volume-icon {
                color: #333;
            }
            
            .volume-slider {
                width: 80px;
                height: 4px;
                -webkit-appearance: none;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
                outline: none;
            }
            
            [data-theme="light"] .volume-slider {
                background: rgba(0, 0, 0, 0.2);
            }
            
            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
            }
            
            @media (max-width: 768px) {
                .music-controls {
                    bottom: 10px;
                    left: 10px;
                }
                
                .music-title {
                    display: none;
                }
                
                .volume-slider {
                    width: 60px;
                }
            }
        `;
    }
    
    addEventListeners() {
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            const newTheme = e.detail.theme;
            if (newTheme !== this.currentTheme) {
                // Switch tracks with transition effect
                this.switchTrack(newTheme);
            }
        });
        
        // Play/pause button
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            });
        }
        
        // Volume slider
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', () => {
                const volume = this.volumeSlider.value / 100;
                this.setVolume(volume);
            });
        }
        
        // Audio events
        if (this.audio) {
            this.audio.addEventListener('play', () => {
                this.updatePlayButton(true);
            });
            
            this.audio.addEventListener('pause', () => {
                this.updatePlayButton(false);
            });
            
            // Handle autoplay restrictions
            this.audio.addEventListener('canplaythrough', () => {
                this.checkThemeAndPlay();
            });
            
            // Update track title when song changes
            this.audio.addEventListener('loadeddata', () => {
                this.updateTrackInfo();
            });
        }
    }
    
    switchTrack(newTheme) {
        // Don't switch if not playing
        if (!this.isPlaying) {
            this.currentTheme = newTheme;
            this.audio.src = this.musicTracks[newTheme];
            return;
        }
        
        // Remember current playback position and volume
        const wasPlaying = this.isPlaying;
        const currentVolume = this.audio.volume;
        const currentTime = this.audio.currentTime / this.audio.duration; // Save as percentage
        
        // Animate visualizer for track switch
        this.animateVisualizerSwitch();
        
        // Create fade out effect
        this.fadeOut()
            .then(() => {
                // Play switch sound
                this.playSwitchSound();
                
                // Change track source
                this.currentTheme = newTheme;
                this.audio.src = this.musicTracks[newTheme];
                
                // Set volume to 0 for fade in
                this.audio.volume = 0;
                
                // Wait for new track to load
                this.audio.oncanplaythrough = () => {
                    // Set new track to similar position
                    if (this.audio.duration) {
                        this.audio.currentTime = this.audio.duration * 0.1; // Start at 10% of the new track
                    }
                    
                    // Play and fade in
                    if (wasPlaying) {
                        this.audio.play()
                            .then(() => {
                                this.fadeIn(currentVolume);
                                this.updateTrackInfo();
                                
                                // Add special effect for theme transition
                                this.addThemeTransitionEffect(newTheme);
                            })
                            .catch(error => {
                                console.error("Failed to play after track switch:", error);
                                this.audio.volume = currentVolume;
                            });
                    } else {
                        this.audio.volume = currentVolume;
                    }
                    
                    // Remove the event handler
                    this.audio.oncanplaythrough = null;
                };
            });
    }
    
    animateVisualizerSwitch() {
        if (!this.visualizerBars) return;
        
        // Add switching class to each bar with staggered timing
        this.visualizerBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('switching');
                
                // Remove class after animation completes
                setTimeout(() => {
                    bar.classList.remove('switching');
                }, 500);
            }, index * 100);
        });
    }
    
    addThemeTransitionEffect(theme) {
        // Create a flash effect overlay for theme transition
        const flash = document.createElement('div');
        flash.className = 'theme-transition-flash';
        document.body.appendChild(flash);
        
        // Add styles for flash effect
        const style = document.createElement('style');
        style.textContent = `
            .theme-transition-flash {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
                z-index: 9999;
                pointer-events: none;
                animation: flash-transition 1s forwards;
            }
            
            @keyframes flash-transition {
                0% {
                    opacity: 0;
                }
                20% {
                    opacity: 0.7;
                }
                100% {
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Remove flash element after animation
        setTimeout(() => {
            if (document.body.contains(flash)) {
                document.body.removeChild(flash);
            }
        }, 1000);
    }
    
    fadeOut() {
        return new Promise((resolve) => {
            if (!this.isPlaying || !this.audio) {
                resolve();
                return;
            }
            
            // Get current volume
            const startVolume = this.audio.volume;
            let volume = startVolume;
            
            // Create fade out effect
            const fadeInterval = setInterval(() => {
                // Reduce volume gradually
                volume -= 0.05;
                
                if (volume <= 0) {
                    // Stop the interval when volume reaches 0
                    clearInterval(fadeInterval);
                    this.audio.volume = 0;
                    resolve();
                } else {
                    // Update volume
                    this.audio.volume = volume;
                }
            }, 50);
        });
    }
    
    fadeIn(targetVolume) {
        let volume = 0;
        this.audio.volume = 0;
        
        // Create fade in effect
        const fadeInterval = setInterval(() => {
            // Increase volume gradually
            volume += 0.05;
            
            if (volume >= targetVolume) {
                // Stop the interval when target volume is reached
                clearInterval(fadeInterval);
                this.audio.volume = targetVolume;
            } else {
                // Update volume
                this.audio.volume = volume;
            }
        }, 100);
    }
    
    playSwitchSound() {
        if (this.switchSound) {
            // Reset sound to beginning
            this.switchSound.currentTime = 0;
            
            // Set volume based on main volume
            this.switchSound.volume = this.volume * 1.2; // Slightly louder than music
            
            // Play the switch sound
            this.switchSound.play().catch(error => {
                console.error("Failed to play switch sound:", error);
            });
        }
    }
    
    updateTrackInfo() {
        if (!this.musicControls) return;
        
        // Update track title in music controls
        const musicTitle = this.musicControls.querySelector('.music-title');
        if (musicTitle) {
            const trackName = this.currentTheme === 'dark' ? 
                'Travis Scott Type Beat - KICK OUT' : 
                'JID Type Beat - The Recreation';
            
            musicTitle.textContent = `Echos - ${trackName}`;
        }
        
        // Update theme indicator dots
        const darkDot = this.musicControls.querySelector('.dark-dot');
        const lightDot = this.musicControls.querySelector('.light-dot');
        
        if (darkDot && lightDot) {
            if (this.currentTheme === 'dark') {
                darkDot.classList.add('active');
                lightDot.classList.remove('active');
            } else {
                darkDot.classList.remove('active');
                lightDot.classList.add('active');
            }
        }
        
        // Update visualizer style based on theme
        if (this.visualizer) {
            this.visualizer.querySelectorAll('.visualizer-bar').forEach(bar => {
                bar.style.transition = 'background-color 0.5s ease';
            });
        }
    }
    
    checkThemeAndPlay() {
        // Update current theme
        this.currentTheme = document.body.getAttribute('data-theme') || 'dark';
        
        // Make sure we're using the right track
        if (this.audio.src !== this.musicTracks[this.currentTheme]) {
            this.audio.src = this.musicTracks[this.currentTheme];
        }
        
        // Update track info
        this.updateTrackInfo();
        
        // Try to play
        if (!this.isPlaying) {
            // Try to play immediately
            this.play();
            
            // Try again after a short delay (sometimes helps with autoplay)
            setTimeout(() => {
                if (!this.isPlaying) {
                    this.play();
                }
            }, 1000);
            
            // If still not playing after 2 seconds, try one more time
            setTimeout(() => {
                if (!this.isPlaying) {
                    this.forcePlay();
                }
            }, 2000);
        }
    }
    
    forcePlay() {
        // Instead of trying to force autoplay, just show the message
        // Most browsers will block autoplay without user interaction
        this.showSimplifiedAutoplayMessage();
    }
    
    play() {
        if (this.audio && !this.isPlaying) {
            // Make sure we're using the right track
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            if (this.currentTheme !== currentTheme) {
                this.currentTheme = currentTheme;
                this.audio.src = this.musicTracks[this.currentTheme];
                this.updateTrackInfo();
            }
            
            // Fade in from zero if not already playing
            this.audio.volume = 0;
            
            // Create play promise to handle autoplay restrictions
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton(true);
                    
                    // Fade in to target volume
                    this.fadeIn(this.volume);
                    
                    // Activate visualizer
                    if (this.musicControls) {
                        this.musicControls.classList.add('music-playing');
                    }
                }).catch(error => {
                    // Auto-play was prevented
                    console.log("Autoplay prevented:", error);
                    this.isPlaying = false;
                    this.updatePlayButton(false);
                    
                    // Show message to user
                    this.showAutoplayMessage();
                });
            }
        }
    }
    
    pause() {
        if (this.audio && this.isPlaying) {
            // Fade out then pause
            this.fadeOut().then(() => {
                this.audio.pause();
                this.isPlaying = false;
                this.updatePlayButton(false);
                
                // Deactivate visualizer
                if (this.musicControls) {
                    this.musicControls.classList.remove('music-playing');
                }
                
                // Reset volume for next play
                this.audio.volume = this.volume;
            });
        }
    }
    
    setVolume(volume) {
        if (this.audio) {
            this.volume = volume;
            
            // If playing, smoothly transition to new volume
            if (this.isPlaying) {
                const currentVolume = this.audio.volume;
                const volumeDiff = volume - currentVolume;
                const steps = 5;
                let step = 0;
                
                const volumeInterval = setInterval(() => {
                    step++;
                    const newVolume = currentVolume + (volumeDiff * step / steps);
                    this.audio.volume = newVolume;
                    
                    if (step >= steps) {
                        clearInterval(volumeInterval);
                        this.audio.volume = volume;
                    }
                }, 30);
            } else {
                this.audio.volume = volume;
            }
            
            // Also update switch sound volume
            if (this.switchSound) {
                this.switchSound.volume = volume * 1.2;
            }
            
            // Update gain node if using Web Audio API
            if (this.gainNode) {
                this.gainNode.gain.value = volume;
            }
            
            this.updateVolumeIcon();
        }
    }
    
    updatePlayButton(isPlaying) {
        if (this.playButton) {
            const icon = this.playButton.querySelector('i');
            if (icon) {
                icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            this.isPlaying = isPlaying;
        }
    }
    
    updateVolumeIcon() {
        if (this.volumeIcon) {
            if (this.volume === 0) {
                this.volumeIcon.className = 'fas fa-volume-mute';
            } else if (this.volume < 0.5) {
                this.volumeIcon.className = 'fas fa-volume-down';
            } else {
                this.volumeIcon.className = 'fas fa-volume-up';
            }
        }
    }
    
    showAutoplayMessage() {
        // Check if message already exists to prevent duplicates
        if (document.querySelector('.autoplay-message')) {
            return;
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = 'autoplay-message';
        message.id = 'music-autoplay-message';
        message.innerHTML = `
            <div class="autoplay-message-content">
                <div class="message-header">
                    <i class="fas fa-music"></i>
                    <span>Music Blocked</span>
                </div>
                <p>Browser blocked autoplay. Click below to start music:</p>
                <button class="enable-audio-btn">
                    <i class="fas fa-play"></i> Play Music Now
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .autoplay-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-size: 16px;
                z-index: 2000;
                animation: fadeIn 0.5s ease;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
                border: 1px solid var(--primary-color);
                text-align: center;
                max-width: 300px;
            }
            
            [data-theme="light"] .autoplay-message {
                background: rgba(255, 255, 255, 0.95);
                color: #333;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            }
            
            .message-header {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                font-weight: bold;
                font-size: 18px;
                color: var(--primary-color);
            }
            
            .message-header i {
                margin-right: 10px;
                animation: pulse 1.5s infinite;
            }
            
            .autoplay-message p {
                margin: 0 0 15px 0;
                line-height: 1.4;
            }
            
            .enable-audio-btn {
                background: var(--primary-color);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 30px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
                width: 100%;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .enable-audio-btn i {
                margin-right: 8px;
            }
            
            .enable-audio-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-3px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            /* Add overlay behind message */
            .autoplay-message::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: -1;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        // Add event listener to enable button
        const enableBtn = message.querySelector('.enable-audio-btn');
        if (enableBtn) {
            enableBtn.addEventListener('click', () => {
                this.audio.play()
                    .then(() => {
                        this.isPlaying = true;
                        this.updatePlayButton(true);
                        if (this.musicControls) {
                            this.musicControls.classList.add('music-playing');
                        }
                        message.remove();
                    })
                    .catch(error => {
                        console.error("Still couldn't play audio:", error);
                        // Show a different message
                        const errorMsg = document.createElement('p');
                        errorMsg.textContent = "Still unable to play. Please try again or check browser settings.";
                        errorMsg.style.color = "#ff5252";
                        errorMsg.style.marginTop = "10px";
                        message.querySelector('.autoplay-message-content').appendChild(errorMsg);
                    });
            });
        }
        
        // Auto-remove after 20 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.remove();
            }
        }, 20000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundMusic();
}); 