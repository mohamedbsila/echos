/**
 * Interactive DJ Turntable & Mixer
 * A unique interactive element for the hero section
 */
class DJTurntable {
    constructor(options) {
        this.options = {
            container: '.dj-turntable',
            vinylColor: '#333',
            accentColor: '#6c44fc',
            secondaryColor: '#ff7b54',
            ...options
        };
        
        this.container = document.querySelector(this.options.container);
        if (!this.container) return;
        
        this.isInitialized = false;
        this.turntables = [];
        this.mixer = null;
        this.crossfader = null;
        this.crossfaderValue = 0.5;
        this.knobs = [];
        this.isDragging = false;
        this.activeKnob = null;
        this.startAngle = 0;
        
        this.init();
    }
    
    init() {
        // Create turntables and mixer
        this.createTurntables();
        this.createMixer();
        
        // Add event listeners
        this.addEventListeners();
        
        // Mark as initialized
        this.isInitialized = true;
    }
    
    createTurntables() {
        const turntablesContainer = document.createElement('div');
        turntablesContainer.className = 'turntables-container';
        turntablesContainer.style.display = 'flex';
        turntablesContainer.style.justifyContent = 'space-between';
        turntablesContainer.style.width = '100%';
        turntablesContainer.style.marginBottom = '20px';
        
        // Create two turntables
        for (let i = 0; i < 2; i++) {
            const turntable = this.createTurntable(i);
            turntablesContainer.appendChild(turntable.element);
            this.turntables.push(turntable);
        }
        
        this.container.appendChild(turntablesContainer);
    }
    
    createTurntable(index) {
        const turntable = document.createElement('div');
        turntable.className = `turntable turntable-${index}`;
        turntable.style.width = '200px';
        turntable.style.height = '200px';
        turntable.style.position = 'relative';
        turntable.style.cursor = 'pointer';
        
        // Create vinyl record
        const vinyl = document.createElement('div');
        vinyl.className = 'vinyl';
        vinyl.style.width = '100%';
        vinyl.style.height = '100%';
        vinyl.style.borderRadius = '50%';
        vinyl.style.background = this.options.vinylColor;
        vinyl.style.position = 'relative';
        vinyl.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        vinyl.style.transition = 'transform 0.5s ease';
        vinyl.style.transformStyle = 'preserve-3d';
        
        // Create vinyl label
        const label = document.createElement('div');
        label.className = 'vinyl-label';
        label.style.width = '40%';
        label.style.height = '40%';
        label.style.borderRadius = '50%';
        label.style.position = 'absolute';
        label.style.top = '30%';
        label.style.left = '30%';
        label.style.background = index === 0 ? this.options.accentColor : this.options.secondaryColor;
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.justifyContent = 'center';
        label.style.color = '#fff';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '14px';
        label.style.textTransform = 'uppercase';
        label.textContent = `Deck ${index + 1}`;
        
        // Create vinyl grooves
        for (let i = 0; i < 5; i++) {
            const groove = document.createElement('div');
            groove.className = 'vinyl-groove';
            groove.style.width = `${80 - i * 10}%`;
            groove.style.height = `${80 - i * 10}%`;
            groove.style.borderRadius = '50%';
            groove.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            groove.style.position = 'absolute';
            groove.style.top = `${10 + i * 5}%`;
            groove.style.left = `${10 + i * 5}%`;
            
            vinyl.appendChild(groove);
        }
        
        // Create tonearm
        const tonearm = document.createElement('div');
        tonearm.className = 'tonearm';
        tonearm.style.width = '80px';
        tonearm.style.height = '10px';
        tonearm.style.background = '#555';
        tonearm.style.position = 'absolute';
        tonearm.style.top = '30px';
        tonearm.style.right = '-20px';
        tonearm.style.transformOrigin = 'right center';
        tonearm.style.transform = 'rotate(45deg)';
        tonearm.style.zIndex = '10';
        tonearm.style.borderRadius = '5px';
        
        // Create tonearm head
        const tonearmHead = document.createElement('div');
        tonearmHead.className = 'tonearm-head';
        tonearmHead.style.width = '15px';
        tonearmHead.style.height = '15px';
        tonearmHead.style.background = '#333';
        tonearmHead.style.position = 'absolute';
        tonearmHead.style.left = '0';
        tonearmHead.style.top = '-2.5px';
        tonearmHead.style.borderRadius = '3px';
        
        tonearm.appendChild(tonearmHead);
        
        // Append elements
        vinyl.appendChild(label);
        turntable.appendChild(vinyl);
        turntable.appendChild(tonearm);
        
        // Return turntable object
        return {
            element: turntable,
            vinyl: vinyl,
            tonearm: tonearm,
            isPlaying: false,
            rotation: 0,
            speed: index === 0 ? 1 : 0.9
        };
    }
    
