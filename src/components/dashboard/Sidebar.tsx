'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Truck,
  Users,
  ClipboardList,
  Cloud,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['ADMIN', 'DRIVER', 'CLIENT'],
  },
  {
    title: 'Battle Map',
    icon: Map,
    href: '/dashboard/map',
    roles: ['ADMIN', 'DRIVER'],
  },
  {
    title: 'Fleet',
    icon: Truck,
    href: '/dashboard/fleet',
    roles: ['ADMIN'],
  },
  {
    title: 'Drivers',
    icon: Users,
    href: '/dashboard/drivers',
    roles: ['ADMIN'],
  },
  {
    title: 'Properties',
    icon: ClipboardList,
    href: '/dashboard/properties',
    roles: ['ADMIN', 'CLIENT'],
  },
  {
    title: 'Weather',
    icon: Cloud,
    href: '/dashboard/weather',
    roles: ['ADMIN', 'DRIVER'],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    roles: ['ADMIN', 'DRIVER', 'CLIENT'],
  },
];

export function Sidebar({ userRole = 'CLIENT' }: SidebarProps) {
  const pathname = usePathname();

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">White Knight</h1>
        <p className="text-sm text-muted-foreground">Snow Service</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <button
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => {
            // Handle logout
            window.location.href = '/api/auth/signout';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
