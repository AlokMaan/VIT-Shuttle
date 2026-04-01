/* =========================================
   VIT Shuttle — Map Page JS (Clean v2)
   No scan animation. No AI terms.
   Focused on accuracy, usability.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // DATA: Campus stops with accurate VIT coordinates
    // ─────────────────────────────────────────────
    const STOPS = [
        { id: 'main-gate',     name: 'Main Gate',           pos: [12.97158, 79.15948], routes: ['alpha'], eta: 2, color: '#2196f3' },
        { id: 'sjt',           name: 'SJT Block',           pos: [12.97044, 79.15682], routes: ['alpha','bravo'], eta: 10, color: '#2196f3' },
        { id: 'tt',            name: 'TT Complex',          pos: [12.96925, 79.15442], routes: ['alpha'], eta: 8, color: '#2196f3' },
        { id: 'cs-block',      name: 'CS / CDL Block',      pos: [12.96990, 79.15555], routes: ['alpha'], eta: 5, color: '#2196f3' },
        { id: 'mens-hostel',   name: "Men's Hostel",        pos: [12.97252, 79.16248], routes: ['bravo'], eta: 7, color: '#1e9e52' },
        { id: 'library',       name: 'Library',             pos: [12.96835, 79.15550], routes: ['bravo','charlie'], eta: 12, color: '#1e9e52' },
        { id: 'ladies-hostel', name: 'Ladies Hostel',       pos: [12.96628, 79.15802], routes: ['bravo'], eta: 11, color: '#1e9e52' },
        { id: 'prp',           name: 'PRP Block',           pos: [12.96700, 79.15800], routes: ['charlie'], eta: 14, color: '#6a4fcf' },
        { id: 'foodys',        name: 'Foodys / GDN',        pos: [12.96719, 79.15545], routes: ['charlie'], eta: 9, color: '#6a4fcf' },
        { id: 'annex',         name: 'Annex Block',         pos: [12.96690, 79.15438], routes: ['alpha','charlie'], eta: 6, color: '#6a4fcf' },
        { id: 'gdn',           name: 'Greenos (GDN)',       pos: [12.96800, 79.15375], routes: ['charlie'], eta: 10, color: '#6a4fcf' },
        { id: 'admin',         name: 'Admin Block',         pos: [12.97005, 79.15628], routes: ['delta'], eta: 5, color: '#e07b00' },
        { id: 'indoor',        name: 'Indoor Stadium',      pos: [12.96948, 79.15483], routes: ['delta'], eta: 8, color: '#e07b00' },
        { id: 'outdoor',       name: 'Outdoor Stadium',     pos: [12.96600, 79.15100], routes: ['delta'], eta: 3, color: '#e07b00' },
    ];

    // ─────────────────────────────────────────────
    // DATA: Routes (accurate VIT paths)
    // ─────────────────────────────────────────────
    const ROUTES = {
        alpha: {
            name: 'Route Alpha',
            color: '#2196f3',
            stops: ['main-gate','sjt','cs-block','tt','annex'],
            path: [
                [12.97158, 79.15948],[12.97108, 79.15855],[12.97044, 79.15682],
                [12.97000, 79.15620],[12.96990, 79.15555],[12.96945, 79.15566],
                [12.96920, 79.15472],[12.96925, 79.15442],[12.96940, 79.15428],
                [12.96800, 79.15374],[12.96690, 79.15438]
            ]
        },
        bravo: {
            name: 'Route Bravo',
            color: '#1e9e52',
            stops: ['mens-hostel','sjt','library','ladies-hostel'],
            path: [
                [12.97252, 79.16248],[12.97116, 79.15966],[12.97044, 79.15682],
                [12.96988, 79.15605],[12.96900, 79.15555],[12.96835, 79.15550],
                [12.96750, 79.15592],[12.96690, 79.15650],[12.96628, 79.15802]
            ]
        },
        charlie: {
            name: 'Route Charlie',
            color: '#6a4fcf',
            stops: ['prp','library','foodys','annex','gdn'],
            path: [
                [12.96700, 79.15800],[12.96722, 79.15702],[12.96719, 79.15545],
                [12.96690, 79.15438],[12.96800, 79.15375],[12.96940, 79.15428],
                [12.97000, 79.15440]
            ]
        },
        delta: {
            name: 'Route Delta',
            color: '#e07b00',
            stops: ['outdoor','indoor','admin'],
            path: [
                [12.96600, 79.15100],[12.96670, 79.15280],[12.96712, 79.15403],
                [12.96800, 79.15448],[12.96948, 79.15483],[12.97005, 79.15628]
            ]
        }
    };

    // ─────────────────────────────────────────────
    // DATA: Buses (each runs one route)
    // ─────────────────────────────────────────────
    const BUSES = [
        { id: 'VIT-BUS-01', driver: 'Rajesh Kumar',  avatar: '🧑‍✈️', rating: 4.9, route: 'alpha',   capacity: 40, occupied: 26, speed: 22, progress: 0.15, dir: 1 },
        { id: 'VIT-BUS-07', driver: 'Suresh Babu',   avatar: '👨‍✈️', rating: 4.8, route: 'bravo',   capacity: 40, occupied: 32, speed: 18, progress: 0.40, dir: 1 },
        { id: 'VIT-BUS-12', driver: 'Murugan P.',    avatar: '🧑‍✈️', rating: 4.7, route: 'charlie', capacity: 40, occupied: 18, speed: 20, progress: 0.60, dir: 1 },
        { id: 'VIT-BUS-04', driver: 'Karthik S.',    avatar: '👨‍✈️', rating: 5.0, route: 'delta',   capacity: 40, occupied: 12, speed: 15, progress: 0.20, dir: 1 },
    ];

    // ─────────────────────────────────────────────
    // MAP INIT
    // ─────────────────────────────────────────────
    const map = L.map('main-map', {
        center: [12.9692, 79.1559],
        zoom: 17,
        zoomControl: true,
        attributionControl: true
    });
    map.zoomControl.setPosition('bottomright');

    // Tile layers
    const LAYERS = {
        satellite: L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: '© Esri Satellite', maxZoom: 20 }
        ),
        street: L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '© OpenStreetMap', maxZoom: 20 }
        ),
        dark: L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            { attribution: '© Carto', maxZoom: 20 }
        )
    };
    let currentLayer = 'satellite';
    LAYERS.satellite.addTo(map);

    // Layer names display
    const layerNames = { satellite: 'Satellite', street: 'Street Map', dark: 'Dark Mode' };
    const layerIcons = { satellite: 'satellite_alt', street: 'map', dark: 'dark_mode' };
    const layerOrder = ['satellite', 'street', 'dark'];

    function switchLayer() {
        const idx = layerOrder.indexOf(currentLayer);
        const next = layerOrder[(idx + 1) % layerOrder.length];
        LAYERS[currentLayer].removeFrom(map);
        LAYERS[next].addTo(map);
        currentLayer = next;
        document.getElementById('layer-name').textContent = layerNames[next];
        document.querySelector('#layer-indicator .material-symbols-outlined').textContent = layerIcons[next];
    }
    document.getElementById('layer-toggle-btn')?.addEventListener('click', switchLayer);
    document.getElementById('layer-indicator')?.addEventListener('click', switchLayer);

    // Campus boundary
    L.polygon([
        [12.9742, 79.1488],[12.9742, 79.1640],
        [12.9643, 79.1640],[12.9643, 79.1488]
    ], {
        color: '#1d72c8', weight: 1.5, opacity: 0.3,
        fill: false, dashArray: '10 6'
    }).addTo(map).bindTooltip('VIT Vellore Campus Boundary', { sticky: true });

    // ─────────────────────────────────────────────
    // DRAW ROUTES
    // ─────────────────────────────────────────────
    const routePolylines = {};
    let activeRouteFilter = 'all';

    Object.entries(ROUTES).forEach(([key, r]) => {
        // Shadow / outer line
        L.polyline(r.path, { color: 'white', weight: 6, opacity: 0.6, lineCap: 'round' }).addTo(map);
        // Colored route line
        const pl = L.polyline(r.path, {
            color: r.color, weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round'
        }).addTo(map);
        pl.bindTooltip(`<strong>${r.name}</strong><br>Click to filter`, { sticky: true });
        pl.on('click', () => filterByRoute(key));
        routePolylines[key] = pl;
    });

    // ─────────────────────────────────────────────
    // STOP MARKERS
    // ─────────────────────────────────────────────
    const stopMarkers = {};

    function makeStopIcon(stop, highlight = false) {
        return L.divIcon({
            className: '',
            html: `<div style="
                width:${highlight ? 16 : 12}px;
                height:${highlight ? 16 : 12}px;
                border-radius:50%;
                background:${stop.color};
                border:${highlight ? 3 : 2}px solid white;
                box-shadow:${highlight ? '0 0 0 2px '+stop.color+', 0 2px 6px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.2)'};
                transition:all 0.2s;
            "></div>`,
            iconSize: [highlight ? 16 : 12, highlight ? 16 : 12],
            iconAnchor: [highlight ? 8 : 6, highlight ? 8 : 6]
        });
    }

    STOPS.forEach(stop => {
        const marker = L.marker(stop.pos, { icon: makeStopIcon(stop), zIndexOffset: 50 })
            .addTo(map)
            .bindPopup(
                `<div style="min-width:180px">
                    <div style="font-weight:700;font-size:0.92rem;margin-bottom:6px">${stop.name}</div>
                    <div style="font-size:0.75rem;color:#768aaa;margin-bottom:8px">
                        Routes: ${stop.routes.map(r => ROUTES[r].name).join(', ')}
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f4f6fa;border-radius:7px;font-size:0.8rem;font-weight:600;color:#1d72c8;margin-bottom:4px;">
                        🕒 Next bus in <span style="font-weight:800;margin-left:4px">${stop.eta} min</span>
                    </div>
                </div>`
            );
        marker.on('click', () => highlightStopInSidebar(stop.id));
        stopMarkers[stop.id] = marker;
    });

    // ─────────────────────────────────────────────
    // BUS MARKERS
    // ─────────────────────────────────────────────
    const busMarkers = {};

    function makeBusIcon(bus, highlight = false) {
        const c = ROUTES[bus.route].color;
        const occ = Math.round((bus.occupied / bus.capacity) * 100);
        return L.divIcon({
            className: '',
            html: `<div style="
                position:relative;
                width:${highlight ? 44 : 38}px;
                height:${highlight ? 44 : 38}px;
            ">
                <div style="
                    width:100%;height:100%;
                    border-radius:50%;
                    background:${c};
                    border:${highlight ? 3 : 2.5}px solid white;
                    box-shadow:0 2px 8px rgba(0,0,0,0.22);
                    display:flex;align-items:center;justify-content:center;
                    font-size:${highlight ? 1.35 : 1.1}rem;
                ">${bus.avatar}</div>
                <div style="
                    position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
                    background:${c};color:white;
                    font-size:0.52rem;font-weight:800;padding:1px 5px;
                    border-radius:20px;border:1.5px solid white;white-space:nowrap;
                    font-family:Inter,sans-serif;
                ">${bus.id.replace('VIT-','')}</div>
            </div>`,
            iconSize: [highlight ? 44 : 38, highlight ? 44 : 38],
            iconAnchor: [highlight ? 22 : 19, highlight ? 22 : 19]
        });
    }

    BUSES.forEach(bus => {
        const route = ROUTES[bus.route];
        const startPt = route.path[0];
        const marker = L.marker(startPt, {
            icon: makeBusIcon(bus),
            zIndexOffset: 200
        }).addTo(map);

        const occ = Math.round((bus.occupied / bus.capacity) * 100);
        marker.bindPopup(`
            <div style="min-width:200px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                    <span style="font-size:1.5rem">${bus.avatar}</span>
                    <div>
                        <div style="font-weight:700;font-size:0.9rem">${bus.driver}</div>
                        <div style="font-size:0.72rem;color:#768aaa">${bus.id}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.76rem">
                    <div style="background:#f4f6fa;padding:6px;border-radius:7px">
                        <div style="font-weight:700;font-size:0.88rem;color:#1a2233">${bus.speed} km/h</div>
                        <div style="color:#768aaa">Speed</div>
                    </div>
                    <div style="background:#f4f6fa;padding:6px;border-radius:7px">
                        <div style="font-weight:700;font-size:0.88rem;color:#1a2233">${occ}%</div>
                        <div style="color:#768aaa">Occupancy</div>
                    </div>
                    <div style="background:#f4f6fa;padding:6px;border-radius:7px">
                        <div style="font-weight:700;font-size:0.88rem;color:${ROUTES[bus.route].color}">${route.name}</div>
                        <div style="color:#768aaa">Route</div>
                    </div>
                    <div style="background:#f4f6fa;padding:6px;border-radius:7px">
                        <div style="font-weight:700;font-size:0.88rem;color:#1a2233">⭐ ${bus.rating}</div>
                        <div style="color:#768aaa">Rating</div>
                    </div>
                </div>
            </div>
        `);

        busMarkers[bus.id] = { marker, bus };
    });

    // ─────────────────────────────────────────────
    // BUS ANIMATION (smooth interpolation)
    // ─────────────────────────────────────────────
    let animSpeed = 1.0;
    const ANIM_STEP = 0.008;

    function animateBuses() {
        BUSES.forEach(bus => {
            const route = ROUTES[bus.route];
            const path  = route.path;

            bus.progress += bus.dir * ANIM_STEP * animSpeed;
            if (bus.progress >= path.length - 1) { bus.progress = path.length - 2; bus.dir = -1; }
            if (bus.progress <= 0) { bus.progress = 0; bus.dir = 1; }

            const i0 = Math.floor(bus.progress);
            const i1 = Math.min(i0 + 1, path.length - 1);
            const f  = bus.progress - i0;
            const lat = path[i0][0] + (path[i1][0] - path[i0][0]) * f;
            const lng = path[i0][1] + (path[i1][1] - path[i0][1]) * f;
            busMarkers[bus.id].marker.setLatLng([lat, lng]);
        });
        requestAnimationFrame(animateBuses);
    }
    requestAnimationFrame(animateBuses);

    // ─────────────────────────────────────────────
    // ROUTE FILTER BUTTONS
    // ─────────────────────────────────────────────
    function filterByRoute(key) {
        activeRouteFilter = key;
        document.querySelectorAll('.route-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.route === key);
        });
        // Show/hide route lines
        Object.entries(routePolylines).forEach(([r, pl]) => {
            if (key === 'all' || r === key) pl.addTo(map);
            else map.removeLayer(pl);
        });
        // Show/hide bus markers
        BUSES.forEach(bus => {
            const m = busMarkers[bus.id].marker;
            if (key === 'all' || bus.route === key) m.addTo(map);
            else map.removeLayer(m);
        });
        // Show/hide stop markers
        STOPS.forEach(stop => {
            const m = stopMarkers[stop.id];
            if (key === 'all' || stop.routes.includes(key)) m.addTo(map);
            else map.removeLayer(m);
        });
    }

    document.querySelectorAll('.route-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterByRoute(btn.dataset.route));
    });

    // ─────────────────────────────────────────────
    // STOP SEARCH
    // ─────────────────────────────────────────────
    const searchInput   = document.getElementById('stop-search');
    const searchResults = document.getElementById('search-results');
    const searchClear   = document.getElementById('search-clear');

    searchInput?.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        searchClear?.classList.toggle('show', q.length > 0);
        if (!q) { searchResults.classList.remove('visible'); return; }

        const matches = STOPS.filter(s => s.name.toLowerCase().includes(q));
        if (!matches.length) {
            searchResults.innerHTML = '<div class="search-no-results">No stops found</div>';
            searchResults.classList.add('visible');
            return;
        }
        searchResults.innerHTML = matches.map(s => `
            <div class="search-result-item" data-id="${s.id}">
                <div class="sr-dot" style="background:${s.color}"></div>
                <div class="sr-name">${s.name}</div>
                <div class="sr-routes">
                    ${s.routes.map(r => `<span class="route-tag" style="background:#f4f6fa;color:${ROUTES[r].color};font-size:0.65rem;padding:1px 6px;border-radius:4px;font-weight:700">${ROUTES[r].name.split(' ')[1]}</span>`).join('')}
                </div>
                <div class="sr-eta">${s.eta}min</div>
            </div>
        `).join('');
        searchResults.classList.add('visible');

        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const stop = STOPS.find(s => s.id === item.dataset.id);
                if (!stop) return;
                map.flyTo(stop.pos, 18, { animate: true, duration: 1 });
                stopMarkers[stop.id].openPopup();
                highlightStopInSidebar(stop.id);
                searchResults.classList.remove('visible');
                searchInput.value = stop.name;
            });
        });
    });

    searchClear?.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.classList.remove('visible');
        searchClear.classList.remove('show');
        searchInput.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.map-search-bar')) {
            searchResults.classList.remove('visible');
        }
    });

    // ─────────────────────────────────────────────
    // SIDEBAR TOGGLE
    // ─────────────────────────────────────────────
    const sidebar = document.getElementById('map-sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Highlight stop in sidebar
    function highlightStopInSidebar(id) {
        document.querySelectorAll('.stop-card').forEach(c => {
            c.classList.toggle('highlighted', c.dataset.stop === id);
        });
        const card = document.querySelector(`.stop-card[data-stop="${id}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Stop card clicks
    document.querySelectorAll('.stop-card').forEach(card => {
        card.addEventListener('click', () => {
            const stop = STOPS.find(s => s.id === card.dataset.stop);
            if (!stop) return;
            map.flyTo(stop.pos, 18, { animate: true, duration: 1 });
            stopMarkers[stop.id].openPopup();
            highlightStopInSidebar(stop.id);
        });
    });

    // ─────────────────────────────────────────────
    // TRACK BUS (bus cards → detail panel)
    // ─────────────────────────────────────────────
    const detailPanel = document.getElementById('bus-detail-panel');
    const bdpContent  = document.getElementById('bdp-content');
    let trackingBusId = null;

    function openBusDetail(busId) {
        const bus = BUSES.find(b => b.id === busId);
        if (!bus) return;
        const route = ROUTES[bus.route];
        const occ   = Math.round((bus.occupied / bus.capacity) * 100);
        const occColor = occ >= 75 ? '#e07b00' : occ >= 50 ? '#1d72c8' : '#1e9e52';

        bdpContent.innerHTML = `
            <div class="bdp-driver-row">
                <div class="bdp-avatar">${bus.avatar}</div>
                <div>
                    <div class="bdp-name">${bus.driver}</div>
                    <div class="bdp-sub">${bus.id} · <span style="color:${route.color};font-weight:700">${route.name}</span></div>
                    <div class="bdp-stars">${'⭐'.repeat(Math.floor(bus.rating))} ${bus.rating}</div>
                </div>
            </div>
            <div class="bdp-stats">
                <div class="bdp-stat">
                    <span class="bdp-stat-val">${bus.speed}</span>
                    <span class="bdp-stat-lbl">km/h</span>
                </div>
                <div class="bdp-stat">
                    <span class="bdp-stat-val" style="color:${occColor}">${occ}%</span>
                    <span class="bdp-stat-lbl">Full</span>
                </div>
                <div class="bdp-stat">
                    <span class="bdp-stat-val">${bus.occupied}</span>
                    <span class="bdp-stat-lbl">Passengers</span>
                </div>
            </div>
            <div class="bdp-route-info">
                🗺️ Stops: ${route.stops.map(id => STOPS.find(s => s.id === id)?.name || id).join(' → ')}
            </div>
        `;

        detailPanel.classList.add('open');
        trackingBusId = busId;

        // Restyle bus marker
        BUSES.forEach(b => {
            busMarkers[b.id].marker.setIcon(makeBusIcon(b, b.id === busId));
        });

        // Highlight sidebar card
        document.querySelectorAll('.bus-card').forEach(c => {
            c.classList.toggle('tracking', c.dataset.bus === busId);
        });

        // Fly to current bus position
        const m = busMarkers[busId].marker;
        map.flyTo(m.getLatLng(), 18, { animate: true, duration: 1 });
    }

    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card  = btn.closest('.bus-card');
            const busId = card?.dataset.bus;
            if (busId === trackingBusId && detailPanel.classList.contains('open')) {
                closeDetail();
            } else {
                openBusDetail(busId);
            }
        });
    });

    document.querySelectorAll('.bus-card').forEach(card => {
        card.addEventListener('click', () => openBusDetail(card.dataset.bus));
    });

    function closeDetail() {
        detailPanel.classList.remove('open');
        trackingBusId = null;
        document.querySelectorAll('.bus-card').forEach(c => c.classList.remove('tracking'));
        BUSES.forEach(b => busMarkers[b.id].marker.setIcon(makeBusIcon(b, false)));
    }
    document.getElementById('bdp-close')?.addEventListener('click', closeDetail);

    // ─────────────────────────────────────────────
    // ETA COUNTDOWN
    // ─────────────────────────────────────────────
    const etaTimes = { alpha: 4, bravo: 7, charlie: 3, delta: 5 };
    function updateETAs() {
        Object.keys(etaTimes).forEach(k => {
            etaTimes[k] = Math.max(1, etaTimes[k] - 1);
            if (etaTimes[k] <= 1) etaTimes[k] = 5 + Math.floor(Math.random() * 8);
            const el = document.getElementById(`eta-${k}`);
            if (el) el.innerHTML = `${etaTimes[k]}<small>m</small>`;
        });
    }
    setInterval(updateETAs, 10000);

    // Live coordinates display on map move
    map.on('mousemove', (e) => {
        const coordEl = document.querySelector('.coords');
        if (coordEl) {
            coordEl.textContent = `${e.latlng.lat.toFixed(4)}°N ${e.latlng.lng.toFixed(4)}°E`;
        }
    });

});
