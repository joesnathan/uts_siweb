import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      // 1. Mengaktifkan ekstensi UUID generator
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

      // 2. Buat Tabel Master (Airlines, Airports, Products)
      await sql`
        CREATE TABLE IF NOT EXISTS airlines (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          airline_name VARCHAR(255) NOT NULL,
          flight_code VARCHAR(50) NOT NULL UNIQUE
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS airports (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          airport_code VARCHAR(10) NOT NULL UNIQUE,
          airport_name VARCHAR(255) NOT NULL,
          city VARCHAR(255) NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL
        );
      `;

      // 3. Buat Tabel Utama Kargo (Dashboard OPERATIONAL & FLIGHT-STATUS)
      await sql`
        CREATE TABLE IF NOT EXISTS cargo (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          manifest_id VARCHAR(50) NOT NULL UNIQUE,
          airline_id UUID NOT NULL,
          origin_airport_id UUID NOT NULL,
          destination_airport_id UUID NOT NULL,
          total_weight NUMERIC(10, 2) NOT NULL,
          flight_status VARCHAR(50) NOT NULL,
          operational_status VARCHAR(50) NOT NULL,
          shipping_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
          FOREIGN KEY (origin_airport_id) REFERENCES airports(id) ON DELETE CASCADE,
          FOREIGN KEY (destination_airport_id) REFERENCES airports(id) ON DELETE CASCADE
        );
      `;

      // 4. Buat Tabel Riwayat Posisi (Dashboard TRACKING - Relasi One-to-Many 1:N)
      await sql`
        CREATE TABLE IF NOT EXISTS cargo_tracking (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          cargo_id UUID NOT NULL,
          current_location VARCHAR(255) NOT NULL,
          update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          description TEXT NOT NULL,
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE
        );
      `;

      // 5. Buat Tabel Log Tambahan (Dashboard CARGO-LOGS - Relasi One-to-One 1:1)
      await sql`
        CREATE TABLE IF NOT EXISTS cargo_logs (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          cargo_id UUID NOT NULL UNIQUE,
          operator_name VARCHAR(255) NOT NULL,
          warehouse_gate VARCHAR(50) NOT NULL,
          temperature_control VARCHAR(50),
          seal_number VARCHAR(100) NOT NULL,
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE
        );
      `;

      // 6. Buat Junction Table untuk Relasi Many-to-Many (M:N)
      await sql`
        CREATE TABLE IF NOT EXISTS cargo_items (
          cargo_id UUID NOT NULL,
          product_id UUID NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          PRIMARY KEY (cargo_id, product_id),
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `;

      // =========================================================================
      // DATA MASTER DUMMY (Airlines, Airports, Products)
      // =========================================================================
      
      const airlinesData = [
        { id: 'a1111111-1111-1111-1111-111111111111', name: 'GARUDA INDONESIA', code: 'GA-888' },
        { id: 'a2222222-2222-2222-2222-222222222222', name: 'SRIWIJAYA AIR', code: 'SJ-555' },
        { id: 'a3333333-3333-3333-3333-333333333333', name: 'LION AIR', code: 'JT-100' },
        { id: 'a4444444-4444-4444-4444-444444444444', name: 'BATIK AIR', code: 'ID-600' },
        { id: 'a5555555-5555-5555-5555-555555555555', name: 'CITILINK', code: 'QG-210' },
        { id: 'a6666666-6666-6666-6666-666666666666', name: 'AIRASIA', code: 'QZ-777' },
        { id: 'a7777777-7777-7777-7777-777777777777', name: 'WINGS AIR', code: 'IW-300' },
        { id: 'a8888888-8888-8888-8888-888888888888', name: 'SUPER AIR JET', code: 'IU-450' },
        { id: 'a9999999-9999-9999-9999-999999999999', name: 'PELITA AIR', code: 'IP-200' },
        { id: 'a1010101-1010-1010-1010-101010101010', name: 'SCOOT AIR', code: 'TR-120' }
      ];
      for (const air of airlinesData) {
        await sql`
          INSERT INTO airlines (id, airline_name, flight_code) 
          VALUES (${air.id}, ${air.name}, ${air.code}) ON CONFLICT (id) DO NOTHING;
        `;
      }

      const airportsData = [
        { id: 'ap111111-1111-1111-1111-111111111111', code: 'CGK', name: 'Soekarno-Hatta Intl', city: 'Jakarta' },
        { id: 'ap222222-2222-2222-2222-222222222222', code: 'DPS', name: 'Ngurah Rai Intl', city: 'Bali' },
        { id: 'ap333333-3333-3333-3333-333333333333', code: 'SUB', name: 'Juanda Intl', city: 'Surabaya' },
        { id: 'ap444444-4444-4444-4444-444444444444', code: 'KNO', name: 'Kualanamu Intl', city: 'Medan' },
        { id: 'ap555555-5555-5555-5555-555555555555', code: 'SIN', name: 'Changi Airport', city: 'Singapore' },
        { id: 'ap666666-6666-6666-6666-666666666666', code: 'JOG', name: 'Yogyakarta Intl', city: 'Yogyakarta' },
        { id: 'ap777777-7777-7777-7777-777777777777', code: 'BPN', name: 'Sultan Aji Message', city: 'Balikpapan' },
        { id: 'ap888888-8888-8888-8888-888888888888', code: 'UPG', name: 'Sultan Hasanuddin', city: 'Makassar' },
        { id: 'ap999999-9999-9999-9999-999999999999', code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur' },
        { id: 'ap101010-1010-1010-1010-101010101010', code: 'SRG', name: 'Ahmad Yani Intl', city: 'Semarang' }
      ];
      for (const ap of airportsData) {
        await sql`
          INSERT INTO airports (id, airport_code, airport_name, city) 
          VALUES (${ap.id}, ${ap.code}, ${ap.name}, ${ap.city}) ON CONFLICT (id) DO NOTHING;
        `;
      }

      const productsData = [
        { id: 'p1111111-1111-1111-1111-111111111111', name: 'Electronic Parts', cat: 'General Cargo' },
        { id: 'p2222222-2222-2222-2222-222222222222', name: 'Fresh Seafood', cat: 'Perishable' },
        { id: 'p3333333-3333-3333-3333-333333333333', name: 'Vaccines & Medical', cat: 'Pharma' },
        { id: 'p4444444-4444-4444-4444-444444444444', name: 'Textiles & Garments', cat: 'General Cargo' },
        { id: 'p5555555-5555-5555-5555-555555555555', name: 'Live Tropical Fish', cat: 'Live Animals' },
        { id: 'p6666666-6666-6666-6666-666666666666', name: 'Lithium Batteries', cat: 'Dangerous Goods' },
        { id: 'p7777777-7777-7777-7777-777777777777', name: 'Automotive Spares', cat: 'General Cargo' },
        { id: 'p8888888-8888-8888-8888-888888888888', name: 'Fresh Mangosteen', cat: 'Perishable' },
        { id: 'p9999999-9999-9999-9999-999999999999', name: 'Documents & Diplomatic', cat: 'Courier' },
        { id: 'p1010101-1010-1010-1010-101010101010', name: 'Luxury Watches', cat: 'Valuable Cargo' }
      ];
      for (const prod of productsData) {
        await sql`
          INSERT INTO products (id, product_name, category) 
          VALUES (${prod.id}, ${prod.name}, ${prod.cat}) ON CONFLICT (id) DO NOTHING;
        `;
      }

      // =========================================================================
      // SEED 10 DATA TRANSAKSI LENGKAP (Dashboard Operational, Flight Status, Tracking, Cargo Logs, Items)
      // =========================================================================
      
      const cargoData = [
        { id: 'f1111111-1111-1111-1111-111111111111', mid: 'MNF-2026-001', aid: 'a1111111-1111-1111-1111-111111111111', o: 'ap111111-1111-1111-1111-111111111111', d: 'ap222222-2222-2222-2222-222222222222', w: 3250.00, fs: 'Landed', os: 'Completed' },
        { id: 'f2222222-2222-2222-2222-222222222222', mid: 'MNF-2026-002', aid: 'a2222222-2222-2222-2222-222222222222', o: 'ap111111-1111-1111-1111-111111111111', d: 'ap333333-3333-3333-3333-333333333333', w: 2150.00, fs: 'Airborne', os: 'In progress' },
        { id: 'f3333333-3333-3333-3333-333333333333', mid: 'MNF-2026-003', aid: 'a3333333-3333-3333-3333-333333333333', o: 'ap111111-1111-1111-1111-111111111111', d: 'ap444444-4444-4444-4444-444444444444', w: 1890.00, fs: 'Scheduled', os: 'Pending' },
        { id: 'f4444444-4444-4444-4444-444444444444', mid: 'MNF-2026-004', aid: 'a4444444-4444-4444-4444-444444444444', o: 'ap111111-1111-1111-1111-111111111111', d: 'ap555555-5555-5555-5555-555555555555', w: 4120.00, fs: 'Landed', os: 'Completed' },
        { id: 'f5555555-5555-5555-5555-555555555555', mid: 'MNF-2026-005', aid: 'a5555555-5555-5555-5555-555555555555', o: 'ap111111-1111-1111-1111-111111111111', d: 'ap666666-6666-6666-6666-666666666666', w: 950.00,  fs: 'Airborne', os: 'In progress' },
        { id: 'f6666666-6666-6666-6666-666666666666', mid: 'MNF-2026-006', aid: 'a6666666-6666-6666-6666-666666666666', o: 'ap333333-3333-3333-3333-333333333333', d: 'ap777777-7777-7777-7777-777777777777', w: 1500.00, fs: 'Delayed', os: 'Pending' },
        { id: 'f7777777-7777-7777-7777-777777777777', mid: 'MNF-2026-007', aid: 'a7777777-7777-7777-7777-777777777777', o: 'ap222222-2222-2222-2222-222222222222', d: 'ap111111-1111-1111-1111-111111111111', w: 2800.00, fs: 'Landed', os: 'Completed' },
        { id: 'f8888888-8888-8888-8888-888888888888', mid: 'MNF-2026-008', aid: 'a8888888-8888-8888-8888-888888888888', o: 'ap333333-3333-3333-3333-333333333333', d: 'ap444444-4444-4444-4444-444444444444', w: 3600.00, fs: 'Airborne', os: 'In progress' },
        { id: 'f9999999-9999-9999-9999-999999999999', mid: 'MNF-2026-009', aid: 'a9999999-9999-9999-9999-999999999999', o: 'ap222222-2222-2222-2222-222222222222', d: 'ap888888-8888-8888-8888-888888888888', w: 2450.00, fs: 'Scheduled', os: 'Pending' },
        { id: 'f1010101-1010-1010-1010-101010101010', mid: 'MNF-2026-010', aid: 'a1010101-1010-1010-1010-101010101010', o: 'ap555555-5555-5555-5555-555555555555', d: 'ap222222-2222-2222-2222-222222222222', w: 1750.00, fs: 'Landed', os: 'Completed' }
      ];

      for (const c of cargoData) {
        // Simpan Data Kargo Utama
        await sql`
          INSERT INTO cargo (id, manifest_id, airline_id, origin_airport_id, destination_airport_id, total_weight, flight_status, operational_status) 
          VALUES (${c.id}, ${c.mid}, ${c.aid}, ${c.o}, ${c.d}, ${c.w}, ${c.fs}, ${c.os}) ON CONFLICT (id) DO NOTHING;
        `;
      }

      // Seed Data Dashboard Tracking (Minimal 10 Data Riwayat Posisi)
      const trackingData = [
        { cid: 'f1111111-1111-1111-1111-111111111111', loc: 'DPS Airport Warehouse', desc: 'Cargo has been picked up by customer.' },
        { cid: 'f2222222-2222-2222-2222-222222222222', loc: 'In the Air', desc: 'Aircraft is cruising towards Surabaya.' },
        { cid: 'f3333333-3333-3333-3333-333333333333', loc: 'CGK Cargo Terminal 3', desc: 'Cargo is queued for security screening.' },
        { cid: 'f4444444-4444-4444-4444-444444444444', loc: 'SIN Changi Gate 5', desc: 'Cargo safely arrived and entering custom clearing.' },
        { cid: 'f5555555-5555-5555-5555-555555555555', loc: 'In the Air', desc: 'Departed from Jakarta towards Yogyakarta.' },
        { cid: 'f6666666-6666-6666-6666-666666666666', loc: 'SUB Warehouse Alpha', desc: 'Flight delayed due to bad weather over Balikpapan.' },
        { cid: 'f7777777-7777-7777-7777-777777777777', loc: 'CGK Sorting Area', desc: 'Cargo unloaded and distributed to local courier.' },
        { cid: 'f8888888-8888-8888-8888-888888888888', loc: 'In the Air', desc: 'Cruising altitude 32,000 feet over Java Sea.' },
        { cid: 'f9999999-9999-9999-9999-999999999999', loc: 'DPS Loading Bay 2', desc: 'Manifest document verified by port authority.' },
        { cid: 'f1010101-1010-1010-1010-101010101010', loc: 'SIN Cargo Terminal', desc: 'Handed over to airline agent for documentation.' }
      ];
      for (const t of trackingData) {
        await sql`
          INSERT INTO cargo_tracking (cargo_id, current_location, description) 
          VALUES (${t.cid}, ${t.loc}, ${t.desc});
        `;
      }

      // Seed Data Dashboard Cargo-Logs (Relasi 1:1 - Minimal 10 Baris Unik)
      const logsData = [
        { cid: 'f1111111-1111-1111-1111-111111111111', op: 'Alex Supriadi', gate: 'Gate 4B', temp: 'Ambient (24C)', seal: 'SEAL-GA888-091' },
        { cid: 'f2222222-2222-2222-2222-222222222222', op: 'Slamet Riyadi', gate: 'Gate 1A', temp: 'Chilled (4C)', seal: 'SEAL-SJ555-023' },
        { cid: 'f3333333-3333-3333-3333-333333333333', op: 'Rian Hidayat', gate: 'Gate 3C', temp: 'Ambient (25C)', seal: 'SEAL-JT100-887' },
        { cid: 'f4444444-4444-4444-4444-444444444444', op: 'Bambang U', gate: 'Gate 5A', temp: 'Ambient (22C)', seal: 'SEAL-ID600-412' },
        { cid: 'f5555555-5555-5555-5555-555555555555', op: 'Indra Hermawan', gate: 'Gate 2B', temp: 'Frozen (-18C)', seal: 'SEAL-QG210-901' },
        { cid: 'f6666666-6666-6666-6666-666666666666', op: 'Joko Susilo', gate: 'Gate 4C', temp: 'Ambient (24C)', seal: 'SEAL-QZ777-331' },
        { cid: 'f7777777-7777-7777-7777-777777777777', op: 'Agus Prayogo', gate: 'Gate 1B', temp: 'Chilled (5C)', seal: 'SEAL-IW300-112' },
        { cid: 'f8888888-8888-8888-8888-888888888888', op: 'Dedi Kurnia', gate: 'Gate 3A', temp: 'Ambient (26C)', seal: 'SEAL-IU450-554' },
        { cid: 'f9999999-9999-9999-9999-999999999999', op: 'Mulyono', gate: 'Gate 2C', temp: 'Ambient (23C)', seal: 'SEAL-IP200-761' },
        { cid: 'f1010101-1010-1010-1010-101010101010', op: 'Hendra Wijaya', gate: 'Gate 5C', temp: 'Chilled (2C)', seal: 'SEAL-TR120-229' }
      ];
      for (const l of logsData) {
        await sql`
          INSERT INTO cargo_logs (cargo_id, operator_name, warehouse_gate, temperature_control, seal_number) 
          VALUES (${l.cid}, ${l.op}, ${l.gate}, ${l.temp}, ${l.seal}) ON CONFLICT (cargo_id) DO NOTHING;
        `;
      }

      // Seed Junction Table Items Many-to-Many (M:N - Minimal 10 Baris Penghubung)
      const itemsData = [
        { cid: 'f1111111-1111-1111-1111-111111111111', pid: 'p1111111-1111-1111-1111-111111111111', qty: 45 },
        { cid: 'f1111111-1111-1111-1111-111111111111', pid: 'p2222222-2222-2222-2222-222222222222', qty: 12 },
        { cid: 'f2222222-2222-2222-2222-222222222222', pid: 'p2222222-2222-2222-2222-222222222222', qty: 150 },
        { cid: 'f3333333-3333-3333-3333-333333333333', pid: 'p3333333-3333-3333-3333-333333333333', qty: 2000 },
        { cid: 'f4444444-4444-4444-4444-444444444444', pid: 'p4444444-4444-4444-4444-444444444444', qty: 85 },
        { cid: 'f5555555-5555-5555-5555-555555555555', pid: 'p6666666-6666-6666-6666-666666666666', qty: 30 },
        { cid: 'f6666666-6666-6666-6666-666666666666', pid: 'p7777777-7777-7777-7777-777777777777', qty: 14 },
        { cid: 'f7777777-7777-7777-7777-777777777777', pid: 'p8888888-8888-8888-8888-888888888888', qty: 90 },
        { cid: 'f8888888-8888-8888-8888-888888888888', pid: 'p1111111-1111-1111-1111-111111111111', qty: 65 },
        { cid: 'f9999999-9999-9999-9999-999999999999', pid: 'p9999999-9999-9999-9999-999999999999', qty: 5 },
        { cid: 'f1010101-1010-1010-1010-101010101010', pid: 'p1010101-1010-1010-1010-101010101010', qty: 25 }
      ];
      for (const i of itemsData) {
        await sql`
          INSERT INTO cargo_items (cargo_id, product_id, quantity) 
          VALUES (${i.cid}, ${i.pid}, ${i.qty}) ON CONFLICT (cargo_id, product_id) DO NOTHING;
        `;
      }

    });

    return NextResponse.json({ message: 'Logistics Database Seeded Successfully with 10+ Complete Dummy Rows per Table!' });
  } catch (error) {
    console.error('Seeding Error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}