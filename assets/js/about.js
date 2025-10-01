
// Fixed About Page JavaScript
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.setupNumberCounting();
        
        this.bindEvents();
        
        console.log('About page initialized successfully');
    }
    
    // Navigation with sticky behavior
    setupNavigation() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navLinks = document.getElementById('navLinks');
        this.scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset > this.scrollThreshold;
            
            if (scrolled) {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.backdropFilter = 'blur(10px)';
            } else {
                this.header.style.background = '#ffffff';
                this.header.style.backdropFilter = 'none';
            }
        });
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animate;
                    const delay = parseInt(element.dataset.delay) || 0;

                    setTimeout(() => {
                        element.classList.add(`animate-${animationType}`);
                    }, delay);

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Number counting animation
    setupNumberCounting() {
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers(entry.target);
                    numberObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-count]').forEach(el => {
            numberObserver.observe(el);
        });
    }

    animateNumbers(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Back to top functionality
    setupBackToTop() {
        this.backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        });

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Event binding
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenuBtn.classList.toggle('active');
                this.navLinks.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.mobile-menu-btn')) {
                this.mobileMenuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            }
        });

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navLinks.classList.contains('active')) {
                this.mobileMenuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            }
        });
    }
}

// Initialize the about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});