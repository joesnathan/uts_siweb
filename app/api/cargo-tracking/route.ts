import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cargoId = searchParams.get('cargoId');

  if (!cargoId) {
    return NextResponse.json({ success: false, error: 'ID kargo wajib disertakan.' }, { status: 400 });
  }

  const numericCargoId = Number(cargoId);
  if (isNaN(numericCargoId)) {
    return NextResponse.json({ success: false, error: 'ID kargo tidak valid.' }, { status: 400 });
  }

  try {
    const data = await sql`
      SELECT id, cargo_id, current_location, update_time, description 
      FROM cargo_tracking 
      WHERE cargo_id = ${numericCargoId} 
      ORDER BY update_time DESC
    `;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    // TODO(security): Log detailed error server-side, but keep user error message generic
    console.error('Database Error in GET /api/cargo-tracking:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil riwayat pelacakan.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cargoId, current_location, description } = body;

    if (!cargoId || !current_location || !description) {
      return NextResponse.json({ success: false, error: 'Semua kolom input (ID kargo, lokasi, deskripsi) wajib diisi.' }, { status: 400 });
    }

    const numericCargoId = Number(cargoId);
    if (isNaN(numericCargoId)) {
      return NextResponse.json({ success: false, error: 'ID kargo tidak valid.' }, { status: 400 });
    }

    const trimmedLocation = current_location.trim();
    const trimmedDescription = description.trim();

    if (!trimmedLocation || !trimmedDescription) {
      return NextResponse.json({ success: false, error: 'Lokasi dan deskripsi tidak boleh kosong.' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO cargo_tracking (cargo_id, current_location, description)
      VALUES (${numericCargoId}, ${trimmedLocation}, ${trimmedDescription})
      RETURNING id, cargo_id, current_location, update_time, description
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    // TODO(security): Log detailed error server-side, but keep user error message generic
    console.error('Database Error in POST /api/cargo-tracking:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan log pelacakan baru.' }, { status: 500 });
  }
}
