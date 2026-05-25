import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(
  "postgresql://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  { 
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 30
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const searchId = searchParams.get('searchId');

  // === SEED DATABASE ===
  if (action === 'seed') {
    try {
      await sql.begin(async (sql) => {
        await sql`DROP TABLE IF EXISTS cargo_logs CASCADE;`;
        await sql`DROP TABLE IF EXISTS cargo CASCADE;`;

        await sql`
          CREATE TABLE cargo (
            id SERIAL PRIMARY KEY,
            manifest_id VARCHAR(50) UNIQUE NOT NULL,
            airline_name VARCHAR(100) NOT NULL,
            flight_code VARCHAR(20) NOT NULL,
            route VARCHAR(50) NOT NULL,
            weight NUMERIC(10,2),
            flight_status VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
            operational_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
            date DATE DEFAULT CURRENT_DATE,
            scheduled_time VARCHAR(10) DEFAULT '17:15',
            actual_time VARCHAR(10) DEFAULT '17:15',
            gate VARCHAR(10),
            items INT DEFAULT 25,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        await sql`
          CREATE TABLE cargo_logs (
            id SERIAL PRIMARY KEY,
            flight VARCHAR(20) NOT NULL,
            airline VARCHAR(100) NOT NULL,
            date DATE DEFAULT CURRENT_DATE,
            route VARCHAR(50),
            scheduled VARCHAR(10),
            actual VARCHAR(10),
            gate VARCHAR(10),
            items INT,
            status VARCHAR(30)
          );
        `;

        await sql`
          INSERT INTO cargo (manifest_id, airline_name, flight_code, route, weight, flight_status, operational_status, date, scheduled_time, actual_time, gate, items)
          VALUES 
            ('MNF-2026-001', 'GARUDA INDONESIA', 'GA-888', 'CGK-DPS', 3250.00, 'Landed', 'Completed', '2026-05-21', '17:15', '17:20', 'A12', 45),
            ('MNF-2026-002', 'SRIWIJAYA AIR', 'SJ-555', 'CGK-SUB', 2150.00, 'Airborne', 'In progress', '2026-05-21', '18:30', '18:30', 'B08', 32),
            ('MNF-2026-003', 'LION AIR', 'JT-100', 'CGK-KNO', 1890.00, 'Delayed', 'Pending', '2026-05-21', '19:00', '19:15', 'C05', 28),
            ('MNF-2026-004', 'BATIK AIR', 'ID-600', 'CGK-SIN', 4120.00, 'Landed', 'Completed', '2026-05-21', '19:45', '19:45', 'A15', 38);
        `;

        await sql`
          INSERT INTO cargo_logs (flight, airline, date, route, scheduled, actual, gate, items, status)
          VALUES 
            ('GA-888', 'GARUDA INDONESIA', '2026-05-21', 'CGK-DPS', '17:15', '17:20', 'A12', 45, 'Landed');
        `;
      });

      return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error: any) {
      console.error("Seed Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // === SEARCH TRACKING ===
  if (searchId) {
    try {
      const cargoResult = await sql`
        SELECT * FROM cargo 
        WHERE UPPER(manifest_id) = UPPER(${searchId})
        LIMIT 1;
      `;

      if (cargoResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Manifest tidak ditemukan' });
      }

      // Dummy tracking history (karena tabel tracking belum dibuat)
      const history = [
        {
          current_location: "CGK Cargo Terminal",
          update_time: "2026-05-21 08:00:00",
          description: "Manifest diterima dan diverifikasi"
        },
        {
          current_location: "Aircraft Loading",
          update_time: "2026-05-21 16:30:00",
          description: "Cargo sudah dimuat ke pesawat"
        }
      ];

      return NextResponse.json({
        success: true,
        cargo: cargoResult[0],
        history
      });
    } catch (error: any) {
      console.error("Tracking Error:", error);
      return NextResponse.json({ success: false, error: "Gagal terhubung ke database" });
    }
  }

  // Default: Return all cargo
  const data = await sql`SELECT * FROM cargo ORDER BY id DESC`;
  return NextResponse.json({ success: true, data });
}