/* ---- Particles.js ---- */
class Particles {
    constructor(options) {
        this.options = {
            selector: '.particles-js',
            maxParticles: 100,
            sizeVariations: 3,
            speed: 0.5,
            color: '#ffffff',
            minDistance: 120,
            connectParticles: true,
            mode: 'stars', // 'stars' or 'clouds'
            ...options
        };
        
        this.canvas = document.querySelector(this.options.selector);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.cloudImages = [];
        this.starsCreated = false;
        this.cloudsCreated = false;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.options.mode = e.detail.theme === 'light' ? 'clouds' : 'stars';
            this.particles = [];
            this.createParticles();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Re-create particles when canvas is resized
        if (this.particles.length) {
            this.particles = [];
            this.createParticles();
        }
    }
    
    createParticles() {
        if (this.options.mode === 'stars') {
            this.createStars();
        } else {
            this.createClouds();
        }
    }
    
    createStars() {
        for (let i = 0; i < this.options.maxParticles; i++) {
            this.particles.push(new StarParticle(this));
        }
        this.starsCreated = true;
    }
    
    createClouds() {
        // Create fewer clouds than stars for a professional look
        const cloudCount = Math.floor(this.options.maxParticles / 5);
        
        // Create clouds at different layers for depth
        const layers = 3; // Foreground, middle, background
        
        for (let layer = 0; layer < layers; layer++) {
            const layerClouds = Math.floor(cloudCount / layers);
            
            for (let i = 0; i < layerClouds; i++) {
                const cloud = new CloudParticle(this);
                
                // Adjust properties based on layer
                if (layer === 0) { // Foreground
                    cloud.opacity = 0.7 + Math.random() * 0.3;
                    cloud.vx *= 1.5; // Move faster
                    cloud.y = this.canvas.height * (0.4 + Math.random() * 0.3); // Lower
                    cloud.radius *= 1.2; // Larger
                } else if (layer === 1) { // Middle
                    cloud.opacity = 0.5 + Math.random() * 0.3;
                    cloud.y = this.canvas.height * (0.3 + Math.random() * 0.3); // Middle
                } else { // Background
                    cloud.opacity = 0.3 + Math.random() * 0.2;
                    cloud.vx *= 0.7; // Move slower
                    cloud.y = this.canvas.height * (0.1 + Math.random() * 0.2); // Higher
                    cloud.radius *= 0.8; // Smaller
                }
                
                this.particles.push(cloud);
            }
        }
        
        this.cloudsCreated = true;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.options.mode === 'stars') {
            this.updateStars();
        } else {
            // Update cloud puffs first (they're behind the main clouds)
            this.updateCloudPuffs();
            // Then update main clouds
            this.updateClouds();
        }
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
    
