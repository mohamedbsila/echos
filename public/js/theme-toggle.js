/**
 * Theme Toggle - DJ Disk Style
 * Toggles between dark and light mode themes
 */
class ThemeToggle {
    constructor() {
        this.body = document.body;
        this.themeToggle = null;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Create the theme toggle element
        this.createToggle();
        
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener
        this.addEventListeners();
    }
    
    createToggle() {
        // Create container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle';
        
        // Create DJ disk
        const djDisk = document.createElement('div');
        djDisk.className = 'dj-disk-toggle';
        
        // Create vinyl texture
        const vinylTexture = document.createElement('div');
        vinylTexture.className = 'vinyl-texture';
        
        // Create icon
        const icon = document.createElement('i');
        icon.className = 'theme-icon fas';
        icon.classList.add(this.currentTheme === 'dark' ? 'fa-moon' : 'fa-sun');
        
        // Create label text
        const labelText = document.createElement('div');
        labelText.className = 'label-text';
        labelText.textContent = this.currentTheme === 'dark' ? 'NIGHT' : 'DAY';
        
        // Append elements
        djDisk.appendChild(vinylTexture);
        djDisk.appendChild(icon);
        djDisk.appendChild(labelText);
        toggleContainer.appendChild(djDisk);
        document.body.appendChild(toggleContainer);
        
        // Store reference
        this.themeToggle = toggleContainer;
        this.themeIcon = icon;
        this.labelText = labelText;
    }
    
    addEventListeners() {
        this.themeToggle.addEventListener('click', () => {
            // Toggle theme
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add active class for animation
            this.themeToggle.classList.add('active');
            
            // Add direction class based on theme change
            if (newTheme === 'light') {
                this.themeToggle.classList.add('rotate-right');
                this.themeToggle.classList.remove('rotate-left');
            } else {
                this.themeToggle.classList.add('rotate-left');
                this.themeToggle.classList.remove('rotate-right');
            }
            
            // Create vinyl scratch sound
            this.playVinylScratchSound();
            
            // Apply new theme after animation
            setTimeout(() => {
                this.applyTheme(newTheme);
                this.themeToggle.classList.remove('active');
            }, 800);
        });
    }
    
    playVinylScratchSound() {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioCtx = new AudioContext();
        
        // Create oscillator for scratch sound
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Set parameters for vinyl scratch sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        
        // Play and stop
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }
    
    applyTheme(theme) {
        // Update data attribute
        this.body.setAttribute('data-theme', theme);
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = 'theme-icon fas';
            this.themeIcon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
        }
        
        // Update label text
        if (this.labelText) {
            this.labelText.textContent = theme === 'dark' ? 'NIGHT' : 'DAY';
            
            // Add animation class
            this.labelText.classList.add('text-change');
            setTimeout(() => {
                this.labelText.classList.remove('text-change');
            }, 500);
        }
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Dispatch custom event for theme change
        const themeEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeEvent);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    const themeToggle = new ThemeToggle();
    
    // Force theme to light mode if not already set
    if (themeToggle.currentTheme !== 'light') {
        setTimeout(() => {
            themeToggle.applyTheme('light');
        }, 1000);
    }
}); 