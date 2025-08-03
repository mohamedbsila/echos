// Mobile-specific JavaScript for Echos website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle with sidebar
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarOverlay = document.querySelector('.mobile-sidebar-overlay');
    const sidebarClose = document.querySelector('.mobile-sidebar-close');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close sidebar when clicking overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close sidebar when clicking close button
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Mobile Sidebar Options Functionality
    initializeMobileSidebarOptions();
    
    // Music Control Inner Touch Functionality
    initializeMusicControlInner();
    
    // Mobile music player controls
    const playBtn = document.querySelector('.play-btn');
    const progressFill = document.querySelector('.progress-fill');
    let isPlaying = false;
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            const icon = playBtn.querySelector('i');
            
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                // Simulate progress
                simulateProgress();
            } else {
                icon.className = 'fas fa-play';
                stopProgress();
            }
        });
    }
    
    function simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            
            progress += 0.5;
            if (progress > 100) {
                progress = 0;
            }
            
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
            
            // Update time display
            const currentTime = document.querySelector('.current-time');
            if (currentTime) {
                const minutes = Math.floor(progress / 100 * 3.75);
                const seconds = Math.floor((progress / 100 * 3.75 - minutes) * 60);
                currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    function stopProgress() {
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        const currentTime = document.querySelector('.current-time');
        if (currentTime) {
            currentTime.textContent = '0:00';
        }
    }
    
    // Mobile track list interactions
    const trackItems = document.querySelectorAll('.mobile-track-item');
    trackItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            trackItems.forEach(track => track.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update player info
            const trackName = this.querySelector('h4').textContent;
            const trackArtist = this.querySelector('p').textContent;
            const duration = this.querySelector('.track-duration').textContent;
            
            const playerTrackName = document.querySelector('.mobile-track-info h3');
            const playerTrackArtist = document.querySelector('.mobile-track-info p');
            const totalTime = document.querySelector('.total-time');
            
            if (playerTrackName) playerTrackName.textContent = trackName;
            if (playerTrackArtist) playerTrackArtist.textContent = trackArtist;
            if (totalTime) totalTime.textContent = duration;
            
            // Reset progress
            if (progressFill) progressFill.style.width = '0%';
            if (isPlaying) {
                simulateProgress();
            }
        });
    });
    
    // Mobile gallery filter
    const filterBtns = document.querySelectorAll('.mobile-gallery-filter .filter-btn');
    const galleryItems = document.querySelectorAll('.mobile-gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(button => button.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Mobile contact form
    const mobileContactForm = document.getElementById('mobileContactForm');
    if (mobileContactForm) {
        mobileContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            this.reset();
        });
    }
    
    // Mobile smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile card animations
    const mobileCards = document.querySelectorAll('.mobile-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out';
            }
        });
    }, observerOptions);
    
    mobileCards.forEach(card => {
        observer.observe(card);
    });
    
    // Mobile tour card interactions
    const tourCards = document.querySelectorAll('.mobile-tour-card');
    tourCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Mobile social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInDown 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes slideOutUp {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Mobile scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile touch gestures
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - could be used for next track
                console.log('Swipe left detected');
            } else {
                // Swipe right - could be used for previous track
                console.log('Swipe right detected');
            }
        }
    }
    
    // Mobile performance optimizations
    const mobileElements = document.querySelectorAll('.mobile-card, .mobile-tour-card, .mobile-gallery-item');
    mobileElements.forEach(element => {
        element.style.willChange = 'transform';
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        mobileElements.forEach(element => {
            element.style.willChange = 'auto';
        });
    });
});

// Initialize Mobile Sidebar Options
function initializeMobileSidebarOptions() {
    // Theme Toggle
    const themeSwitch = document.getElementById('mobile-theme-switch');
    if (themeSwitch) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeSwitch.checked = savedTheme === 'light';
        }
        
        themeSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
    
    // Sound Effects Toggle
    const soundSwitch = document.getElementById('mobile-sound-switch');
    if (soundSwitch) {
        soundSwitch.addEventListener('change', function() {
            const isSoundEnabled = this.checked;
            localStorage.setItem('soundEnabled', isSoundEnabled);
            
            // You can add sound effect logic here
            if (isSoundEnabled) {
                console.log('Sound effects enabled');
            } else {
                console.log('Sound effects disabled');
            }
        });
    }
    
    // Animations Toggle
    const animationSwitch = document.getElementById('mobile-animation-switch');
    if (animationSwitch) {
        animationSwitch.addEventListener('change', function() {
            const isAnimationEnabled = this.checked;
            localStorage.setItem('animationEnabled', isAnimationEnabled);
            
            // Toggle animations
            const animatedElements = document.querySelectorAll('.particle, .wave, .ripple, .control-bar');
            animatedElements.forEach(element => {
                if (isAnimationEnabled) {
                    element.style.animationPlayState = 'running';
                } else {
                    element.style.animationPlayState = 'paused';
                }
            });
        });
    }
}

// Initialize Music Control Inner Touch Functionality
function initializeMusicControlInner() {
    const musicControlInner = document.querySelector('.music-control-inner');
    if (!musicControlInner) return;
    
    let expandTimeout;
    let isExpanded = false;
    
    // Touch/Click to expand
    musicControlInner.addEventListener('click', function() {
        if (!isExpanded) {
            expandMusicControl();
        }
    });
    
    // Touch/Click to collapse
    musicControlInner.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (isExpanded) {
            collapseMusicControl();
        }
    });
    
    function expandMusicControl() {
        isExpanded = true;
        musicControlInner.classList.add('expanded');
        
        // Clear any existing timeout
        if (expandTimeout) {
            clearTimeout(expandTimeout);
        }
        
        // Auto-collapse after 3 seconds
        expandTimeout = setTimeout(() => {
            collapseMusicControl();
        }, 3000);
    }
    
    function collapseMusicControl() {
        isExpanded = false;
        musicControlInner.classList.remove('expanded');
        
        if (expandTimeout) {
            clearTimeout(expandTimeout);
        }
    }
    
    // Add hover effect for desktop
    musicControlInner.addEventListener('mouseenter', function() {
        if (!isExpanded) {
            expandMusicControl();
        }
    });
    
    musicControlInner.addEventListener('mouseleave', function() {
        if (isExpanded) {
            collapseMusicControl();
        }
    });
    
    // Add touch feedback
    musicControlInner.addEventListener('touchstart', function() {
        this.style.transform = 'translateX(-50%) scale(1.1)';
    });
    
    musicControlInner.addEventListener('touchend', function() {
        this.style.transform = 'translateX(-50%) scale(1)';
    });
}