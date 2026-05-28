import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

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

    return NextResponse.json({ 
      success: true, 
      user: users[0] 
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Terjadi kesalahan server" 
    });
  }
}