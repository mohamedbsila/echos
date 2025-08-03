// Mobile Performance Optimizer
// Comprehensive performance optimization for mobile devices to reduce lag and improve smoothness

class MobilePerformanceOptimizer {
    constructor() {
        this.isOptimized = false;
        this.deviceInfo = this.detectDevice();
        this.performanceLevel = this.detectPerformanceLevel();
        this.optimizations = {
            animations: true,
            particles: true,
            blur: true,
            shadows: true,
            transforms: true
        };
        
        this.init();
    }
    
    init() {
        // Only run on mobile/tablet devices
        if (window.innerWidth <= 1024) {
            this.optimizeForMobile();
            this.setupPerformanceMonitoring();
            this.optimizeAnimations();
            this.optimizeRendering();
            this.optimizeMemory();
            this.setupAdaptiveQuality();
        }
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        
        return {
            isIOS: /iphone|ipad|ipod/.test(userAgent),
            isAndroid: /android/.test(userAgent),
            isTablet: /ipad|android(?!.*mobile)/.test(userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1024),
            isMobile: window.innerWidth <= 768,
            isLowEnd: this.isLowEndDevice(),
            pixelRatio: window.devicePixelRatio || 1,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        };
    }
    
    isLowEndDevice() {
        // Detect low-end devices based on various factors
        const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
        const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
        const pixelRatio = window.devicePixelRatio || 1;
        const screenSize = window.screen.width * window.screen.height;
        
        // Consider low-end if:
        // - Less than 3GB RAM
        // - Less than 4 CPU cores
        // - Very high pixel density with large screen (performance intensive)
        return memory < 3 || cores < 4 || (pixelRatio > 2 && screenSize > 1000000);
    }
    
    detectPerformanceLevel() {
        // Determine performance level based on device capabilities
        if (this.deviceInfo.isLowEnd) {
            return 'low';
        } else if (this.deviceInfo.isTablet || (this.deviceInfo.isMobile && this.deviceInfo.pixelRatio <= 2)) {
            return 'medium';
        } else {
            return 'high';
        }
    }
    
    optimizeForMobile() {
        // Apply mobile-specific optimizations
        this.optimizeViewport();
        this.optimizeTouchEvents();
        this.optimizeScrolling();
        this.optimizeImages();
        this.optimizeFonts();
        
        this.isOptimized = true;
        console.log(`Mobile optimizations applied for ${this.performanceLevel} performance device`);
    }
    
    optimizeViewport() {
        // Ensure proper viewport configuration
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // Optimize viewport for performance
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        
        // Add performance hints
        const performanceHints = document.createElement('meta');
        performanceHints.name = 'mobile-web-app-capable';
        performanceHints.content = 'yes';
        document.head.appendChild(performanceHints);
    }
    
