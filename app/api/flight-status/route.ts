// app/api/flight-status/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(
  "postgresql://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  { ssl: 'require' }
);

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