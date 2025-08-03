// Enhanced Mobile Music Controls JavaScript
// Advanced touch-to-expand music controls with smooth animations

class EnhancedMusicControls {
    constructor() {
        this.isExpanded = false;
        this.isPlaying = false;
        this.expandTimeout = null;
        this.inactivityTimeout = null;
        this.touchStartTime = 0;
        this.scrollTimeout = null;
        this.lastScrollY = 0;
        this.currentTrack = {
            title: "Current Track",
            artist: "ECHOS",
            duration: 180, // 3 minutes
            currentTime: 60 // 1 minute
        };
        
        this.init();
    }
    
    init() {
        // Only initialize on mobile/tablet devices
        if (window.innerWidth <= 1024) {
            this.createEnhancedControls();
            this.setupEventListeners();
            this.setupScrollBehavior();
            this.startFloatingAnimation();
        }
        
        // Re-initialize on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                if (!document.querySelector('.enhanced-music-control')) {
                    this.createEnhancedControls();
                    this.setupEventListeners();
                }
            } else {
                this.cleanup();
            }
        });
    }
    
    createEnhancedControls() {
        // Remove existing controls if any
        const existingControl = document.querySelector('.enhanced-music-control');
        if (existingControl) {
            existingControl.remove();
        }
        
        // Create enhanced music control element
        const musicControl = document.createElement('div');
        musicControl.className = 'enhanced-music-control small floating';
        musicControl.setAttribute('role', 'button');
        musicControl.setAttribute('aria-label', 'Music Player Controls');
        musicControl.setAttribute('tabindex', '0');
        
        musicControl.innerHTML = `
            <div class="enhanced-music-bars">
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
                <div class="enhanced-bar"></div>
            </div>
            
            <div class="enhanced-control-panel">
                <button class="enhanced-control-btn" id="prevBtn" aria-label="Previous Track">
                    <i class="fas fa-step-backward"></i>
                </button>
                
                <button class="enhanced-control-btn enhanced-play-btn" id="playPauseBtn" aria-label="Play/Pause">
                    <i class="fas fa-play" id="playIcon"></i>
                </button>
                
                <button class="enhanced-control-btn" id="nextBtn" aria-label="Next Track">
                    <i class="fas fa-step-forward"></i>
                </button>
            </div>
            
            <div class="enhanced-track-info">
                <span id="trackTitle">${this.currentTrack.title}</span> - 
                <span id="trackArtist">${this.currentTrack.artist}</span>
            </div>
            
            <div class="enhanced-progress-bar">
                <div class="enhanced-progress-fill" id="progressFill"></div>
            </div>
            
            <div class="enhanced-volume-indicator">
                <div class="enhanced-volume-bar active"></div>
                <div class="enhanced-volume-bar active"></div>
                <div class="enhanced-volume-bar active"></div>
                <div class="enhanced-volume-bar"></div>
                <div class="enhanced-volume-bar"></div>
            </div>
        `;
        
        // Insert into DOM
        document.body.appendChild(musicControl);
        
        // Store reference
        this.musicControl = musicControl;
        this.progressFill = musicControl.querySelector('#progressFill');
        this.playIcon = musicControl.querySelector('#playIcon');
        
        // Start progress animation
        this.updateProgress();
    }
    
    setupEventListeners() {
        if (!this.musicControl) return;
        
        // Touch and click events for expansion
        this.musicControl.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.musicControl.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.musicControl.addEventListener('click', this.handleClick.bind(this));
        
        // Keyboard support
        this.musicControl.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Control button events
        const playPauseBtn = this.musicControl.querySelector('#playPauseBtn');
        const prevBtn = this.musicControl.querySelector('#prevBtn');
        const nextBtn = this.musicControl.querySelector('#nextBtn');
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', this.previousTrack.bind(this));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', this.nextTrack.bind(this));
        }
        
        // Progress bar interaction
        const progressBar = this.musicControl.querySelector('.enhanced-progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', this.handleProgressClick.bind(this));
        }
        
        // Global events
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        document.addEventListener('touchstart', this.handleOutsideTouch.bind(this));
        document.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
    
    handleTouchStart(e) {
        this.touchStartTime = Date.now();
        this.addRippleEffect(e);
        
        // Clear any existing timeouts
        this.clearTimeouts();
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Only expand if it's a quick touch (not a long press or drag)
        if (touchDuration < 300) {
            if (!this.isExpanded) {
                this.expand();
            } else {
                // If already expanded and touched, reset the timeout
                this.resetInactivityTimeout();
            }
        }
    }
    
    handleClick(e) {
        // Prevent default click behavior when expanded to avoid conflicts
        if (this.isExpanded) {
            e.stopPropagation();
            this.resetInactivityTimeout();
        } else {
            this.expand();
        }
    }
    
    handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!this.isExpanded) {
                this.expand();
            } else {
                this.togglePlayPause();
            }
        } else if (e.key === 'Escape' && this.isExpanded) {
            this.collapse();
        }
    }
    
    handleOutsideClick(e) {
        if (this.isExpanded && !this.musicControl.contains(e.target)) {
            this.collapse();
        }
    }
    
    handleOutsideTouch(e) {
        if (this.isExpanded && !this.musicControl.contains(e.target)) {
            this.collapse();
        }
    }
    
    handleScroll() {
        if (!this.musicControl) return;
        
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
        
        // If user scrolls significantly, collapse the control
        if (this.isExpanded && scrollDifference > 50) {
            this.collapse();
        }
        
        this.lastScrollY = currentScrollY;
        
        // Clear existing timeout and set new one
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            // Auto-collapse after scroll stops
            if (this.isExpanded) {
                this.resetInactivityTimeout();
            }
        }, 150);
    }
    
    expand() {
        if (this.isExpanded) return;
        
        this.isExpanded = true;
        this.musicControl.classList.remove('small', 'floating');
        this.musicControl.classList.add('large');
        
        // Add pulse effect for attention
        this.musicControl.classList.add('pulse');
        setTimeout(() => {
            this.musicControl.classList.remove('pulse');
        }, 1000);
        
        // Set inactivity timeout
        this.resetInactivityTimeout();
        
        // Trigger expand event
        this.triggerEvent('musicControlExpanded');
    }
    
    collapse() {
        if (!this.isExpanded) return;
        
        this.isExpanded = false;
        this.musicControl.classList.remove('large');
        this.musicControl.classList.add('small');
        
        // Clear timeouts
        this.clearTimeouts();
        
        // Restart floating animation after a delay
        setTimeout(() => {
            if (!this.isExpanded) {
                this.musicControl.classList.add('floating');
            }
        }, 500);
        
        // Trigger collapse event
        this.triggerEvent('musicControlCollapsed');
    }
    
    togglePlayPause(e) {
        if (e) {
            e.stopPropagation();
        }
        
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.playIcon.className = 'fas fa-pause';
            this.musicControl.classList.remove('paused');
            this.startProgressAnimation();
        } else {
            this.playIcon.className = 'fas fa-play';
            this.musicControl.classList.add('paused');
            this.stopProgressAnimation();
        }
        
        // Reset inactivity timeout
        this.resetInactivityTimeout();
        
        // Trigger play/pause event
        this.triggerEvent('musicPlayPause', { isPlaying: this.isPlaying });
    }
    
    previousTrack(e) {
        if (e) {
            e.stopPropagation();
        }
        
        // Simulate track change
        this.currentTrack.currentTime = 0;
        this.updateTrackInfo();
        this.resetInactivityTimeout();
        
        // Add button feedback
        this.addButtonFeedback(e.target);
        
        // Trigger previous track event
        this.triggerEvent('musicPreviousTrack');
    }
    
    nextTrack(e) {
        if (e) {
            e.stopPropagation();
        }
        
        // Simulate track change
        this.currentTrack.currentTime = 0;
        this.updateTrackInfo();
        this.resetInactivityTimeout();
        
        // Add button feedback
        this.addButtonFeedback(e.target);
        
        // Trigger next track event
        this.triggerEvent('musicNextTrack');
    }
    
    handleProgressClick(e) {
        e.stopPropagation();
        
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressPercent = (clickX / rect.width) * 100;
        
        // Update progress
        this.currentTrack.currentTime = (progressPercent / 100) * this.currentTrack.duration;
        this.updateProgress();
        this.resetInactivityTimeout();
        
        // Trigger progress change event
        this.triggerEvent('musicProgressChange', { 
            progress: progressPercent,
            currentTime: this.currentTrack.currentTime 
        });
    }
    
    addRippleEffect(e) {
        this.musicControl.classList.add('ripple');
        setTimeout(() => {
            this.musicControl.classList.remove('ripple');
        }, 600);
    }
    
    addButtonFeedback(button) {
        if (!button) return;
        
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    updateProgress() {
        if (!this.progressFill) return;
        
        const progressPercent = (this.currentTrack.currentTime / this.currentTrack.duration) * 100;
        this.progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    }
    
    startProgressAnimation() {
        this.progressInterval = setInterval(() => {
            if (this.isPlaying && this.currentTrack.currentTime < this.currentTrack.duration) {
                this.currentTrack.currentTime += 1;
                this.updateProgress();
            }
        }, 1000);
    }
    
    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    updateTrackInfo() {
        const trackTitle = this.musicControl.querySelector('#trackTitle');
        const trackArtist = this.musicControl.querySelector('#trackArtist');
        
        if (trackTitle) trackTitle.textContent = this.currentTrack.title;
        if (trackArtist) trackArtist.textContent = this.currentTrack.artist;
        
        this.updateProgress();
    }
    
    resetInactivityTimeout() {
        this.clearTimeouts();
        
        // Auto-collapse after 5 seconds of inactivity
        this.inactivityTimeout = setTimeout(() => {
            this.collapse();
        }, 5000);
    }
    
    clearTimeouts() {
        if (this.expandTimeout) {
            clearTimeout(this.expandTimeout);
            this.expandTimeout = null;
        }
        
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
        }
    }
    
    startFloatingAnimation() {
        // Add subtle floating animation when not expanded
        if (!this.isExpanded) {
            this.musicControl.classList.add('floating');
        }
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        const updateScrollBehavior = () => {
            const scrollY = window.scrollY;
            
            // Hide control when scrolling down fast, show when scrolling up
            if (scrollY > this.lastScrollY + 100 && scrollY > 200) {
                this.musicControl.style.transform = 'translateX(-50%) translateY(100px)';
                this.musicControl.style.opacity = '0.7';
            } else {
                this.musicControl.style.transform = 'translateX(-50%) translateY(0)';
                this.musicControl.style.opacity = '1';
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollBehavior);
                ticking = true;
            }
        }, { passive: true });
    }
    
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...data,
                isExpanded: this.isExpanded,
                isPlaying: this.isPlaying,
                currentTrack: this.currentTrack
            }
        });
        
        window.dispatchEvent(event);
    }
    
    // Public API methods
    setTrack(trackInfo) {
        this.currentTrack = { ...this.currentTrack, ...trackInfo };
        this.updateTrackInfo();
    }
    
    play() {
        if (!this.isPlaying) {
            this.togglePlayPause();
        }
    }
    
    pause() {
        if (this.isPlaying) {
            this.togglePlayPause();
        }
    }
    
    setProgress(percent) {
        this.currentTrack.currentTime = (percent / 100) * this.currentTrack.duration;
        this.updateProgress();
    }
    
    forceExpand() {
        this.expand();
    }
    
    forceCollapse() {
        this.collapse();
    }
    
    cleanup() {
        this.clearTimeouts();
        this.stopProgressAnimation();
        
        if (this.musicControl) {
            this.musicControl.remove();
            this.musicControl = null;
        }
    }
}

// Initialize enhanced music controls
let enhancedMusicControls;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile/tablet devices
    if (window.innerWidth <= 1024) {
        enhancedMusicControls = new EnhancedMusicControls();
    }
});

// Global API
window.EnhancedMusicControls = {
    getInstance: () => enhancedMusicControls,
    init: () => {
        if (!enhancedMusicControls) {
            enhancedMusicControls = new EnhancedMusicControls();
        }
        return enhancedMusicControls;
    }
};

// Performance optimization with requestAnimationFrame
function optimizeAnimations() {
    // Use transform instead of changing layout properties
    const style = document.createElement('style');
    style.textContent = `
        .enhanced-music-control {
            will-change: transform, opacity;
        }
        
        .enhanced-bar {
            will-change: transform, opacity;
        }
        
        .enhanced-control-btn {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
}

// Initialize optimizations
document.addEventListener('DOMContentLoaded', optimizeAnimations);