    optimizeTouchEvents() {
        // Optimize touch event handling
        const style = document.createElement('style');
        style.textContent = `
            /* Optimize touch events */
            * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
            
            /* Enable hardware acceleration for touch elements */
            .enhanced-mobile-nav,
            .enhanced-music-control,
            .creative-3d-loader {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            /* Optimize scrolling */
            body {
                -webkit-overflow-scrolling: touch;
                overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeScrolling() {
        // Implement passive event listeners for better scroll performance
        const passiveSupported = this.supportsPassive();
        
        // Optimize scroll events
        let ticking = false;
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Handle scroll events here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        document.addEventListener('scroll', optimizedScrollHandler, 
            passiveSupported ? { passive: true } : false
        );
        
        // Optimize touch events
        document.addEventListener('touchstart', (e) => {
            // Prevent default only when necessary
        }, passiveSupported ? { passive: true } : false);
        
        document.addEventListener('touchmove', (e) => {
            // Handle touch move efficiently
        }, passiveSupported ? { passive: true } : false);
    }
    
    supportsPassive() {
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }
    
    optimizeImages() {
        // Implement lazy loading and image optimization
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for modern browsers
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Optimize image rendering
            img.style.willChange = 'auto';
            img.style.transform = 'translateZ(0)';
        });
        
        // Create intersection observer for manual lazy loading fallback
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    optimizeFonts() {
        // Optimize font loading
        if ('fonts' in document) {
            // Preload critical fonts
            const criticalFonts = [
                'Arial, sans-serif',
                'system-ui, -apple-system, sans-serif'
            ];
            
            document.fonts.ready.then(() => {
                console.log('Fonts loaded');
            });
        }
        
        // Add font-display: swap for better performance
        const fontOptimizationStyle = document.createElement('style');
        fontOptimizationStyle.textContent = `
            @font-face {
                font-display: swap;
            }
        `;
        document.head.appendChild(fontOptimizationStyle);
    }
    
    optimizeAnimations() {
        // Apply animation optimizations based on performance level
        const animationOptimizations = document.createElement('style');
        
        let optimizationCSS = '';
        
        if (this.performanceLevel === 'low') {
            // Reduce animations for low-end devices
            optimizationCSS = `
                /* Reduce animations for low-end devices */
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                
                .creative-3d-loader .audio-cube {
                    animation-duration: 8s !important;
                }
                
                .enhanced-music-control .enhanced-bar {
                    animation-duration: 0.8s !important;
                }
                
                /* Disable complex animations */
                .floating-shapes,
                .particle-system {
                    display: none !important;
                }
            `;
        } else if (this.performanceLevel === 'medium') {
            // Moderate optimizations
            optimizationCSS = `
                /* Moderate optimizations for medium performance */
                .creative-3d-loader .audio-cube {
                    animation-duration: 10s !important;
                }
                
                .particle-system .particle:nth-child(n+15) {
                    display: none;
                }
                
                .floating-shapes .floating-shape:nth-child(n+10) {
                    display: none;
                }
            `;
        }
        
        // Common optimizations for all mobile devices
        optimizationCSS += `
            /* Common mobile optimizations */
            * {
                will-change: auto;
            }
            
            .enhanced-mobile-nav,
            .enhanced-music-control,
            .creative-3d-loader {
                will-change: transform, opacity;
            }
            
            /* Optimize transforms */
            .enhanced-bar,
            .face-bar,
            .particle,
            .floating-shape {
                will-change: transform;
                transform: translateZ(0);
            }
            
            /* Reduce blur effects on low-end devices */
            ${this.performanceLevel === 'low' ? `
                .enhanced-mobile-nav,
                .enhanced-sidebar-menu,
                .enhanced-music-control {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
            ` : ''}
        `;
        
        animationOptimizations.textContent = optimizationCSS;
        document.head.appendChild(animationOptimizations);
    }
    
    optimizeRendering() {
        // Optimize rendering performance
        const renderingOptimizations = document.createElement('style');
        renderingOptimizations.textContent = `
            /* Rendering optimizations */
            body {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeSpeed;
            }
            
            /* Enable hardware acceleration selectively */
            .enhanced-mobile-nav,
            .enhanced-music-control,
            .creative-3d-loader .audio-cube {
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            /* Optimize compositing */
            .enhanced-sidebar-menu,
            .enhanced-sidebar-overlay {
                contain: layout style paint;
            }
        `;
        document.head.appendChild(renderingOptimizations);
    }
    
    optimizeMemory() {
        // Implement memory optimization strategies
        this.setupMemoryCleanup();
        this.optimizeEventListeners();
        this.implementLazyLoading();
    }
    
    setupMemoryCleanup() {
        // Clean up unused resources periodically
        setInterval(() => {
            // Force garbage collection if available (development only)
            if (window.gc && typeof window.gc === 'function') {
                window.gc();
            }
            
            // Clean up unused DOM elements
            this.cleanupUnusedElements();
        }, 30000); // Every 30 seconds
    }
    
    cleanupUnusedElements() {
        // Remove elements that are no longer needed
        const unusedElements = document.querySelectorAll('.fade-out, .hidden, [style*="display: none"]');
        unusedElements.forEach(element => {
            if (element.parentNode && !element.classList.contains('permanent')) {
                element.parentNode.removeChild(element);
            }
        });
    }
    
    optimizeEventListeners() {
        // Use event delegation to reduce memory usage
        document.addEventListener('click', this.handleDelegatedClick.bind(this));
        document.addEventListener('touchstart', this.handleDelegatedTouch.bind(this));
    }
    
    handleDelegatedClick(e) {
        // Handle clicks efficiently through delegation
        const target = e.target.closest('[data-action]');
        if (target) {
            const action = target.dataset.action;
            this.executeAction(action, target, e);
        }
    }
    
    handleDelegatedTouch(e) {
        // Handle touch events efficiently
        const target = e.target.closest('.enhanced-music-control, .enhanced-menu-btn');
        if (target) {
            // Add touch feedback
            target.classList.add('touching');
            setTimeout(() => {
                target.classList.remove('touching');
            }, 150);
        }
    }
    
    executeAction(action, target, event) {
        // Execute actions based on data attributes
        switch (action) {
            case 'expand-music':
                // Handle music control expansion
                break;
            case 'toggle-menu':
                // Handle menu toggle
                break;
            default:
                // Handle other actions
                break;
        }
    }
    
    implementLazyLoading() {
        // Implement lazy loading for various elements
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        this.loadLazyElement(element);
                        lazyObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '100px'
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }
    
    loadLazyElement(element) {
        // Load lazy elements when they come into view
        const lazyType = element.dataset.lazy;
        
        switch (lazyType) {
            case 'animation':
                element.classList.add('animate');
                break;
            case 'background':
                if (element.dataset.bg) {
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                }
                break;
            default:
                element.classList.add('loaded');
                break;
        }
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance and adjust optimizations
        if ('PerformanceObserver' in window) {
            // Monitor long tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry.duration + 'ms');
                        this.handleLongTask(entry);
                    }
                });
            });
            
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Longtask observer not supported
            }
            
            // Monitor layout shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.value > 0.1) {
                        console.warn('Layout shift detected:', entry.value);
                        this.handleLayoutShift(entry);
                    }
                });
            });
            
            try {
                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // Layout shift observer not supported
            }
        }
        
        // Monitor frame rate
        this.monitorFrameRate();
    }
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust optimizations based on FPS
                if (fps < 30) {
                    this.increaseOptimizations();
                } else if (fps > 50 && this.performanceLevel === 'low') {
                    this.decreaseOptimizations();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    handleLongTask(entry) {
        // Handle long tasks by increasing optimizations
        if (entry.duration > 100) {
            this.increaseOptimizations();
        }
    }
    
    handleLayoutShift(entry) {
        // Handle layout shifts
        console.log('Layout shift in:', entry.sources);
    }
    
    increaseOptimizations() {
        // Increase optimization level
        if (this.optimizations.particles) {
            this.optimizations.particles = false;
            this.disableParticles();
        } else if (this.optimizations.blur) {
            this.optimizations.blur = false;
            this.disableBlurEffects();
        } else if (this.optimizations.shadows) {
            this.optimizations.shadows = false;
            this.disableShadows();
        }
    }
    
    decreaseOptimizations() {
        // Decrease optimization level (re-enable features)
        if (!this.optimizations.shadows) {
            this.optimizations.shadows = true;
            this.enableShadows();
        } else if (!this.optimizations.blur) {
            this.optimizations.blur = true;
            this.enableBlurEffects();
        }
    }
    
    disableParticles() {
        const particles = document.querySelectorAll('.particle-system, .floating-shapes');
        particles.forEach(particle => {
            particle.style.display = 'none';
        });
    }
    
    disableBlurEffects() {
        const style = document.createElement('style');
        style.id = 'blur-optimization';
        style.textContent = `
            * {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    disableShadows() {
        const style = document.createElement('style');
        style.id = 'shadow-optimization';
        style.textContent = `
            * {
                box-shadow: none !important;
                text-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableShadows() {
        const shadowStyle = document.getElementById('shadow-optimization');
        if (shadowStyle) {
            shadowStyle.remove();
        }
    }
    
    enableBlurEffects() {
        const blurStyle = document.getElementById('blur-optimization');
        if (blurStyle) {
            blurStyle.remove();
        }
    }
    
    setupAdaptiveQuality() {
        // Implement adaptive quality based on device performance
        this.adaptiveQualityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    // Element is visible, ensure full quality
                    element.classList.add('high-quality');
                    element.classList.remove('low-quality');
                } else {
                    // Element is not visible, reduce quality
                    element.classList.remove('high-quality');
                    element.classList.add('low-quality');
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe expensive elements
        const expensiveElements = document.querySelectorAll('.creative-3d-loader, .enhanced-music-control');
        expensiveElements.forEach(element => {
            this.adaptiveQualityObserver.observe(element);
        });
    }
    
    // Public API methods
    getPerformanceLevel() {
        return this.performanceLevel;
    }
    
    getDeviceInfo() {
        return this.deviceInfo;
    }
    
    forceOptimization(level) {
        this.performanceLevel = level;
        this.optimizeAnimations();
    }
    
    cleanup() {
        if (this.adaptiveQualityObserver) {
            this.adaptiveQualityObserver.disconnect();
        }
    }
}

// Initialize mobile performance optimizer
let mobilePerformanceOptimizer;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile/tablet devices
    if (window.innerWidth <= 1024) {
        mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024 && !mobilePerformanceOptimizer) {
        mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
    } else if (window.innerWidth > 1024 && mobilePerformanceOptimizer) {
        mobilePerformanceOptimizer.cleanup();
        mobilePerformanceOptimizer = null;
    }
});

// Global API
window.MobilePerformanceOptimizer = {
    getInstance: () => mobilePerformanceOptimizer,
    getPerformanceLevel: () => mobilePerformanceOptimizer ? mobilePerformanceOptimizer.getPerformanceLevel() : 'high',
    getDeviceInfo: () => mobilePerformanceOptimizer ? mobilePerformanceOptimizer.getDeviceInfo() : null,
    forceOptimization: (level) => {
        if (mobilePerformanceOptimizer) {
            mobilePerformanceOptimizer.forceOptimization(level);
        }
    }
};

// Additional performance utilities
const PerformanceUtils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Request idle callback polyfill
    requestIdleCallback: (callback, options = {}) => {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback, options);
        } else {
            return setTimeout(callback, 1);
        }
    },
    
    // Cancel idle callback polyfill
    cancelIdleCallback: (id) => {
        if ('cancelIdleCallback' in window) {
            return window.cancelIdleCallback(id);
        } else {
            return clearTimeout(id);
        }
    }
};

// Export utilities
window.PerformanceUtils = PerformanceUtils;