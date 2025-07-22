class AudioEqualizer {
    constructor(options) {
        this.options = {
            container: '.equalizer-container',
            barCount: 32,
            barColor: '#6c44fc',
            barWidth: 4,
            barSpacing: 1,
            barHeight: 100,
            responsive: true,
            ...options
        };
        
        this.container = document.querySelector(this.options.container);
        if (!this.container) return;
        
        this.audioContext = null;
        this.analyser = null;
        this.audio = null;
        this.dataArray = null;
        this.bars = [];
        this.animationFrame = null;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // Create bars
        this.createBars();
        
        // Handle resize
        if (this.options.responsive) {
            window.addEventListener('resize', () => this.handleResize());
        }
    }
    
    createBars() {
        // Clear existing bars
        this.container.innerHTML = '';
        this.bars = [];
        
        // Create container for bars
        const barsContainer = document.createElement('div');
        barsContainer.className = 'equalizer-bars';
        barsContainer.style.display = 'flex';
        barsContainer.style.alignItems = 'flex-end';
        barsContainer.style.height = `${this.options.barHeight}px`;
        barsContainer.style.width = '100%';
        barsContainer.style.justifyContent = 'center';
        
        // Create bars
        for (let i = 0; i < this.options.barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'equalizer-bar';
            bar.style.width = `${this.options.barWidth}px`;
            bar.style.marginRight = `${this.options.barSpacing}px`;
            bar.style.height = '0%';
            bar.style.background = this.options.barColor;
            bar.style.transition = 'height 0.05s ease';
            
            barsContainer.appendChild(bar);
            this.bars.push(bar);
        }
        
        this.container.appendChild(barsContainer);
    }
    
    handleResize() {
        // Adjust bar width based on container width
        const containerWidth = this.container.clientWidth;
        const totalBarsWidth = this.options.barCount * (this.options.barWidth + this.options.barSpacing);
        
        if (totalBarsWidth > containerWidth) {
            const newBarWidth = Math.floor((containerWidth / this.options.barCount) - this.options.barSpacing);
            if (newBarWidth > 0) {
                this.options.barWidth = newBarWidth;
                this.createBars();
            }
        }
    }
    
    connectAudio(audioElement) {
        // Store audio element
        this.audio = audioElement;
        
        // Create audio context if needed
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            // Connect audio source
            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Create data array
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
        }
        
        // Add event listeners
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.visualize();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.stopVisualization();
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.stopVisualization();
        });
    }
    
    visualize() {
        if (!this.isPlaying) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Update bars
        const step = Math.floor(this.dataArray.length / this.options.barCount);
        for (let i = 0; i < this.options.barCount; i++) {
            const barIndex = i * step;
            let value = this.dataArray[barIndex] / 255;
            
            // Apply some easing for smoother visualization
            value = Math.pow(value, 1.5);
            
            // Update bar height
            this.bars[i].style.height = `${value * 100}%`;
            
            // Update bar color based on frequency (optional)
            const hue = 250 - (value * 100);
            this.bars[i].style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
        }
        
        // Continue animation loop
        this.animationFrame = requestAnimationFrame(() => this.visualize());
    }
    
    stopVisualization() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Reset bars
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].style.height = '0%';
            this.bars[i].style.backgroundColor = this.options.barColor;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if music player exists
    const musicPlayer = document.querySelector('.music-player');
    if (!musicPlayer) return;
    
    // Create equalizer container if it doesn't exist
    let equalizerContainer = musicPlayer.querySelector('.equalizer-container');
    if (!equalizerContainer) {
        equalizerContainer = document.createElement('div');
        equalizerContainer.className = 'equalizer-container';
        equalizerContainer.style.width = '100%';
        equalizerContainer.style.height = '60px';
        equalizerContainer.style.marginTop = '10px';
        equalizerContainer.style.overflow = 'hidden';
        equalizerContainer.style.borderRadius = '5px';
        
        // Insert after track-art
        const trackArt = musicPlayer.querySelector('.track-art');
        if (trackArt) {
            trackArt.parentNode.insertBefore(equalizerContainer, trackArt.nextSibling);
        } else {
            musicPlayer.querySelector('.track').appendChild(equalizerContainer);
        }
    }
    
    // Initialize equalizer
    const equalizer = new AudioEqualizer({
        container: '.equalizer-container',
        barCount: 32,
        barColor: '#6c44fc',
        barWidth: 4,
        barSpacing: 1,
        barHeight: 60
    });
    
    // Connect to audio element when it's created
    const checkAudio = setInterval(() => {
        const audioElement = document.querySelector('audio');
        if (audioElement) {
            equalizer.connectAudio(audioElement);
            clearInterval(checkAudio);
        }
    }, 100);
}); 