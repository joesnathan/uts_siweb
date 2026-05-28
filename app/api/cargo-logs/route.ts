import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  const logs = await sql`SELECT * FROM cargo_logs ORDER BY id DESC`;
  return NextResponse.json(logs);
}