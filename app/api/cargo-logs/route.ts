// app/api/cargo-logs/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(
  "postgresql://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  { ssl: 'require' }
);

export async function GET() {
  const logs = await sql`SELECT * FROM cargo_logs ORDER BY id DESC`;
  return NextResponse.json(logs);
}