    updateCloudPuffs() {
        // Filter out puffs that have faded away
        this.particles = this.particles.filter(particle => {
            if (particle.type === 'puff') {
                // Update puff and check if it should be removed
                return !particle.update();
            }
            return true;
        });
        
        // Draw remaining puffs
        for (let i = 0; i < this.particles.length; i++) {
            const puff = this.particles[i];
            if (puff.type === 'puff') {
                // Draw puff with gradient for realistic look
                this.ctx.save();
                this.ctx.globalAlpha = puff.opacity;
                
                // Create gradient for puff
                const gradient = this.ctx.createRadialGradient(
                    puff.x, puff.y, 0,
                    puff.x, puff.y, puff.radius * 1.5
                );
                
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(puff.x, puff.y, puff.radius * 1.5, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        }
    }
    
    updateStars() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
            }
            
            // Draw star particle
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add twinkle effect
            if (Math.random() > 0.99) {
                particle.radius = Math.random() * this.options.sizeVariations + 1;
            }
            
            // Connect particles
            if (this.options.connectParticles) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const particle2 = this.particles[j];
                    const dx = particle.x - particle2.x;
                    const dy = particle.y - particle2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.options.minDistance) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / this.options.minDistance})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(particle2.x, particle2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    updateClouds() {
        for (let i = 0; i < this.particles.length; i++) {
            const cloud = this.particles[i];
            
            // Update cloud position with smooth movement
            cloud.x += cloud.vx;
            cloud.y += Math.sin(cloud.time) * 0.2; // Subtle vertical movement
            cloud.time += 0.01;
            
            // Reset cloud position when it moves off screen
            if (cloud.x > this.canvas.width + cloud.width) {
                cloud.x = -cloud.width;
                cloud.y = Math.random() * (this.canvas.height * 0.7);
                cloud.time = Math.random() * Math.PI * 2; // Random start phase
            }
            
            // Draw professional cloud using gradient and multiple shapes
            this.drawProfessionalCloud(cloud);
            
            // Occasionally add a small puff of cloud that separates
            if (Math.random() > 0.998) {
                this.addCloudPuff(cloud);
            }
        }
    }
    
    drawProfessionalCloud(cloud) {
        // Save context state
        this.ctx.save();
        
        // Set global alpha for the entire cloud
        this.ctx.globalAlpha = cloud.opacity;
        
        // Create radial gradient for realistic cloud lighting
        const gradient = this.ctx.createRadialGradient(
            cloud.x, cloud.y - cloud.radius * 0.2, 0,
            cloud.x, cloud.y, cloud.width * 0.8
        );
        
        // Add color stops for realistic cloud appearance
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        
        // Create main cloud shape with bezier curves for smoother edges
        this.ctx.beginPath();
        
        // Start at the left side of the cloud
        const startX = cloud.x - cloud.width * 0.5;
        const startY = cloud.y;
        
        this.ctx.moveTo(startX, startY);
        
        // Top-left curve
        this.ctx.bezierCurveTo(
            startX - cloud.radius * 0.2, startY - cloud.radius * 0.5,
            startX + cloud.radius * 0.5, startY - cloud.radius * 1.2,
            startX + cloud.radius * 1.2, startY - cloud.radius * 0.5
        );
        
        // Top-middle curve
        this.ctx.bezierCurveTo(
            startX + cloud.radius * 1.5, startY - cloud.radius * 1.5,
            startX + cloud.radius * 2.5, startY - cloud.radius * 1.5,
            startX + cloud.radius * 3.0, startY - cloud.radius * 0.8
        );
        
        // Top-right curve
        this.ctx.bezierCurveTo(
            startX + cloud.radius * 3.5, startY - cloud.radius * 0.8,
            startX + cloud.radius * 4.0, startY - cloud.radius * 0.3,
            startX + cloud.radius * 4.0, startY
        );
        
        // Bottom-right curve
        this.ctx.bezierCurveTo(
            startX + cloud.radius * 4.0, startY + cloud.radius * 0.5,
            startX + cloud.radius * 3.5, startY + cloud.radius * 0.8,
            startX + cloud.radius * 3.0, startY + cloud.radius * 0.6
        );
        
        // Bottom-middle curve
        this.ctx.bezierCurveTo(
            startX + cloud.radius * 2.5, startY + cloud.radius * 1.0,
            startX + cloud.radius * 1.5, startY + cloud.radius * 1.0,
            startX + cloud.radius * 1.0, startY + cloud.radius * 0.6
        );
        
        // Bottom-left curve
        this.ctx.bezierCurveTo(
            startX + cloud.radius * 0.5, startY + cloud.radius * 0.8,
            startX - cloud.radius * 0.2, startY + cloud.radius * 0.5,
            startX, startY
        );
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add highlights for realistic lighting
        this.addCloudHighlights(cloud);
        
        // Restore context state
        this.ctx.restore();
    }
    
    addCloudHighlights(cloud) {
        // Top highlight for sun lighting effect
        const highlightGradient = this.ctx.createLinearGradient(
            cloud.x, cloud.y - cloud.radius,
            cloud.x, cloud.y + cloud.radius
        );
        
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = highlightGradient;
        
        // Draw highlight shape
        this.ctx.beginPath();
        this.ctx.ellipse(
            cloud.x, 
            cloud.y - cloud.radius * 0.3,
            cloud.width * 0.4,
            cloud.radius * 0.7,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Add subtle shadow at bottom
        const shadowGradient = this.ctx.createRadialGradient(
            cloud.x, cloud.y + cloud.radius * 0.5, 0,
            cloud.x, cloud.y + cloud.radius * 0.5, cloud.width * 0.5
        );
        
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = shadowGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(
            cloud.x, 
            cloud.y + cloud.radius * 0.6,
            cloud.width * 0.4,
            cloud.radius * 0.4,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    addCloudPuff(cloud) {
        // Create a small cloud puff that separates from the main cloud
        const puff = new CloudPuff(
            cloud.x + cloud.radius * (Math.random() - 0.5),
            cloud.y - cloud.radius * (Math.random() * 0.3),
            cloud.radius * (0.2 + Math.random() * 0.2),
            this.canvas.width
        );
        
        this.particles.push(puff);
    }
}

class StarParticle {
    constructor(parent) {
        this.parent = parent;
        this.radius = Math.random() * this.parent.options.sizeVariations + 1;
        
        this.x = Math.random() * this.parent.canvas.width;
        this.y = Math.random() * this.parent.canvas.height;
        
        this.vx = Math.random() * this.parent.options.speed * 2 - this.parent.options.speed;
        this.vy = Math.random() * this.parent.options.speed * 2 - this.parent.options.speed;
    }
}

class CloudParticle {
    constructor(parent) {
        this.parent = parent;
        this.radius = 20 + Math.random() * 40;
        this.width = this.radius * (2.5 + Math.random());
        this.height = this.radius * (0.5 + Math.random() * 0.3);
        
        // Position clouds across the screen at different heights
        this.x = Math.random() * (this.parent.canvas.width + 200) - 100;
        this.y = Math.random() * (this.parent.canvas.height * 0.7);
        
        // Vary cloud speeds
        this.vx = 0.1 + Math.random() * 0.4;
        this.vy = 0;
        
        // Time variable for oscillation
        this.time = Math.random() * Math.PI * 2;
        
        // Vary cloud opacity for depth
        this.opacity = 0.5 + Math.random() * 0.4;
        
        // Slight variations in cloud color
        const whiteness = 240 + Math.floor(Math.random() * 15);
        this.color = `rgb(${whiteness}, ${whiteness}, ${whiteness})`;
        
        // Type identifier
        this.type = 'cloud';
    }
}

// Small cloud puffs that break off from main clouds
class CloudPuff {
    constructor(x, y, radius, canvasWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.width = radius * 2;
        this.height = radius;
        
        // Puffs move faster and rise up
        this.vx = 0.3 + Math.random() * 0.6;
        this.vy = -0.1 - Math.random() * 0.1;
        
        // Puffs are more transparent and fade out
        this.opacity = 0.3 + Math.random() * 0.2;
        this.fadeRate = 0.001 + Math.random() * 0.002;
        
        // Time variable for oscillation
        this.time = Math.random() * Math.PI * 2;
        
        // Canvas width for boundary checking
        this.canvasWidth = canvasWidth;
        
        // Pure white color
        this.color = 'rgb(255, 255, 255)';
        
        // Type identifier
        this.type = 'puff';
    }
    
    // Update method called from main animation loop
    update() {
        // Move puff
        this.x += this.vx;
        this.y += this.vy;
        
        // Fade out
        this.opacity -= this.fadeRate;
        
        // Return true if puff should be removed
        return this.opacity <= 0 || this.x > this.canvasWidth;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if hero section exists
    const hero = document.querySelector('.hero');
    if (hero) {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.classList.add('particles-js');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        
        // Insert canvas as first child of hero
        hero.insertBefore(canvas, hero.firstChild);
        
        // Check current theme
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        
        // Initialize particles
        new Particles({
            selector: '.particles-js',
            maxParticles: 80,
            connectParticles: true,
            color: 'rgba(255, 255, 255, 0.5)',
            speed: 0.3,
            mode: currentTheme === 'light' ? 'clouds' : 'stars'
        });
    }
}); 