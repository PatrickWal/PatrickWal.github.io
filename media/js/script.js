/**
 * Enhanced Portfolio Website JavaScript
 * Follows best practices with CSS-first animations
 */

class PortfolioManager {
    constructor() {
        this.config = {
            scrollThreshold: 300,
            typeWriterSpeed: 150,
            animationDelay: {
                experience: 100,
                projects: 200,
                references: 300
            },
            parallaxIntensity: 0.5
        };
        
        this.observers = new Map();
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.injectRequiredCSS(); // Only for essential JS-driven animations
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupRippleEffects();
        
        console.log('Portfolio website initialized successfully!');
    }

    // Only inject CSS that's truly dynamic and JS-dependent
    injectRequiredCSS() {
        if (document.getElementById('portfolio-dynamic-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'portfolio-dynamic-styles';
        style.textContent = `
            /* Only animations that are truly dynamic */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Notification styles - purely JS-driven */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                font-family: inherit;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .notification--success { background-color: #27ae60; }
            .notification--error { background-color: #e74c3c; }
            .notification--info { background-color: #3498db; }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('[data-mobile-menu-toggle]');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Close mobile menu on link clicks
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', this.closeMobileMenu);
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Throttled scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Form submission
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Page load animation
        window.addEventListener('load', this.handlePageLoad.bind(this));
    }

    // Mobile Navigation
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const isActive = navLinks.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const menuBtn = document.querySelector('[data-mobile-menu-toggle]');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', isActive);
        }
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks?.classList.remove('active');
        
        const menuBtn = document.querySelector('[data-mobile-menu-toggle]');
        menuBtn?.setAttribute('aria-expanded', 'false');
    }

    // Smooth Scrolling
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Scroll Handler with Performance Optimization
    handleScroll() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            
            // Scroll to top button - use CSS class instead of inline styles
            this.toggleScrollButton(scrollY);
            
            // Parallax effect - this is dynamic so JS is appropriate
            this.handleParallax(scrollY);
            
            this.isScrolling = false;
        });
    }

    toggleScrollButton(scrollY) {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (!scrollButton) return;
        
        // Use CSS class instead of inline styles
        scrollButton.classList.toggle('show', scrollY > this.config.scrollThreshold);
    }

    handleParallax(scrollY) {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            // Parallax requires dynamic calculation, so JS is appropriate here
            const translateY = scrollY * this.config.parallaxIntensity;
            heroSection.style.transform = `translateY(${translateY}px)`;
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Form Handling with Validation
    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            message: formData.get('message')?.trim()
        };
        
        if (!this.validateForm(data)) {
            return;
        }
        
        this.submitForm(data, event.target);
    }

    validateForm({ name, email, message }) {
        if (!name || !email || !message) {
            this.showNotification('Vul alle velden in.', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Voer een geldig e-mailadres in.', 'error');
            return false;
        }
        
        return true;
    }

    submitForm(data, form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn?.textContent;
        
        // Use CSS classes for loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification(
                `Dank je wel ${data.name}! Je bericht is ontvangen. Ik neem zo spoedig mogelijk contact met je op via ${data.email}.`,
                'success'
            );
            form.reset();
            
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }, 1000);
    }

    // Notification System - JS-driven so styles in JS are appropriate
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Use CSS class for animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Intersection Observer Setup
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Just add CSS class - all animation is in CSS
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.observers.set('main', observer);
        this.observeElements();
    }

    observeElements() {
        const observer = this.observers.get('main');
        
        // Just observe elements - CSS handles the animation preparation
        document.querySelectorAll('[data-animate]').forEach(element => {
            observer.observe(element);
        });
        
        // Fallback for elements without data attributes
        document.querySelectorAll('.section, .experience-item, .project-card, .reference-card').forEach(element => {
            observer.observe(element);
        });
    }

    // Typing Effect - Dynamic so JS is appropriate
    async typeWriter(element, text, speed = this.config.typeWriterSpeed) {
        if (!element) return;
        
        return new Promise((resolve) => {
            let i = 0;
            element.innerHTML = '';
            
            const type = () => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    }

    // Ripple Effects - Dynamic positioning requires JS
    setupRippleEffects() {
        document.querySelectorAll('.project-link, .submit-btn, .cta-button').forEach(button => {
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                // Dynamic positioning requires JS
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    async handlePageLoad() {
        // Use CSS class for page transition
        document.body.classList.add('page-loading');
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
        
        // Typing effect is dynamic, so JS is appropriate
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            await this.typeWriter(heroTitle, originalText);
        }
    }

    // Utility Methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        console.log('Portfolio manager destroyed');
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Global functions for backward compatibility
window.toggleMobileMenu = function() {
    window.portfolioManager?.toggleMobileMenu();
};

window.scrollToTop = function() {
    window.portfolioManager?.scrollToTop();
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.portfolioManager = new PortfolioManager();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - reducing activity');
    } else {
        console.log('Page visible - resuming normal activity');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}
