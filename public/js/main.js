// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Music Player
    const musicPlayer = document.querySelector('.music-player');
    const trackArt = document.querySelector('.track-art');
    const trackName = document.querySelector('.track-name');
    const trackArtist = document.querySelector('.track-artist');
    const playPauseBtn = document.querySelector('.playpause-track');
    const nextBtn = document.querySelector('.next-track');
    const prevBtn = document.querySelector('.prev-track');
    const seekSlider = document.querySelector('.seek-slider');
    const volumeSlider = document.querySelector('.volume-slider');
    const currentTimeEl = document.querySelector('.current-time');
    const totalDurationEl = document.querySelector('.total-duration');
    const trackItems = document.querySelectorAll('.track-item');

    // Gallery
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Forms
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Skills
    const skills = document.querySelectorAll('.skill');

    // Initialize 3D text effect
    initText3D();

    // Navbar Scroll Effect - Enhanced for PC mode
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Ensure navbar is always visible on PC
        if (window.innerWidth > 768) {
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.left = '0';
            navbar.style.width = '100%';
            navbar.style.zIndex = '1000';
        }
    });
    
    // Initialize navbar position for PC
    if (window.innerWidth > 768) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '1000';
    }

    // Mobile Menu Toggle with enhanced animation
    let menuOpen = false;
    menuBtn.addEventListener('click', () => {
        if (!menuOpen) {
            menuBtn.classList.add('open');
            navMenu.classList.add('active');
            // Add staggered animation to menu items
            navMenu.querySelectorAll('li').forEach((item, index) => {
                item.style.animation = `slideIn 0.3s forwards ${index * 0.1}s`;
            });
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            navMenu.classList.remove('active');
            // Remove animations
            navMenu.querySelectorAll('li').forEach(item => {
                item.style.animation = '';
            });
            menuOpen = false;
        }
    });

    // Add CSS for menu animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .nav-menu li {
            opacity: 0;
        }
        
        .nav-menu.active li {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Smooth Scrolling for Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (menuOpen) {
                menuBtn.classList.remove('open');
                navMenu.classList.remove('active');
                menuOpen = false;
            }
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the target section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3D Text Effect
    function initText3D() {
        const text3D = document.querySelector('.text-3d');
        if (!text3D) return;

        // Mouse move event for 3D effect
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            text3D.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            text3D.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    // Music Player Functionality
    if (musicPlayer) {
        // Sample track data (replace with actual tracks)
        const tracks = [
            {
                name: "Track Name 1",
                artist: "Yassin DJ",
                path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
            },
            {
                name: "Track Name 2",
                artist: "Yassin DJ",
                path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
            },
            {
                name: "Track Name 3",
                artist: "Yassin DJ",
                path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
            }
        ];

        let trackIndex = 0;
        let isPlaying = false;
        let updateTimer;

        // Create audio element
        const audio = new Audio();
        audio.volume = 0.5;

        // Add audio visualizer
        addAudioVisualizer();

        // Load the first track
        loadTrack(trackIndex);

        // Load track function
        function loadTrack(index) {
            clearInterval(updateTimer);
            resetValues();

            // Load new track
            audio.src = tracks[index].path;
            audio.load();

            // Update track details
            trackName.textContent = tracks[index].name;
            trackArtist.textContent = tracks[index].artist;

            // Update active track in list
            trackItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Start timer to update seek slider
            updateTimer = setInterval(seekUpdate, 1000);

            // Play track when loaded
            audio.addEventListener('loadeddata', () => {
                if (isPlaying) playTrack();
            });
        }

        // Reset values function
        function resetValues() {
            currentTimeEl.textContent = '00:00';
            totalDurationEl.textContent = '00:00';
            seekSlider.value = 0;
        }

        // Play track function with enhanced animation
        function playTrack() {
            audio.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Add pulsing animation to track art
            trackArt.classList.add('playing');
        }

        // Pause track function
        function pauseTrack() {
            audio.pause();
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            
            // Remove pulsing animation
            trackArt.classList.remove('playing');
        }

        // Next track function
        function nextTrack() {
            if (trackIndex < tracks.length - 1) {
                trackIndex++;
            } else {
                trackIndex = 0;
            }
            loadTrack(trackIndex);
            playTrack();
        }

        // Previous track function
        function prevTrack() {
            if (trackIndex > 0) {
                trackIndex--;
            } else {
                trackIndex = tracks.length - 1;
            }
            loadTrack(trackIndex);
            playTrack();
        }

        // Update seek slider function
        function seekUpdate() {
            let seekPosition = 0;

            if (!isNaN(audio.duration)) {
                seekPosition = audio.currentTime * (100 / audio.duration);
                seekSlider.value = seekPosition;

                // Calculate current time left and total duration
                let currentMinutes = Math.floor(audio.currentTime / 60);
                let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
                let durationMinutes = Math.floor(audio.duration / 60);
                let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

                // Add a zero to single digit time values
                if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
                if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
                if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
                if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

                // Display the updated duration
                currentTimeEl.textContent = currentMinutes + ":" + currentSeconds;
                totalDurationEl.textContent = durationMinutes + ":" + durationSeconds;
            }
        }

        // Add audio visualizer
        function addAudioVisualizer() {
            // Add CSS for visualizer
            const visualizerStyle = document.createElement('style');
            visualizerStyle.innerHTML = `
                .track-art {
                    position: relative;
                    overflow: hidden;
                }
                
                .track-art.playing::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 40px;
                    background: linear-gradient(to top, rgba(108, 68, 252, 0.7), transparent);
                    animation: visualizer 0.8s infinite alternate;
                }
                
                @keyframes visualizer {
                    0% {
                        height: 10px;
                        opacity: 0.5;
                    }
                    50% {
                        height: 30px;
                        opacity: 0.7;
                    }
                    100% {
                        height: 50px;
                        opacity: 0.9;
                    }
                }
            `;
            document.head.appendChild(visualizerStyle);
        }

        // Event listeners for music player
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
        });

        nextBtn.addEventListener('click', nextTrack);
        prevBtn.addEventListener('click', prevTrack);

        // Seek slider change event
        seekSlider.addEventListener('change', () => {
            const seekTo = audio.duration * (seekSlider.value / 100);
            audio.currentTime = seekTo;
        });

        // Volume slider change event
        volumeSlider.addEventListener('change', () => {
            audio.volume = volumeSlider.value / 100;
        });

        // Track list click event
        trackItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                trackIndex = index;
                loadTrack(trackIndex);
                playTrack();
            });
        });

        // Track ended event
        audio.addEventListener('ended', nextTrack);
    }

    // Gallery Filter Functionality with enhanced animation
    if (filterBtns.length > 0) {
        // Add animation styles
        const galleryStyle = document.createElement('style');
        galleryStyle.innerHTML = `
            .gallery-item {
                transition: all 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .gallery-item.hidden {
                transform: scale(0.8);
                opacity: 0;
                pointer-events: none;
            }
            
            .gallery-item.show {
                transform: scale(1);
                opacity: 1;
                pointer-events: auto;
            }
        `;
        document.head.appendChild(galleryStyle);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filterValue = btn.getAttribute('data-filter');
                
                // Filter gallery items with animation
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.classList.add('show');
                        }, 50);
                    } else {
                        item.classList.remove('show');
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Animate skill bars when they come into view
    const animateSkills = () => {
        skills.forEach(skill => {
            const skillPosition = skill.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (skillPosition < screenPosition) {
                const skillLevel = skill.querySelector('.skill-level');
                const width = skillLevel.style.width;
                skillLevel.style.setProperty('--width', width);
                skill.classList.add('animate');
            }
        });
    };

    // Form Submission with enhanced feedback
    if (contactForm) {
        // Add styles for form feedback
        const formStyle = document.createElement('style');
        formStyle.innerHTML = `
            .form-success {
                padding: 15px;
                background: rgba(40, 167, 69, 0.1);
                border: 1px solid var(--success-color);
                border-radius: 5px;
                margin-bottom: 20px;
                display: none;
                animation: fadeIn 0.5s forwards;
            }
            
            .form-success.show {
                display: block;
            }
            
            .form-group input.success,
            .form-group textarea.success {
                border-color: var(--success-color);
            }
            
            .submit-btn {
                position: relative;
                overflow: hidden;
            }
            
            .submit-btn .loader {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--primary-color);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .submit-btn.loading .loader {
                opacity: 1;
            }
            
            .loader::after {
                content: '';
                width: 20px;
                height: 20px;
                border: 3px solid transparent;
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(formStyle);

        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = 'Message sent successfully! We will get back to you soon.';
        contactForm.insertBefore(successMessage, contactForm.firstChild);

        // Add loader to submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('submit-btn');
        const loader = document.createElement('div');
        loader.className = 'loader';
        submitBtn.appendChild(loader);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('loading');
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate sending data (in a real app, send to server)
            console.log('Contact Form Data:', formObject);
            
            // Simulate server delay
            setTimeout(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                
                // Add success classes to inputs
                contactForm.querySelectorAll('input, textarea').forEach(input => {
                    input.classList.add('success');
                });
                
                // Show success message
                successMessage.classList.add('show');
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.querySelectorAll('input, textarea').forEach(input => {
                        input.classList.remove('success');
                    });
                    successMessage.classList.remove('show');
                }, 3000);
            }, 1500);
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get email
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the data to a server
            console.log('Newsletter Subscription:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // Animate on scroll (enhanced implementation)
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-header, .about-content, .music-container, .gallery-item, .contact-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
        
        // Animate skills when in view
        animateSkills();
    };

    // Initial check for elements in view
    animateOnScroll();
    
    // Listen for scroll to animate elements
    window.addEventListener('scroll', animateOnScroll);

    // Add enhanced CSS for animations
    const animationStyle = document.createElement('style');
    animationStyle.innerHTML = `
        .section-header, .about-content, .music-container, .contact-container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .gallery-item {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .gallery-item:nth-child(odd).animate {
            animation: fadeInLeft 0.6s forwards;
        }
        
        .gallery-item:nth-child(even).animate {
            animation: fadeInRight 0.6s forwards;
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);
}); 