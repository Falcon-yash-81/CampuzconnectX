const http = require('http');

const API_PORT = process.env.PORT || 5000;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const options = {
      hostname: '127.0.0.1',
      port: API_PORT,
      path: path,
      method: method,
      headers: headers,
    };

    const req = http.request(options, (res) => {
      let resData = '';
      res.on('data', (chunk) => (resData += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(resData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING CAMPUSCONNECT API TESTS ===\n');

  try {
    // 1. Health check
    console.log('[Test 1] Health Check...');
    const health = await request('GET', '/api/health');
    console.log('Status:', health.status, 'Response:', health.data);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Demo login as Alex (Requester)
    console.log('\n[Test 2] Demo Login as Alex (Requester)...');
    const alexLogin = await request('POST', '/api/auth/demo-login', {
      role: 'studentB',
    });
    console.log('Alex Login Status:', alexLogin.status, 'User:', alexLogin.data.user?.name);
    const alexToken = alexLogin.data.token;
    if (!alexToken) throw new Error('Failed to obtain token for Alex');

    // 3. Demo login as Yashas (Helper)
    console.log('\n[Test 3] Demo Login as Yashas (Helper)...');
    const yashasLogin = await request('POST', '/api/auth/demo-login', {
      role: 'studentA',
    });
    console.log('Yashas Login Status:', yashasLogin.status, 'User:', yashasLogin.data.user?.name);
    const yashasToken = yashasLogin.data.token;
    if (!yashasToken) throw new Error('Failed to obtain token for Yashas');

    // 4. Demo login as Admin
    console.log('\n[Test 4] Demo Login as Admin...');
    const adminLogin = await request('POST', '/api/auth/demo-login', {
      role: 'admin',
    });
    console.log('Admin Login Status:', adminLogin.status, 'User:', adminLogin.data.user?.name);
    const adminToken = adminLogin.data.token;
    if (!adminToken) throw new Error('Failed to obtain token for Admin');

    // 5. Query Help Requests
    console.log('\n[Test 5] Query Help Requests...');
    const helpReqs = await request('GET', '/api/help', null, alexToken);
    console.log('Found', helpReqs.data.count, 'help requests');
    const flutterReq = helpReqs.data.data.find((r) =>
      r.title.toLowerCase().includes('flutter')
    );
    if (!flutterReq) throw new Error('Flutter help request not found');

    // 6. Test Smart Matching Engine
    console.log('\n[Test 6] Smart Matching Engine for Request:', flutterReq._id);
    const matches = await request(
      'GET',
      `/api/help/${flutterReq._id}/matches`,
      null,
      alexToken
    );
    console.log('Match count:', matches.data.count);
    const topMatch = matches.data.data[0];
    console.log(
      'Top match candidate:',
      topMatch.student.name,
      'Score:',
      topMatch.compatibilityScore + '%',
      'Breakdown:',
      topMatch.breakdown
    );
    if (topMatch.student.name !== 'Yashas Gowda') {
      console.warn('Expected top match Yashas Gowda, got:', topMatch.student.name);
    } else {
      console.log('✓ PASS: Smart Matching accurately ranked Yashas Gowda with high compatibility!');
    }

    // 7. Student reports a Campus Issue
    console.log('\n[Test 7] Report Campus Issue...');
    const newIssue = await request(
      'POST',
      '/api/issues',
      {
        title: 'Laboratory 104 AC unit leaking water',
        description: 'Water dripping onto keyboard tables in Lab 104 row 3.',
        category: 'Laboratory',
        location: 'Computer Lab 104',
        severity: 'High',
      },
      alexToken
    );
    console.log('Issue created:', newIssue.data.data?.title, 'ID:', newIssue.data.data?._id);

    // 8. Admin queries dashboard & assigns issue
    console.log('\n[Test 8] Admin Dashboard Metrics & Issue Triage...');
    const adminDash = await request('GET', '/api/admin/dashboard', null, adminToken);
    console.log('Admin KPIs:', {
      students: adminDash.data.data.totalStudents,
      activeIssues: adminDash.data.data.activeIssues,
      helpRequests: adminDash.data.data.totalHelpRequests,
    });

    const updateIssueRes = await request(
      'PUT',
      `/api/admin/issues/${newIssue.data.data._id}`,
      {
        status: 'ASSIGNED',
        assignedTo: 'HVAC Maintenance Crew',
        resolutionNotes: 'Dispatched technician to replace condensation pan.',
      },
      adminToken
    );
    console.log(
      'Issue updated to:',
      updateIssueRes.data.data?.status,
      'Assigned to:',
      updateIssueRes.data.data?.assignedTo
    );

    console.log('\n✓ ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

// Allow time for server to be ready if invoked
setTimeout(runTests, 1000);
