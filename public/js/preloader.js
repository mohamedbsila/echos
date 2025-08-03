// New 3D Preloader functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create preloader if it doesn't exist
    if (!document.querySelector('.preloader')) {
        create3DPreloader();
    }
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Get preloader elements
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar-3d');
    
    // Track loading progress
    let progress = 0;
    const totalResources = getResourceCount();
    let loadedResources = 0;
    
    // Function to update progress bar
    const updateProgress = () => {
        loadedResources++;
        progress = Math.min(100, Math.floor((loadedResources / totalResources) * 100));
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Hide preloader when loading is complete
        if (progress >= 100) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.remove('loading');
                
                // Remove preloader from DOM after animation
                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 500);
            }, 1000); // Delay to show 100% for a moment
        }
    };
    
    // Track image loading
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    
    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener('load', () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    updateProgress();
                }
            });
            
            img.addEventListener('error', () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    updateProgress();
                }
            });
        }
    });
    
    // Track font loading
    document.fonts.ready.then(() => {
        updateProgress();
    });
    
    // Track script loading
    const scripts = document.querySelectorAll('script');
    scripts.forEach(() => {
        updateProgress();
    });
    
    // Track CSS loading
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(() => {
        updateProgress();
    });
    
    // Simulate minimum loading time with dynamic progress
    let fakeProgress = 0;
    const fakeLoading = setInterval(() => {
        fakeProgress += Math.random() * 8 + 2; // Random increment between 2-10
        progress = Math.max(progress, Math.min(fakeProgress, 95)); // Cap at 95% until real loading completes
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (fakeProgress >= 95) {
            clearInterval(fakeLoading);
        }
    }, 300);
    
    // Function to count total resources to load
    function getResourceCount() {
        const images = document.querySelectorAll('img').length;
        const scripts = document.querySelectorAll('script').length;
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]').length;
        
        // Add a minimum count to ensure progress bar works even with few resources
        return Math.max(15, images + scripts + stylesheets);
    }
    
    // Function to create 3D preloader HTML
    function create3DPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        
        preloader.innerHTML = `
            <div class="particle-system-3d"></div>
            <div class="preloader-logo">
                <h1>ECHOS</h1>
            </div>
            <div class="sound-wave-3d"></div>
            <div class="rotating-disc">
                <div class="disc-face"></div>
            </div>
            <div class="loading-text-3d">LOADING</div>
            <div class="progress-container-3d">
                <div class="progress-bar-3d"></div>
            </div>
        `;
        
        document.body.insertBefore(preloader, document.body.firstChild);
        
        // Initialize 3D animations
        initialize3DAnimations();
    }
    
    // Initialize 3D animations
    function initialize3DAnimations() {
        create3DSoundWave();
        create3DParticles();
        create3DLogoEffects();
    }
    
    // Create 3D sound wave bars
    function create3DSoundWave() {
        const soundWaveContainer = document.querySelector('.sound-wave-3d');
        if (!soundWaveContainer) return;
        
        const barCount = 25;
        const barWidth = 300 / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-3d-bar';
            bar.style.left = `${i * barWidth}px`;
            bar.style.width = `${barWidth - 2}px`;
            bar.style.height = `${Math.random() * 60 + 20}px`;
            bar.style.animationDelay = `${i * 0.1}s`;
            bar.style.transform = `translateZ(${Math.random() * 20 - 10}px)`;
            
            soundWaveContainer.appendChild(bar);
        }
    }
    
    // Create 3D particles
    function create3DParticles() {
        const particleSystem = document.querySelector('.particle-system-3d');
        if (!particleSystem) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-3d';
            
            // Random positioning and animation
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
            particle.style.transform = `translateZ(${Math.random() * 200 - 100}px)`;
            
            // Random size
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random color variation
            const hue = 250 + Math.random() * 40; // Purple to blue range
            particle.style.background = `hsl(${hue}, 70%, 60%)`;
            particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 70%, 60%)`;
            
            particleSystem.appendChild(particle);
        }
    }
    
    // Create 3D logo effects
    function create3DLogoEffects() {
        const logo = document.querySelector('.preloader-logo h1');
        if (!logo) return;
        
        // Add mouse/touch interaction for 3D effect
        let isMouseDown = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        
        const handleMouseMove = (e) => {
            if (!isMouseDown) return;
            
            const rect = logo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            currentX = (e.clientX - centerX) / (rect.width / 2);
            currentY = (e.clientY - centerY) / (rect.height / 2);
            
            const rotateX = currentY * 15;
            const rotateY = -currentX * 15;
            const translateZ = Math.abs(currentX) * 10 + Math.abs(currentY) * 10;
            
            logo.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        
        const handleMouseDown = (e) => {
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
        };
        
        const handleMouseUp = () => {
            isMouseDown = false;
            // Reset to original position
            setTimeout(() => {
                logo.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
            }, 100);
        };
        
        // Add event listeners
        logo.addEventListener('mousedown', handleMouseDown);
        logo.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleMouseDown(e.touches[0]);
        });
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        });
        
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        
        // Add hover effect
        logo.addEventListener('mouseenter', () => {
            logo.style.textShadow = `
                0 0 30px rgba(108, 68, 252, 1),
                0 0 60px rgba(108, 68, 252, 0.8),
                0 0 90px rgba(108, 68, 252, 0.6)
            `;
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.textShadow = `
                0 0 20px rgba(108, 68, 252, 0.8),
                0 0 40px rgba(108, 68, 252, 0.6),
                0 0 60px rgba(108, 68, 252, 0.4)
            `;
        });
    }
    
    // Add dynamic wave bar animation
    function animateWaveBars() {
        const bars = document.querySelectorAll('.wave-3d-bar');
        bars.forEach((bar, index) => {
            setInterval(() => {
                const newHeight = Math.random() * 60 + 20;
                const newZ = Math.random() * 20 - 10;
                bar.style.height = `${newHeight}px`;
                bar.style.transform = `translateZ(${newZ}px)`;
            }, 2000 + index * 100);
        });
    }
    
    // Start wave bar animation after a delay
    setTimeout(animateWaveBars, 1000);
}); 