import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. POST: Melakukan validasi identitas operator & menyimpan keluhan
export async function POST(request: NextRequest) {
  try {
    const { full_name, operator_id, department, issue_detail } = await request.json();

    // Validasi input kosong
    if (!full_name?.trim() || !operator_id?.trim() || !department?.trim() || !issue_detail?.trim()) {
      return NextResponse.json({
        success: false,
        error: "Semua kolom verifikasi dan keluhan wajib diisi!"
      }, { status: 400 });
    }

    // PENCARIAN & VALIDASI DINAMIS: Mengecek apakah operator terdaftar di tabel users
    const users = await sql`
      SELECT id 
      FROM users 
      WHERE LOWER(full_name) = LOWER(${full_name.trim()})
        AND LOWER(operator_id) = LOWER(${operator_id.trim()})
        AND LOWER(department) = LOWER(${department.trim()})
      LIMIT 1;
    `;

    // Jika tidak ditemukan operator yang cocok
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Identitas operator tidak terdaftar atau tidak cocok dengan sistem IT!"
      }, { status: 400 });
    }

    const matchedUser = users[0];

    // INSERT DATABASE: Menyimpan keluhan ke tabel recovery_requests yang terhubung relasional
    const result = await sql`
      INSERT INTO recovery_requests (user_id, full_name, operator_id, department, issue_detail)
      VALUES (
        ${matchedUser.id}, 
        ${full_name.trim()}, 
        ${operator_id.trim()}, 
        ${department.trim()}, 
        ${issue_detail.trim()}
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Verifikasi identitas sukses. Keluhan Anda telah dicatat di database IT!",
      data: result[0]
    });

  } catch (error: any) {
    console.error("Account Recovery Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Terjadi kesalahan server"
    }, { status: 500 });
  }
}

// 2. GET: Mengizinkan IT Administrator untuk mengecek seluruh keluhan yang masuk
export async function GET() {
  try {
    const requests = await sql`
      SELECT * 
      FROM recovery_requests 
      ORDER BY id DESC;
    `;
    return NextResponse.json({
      success: true,
      data: requests
    });
  } catch (error: any) {
    console.error("Fetch Recovery Requests Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Gagal mengambil data keluhan"
    }, { status: 500 });
  }
}
