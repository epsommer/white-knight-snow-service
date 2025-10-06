# Development Guide

## Before You Start

### 1. Environment Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Node.js 18+ installed
- [ ] Mapbox account created (free tier)
- [ ] `.env.local` configured with your credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run prisma:push`)
- [ ] Database seeded (`npm run prisma:seed`)

### 2. Verify Installation

```bash
# Check Node version
node --version  # Should be 18+

# Check PostgreSQL
psql --version  # Should be 12+
pg_isready      # Should say "accepting connections"

# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Prisma
npx prisma --version

# Verify packages
npm list --depth=0
```

## Development Workflow

### Daily Startup

```bash
# 1. Start PostgreSQL (if not running)
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start PostgreSQL service

# 2. Pull latest changes (if using git)
git pull

# 3. Install any new dependencies
npm install

# 4. Run database migrations (if any)
npm run prisma:generate
npm run prisma:push

# 5. Start development server
npm run dev
```

### Working with the Database

```bash
# View/edit data in GUI
npm run prisma:studio

# Generate Prisma client after schema changes
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-seed database
npm run prisma:seed
```

### Testing the Application

**Manual Testing Checklist:**

Authentication:
- [ ] Admin login works
- [ ] Driver login works
- [ ] Client login works
- [ ] Logout works
- [ ] Session persists on refresh

Dashboard:
- [ ] 3D map loads
- [ ] Properties render with correct colors
- [ ] Statistics cards show correct counts
- [ ] Property list displays
- [ ] Clicking properties works
- [ ] WebSocket shows connected (green dot)

API Routes:
- [ ] GET /api/properties returns data
- [ ] POST /api/properties creates property
- [ ] PATCH /api/properties/[id] updates property
- [ ] GET /api/fleet returns vehicles
- [ ] GET /api/drivers returns drivers

Real-time:
- [ ] Open two browser windows
- [ ] Update property status in one
- [ ] Verify other window updates

## Common Development Tasks

### Adding a New API Route

1. Create route file: `src/app/api/[resource]/route.ts`
2. Implement GET/POST methods
3. Add TypeScript types
4. Test with curl or Postman

Example:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const data = await prisma.yourModel.findMany();
  return NextResponse.json({ data });
}
```

### Adding a New Component

1. Create file in appropriate directory
2. Use TypeScript for props
3. Import from index if creating a barrel export
4. Add to dashboard layout

Example:
```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Modifying the Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:push`
4. Update seed script if needed
5. Test with Prisma Studio

### Adding a Real-time Event

Server side (`src/lib/socket.ts`):
```typescript
export function emitNewEvent(data: any) {
  if (io) {
    io.to('dashboard').emit('new-event', data);
  }
}
```

Client side (in component):
```typescript
useSocketEvent(socket, 'new-event', (data) => {
  console.log('Received:', data);
  // Handle event
});
```

### Adding a New Page

1. Create directory: `src/app/(dashboard)/[page-name]/`
2. Add `page.tsx`
3. Add to sidebar menu: `src/components/dashboard/Sidebar.tsx`
4. Test navigation

## Debugging Tips

### Database Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep white_knight

# Test connection
psql $DATABASE_URL

# View Prisma logs
# Add to schema.prisma:
# generator client {
#   provider = "prisma-client-js"
#   log      = ["query", "info", "warn", "error"]
# }
```

### Three.js Issues

```javascript
// Add to component for debugging
useEffect(() => {
  console.log('Properties:', properties);
  console.log('Canvas mounted');
}, [properties]);

// Check WebGL support
console.log('WebGL:', !!document.createElement('canvas').getContext('webgl'));
```

### WebSocket Issues

```javascript
// Add logging to useSocket hook
socket.on('connect', () => {
  console.log('Socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Check Socket.io server logs
// Should see "Client connected: [socket-id]"
```

### Next.js Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -ti:3000 | xargs kill -9
```

## Code Quality

### Before Committing

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Check TypeScript
npx tsc --noEmit

# Format code (if using Prettier)
npx prettier --write .
```

### TypeScript Best Practices

- ❌ Avoid `any` type
- ✅ Use proper interfaces and types
- ✅ Enable strict mode
- ✅ Use type inference when possible
- ✅ Export types from components

### Component Best Practices

- ✅ Use `'use client'` only when needed
- ✅ Prefer Server Components by default
- ✅ Extract reusable logic to hooks
- ✅ Use proper TypeScript props
- ✅ Add error boundaries

## Performance Monitoring

### Three.js Performance

```javascript
// Add FPS monitor
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* Your scene */}
</Canvas>
```

### Network Performance

Open Chrome DevTools:
- Network tab: Check API response times
- Performance tab: Record and analyze rendering
- Console: Watch for errors/warnings

### Database Performance

```bash
# Enable query logging in Prisma
# Check slow queries
# Add indexes if needed
```

## Environment Variables

**Required:**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."
```

**Optional:**
```env
REDIS_URL="redis://localhost:6379"
NODE_ENV="development"
```

## Useful VS Code Extensions

- ESLint
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Error Translator
- GitLens (if using Git)

## Keyboard Shortcuts (in browser)

- `Cmd+K` or `Ctrl+K`: Open search (when implemented)
- `Cmd+Shift+R` or `Ctrl+Shift+R`: Hard refresh
- `Cmd+Option+I` or `F12`: Open DevTools

## Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- Three.js Docs: https://threejs.org/docs
- Mapbox Docs: https://docs.mapbox.com
- Socket.io Docs: https://socket.io/docs

## Getting Help

1. Check console for errors
2. Review relevant docs
3. Check GitHub issues
4. Ask in Discord/Slack (if available)

## Production Deployment (Future)

Phase 1 is development-ready. Production deployment will be covered in later phases with:
- Environment variables for production
- Database migrations
- CDN configuration
- Monitoring setup
- Error tracking (Sentry)
- Performance monitoring

---

**Happy Coding!** 🚀
