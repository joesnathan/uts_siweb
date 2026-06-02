import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchId = searchParams.get('searchId');

  if (searchId) {
    try {
      const cargoResult = await sql`SELECT * FROM cargo WHERE manifest_id = ${searchId}`;
      if (cargoResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Manifest tidak ditemukan' });
      }
      const cargo = cargoResult[0];
      const history = await sql`SELECT * FROM cargo_tracking WHERE cargo_id = ${cargo.id} ORDER BY update_time DESC`;
      return NextResponse.json({ success: true, cargo, history });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  if (searchParams.get('action') !== 'seed') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    await sql.begin(async (tx) => {
      await tx`DROP TABLE IF EXISTS recovery_requests CASCADE;`;
      await tx`DROP TABLE IF EXISTS cargo_tracking CASCADE;`;
      await tx`DROP TABLE IF EXISTS users CASCADE;`;
      await tx`DROP TABLE IF EXISTS cargo CASCADE;`;

      await tx`
        CREATE TABLE cargo (
          id SERIAL PRIMARY KEY,
          manifest_id TEXT UNIQUE NOT NULL,
          airline_name TEXT,
          flight_code TEXT,
          route TEXT,
          weight NUMERIC,
          flight_status TEXT,
          operational_status TEXT,
          date TEXT,
          scheduled_time TEXT,
          actual_time TEXT,
          gate TEXT,
          items INTEGER,
          sender_name TEXT,
          receiver_name TEXT,
          phone_number TEXT,
          origin_city TEXT,
          destination_city TEXT,
          item_type TEXT,
          shipping_price TEXT,
          shipping_type TEXT,
          description TEXT
        );
      `;

      await tx`
        CREATE TABLE cargo_tracking (
          id SERIAL PRIMARY KEY,
          cargo_id INTEGER REFERENCES cargo(id) ON DELETE CASCADE,
          current_location VARCHAR(255) NOT NULL,
          update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          description TEXT NOT NULL
        );
      `;

      await tx`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          operator_id VARCHAR(50) NOT NULL,
          department VARCHAR(100) NOT NULL,
          password VARCHAR(100) NOT NULL
        );
      `;

      await tx`
        CREATE TABLE recovery_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(100) NOT NULL,
          operator_id VARCHAR(50) NOT NULL,
          department VARCHAR(100) NOT NULL,
          issue_detail TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      const cargoRows = await tx`
        INSERT INTO cargo (
          manifest_id, airline_name, flight_code, route, weight, flight_status, operational_status, 
          date, scheduled_time, actual_time, gate, items, sender_name, receiver_name, 
          phone_number, origin_city, destination_city, item_type, shipping_price, shipping_type, description
        ) VALUES 
        ('MNF-2026-001', 'Garuda Indonesia', 'GA-888', 'CGK-DPS', 3250, 'Landed', 'Completed', '2026-05-26', '17:15', '17:20', 'A12', 50, 'Budi', 'Siti', '08123', 'Jakarta', 'Denpasar', 'Elektronik', '32500000', 'VVIP', 'Laptop'),
        ('MNF-2026-002', 'Lion Air', 'JT-100', 'CGK-KNO', 2000, 'Airborne', 'Pending', '2026-05-26', '18:00', '18:00', 'C05', 20, 'Andi', 'Dina', '08572', 'Jakarta', 'Medan', 'Pakaian', '20000000', 'Regular', 'Baju'),
        ('MNF-2026-003', 'Batik Air', 'ID-600', 'CGK-SUB', 1500, 'Landed', 'Completed', '2026-05-26', '19:00', '19:00', 'B01', 30, 'Candra', 'Eka', '08124', 'Jakarta', 'Surabaya', 'Dokumen', '15000000', 'Regular', 'Berkas'),
        ('MNF-2026-004', 'Sriwijaya Air', 'SJ-220', 'CGK-BPN', 1800, 'Scheduled', 'Pending', '2026-05-26', '20:15', '20:15', 'A03', 15, 'Dewi', 'Fajar', '08125', 'Jakarta', 'Balikpapan', 'Suku Cadang', '27000000', 'Express', 'Sparepart'),
        ('MNF-2026-005', 'Citilink', 'QG-310', 'CGK-JOG', 1200, 'Delayed', 'Pending', '2026-05-26', '21:00', '21:30', 'C02', 25, 'Eko', 'Gita', '08126', 'Jakarta', 'Yogyakarta', 'Makanan', '12000000', 'Regular', 'Kue'),
        ('MNF-2026-006', 'Garuda Indonesia', 'GA-412', 'CGK-DPS', 2400, 'Airborne', 'In progress', '2026-05-26', '22:00', '22:00', 'A14', 40, 'Feri', 'Hana', '08127', 'Jakarta', 'Denpasar', 'Elektronik', '60000000', 'VVIP', 'HP'),
        ('MNF-2026-007', 'Lion Air', 'JT-204', 'CGK-KNO', 3100, 'Landed', 'Completed', '2026-05-26', '08:00', '08:10', 'B05', 35, 'Gani', 'Indra', '08128', 'Jakarta', 'Medan', 'Pakaian', '31000000', 'Regular', 'Kaos'),
        ('MNF-2026-008', 'Batik Air', 'ID-682', 'CGK-SUB', 2200, 'Scheduled', 'Pending', '2026-05-26', '09:30', '09:30', 'C03', 18, 'Heri', 'Joni', '08129', 'Jakarta', 'Surabaya', 'Alat Medis', '33000000', 'Express', 'Masker'),
        ('MNF-2026-009', 'Citilink', 'QG-102', 'CGK-DPS', 1900, 'Airborne', 'In progress', '2026-05-26', '10:45', '10:45', 'A11', 22, 'Iwan', 'Kiki', '08130', 'Jakarta', 'Denpasar', 'Kosmetik', '19000000', 'Regular', 'Bedak'),
        ('MNF-2026-010', 'Sriwijaya Air', 'SJ-182', 'CGK-PNK', 2500, 'Landed', 'Completed', '2026-05-26', '12:00', '12:05', 'B02', 28, 'Joko', 'Lia', '08131', 'Jakarta', 'Pontianak', 'Mesin', '62500000', 'VVIP', 'Dinamo'),
        ('MNF-2026-011', 'Garuda Indonesia', 'GA-889', 'CGK-DPS', 3400, 'Scheduled', 'Pending', '2026-05-27', '17:15', '17:15', 'A12', 48, 'Budi', 'Siti', '08123', 'Jakarta', 'Denpasar', 'Elektronik', '34000000', 'VVIP', 'Laptop'),
        ('MNF-2026-012', 'Lion Air', 'JT-101', 'CGK-KNO', 2100, 'Airborne', 'Pending', '2026-05-27', '18:00', '18:00', 'C05', 21, 'Andi', 'Dina', '08572', 'Jakarta', 'Medan', 'Pakaian', '21000000', 'Regular', 'Baju'),
        ('MNF-2026-013', 'Batik Air', 'ID-601', 'CGK-SUB', 1600, 'Landed', 'Completed', '2026-05-27', '19:00', '19:00', 'B01', 31, 'Candra', 'Eka', '08124', 'Jakarta', 'Surabaya', 'Dokumen', '16000000', 'Regular', 'Berkas'),
        ('MNF-2026-014', 'Sriwijaya Air', 'SJ-221', 'CGK-BPN', 1950, 'Scheduled', 'Pending', '2026-05-27', '20:15', '20:15', 'A03', 16, 'Dewi', 'Fajar', '08125', 'Jakarta', 'Balikpapan', 'Suku Cadang', '29250000', 'Express', 'Sparepart'),
        ('MNF-2026-015', 'Citilink', 'QG-311', 'CGK-JOG', 1300, 'Delayed', 'Pending', '2026-05-27', '21:00', '21:30', 'C02', 26, 'Eko', 'Gita', '08126', 'Jakarta', 'Yogyakarta', 'Makanan', '13000000', 'Regular', 'Kue'),
        ('MNF-2026-016', 'Garuda Indonesia', 'GA-413', 'CGK-DPS', 2500, 'Airborne', 'In progress', '2026-05-27', '22:00', '22:00', 'A14', 41, 'Feri', 'Hana', '08127', 'Jakarta', 'Denpasar', 'Elektronik', '62500000', 'VVIP', 'HP'),
        ('MNF-2026-017', 'Lion Air', 'JT-205', 'CGK-KNO', 3200, 'Landed', 'Completed', '2026-05-27', '08:00', '08:10', 'B05', 36, 'Gani', 'Indra', '08128', 'Jakarta', 'Medan', 'Pakaian', '32000000', 'Regular', 'Kaos'),
        ('MNF-2026-018', 'Batik Air', 'ID-683', 'CGK-SUB', 2300, 'Scheduled', 'Pending', '2026-05-27', '09:30', '09:30', 'C03', 19, 'Heri', 'Joni', '08129', 'Jakarta', 'Surabaya', 'Alat Medis', '34500000', 'Express', 'Masker'),
        ('MNF-2026-019', 'Citilink', 'QG-103', 'CGK-DPS', 2000, 'Airborne', 'In progress', '2026-05-27', '10:45', '10:45', 'A11', 23, 'Iwan', 'Kiki', '08130', 'Jakarta', 'Denpasar', 'Kosmetik', '20000000', 'Regular', 'Bedak'),
        ('MNF-2026-020', 'Sriwijaya Air', 'SJ-183', 'CGK-PNK', 2600, 'Landed', 'Completed', '2026-05-27', '12:00', '12:05', 'B02', 29, 'Joko', 'Lia', '08131', 'Jakarta', 'Pontianak', 'Mesin', '65000000', 'VVIP', 'Dinamo')
        RETURNING id, manifest_id;
      `;

      const cargoMap: Record<string, number> = {};
      cargoRows.forEach((row: any) => {
        cargoMap[row.manifest_id] = row.id;
      });

      const id1 = cargoMap['MNF-2026-001'];
      if (id1) {
        await tx`
          INSERT INTO cargo_tracking (cargo_id, current_location, update_time, description) VALUES
          (${id1}, 'CGK Sorting Area', '2026-05-26 10:00:00', 'Shipment manifest documentation created.'),
          (${id1}, 'CGK Cargo Terminal 3', '2026-05-26 12:30:00', 'Cargo loaded into container and sealed successfully.'),
          (${id1}, 'DPS Airport Warehouse', '2026-05-26 17:30:00', 'Cargo safely arrived at destination and picked up by customer.');
        `;
      }

      const id2 = cargoMap['MNF-2026-002'];
      if (id2) {
        await tx`
          INSERT INTO cargo_tracking (cargo_id, current_location, update_time, description) VALUES
          (${id2}, 'CGK Sorting Area', '2026-05-26 11:00:00', 'Shipment manifest documentation created.'),
          (${id2}, 'CGK Cargo Terminal 3', '2026-05-26 14:00:00', 'Cargo loaded into flight JT-100.');
        `;
      }

      await tx`
        INSERT INTO users (username, email, full_name, operator_id, department, password) VALUES
        ('admin', 'admin@terbanginaja.co.id', 'System Administrator', 'ADM-2026-001', 'HQ Operations Control', 'admin123'),
        ('operator', 'operator@terbanginaja.co.id', 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'operator123'),
        ('user', 'user@nextmail.com', 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', '123456');
      `;

      await tx`
        INSERT INTO recovery_requests (user_id, full_name, operator_id, department, issue_detail) VALUES
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Lupa password setelah libur panjang tahun baru.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Akses ke dashboard kargo lemot saat jam sibuk ekspor.'),
        (1, 'System Administrator', 'ADM-2026-001', 'HQ Operations Control', 'Request penambahan kapasitas IT cloud untuk Singapore server cluster.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Session token login sering log out otomatis setelah 5 menit idle.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Gagal mengekspor data kargo logs ke format Excel/CSV.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Salah mengetikkan ID Operator saat pendaftaran pertama kali.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Layar blank putih saat membuka manifest kargo AWB MNF-2026-012.'),
        (1, 'System Administrator', 'ADM-2026-001', 'HQ Operations Control', 'Lupa password master database cloud Neon Postgres.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Perangkat scanner manifest kargo tidak terdeteksi di Gate A12.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Meminta perubahan deskripsi departemen kargo di profile IT.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Lupa password setelah reset kebijakan IT terbaru.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Kesalahan input berat kargo pada manifest penerbangan GA-888.'),
        (1, 'System Administrator', 'ADM-2026-001', 'HQ Operations Control', 'IT backup terjadwal gagal dieksekusi secara otomatis.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Gagal memuat visual radar kargo udara GIS.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Email pekerjaan salah didaftarkan oleh admin IT.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Gagal menerima kode OTP verifikasi pemulihan password.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Layanan pemulihan akun IT Administrator lambat merespon.'),
        (1, 'System Administrator', 'ADM-2026-001', 'HQ Operations Control', 'IT support memohon pergantian email superadmin utama.'),
        (2, 'Jonathan Operator', 'OP-2026-001', 'Air Freight Support', 'Akun terblokir setelah salah memasukkan password sebanyak 3 kali.'),
        (3, 'User Nextmail', 'OP-2026-002', 'Cargo Manifest Admin', 'Pesan warning database pooler penuh muncul di log dashboard.');
      `;
    });
    return NextResponse.json({ success: true, message: 'Database BERHASIL DIRESET' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}