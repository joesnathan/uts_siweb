
import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

// ✅ Hardcoded connection string dari Neon kamu
const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  max: 1 
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'seed') {
    try {
      await sql.begin(async (sql) => {
        // Hapus tabel lama
        await sql`DROP TABLE IF EXISTS cargo_logs CASCADE;`;
        await sql`DROP TABLE IF EXISTS cargo CASCADE;`;

        // Buat tabel baru
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

        // Insert data dummy
        await sql`
          INSERT INTO cargo (manifest_id, airline_name, flight_code, route, weight, flight_status, operational_status, date, scheduled_time, actual_time, gate, items)
          VALUES 
            ('MNF-2026-001', 'GARUDA INDONESIA', 'GA-888', 'CGK-DPS', 3250.00, 'Landed', 'Completed', '2026-05-26', '17:15', '17:20', 'A12', 45),
            ('MNF-2026-002', 'SRIWIJAYA AIR', 'SJ-555', 'CGK-SUB', 2150.00, 'Airborne', 'In progress', '2026-05-26', '18:30', '18:30', 'B08', 32),
            ('MNF-2026-003', 'LION AIR', 'JT-100', 'CGK-KNO', 1890.00, 'Delayed', 'Pending', '2026-05-26', '19:00', '19:15', 'C05', 28),
            ('MNF-2026-004', 'BATIK AIR', 'ID-600', 'CGK-SIN', 4120.00, 'Landed', 'Completed', '2026-05-26', '19:45', '19:45', 'A15', 38),
            ('MNF-2026-005', 'CITILINK', 'QG-310', 'CGK-JOG', 1200.00, 'Delayed', 'Pending', '2026-05-26', '21:00', '21:30', 'C02', 25),
            ('MNF-2026-006', 'GARUDA INDONESIA', 'GA-412', 'CGK-DPS', 2400.00, 'Airborne', 'In progress', '2026-05-26', '22:00', '22:00', 'A14', 40),
            ('MNF-2026-007', 'LION AIR', 'JT-204', 'CGK-KNO', 3100.00, 'Landed', 'Completed', '2026-05-26', '08:00', '08:10', 'B05', 35),
            ('MNF-2026-008', 'BATIK AIR', 'ID-682', 'CGK-SUB', 2200.00, 'Scheduled', 'Pending', '2026-05-26', '09:30', '09:30', 'C03', 18),
            ('MNF-2026-009', 'CITILINK', 'QG-102', 'CGK-DPS', 1900.00, 'Airborne', 'In progress', '2026-05-26', '10:45', '10:45', 'A11', 22),
            ('MNF-2026-010', 'SRIWIJAYA AIR', 'SJ-182', 'CGK-PNK', 2500.00, 'Landed', 'Completed', '2026-05-26', '12:00', '12:05', 'B02', 28),
            ('MNF-2026-011', 'GARUDA INDONESIA', 'GA-889', 'CGK-DPS', 3400.00, 'Scheduled', 'Pending', '2026-05-27', '17:15', '17:15', 'A12', 48),
            ('MNF-2026-012', 'LION AIR', 'JT-101', 'CGK-KNO', 2100.00, 'Airborne', 'Pending', '2026-05-27', '18:00', '18:00', 'C05', 21),
            ('MNF-2026-013', 'BATIK AIR', 'ID-601', 'CGK-SUB', 1600.00, 'Landed', 'Completed', '2026-05-27', '19:00', '19:00', 'B01', 31),
            ('MNF-2026-014', 'SRIWIJAYA AIR', 'SJ-221', 'CGK-BPN', 1950.00, 'Scheduled', 'Pending', '2026-05-27', '20:15', '20:15', 'A03', 16),
            ('MNF-2026-015', 'CITILINK', 'QG-311', 'CGK-JOG', 1300.00, 'Delayed', 'Pending', '2026-05-27', '21:00', '21:30', 'C02', 26),
            ('MNF-2026-016', 'GARUDA INDONESIA', 'GA-413', 'CGK-DPS', 2500.00, 'Airborne', 'In progress', '2026-05-27', '22:00', '22:00', 'A14', 41),
            ('MNF-2026-017', 'LION AIR', 'JT-205', 'CGK-KNO', 3200.00, 'Landed', 'Completed', '2026-05-27', '08:00', '08:10', 'B05', 36),
            ('MNF-2026-018', 'BATIK AIR', 'ID-683', 'CGK-SUB', 2300.00, 'Scheduled', 'Pending', '2026-05-27', '09:30', '09:30', 'C03', 19),
            ('MNF-2026-019', 'CITILINK', 'QG-103', 'CGK-DPS', 2000.00, 'Airborne', 'In progress', '2026-05-27', '10:45', '10:45', 'A11', 23),
            ('MNF-2026-020', 'SRIWIJAYA AIR', 'SJ-183', 'CGK-PNK', 2600.00, 'Landed', 'Completed', '2026-05-27', '12:00', '12:05', 'B02', 29);
        `;

        await sql`
          INSERT INTO cargo_logs (flight, airline, date, route, scheduled, actual, gate, items, status)
          VALUES 
            ('GA-888', 'GARUDA INDONESIA', '2026-05-21', 'CGK-DPS', '17:15', '17:20', 'A12', 45, 'Landed'),
            ('SJ-555', 'SRIWIJAYA AIR', '2026-05-21', 'CGK-SUB', '18:30', '18:30', 'B08', 32, 'Airborne'),
            ('JT-100', 'LION AIR', '2026-05-21', 'CGK-KNO', '19:00', '19:15', 'C05', 28, 'Delayed');
        `;
      });

      return NextResponse.json({ success: true, message: '✅ Database berhasil di-seed!' });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // Default: Ambil data untuk dashboard
  const data = await sql`SELECT * FROM cargo ORDER BY id DESC`;
  return NextResponse.json({ success: true, data });
}