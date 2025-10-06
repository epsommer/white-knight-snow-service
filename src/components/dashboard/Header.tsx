'use client';

import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
}

export function Header({ title, userName = 'User', userRole = 'CLIENT' }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userName}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
