import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from 'app/lib/placeholder-data';

// Hubungkan ke database dengan SSL required sesuai konfigurasi lingkungan
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// =========================================================================
// 1. SEED DATA MASTER USER
// =========================================================================
async function seedUsers(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// =========================================================================
// 2. SEED DATA MASTER CUSTOMER (Data Master Acuan Transaksi)
// =========================================================================
async function seedCustomers(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

// =========================================================================
// 3. SEED TABEL TRANSAKSI INVOICES (Relasi One to Many dengan Customers)
// =========================================================================
async function seedInvoices(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

// =========================================================================
// 4. SEED DATA MASTER REVENUE
// =========================================================================
async function seedRevenue(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

// =========================================================================
// 5. SEED DETAIL INVOICE (Relasi One to One [1:1] Mandat Pengumuman)
// =========================================================================
async function seedInvoiceDetails(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_details (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      invoice_id UUID NOT NULL UNIQUE, -- Atribut UNIQUE mengunci relasi menjadi 1-to-1
      shipping_address TEXT NOT NULL,
      courier_name VARCHAR(255) NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
  `;

  // Opsional: Kamu bisa menambahkan logika perulangan insert dummy di sini jika diperlukan
}

// =========================================================================
// 6. SEED MASTER PRODUK & JUNCTION TABLE (Relasi Many to Many [M:N])
// =========================================================================
async function seedProductsAndJunction(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
  // Buat Tabel Master Produk (Data Master Barang)
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      price INT NOT NULL
    );
  `;

  // Buat Junction Table (Menghubungkan Invoices dan Products secara Many-to-Many)
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_items (
      invoice_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INT NOT NULL,
      PRIMARY KEY (invoice_id, product_id), -- Composite Primary Key
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;
}

// =========================================================================
// JALUR API UTAMA (Hanya Ada Satu Handler GET Tunggal yang Terintegrasi)
// =========================================================================
export async function GET() {
  try {
    // Membuka blok transaksi aman agar seluruh fungsi seeder dieksekusi berurutan
    await sql.begin(async (sql) => {
      await seedUsers(sql);
      await seedCustomers(sql);
      await seedInvoices(sql);
      await seedRevenue(sql);
      await seedInvoiceDetails(sql);
      await seedProductsAndJunction(sql);
    });

    return Response.json({ 
      message: 'Database seeded successfully with all requested relations (1:1, 1:N, M:N)' 
    });
  } catch (error) {
    console.error('Seeding Error:', error);
    return Response.json({ error }, { status: 500 });
  }
}