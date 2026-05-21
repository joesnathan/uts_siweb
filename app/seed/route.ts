import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      
      // =========================================================================
      // 1. DROP TABEL LAMA (Biar tidak bentrok karena perubahan tipe data UUID ke INT)
      // =========================================================================
      await sql`DROP TABLE IF EXISTS cargo_items CASCADE;`;
      await sql`DROP TABLE IF EXISTS cargo_logs CASCADE;`;
      await sql`DROP TABLE IF EXISTS cargo_tracking CASCADE;`;
      await sql`DROP TABLE IF EXISTS cargo CASCADE;`;
      await sql`DROP TABLE IF EXISTS products CASCADE;`;
      await sql`DROP TABLE IF EXISTS airports CASCADE;`;
      await sql`DROP TABLE IF EXISTS airlines CASCADE;`;

      // =========================================================================
      // 2. BUAT TABEL MASTER DENGAN ID SERIAL (1, 2, 3, dst)
      // =========================================================================
      await sql`
        CREATE TABLE airlines (
          id SERIAL PRIMARY KEY,
          airline_name VARCHAR(255) NOT NULL,
          flight_code VARCHAR(50) NOT NULL UNIQUE
        );
      `;

      await sql`
        CREATE TABLE airports (
          id SERIAL PRIMARY KEY,
          airport_code VARCHAR(10) NOT NULL UNIQUE,
          airport_name VARCHAR(255) NOT NULL,
          city VARCHAR(255) NOT NULL
        );
      `;

      await sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL
        );
      `;

      // =========================================================================
      // 3. BUAT TABEL TRANSAKSI CARGO (ID SERIAL)
      // =========================================================================
      await sql`
        CREATE TABLE cargo (
          id SERIAL PRIMARY KEY,
          manifest_id VARCHAR(50) NOT NULL UNIQUE,
          airline_id INT NOT NULL,
          origin_airport_id INT NOT NULL,
          destination_airport_id INT NOT NULL,
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

      // Relasi 1:N (Dashboard Tracking)
      await sql`
        CREATE TABLE cargo_tracking (
          id SERIAL PRIMARY KEY,
          cargo_id INT NOT NULL,
          current_location VARCHAR(255) NOT NULL,
          update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          description TEXT NOT NULL,
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE
        );
      `;

      // Relasi 1:1 (Dashboard Cargo Logs)
      await sql`
        CREATE TABLE cargo_logs (
          id SERIAL PRIMARY KEY,
          cargo_id INT NOT NULL UNIQUE, -- UNIQUE mengunci relasi menjadi 1-to-1
          operator_name VARCHAR(255) NOT NULL,
          warehouse_gate VARCHAR(50) NOT NULL,
          temperature_control VARCHAR(50),
          seal_number VARCHAR(100) NOT NULL,
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE
        );
      `;

      // Relasi M:N Junction Table (Cargo Items)
      await sql`
        CREATE TABLE cargo_items (
          cargo_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          PRIMARY KEY (cargo_id, product_id),
          FOREIGN KEY (cargo_id) REFERENCES cargo(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `;

      // =========================================================================
      // 4. SEED DATA MASTER DUMMY (ID menggunakan angka simpel)
      // =========================================================================
      await sql`
        INSERT INTO airlines (id, airline_name, flight_code) VALUES
        (1, 'GARUDA INDONESIA', 'GA-888'),
        (2, 'SRIWIJAYA AIR', 'SJ-555'),
        (3, 'LION AIR', 'JT-100'),
        (4, 'BATIK AIR', 'ID-600'),
        (5, 'CITILINK', 'QG-210'),
        (6, 'AIRASIA', 'QZ-777'),
        (7, 'WINGS AIR', 'IW-300'),
        (8, 'SUPER AIR JET', 'IU-450'),
        (9, 'PELITA AIR', 'IP-200'),
        (10, 'SCOOT AIR', 'TR-120');
      `;

      await sql`
        INSERT INTO airports (id, airport_code, airport_name, city) VALUES
        (1, 'CGK', 'Soekarno-Hatta Intl', 'Jakarta'),
        (2, 'DPS', 'Ngurah Rai Intl', 'Bali'),
        (3, 'SUB', 'Juanda Intl', 'Surabaya'),
        (4, 'KNO', 'Kualanamu Intl', 'Medan'),
        (5, 'SIN', 'Changi Airport', 'Singapore'),
        (6, 'JOG', 'Yogyakarta Intl', 'Yogyakarta'),
        (7, 'BPN', 'Sultan Aji Message', 'Balikpapan'),
        (8, 'UPG', 'Sultan Hasanuddin', 'Makassar'),
        (9, 'KUL', 'Kuala Lumpur Intl', 'Kuala Lumpur'),
        (10, 'SRG', 'Ahmad Yani Intl', 'Semarang');
      `;

      await sql`
        INSERT INTO products (id, product_name, category) VALUES
        (1, 'Electronic Parts', 'General Cargo'),
        (2, 'Fresh Seafood', 'Perishable'),
        (3, 'Vaccines & Medical', 'Pharma'),
        (4, 'Textiles & Garments', 'General Cargo'),
        (5, 'Live Tropical Fish', 'Live Animals'),
        (6, 'Lithium Batteries', 'Dangerous Goods'),
        (7, 'Automotive Spares', 'General Cargo'),
        (8, 'Fresh Mangosteen', 'Perishable'),
        (9, 'Documents & Diplomatic', 'Courier'),
        (10, 'Luxury Watches', 'Valuable Cargo');
      `;

      // =========================================================================
      // 5. SEED 10 DATA TRANSAKSI UTAMA (ID Simpel 1 sampai 10)
      // =========================================================================
      await sql`
        INSERT INTO cargo (id, manifest_id, airline_id, origin_airport_id, destination_airport_id, total_weight, flight_status, operational_status) VALUES
        (1, 'MNF-2026-001', 1, 1, 2, 3250.00, 'Landed', 'Completed'),
        (2, 'MNF-2026-002', 2, 1, 3, 2150.00, 'Airborne', 'In progress'),
        (3, 'MNF-2026-003', 3, 1, 4, 1890.00, 'Scheduled', 'Pending'),
        (4, 'MNF-2026-004', 4, 1, 5, 4120.00, 'Landed', 'Completed'),
        (5, 'MNF-2026-005', 5, 1, 6, 950.00,  'Airborne', 'In progress'),
        (6, 'MNF-2026-006', 6, 3, 7, 1500.00, 'Delayed', 'Pending'),
        (7, 'MNF-2026-007', 7, 2, 1, 2800.00, 'Landed', 'Completed'),
        (8, 'MNF-2026-008', 8, 3, 4, 3600.00, 'Airborne', 'In progress'),
        (9, 'MNF-2026-009', 9, 2, 8, 2450.00, 'Scheduled', 'Pending'),
        (10, 'MNF-2026-010', 10, 5, 2, 1750.00, 'Landed', 'Completed');
      `;

      // Seed Data Tracking (Terhubung ke cargo_id 1 sampai 10)
      await sql`
        INSERT INTO cargo_tracking (cargo_id, current_location, description) VALUES 
        (1, 'DPS Airport Warehouse', 'Cargo has been picked up by customer.'),
        (2, 'In the Air', 'Aircraft is cruising towards Surabaya.'),
        (3, 'CGK Cargo Terminal 3', 'Cargo is queued for security screening.'),
        (4, 'SIN Changi Gate 5', 'Cargo safely arrived and entering custom clearing.'),
        (5, 'In the Air', 'Departed from Jakarta towards Yogyakarta.'),
        (6, 'SUB Warehouse Alpha', 'Flight delayed due to bad weather over Balikpapan.'),
        (7, 'CGK Sorting Area', 'Cargo unloaded and distributed to local courier.'),
        (8, 'In the Air', 'Cruising altitude 32,000 feet over Java Sea.'),
        (9, 'DPS Loading Bay 2', 'Manifest document verified by port authority.'),
        (10, 'SIN Cargo Terminal', 'Handed over to airline agent for documentation.');
      `;

      // Seed Data Cargo Logs (Terhubung ke cargo_id 1 sampai 10 secara 1:1)
      await sql`
        INSERT INTO cargo_logs (cargo_id, operator_name, warehouse_gate, temperature_control, seal_number) VALUES 
        (1, 'Alex Supriadi', 'Gate 4B', 'Ambient (24C)', 'SEAL-GA888-091'),
        (2, 'Slamet Riyadi', 'Gate 1A', 'Chilled (4C)', 'SEAL-SJ555-023'),
        (3, 'Rian Hidayat', 'Gate 3C', 'Ambient (25C)', 'SEAL-JT100-887'),
        (4, 'Bambang U', 'Gate 5A', 'Ambient (22C)', 'SEAL-ID600-412'),
        (5, 'Indra Hermawan', 'Gate 2B', 'Frozen (-18C)', 'SEAL-QG210-901'),
        (6, 'Joko Susilo', 'Gate 4C', 'Ambient (24C)', 'SEAL-QZ777-331'),
        (7, 'Agus Prayogo', 'Gate 1B', 'Chilled (5C)', 'SEAL-IW300-112'),
        (8, 'Dedi Kurnia', 'Gate 3A', 'Ambient (26C)', 'SEAL-IU450-554'),
        (9, 'Mulyono', 'Gate 2C', 'Ambient (23C)', 'SEAL-IP200-761'),
        (10, 'Hendra Wijaya', 'Gate 5C', 'Chilled (2C)', 'SEAL-TR120-229');
      `;

      // Seed Junction Table Items (M:N) menghubungkan cargo 1-10 dengan produk 1-10
      await sql`
        INSERT INTO cargo_items (cargo_id, product_id, quantity) VALUES 
        (1, 1, 45),
        (1, 2, 12),
        (2, 2, 150),
        (3, 3, 2000),
        (4, 4, 85),
        (5, 5, 30),
        (6, 6, 14),
        (7, 7, 90),
        (8, 8, 65),
        (9, 9, 5),
        (10, 10, 25);
      `;

      // Mengatur ulang urutan internal sequence PostgreSQL agar auto-increment ID berlanjut dari nomor 11
      await sql`SELECT setval('airlines_id_seq', 10);`;
      await sql`SELECT setval('airports_id_seq', 10);`;
      await sql`SELECT setval('products_id_seq', 10);`;
      await sql`SELECT setval('cargo_id_seq', 10);`;
      await sql`SELECT setval('cargo_tracking_id_seq', 10);`;
      await sql`SELECT setval('cargo_logs_id_seq', 10);`;
    });

    return NextResponse.json({ message: 'Database reset and seeded with SIMPLE INTEGER IDs successfully!' });
  } catch (error) {
    console.error('Seeding Error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}