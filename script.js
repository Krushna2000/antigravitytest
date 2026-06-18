document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => setTimeout(() => preloader.classList.add('loaded'), 1200));
    setTimeout(() => preloader.classList.add('loaded'), 3500);

    createParticles();
    initNavigation();
    initCountdown();
    initScrollAnimations();
    initLightbox();
    initBlessingsForm();
    initMusicToggle();
});

function createParticles() {
    const c = document.getElementById('hero-particles');
    if (!c) return;
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = 2 + Math.random() * 3;
        Object.assign(p.style, {
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 8 + 's',
            animationDuration: (6 + Math.random() * 6) + 's',
            width: s + 'px', height: s + 'px',
            background: `hsl(${38 + Math.random() * 15}, ${65 + Math.random() * 25}%, ${58 + Math.random() * 18}%)`
        });
        c.appendChild(p);
    }
}

function initNavigation() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = navLinks.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
        const scrollPos = window.scrollY + 150;
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop, h = section.offsetHeight, id = section.id;
            if (scrollPos >= top && scrollPos < top + h) {
                links.forEach(l => l.classList.remove('active'));
                const a = navLinks.querySelector(`a[href="#${id}"]`);
                if (a) a.classList.add('active');
            }
        });
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    links.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    }));
}

function initCountdown() {
    const target = new Date('June 27, 2026 18:00:00').getTime();
    const els = ['days','hours','minutes','seconds'].map(id => document.getElementById(id));

    function update() {
        const d = target - Date.now();
        if (d <= 0) { els.forEach(e => e.textContent = '00'); return; }
        const v = [
            Math.floor(d / 864e5),
            Math.floor((d % 864e5) / 36e5),
            Math.floor((d % 36e5) / 6e4),
            Math.floor((d % 6e4) / 1e3)
        ];
        els.forEach((e, i) => e.textContent = String(v[i]).padStart(2, '0'));
    }
    update();
    setInterval(update, 1000);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animated'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.gallery-item:not(.gallery-item-reel)').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.remove('hidden');
                requestAnimationFrame(() => lightbox.classList.add('show'));
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function close() {
        lightbox.classList.remove('show');
        setTimeout(() => { lightbox.classList.add('hidden'); document.body.style.overflow = ''; }, 400);
    }

    document.getElementById('lightbox-close').addEventListener('click', e => { e.stopPropagation(); close(); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) close(); });
}

function initBlessingsForm() {
    const form = document.getElementById('blessings-form');
    const grid = document.getElementById('blessings-grid');
    const emptyState = document.getElementById('blessings-empty');
    const countEl = document.getElementById('blessings-count');
    const toast = document.getElementById('form-toast');
    const submitBtn = document.getElementById('blessing-submit');

    let blessings = (() => {
        try {
            const s = localStorage.getItem('shivani_vaishnav_blessings');
            return s ? JSON.parse(s) : [];
        } catch { return []; }
    })();

    function save() {
        try { localStorage.setItem('shivani_vaishnav_blessings', JSON.stringify(blessings)); } catch {}
    }

    function esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

    function timeAgo(ts) {
        const s = Math.floor((Date.now() - new Date(ts)) / 1000);
        if (s < 5) return 'Just now';
        if (s < 60) return s + 's ago';
        const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
        const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
        const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
        return Math.floor(d / 30) + 'mo ago';
    }

    function render() {
        grid.innerHTML = '';
        if (!blessings.length) { emptyState.classList.remove('hidden'); countEl.textContent = '(0)'; return; }
        emptyState.classList.add('hidden');
        countEl.textContent = `(${blessings.length})`;
        blessings.forEach((b, i) => {
            const card = document.createElement('div');
            card.className = 'blessing-card';
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <div class="blessing-card-header">
                    <div class="blessing-avatar avatar-color-${b.name.length % 8}">${b.name.charAt(0).toUpperCase()}</div>
                    <div class="blessing-meta">
                        <div class="blessing-name">${esc(b.name)}</div>
                        <div class="blessing-relation">${esc(b.relation)}</div>
                    </div>
                </div>
                <p class="blessing-message">"${esc(b.message)}"</p>
                <div class="blessing-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    ${timeAgo(b.timestamp)}
                </div>`;
            grid.appendChild(card);
        });
    }

    render();

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('blessing-name').value.trim();
        const relation = document.getElementById('blessing-relation').value;
        const message = document.getElementById('blessing-message').value.trim();
        if (!name || !relation || !message) return;

        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        btnText.classList.add('hidden'); btnIcon.classList.add('hidden');
        btnLoader.classList.remove('hidden'); submitBtn.disabled = true;

        setTimeout(() => {
            blessings.unshift({ id: Date.now(), name, relation, message, timestamp: new Date().toISOString() });
            save(); render(); form.reset();
            btnText.classList.remove('hidden'); btnIcon.classList.remove('hidden');
            btnLoader.classList.add('hidden'); submitBtn.disabled = false;

            toast.classList.remove('hidden');
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.classList.add('hidden'), 500); }, 3500);

            const first = grid.querySelector('.blessing-card');
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
    });
}

function initMusicToggle() {
    const btn = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');
    const audio = document.getElementById('wedding-music');
    let playing = false, auto = false;

    audio.volume = 0.35;

    function play() {
        audio.play().then(() => {
            playing = true;
            iconOn.classList.remove('hidden'); iconOff.classList.add('hidden');
            btn.style.animation = 'pulse 1.5s ease-in-out infinite';
        }).catch(() => {});
    }

    function pause() {
        audio.pause(); playing = false;
        iconOn.classList.add('hidden'); iconOff.classList.remove('hidden');
        btn.style.animation = 'none';
    }

    function autoPlay() {
        if (!auto) { auto = true; play(); ['click','touchstart','scroll'].forEach(e => document.removeEventListener(e, autoPlay)); }
    }

    ['click','touchstart','scroll'].forEach(e => document.addEventListener(e, autoPlay));

    btn.addEventListener('click', e => {
        e.stopPropagation(); auto = true;
        playing ? pause() : play();
    });
}

const _s = document.createElement('style');
_s.textContent = '@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,168,83,.4)}50%{box-shadow:0 0 0 12px rgba(212,168,83,0)}}';
document.head.appendChild(_s);
