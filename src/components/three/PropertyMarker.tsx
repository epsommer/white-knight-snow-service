'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PropertyData } from './SnowMap';

interface PropertyMarkerProps {
  property: PropertyData;
  position: [number, number, number];
  onClick?: () => void;
}

// Color based on status
const getColorByStatus = (status: PropertyData['status']): string => {
  switch (status) {
    case 'PENDING':
      return '#ef4444'; // Red
    case 'IN_PROGRESS':
      return '#eab308'; // Yellow
    case 'CLEARED':
      return '#22c55e'; // Green
    case 'SKIPPED':
      return '#64748b'; // Gray
    default:
      return '#ef4444';
  }
};

export function PropertyMarker({ property, position, onClick }: PropertyMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Height based on snow depth (scaled)
  const height = Math.max(2, property.snowDepth * 5 + 2);
  const baseHeight = height / 2;

  // Animate hovered state
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = baseHeight + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    } else if (meshRef.current) {
      meshRef.current.position.y = baseHeight;
    }
  });

  const color = getColorByStatus(property.status);

  return (
    <group position={position}>
      {/* Main property box */}
      <mesh
        ref={meshRef}
        position={[0, baseHeight, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[8, height, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html position={[0, height + 5, 0]} center>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{property.address}</div>
            <div className="text-xs text-gray-300 mt-1">
              Status: {property.status.replace('_', ' ')}
            </div>
            <div className="text-xs text-gray-300">
              Snow Depth: {property.snowDepth.toFixed(1)}"
            </div>
          </div>
        </Html>
      )}

      {/* Base platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
