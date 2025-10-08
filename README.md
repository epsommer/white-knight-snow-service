# White Knight Snow Service - Phase 1

Real-time snow removal tracking and management platform with 3D visualization.

## Features Implemented (Phase 1)

✅ Next.js 14+ with TypeScript and App Router
✅ PostgreSQL database with Prisma ORM
✅ NextAuth.js authentication with role-based access (Admin, Driver, Client)
✅ Three.js 3D map with interactive property markers
✅ Mapbox GL JS integration
✅ WebSocket real-time updates with Socket.io
✅ Responsive dashboard with sidebar navigation
✅ RESTful API routes for all entities
✅ Seed data for testing

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Maps**: Mapbox GL JS
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Real-time**: Socket.io
- **State**: Zustand

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Mapbox API token (free tier works)

## Installation

1. **Clone and install dependencies:**

```bash
cd white-knight
npm install
```

2. **Set up environment variables:**

Edit `.env.local` with your configuration:

```env
# Database - Update with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/white_knight"

# NextAuth - Generate a secret: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"

# Redis (optional for Phase 1)
REDIS_URL="redis://localhost:6379"

# Mapbox - Get token from https://mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN="your_mapbox_token_here"

# WebSocket
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

3. **Set up the database:**

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed with sample data
npm run prisma:seed
```

## Running the Application

**Development mode:**

```bash
npm run dev
```

Visit `http://localhost:3000`

**Production mode:**

```bash
npm run build
npm start
```

## Default Users (from seed data)

| Role   | Email                      | Password   |
|--------|----------------------------|------------|
| Admin  | admin@whiteknight.com      | admin123   |
| Driver | driver1@whiteknight.com    | driver123  |
| Client | client1@example.com        | client123  |

## Project Structure

```
white-knight/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── (auth)/           # Auth routes
│   │   ├── (dashboard)/      # Dashboard routes
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── three/            # Three.js components
│   │   │   ├── SnowMap.tsx   # Main 3D map
│   │   │   └── PropertyMarker.tsx
│   │   ├── map/              # Mapbox components
│   │   ├── ui/               # UI components
│   │   └── dashboard/        # Dashboard components
│   ├── hooks/                # Custom React hooks
│   │   └── useSocket.ts      # Socket.io hook
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── prisma.ts         # Prisma client
│   │   ├── socket.ts         # Socket.io setup
│   │   └── utils.ts          # Utilities
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
│       └── geocoding.ts      # Mapbox geocoding
├── server.js                 # Custom server with Socket.io
└── package.json
```

## API Routes

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get property by ID
- `PATCH /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Fleet
- `GET /api/fleet` - Get all vehicles
- `POST /api/fleet` - Create vehicle
- `POST /api/fleet/[id]/position` - Update vehicle position

### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create driver

### Service Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create ticket

### Weather
- `GET /api/weather` - Get weather data
- `POST /api/weather` - Create weather entry

## Three.js Map Features

- **Color-coded properties:**
  - 🔴 Red: Pending service
  - 🟡 Yellow: In progress
  - 🟢 Green: Cleared
  - ⚫ Gray: Skipped

- **Interactive:**
  - Click properties for details
  - Hover for quick info
  - Pan, zoom, and rotate

- **Height visualization:**
  - Property height represents snow depth

## Real-time Features

The app uses Socket.io for real-time updates:

- Driver position tracking
- Property status changes
- Live dashboard updates

Events are emitted automatically when data changes via API routes.

## Database Management

**View database in Prisma Studio:**

```bash
npm run prisma:studio
```

**Reset database (warning: deletes all data):**

```bash
npx prisma migrate reset
npm run prisma:seed
```

## Development Tips

1. **Hot reload**: The dev server supports hot module replacement
2. **TypeScript**: Strict mode is enabled - no `any` types without good reason
3. **Database changes**: After modifying `schema.prisma`, run `npm run prisma:push`
4. **Socket.io**: The custom server in `server.js` handles WebSocket connections

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env.local`
- Ensure database exists

**Mapbox not loading:**
- Check NEXT_PUBLIC_MAPBOX_TOKEN is set
- Verify token is valid at mapbox.com

**Three.js performance:**
- Reduce number of properties if slow
- Check GPU acceleration is enabled
- Use Chrome DevTools Performance tab

**WebSocket connection errors:**
- Make sure you're running `npm run dev` (not `next dev`)
- Check that port 3000 is available
- See `WEBSOCKET_ERRORS.md` for detailed troubleshooting
- Note: App works fine without WebSocket (real-time is optional)

## Phase 1 Success Criteria

✅ Next.js project runs locally
✅ Database schema deployed
✅ Authentication works for all roles
✅ Three.js map renders property markers
✅ Properties CRUD via API
✅ Fleet tracking via API
✅ WebSocket real-time connection
✅ Dashboard shows map and property list
✅ Responsive layout
✅ Mapbox integration

## Next Steps (Phase 2)

- Live GPS tracking integration
- Animated truck movement on map
- Weather API integration (OpenWeather/NOAA)
- Route optimization algorithm
- Before/after photo upload
- Client portal pages
- Mobile app (React Native)

## Contributing

This is Phase 1 of a 6-phase project. See the main implementation prompt for the complete roadmap.

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
