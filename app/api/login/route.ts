// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(
  "postgresql://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  { ssl: 'require', max: 1 }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();   // 'email' di sini sebenarnya input dari form (bisa username atau email)

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

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Terjadi kesalahan server" 
    });
  }
}