/* =========================================
   VIT ShuttleAI — Shared JS Module
   Navigation, Clock, Scroll Animations,
   Sign-In Modal, Scroll Arrow Effects
   ========================================= */

(function() {
    // ── THEME SYSTEM ──────────────────────────────
    // Theme lives on <html> so :root CSS vars are overridden correctly.
    // The inline <script> in each <head> already applies the saved theme
    // before paint — this block just wires up the toggle button.

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('vit-theme', theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Make sure saved theme is set (fallback if inline script missing)
    if (!document.documentElement.hasAttribute('data-theme')) {
        applyTheme(localStorage.getItem('vit-theme') || 'light');
    }

    // Wire button — use DOMContentLoaded so #theme-toggle-btn exists
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.addEventListener('click', toggleTheme);
    });

    window.toggleTheme = toggleTheme;

    // --- IST Clock ---
    function updateClock() {
        const now = new Date();
        const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const h = String(ist.getHours()).padStart(2, '0');
        const m = String(ist.getMinutes()).padStart(2, '0');
        const s = String(ist.getSeconds()).padStart(2, '0');
        const el = document.getElementById('clock-time');
        if (el) el.textContent = `${h}:${m}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // --- Nav Scroll ---
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
            // Show/hide scroll-top button
            const scrollTopBtn = document.getElementById('scroll-top-btn');
            if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
    }

    // --- Hamburger ---
    const hamburger = document.getElementById('nav-hamburger');
    const navLinksEl = document.getElementById('nav-links');
    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            navLinksEl.classList.toggle('open');
        });
        document.querySelectorAll('.nav-link').forEach(l => {
            l.addEventListener('click', () => navLinksEl.classList.remove('open'));
        });
    }

    // --- Scroll Arrow Buttons (Google Antigravity-style) ---
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-arrow-container';
    scrollContainer.id = 'scroll-arrow-container';
    scrollContainer.innerHTML = `
        <button class="scroll-arrow-btn scroll-top-btn" id="scroll-top-btn" title="Back to top" aria-label="Scroll to top">
            <span class="material-symbols-outlined">keyboard_arrow_up</span>
        </button>
        <button class="scroll-arrow-btn" id="scroll-down-btn" title="Scroll down" aria-label="Scroll down">
            <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
    `;
    document.body.appendChild(scrollContainer);

    // Animate scroll arrow buttons with floating effect
    let floatAngle = 0;
    function floatArrows() {
        floatAngle += 0.03;
        const offset = Math.sin(floatAngle) * 4;
        const scrollDownBtn = document.getElementById('scroll-down-btn');
        if (scrollDownBtn) scrollDownBtn.style.transform = `translateY(${offset}px)`;
        requestAnimationFrame(floatArrows);
    }
    requestAnimationFrame(floatArrows);

    document.getElementById('scroll-top-btn')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scroll-down-btn')?.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    });

    // --- Sign In ---
    // Sign-in is now a dedicated page (signin.html) instead of a modal.
    // Admin portal is at admin.html.

    // --- Scroll Animations ---
    const animEls = document.querySelectorAll('.glass-card, .route-card, .alert-card, .stat-card, .animate-on-scroll');
    animEls.forEach(el => el.classList.add('animate-on-scroll'));
    const animObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                animObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    animEls.forEach(el => animObs.observe(el));

    // --- Counter Animation ---
    window.animateCounter = function(el, target, suffix) {
        suffix = suffix || '';
        const num = parseInt(String(target).replace(/,/g, ''));
        let cur = 0;
        const steps = 50, inc = num / steps, dt = 1600 / steps;
        const comma = el.dataset.comma === 'true';
        const timer = setInterval(() => {
            cur += inc;
            if (cur >= num) { cur = num; clearInterval(timer); }
            let v = Math.round(cur);
            el.textContent = (comma ? v.toLocaleString() : v) + suffix;
        }, dt);
    };
})();
