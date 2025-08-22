// Optimized Portfolio JavaScript
(function() {
    'use strict';

    // Cache DOM elements
    const elements = {
        navLinks: null,
        mobileMenu: null,
        scrollButton: null,
        heroSection: null,
        heroTitle: null,
        sections: [],
        experienceItems: [],
        projectCards: [],
        referenceCards: [],
        skillItems: []
    };

    // Performance optimization: Debounce function
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

    // Performance optimization: Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cache DOM elements on initialization
    function cacheElements() {
        elements.navLinks = document.querySelector('.nav-links');
        elements.mobileMenu = document.querySelector('.mobile-menu');
        elements.scrollButton = document.querySelector('.scroll-to-top');
        elements.heroSection = document.querySelector('.hero-section');
        elements.heroTitle = document.querySelector('.hero-text h1');
        elements.sections = document.querySelectorAll('.section');
        elements.experienceItems = document.querySelectorAll('.experience-item');
        elements.projectCards = document.querySelectorAll('.project-card');
        elements.referenceCards = document.querySelectorAll('.reference-card');
        elements.skillItems = document.querySelectorAll('.skill-item');
    }

    // Mobile menu functionality
    function initMobileMenu() {
        if (!elements.mobileMenu || !elements.navLinks) return;

        function toggleMobileMenu() {
            elements.navLinks.classList.toggle('active');
            elements.mobileMenu.classList.toggle('active');
        }

        function closeMobileMenu() {
            elements.navLinks.classList.remove('active');
            elements.mobileMenu.classList.remove('active');
        }

        // Toggle menu
        elements.mobileMenu.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking on links
        elements.navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.navLinks.classList.contains('active')) {
                closeMobileMenu();
                elements.mobileMenu.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navLinks.contains(e.target) && 
                !elements.mobileMenu.contains(e.target) && 
                elements.navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Smooth scrolling for navigation links
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Intersection Observer for animations
    function initScrollAnimations() {
        if (!window.IntersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        // Observe elements for animation
        [...elements.sections, ...elements.experienceItems, 
         ...elements.projectCards, ...elements.referenceCards].forEach(el => {
            if (el) observer.observe(el);
        });
    }

    // Scroll-based functionality
    function initScrollEffects() {
        let ticking = false;

        const scrollHandler = () => {
            const scrolled = window.pageYOffset;
            
            // Show/hide scroll to top button
            if (elements.scrollButton) {
                elements.scrollButton.classList.toggle('show', scrolled > 300);
            }

            // Parallax effect for hero section
            if (elements.heroSection && scrolled < window.innerHeight) {
                elements.heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            ticking = false;
        };

        const throttledScrollHandler = throttle(scrollHandler, 16); // ~60fps

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(throttledScrollHandler);
                ticking = true;
            }
        }, { passive: true });
    }

    // Scroll to top functionality
    function initScrollToTop() {
        if (!elements.scrollButton) return;

        elements.scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form handling
    function initFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Vul alle velden in.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Voer een geldig e-mailadres in.');
                return;
            }
            
            // Success message
            alert(`Dank je wel ${name}! Je bericht is ontvangen. Ik neem zo spoedig mogelijk contact met je op via ${email}.`);
            
            // Reset form with animation
            e.target.reset();
            e.target.style.opacity = '0.7';
            setTimeout(() => {
                e.target.style.opacity = '1';
            }, 200);
        });
    }

    // Typing effect for hero title
    function initTypingEffect() {
        if (!elements.heroTitle) return;

        const originalText = elements.heroTitle.innerHTML;
        const text = originalText.replace('<br>', '\n');
        
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    if (text.charAt(i) === '\n') {
                        element.innerHTML += '<br>';
                    } else {
                        element.innerHTML += text.charAt(i);
                    }
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // Start typing effect after a short delay
        setTimeout(() => {
            typeWriter(elements.heroTitle, text, 120);
        }, 500);
    }

    // Ripple effect for buttons
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.project-link, .submit-btn, .scroll-to-top');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    }

    // Enhanced hover effects
    function initHoverEffects() {
        // Skill items hover effect
        elements.skillItems.forEach(skill => {
            let hoverTimeout;
            
            skill.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.style.background = '#7a9b7a';
                this.style.color = 'white';
            });
            
            skill.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.style.background = '#f8f9fa';
                    this.style.color = '#333';
                }, 100);
            });
        });

        // Tech tags hover effect
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.background = '#7a9b7a';
                this.style.color = 'white';
                this.style.transform = 'scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.background = '#f0f4f0';
                this.style.color = '#7a9b7a';
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Lazy loading for better performance
    function initLazyLoading() {
        if (!window.IntersectionObserver) return;

        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Accessibility enhancements
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Keyboard navigation for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('skill-item') || 
                    e.target.classList.contains('project-card')) {
                    e.target.click();
                }
            }
        });

        // Focus management
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        // Trap focus in mobile menu when open
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && elements.navLinks?.classList.contains('active')) {
                const focusableInMenu = elements.navLinks.querySelectorAll('a');
                const firstFocusable = focusableInMenu[0];
                const lastFocusable = focusableInMenu[focusableInMenu.length - 1];

                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    // Error handling wrapper
    function safeExecute(fn, context = 'Unknown') {
        try {
            return fn();
        } catch (error) {
            console.warn(`Error in ${context}:`, error);
        }
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        if (!window.performance) return;

        // Monitor Core Web Vitals
        if ('web-vitals' in window) {
            // This would require the web-vitals library
            // For now, we'll just log basic performance metrics
        }

        // Log page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    // Main initialization function
    function init() {
        // Cache DOM elements first
        safeExecute(cacheElements, 'cacheElements');
        
        // Initialize all features
        safeExecute(initMobileMenu, 'initMobileMenu');
        safeExecute(initSmoothScroll, 'initSmoothScroll');
        safeExecute(initScrollAnimations, 'initScrollAnimations');
        safeExecute(initScrollEffects, 'initScrollEffects');
        safeExecute(initScrollToTop, 'initScrollToTop');
        safeExecute(initFormHandling, 'initFormHandling');
        safeExecute(initRippleEffect, 'initRippleEffect');
        safeExecute(initHoverEffects, 'initHoverEffects');
        safeExecute(initLazyLoading, 'initLazyLoading');
        safeExecute(initAccessibility, 'initAccessibility');
        safeExecute(initPerformanceMonitoring, 'initPerformanceMonitoring');
        
        // Initialize typing effect after other elements are ready
        setTimeout(() => {
            safeExecute(initTypingEffect, 'initTypingEffect');
        }, 100);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive operations when tab is not visible
            elements.heroSection?.style.setProperty('will-change', 'auto');
        } else {
            // Resume when tab becomes visible
            elements.heroSection?.style.setProperty('will-change', 'transform');
        }
    });

    // Expose some functions globally for debugging (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.portfolioDebug = {
            elements,
            cacheElements,
            safeExecute
        };
    }

})();