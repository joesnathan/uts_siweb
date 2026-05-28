import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    const data = await sql`SELECT * FROM cargo ORDER BY id DESC`;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await sql`
      INSERT INTO cargo (
        manifest_id, airline_name, flight_code, route, weight, flight_status, operational_status, 
        date, scheduled_time, actual_time, gate, items, sender_name, receiver_name, 
        phone_number, origin_city, destination_city, item_type, shipping_price, shipping_type, description
      ) VALUES (
        ${body.manifest_id}, ${body.airline_name}, ${body.flight_code}, ${body.route}, ${body.weight || 0}, 
        ${body.flight_status}, ${body.operational_status}, ${body.date}, ${body.scheduled_time}, 
        ${body.actual_time}, ${body.gate}, ${body.items || 0}, ${body.sender_name}, ${body.receiver_name}, 
        ${body.phone_number}, ${body.origin_city}, ${body.destination_city}, ${body.item_type}, 
        ${body.shipping_price}, ${body.shipping_type}, ${body.description}
      ) RETURNING *`;
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  try {
    const result = await sql`
      UPDATE cargo SET 
        manifest_id=${body.manifest_id}, airline_name=${body.airline_name}, flight_code=${body.flight_code},
        route=${body.route}, weight=${body.weight}, flight_status=${body.flight_status},
        operational_status=${body.operational_status}, date=${body.date}, scheduled_time=${body.scheduled_time},
        actual_time=${body.actual_time}, gate=${body.gate}, items=${body.items}, sender_name=${body.sender_name},
        receiver_name=${body.receiver_name}, phone_number=${body.phone_number}, origin_city=${body.origin_city},
        destination_city=${body.destination_city}, item_type=${body.item_type}, shipping_price=${body.shipping_price},
        shipping_type=${body.shipping_type}, description=${body.description}
      WHERE id = ${id} RETURNING *`;
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await sql`DELETE FROM cargo WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}