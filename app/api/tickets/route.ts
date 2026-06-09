import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      ticket_id VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      sender VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      date VARCHAR(100) NOT NULL,
      description TEXT NOT NULL
    )
  `;
  
  const countResult = await sql`SELECT count(*) FROM tickets`;
  const count = parseInt(countResult[0].count);
  if (count === 0) {
    await sql`
      INSERT INTO tickets (ticket_id, title, category, priority, status, sender, role, date, description) VALUES
      ('TK-9021', 'Neon Postgres Database Synchronization Latency', 'Database & System', 'High', 'Open', 'Jonathan', 'Operations Supervisor', '2026-06-09 20:15', 'There is a database synchronization latency of about 3 seconds on the Neon Postgres Asia cluster. Please verify the connection pooler.'),
      ('TK-8842', 'Inconsistent Status for Flight Manifest ID MNF-2026-004', 'AWB Tracking', 'Medium', 'In Progress', 'Budi', 'Cargo Operator', '2026-06-09 18:30', 'When searching for manifest MNF-2026-004, the flight status is marked as Landed but operational status is still In Transit. Please correct this.'),
      ('TK-7721', 'Cargo Label Printer Issue at Warehouse A', 'Hardware / Devices', 'Low', 'Resolved', 'Susi', 'Warehouse Staff', '2026-06-08 14:10', 'The label printer is not printing barcodes for new manifests. LAN cable connection is working normally.')
    `;
  }
}

export async function GET() {
  try {
    await ensureTableExists();
    // Return all tickets ordered by id DESC
    const data = await sql`SELECT * FROM tickets ORDER BY id DESC`;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const result = await sql`
      INSERT INTO tickets (
        ticket_id, title, category, priority, status, sender, role, date, description
      ) VALUES (
        ${body.ticket_id}, ${body.title}, ${body.category}, ${body.priority}, ${body.status}, 
        ${body.sender}, ${body.role}, ${body.date}, ${body.description}
      ) RETURNING *`;
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