    createMixer() {
        const mixer = document.createElement('div');
        mixer.className = 'mixer';
        mixer.style.width = '100%';
        mixer.style.background = 'rgba(0, 0, 0, 0.3)';
        mixer.style.borderRadius = '10px';
        mixer.style.padding = '15px';
        mixer.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        mixer.style.backdropFilter = 'blur(5px)';
        mixer.style.display = 'flex';
        mixer.style.flexDirection = 'column';
        mixer.style.alignItems = 'center';
        
        // Create crossfader
        const crossfaderContainer = document.createElement('div');
        crossfaderContainer.className = 'crossfader-container';
        crossfaderContainer.style.width = '80%';
        crossfaderContainer.style.height = '40px';
        crossfaderContainer.style.display = 'flex';
        crossfaderContainer.style.alignItems = 'center';
        crossfaderContainer.style.justifyContent = 'center';
        crossfaderContainer.style.marginBottom = '20px';
        
        const crossfaderTrack = document.createElement('div');
        crossfaderTrack.className = 'crossfader-track';
        crossfaderTrack.style.width = '100%';
        crossfaderTrack.style.height = '10px';
        crossfaderTrack.style.background = 'rgba(0, 0, 0, 0.3)';
        crossfaderTrack.style.borderRadius = '5px';
        crossfaderTrack.style.position = 'relative';
        crossfaderTrack.style.cursor = 'pointer';
        
        const crossfaderHandle = document.createElement('div');
        crossfaderHandle.className = 'crossfader-handle';
        crossfaderHandle.style.width = '20px';
        crossfaderHandle.style.height = '20px';
        crossfaderHandle.style.background = '#fff';
        crossfaderHandle.style.borderRadius = '50%';
        crossfaderHandle.style.position = 'absolute';
        crossfaderHandle.style.top = '-5px';
        crossfaderHandle.style.left = '50%';
        crossfaderHandle.style.transform = 'translateX(-50%)';
        crossfaderHandle.style.cursor = 'pointer';
        crossfaderHandle.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        
        crossfaderTrack.appendChild(crossfaderHandle);
        crossfaderContainer.appendChild(crossfaderTrack);
        
        // Create knobs
        const knobsContainer = document.createElement('div');
        knobsContainer.className = 'knobs-container';
        knobsContainer.style.display = 'flex';
        knobsContainer.style.justifyContent = 'space-around';
        knobsContainer.style.width = '100%';
        
        const knobLabels = ['BASS', 'MID', 'TREBLE', 'GAIN'];
        const knobColors = [
            this.options.accentColor,
            this.options.secondaryColor,
            this.options.accentColor,
            this.options.secondaryColor
        ];
        
        for (let i = 0; i < 4; i++) {
            const knobGroup = document.createElement('div');
            knobGroup.className = 'knob-group';
            knobGroup.style.display = 'flex';
            knobGroup.style.flexDirection = 'column';
            knobGroup.style.alignItems = 'center';
            
            const knob = document.createElement('div');
            knob.className = `knob knob-${i}`;
            knob.style.width = '40px';
            knob.style.height = '40px';
            knob.style.borderRadius = '50%';
            knob.style.background = '#333';
            knob.style.position = 'relative';
            knob.style.cursor = 'pointer';
            knob.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
            knob.style.marginBottom = '5px';
            
            // Knob indicator
            const indicator = document.createElement('div');
            indicator.className = 'knob-indicator';
            indicator.style.width = '2px';
            indicator.style.height = '15px';
            indicator.style.background = knobColors[i];
            indicator.style.position = 'absolute';
            indicator.style.top = '5px';
            indicator.style.left = '50%';
            indicator.style.transformOrigin = 'bottom center';
            indicator.style.transform = 'translateX(-50%) rotate(0deg)';
            
            // Knob center
            const center = document.createElement('div');
            center.className = 'knob-center';
            center.style.width = '15px';
            center.style.height = '15px';
            center.style.borderRadius = '50%';
            center.style.background = knobColors[i];
            center.style.position = 'absolute';
            center.style.top = '50%';
            center.style.left = '50%';
            center.style.transform = 'translate(-50%, -50%)';
            
            // Knob label
            const label = document.createElement('div');
            label.className = 'knob-label';
            label.style.fontSize = '10px';
            label.style.color = '#fff';
            label.style.textTransform = 'uppercase';
            label.style.fontWeight = 'bold';
            label.textContent = knobLabels[i];
            
            knob.appendChild(indicator);
            knob.appendChild(center);
            knobGroup.appendChild(knob);
            knobGroup.appendChild(label);
            knobsContainer.appendChild(knobGroup);
            
            this.knobs.push({
                element: knob,
                indicator: indicator,
                value: 0.5,
                angle: 0
            });
        }
        
        // Append elements
        mixer.appendChild(crossfaderContainer);
        mixer.appendChild(knobsContainer);
        this.container.appendChild(mixer);
        
        // Store references
        this.mixer = mixer;
        this.crossfader = {
            track: crossfaderTrack,
            handle: crossfaderHandle
        };
    }
    
