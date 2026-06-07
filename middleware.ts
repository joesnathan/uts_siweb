import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // OPERASIONAL: Memeriksa dan memisahkan rute halaman dasbor admin dengan rute API internal logistik kargo yang memerlukan proteksi keamanan.
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isProtectedApiRoute = 
    (pathname.startsWith('/api/') || pathname === '/api') &&
    !pathname.startsWith('/api/login') &&
    !pathname.startsWith('/api/seed') &&
    !pathname.startsWith('/api/logout') &&
    !pathname.startsWith('/api/recovery');

  if (isDashboardRoute || isProtectedApiRoute) {
    const session = request.cookies.get('session')?.value;
    const user = session ? await verifyToken(session) : null;

    if (!user) {
      if (isDashboardRoute) {
        // OPERASIONAL: Menghalangi akses ilegal ke URL dasbor secara senyap dengan menulis ulang (rewrite) request ke halaman 404. Pengguna luar akan melihat halaman tidak ditemukan sehingga tidak mengetahui keberadaan rute admin.
        return NextResponse.rewrite(new URL('/not-found', request.url));
      } else {
        // OPERASIONAL: Mengembalikan respon HTTP 401 Unauthorized dalam format JSON untuk menghentikan akses API tidak sah.
        return NextResponse.json(
          { success: false, error: 'Otorisasi diperlukan (Unauthorized)' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

// OPERASIONAL: Mengatur matcher global Next.js agar middleware hanya memproses rute dasbor dan rute API.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};

