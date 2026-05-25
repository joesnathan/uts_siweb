// app/api/cargo/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(
  "postgresql://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  { ssl: 'require', max: 1 }
);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const id = parseInt(params.id);

  const result = await sql`
    UPDATE cargo SET
      manifest_id = ${body.manifest_id},
      airline_name = ${body.airline_name},
      flight_code = ${body.flight_code},
      route = ${body.route},
      weight = ${body.weight},
      flight_status = ${body.flight_status},
      operational_status = ${body.operational_status},
      date = ${body.date},
      scheduled_time = ${body.scheduled_time},
      actual_time = ${body.actual_time},
      gate = ${body.gate},
      items = ${body.items}
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ success: true, data: result[0] });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await sql`DELETE FROM cargo WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}   