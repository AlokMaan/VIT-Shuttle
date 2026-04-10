import { useEffect, useRef, useState } from 'react';

const VIT_CENTER = [12.9692, 79.1559];

// Realistic road-based routes with building stops
const ROUTES = [
  {
    id: 'Alpha', color: '#0d9488',
    shuttles: [
      { id: 'VIT-001', speed: 0.6 },
      { id: 'VIT-009', speed: 0.45 },
    ],
    path: [
      [12.9732, 79.1540], // Main Gate
      [12.9725, 79.1545],
      [12.9718, 79.1550],
      [12.9710, 79.1555], // SJT Block
      [12.9703, 79.1558],
      [12.9695, 79.1562],
      [12.9688, 79.1565], // TT Complex
      [12.9680, 79.1560],
      [12.9672, 79.1555],
      [12.9665, 79.1548], // Hostel Zone
      [12.9660, 79.1540],
      [12.9665, 79.1530],
      [12.9672, 79.1525],
      [12.9680, 79.1528],
      [12.9690, 79.1532],
      [12.9700, 79.1535],
      [12.9715, 79.1537],
      [12.9732, 79.1540], // back to Main Gate
    ],
    stops: [
      { name: 'Main Gate', pos: [12.9732, 79.1540] },
      { name: 'SJT Block', pos: [12.9710, 79.1555] },
      { name: 'TT Complex', pos: [12.9688, 79.1565] },
      { name: 'Hostel Zone', pos: [12.9665, 79.1548] },
    ],
  },
  {
    id: 'Beta', color: '#059669',
    shuttles: [
      { id: 'VIT-003', speed: 0.55 },
    ],
    path: [
      [12.9695, 79.1520], // Library
      [12.9690, 79.1530],
      [12.9685, 79.1540],
      [12.9680, 79.1550],
      [12.9675, 79.1560], // Academic Block
      [12.9672, 79.1570],
      [12.9670, 79.1580], // Food Court
      [12.9675, 79.1575],
      [12.9682, 79.1565],
      [12.9688, 79.1555],
      [12.9692, 79.1540],
      [12.9695, 79.1520], // back to Library
    ],
    stops: [
      { name: 'Library', pos: [12.9695, 79.1520] },
      { name: 'Academic Block', pos: [12.9675, 79.1560] },
      { name: 'Food Court', pos: [12.9670, 79.1580] },
    ],
  },
  {
    id: 'Charlie', color: '#d97706',
    shuttles: [
      { id: 'VIT-007', speed: 0.5 },
    ],
    path: [
      [12.9715, 79.1580], // VIT Gate 2
      [12.9708, 79.1575],
      [12.9700, 79.1570],
      [12.9693, 79.1575], // Gym Complex
      [12.9685, 79.1580],
      [12.9678, 79.1585],
      [12.9672, 79.1590], // Admin Block
      [12.9678, 79.1595],
      [12.9685, 79.1598],
      [12.9695, 79.1595],
      [12.9705, 79.1590],
      [12.9715, 79.1580], // back
    ],
    stops: [
      { name: 'VIT Gate 2', pos: [12.9715, 79.1580] },
      { name: 'Gym Complex', pos: [12.9693, 79.1575] },
      { name: 'Admin Block', pos: [12.9672, 79.1590] },
    ],
  },
];

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export default function LiveMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const animRef = useRef(null);
  const progressRef = useRef({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(window.L); return; }
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = () => resolve(window.L);
      document.head.appendChild(s);
    });

    loadLeaflet().then((L) => {
      if (mapInstance.current) return;
      const map = L.map(mapRef.current, { zoomControl: false }).setView(VIT_CENTER, 16);
      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // Campus boundary
      L.circle(VIT_CENTER, { radius: 1200, color: '#0d9488', fillColor: '#0d9488', fillOpacity: 0.03, weight: 1, dashArray: '6 4' }).addTo(map);

      // Draw routes & stops
      ROUTES.forEach(route => {
        L.polyline(route.path, { color: route.color, weight: 3, opacity: 0.5, dashArray: '8 6' }).addTo(map);
        route.stops.forEach(stop => {
          L.circleMarker(stop.pos, { radius: 5, color: route.color, fillColor: '#fff', fillOpacity: 1, weight: 2 })
            .addTo(map)
            .bindTooltip(stop.name, { permanent: false, direction: 'top', className: '' });
        });
      });

      // Create shuttle markers
      ROUTES.forEach(route => {
        route.shuttles.forEach((shuttle, si) => {
          const icon = L.divIcon({
            className: '',
            html: `<div style="background:${route.color};color:#fff;padding:3px 8px;border-radius:16px;font-size:11px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;gap:3px;border:2px solid #fff"><span style="font-size:13px" class="material-symbols-outlined">directions_bus</span>${shuttle.id}</div>`,
            iconSize: [100, 28],
            iconAnchor: [50, 14],
          });
          const marker = L.marker(route.path[0], { icon, zIndexOffset: 1000 }).addTo(map)
            .bindPopup(`<b>${shuttle.id}</b><br>Route: ${route.id}<br><span style="color:${route.color};font-weight:700">● Active</span>`);
          markersRef.current[shuttle.id] = marker;
          progressRef.current[shuttle.id] = { route, segIdx: Math.floor(si * route.path.length / route.shuttles.length), t: 0, speed: shuttle.speed };
        });
      });

      mapInstance.current = map;
      setLoaded(true);
      setTimeout(() => map.invalidateSize(), 200);

      // Animation loop
      const animate = () => {
        Object.entries(progressRef.current).forEach(([id, state]) => {
          const { route, speed } = state;
          state.t += speed * 0.015;
          if (state.t >= 1) {
            state.t = 0;
            state.segIdx = (state.segIdx + 1) % (route.path.length - 1);
          }
          const from = route.path[state.segIdx];
          const to = route.path[state.segIdx + 1] || route.path[0];
          const pos = lerp(from, to, state.t);
          markersRef.current[id]?.setLatLng(pos);
        });
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">map</span> Live Tracking
          <span className="live-chip" style={{ marginLeft: '.5rem' }}><span className="live-dot" /> LIVE</span>
        </div>
        <h1>Live Map</h1>
        <p>Real-time shuttle tracking with simulated movement</p>
      </div>

      <div className="grid-main-side">
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 500 }}>
          <div ref={mapRef} style={{ width: '100%', height: 500 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Route legend */}
          <div className="card">
            <div className="card-title"><span className="material-symbols-outlined">route</span>Routes</div>
            {ROUTES.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.82rem' }}>Route {r.id}</div>
                  <div style={{ fontSize: '.68rem', color: 'var(--text-3)' }}>{r.stops.map(s => s.name).join(' → ')}</div>
                </div>
                <span className="badge badge-green" style={{ fontSize: '.62rem' }}>{r.shuttles.length} bus</span>
              </div>
            ))}
          </div>

          {/* Active shuttles */}
          <div className="card">
            <div className="card-title"><span className="material-symbols-outlined">directions_bus</span>Active Fleet</div>
            {ROUTES.flatMap(r => r.shuttles.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.45rem 0', borderBottom: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: ROUTES.find(x => x.shuttles.includes(s))?.color }}>directions_bus</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.8rem' }}>{s.id}</div>
                  <div style={{ fontSize: '.66rem', color: 'var(--text-3)' }}>Route {ROUTES.find(x => x.shuttles.includes(s))?.id}</div>
                </div>
                <span className="status-pill active">moving</span>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}
