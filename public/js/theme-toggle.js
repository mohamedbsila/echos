/**
 * Theme Toggle - Vinyl Style
 * A creative theme toggle that uses vinyl record visualization
 */
class ThemeToggle {
    constructor() {
        this.body = document.body;
        this.themeToggle = null;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.vinylRecord = null;
        this.vinylGrooves = [];
        this.numGrooves = 5;
        
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
        
        // Create slider knob
        const toggleSlider = document.createElement('div');
        toggleSlider.className = 'toggle-slider';
        
        // Add icon to slider
        const sliderIcon = document.createElement('i');
        sliderIcon.className = 'toggle-slider-icon fas';
        sliderIcon.classList.add(this.currentTheme === 'dark' ? 'fa-headphones' : 'fa-music');
        toggleSlider.appendChild(sliderIcon);
        
        // Create theme icons container
        const themeIconContainer = document.createElement('div');
        themeIconContainer.className = 'theme-icon-container';
        
        // Create headphones icon (dark theme)
        const headphonesIcon = document.createElement('i');
        headphonesIcon.className = 'theme-icon fas fa-headphones';
        if (this.currentTheme === 'dark') headphonesIcon.classList.add('active');
        
        // Create music note icon (light theme)
        const musicIcon = document.createElement('i');
        musicIcon.className = 'theme-icon fas fa-music';
        if (this.currentTheme === 'light') musicIcon.classList.add('active');
        
        // Add icons to container
        themeIconContainer.appendChild(headphonesIcon);
        themeIconContainer.appendChild(musicIcon);
        
        // Create vinyl record visualization
        const vinylContainer = document.createElement('div');
        vinylContainer.className = 'vinyl-container';
        
        // Create vinyl record
        const vinylRecord = document.createElement('div');
        vinylRecord.className = 'vinyl-record';
        
        // Create vinyl grooves
        for (let i = 0; i < this.numGrooves; i++) {
            const groove = document.createElement('div');
            groove.className = 'vinyl-groove';
            groove.style.setProperty('--groove-index', i);
            this.vinylGrooves.push(groove);
            vinylRecord.appendChild(groove);
        }
        
        // Create vinyl label
        const vinylLabel = document.createElement('div');
        vinylLabel.className = 'vinyl-label';
        
        // Create vinyl center hole
        const vinylHole = document.createElement('div');
        vinylHole.className = 'vinyl-hole';
        
        // Assemble vinyl
        vinylLabel.appendChild(vinylHole);
        vinylRecord.appendChild(vinylLabel);
        vinylContainer.appendChild(vinylRecord);
        
        // Store reference to vinyl
        this.vinylRecord = vinylRecord;
        
        // Append elements
        toggleContainer.appendChild(toggleSlider);
        toggleContainer.appendChild(themeIconContainer);
        toggleContainer.appendChild(vinylContainer);
        document.body.appendChild(toggleContainer);
        
        // Store reference
        this.themeToggle = toggleContainer;
        this.toggleSlider = toggleSlider;
        this.sliderIcon = sliderIcon;
        this.headphonesIcon = headphonesIcon;
        this.musicIcon = musicIcon;
    }
    
    addEventListeners() {
        this.themeToggle.addEventListener('click', () => {
            // Toggle theme
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add active class for animation
            this.themeToggle.classList.add('active');
            
            // Animate vinyl record
            if (this.vinylRecord) {
                this.vinylRecord.classList.add('spinning');
                setTimeout(() => {
                    this.vinylRecord.classList.remove('spinning');
                }, 1500);
            }
            
            // Apply new theme after animation
            setTimeout(() => {
                this.applyTheme(newTheme);
                this.themeToggle.classList.remove('active');
            }, 800);
        });
    }
    
    applyTheme(theme) {
        // Update data attribute
        this.body.setAttribute('data-theme', theme);
        
        // Update slider icon
        if (this.sliderIcon) {
            this.sliderIcon.className = 'toggle-slider-icon fas';
            this.sliderIcon.classList.add(theme === 'dark' ? 'fa-headphones' : 'fa-music');
        }
        
        // Update theme icons
        if (this.headphonesIcon && this.musicIcon) {
            if (theme === 'dark') {
                this.headphonesIcon.classList.add('active');
                this.musicIcon.classList.remove('active');
            } else {
                this.headphonesIcon.classList.remove('active');
                this.musicIcon.classList.add('active');
            }
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