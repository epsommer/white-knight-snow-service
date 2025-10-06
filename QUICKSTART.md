# Quick Start Guide

Get White Knight Snow Service running in 5 minutes!

## 1. Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL running (`psql --version`)
- ✅ A Mapbox account (free at https://mapbox.com)

## 2. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb white_knight

# Or using pgAdmin or your preferred tool
```

## 3. Environment Configuration

Update `.env.local` with your settings:

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/white_knight"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your_mapbox_token_here"
```

**Get your Mapbox token:**
1. Go to https://mapbox.com
2. Sign up (free)
3. Go to Account → Tokens
4. Copy your default public token
5. Paste into `.env.local`

## 4. Install & Initialize

```bash
# Install dependencies (already done if following the main README)
npm install

# Initialize database
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

## 5. Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 6. Login

Use these credentials:

**Admin Dashboard:**
- Email: `admin@whiteknight.com`
- Password: `admin123`

**Driver View:**
- Email: `driver1@whiteknight.com`
- Password: `driver123`

**Client View:**
- Email: `client1@example.com`
- Password: `client123`

## 7. Explore Features

1. **Dashboard**: See the 3D map with property markers
2. **Click properties**: View details
3. **Real-time indicator**: Green dot = connected
4. **Sidebar navigation**: Explore different sections

## Troubleshooting

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env.local`
- Test connection: `psql $DATABASE_URL`

### "Mapbox not loading"
- Check NEXT_PUBLIC_MAPBOX_TOKEN is set correctly
- Token must start with `pk.`
- Test token at: https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=YOUR_TOKEN

### "Three.js not rendering"
- Check browser console for errors
- Try Chrome/Firefox (best WebGL support)
- Update graphics drivers

## What's Working

✅ 3D property visualization
✅ Real-time WebSocket connection
✅ Color-coded status (red/yellow/green)
✅ Interactive property cards
✅ Dashboard statistics
✅ Role-based authentication

## Next Actions

1. **Add more properties**: Use the Properties page (coming in future phases)
2. **Test real-time**: Open in two browser windows, update a property
3. **Check Prisma Studio**: Run `npm run prisma:studio` to view data
4. **Explore API**: Try API routes in Postman/curl

## Sample API Calls

**Get all properties:**
```bash
curl http://localhost:3000/api/properties
```

**Create a property:**
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "address": "999 Test St, New York, NY",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "userId": "YOUR_USER_ID",
    "snowDepth": 5.5
  }'
```

## Getting Help

- Check the main README.md for detailed documentation
- View the implementation prompt for architecture details
- Open an issue if you encounter problems

## Performance Tips

- **Slow 3D rendering?** Reduce properties or simplify geometry
- **Database slow?** Add indexes (covered in future phases)
- **Socket disconnecting?** Check firewall settings

Enjoy building with White Knight Snow Service! ❄️
