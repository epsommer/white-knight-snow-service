'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
  properties?: Array<{
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    status: string;
  }>;
}

export function MapboxMap({
  center = [-74.006, 40.7128], // NYC default
  zoom = 13,
  onMapLoad,
  properties = [],
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set the access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Call onMapLoad callback
    map.current.on('load', () => {
      if (map.current && onMapLoad) {
        onMapLoad(map.current);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !properties.length) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.property-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each property
    properties.forEach((property) => {
      const color =
        property.status === 'PENDING' ? '#ef4444' :
        property.status === 'IN_PROGRESS' ? '#eab308' :
        property.status === 'CLEARED' ? '#22c55e' :
        '#64748b';

      const el = document.createElement('div');
      el.className = 'property-marker';
      el.style.backgroundColor = color;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${property.address}</strong><br/>
                <span style="font-size: 12px; color: #666;">
                  Status: ${property.status.replace('_', ' ')}
                </span>
              </div>
            `)
        )
        .addTo(map.current!);
    });
  }, [properties]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
