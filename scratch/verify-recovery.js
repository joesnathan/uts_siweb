async function runTests() {
  console.log("TESTING MANUAL ACCOUNT RECOVERY API VALIDATION...");
  
  // 1. Uji Coba Operator Palsu (Should Fail)
  try {
    const res1 = await fetch('http://localhost:3000/api/recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Budi Palsu',
        operator_id: 'OP-PALS-999',
        department: 'Ground Ops Team',
        issue_detail: 'Akun saya tidak bisa login karena lupa password.'
      })
    });
    
    const data1 = await res1.json();
    console.log("\nTEST 1 (INVALID OPERATOR):");
    console.log("Status Code:", res1.status);
    console.log("Response:", JSON.stringify(data1, null, 2));
  } catch (err) {
    console.error("Test 1 error:", err);
  }

  // 2. Uji Coba Operator Valid (Should Succeed)
  try {
    const res2 = await fetch('http://localhost:3000/api/recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Jonathan Operator',
        operator_id: 'OP-2026-001',
        department: 'Air Freight Support',
        issue_detail: 'Lupa password dan ingin reset password manual.'
      })
    });
    
    const data2 = await res2.json();
    console.log("\nTEST 2 (VALID OPERATOR):");
    console.log("Status Code:", res2.status);
    console.log("Response:", JSON.stringify(data2, null, 2));
  } catch (err) {
    console.error("Test 2 error:", err);
  }

  // 3. Uji Coba IT Admin GET Logs
  try {
    const res3 = await fetch('http://localhost:3000/api/recovery');
    const data3 = await res3.json();
    console.log("\nTEST 3 (IT ADMIN GET LOGS):");
    console.log("Status Code:", res3.status);
    console.log("Logged Complaints:", JSON.stringify(data3.data, null, 2));
  } catch (err) {
    console.error("Test 3 error:", err);
  }
}

runTests();
