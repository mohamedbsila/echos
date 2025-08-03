// Mobile Enhancements Integration
// This file integrates all mobile enhancements and ensures they work together smoothly

class MobileEnhancementsIntegration {
    constructor() {
        this.components = {
            navbar: null,
            musicControls: null,
            loader: null,
            performance: null
        };
        
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 1024;
        
        this.init();
    }
    
    init() {
        // Only initialize on mobile/tablet devices
        if (this.isMobile) {
            this.loadComponents();
            this.setupEventListeners();
            this.setupCrossComponentCommunication();
            this.applyIntegrationStyles();
            this.isInitialized = true;
            
            console.log('Mobile enhancements integrated successfully');
        }
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    loadComponents() {
        // Initialize performance optimizer first (highest priority)
        if (window.MobilePerformanceOptimizer) {
            this.components.performance = window.MobilePerformanceOptimizer.getInstance();
        }
        
        // Initialize loader (shows immediately)
        if (window.Creative3DLoader) {
            this.components.loader = window.Creative3DLoader.getInstance();
        }
        
        // Initialize navigation (always visible)
        if (window.EnhancedMobileNav) {
            this.components.navbar = window.EnhancedMobileNav;
        }
        
        // Initialize music controls (floating element)
        if (window.EnhancedMusicControls) {
            this.components.musicControls = window.EnhancedMusicControls.getInstance();
        }
    }
    
    setupEventListeners() {
        // Listen for loading completion
        window.addEventListener('creative3DLoaderComplete', this.handleLoadingComplete.bind(this));
        
        // Listen for music control events
        window.addEventListener('musicControlExpanded', this.handleMusicControlExpanded.bind(this));
        window.addEventListener('musicControlCollapsed', this.handleMusicControlCollapsed.bind(this));
        
        // Listen for theme changes
        window.addEventListener('themeChanged', this.handleThemeChange.bind(this));
        
        // Listen for performance changes
        window.addEventListener('performanceLevelChanged', this.handlePerformanceChange.bind(this));
    }
    
    setupCrossComponentCommunication() {
        // Ensure components don't interfere with each other
        this.preventOverlaps();
        this.synchronizeAnimations();
        this.optimizeZIndexes();
    }
    
    preventOverlaps() {
        // Prevent navigation and music controls from overlapping
        const style = document.createElement('style');
        style.id = 'mobile-integration-spacing';
        style.textContent = `
            /* Ensure proper spacing between components */
            .enhanced-music-control {
                bottom: 20px;
                z-index: 100;
            }
            
            .enhanced-mobile-nav {
                top: 0;
                z-index: 1000;
            }
            
            .enhanced-sidebar-menu {
                z-index: 1001;
            }
            
            .enhanced-sidebar-overlay {
                z-index: 1000;
            }
            
            .creative-3d-loader {
                z-index: 10000;
            }
            
            /* Adjust body padding when navigation is visible */
            @media (max-width: 1024px) {
                body {
                    padding-top: 70px;
                }
                
                .enhanced-music-control.large {
                    bottom: 30px;
                }
            }
            
            @media (max-width: 768px) {
                body {
                    padding-top: 65px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    synchronizeAnimations() {
        // Synchronize animations to prevent conflicts
        const animationSync = document.createElement('style');
        animationSync.id = 'mobile-animation-sync';
        animationSync.textContent = `
            /* Synchronized animation timings */
            .enhanced-mobile-nav,
            .enhanced-sidebar-menu,
            .enhanced-music-control {
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Prevent animation conflicts during loading */
            body.loading .enhanced-mobile-nav,
            body.loading .enhanced-music-control {
                animation-play-state: paused;
            }
            
            /* Resume animations after loading */
            body:not(.loading) .enhanced-mobile-nav,
            body:not(.loading) .enhanced-music-control {
                animation-play-state: running;
            }
        `;
        document.head.appendChild(animationSync);
    }
    
    optimizeZIndexes() {
        // Ensure proper z-index hierarchy
        const zIndexes = {
            'creative-3d-loader': 10000,
            'enhanced-sidebar-menu': 1001,
            'enhanced-mobile-nav': 1000,
            'enhanced-sidebar-overlay': 1000,
            'enhanced-music-control': 100
        };
        
        Object.entries(zIndexes).forEach(([className, zIndex]) => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                element.style.zIndex = zIndex;
            });
        });
    }
    
    applyIntegrationStyles() {
        // Apply styles that ensure components work together
        const integrationStyles = document.createElement('style');
        integrationStyles.id = 'mobile-integration-styles';
        integrationStyles.textContent = `
            /* Mobile integration styles */
            @media (max-width: 1024px) {
                /* Hide desktop navigation */
                .navbar:not(.enhanced-mobile-nav) {
                    display: none !important;
                }
                
                /* Hide old music controls */
                .music-control-inner:not(.enhanced-music-control) {
                    display: none !important;
                }
                
                /* Hide old preloader */
                .preloader:not(.creative-3d-loader) {
                    display: none !important;
                }
                
                /* Smooth transitions for all enhanced components */
                .enhanced-mobile-nav,
                .enhanced-music-control,
                .enhanced-sidebar-menu {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* Performance optimizations */
                .enhanced-mobile-nav *,
                .enhanced-music-control *,
                .creative-3d-loader * {
                    will-change: auto;
                }
                
                /* Touch-friendly sizing */
                .enhanced-menu-btn,
                .enhanced-control-btn {
                    min-width: 44px;
                    min-height: 44px;
                }
            }
            
            /* Prevent conflicts with existing styles */
            .enhanced-mobile-nav,
            .enhanced-music-control,
            .creative-3d-loader {
                box-sizing: border-box;
            }
            
            .enhanced-mobile-nav *,
            .enhanced-music-control *,
            .creative-3d-loader * {
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(integrationStyles);
    }
    
    handleLoadingComplete(event) {
        // Handle when loading is complete
        console.log('Loading completed:', event.detail);
        
        // Remove loading class from body
        document.body.classList.remove('loading');
        
        // Initialize components that should start after loading
        this.initializePostLoadingComponents();
        
        // Start performance monitoring
        if (this.components.performance) {
            console.log('Performance level:', this.components.performance.getPerformanceLevel());
        }
    }
    
    initializePostLoadingComponents() {
        // Initialize components that should start after loading screen
        setTimeout(() => {
            // Show music controls with entrance animation
            if (this.components.musicControls) {
                const musicControl = document.querySelector('.enhanced-music-control');
                if (musicControl) {
                    musicControl.classList.add('entrance-animation');
                }
            }
            
            // Activate navigation
            if (this.components.navbar) {
                this.components.navbar.updateActiveLink();
            }
        }, 500);
    }
    
    handleMusicControlExpanded(event) {
        // Handle music control expansion
        console.log('Music control expanded');
        
        // Adjust navigation if needed
        const navbar = document.querySelector('.enhanced-mobile-nav');
        if (navbar) {
            navbar.classList.add('music-expanded');
        }
    }
    
    handleMusicControlCollapsed(event) {
        // Handle music control collapse
        console.log('Music control collapsed');
        
        // Reset navigation
        const navbar = document.querySelector('.enhanced-mobile-nav');
        if (navbar) {
            navbar.classList.remove('music-expanded');
        }
    }
    
    handleThemeChange(event) {
        // Handle theme changes across all components
        const theme = event.detail.theme;
        console.log('Theme changed to:', theme);
        
        // Apply theme to all enhanced components
        const enhancedElements = document.querySelectorAll(
            '.enhanced-mobile-nav, .enhanced-sidebar-menu, .enhanced-music-control, .creative-3d-loader'
        );
        
        enhancedElements.forEach(element => {
            element.setAttribute('data-theme', theme);
        });
    }
    
    handlePerformanceChange(event) {
        // Handle performance level changes
        const level = event.detail.level;
        console.log('Performance level changed to:', level);
        
        // Adjust components based on performance level
        this.adjustComponentsForPerformance(level);
    }
    
    adjustComponentsForPerformance(level) {
        const performanceStyles = document.getElementById('performance-adjustments') || document.createElement('style');
        performanceStyles.id = 'performance-adjustments';
        
        if (level === 'low') {
            performanceStyles.textContent = `
                /* Low performance adjustments */
                .enhanced-music-control .enhanced-bar {
                    animation-duration: 0.8s !important;
                }
                
                .creative-3d-loader .audio-cube {
                    animation-duration: 8s !important;
                }
                
                .floating-shapes,
                .particle-system {
                    display: none !important;
                }
                
                .enhanced-mobile-nav,
                .enhanced-sidebar-menu {
                    backdrop-filter: none !important;
                }
            `;
        } else if (level === 'medium') {
            performanceStyles.textContent = `
                /* Medium performance adjustments */
                .particle-system .particle:nth-child(n+15) {
                    display: none;
                }
                
                .floating-shapes .floating-shape:nth-child(n+10) {
                    display: none;
                }
            `;
        } else {
            performanceStyles.textContent = '';
        }
        
        if (!performanceStyles.parentNode) {
            document.head.appendChild(performanceStyles);
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1024;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile && !this.isInitialized) {
                // Switched to mobile, initialize
                this.init();
            } else if (!this.isMobile && this.isInitialized) {
                // Switched to desktop, cleanup
                this.cleanup();
            }
        }
    }
    
    cleanup() {
        // Cleanup all mobile enhancements
        this.isInitialized = false;
        
        // Remove integration styles
        const integrationStyles = document.querySelectorAll(
            '#mobile-integration-spacing, #mobile-animation-sync, #mobile-integration-styles, #performance-adjustments'
        );
        integrationStyles.forEach(style => style.remove());
        
        // Cleanup components
        if (this.components.navbar && this.components.navbar.cleanup) {
            this.components.navbar.cleanup();
        }
        
        if (this.components.musicControls && this.components.musicControls.cleanup) {
            this.components.musicControls.cleanup();
        }
        
        if (this.components.performance && this.components.performance.cleanup) {
            this.components.performance.cleanup();
        }
        
        // Reset body styles
        document.body.style.paddingTop = '';
        document.body.classList.remove('loading');
        
        console.log('Mobile enhancements cleaned up');
    }
    
    // Public API
    getComponent(name) {
        return this.components[name];
    }
    
    isComponentActive(name) {
        return this.components[name] !== null;
    }
    
    forceRefresh() {
        if (this.isMobile) {
            this.cleanup();
            setTimeout(() => {
                this.init();
            }, 100);
        }
    }
}

// Initialize mobile enhancements integration
let mobileEnhancementsIntegration;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with a small delay to ensure all components are loaded
    setTimeout(() => {
        mobileEnhancementsIntegration = new MobileEnhancementsIntegration();
    }, 100);
});

// Global API
window.MobileEnhancementsIntegration = {
    getInstance: () => mobileEnhancementsIntegration,
    getComponent: (name) => mobileEnhancementsIntegration ? mobileEnhancementsIntegration.getComponent(name) : null,
    isComponentActive: (name) => mobileEnhancementsIntegration ? mobileEnhancementsIntegration.isComponentActive(name) : false,
    forceRefresh: () => {
        if (mobileEnhancementsIntegration) {
            mobileEnhancementsIntegration.forceRefresh();
        }
    }
};

// Add entrance animation styles
const entranceStyles = document.createElement('style');
entranceStyles.textContent = `
    /* Entrance animations for components */
    .enhanced-music-control.entrance-animation {
        animation: musicControlEntrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    @keyframes musicControlEntrance {
        0% {
            transform: translateX(-50%) translateY(100px) scale(0.8);
            opacity: 0;
        }
        100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
        }
    }
    
    .enhanced-mobile-nav.entrance-animation {
        animation: navbarEntrance 0.6s ease-out forwards;
    }
    
    @keyframes navbarEntrance {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(entranceStyles);