// Enhanced Mobile Navigation JavaScript
// This script handles the new mobile/tablet navigation functionality

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on mobile/tablet devices
    if (window.innerWidth <= 1024) {
        initializeEnhancedMobileNav();
    }
    
    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 1024) {
            initializeEnhancedMobileNav();
        } else {
            cleanupEnhancedMobileNav();
        }
    });
});

function initializeEnhancedMobileNav() {
    // Create enhanced mobile navigation if it doesn't exist
    if (!document.querySelector('.enhanced-mobile-nav')) {
        createEnhancedMobileNav();
    }
    
    // Initialize functionality
    setupEnhancedNavigation();
    setupScrollEffects();
    setupThemeIntegration();
}

function createEnhancedMobileNav() {
    // Create the enhanced navigation HTML
    const enhancedNav = document.createElement('nav');
    enhancedNav.className = 'enhanced-mobile-nav';
    
    enhancedNav.innerHTML = `
        <div class="nav-container">
            <div class="enhanced-logo">
                <a href="#home">
                    <img src="/img/logo/echos-logo.png" alt="ECHOS" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <span style="display:none; color: var(--primary-color); font-weight: 700; font-size: 1.5rem;">ECHOS</span>
                </a>
            </div>
            <div class="enhanced-menu-btn" id="enhancedMenuBtn">
                <div class="burger-line"></div>
                <div class="burger-line"></div>
                <div class="burger-line"></div>
            </div>
        </div>
    `;
    
    // Create the sidebar menu
    const sidebarMenu = document.createElement('div');
    sidebarMenu.className = 'enhanced-sidebar-menu';
    sidebarMenu.id = 'enhancedSidebarMenu';
    
    sidebarMenu.innerHTML = `
        <div class="enhanced-sidebar-header">
            <h3>ECHOS</h3>
            <button class="enhanced-sidebar-close" id="enhancedSidebarClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <ul class="enhanced-nav-links">
            <li><a href="#home" class="nav-link active" data-section="home"><i class="fas fa-home"></i> Home</a></li>
            <li><a href="#music" class="nav-link" data-section="music"><i class="fas fa-music"></i> Music</a></li>
            <li><a href="#tour" class="nav-link" data-section="tour"><i class="fas fa-calendar-alt"></i> Tour</a></li>
            <li><a href="#about" class="nav-link" data-section="about"><i class="fas fa-user"></i> About</a></li>
            <li><a href="#gallery" class="nav-link" data-section="gallery"><i class="fas fa-images"></i> Gallery</a></li>
            <li><a href="#testimonials" class="nav-link" data-section="testimonials"><i class="fas fa-quote-left"></i> Testimonials</a></li>
            <li><a href="#contact" class="nav-link" data-section="contact"><i class="fas fa-envelope"></i> Contact</a></li>
        </ul>
        
        <div class="enhanced-sidebar-options">
            <h4>Settings</h4>
            <div class="enhanced-option-item">
                <span>Dark Mode</span>
                <label class="enhanced-toggle">
                    <input type="checkbox" id="enhancedThemeToggle">
                    <div class="enhanced-toggle"></div>
                </label>
            </div>
            <div class="enhanced-option-item">
                <span>Sound Effects</span>
                <label class="enhanced-toggle">
                    <input type="checkbox" id="enhancedSoundToggle" checked>
                    <div class="enhanced-toggle"></div>
                </label>
            </div>
            <div class="enhanced-option-item">
                <span>Animations</span>
                <label class="enhanced-toggle">
                    <input type="checkbox" id="enhancedAnimationToggle" checked>
                    <div class="enhanced-toggle"></div>
                </label>
            </div>
        </div>
        
        <div class="enhanced-sidebar-footer">
            <div class="enhanced-social-links">
                <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                <a href="#" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
            <p>&copy; 2023 ECHOS. All Rights Reserved.</p>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'enhanced-sidebar-overlay';
    overlay.id = 'enhancedSidebarOverlay';
    
    // Insert into DOM
    document.body.insertBefore(enhancedNav, document.body.firstChild);
    document.body.appendChild(sidebarMenu);
    document.body.appendChild(overlay);
}

function setupEnhancedNavigation() {
    const menuBtn = document.getElementById('enhancedMenuBtn');
    const sidebarMenu = document.getElementById('enhancedSidebarMenu');
    const sidebarClose = document.getElementById('enhancedSidebarClose');
    const overlay = document.getElementById('enhancedSidebarOverlay');
    const navLinks = document.querySelectorAll('.enhanced-nav-links .nav-link');
    
    if (!menuBtn || !sidebarMenu) return;
    
    // Menu toggle functionality
    function toggleMenu() {
        const isActive = sidebarMenu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        menuBtn.classList.add('active');
        sidebarMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add staggered animation to nav links
        const links = document.querySelectorAll('.enhanced-nav-links li');
        links.forEach((link, index) => {
            link.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
    }
    
    function closeMenu() {
        menuBtn.classList.remove('active');
        sidebarMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    menuBtn.addEventListener('click', toggleMenu);
    if (sidebarClose) sidebarClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Navigation link functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetSection = this.getAttribute('href');
            const targetElement = document.querySelector(targetSection);
            
            if (targetElement) {
                // Close menu first
                closeMenu();
                
                // Wait for menu close animation then scroll
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Handle touch gestures for closing menu
    let startX = 0;
    let currentX = 0;
    
    sidebarMenu.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    sidebarMenu.addEventListener('touchmove', function(e) {
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        
        // If swiping right (closing gesture)
        if (diffX > 50) {
            closeMenu();
        }
    });
}

function setupScrollEffects() {
    const enhancedNav = document.querySelector('.enhanced-mobile-nav');
    if (!enhancedNav) return;
    
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            enhancedNav.classList.add('scrolled');
        } else {
            enhancedNav.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            enhancedNav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            enhancedNav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Clear timeout and set new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            enhancedNav.style.transform = 'translateY(0)';
        }, 1000);
    });
}

function setupThemeIntegration() {
    const themeToggle = document.getElementById('enhancedThemeToggle');
    const soundToggle = document.getElementById('enhancedSoundToggle');
    const animationToggle = document.getElementById('enhancedAnimationToggle');
    
    if (!themeToggle) return;
    
    // Sync with existing theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.checked = currentTheme === 'dark';
    
    // Theme toggle functionality
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Trigger theme change event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    });
    
    // Sound toggle functionality
    if (soundToggle) {
        const savedSoundSetting = localStorage.getItem('soundEnabled');
        soundToggle.checked = savedSoundSetting !== 'false';
        
        soundToggle.addEventListener('change', function() {
            localStorage.setItem('soundEnabled', this.checked);
            window.dispatchEvent(new CustomEvent('soundToggled', { detail: { enabled: this.checked } }));
        });
    }
    
    // Animation toggle functionality
    if (animationToggle) {
        const savedAnimationSetting = localStorage.getItem('animationsEnabled');
        animationToggle.checked = savedAnimationSetting !== 'false';
        
        animationToggle.addEventListener('change', function() {
            localStorage.setItem('animationsEnabled', this.checked);
            document.body.classList.toggle('reduce-animations', !this.checked);
            window.dispatchEvent(new CustomEvent('animationsToggled', { detail: { enabled: this.checked } }));
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.enhanced-nav-links .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

function cleanupEnhancedMobileNav() {
    // Remove enhanced navigation elements when switching to desktop
    const enhancedNav = document.querySelector('.enhanced-mobile-nav');
    const sidebarMenu = document.querySelector('.enhanced-sidebar-menu');
    const overlay = document.querySelector('.enhanced-sidebar-overlay');
    
    if (enhancedNav) enhancedNav.remove();
    if (sidebarMenu) sidebarMenu.remove();
    if (overlay) overlay.remove();
    
    // Reset body overflow
    document.body.style.overflow = '';
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize active link tracking
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 1024) {
        setTimeout(updateActiveNavLink, 100);
    }
});

// Export functions for external use
window.EnhancedMobileNav = {
    init: initializeEnhancedMobileNav,
    cleanup: cleanupEnhancedMobileNav,
    updateActiveLink: updateActiveNavLink
};