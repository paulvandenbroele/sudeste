/* Sudeste Asiático · Planificador Interactivo */
(function () {
  'use strict';

  const STORAGE_KEY = 'sea_trip_planner_v1';
  const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // App state
  const state = {
    activeTab: 'routes',
    selectedTripForTimeline: 'tom_vero',
    visibleLayers: {
      tom_vero: true,
      juani_cande: false,
      cande_diego: true,
      my_trip: true
    },
    mapFilter: 'all', // all | hub | beach | culture
    mapStyle: 'topo', // topo | osm | satellite
    inspectedDestId: null,
    highlightedHubs: [],
    flightSim: {
      month: 4, // Fines de Marzo / Abril (1-12)
      totalDays: 23,
      interests: new Set(['beach', 'bali', 'cities'])
    },
    hotelFilter: {
      city: 'ALL',
      maxPrice: 400,
      onlyChosen: false,
      query: ''
    },
    myTrip: loadMyTrip()
  };

  function loadMyTrip() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.stops)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return {
      style: 'mid', // eco | mid | luxury
      stops: [
        { destId: 'singapore', nights: 2 },
        { destId: 'ubud', nights: 4 },
        { destId: 'gili_air', nights: 3 },
        { destId: 'hanoi', nights: 3 },
        { destId: 'halong_bay', nights: 1 },
        { destId: 'phi_phi', nights: 3 },
        { destId: 'koh_lipe', nights: 3 },
        { destId: 'bangkok', nights: 3 }
      ]
    };
  }

  function saveMyTrip() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.myTrip));
    } catch (e) { /* ignore */ }
    updateMyTripBadge();
  }

  // ==================== MAP SETUP ====================
  const map = L.map('map', {
    center: [9.5, 104.5],
    zoom: 5,
    minZoom: 3,
    maxZoom: 14,
    zoomControl: true
  });

  const tiles = {
    topo: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 18
    }),
    osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }),
    satellite: L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Imagery &copy; Esri',
        maxZoom: 18
      }),
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      })
    ])
  };
  tiles.topo.addTo(map);

  const routeLayerGroup = L.layerGroup().addTo(map);
  const catalogLayerGroup = L.layerGroup().addTo(map);
  const hubHighlightGroup = L.layerGroup().addTo(map);

  // Curved arc generator between two lat/lng points for flights
  function buildCurvedArc(from, to, bend = 0.16) {
    const lat1 = from[0], lng1 = from[1];
    const lat2 = to[0], lng2 = to[1];
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    // Perpendicular offset for gentle curve
    const ctrlLat = midLat - dLng * bend;
    const ctrlLng = midLng + dLat * bend;
    const pts = [];
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
      const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
      pts.push([lat, lng]);
    }
    return pts;
  }

  // Infer leg mode between two consecutive destinations for My Trip
  function inferTransportMode(fromId, toId) {
    const ferryPairs = [
      ['ubud', 'gili_air'], ['ubud', 'nusa_penida'], ['gili_air', 'nusa_penida'],
      ['krabi', 'phi_phi'], ['phi_phi', 'koh_lipe'], ['phi_phi', 'phuket'],
      ['krabi', 'phuket'], ['langkawi', 'koh_lipe'], ['krabi', 'koh_lipe']
    ];
    const landPairs = [
      ['hanoi', 'halong_bay'], ['bangkok', 'kanchanaburi'], ['luang_prabang', 'nong_khiaw']
    ];
    const match = (pairs) => pairs.some(([a, b]) => (a === fromId && b === toId) || (a === toId && b === fromId));
    if (match(ferryPairs)) return 'ferry';
    if (match(landPairs)) return 'land';
    return 'flight';
  }

  // Slight deterministic offset per trip layer so overlapping pins at shared cities stay distinct
  const LAYER_OFFSETS = {
    tom_vero: [0.11, -0.11],
    juani_cande: [-0.11, -0.11],
    cande_diego: [0.11, 0.11],
    my_trip: [-0.11, 0.14]
  };

  function renderMap() {
    routeLayerGroup.clearLayers();
    catalogLayerGroup.clearLayers();
    hubHighlightGroup.clearLayers();

    const activeDestIds = new Set();

    // Helper to draw a trip route
    function drawTrip(tripId, color, stops, labelPrefix) {
      const off = LAYER_OFFSETS[tripId] || [0, 0];
      const scaleOff = map.getZoom() >= 7 ? 0.3 : 1.0;

      stops.forEach((st, idx) => {
        const dest = DESTINATIONS[st.destId];
        if (!dest) return;
        activeDestIds.add(st.destId);

        const pos = [dest.lat + off[0] * scaleOff, dest.lng + off[1] * scaleOff];

        // Segment to next stop
        if (idx < stops.length - 1) {
          const nextSt = stops[idx + 1];
          const nextDest = DESTINATIONS[nextSt.destId];
          if (nextDest) {
            const nextPos = [nextDest.lat + off[0] * scaleOff, nextDest.lng + off[1] * scaleOff];
            const mode = st.nextLeg ? st.nextLeg.mode : inferTransportMode(st.destId, nextSt.destId);
            let pts, style;
            if (mode === 'flight') {
              const bend = tripId === 'juani_cande' ? -0.15 : (tripId === 'cande_diego' ? 0.18 : 0.13);
              pts = buildCurvedArc(pos, nextPos, bend);
              style = { color, weight: tripId === 'my_trip' ? 3.5 : 2.6, opacity: 0.85 };
            } else if (mode === 'ferry') {
              pts = buildCurvedArc(pos, nextPos, 0.08);
              style = { color, weight: 2.6, opacity: 0.9, dashArray: '6, 6' };
            } else {
              pts = [pos, nextPos];
              style = { color, weight: 2.8, opacity: 0.9, dashArray: '2, 6' };
            }

            const poly = L.polyline(pts, style);
            const modeLabel = mode === 'flight' ? '✈️ Vuelo' : (mode === 'ferry' ? '⛴️ Ferry' : '🚗 Terrestre');
            const detail = st.nextLeg ? st.nextLeg.detail : `${dest.name} → ${nextDest.name}`;
            const costStr = st.nextLeg && st.nextLeg.costUsd ? ` · USD ${st.nextLeg.costUsd}` : '';
            poly.bindTooltip(`<strong>${labelPrefix}</strong><br>${modeLabel}: ${detail}${costStr}`, { sticky: true });
            poly.addTo(routeLayerGroup);
          }
        }

        // Numbered marker
        const size = tripId === 'my_trip' ? 26 : 23;
        const icon = L.divIcon({
          className: '',
          html: `<div class="custom-pin" style="width:${size}px;height:${size}px;background:${color};">${idx + 1}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker(pos, { icon });
        const nightsTxt = st.nights > 0 ? `${st.nights} noche${st.nights > 1 ? 's' : ''}` : 'Conexión';
        marker.bindTooltip(`<strong>${labelPrefix} · #${idx + 1} ${dest.name}</strong><br>${nightsTxt}${st.dates ? ' · ' + st.dates : ''}`, {
          direction: 'top',
          offset: [0, -10]
        });
        marker.on('click', () => openInspector(dest.id));
        marker.addTo(routeLayerGroup);
      });
    }

    // Draw enabled reference trips
    Object.values(TRIPS).forEach(trip => {
      if (state.visibleLayers[trip.id]) {
        drawTrip(trip.id, trip.color, trip.stops, trip.shortName);
      }
    });

    // Draw My Trip
    if (state.visibleLayers.my_trip && state.myTrip.stops.length > 0) {
      drawTrip('my_trip', '#7c3aed', state.myTrip.stops, 'Mi Viaje');
    }

    // Draw clickable catalog labels / filtered pins for all matching destinations
    Object.values(DESTINATIONS).forEach(dest => {
      const matchesFilter =
        state.mapFilter === 'all' ||
        (state.mapFilter === 'hub' && dest.isHub) ||
        (state.mapFilter === 'beach' && dest.category === 'beach') ||
        (state.mapFilter === 'culture' && dest.category === 'culture');

      if (!matchesFilter) return;

      // Show clean small dot if unfiltered & zoomed out, or full pill if filtered / zoomed in
      if (state.mapFilter !== 'all' || !activeDestIds.has(dest.id)) {
        const showFullPill = state.mapFilter !== 'all' || map.getZoom() >= 7;
        let m;
        if (!showFullPill) {
          m = L.circleMarker([dest.lat, dest.lng], {
            radius: 6,
            color: '#fff',
            weight: 2,
            fillColor: '#475569',
            fillOpacity: 0.85
          });
        } else {
          const isHubMode = state.mapFilter === 'hub';
          const html = isHubMode
            ? `<div class="hub-pin">✈️ ${dest.iata} · ${dest.name}</div>`
            : `<div class="dest-label-pin">${dest.category === 'beach' ? '🏖️' : dest.isHub ? '✈️' : '🛕'} ${dest.name}</div>`;
          const icon = L.divIcon({
            className: '',
            html,
            iconSize: null,
            iconAnchor: [40, 12]
          });
          m = L.marker([dest.lat, dest.lng], { icon });
        }
        m.bindTooltip(`<strong>${dest.name}</strong> (${dest.country})<br>${dest.tagline}`, { direction: 'top' });
        m.on('click', () => openInspector(dest.id));
        m.addTo(catalogLayerGroup);
      }
    });

    // Highlight Flight Advisor Hubs if active
    if (state.highlightedHubs.length > 0) {
      state.highlightedHubs.forEach((hubId, i) => {
        const d = DESTINATIONS[hubId];
        if (!d) return;
        const role = state.highlightedHubs.length === 1
          ? 'IDA Y VUELTA'
          : (i === 0 ? 'ENTRADA' : 'SALIDA');
        L.circleMarker([d.lat, d.lng], {
          radius: 20,
          color: '#0f766e',
          weight: 3,
          fillColor: '#14b8a6',
          fillOpacity: 0.22
        }).addTo(hubHighlightGroup);
        const icon = L.divIcon({
          className: '',
          html: `<div class="hub-pin" style="background:#0f766e;border-color:#fff;">✈️ ${role}: ${d.iata} (${d.name})</div>`,
          iconSize: null,
          iconAnchor: [60, -14]
        });
        L.marker([d.lat, d.lng], { icon }).on('click', () => openInspector(d.id)).addTo(hubHighlightGroup);
      });
    }
  }

  function fitVisibleRoutes() {
    const pts = [];
    Object.values(TRIPS).forEach(t => {
      if (state.visibleLayers[t.id]) {
        t.stops.forEach(s => {
          const d = DESTINATIONS[s.destId];
          if (d && d.id !== 'dubai') pts.push([d.lat, d.lng]);
        });
      }
    });
    if (state.visibleLayers.my_trip) {
      state.myTrip.stops.forEach(s => {
        const d = DESTINATIONS[s.destId];
        if (d && d.id !== 'dubai') pts.push([d.lat, d.lng]);
      });
    }
    if (pts.length >= 2) {
      map.fitBounds(pts, { padding: [55, 55], maxZoom: 6 });
    } else {
      map.setView([9.5, 104.5], 5);
    }
  }

  map.on('zoomend', () => {
    renderMap();
  });

  // ==================== TOP BAR LAYER TOGGLES ====================
  function renderLayerToggles() {
    const container = document.getElementById('layerToggles');
    const items = [
      { id: 'tom_vero', name: 'Tom y Vero', color: '#ea580c', nights: '26n' },
      { id: 'juani_cande', name: 'Juani y Cande', color: '#0284c7', nights: '26n' },
      { id: 'cande_diego', name: 'Cande y Diego', color: '#059669', nights: '28n' },
      { id: 'my_trip', name: 'Mi Viaje', color: '#7c3aed', nights: `${getMyTripTotalNights()}n` }
    ];

    container.innerHTML = items.map(it => `
      <button class="couple-pill ${state.visibleLayers[it.id] ? 'active' : ''}" data-id="${it.id}">
        <span class="dot" style="background:${it.color}"></span>
        <span>${it.name}</span>
        <span class="nights-tag">${it.nights}</span>
      </button>
    `).join('');

    container.querySelectorAll('.couple-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        state.visibleLayers[id] = !state.visibleLayers[id];
        if (state.visibleLayers[id] && TRIPS[id]) {
          state.selectedTripForTimeline = id;
        }
        renderLayerToggles();
        renderRoutesPane();
        renderMap();
      });
    });
  }

  // ==================== DESTINATION INSPECTOR DRAWER ====================
  function openInspector(destId) {
    const dest = DESTINATIONS[destId];
    if (!dest) return;
    state.inspectedDestId = destId;

    map.flyTo([dest.lat, dest.lng], Math.max(map.getZoom(), 7), { duration: 0.75 });

    // Check which couples visited
    const visits = [];
    Object.values(TRIPS).forEach(trip => {
      const st = trip.stops.find(s => s.destId === destId);
      if (st) visits.push({ trip, st });
    });

    // Check hotels matching this destination
    const destKeywords = {
      singapore: ['singapur'],
      ubud: ['ubud'],
      gili_air: ['gili'],
      nusa_penida: ['nusa penida'],
      hanoi: ['hanoi'],
      halong_bay: ['ha long'],
      krabi: ['krabi'],
      phi_phi: ['phi phi'],
      koh_lipe: ['koh lipe'],
      bangkok: ['bangkok'],
      kanchanaburi: ['kanchanaburi'],
      chiang_mai: ['chiang mai'],
      luang_prabang: ['luang prabang'],
      nong_khiaw: ['nong khiaw'],
      hoi_an: ['hoi an'],
      siem_reap: ['siem reap'],
      ho_chi_minh: ['ho chi minh'],
      con_dao: ['con dao'],
      hong_kong: ['hong kong'],
      dubai: ['dubái']
    };
    const kws = destKeywords[destId] || [dest.name.toLowerCase()];
    const matchingHotels = HOTELS_CATALOG.filter(h =>
      kws.some(k => h.city.toLowerCase().includes(k))
    ).slice(0, 6);

    const bestMonthsHtml = dest.bestMonths.map(m => `<span class="badge badge-good">${MONTHS_SHORT[m - 1]}</span>`).join(' ');
    const inMyTrip = state.myTrip.stops.some(s => s.destId === destId);

    const drawer = document.getElementById('inspectorDrawer');
    const content = document.getElementById('inspectorContent');

    content.innerHTML = `
      <div class="dest-title">${dest.name}</div>
      <div class="dest-sub">
        <span class="badge badge-neutral">${dest.country}</span>
        ${dest.iata ? `<span class="badge badge-neutral">✈️ ${dest.iata}</span>` : ''}
        <span class="badge badge-neutral">🕒 ${dest.recommendedNights}</span>
      </div>
      <p class="dest-desc"><strong>${dest.tagline}.</strong><br>${dest.description}</p>

      <div style="display:flex; gap:8px; margin-bottom:10px;">
        <button class="btn-primary btn-purple" id="btnDrawerAddMine" style="flex:1">
          ${inMyTrip ? '✓ Ya está en Mi Viaje (sumar otra vez)' : '＋ Agregar a Mi Viaje'}
        </button>
      </div>

      <div class="dest-section">
        <h4>☀️ Mejores meses (clima seco)</h4>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${bestMonthsHtml}</div>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:6px;">
          Ref. pareja: Hotel ~<strong>USD ${dest.avgHotelNight}/noche</strong> · Gasto diario ~<strong>USD ${dest.avgDailyCouple}/día</strong>
        </div>
      </div>

      <div class="dest-section">
        <h4>✨ Qué se hace acá</h4>
        <ul style="padding-left:17px;font-size:12px;color:var(--text-muted);line-height:1.55;">
          ${dest.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>

      ${visits.length > 0 ? `
        <div class="dest-section">
          <h4>👥 Cómo lo hicieron tus amigos (${visits.length}/3 parejas)</h4>
          ${visits.map(({ trip, st }) => `
            <div class="couple-visit-box" style="border-left:3.5px solid ${trip.color};">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="badge ${trip.badgeClass}">${trip.name}</span>
                <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-light);">${st.nights}n · ${st.dates}</span>
              </div>
              <div><strong>🏨 Hotel:</strong> ${st.hotel}${st.hotelUsd ? ` <em>(USD ${st.hotelUsd} total)</em>` : ''}</div>
              <div style="margin-top:4px;color:var(--text-muted);"><strong>🎯 Plan:</strong> ${st.activities.join(' · ')}</div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="dest-section">
          <div class="alert-box alert-info">Ninguna de las 3 parejas fue acá porque viajaron en verano/otoño argentino, pero es una parada clave si vas entre mayo y septiembre.</div>
        </div>
      `}

      ${matchingHotels.length > 0 ? `
        <div class="dest-section">
          <h4>🏨 Hoteles de referencia en ${dest.name}</h4>
          ${matchingHotels.map(h => `
            <div style="font-size:11.5px;padding:6px 0;border-bottom:1px dashed var(--border);">
              <div style="display:flex;justify-content:space-between;gap:6px;">
                <strong>${h.name}</strong>
                <span style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700;">${h.priceNight ? `USD ${h.priceNight}/n` : ''}</span>
              </div>
              ${h.chosenBy ? `<span class="badge badge-good" style="margin-top:3px;">★ ${h.chosenBy}</span>` : ''}
              ${h.comment ? `<div style="color:var(--text-light);margin-top:2px;">${h.comment}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="dest-section">
        <h4>💡 Tip práctico</h4>
        <div class="alert-box alert-warn" style="margin-bottom:0;">${dest.tips}</div>
      </div>
    `;

    drawer.classList.remove('hidden');

    document.getElementById('btnDrawerAddMine').addEventListener('click', () => {
      addStopToMyTrip(destId);
      openInspector(destId);
    });
  }

  document.getElementById('btnCloseDrawer').addEventListener('click', () => {
    document.getElementById('inspectorDrawer').classList.add('hidden');
    state.inspectedDestId = null;
  });

  // ==================== TAB 1: ROUTES ====================
  function renderRoutesPane() {
    const pane = document.getElementById('pane-routes');
    const trip = TRIPS[state.selectedTripForTimeline];

    pane.innerHTML = `
      <div class="hero-callout">
        <h2>3 viajes reales para inspirarte</h2>
        <p>Los 3 duraron ~4 semanas (26 a 28 noches en Asia), pero representan <strong>dos mundos distintos</strong>: <strong>Tom & Vero / Juani & Cande</strong> (Singapur + Bali/islas + playas Tailandia + Norte Vietnam) vs. <strong>Cande & Diego</strong> (Indochina cultural: Norte Tailandia + Laos + Vietnam completo + Angkor Wat + Hong Kong).</p>
      </div>

      <div class="section-title">
        <span>Elegí una pareja para ver su día a día</span>
      </div>

      <div class="compare-grid">
        ${Object.values(TRIPS).map(t => `
          <div class="compare-card ${t.id === state.selectedTripForTimeline ? 'selected' : ''}" data-trip="${t.id}" style="color:${t.color};border-color:${t.id === state.selectedTripForTimeline ? t.color : 'var(--border)'}">
            <h3 style="color:${t.color}">${t.name}</h3>
            <div class="meta">${t.dates}<br>${t.nightsInAsia} noches · ${t.countries.length} países</div>
            <div class="flight-tag">${t.intlFlight.entryHub} → ${t.intlFlight.exitHub}</div>
          </div>
        `).join('')}
      </div>

      <div class="trip-header-box" style="border-left: 4px solid ${trip.color}; background: var(--surface);">
        <h3>
          <span style="color:${trip.color}">${trip.name}</span>
          <button class="btn-outline btn-sm" id="btnCloneToMine">🧭 Usar como base</button>
        </h3>
        <p>${trip.summary}</p>
        <div class="trip-stats-row">
          <span class="badge ${trip.badgeClass}">✈️ ${trip.intlFlight.type}</span>
          <span class="badge badge-neutral">🗓️ ${trip.nightsInAsia} noches en Asia (${trip.totalDaysDoorToDoor} días totales)</span>
        </div>
        <div style="margin-top:9px;padding:8px 10px;background:var(--surface-alt);border-radius:8px;font-size:11.5px;line-height:1.45;">
          <div><strong>🛫 Ida:</strong> ${trip.intlFlight.outbound}</div>
          <div><strong>🛬 Vuelta:</strong> ${trip.intlFlight.inbound}</div>
          <div style="color:var(--text-muted);margin-top:3px;">${trip.intlFlight.whyItWorked}</div>
        </div>
        <div style="margin-top:7px;font-size:11px;color:var(--text-light);">💵 ${trip.totalCostKnown}</div>
      </div>

      <div class="section-title">
        <span>Recorrido paso a paso (${trip.stops.length} paradas)</span>
        <button class="btn-outline btn-sm" id="btnSoloMap">Solo esta ruta en mapa</button>
      </div>

      <div class="timeline">
        ${trip.stops.map((st, idx) => {
          const dest = DESTINATIONS[st.destId];
          const legIco = st.nextLeg ? (st.nextLeg.mode === 'flight' ? '✈️' : st.nextLeg.mode === 'ferry' ? '⛴️' : '🚗') : '';
          return `
            <div class="tl-item">
              <div class="tl-rail">
                <div class="tl-num" style="background:${trip.color}">${idx + 1}</div>
                ${idx < trip.stops.length - 1 ? '<div class="tl-line"></div>' : ''}
              </div>
              <div class="tl-body">
                <div class="tl-card" data-dest="${st.destId}">
                  <div class="tl-card-top">
                    <span class="tl-card-title">${dest.name} <span style="font-weight:500;color:var(--text-light);font-size:11.5px;">· ${dest.country}</span></span>
                    <span class="tl-card-dates">${st.nights > 0 ? st.nights + 'n' : 'paso'} · ${st.dates}</span>
                  </div>
                  <div class="tl-card-hotel">🏨 ${st.hotel}${st.hotelUsd ? ` · <strong>USD ${st.hotelUsd}</strong>` : ''}</div>
                  <div class="tl-card-acts">${st.activities.slice(0, 2).join(' · ')}</div>
                </div>
                ${st.nextLeg ? `
                  <div class="tl-leg">
                    <span>${legIco}</span>
                    <span>${st.nextLeg.detail}${st.nextLeg.costUsd ? ` · <strong>USD ${st.nextLeg.costUsd}</strong>` : ''}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    pane.querySelectorAll('.compare-card').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.trip;
        state.selectedTripForTimeline = id;
        state.visibleLayers[id] = true;
        renderLayerToggles();
        renderRoutesPane();
        renderMap();
      });
    });

    pane.querySelectorAll('.tl-card').forEach(el => {
      el.addEventListener('click', () => openInspector(el.dataset.dest));
    });

    document.getElementById('btnSoloMap').addEventListener('click', () => {
      Object.keys(state.visibleLayers).forEach(k => state.visibleLayers[k] = (k === trip.id));
      renderLayerToggles();
      renderMap();
      fitVisibleRoutes();
    });

    document.getElementById('btnCloneToMine').addEventListener('click', () => {
      state.myTrip.stops = trip.stops
        .filter(s => s.nights > 0 && s.destId !== 'dubai')
        .map(s => ({ destId: s.destId, nights: s.nights }));
      saveMyTrip();
      state.visibleLayers.my_trip = true;
      renderLayerToggles();
      renderBuilderPane();
      renderMap();
      switchTab('builder');
      showToast(`Copiada la base de ${trip.name} a "Mi Viaje"`);
    });
  }

  // ==================== TAB 2: FLIGHT HUB ADVISOR ====================
  function renderFlightsPane() {
    const pane = document.getElementById('pane-flights');
    const sim = state.flightSim;
    const mIdx = sim.month - 1;
    const effectiveNights = Math.max(8, sim.totalDays - 4);

    // Monsoon insight for chosen month
    const andamanOk = MONSOON_MATRIX[0].months[mIdx];
    const gulfOk = MONSOON_MATRIX[1].months[mIdx];
    const baliOk = MONSOON_MATRIX[3].months[mIdx];
    const indochinaOk = MONSOON_MATRIX[6].months[mIdx];

    let weatherAlert = '';
    if (andamanOk === 3 && baliOk <= 2) {
      weatherAlert = `<div class="alert-box alert-good"><strong>☀️ ${MONTHS_FULL[mIdx]} es temporada SECA TOP en Tailandia (Phi Phi, Koh Lipe, Bangkok), Vietnam y Camboya.</strong> Es exactamente la época en la que viajaron las 3 parejas. En Bali/Gili puede llover de a ratos (chubascos tropicales con calor), pero se disfruta perfecto igual.</div>`;
    } else if (baliOk === 3 && andamanOk === 1) {
      weatherAlert = `<div class="alert-box alert-warn"><strong>🌦️ OJO con el monzón en ${MONTHS_FULL[mIdx]}:</strong> ¡Es el MEJOR clima del año para <strong>Bali, Gili Air, Nusa Penida, Hoi An y Koh Samui/Koh Tao</strong> (Golfo de Tailandia)! En cambio, en Phi Phi y Koh Lipe hay lluvias fuertes y menos ferries.</div>`;
    } else {
      weatherAlert = `<div class="alert-box alert-info"><strong>🌤️ ${MONTHS_FULL[mIdx]} es mes de transición:</strong> buen equilibrio entre Bali (${baliOk === 3 ? 'seco' : 'mixto'}), Golfo de Tailandia (${gulfOk === 3 ? 'seco' : 'mixto'}) e Indochina (${indochinaOk === 3 ? 'seco' : 'mixto'}). Chequeá la matriz en Guía 101.</div>`;
    }

    // Score strategies
    const scored = FLIGHT_STRATEGIES.map(st => {
      let score = 50;
      sim.interests.forEach(i => {
        if (st.bestFor.includes(i)) score += 18;
      });
      if (baliOk === 3 && andamanOk === 1 && st.id === 'roundtrip_sin_or_kul') score += 28;
      if (baliOk === 3 && andamanOk === 1 && st.id === 'open_jaw_sin_bkk') score += 15;
      if (sim.interests.has('culture') && !sim.interests.has('bali') && st.id === 'open_jaw_bkk_hkg') score += 25;
      if (sim.interests.has('budget') && st.id === 'roundtrip_bkk') score += 22;
      return { ...st, score };
    }).sort((a, b) => b.score - a.score);

    const interestOptions = [
      { id: 'beach', label: '🏖️ Playas paradisíacas' },
      { id: 'bali', label: '🌴 Bali & selva/arrozales' },
      { id: 'culture', label: '🛕 Templos, Angkor, Laos/Vietnam' },
      { id: 'cities', label: '🌆 Singapur / Hong Kong' },
      { id: 'budget', label: '💸 Priorizar pasaje más barato' }
    ];

    pane.innerHTML = `
      <div class="hero-callout">
        <h2>Paso #1: Comprar el pasaje internacional</h2>
        <p>Desde Ezeiza (EZE) al Sudeste Asiático tenés <strong>~30 a 36 hs de viaje</strong> y +10/+11 hs de huso horario. Sacar bien el aeropuerto de entrada y salida te ahorra 1 o 2 días enteros y cientos de dólares.</p>
      </div>

      <div class="card">
        <div class="form-group">
          <div class="form-label">
            <span>📅 ¿En qué mes pensás viajar?</span>
            <span style="color:var(--accent)">${MONTHS_FULL[mIdx]}</span>
          </div>
          <select class="select-input" id="simMonth">
            ${MONTHS_FULL.map((m, i) => `<option value="${i + 1}" ${sim.month === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <div class="form-label">
            <span>🗓️ Días totales disponibles (de casa a casa)</span>
            <span style="color:var(--accent);font-family:'JetBrains Mono',monospace;">${sim.totalDays} días (~${effectiveNights} noches reales en Asia)</span>
          </div>
          <input type="range" min="15" max="36" value="${sim.totalDays}" class="range-input" id="simDays" />
          <div style="font-size:11px;color:var(--text-light);margin-top:3px;">
            Descontamos ~4 días entre vuelos ida/vuelta desde EZE. Las 3 parejas tuvieron 28–31 días totales (26–28 noches en destino).
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <div class="form-label"><span>🎯 ¿Qué no te querés perder?</span></div>
          <div class="chip-grid">
            ${interestOptions.map(opt => `
              <button class="choice-chip ${sim.interests.has(opt.id) ? 'active' : ''}" data-interest="${opt.id}">${opt.label}</button>
            `).join('')}
          </div>
        </div>
      </div>

      ${weatherAlert}

      <div class="section-title">
        <span>Mejores combinaciones de pasaje para vos</span>
      </div>

      ${scored.map((st, i) => `
        <div class="strategy-card ${i === 0 ? 'top-pick' : ''}">
          <div class="strategy-top">
            <div>
              <div class="strategy-route">${st.routeCode}</div>
              <h4>${st.title}</h4>
            </div>
            ${i === 0 ? '<span class="badge badge-good">⭐ Top match</span>' : `<span class="badge badge-neutral">Opción #${i + 1}</span>`}
          </div>
          <p>${st.reference} · <strong>Aerolíneas:</strong> ${st.airlines}</p>
          <div class="pro-con">✅ <strong>A favor:</strong> ${st.pros}</div>
          <div class="pro-con">⚠️ <strong>A tener en cuenta:</strong> ${st.cons}</div>
          <div style="margin-top:9px;display:flex;gap:8px;">
            <button class="btn-outline btn-sm btn-show-hubs" data-entry="${st.entryHub}" data-exit="${st.exitHub}">
              📍 Ver aeropuertos en el mapa
            </button>
          </div>
        </div>
      `).join('')}

      <div class="card-soft">
        <div class="section-title" style="margin-bottom:6px;"><span>🧠 4 Reglas de Oro antes de pagar el pasaje</span></div>
        <ul style="padding-left:17px;font-size:11.5px;color:var(--text-muted);line-height:1.55;">
          <li><strong>Buscá "Multidestino" (Multi-city)</strong> en Google Flights / Kayak / Qatar / Emirates / Turkish: entrar por <strong>SIN</strong> y volver por <strong>BKK</strong> suele costar casi lo mismo que ida y vuelta y te regala 1 día extra.</li>
          <li><strong>No compres vuelos internos hasta confirmar el internacional</strong>: los vuelos internos con AirAsia, Scoot, VietJet o Vietnam Airlines se consiguen entre USD 45 y USD 160 por persona.</li>
          <li><strong>Dejá Bangkok (o Hong Kong) para el final</strong>: así no cargás compras (ropa, souvenirs, valijas extra) por ferries e islitas.</li>
          <li><strong>Ojo con el stopover gratis/barato</strong>: con Emirates podés sumar 2 noches en Dubái (como Juani y Cande) o con Qatar en Doha, o Turkish en Estambul para cortar las 30+ horas de viaje.</li>
        </ul>
      </div>
    `;

    document.getElementById('simMonth').addEventListener('change', (e) => {
      state.flightSim.month = parseInt(e.target.value, 10);
      renderFlightsPane();
    });

    document.getElementById('simDays').addEventListener('input', (e) => {
      state.flightSim.totalDays = parseInt(e.target.value, 10);
      renderFlightsPane();
    });

    pane.querySelectorAll('.choice-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.interest;
        if (state.flightSim.interests.has(k)) state.flightSim.interests.delete(k);
        else state.flightSim.interests.add(k);
        renderFlightsPane();
      });
    });

    pane.querySelectorAll('.btn-show-hubs').forEach(btn => {
      btn.addEventListener('click', () => {
        const entry = btn.dataset.entry;
        const exit = btn.dataset.exit;
        state.highlightedHubs = entry === exit ? [entry] : [entry, exit];
        renderMap();
        const pts = state.highlightedHubs.map(id => [DESTINATIONS[id].lat, DESTINATIONS[id].lng]);
        if (pts.length === 1) map.flyTo(pts[0], 6);
        else map.fitBounds(pts, { padding: [90, 90], maxZoom: 6 });
        showToast('Aeropuertos hub destacados en el mapa');
      });
    });
  }

  // ==================== TAB 3: MY TRIP BUILDER ====================
  function getMyTripTotalNights() {
    return state.myTrip.stops.reduce((acc, s) => acc + (s.nights || 0), 0);
  }

  function addStopToMyTrip(destId) {
    const defNights = destId === 'halong_bay' ? 1 : (destId === 'singapore' || destId === 'nusa_penida' ? 2 : 3);
    state.myTrip.stops.push({ destId, nights: defNights });
    state.visibleLayers.my_trip = true;
    saveMyTrip();
    renderLayerToggles();
    renderBuilderPane();
    renderMap();
    showToast(`Agregado ${DESTINATIONS[destId].name} (${defNights}n) a Mi Viaje`);
  }

  function estimateMyTripBudget() {
    const mult = state.myTrip.style === 'eco' ? 0.72 : (state.myTrip.style === 'luxury' ? 1.85 : 1.0);
    let hotelUsd = 0;
    let dailyUsd = 0;
    let legsUsd = 0;

    state.myTrip.stops.forEach((st, idx) => {
      const d = DESTINATIONS[st.destId];
      if (!d) return;
      hotelUsd += d.avgHotelNight * st.nights * mult;
      dailyUsd += d.avgDailyCouple * st.nights * (state.myTrip.style === 'eco' ? 0.75 : state.myTrip.style === 'luxury' ? 1.35 : 1.0);
      if (idx < state.myTrip.stops.length - 1) {
        const mode = inferTransportMode(st.destId, state.myTrip.stops[idx + 1].destId);
        legsUsd += mode === 'flight' ? 230 : (mode === 'ferry' ? 65 : 55);
      }
    });

    return {
      hotelUsd: Math.round(hotelUsd),
      dailyUsd: Math.round(dailyUsd),
      legsUsd: Math.round(legsUsd),
      totalUsd: Math.round(hotelUsd + dailyUsd + legsUsd)
    };
  }

  function renderBuilderPane() {
    const pane = document.getElementById('pane-builder');
    const nights = getMyTripTotalNights();
    const totalDays = nights > 0 ? nights + 4 : 0;
    const est = estimateMyTripBudget();
    const stops = state.myTrip.stops;
    const firstDest = stops.length > 0 ? DESTINATIONS[stops[0].destId] : null;
    const lastDest = stops.length > 0 ? DESTINATIONS[stops[stops.length - 1].destId] : null;

    pane.innerHTML = `
      <div class="card-soft" style="border-left:4px solid var(--c-mine);">
        <div class="section-title" style="margin-bottom:6px;">
          <span style="color:var(--c-mine)">🧭 Armá tu borrador (se guarda automático)</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <select class="select-input" id="templateSelect" style="flex:1;min-width:200px;">
            <option value="">✨ Cargar una plantilla base...</option>
            ${Object.entries(STARTER_TEMPLATES).map(([k, t]) => `<option value="${k}">${t.name}</option>`).join('')}
          </select>
          <button class="btn-outline btn-sm" id="btnClearTrip">Limpiar</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="font-size:11.5px;font-weight:700;">Estilo presupuesto:</span>
          <button class="choice-chip ${state.myTrip.style === 'eco' ? 'active' : ''}" data-style="eco">Económico</button>
          <button class="choice-chip ${state.myTrip.style === 'mid' ? 'active' : ''}" data-style="mid">Intermedio (Tom y Vero)</button>
          <button class="choice-chip ${state.myTrip.style === 'luxury' ? 'active' : ''}" data-style="luxury">Boutique / Lujo</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-val">${nights}n</div>
          <div class="kpi-lbl">Noches en Asia</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">~${totalDays}d</div>
          <div class="kpi-lbl">Total c/ vuelos EZE</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val" style="color:var(--c-mine)">$${est.totalUsd.toLocaleString()}</div>
          <div class="kpi-lbl">Est. pareja (s/ aéreos EZE)</div>
        </div>
      </div>

      ${firstDest && lastDest ? `
        <div class="alert-box alert-info" style="font-size:11.5px;">
          <strong>✈️ Pasaje internacional sugerido para tu ruta:</strong><br>
          Entrar por <strong>${firstDest.name} (${firstDest.iata})</strong> y volver por <strong>${lastDest.name} (${lastDest.iata})</strong>.<br>
          <span style="opacity:0.85;">Estimado interno: Hoteles ~$${est.hotelUsd.toLocaleString()} · Traslados ~$${est.legsUsd.toLocaleString()} · Gastos diarios ~$${est.dailyUsd.toLocaleString()}</span>
        </div>
      ` : ''}

      <div style="display:flex;gap:6px;margin-bottom:12px;">
        <select class="select-input" id="addDestSelect" style="flex:1;">
          <option value="">＋ Elegí un destino para sumar...</option>
          ${Object.values(DESTINATIONS).map(d => `<option value="${d.id}">${d.name} (${d.country}) · rec. ${d.recommendedNights}</option>`).join('')}
        </select>
        <button class="btn-primary btn-purple" id="btnAddDest">Sumar</button>
      </div>

      <div id="builderList">
        ${stops.length === 0 ? `
          <div class="card" style="text-align:center;color:var(--text-light);font-size:12.5px;padding:24px;">
            Todavía no sumaste paradas. Elegí una plantilla arriba o tocá cualquier destino en el mapa.
          </div>
        ` : stops.map((st, idx) => {
          const d = DESTINATIONS[st.destId];
          const nextMode = idx < stops.length - 1 ? inferTransportMode(st.destId, stops[idx + 1].destId) : null;
          return `
            <div class="builder-stop">
              <div class="builder-stop-left" style="cursor:pointer" data-inspect="${st.destId}">
                <div class="builder-stop-num">${idx + 1}</div>
                <div style="min-width:0">
                  <div class="builder-stop-name">${d.name}</div>
                  <div class="builder-stop-sub">${d.country} · ${d.iata}${nextMode ? ` · sig: ${nextMode === 'flight' ? '✈️ vuelo' : nextMode === 'ferry' ? '⛴️ ferry' : '🚗 auto'}` : ' · 🏁 fin'}</div>
                </div>
              </div>
              <div class="builder-controls">
                <button class="icon-btn" data-act="dec" data-idx="${idx}" title="Menos noches">−</button>
                <span class="nights-pill">${st.nights}n</span>
                <button class="icon-btn" data-act="inc" data-idx="${idx}" title="Más noches">+</button>
                <button class="icon-btn" data-act="up" data-idx="${idx}" title="Subir">↑</button>
                <button class="icon-btn" data-act="down" data-idx="${idx}" title="Bajar">↓</button>
                <button class="icon-btn del" data-act="del" data-idx="${idx}" title="Quitar">✕</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn-primary" id="btnCopySummary" style="flex:1;">📋 Copiar resumen para seguir en chat</button>
        <button class="btn-outline" id="btnFocusMine">🎯 Ver en mapa</button>
      </div>
    `;

    document.getElementById('templateSelect').addEventListener('change', (e) => {
      const key = e.target.value;
      if (!key || !STARTER_TEMPLATES[key]) return;
      state.myTrip.stops = STARTER_TEMPLATES[key].stops.map(s => ({ ...s }));
      state.visibleLayers.my_trip = true;
      saveMyTrip();
      renderLayerToggles();
      renderBuilderPane();
      renderMap();
      fitVisibleRoutes();
      showToast(`Cargada plantilla: ${STARTER_TEMPLATES[key].name}`);
    });

    document.getElementById('btnClearTrip').addEventListener('click', () => {
      state.myTrip.stops = [];
      saveMyTrip();
      renderLayerToggles();
      renderBuilderPane();
      renderMap();
    });

    pane.querySelectorAll('[data-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.myTrip.style = btn.dataset.style;
        saveMyTrip();
        renderBuilderPane();
      });
    });

    document.getElementById('btnAddDest').addEventListener('click', () => {
      const sel = document.getElementById('addDestSelect').value;
      if (sel) addStopToMyTrip(sel);
    });

    pane.querySelectorAll('[data-inspect]').forEach(el => {
      el.addEventListener('click', () => openInspector(el.dataset.inspect));
    });

    pane.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const act = btn.dataset.act;
        const arr = state.myTrip.stops;
        if (act === 'dec' && arr[idx].nights > 1) arr[idx].nights--;
        if (act === 'inc' && arr[idx].nights < 14) arr[idx].nights++;
        if (act === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
        if (act === 'down' && idx < arr.length - 1) [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
        if (act === 'del') arr.splice(idx, 1);
        saveMyTrip();
        renderLayerToggles();
        renderBuilderPane();
        renderMap();
      });
    });

    document.getElementById('btnFocusMine').addEventListener('click', () => {
      Object.keys(state.visibleLayers).forEach(k => state.visibleLayers[k] = (k === 'my_trip'));
      renderLayerToggles();
      renderMap();
      fitVisibleRoutes();
    });

    document.getElementById('btnCopySummary').addEventListener('click', () => {
      if (stops.length === 0) return showToast('Agregá al menos un destino primero');
      const lines = [
        `Mi borrador de viaje al Sudeste Asiático (${nights} noches en Asia / ~${totalDays} días totales):`,
        `Pasaje sugerido: EZE → ${firstDest.iata} (${firstDest.name}) // ${lastDest.iata} (${lastDest.name}) → EZE`,
        `Presupuesto estimado pareja sin aéreos EZE (${state.myTrip.style}): ~USD ${est.totalUsd.toLocaleString()}`,
        '',
        ...stops.map((s, i) => `${i + 1}. ${DESTINATIONS[s.destId].name} (${DESTINATIONS[s.destId].country}) — ${s.nights} noches`)
      ];
      navigator.clipboard.writeText(lines.join('\n')).then(
        () => showToast('¡Resumen copiado! Pegalo en el chat cuando quieras'),
        () => showToast('No se pudo copiar automático')
      );
    });
  }

  function updateMyTripBadge() {
    const b = document.getElementById('myTripCountBadge');
    if (b) b.textContent = state.myTrip.stops.length;
  }

  // ==================== TAB 4: BUDGET & HOTELS ====================
  function renderBudgetPane() {
    const pane = document.getElementById('pane-budget');
    const b = REAL_BUDGET_TOM_VERO;
    const maxPlace = Math.max(...b.byPlaceDaily.map(x => x.usd));

    const cities = ['ALL', ...Array.from(new Set(HOTELS_CATALOG.map(h => h.city))).sort()];
    const f = state.hotelFilter;
    const filteredHotels = HOTELS_CATALOG.filter(h => {
      if (f.city !== 'ALL' && h.city !== f.city) return false;
      if (f.onlyChosen && !h.chosenBy) return false;
      if (h.priceNight && h.priceNight > f.maxPrice) return false;
      if (f.query && !(`${h.name} ${h.city} ${h.comment} ${h.chosenBy || ''}`).toLowerCase().includes(f.query.toLowerCase())) return false;
      return true;
    });

    pane.innerHTML = `
      <div class="hero-callout" style="background:linear-gradient(135deg,#c2410c,#ea580c);">
        <h2>Presupuesto REAL en destino (Tom y Vero)</h2>
        <p>Planilla real peso por peso de <strong>26 noches / 27 días para 2 personas</strong> (Feb–Mar 2026), sin contar los pasajes internacionales EZE ↔ Asia.</p>
      </div>

      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-val" style="color:var(--c-tom)">$8.902</div>
          <div class="kpi-lbl">Total pareja en destino</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">$108</div>
          <div class="kpi-lbl">Hotel prom. / noche</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">$169</div>
          <div class="kpi-lbl">Gasto diario pareja</div>
        </div>
      </div>

      <div class="card">
        <div class="section-title"><span>Desglose total (USD pareja)</span></div>
        <div class="bar-row">
          <div class="bar-label"><span>🍽️ Gasto diario (comidas, tours, guías, Grab, visas, compras)</span><span>USD 4.577 (51%)</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:51%;background:#ea580c;"></div></div>
        </div>
        <div class="bar-row">
          <div class="bar-label"><span>🏨 Hoteles y crucero (26 noches confirmadas)</span><span>USD 2.813 (32%)</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:32%;background:#0284c7;"></div></div>
        </div>
        <div class="bar-row" style="margin-bottom:0;">
          <div class="bar-label"><span>✈️⛴️ 5 vuelos internos + 6 ferries (x2 personas)</span><span>USD 1.513 (17%)</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:17%;background:#059669;"></div></div>
        </div>
        <div style="font-size:11px;color:var(--text-light);margin-top:8px;">
          💡 Sumando vuelos internacionales EZE ↔ Asia (~USD 1.400–2.000 p/p), un viaje completo de 4 semanas estilo Tom y Vero ronda los <strong>USD 11.700 – 13.000 la pareja</strong> (USD 5.850 – 6.500 por persona todo incluido).
        </div>
      </div>

      <div class="card">
        <div class="section-title"><span>Gasto diario real por destino (pareja)</span></div>
        ${b.byPlaceDaily.map(item => `
          <div class="bar-row">
            <div class="bar-label"><span>${item.place}</span><span>USD ${item.usd}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round((item.usd / maxPlace) * 100)}%"></div></div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-title">
          <span>🏨 Buscador de Hoteles (${filteredHotels.length} de ${HOTELS_CATALOG.length})</span>
        </div>
        <p style="font-size:11.5px;color:var(--text-muted);margin-bottom:9px;">
          Incluye los hoteles elegidos por las 3 parejas + los 99 hoteles investigados por Tom y Vero con puntaje y comentarios reales.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:7px;">
          <select class="select-input" id="hCity">
            ${cities.map(c => `<option value="${c}" ${f.city === c ? 'selected' : ''}>${c === 'ALL' ? 'Todas las ciudades' : c}</option>`).join('')}
          </select>
          <input type="text" class="text-input" id="hQuery" placeholder="Buscar hotel o comentario..." value="${f.query}" />
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;font-size:11.5px;">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-weight:600;">
            <input type="checkbox" id="hChosen" ${f.onlyChosen ? 'checked' : ''} /> Solo elegidos por amigos
          </label>
          <label style="display:flex;align-items:center;gap:6px;">
            <span>Máx/noche: <strong>$${f.maxPrice}</strong></span>
            <input type="range" min="40" max="1000" step="20" value="${f.maxPrice}" id="hMax" style="width:90px;accent-color:var(--accent);" />
          </label>
        </div>

        <div style="max-height:380px;overflow-y:auto;padding-right:3px;">
          ${filteredHotels.slice(0, 60).map(h => `
            <div class="hotel-item">
              <div class="hotel-item-top">
                <div>
                  <div class="hotel-name">${h.name}</div>
                  <div class="hotel-meta">
                    <span>📍 ${h.city}</span>
                    ${h.rating ? `<span>⭐ ${h.rating}</span>` : ''}
                    ${h.m2 ? `<span>📐 ${h.m2}m²</span>` : ''}
                    ${h.breakfast ? `<span>☕ Desayuno: ${h.breakfast}</span>` : ''}
                  </div>
                </div>
                <div class="hotel-price">${h.priceNight ? `USD ${h.priceNight}/n` : '—'}</div>
              </div>
              ${h.chosenBy ? `<div style="margin-top:4px;"><span class="badge badge-good">★ ${h.chosenBy}</span></div>` : ''}
              ${h.comment ? `<div class="hotel-comment">💬 ${h.comment}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('hCity').addEventListener('change', (e) => { state.hotelFilter.city = e.target.value; renderBudgetPane(); });
    document.getElementById('hQuery').addEventListener('input', (e) => { state.hotelFilter.query = e.target.value; renderBudgetPane(); });
    document.getElementById('hChosen').addEventListener('change', (e) => { state.hotelFilter.onlyChosen = e.target.checked; renderBudgetPane(); });
    document.getElementById('hMax').addEventListener('change', (e) => { state.hotelFilter.maxPrice = parseInt(e.target.value, 10); renderBudgetPane(); });
  }

  // ==================== TAB 5: BEGINNER GUIDE 101 ====================
  function renderGuidePane() {
    const pane = document.getElementById('pane-guide');
    const sym = { 3: '☀️', 2: '🌤️', 1: '🌧️' };

    pane.innerHTML = `
      <div class="hero-callout" style="background:linear-gradient(135deg,#047857,#0f766e);">
        <h2>Guía 101 para tu primer viaje al Sudeste</h2>
        <p>Todo lo que conviene saber antes de sacar el pasaje: cuándo llueve en cada costa (monzón), qué visas/vacunas piden a argentinos y los mejores trucos de tus amigos.</p>
      </div>

      <div class="card">
        <div class="section-title"><span>🌦️ Clima y Monzón mes a mes</span></div>
        <p style="font-size:11.5px;color:var(--text-muted);margin-bottom:6px;">
          El secreto del Sudeste: <strong>siempre hay alguna costa con clima perfecto</strong>. En verano argentino (Nov–Abr) brilla Tailandia Andamán/Indochina; en invierno argentino (May–Sep) brilla Bali/Gili y el Golfo de Tailandia.
        </p>
        <div style="overflow-x:auto;">
          <table class="weather-table">
            <thead>
              <tr>
                <th>Región</th>
                ${MONTHS_SHORT.map(m => `<th>${m[0]}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${MONSOON_MATRIX.map(row => `
                <tr>
                  <td class="region-col" title="${row.note}">${row.region.split('(')[0]}</td>
                  ${row.months.map(v => `<td class="w-${v}" title="${row.note}">${sym[v]}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="font-size:10.5px;color:var(--text-light);margin-top:6px;">☀️ Seco ideal · 🌤️ Transición / mixto · 🌧️ Lluvias frecuentes</div>
      </div>

      <div class="card">
        <div class="section-title"><span>🛂 Visas y Vacuna Fiebre Amarilla (Pasaporte AR)</span></div>
        <div class="alert-box alert-warn">
          <strong>💉 Vacuna contra la Fiebre Amarilla:</strong> ¡Súper importante! Para argentinos que entran a Tailandia (y varios países vecinos) piden el <strong>Certificado Internacional de Vacunación</strong> (aplicarla al menos 10 días antes de viajar; dura de por vida). Pasaporte siempre con +6 meses de vigencia.
        </div>
        ${VISAS_GUIDE.map(v => `
          <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:11.5px;line-height:1.45;">
            <div style="display:flex;justify-content:space-between;gap:6px;margin-bottom:2px;">
              <strong>${v.country}</strong>
              <span class="badge ${v.arPassport.includes('SIN VISA') ? 'badge-good' : 'badge-warn'}">${v.arPassport}</span>
            </div>
            <div style="color:var(--text-muted);">${v.extra}</div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-title"><span>💎 Trucos de oro aprendidos de los 3 viajes</span></div>
        <ul style="padding-left:17px;font-size:12px;color:var(--text-muted);line-height:1.6;">
          <li><strong>Lockers de valijas para las islas:</strong> Tom y Vero dejaron las valijas grandes en lockers en Bali (USD 121) y en Bangkok (USD 38) para moverse solo con mochilas/carry-on en fast boats a Gili, Penida, Phi Phi y Koh Lipe.</li>
          <li><strong>Apps imprescindibles:</strong> <strong>Grab</strong> (es el Uber + PedidosYa del Sudeste), <strong>12Go Asia</strong> (para reservar ferries y transfers), <strong>Holafly / Airalo</strong> (eSIM regional Asia) y <strong>Klook</strong> (entradas y traslados).</li>
          <li><strong>Dos aeropuertos en Bangkok:</strong> Internacionales llegan a <strong>BKK (Suvarnabhumi)</strong>, pero AirAsia suele volar desde <strong>DMK (Don Mueang)</strong>, a 1 hora de distancia con tráfico.</li>
          <li><strong>Guías privados en Bali:</strong> Por ~USD 60–75 el día completo tenés auto con chofer/guía privado (Tom y Vero usaron a Ariana y Made). Vale oro por el tráfico de Ubud.</li>
          <li><strong>Vestimenta en templos:</strong> Hombros y rodillas cubiertos siempre (en el Gran Palacio de Bangkok son estrictísimos y además piden copia/foto del pasaporte).</li>
          <li><strong>Compras:</strong> Dejá Hanoi (camperas North Face/Patagonia réplica/outlet y mochilas) y Bangkok (Don Don Donki, MBK, Chinatown) para la segunda mitad del viaje.</li>
        </ul>
      </div>
    `;
  }

  // ==================== TAB NAVIGATION & CONTROLS ====================
  function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === `pane-${tabName}`));
    if (tabName !== 'flights' && state.highlightedHubs.length > 0) {
      state.highlightedHubs = [];
      renderMap();
    }
  }

  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.tab));
  });

  document.getElementById('btnFitAll').addEventListener('click', fitVisibleRoutes);

  document.getElementById('btnToggleMapStyle').addEventListener('click', (e) => {
    map.removeLayer(tiles[state.mapStyle]);
    const order = ['topo', 'osm', 'satellite'];
    const labels = {
      topo: '<span>🗺️</span> Relieve',
      osm: '<span>🛣️</span> Calles',
      satellite: '<span>🛰️</span> Satélite'
    };
    const next = order[(order.indexOf(state.mapStyle) + 1) % order.length];
    state.mapStyle = next;
    tiles[next].addTo(map);
    e.currentTarget.innerHTML = labels[next];
  });

  document.querySelectorAll('#mapOverlayPills .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mapOverlayPills .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mapFilter = btn.dataset.filter;
      renderMap();
    });
  });

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
  }

  // ==================== INIT ====================
  renderLayerToggles();
  updateMyTripBadge();
  renderRoutesPane();
  renderFlightsPane();
  renderBuilderPane();
  renderBudgetPane();
  renderGuidePane();
  renderMap();
  fitVisibleRoutes();
})();
