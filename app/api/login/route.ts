import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { signToken } from '../../lib/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();  

    const users = await sql`
      SELECT id, username, email, full_name, operator_id, department 
      FROM users 
      WHERE (email = ${email} OR username = ${email})
        AND password = ${password}
      LIMIT 1;
    `;

    if (users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Username/Email atau Password salah!" 
      });
    }

    const userPayload = {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      full_name: users[0].full_name,
      department: users[0].department
    };

    const token = await signToken(userPayload);
    const response = NextResponse.json({ 
      success: true, 
      user: users[0] 
    });

    // OPERASIONAL: Menyimpan token JWT hasil otentikasi ke dalam cookie berlabel 'session' dengan bendera HTTP-only untuk proteksi terhadap pencurian skrip jahat (XSS).
    response.cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // OPERASIONAL: Menentukan batas kedaluwarsa cookie sesi kargo agar berlaku selama tepat 1 hari.
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Terjadi kesalahan server" 
    });
  }
}