/**
 * FluxBoard - Interactive SaaS Landing Page
 * Core JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initThemeToggle();
    initScrollReveal();
    initCounters();
    initMagneticButtons();
    initParallax();
});

/* =========================================
   Custom Cursor
   ========================================= */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.transform = `translate(calc(${followerX}px - 50%), calc(${followerY}px - 50%))`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects for links and buttons
    const hoverElements = document.querySelectorAll('a, button, .magnetic, .glass-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/* =========================================
   Theme Toggle
   ========================================= */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!toggleBtn) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('fluxboard-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('fluxboard-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('fluxboard-theme', 'light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    });
}

/* =========================================
   Scroll Reveal (Intersection Observer)
   ========================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Navbar reveal on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Initial page load animations
    setTimeout(() => {
        navbar.classList.remove('hidden-on-load');
        document.querySelectorAll('.stagger-text').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-up');
            }, index * 100);
        });
        setTimeout(() => {
            document.querySelector('.stagger-img')?.classList.add('animate-up');
        }, 400);
    }, 100);
}

/* =========================================
   Animated Counters
   ========================================= */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseFloat(target.getAttribute('data-target'));
                const isFloat = endValue % 1 !== 0;
                
                let startValue = 0;
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    if (elapsedTime < duration) {
                        const progress = elapsedTime / duration;
                        // ease out expo
                        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const currentVal = startValue + (endValue - startValue) * easeOut;
                        
                        target.innerText = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = isFloat ? endValue.toFixed(1) : endValue;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/* =========================================
   Magnetic Buttons
   ========================================= */
function initMagneticButtons() {
    const magneticEls = document.querySelectorAll('.magnetic');
    
    magneticEls.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

/* =========================================
   Parallax Effect for Dashboard Image
   ========================================= */
function initParallax() {
    const parallaxEl = document.querySelector('.parallax-element');
    if (!parallaxEl) return;
    
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        parallaxEl.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}
