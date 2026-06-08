const http = require('http');

function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = JSON.stringify(body);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function test() {
  try {
    console.log("=== STARTING HTTP API INTEGRATION TEST ===");

    // 1. Post to Login
    console.log("\n1. Performing POST login to /api/login...");
    const loginRes = await postJson('http://localhost:3000/api/login', {
      email: 'operator',
      password: 'operator123'
    });

    if (!loginRes.body.success) {
      console.error("Login failed:", loginRes.body);
      process.exit(1);
    }
    console.log("Login successful! User:", loginRes.body.user.full_name);

    // Get session cookie
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie || setCookie.length === 0) {
      console.error("Set-Cookie not found in login response headers");
      process.exit(1);
    }
    const sessionCookie = setCookie[0].split(';')[0];
    console.log("Session Cookie:", sessionCookie);

    const headersWithAuth = {
      'Cookie': sessionCookie
    };

    // 2. Fetch Cargo tracking
    console.log("\n2. Performing authenticated GET to /api/cargo-tracking...");
    const trackingGetRes = await getJson('http://localhost:3000/api/cargo-tracking?cargoId=1', headersWithAuth);
    console.log("Status Code:", trackingGetRes.statusCode);
    console.log("Response Body:", JSON.stringify(trackingGetRes.body, null, 2));

    if (!trackingGetRes.body.success) {
      console.error("GET failed:", trackingGetRes.body);
      process.exit(1);
    }

    // 3. Post new checkpoint
    console.log("\n3. Performing authenticated POST to /api/cargo-tracking to add checkpoint...");
    const newCheckpointRes = await postJson('http://localhost:3000/api/cargo-tracking', {
      cargoId: 1,
      current_location: "CGK Transit Zone HTTP Test",
      description: "Validated from automated Next.js HTTP API query test"
    }, headersWithAuth);

    console.log("Status Code:", newCheckpointRes.statusCode);
    console.log("Response Body:", JSON.stringify(newCheckpointRes.body, null, 2));

    if (!newCheckpointRes.body.success) {
      console.error("POST failed:", newCheckpointRes.body);
      process.exit(1);
    }

    // 4. Verify history again
    console.log("\n4. Performing authenticated GET again to verify new checkpoint exists...");
    const trackingGetRes2 = await getJson('http://localhost:3000/api/cargo-tracking?cargoId=1', headersWithAuth);
    const list = trackingGetRes2.body.data || [];
    const found = list.some(h => h.current_location === "CGK Transit Zone HTTP Test");
    
    if (found) {
      console.log("SUCCESS! The newly inserted checkpoint was found in the timeline history.");
    } else {
      console.error("ERROR: The checkpoint was not found in the timeline history list.");
      process.exit(1);
    }

    console.log("\n=== ALL HTTP API TESTS PASSED SUCCESSFULLY ===");
    process.exit(0);
  } catch (err) {
    console.error("HTTP TEST EXCEPTION:", err);
    process.exit(1);
  }
}

test();
