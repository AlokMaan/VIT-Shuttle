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

    // --- Sign In Modal ---
    const signinModal = document.createElement('div');
    signinModal.className = 'signin-modal-overlay';
    signinModal.id = 'signin-modal-overlay';
    signinModal.innerHTML = `
        <div class="signin-modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">

            <!-- Close -->
            <button class="signin-modal-close" id="signin-modal-close" aria-label="Close">&times;</button>

            <!-- Brand header -->
            <div class="signin-header">
                <div class="signin-brand-icon">🚌</div>
                <div>
                    <div class="signin-brand-name">VIT Shuttle</div>
                    <div class="signin-brand-sub">AI-Powered Campus Transit</div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="signin-tabs">
                <div class="signin-tab active" data-tab="student">🎓 Student</div>
                <div class="signin-tab" data-tab="admin">🔐 Admin</div>
            </div>

            <!-- Title -->
            <h2 id="signin-title" class="signin-title">Welcome Back</h2>
            <p id="signin-desc" class="signin-desc">Sign in with your VIT credentials to continue.</p>

            <!-- Fields -->
            <div class="signin-field">
                <label for="signin-email">Email Address</label>
                <div class="signin-input-wrap">
                    <span class="signin-input-icon">✉️</span>
                    <input type="email" id="signin-email" placeholder="yourname@vit.ac.in" autocomplete="email">
                </div>
            </div>

            <div class="signin-field">
                <label for="signin-password">Password</label>
                <div class="signin-input-wrap">
                    <span class="signin-input-icon">🔑</span>
                    <input type="password" id="signin-password" placeholder="Enter your password" autocomplete="current-password">
                </div>
            </div>

            <div class="signin-forgot"><a href="#">Forgot password?</a></div>

            <!-- Submit -->
            <button class="signin-btn" id="signin-submit-btn">Sign In to VIT Shuttle</button>

            <!-- Divider -->
            <div class="signin-divider"><span>or continue with</span></div>

            <!-- Google -->
            <button class="signin-google-btn" id="signin-google-btn">
                <svg width="20" height="20" viewBox="0 0 18 18" style="flex-shrink:0">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
                </svg>
                <span>Continue with Google</span>
            </button>

            <!-- Footer -->
            <p class="signin-footer">Don't have an account? <a href="#" id="signin-signup-link">Sign up free</a></p>
        </div>
    `;
    document.body.appendChild(signinModal);

    function openSignin() { signinModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeSignin() { signinModal.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('signin-modal-close')?.addEventListener('click', closeSignin);
    signinModal.addEventListener('click', (e) => { if (e.target === signinModal) closeSignin(); });

    // Tab switching
    signinModal.querySelectorAll('.signin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            signinModal.querySelectorAll('.signin-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isAdmin = tab.dataset.tab === 'admin';
            document.getElementById('signin-email').placeholder = isAdmin ? 'admin@vit.ac.in' : 'yourname@vit.ac.in';
            document.getElementById('signin-desc').textContent = isAdmin
                ? 'Admin access restricted to @vit.ac.in institutional accounts.'
                : 'Sign in with your VIT credentials to access personalized features.';
        });
    });

    // Submit demo
    document.getElementById('signin-submit-btn')?.addEventListener('click', () => {
        const btn = document.getElementById('signin-submit-btn');
        btn.textContent = '✓ Signed In!';
        btn.style.background = 'linear-gradient(135deg, #39ff14, #00e5ff)';
        setTimeout(closeSignin, 1200);
    });

    // Keyboard close
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSignin(); });

    // Expose openSignin globally so nav buttons can call it
    window.openSigninModal = openSignin;

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