    addEventListeners() {
        // Turntable events
        this.turntables.forEach((turntable, index) => {
            turntable.element.addEventListener('click', () => {
                this.toggleTurntable(index);
            });
        });
        
        // Crossfader events
        this.crossfader.track.addEventListener('mousedown', (e) => {
            this.updateCrossfader(e);
            document.addEventListener('mousemove', this.handleCrossfaderMove);
            document.addEventListener('mouseup', this.handleCrossfaderUp);
        });
        
        // Knob events
        this.knobs.forEach((knob, index) => {
            knob.element.addEventListener('mousedown', (e) => {
                this.startDraggingKnob(e, index);
            });
        });
        
        // Global events
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.activeKnob = null;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.activeKnob !== null) {
                this.rotateKnob(e);
            }
        });
    }
    
    toggleTurntable(index) {
        const turntable = this.turntables[index];
        turntable.isPlaying = !turntable.isPlaying;
        
        if (turntable.isPlaying) {
            this.animateTurntable(index);
            turntable.tonearm.style.transform = 'rotate(20deg)';
        } else {
            turntable.tonearm.style.transform = 'rotate(45deg)';
        }
    }
    
    animateTurntable(index) {
        const turntable = this.turntables[index];
        if (!turntable.isPlaying) return;
        
        turntable.rotation += turntable.speed;
        turntable.vinyl.style.transform = `rotate(${turntable.rotation}deg)`;
        
        requestAnimationFrame(() => this.animateTurntable(index));
    }
    
    updateCrossfader(e) {
        const rect = this.crossfader.track.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        x = Math.max(0, Math.min(1, x));
        
        this.crossfaderValue = x;
        this.crossfader.handle.style.left = `${x * 100}%`;
        
        // Update turntable speeds based on crossfader
        this.turntables[0].speed = 1 * (1 - x * 0.5);
        this.turntables[1].speed = 1 * (0.5 + x * 0.5);
    }
    
    handleCrossfaderMove = (e) => {
        this.updateCrossfader(e);
    }
    
    handleCrossfaderUp = () => {
        document.removeEventListener('mousemove', this.handleCrossfaderMove);
        document.removeEventListener('mouseup', this.handleCrossfaderUp);
    }
    
    startDraggingKnob(e, index) {
        this.isDragging = true;
        this.activeKnob = index;
        
        const knob = this.knobs[index].element;
        const rect = knob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        this.startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    }
    
    rotateKnob(e) {
        const knob = this.knobs[this.activeKnob];
        const rect = knob.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let rotation = angle - this.startAngle;
        
        knob.angle += rotation;
        knob.angle = Math.max(-150, Math.min(150, knob.angle));
        
        knob.indicator.style.transform = `translateX(-50%) rotate(${knob.angle}deg)`;
        this.startAngle = angle;
        
        // Calculate value from angle (0-1)
        knob.value = (knob.angle + 150) / 300;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create container if it doesn't exist
    if (!document.querySelector('.dj-turntable')) {
        const container = document.createElement('div');
        container.className = 'dj-turntable';
        container.style.width = '100%';
        container.style.maxWidth = '600px';
        container.style.margin = '30px auto';
        
        // Insert after hero buttons
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.parentNode.insertBefore(container, heroButtons.nextSibling);
        }
    }
    
    // Initialize turntable
    new DJTurntable({
        container: '.dj-turntable',
        accentColor: '#6c44fc',
        secondaryColor: '#ff7b54'
    });
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'turntable-instructions';
    instructions.style.textAlign = 'center';
    instructions.style.fontSize = '14px';
    instructions.style.color = 'rgba(255, 255, 255, 0.7)';
    instructions.style.marginTop = '10px';
    instructions.innerHTML = 'Click turntables to play/pause. Drag crossfader and knobs to mix.';
    
    const container = document.querySelector('.dj-turntable');
    if (container) {
        container.appendChild(instructions);
    }
}); 