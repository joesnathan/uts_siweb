const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/POSTGRES_URL="([^"]+)"/);
const url = match ? match[1] : '';

const postgres = require('postgres');
const sql = postgres(url, { ssl: 'require' });

async function test() {
  try {
    console.log("=== STARTING INTEGRATION TEST ===");

    // 1. Fetch cargo info for MNF-2026-001
    const cargoList = await sql`SELECT id, manifest_id FROM cargo WHERE manifest_id = 'MNF-2026-001'`;
    if (cargoList.length === 0) {
      console.error("ERROR: MNF-2026-001 not found");
      process.exit(1);
    }
    const cargoId = cargoList[0].id;
    console.log(`Found cargo ID: ${cargoId} for manifest MNF-2026-001`);

    // 2. Fetch existing history
    console.log("\n1. Fetching existing history...");
    const initialHistory = await sql`SELECT * FROM cargo_tracking WHERE cargo_id = ${cargoId} ORDER BY update_time DESC`;
    console.log(`Found ${initialHistory.length} existing logs.`);
    initialHistory.forEach(h => {
      console.log(`  - [${h.update_time.toISOString()}] ${h.current_location}: ${h.description}`);
    });

    // 3. Insert a new checkpoint
    console.log("\n2. Inserting new test checkpoint...");
    const testLocation = "CGK Test Transit Gate";
    const testDesc = "Automated audit test checkpoint log entry";
    
    const [inserted] = await sql`
      INSERT INTO cargo_tracking (cargo_id, current_location, description)
      VALUES (${cargoId}, ${testLocation}, ${testDesc})
      RETURNING *
    `;
    console.log("SUCCESS! Inserted row:", JSON.stringify(inserted, null, 2));

    // 4. Fetch updated history
    console.log("\n3. Fetching updated history...");
    const updatedHistory = await sql`SELECT * FROM cargo_tracking WHERE cargo_id = ${cargoId} ORDER BY update_time DESC`;
    console.log(`Found ${updatedHistory.length} logs after insert.`);

    // 5. Cleanup the test checkpoint
    console.log("\n4. Cleaning up test checkpoint...");
    await sql`DELETE FROM cargo_tracking WHERE id = ${inserted.id}`;
    console.log("Cleanup finished.");

    console.log("\n=== INTEGRATION TEST COMPLETED SUCCESSFULLY ===");
    process.exit(0);
  } catch (err) {
    console.error("TEST FAILED WITH DATABASE ERROR:", err);
    process.exit(1);
  }
}

test();
