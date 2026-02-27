document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker for fast loading (Desactivado según petición)
    /*
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.log('SW Registration Failed:', err));
    }
    */

    // Inject Navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            initNavbar();
            initProgrammingModal(); // Initialize modal after injection
        });

    // Inject Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            // After injection, we can observe the footer
            setupFooterObserver();
        });


    initScrollReveal();
    injectFloatingControls();
    // Use a small timeout to ensure DOM is fully ready and styles are applied
    setTimeout(initHeroCarousel, 100);
});

function initHeroCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;

    function showSlide(index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                if (dots[i]) dots[i].classList.add('active');
            } else {
                item.classList.remove('active');
                if (dots[i]) dots[i].classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(currentIndex);
    }

    function startInterval() {
        interval = setInterval(nextSlide, 3000);
    }

    if (items.length > 0) {
        startInterval();

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                currentIndex = index;
                showSlide(currentIndex);
                startInterval();
            });
        });
    }
}

function initProgrammingModal() {
    const modal = document.getElementById('programming-modal');
    const btns = document.querySelectorAll('.show-programming');
    const span = document.querySelector('.close-modal');

    if (modal && btns.length > 0) {
        btns.forEach(btn => {
            btn.onclick = function () {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        if (span) {
            span.onclick = function () {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    }
}

function initNavbar() {
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
            document.body.classList.add('body-scrolled');
        } else {
            nav.classList.remove('scrolled');
            document.body.classList.remove('body-scrolled');
        }
    });

    // Mobile menu
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');

            // Animate Links
            document.querySelectorAll('.nav-links li').forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            burger.classList.toggle('toggle');
        });
    }
}

/**
 * Apple-style Scroll Reveal System
 * Uses IntersectionObserver for high performance and fluid animations
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Target elements to reveal
    const selectors = [
        '.section-title',
        '.manifesto-info',
        '.manifesto-image-side',
        '.service-item',
        '.mini-pillar-card',
        '.contact-info',
        '.contact-form-container',
        '.footer-section'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    });
}

/**
 * Injects Floating Social Sidebar and Back-to-Top button
 */
function injectFloatingControls() {
    const controlsHTML = `
        <div class="floating-controls">
            <div class="social-sidebar" id="socialSidebar">
                <div class="whatsapp-container">
                    <div class="whatsapp-tip" id="whatsappTip">
                        <span>Anuncia con nosotros <i class="fa-solid fa-bullhorn"></i></span>
                    </div>
                    <a href="https://wa.me/51922655566" class="social-icon whatsapp" id="whatsappIcon" target="_blank" title="WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
                <a href="#" class="social-icon facebook" target="_blank" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="social-icon instagram" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" class="social-icon youtube" target="_blank" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
                <a href="#" class="social-icon tiktok" target="_blank" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            </div>
            <button class="back-to-top" id="backToTop" title="Volver arriba">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', controlsHTML);

    const socialSidebar = document.getElementById('socialSidebar');
    const backToTop = document.getElementById('backToTop');

    // Scroll to Top Logic
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll listener for Back to Top button visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('show-top');
        } else {
            backToTop.classList.remove('show-top');
        }
    });
    // Periodic WhatsApp Announcement Trigger
    const whatsappIcon = document.getElementById('whatsappIcon');
    const whatsappTip = document.getElementById('whatsappTip');

    if (whatsappIcon && whatsappTip) {
        setInterval(() => {
            // Trigger bounce and tip visibility
            whatsappIcon.classList.add('wa-bounce');
            whatsappTip.classList.add('tip-visible');

            // Remove after 5 seconds
            setTimeout(() => {
                whatsappIcon.classList.remove('wa-bounce');
                whatsappTip.classList.remove('tip-visible');
            }, 5000);
        }, 12000); // Trigger every 12 seconds
    }
}

/**
 * Specifically sets up the observer for the footer to hide social links
 * This is called after the footer is injected via fetch
 */
function setupFooterObserver() {
    const socialSidebar = document.getElementById('socialSidebar');
    const footer = document.querySelector('footer');

    if (footer && socialSidebar) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    socialSidebar.classList.add('social-hidden');
                } else {
                    socialSidebar.classList.remove('social-hidden');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px"
        });
        footerObserver.observe(footer);
    }
}
