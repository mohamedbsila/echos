/**
 * Sound Wave Animation
 * Creates animated sound wave and beat ripples for the hero section
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create sound wave container if it doesn't exist
    if (!document.querySelector('.sound-wave-container')) {
        createSoundWave();
    }
    
    // Create beat ripples if they don't exist
    if (!document.querySelector('.beat-ripple-container')) {
        createBeatRipples();
    }
    
    // Create sound wave animation
    function createSoundWave() {
        // Create container
        const container = document.createElement('div');
        container.className = 'sound-wave-container';
        
        // Create wave
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        
        // Create bars - more bars for full screen effect
        const numBars = window.innerWidth < 768 ? 30 : 60;
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            
            // Randomize initial scale for more natural look
            const scale = Math.random() * 0.7 + 0.1;
            bar.style.transform = `scaleY(${scale})`;
            
            // Add a span inside for the actual animated bar
            const innerBar = document.createElement('span');
            innerBar.style.width = '100%';
            innerBar.style.height = '100%';
            innerBar.style.background = 'linear-gradient(to top, var(--primary-color), var(--secondary-color))';
            innerBar.style.display = 'block';
            innerBar.style.borderRadius = '3px';
            
            bar.appendChild(innerBar);
            wave.appendChild(bar);
        }
        
        container.appendChild(wave);
        
        // Add to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(container);
        }
    }
    
    // Create beat ripples animation
    function createBeatRipples() {
        // Create container
        const container = document.createElement('div');
        container.className = 'beat-ripple-container';
        
        // Create ripples
        for (let i = 0; i < 4; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'beat-ripple';
            container.appendChild(ripple);
        }
        
        // Add to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(container);
        }
    }
    
    // Update hero section content with custom DJ name highlight
    function updateHeroContent() {
        const heroContent = document.querySelector('.hero-content h1');
        if (heroContent && heroContent.textContent.includes('YASSIN DJ')) {
            // Split text to add highlight
            const text = heroContent.textContent;
            const parts = text.split(' ');
            
            if (parts.length === 2) {
                // Create new elements with highlight
                const newContent = document.createElement('div');
                newContent.className = 'glitch text-3d';
                newContent.setAttribute('data-text', text);
                
                const firstPart = document.createElement('span');
                firstPart.textContent = parts[0];
                
                const highlight = document.createElement('span');
                highlight.className = 'dj-name-highlight';
                highlight.textContent = parts[1];
                
                newContent.appendChild(firstPart);
                newContent.appendChild(highlight);
                
                // Replace original content
                heroContent.parentNode.replaceChild(newContent, heroContent);
            }
        }
    }
    
    // Call function to update hero content
    updateHeroContent();
}); 