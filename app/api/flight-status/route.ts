import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  const flights = await sql`
    SELECT 
      flight_code,
      airline_name,
      route,
      scheduled_time as scheduled,
      actual_time as actual,
      gate,
      items,
      flight_status as status
    FROM cargo 
    ORDER BY id DESC
  `;
  return NextResponse.json(flights);
}