'use client';

import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { PropertyMarker } from './PropertyMarker';

export interface PropertyData {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLEARED' | 'SKIPPED';
  snowDepth: number;
}

interface SnowMapProps {
  properties: PropertyData[];
  onPropertyClick?: (property: PropertyData) => void;
  centerLat?: number;
  centerLng?: number;
}

export function SnowMap({
  properties,
  onPropertyClick,
  centerLat = 40.7128,
  centerLng = -74.0060
}: SnowMapProps) {
  // Convert lat/lng to 3D positions (simplified projection)
  const convertToPosition = (lat: number, lng: number): [number, number, number] => {
    // Scale factor for visualization
    const scale = 1000;
    const x = (lng - centerLng) * scale;
    const z = (lat - centerLat) * scale;
    return [x, 0, z];
  };

  // Convert properties to positioned markers
  const markers = useMemo(() => {
    return properties.map(property => ({
      ...property,
      position: convertToPosition(property.latitude, property.longitude),
    }));
  }, [properties, centerLat, centerLng]);

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        {/* Camera setup - orthographic-style perspective */}
        <PerspectiveCamera makeDefault position={[0, 500, 500]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[100, 100, 50]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight intensity={0.3} groundColor="#444444" />

        {/* Grid helper for reference */}
        <gridHelper args={[2000, 40, '#444444', '#222222']} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[2000, 2000]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Property markers */}
        {markers.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            position={property.position}
            onClick={() => onPropertyClick?.(property)}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.5} // Prevent going below ground
          minDistance={50}
          maxDistance={1000}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
