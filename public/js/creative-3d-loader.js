// Creative 3D Loading Screen JavaScript
// Advanced 3D loading screen with dynamic progress tracking and smooth animations

class Creative3DLoader {
    constructor() {
        this.progress = 0;
        this.isLoading = true;
        this.loadedResources = 0;
        this.totalResources = 0;
        this.progressElement = null;
        this.statusElement = null;
        this.loaderElement = null;
        this.animationFrameId = null;
        this.particleSystem = null;
        this.floatingShapes = null;
        
        this.loadingMessages = [
            'Initializing Audio Engine...',
            'Loading Sound Libraries...',
            'Preparing Visual Effects...',
            'Synchronizing Beats...',
            'Optimizing Performance...',
            'Almost Ready...',
            'Welcome to ECHOS!'
        ];
        
        this.init();
    }
    
    init() {
        this.createLoader();
        this.setupResourceTracking();
        this.startProgressAnimation();
        this.createParticleSystem();
        this.createFloatingShapes();
        this.startLoadingSequence();
    }
    
    createLoader() {
        // Remove any existing loader
        const existingLoader = document.querySelector('.creative-3d-loader');
        if (existingLoader) {
            existingLoader.remove();
        }
        
        // Create main loader container
        const loader = document.createElement('div');
        loader.className = 'creative-3d-loader';
        loader.innerHTML = `
            <!-- Floating Geometric Shapes -->
            <div class="floating-shapes" id="floatingShapes"></div>
            
            <!-- Dynamic Particle System -->
            <div class="particle-system" id="particleSystem"></div>
            
            <!-- 3D Audio Visualizer Scene -->
            <div class="audio-visualizer-3d">
                <div class="audio-cube">
                    <div class="cube-face front">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                    <div class="cube-face back">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                    <div class="cube-face right">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                    <div class="cube-face left">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                    <div class="cube-face top">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                    <div class="cube-face bottom">
                        <div class="face-audio-bars">
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                            <div class="face-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 3D Logo -->
            <div class="creative-3d-logo">ECHOS</div>
            
            <!-- Holographic Progress Ring -->
            <div class="holographic-progress">
                <div class="progress-ring"></div>
                <div class="progress-percentage" id="progressPercentage">0%</div>
            </div>
            
            <!-- Loading Status -->
            <div class="loading-status" id="loadingStatus">Initializing...</div>
            
            <!-- Sound Wave Visualization -->
            <div class="sound-wave-container">
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(loader, document.body.firstChild);
        
        // Store references
        this.loaderElement = loader;
        this.progressElement = loader.querySelector('#progressPercentage');
        this.statusElement = loader.querySelector('#loadingStatus');
        this.particleSystem = loader.querySelector('#particleSystem');
        this.floatingShapes = loader.querySelector('#floatingShapes');
        
        // Prevent scrolling during loading
        document.body.style.overflow = 'hidden';
    }
    
    setupResourceTracking() {
        // Count resources to load
        const images = document.querySelectorAll('img');
        const scripts = document.querySelectorAll('script[src]');
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        this.totalResources = Math.max(10, images.length + scripts.length + stylesheets.length);
        
        // Track image loading
        images.forEach(img => {
            if (img.complete) {
                this.incrementProgress();
            } else {
                img.addEventListener('load', () => this.incrementProgress());
                img.addEventListener('error', () => this.incrementProgress());
            }
        });
        
        // Track font loading
        if (document.fonts) {
            document.fonts.ready.then(() => {
                this.incrementProgress();
            });
        }
        
        // Simulate additional loading steps
        this.simulateAsyncLoading();
    }
    
    simulateAsyncLoading() {
        // Simulate loading various components
        const loadingSteps = [
            { delay: 500, message: 'Loading Audio Engine...' },
            { delay: 800, message: 'Preparing Visual Effects...' },
            { delay: 1200, message: 'Synchronizing Beats...' },
            { delay: 1600, message: 'Optimizing Performance...' },
            { delay: 2000, message: 'Almost Ready...' },
            { delay: 2400, message: 'Welcome to ECHOS!' }
        ];
        
        loadingSteps.forEach((step, index) => {
            setTimeout(() => {
                this.updateStatus(step.message);
                this.incrementProgress(5);
                
                // Complete loading on last step
                if (index === loadingSteps.length - 1) {
                    setTimeout(() => {
                        this.completeLoading();
                    }, 500);
                }
            }, step.delay);
        });
    }
    
    incrementProgress(amount = 1) {
        this.loadedResources += amount;
        const newProgress = Math.min(100, Math.floor((this.loadedResources / this.totalResources) * 100));
        
        if (newProgress > this.progress) {
            this.progress = newProgress;
            this.updateProgressDisplay();
        }
    }
    
    updateProgressDisplay() {
        if (this.progressElement) {
            // Animate progress change
            const targetProgress = this.progress;
            const currentProgress = parseInt(this.progressElement.textContent) || 0;
            
            this.animateProgressTo(currentProgress, targetProgress);
        }
    }
    
    animateProgressTo(from, to) {
        const duration = 500; // 500ms animation
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(from + (to - from) * easeOutCubic);
            
            if (this.progressElement) {
                this.progressElement.textContent = `${currentValue}%`;
            }
            
            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    updateStatus(message) {
        if (this.statusElement) {
            // Add fade effect when changing status
            this.statusElement.style.opacity = '0';
            
            setTimeout(() => {
                this.statusElement.textContent = message;
                this.statusElement.style.opacity = '1';
            }, 200);
        }
    }
    
    startProgressAnimation() {
        // Dynamic progress ring animation based on actual progress
        const progressRing = this.loaderElement.querySelector('.progress-ring');
        if (!progressRing) return;
        
        const updateRingProgress = () => {
            if (!this.isLoading) return;
            
            const rotation = (this.progress / 100) * 360;
            progressRing.style.background = `conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(108, 68, 252, 0.8) ${rotation * 0.3}deg,
                rgba(255, 123, 84, 0.8) ${rotation * 0.7}deg,
                rgba(108, 68, 252, 0.8) ${rotation}deg,
                transparent ${rotation}deg
            )`;
            
            requestAnimationFrame(updateRingProgress);
        };
        
        updateRingProgress();
    }
    
    createParticleSystem() {
        if (!this.particleSystem) return;
        
        const particleCount = 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and properties
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${4 + Math.random() * 4}s`;
            
