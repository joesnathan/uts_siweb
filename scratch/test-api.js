const postgres = require('postgres');

const POSTGRES_URL = "postgres://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(POSTGRES_URL, { ssl: 'require' });

async function test() {
  try {
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
    console.log("FLIGHT STATUS API SIMULATION:");
    console.log(JSON.stringify(flights, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("API ERROR:", err);
    process.exit(1);
  }
}

test();
