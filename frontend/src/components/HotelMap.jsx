import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the default-icon path mess that ships with Leaflet under bundlers.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
});

const INDIA_CENTER = [20.5937, 78.9629];

export default function HotelMap({
  lat,
  lng,
  label,
  interactive = false,
  onChange,
  height = 360,
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep the latest onChange without re-running map init.
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const hasPoint = lat != null && lng != null;
    const map = L.map(ref.current, {
      scrollWheelZoom: interactive,
      dragging: true,
      zoomControl: true,
    }).setView(
      hasPoint ? [Number(lat), Number(lng)] : INDIA_CENTER,
      hasPoint ? 14 : 5
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    if (hasPoint) {
      const marker = L.marker([Number(lat), Number(lng)], { draggable: interactive }).addTo(map);
      if (label) marker.bindPopup(label);
      if (interactive) {
        marker.on('dragend', (e) => {
          const { lat: la, lng: ln } = e.target.getLatLng();
          onChangeRef.current?.({ lat: la, lng: ln });
        });
      }
      markerRef.current = marker;
    }

    if (interactive) {
      map.on('click', (e) => {
        const { lat: la, lng: ln } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([la, ln]);
        } else {
          const m = L.marker([la, ln], { draggable: true }).addTo(map);
          if (label) m.bindPopup(label);
          m.on('dragend', (ev) => {
            const p = ev.target.getLatLng();
            onChangeRef.current?.({ lat: p.lat, lng: p.lng });
          });
          markerRef.current = m;
        }
        onChangeRef.current?.({ lat: la, lng: ln });
      });
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to external value changes (e.g., schema reset).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (lat == null || lng == null) return;
    const ll = [Number(lat), Number(lng)];
    if (markerRef.current) {
      markerRef.current.setLatLng(ll);
    } else {
      const m = L.marker(ll, { draggable: interactive }).addTo(map);
      if (label) m.bindPopup(label);
      if (interactive) {
        m.on('dragend', (ev) => {
          const p = ev.target.getLatLng();
          onChangeRef.current?.({ lat: p.lat, lng: p.lng });
        });
      }
      markerRef.current = m;
    }
    map.setView(ll, Math.max(map.getZoom(), 13));
  }, [lat, lng, interactive, label]);

  // Numeric `height` keeps the current API; pass a CSS string for fluid sizing.
  const cssHeight = typeof height === 'number' ? `${height}px` : height;
  return <div ref={ref} style={{ width: '100%', height: cssHeight, borderRadius: 12, overflow: 'hidden' }} />;
}
