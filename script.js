// ===== ADVANCED NEON TUBES CURSOR SYSTEM =====
class NeonTubesCursor {
    constructor() {
        this.canvas = document.getElementById('neonCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.maxPoints = 25; // Longer, more fluid trail
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.easing = 0.15; // Smooth follow effect
        
        // Multiple neon colors for rainbow effect
        this.neonColors = [
            '#ff0080', // Pink
            '#ff00ff', // Magenta  
            '#8000ff', // Purple
            '#0080ff', // Blue
            '#00ffff', // Cyan
            '#00ff80', // Green
            '#80ff00', // Lime
            '#ffff00'  // Yellow
        ];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.animate();
        
        // Add some initial points for immediate effect
        for (let i = 0; i < this.maxPoints; i++) {
            this.points.push({ x: this.mouseX, y: this.mouseY });
        }
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Mouse movement with easing
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        // Mouse leave window
        document.addEventListener('mouseleave', () => {
            this.targetX = -100;
            this.targetY = -100;
        });

        // Mouse enter window  
        document.addEventListener('mouseenter', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
    }

    addPoint(x, y) {
        this.points.unshift({ x, y, color: this.getCurrentColor() });
        if (this.points.length > this.maxPoints) {
            this.points.pop();
        }
    }

    getCurrentColor() {
        const time = Date.now() * 0.001;
        const index = Math.floor(time * 2) % this.neonColors.length;
        return this.neonColors[index];
    }

    drawTube() {
        if (this.points.length < 3) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw multiple passes for thicker, glowing effect
        for (let pass = 0; pass < 3; pass++) {
            this.ctx.beginPath();
            
            // Start from the first point
            this.ctx.moveTo(this.points[0].x, this.points[0].y);
            
            // Draw smooth curve through points
            for (let i = 1; i < this.points.length - 2; i++) {
                const xc = (this.points[i].x + this.points[i + 1].x) / 2;
                const yc = (this.points[i].y + this.points[i + 1].y) / 2;
                
                // Gradient color based on position
                const gradient = this.ctx.createLinearGradient(
                    this.points[i].x, this.points[i].y,
                    this.points[i + 1].x, this.points[i + 1].y
                );
                
                gradient.addColorStop(0, this.points[i].color);
                gradient.addColorStop(1, this.points[i + 1].color);
                
                this.ctx.strokeStyle = gradient;
                
                // Vary line width for tube-like appearance
                const lineWidth = (this.maxPoints - i) / this.maxPoints * 8 + 2;
                this.ctx.lineWidth = lineWidth + pass * 2;
                
                // Different effects for each pass
                switch(pass) {
                    case 0:
                        // Main tube
                        this.ctx.shadowBlur = 20;
                        this.ctx.shadowColor = this.points[i].color;
                        this.ctx.lineCap = 'round';
                        this.ctx.lineJoin = 'round';
                        break;
                    case 1:
                        // Outer glow
                        this.ctx.shadowBlur = 30;
                        this.ctx.shadowColor = this.points[i].color;
                        this.ctx.globalAlpha = 0.3;
                        break;
                    case 2:
                        // Inner highlight  
                        this.ctx.shadowBlur = 10;
                        this.ctx.shadowColor = '#ffffff';
                        this.ctx.globalAlpha = 0.2;
                        this.ctx.lineWidth = Math.max(1, lineWidth * 0.3);
                        break;
                }
                
                this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
                this.ctx.stroke();
            }
        }
        
        // Reset global alpha
        this.ctx.globalAlpha = 1.0;
        
        // Draw glowing dots at points
        this.drawGlowDots();
    }

    drawGlowDots() {
        for (let i = 0; i < this.points.length; i += 3) {
            const point = this.points[i];
            const radius = (this.maxPoints - i) / this.maxPoints * 6 + 2;
            
            // Dot glow
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = point.color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = point.color;
            this.ctx.globalAlpha = 0.4;
            this.ctx.fill();
            
            // Bright center
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = point.color;
            this.ctx.globalAlpha = 0.8;
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    animate() {
        // Smooth mouse following with easing
        this.mouseX += (this.targetX - this.mouseX) * this.easing;
        this.mouseY += (this.targetY - this.mouseY) * this.easing;
        
        this.addPoint(this.mouseX, this.mouseY);
        this.drawTube();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== PORTFOLIO APPLICATION WITH SMART CURSOR =====
class PortfolioApp {
    constructor() {
        this.neonCursor = null;
        this.init();
    }

    init() {
        // Initialize neon cursor first
        this.neonCursor = new NeonTubesCursor();
        
        // Then initialize portfolio features
        this.loadProjects();
        this.initScrollAnimations();
        this.initNavbarScroll();
        this.initSmoothScrolling();
        this.initInteractiveElements();
        this.initSmartCursor(); // ← SMART CURSOR SYSTEM
        
        console.log('%c🎮 SMART NEON CURSOR ACTIVATED!', 'color: #ff0080; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #ff0080;');
    }

    // ===== SMART CURSOR SYSTEM =====
    initSmartCursor() {
        let mouseMoving = false;
        let mouseTimer;
        let clickTimer;
        
        // Show dot when mouse moves
        document.addEventListener('mousemove', (e) => {
            this.updateDotPosition(e.clientX, e.clientY);
            
            document.body.classList.add('cursor-active');
            mouseMoving = true;
            
            clearTimeout(mouseTimer);
            mouseTimer = setTimeout(() => {
                if (!this.isOverClickable(e.target)) {
                    document.body.classList.remove('cursor-active');
                }
                mouseMoving = false;
            }, 800);
        });
        
        // Enhanced clickable elements detection
        const clickableElements = document.querySelectorAll(
            'a, button, .project-link, .social-link, .btn, .nav-menu a, [onclick], input, select, textarea'
        );
        
        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-active');
                this.enhanceElement(element);
            });
            
            element.addEventListener('mouseleave', () => {
                if (!mouseMoving) {
                    document.body.classList.remove('cursor-active');
                }
                this.unenhanceElement(element);
            });
        });
        
        // Click feedback
        document.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-click');
            clearTimeout(clickTimer);
        });
        
        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
            clickTimer = setTimeout(() => {
                if (!mouseMoving && !this.isOverClickable(document.elementFromPoint(this.lastX, this.lastY))) {
                    document.body.classList.remove('cursor-active');
                }
            }, 1500);
        });
        
        // Hide dot when mouse leaves window
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active', 'cursor-click');
        });
        
        // Show dot when mouse enters window
        document.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
        });
    }
    
    updateDotPosition(x, y) {
        this.lastX = x;
        this.lastY = y;
        document.body.style.setProperty('--cursor-x', x + 'px');
        document.body.style.setProperty('--cursor-y', y + 'px');
    }
    
    isOverClickable(element) {
        if (!element) return false;
        
        const clickableSelectors = [
            'a', 'button', '.project-link', '.social-link', 
            '.btn', '[onclick]', 'input', 'select', 'textarea'
        ];
        
        return clickableSelectors.some(selector => 
            element.matches?.(selector) || 
            element.closest?.(selector)
        );
    }
    
    enhanceElement(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.filter = 'brightness(1.2) drop-shadow(0 0 10px rgba(0, 243, 255, 0.5))';
    }
    
    unenhanceElement(element) {
        element.style.filter = '';
    }

    // ===== EXISTING PORTFOLIO METHODS =====
    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            const data = await response.json();
            this.displayProjects(data.projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects. Please check the console.');
        }
    }

    displayProjects(projects) {
        const container = document.getElementById('projects-container');
        
        if (!projects || projects.length === 0) {
            container.innerHTML = '<p class="no-projects">No projects to display yet. Check back soon!</p>';
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card fade-in">
                <div class="project-image">
                    ${project.image ? 
                        `<img src="assets/images/${project.image}" alt="${project.title}" 
                              onerror="this.style.display='none'; this.parentElement.innerHTML='${project.title}'">` : 
                        project.title
                    }
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? 
                        `<a href="${project.liveUrl}" target="_blank" class="project-link">
                            <span>Live Demo</span>
                        </a>` : ''
                    }
                    ${project.githubUrl ? 
                        `<a href="${project.githubUrl}" target="_blank" class="project-link">
                            <span>GitHub</span>
                        </a>` : ''
                    }
                </div>
            </div>
        `).join('');

        setTimeout(() => this.observeElements(), 100);
    }

    initScrollAnimations() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        setTimeout(() => this.observeElements(), 500);
    }

    observeElements() {
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initInteractiveElements() {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                // Special effects can be added here
            });
        });
    }

    showError(message) {
        const container = document.getElementById('projects-container');
        container.innerHTML = `<p class="error-message">${message}</p>`;
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Cool console message
console.log('%c🌟 PORTFOLIO WITH NEON TUBES CURSOR - ACTIVATED!', 
    'color: #00ffff; font-size: 20px; font-weight: bold; text-shadow: 0 0 15px #00ffff;');
console.log('%c✨ Move your mouse to see the magic!', 
    'color: #ff00ff; font-size: 16px; font-weight: bold;');