const postgres = require('postgres');

const POSTGRES_URL = "postgres://neondb_owner:npg_PSeOJ3wzXlN8@ep-jolly-math-ao85w4vz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(POSTGRES_URL, { ssl: 'require' });

async function check() {
  try {
    const data = await sql`SELECT * FROM cargo LIMIT 5`;
    console.log("CARGO FIRST ROWS:");
    console.log(JSON.stringify(data, null, 2));
    
    const logs = await sql`SELECT * FROM cargo_logs LIMIT 5`;
    console.log("CARGO LOGS FIRST ROWS:");
    console.log(JSON.stringify(logs, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("DATABASE ERROR:", err);
    process.exit(1);
  }
}

check();
