'use client';

import { useState, useEffect } from 'react';
import { SnowMap, PropertyData } from '@/components/three/SnowMap';
import { useSocket, useSocketEvent } from '@/hooks/useSocket';
import { Activity, Truck, MapPin, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const { socket, isConnected } = useSocket();

  // Load initial properties
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.properties) {
          setProperties(data.properties);
        }
      })
      .catch((error) => {
        console.error('Error loading properties:', error);
        // Use mock data for demonstration
        setProperties(getMockProperties());
      });
  }, []);

  // Join dashboard room for real-time updates
  useEffect(() => {
    if (socket) {
      socket.emit('join-room', 'dashboard');
    }
  }, [socket]);

  // Listen for property status updates
  useSocketEvent<{ propertyId: string; status: string }>(
    socket,
    'property-status',
    (data) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === data.propertyId
            ? { ...p, status: data.status as PropertyData['status'] }
            : p
        )
      );
    }
  );

  const stats = {
    total: properties.length,
    pending: properties.filter((p) => p.status === 'PENDING').length,
    inProgress: properties.filter((p) => p.status === 'IN_PROGRESS').length,
    cleared: properties.filter((p) => p.status === 'CLEARED').length,
  };

  return (
    <div className="h-full flex gap-6">
      {/* Main map area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Total Properties"
            value={stats.total}
            icon={<MapPin className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<AlertCircle className="w-5 h-5" />}
            color="red"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Activity className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            title="Cleared"
            value={stats.cleared}
            icon={<Truck className="w-5 h-5" />}
            color="green"
          />
        </div>

        {/* 3D Map */}
        <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <SnowMap
            properties={properties}
            onPropertyClick={setSelectedProperty}
            centerLat={40.7128}
            centerLng={-74.006}
          />
        </div>
      </div>

      {/* Sidebar - Property list */}
      <div className="w-80 bg-card rounded-lg border border-border p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Properties</h3>
        <div className="space-y-2">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
          {properties.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No properties found. Add some properties to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'yellow' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    red: 'bg-red-500/10 text-red-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    green: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  isSelected,
  onClick,
}: {
  property: PropertyData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    PENDING: 'bg-red-500',
    IN_PROGRESS: 'bg-yellow-500',
    CLEARED: 'bg-green-500',
    SKIPPED: 'bg-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{property.address}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Snow: {property.snowDepth.toFixed(1)}&quot;
          </p>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${statusColors[property.status]} flex-shrink-0 mt-1`}
        ></div>
      </div>
    </button>
  );
}

// Mock data for demonstration
function getMockProperties(): PropertyData[] {
  return [
    {
      id: '1',
      address: '123 Main St, New York, NY',
      latitude: 40.7128,
      longitude: -74.006,
      status: 'PENDING',
      snowDepth: 6.5,
    },
    {
      id: '2',
      address: '456 Oak Ave, New York, NY',
      latitude: 40.7138,
      longitude: -74.005,
      status: 'IN_PROGRESS',
      snowDepth: 4.2,
    },
    {
      id: '3',
      address: '789 Pine Rd, New York, NY',
      latitude: 40.7118,
      longitude: -74.007,
      status: 'CLEARED',
      snowDepth: 2.1,
    },
    {
      id: '4',
      address: '321 Elm St, New York, NY',
      latitude: 40.7148,
      longitude: -74.006,
      status: 'PENDING',
      snowDepth: 8.3,
    },
    {
      id: '5',
      address: '654 Maple Dr, New York, NY',
      latitude: 40.7108,
      longitude: -74.008,
      status: 'PENDING',
      snowDepth: 5.7,
    },
  ];
}