            // Random size variation
            const size = 2 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random color variations
            const hue = 250 + Math.random() * 60; // Purple to orange range
            particle.style.background = `radial-gradient(circle, hsl(${hue}, 70%, 60%), transparent)`;
            
            this.particleSystem.appendChild(particle);
        }
    }
    
    createFloatingShapes() {
        if (!this.floatingShapes) return;
        
        const shapes = ['triangle', 'circle', 'square'];
        const shapeCount = 15;
        
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            
            shape.className = `floating-shape ${shapeType}`;
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.animationDelay = `${Math.random() * 8}s`;
            shape.style.animationDuration = `${6 + Math.random() * 4}s`;
            
            // Random size variations
            const scale = 0.8 + Math.random() * 0.4;
            shape.style.transform = `scale(${scale})`;
            
            this.floatingShapes.appendChild(shape);
        }
    }
    
    startLoadingSequence() {
        // Add dynamic audio bar animations
        this.animateAudioBars();
        
        // Add interactive effects
        this.addInteractiveEffects();
        
        // Start minimum loading time
        this.enforceMinimumLoadingTime();
    }
    
    animateAudioBars() {
        const audioBars = this.loaderElement.querySelectorAll('.face-bar');
        
        const animateBars = () => {
            if (!this.isLoading) return;
            
            audioBars.forEach((bar, index) => {
                // Create dynamic height based on progress and random variation
                const baseHeight = 20 + (this.progress * 0.6); // 20-80% range
                const variation = Math.sin(Date.now() * 0.01 + index) * 20;
                const finalHeight = Math.max(15, Math.min(90, baseHeight + variation));
                
                bar.style.height = `${finalHeight}%`;
            });
            
            requestAnimationFrame(animateBars);
        };
        
        animateBars();
    }
    
    addInteractiveEffects() {
        // Add mouse move effect to the cube
        const audioCube = this.loaderElement.querySelector('.audio-cube');
        if (!audioCube) return;
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isLoading) return;
            
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });
        
        const updateCubeRotation = () => {
            if (!this.isLoading) return;
            
            const currentTransform = audioCube.style.transform || '';
            const baseRotation = `translate(-50%, -50%) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
            
            audioCube.style.transform = baseRotation;
            
            requestAnimationFrame(updateCubeRotation);
        };
        
        updateCubeRotation();
    }
    
    enforceMinimumLoadingTime() {
        // Ensure loading screen shows for at least 2 seconds
        setTimeout(() => {
            if (this.progress >= 100) {
                this.completeLoading();
            }
        }, 2000);
    }
    
    completeLoading() {
        if (!this.isLoading) return;
        
        this.isLoading = false;
        this.progress = 100;
        
        // Final progress update
        if (this.progressElement) {
            this.progressElement.textContent = '100%';
        }
        
        if (this.statusElement) {
            this.statusElement.textContent = 'Welcome to ECHOS!';
        }
        
        // Wait a moment then fade out
        setTimeout(() => {
            this.fadeOut();
        }, 800);
    }
    
    fadeOut() {
        if (!this.loaderElement) return;
        
        this.loaderElement.classList.add('fade-out');
        
        // Remove from DOM after fade animation
        setTimeout(() => {
            if (this.loaderElement && this.loaderElement.parentNode) {
                this.loaderElement.parentNode.removeChild(this.loaderElement);
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Trigger completion event
            this.triggerLoadingComplete();
            
            // Cleanup
            this.cleanup();
        }, 800);
    }
    
    triggerLoadingComplete() {
        const event = new CustomEvent('creative3DLoaderComplete', {
            detail: {
                loadTime: performance.now(),
                resourcesLoaded: this.loadedResources
            }
        });
        
        window.dispatchEvent(event);
    }
    
    cleanup() {
        // Cancel any ongoing animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Clear references
        this.loaderElement = null;
        this.progressElement = null;
        this.statusElement = null;
        this.particleSystem = null;
        this.floatingShapes = null;
    }
    
    // Public API methods
    setProgress(percent) {
        this.progress = Math.min(100, Math.max(0, percent));
        this.updateProgressDisplay();
    }
    
    setStatus(message) {
        this.updateStatus(message);
    }
    
    forceComplete() {
        this.completeLoading();
    }
}

// Initialize the creative 3D loader
let creative3DLoader;

document.addEventListener('DOMContentLoaded', () => {
    // Remove old preloader if it exists
    const oldPreloader = document.querySelector('.preloader');
    if (oldPreloader) {
        oldPreloader.remove();
    }
    
    // Initialize new creative loader
    creative3DLoader = new Creative3DLoader();
});

// Global API
window.Creative3DLoader = {
    getInstance: () => creative3DLoader,
    setProgress: (percent) => {
        if (creative3DLoader) {
            creative3DLoader.setProgress(percent);
        }
    },
    setStatus: (message) => {
        if (creative3DLoader) {
            creative3DLoader.setStatus(message);
        }
    },
    complete: () => {
        if (creative3DLoader) {
            creative3DLoader.forceComplete();
        }
    }
};

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
    });
    
    // Optimize animations for better performance
    const style = document.createElement('style');
    style.textContent = `
        .creative-3d-loader * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
        }
    `;
    document.head.appendChild(style);
});