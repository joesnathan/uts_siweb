import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // OPERASIONAL: Menghapus token otentikasi di browser klien dengan memaksa masa aktif cookie 'session' menjadi nol (kedaluwarsa seketika).
  response.cookies.set('session', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  return response;
}

