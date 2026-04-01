/* home.js — VIT Shuttle Home Page (Clean & Simple) */
document.addEventListener('DOMContentLoaded', () => {

    // ── Animate stat counters on scroll ──────────────────
    const statEls = document.querySelectorAll('.stat-num[data-target]');
    if (statEls.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    window.animateCounter && window.animateCounter(el, target);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statEls.forEach(el => obs.observe(el));
    }

    // ── ETA live countdown on route strip ────────────────
    const etaTimes = [4, 7, 3, 5];
    const etaEls = document.querySelectorAll('.rss-eta strong');
    setInterval(() => {
        etaEls.forEach((el, i) => {
            etaTimes[i] = Math.max(1, etaTimes[i] - 1);
            if (etaTimes[i] <= 1) etaTimes[i] = 8 + Math.floor(Math.random() * 6);
            el.textContent = `${etaTimes[i]} min`;
        });
    }, 12000);

    // ── Preview Map ───────────────────────────────────────
    const mapEl = document.getElementById('preview-map');
    if (!mapEl || typeof L === 'undefined') return;

    const map = L.map('preview-map', {
        center: [12.9692, 79.1559],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        keyboard: false,
        doubleClickZoom: false,
        tap: false
    });

    // Satellite tile
    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20 }
    ).addTo(map);

    // Routes
    const routeData = [
        {
            color: '#2196f3',
            path: [
                [12.97160, 79.15950],[12.97108, 79.15855],[12.97040, 79.15680],
                [12.96988, 79.15605],[12.96945, 79.15566],[12.96900, 79.15555],
                [12.96920, 79.15472],[12.96925, 79.15440],[12.97000, 79.15440],
                [12.96980, 79.15310]
            ]
        },
        {
            color: '#1e9e52',
            path: [
                [12.97250, 79.16250],[12.97116, 79.15966],[12.97040, 79.15680],
                [12.96900, 79.15555],[12.96835, 79.15550],[12.96750, 79.15592],
                [12.96625, 79.15800]
            ]
        },
        {
            color: '#6a4fcf',
            path: [
                [12.96700, 79.15800],[12.96718, 79.15545],[12.96690, 79.15438],
                [12.96800, 79.15374],[12.96940, 79.15428],[12.97000, 79.15440]
            ]
        },
        {
            color: '#e07b00',
            path: [
                [12.96600, 79.15100],[12.96670, 79.15280],[12.96712, 79.15403],
                [12.96800, 79.15448],[12.96948, 79.15482],[12.97005, 79.15630]
            ]
        }
    ];

    routeData.forEach(r => {
        L.polyline(r.path, { color: r.color, weight: 4, opacity: 0.9, lineCap: 'round' }).addTo(map);
    });

    // Campus boundary
    L.polygon([
        [12.9740, 79.1490],[12.9740, 79.1640],
        [12.9645, 79.1640],[12.9645, 79.1490]
    ], {
        color: '#888', weight: 1.5, opacity: 0.4,
        fill: false, dashArray: '8 5'
    }).addTo(map);

    // Stop dots (simple white circles)
    const previewStops = [
        [12.9716, 79.1595, '#2196f3'],
        [12.9690, 79.1555, '#2196f3'],
        [12.9698, 79.1531, '#2196f3'],
        [12.9683, 79.1555, '#1e9e52'],
        [12.9725, 79.1625, '#1e9e52'],
        [12.9662, 79.1580, '#1e9e52'],
        [12.9669, 79.1544, '#6a4fcf'],
        [12.9700, 79.1580, '#6a4fcf'],
        [12.9700, 79.1563, '#e07b00'],
        [12.9660, 79.1510, '#e07b00'],
    ];
    previewStops.forEach(([lat, lng, color]) => {
        L.circleMarker([lat, lng], {
            radius: 6, fillColor: color, color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(map);
    });

    // Animated bus markers
    const busDots = routeData.map((r, i) => {
        const start = Math.floor(r.path.length * 0.3 * (i % 3));
        const m = L.circleMarker(r.path[start] || r.path[0], {
            radius: 9, fillColor: r.color, color: '#fff', weight: 2.5, fillOpacity: 1,
            zIndexOffset: 100
        }).addTo(map);
        return { m, path: r.path, progress: start, dir: 1 };
    });

    function animatePreview() {
        busDots.forEach(bd => {
            bd.progress += bd.dir * 0.05;
            if (bd.progress >= bd.path.length - 1) { bd.progress = bd.path.length - 2; bd.dir = -1; }
            if (bd.progress <= 0) { bd.progress = 0; bd.dir = 1; }
            const i0 = Math.floor(bd.progress);
            const i1 = Math.min(i0 + 1, bd.path.length - 1);
            const f = bd.progress - i0;
            bd.m.setLatLng([
                bd.path[i0][0] + (bd.path[i1][0] - bd.path[i0][0]) * f,
                bd.path[i0][1] + (bd.path[i1][1] - bd.path[i0][1]) * f
            ]);
        });
        requestAnimationFrame(animatePreview);
    }
    requestAnimationFrame(animatePreview);

    // Click goes to full map
    map.on('click', () => window.location.href = 'map.html');
    mapEl.title = 'Click to open Live Tracker';
    mapEl.style.cursor = 'pointer';
});
