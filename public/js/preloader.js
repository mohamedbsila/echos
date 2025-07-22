// Preloader functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create preloader if it doesn't exist
    if (!document.querySelector('.preloader')) {
        createPreloader();
    }
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Get preloader elements
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    
    // Track loading progress
    let progress = 0;
    const totalResources = getResourceCount();
    let loadedResources = 0;
    
    // Function to update progress bar
    const updateProgress = () => {
        loadedResources++;
        progress = Math.min(100, Math.floor((loadedResources / totalResources) * 100));
        progressBar.style.width = `${progress}%`;
        
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
    
    // Simulate minimum loading time
    let fakeProgress = 0;
    const fakeLoading = setInterval(() => {
        fakeProgress += 5;
        progress = Math.max(progress, fakeProgress);
        progressBar.style.width = `${progress}%`;
        
        if (fakeProgress >= 100) {
            clearInterval(fakeLoading);
            updateProgress(); // Final update
        }
    }, 200);
    
    // Function to count total resources to load
    function getResourceCount() {
        const images = document.querySelectorAll('img').length;
        const scripts = document.querySelectorAll('script').length;
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]').length;
        
        // Add a minimum count to ensure progress bar works even with few resources
        return Math.max(10, images + scripts + stylesheets);
    }
    
    // Function to create preloader HTML
    function createPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        
        preloader.innerHTML = `
            <div class="preloader-logo">
                <h1>ECHOS</h1>
            </div>
            <div class="vinyl-loader">
                <div class="vinyl-record">
                    <div class="vinyl-grooves"></div>
                </div>
                <div class="vinyl-arm"></div>
            </div>
            <div class="loading-text">LOADING</div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        `;
        
        document.body.insertBefore(preloader, document.body.firstChild);
    }
}); 