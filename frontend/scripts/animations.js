/**
 * =============================
 * ANIMATIONS.JS - Scroll Triggered Animations
 * Lightweight animations using Intersection Observer API
 * ============================= */

/**
 * Initialize all scroll-triggered animations
 * Uses Intersection Observer API for optimal performance
 */
function initializeScrollAnimations() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mark eligible elements (idempotent)
    document.querySelectorAll(
        '#hero, #feature, #product1, #banner, #new-arrivals, #recently-viewed, #sm-banner, #banner3, #newsletter, #feature .fe-box, #product1 .pro, #new-arrivals .pro, #recently-viewed .pro'
    ).forEach(el => el.classList.add('animate-on-scroll'));

    // Reduced motion: show everything immediately
    if (prefersReduced) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
        return;
    }

    // Reuse a single observer instance if one exists
    if (window.__homeObserver) {
        try {
            window.__homeObserver.disconnect();
        } catch (_) {
            // no-op
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            // Avoid re-animating
            if (el.classList.contains('in-view')) return;

            // Apply stagger if index exists
            const index = Number(el.getAttribute('data-anim-index') || '0');
            const stagger = Math.max(0, Math.min(0.06 * index, 0.6));

            el.style.animationDelay = `${stagger}s`;
            el.classList.add('in-view');
            observer.unobserve(el);
        });

    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    window.__homeObserver = observer;
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/**
 * Add animation classes to product cards dynamically
 * Called when products are rendered
 */
function addProductCardAnimations(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Add animation class to all product cards
    container.querySelectorAll('.pro').forEach(card => {
        // Remove existing animation class if any
        card.classList.remove('in-view');
        
        // Add scroll animation class
        card.classList.add('animate-on-scroll');
    });

    // Re-initialize observer for newly added cards
    initializeScrollAnimations();
}

/**
 * Add staggered animation to feature cards
 * Already handled by CSS, but can be enhanced with JS
 */
function enhanceFeatureCards() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const featureBoxes = document.querySelectorAll('#feature .fe-box');

    featureBoxes.forEach((box, index) => {
        // Let scroll observer handle visibility; only set stagger.
        box.setAttribute('data-anim-index', String(index));

        if (prefersReduced) return;
        // Ensure keyframe exists; delay set by observer.
        box.style.willChange = 'transform, opacity';
    });
}

/**
 * Add animation to product cards that appear after filtering/sorting
 * This ensures newly rendered products animate smoothly
 */
function animateProductsOnLoad() {
    // Observe for dynamic content changes
    const observer = new MutationObserver(() => {
        // Add animation to cards that don't have it yet
        document.querySelectorAll('.pro:not(.animate-on-scroll)').forEach(card => {
            card.classList.add('animate-on-scroll', 'in-view');
        });
    });

    // Observe product containers for changes
    const containers = [
        document.getElementById('featured-products'),
        document.getElementById('new-arrivals-container'),
        document.getElementById('recently-viewed-container')
    ];

    containers.forEach(container => {
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }
    });
}

/**
 * Enhance navbar animations on scroll
 * Add subtle effects when page is scrolled
 */
function enhanceNavbarAnimations() {
    const navbar = document.getElementById('header');
    const logoImg = document.querySelector('#header .logo, #header .logo img, #header img.logo');
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Logo fade-in on load
    if (logoImg && !prefersReduced) {
        logoImg.style.opacity = '0';
        logoImg.style.transform = 'translateY(-4px)';
        logoImg.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        requestAnimationFrame(() => {
            logoImg.style.opacity = '1';
            logoImg.style.transform = 'translateY(0)';
        });
    }

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.1)';
            navbar.style.transition = 'box-shadow 0.3s ease-out';
        } else {
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.06)';
        }
    }, { passive: true });

    // Cart icon hover scale
    const cartLink = document.querySelector('#navbar-links .cart-link a');
    if (cartLink && !prefersReduced) {
        cartLink.style.transition = 'transform 0.2s ease';
        cartLink.addEventListener('mouseenter', () => {
            cartLink.style.transform = 'scale(1.03)';
        }, { passive: true });
        cartLink.addEventListener('mouseleave', () => {
            cartLink.style.transform = 'scale(1)';
        }, { passive: true });
    }
}

/**
 * Add smooth scroll behavior and animations to buttons
 */
function enhanceButtonAnimations() {
    const buttons = document.querySelectorAll('button, a[href*="shop"]');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Subtle scale effect
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

/**
 * Create intersection observer for parallax-like effects
 * Subtle parallax on hero images and banners
 */
function initializeParallaxEffects() {
    const hero = document.getElementById('hero');
    
    if (!hero || !('IntersectionObserver' in window)) return;

    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply parallax effect based on scroll position
                const scrollPercent = (window.scrollY / entry.target.offsetHeight);
                entry.target.style.backgroundPosition = `top ${25 + scrollPercent * 5}% right 0`;
                entry.target.style.transition = 'background-position 0.1s linear';
            }
        });
    });

    parallaxObserver.observe(hero);
}

/**
 * Initialize all animations
 * Exported for use in other modules
 */
function runHeroOnceOnly() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Idempotent
    if (hero.dataset.heroAnimated === '1') return;
    hero.dataset.heroAnimated = '1';

    // Add class to start/enable once-only animations
    hero.classList.add('hero-animate-once');

    // Next frame ensures initial styles applied before animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            hero.classList.add('page-loaded');
        });
    });
}

function initializeAllAnimations() {
    // Delay slightly to ensure DOM is fully loaded
    setTimeout(() => {
        runHeroOnceOnly();
        initializeScrollAnimations();
        enhanceFeatureCards();
        animateProductsOnLoad();
        enhanceNavbarAnimations();
        enhanceButtonAnimations();
        initializeParallaxEffects();
    }, 80);
}


// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllAnimations);
} else {
    initializeAllAnimations();
}

// Extra safety: re-run once after first paint to catch late DOM injections
setTimeout(() => {
    try {
        initializeScrollAnimations();
    } catch (e) {
        // no-op
    }
}, 300);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeScrollAnimations,
        addProductCardAnimations,
        enhanceFeatureCards,
        animateProductsOnLoad,
        enhanceNavbarAnimations,
        enhanceButtonAnimations,
        initializeParallaxEffects,
        initializeAllAnimations
    };
}
