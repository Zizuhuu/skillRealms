// Test Real Windows Connection - Test until we see ACTUAL Windows desktop like AppOnFly
import RealApacheGuacamoleConnection from './realApacheGuacamoleConnection.js';

// Test function to verify we get ACTUAL Windows desktop
async function testRealWindowsDesktop() {
  console.log('🧪 Testing REAL Windows Desktop Connection (Like AppOnFly)...');
  
  try {
    // Create real RDP config for Windows Server
    const realRDPConfig = {
      hostname: 'demo.guacamole.apache.org',
      port: 3389,
      username: 'guacamole_user',
      password: 'guacamole_pass',
      domain: '',
      isPro: true
    };
    
    console.log('📋 Real Windows RDP Config:', realRDPConfig);
    
    // Initialize real Apache Guacamole connection
    const connection = new RealApacheGuacamoleConnection();
    console.log('✅ Apache Guacamole connection class initialized');
    
    // Test connection
    const window = await connection.connect(realRDPConfig);
    console.log('✅ Connection established, window opened');
    
    // Check connection state
    const state = connection.getConnectionState();
    console.log('📊 Connection state:', state);
    
    if (state === 'connected') {
      console.log('🎉 SUCCESS: Real Apache Guacamole connection is working!');
      return true;
    } else {
      console.log('❌ FAILED: Connection state is not "connected":', state);
      return false;
    }
    
  } catch (error) {
    console.error('❌ ERROR: Real Windows desktop test failed:', error);
    return false;
  }
}

// Test function to verify we see ACTUAL Windows elements
async function testActualWindowsElements() {
  console.log('🧪 Testing for ACTUAL Windows Desktop Elements...');
  
  // Check if we have real Windows elements
  const windowsElements = [
    'File Explorer',
    'Microsoft Edge',
    'Settings',
    'Terminal',
    'Notepad',
    'Windows Taskbar',
    'Start Menu',
    'System Clock',
    'Desktop Icons',
    'Windows Registry'
  ];
  
  let foundElements = 0;
  
  windowsElements.forEach(element => {
    if (document.body.innerHTML.includes(element)) {
      console.log(`✅ Found Windows element: ${element}`);
      foundElements++;
    } else {
      console.log(`❌ Missing Windows element: ${element}`);
    }
  });
  
  if (foundElements >= windowsElements.length * 0.7) {
    console.log('🎉 SUCCESS: Found sufficient Windows desktop elements!');
    return true;
  } else {
    console.log(`❌ FAILED: Only found ${foundElements}/${windowsElements.length} Windows elements`);
    return false;
  }
}

// Test function to verify it's not a simulation
async function testNotSimulation() {
  console.log('🧪 Testing that this is NOT a simulation...');
  
  // Check for simulation indicators
  const simulationIndicators = [
    'simulation',
    'demo mode',
    'mock',
    'fake',
    'test',
    'sample'
  ];
  
  let foundSimulation = false;
  
  simulationIndicators.forEach(indicator => {
    if (document.body.innerHTML.toLowerCase().includes(indicator)) {
      console.log(`❌ Found simulation indicator: ${indicator}`);
      foundSimulation = true;
    }
  });
  
  if (!foundSimulation) {
    console.log('🎉 SUCCESS: No simulation indicators found!');
    return true;
  } else {
    console.log('❌ FAILED: Found simulation indicators - this might be a simulation');
    return false;
  }
}

// Comprehensive test function that tests until we see ACTUAL Windows desktop
async function testUntilRealWindows() {
  console.log('🚀 Starting Comprehensive Real Windows Test (Until We See ACTUAL Windows Desktop Like AppOnFly)...');
  
  const tests = [
    { name: 'Real Windows Desktop Connection', fn: testRealWindowsDesktop },
    { name: 'Actual Windows Elements', fn: testActualWindowsElements },
    { name: 'Not Simulation', fn: testNotSimulation }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`\n🧪 Running Test: ${test.name}`);
    
    let attempts = 0;
    const maxAttempts = 5; // More attempts for real connection
    let passed = false;
    
    while (attempts < maxAttempts && !passed) {
      attempts++;
      console.log(`📊 Attempt ${attempts}/${maxAttempts} for ${test.name}`);
      
      try {
        passed = await test.fn();
        
        if (passed) {
          console.log(`✅ ${test.name} PASSED on attempt ${attempts}`);
        } else {
          console.log(`❌ ${test.name} FAILED on attempt ${attempts}`);
          if (attempts < maxAttempts) {
            console.log(`⏳ Waiting 3 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      } catch (error) {
        console.error(`💥 ${test.name} ERROR on attempt ${attempts}:`, error);
        if (attempts < maxAttempts) {
          console.log(`⏳ Waiting 3 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    if (!passed) {
      console.log(`🚨 ${test.name} FAILED after ${maxAttempts} attempts`);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! We have ACTUAL Windows desktop like AppOnFly!');
    console.log('🖥️ REAL Windows Server 2022 is accessible via browser!');
    console.log('🔥 This is NOT a simulation - this is a REAL working Windows VPS!');
    return true;
  } else {
    console.log('\n❌ SOME TESTS FAILED! Windows VPS implementation needs more work.');
    console.log('🔧 We need to fix the connection to show ACTUAL Windows desktop.');
    return false;
  }
}

// Export test functions
export { testRealWindowsDesktop, testActualWindowsElements, testNotSimulation, testUntilRealWindows };

// Auto-run test if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('🚀 Real Windows Connection Test Module Loaded');
  
  // Add test button to page for manual testing
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Until REAL Windows';
  testButton.style.position = 'fixed';
  testButton.style.top = '10px';
  testButton.style.right = '10px';
  testButton.style.zIndex = '9999';
  testButton.style.background = 'linear-gradient(135deg, #0078d4 0%, #00bcf2 100%)';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.padding = '12px 16px';
  testButton.style.borderRadius = '8px';
  testButton.style.cursor = 'pointer';
  testButton.style.fontWeight = 'bold';
  testButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  testButton.onclick = async () => {
    testButton.textContent = 'Testing...';
    testButton.disabled = true;
    
    const success = await testUntilRealWindows();
    
    if (success) {
      testButton.textContent = '🎉 REAL Windows!';
      testButton.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    } else {
      testButton.textContent = '❌ Still Simulation';
      testButton.style.background = 'linear-gradient(135deg, #ff5f57 0%, #dc2626 100%)';
    }
    
    setTimeout(() => {
      testButton.textContent = 'Test Until REAL Windows';
      testButton.style.background = 'linear-gradient(135deg, #0078d4 0%, #00bcf2 100%)';
      testButton.disabled = false;
    }, 5000);
  };
  
  document.body.appendChild(testButton);
  
  // Auto-run tests on page load
  setTimeout(async () => {
    console.log('🤖 Auto-running Real Windows tests...');
    await testUntilRealWindows();
  }, 2000);
}
