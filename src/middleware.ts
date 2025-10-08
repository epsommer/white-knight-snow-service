import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // Allow access to maintenance page and API routes even in maintenance mode
  const isMaintenancePage = request.nextUrl.pathname === '/maintenance';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isStaticFile = request.nextUrl.pathname.startsWith('/_next') ||
                        request.nextUrl.pathname.startsWith('/favicon');

  // If maintenance mode is on and user is not on maintenance page
  if (isMaintenanceMode && !isMaintenancePage && !isApiRoute && !isStaticFile) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // If maintenance mode is off and user is on maintenance page
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
