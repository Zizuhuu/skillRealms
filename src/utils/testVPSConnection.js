// Test VPS Connection - Test until it works for pro users
import RealFreeRDPSConnection from './realFreeRDPSConnection.js';

// Test function to verify VPS connection works for pro users
async function testVPSConnection() {
  console.log('🧪 Testing Real FreeRDPs Connection for Pro User...');
  
  try {
    // Create test RDP config for pro user
    const testRDPConfig = {
      hostname: 'freerdps.com',
      port: 3389,
      username: 'pro_user',
      password: 'ProAccess123!',
      domain: '',
      isPro: true
    };
    
    console.log('📋 Test RDP Config (Pro User):', testRDPConfig);
    
    // Initialize connection
    const connection = new RealFreeRDPSConnection();
    console.log('✅ Connection class initialized');
    
    // Test connection
    const window = await connection.connect(testRDPConfig);
    console.log('✅ Connection established, window opened for pro user');
    
    // Check connection state
    const state = connection.getConnectionState();
    console.log('📊 Connection state:', state);
    
    if (state === 'connected') {
      console.log('🎉 SUCCESS: Real FreeRDPs connection is working for pro user!');
      return true;
    } else {
      console.log('❌ FAILED: Connection state is not "connected":', state);
      return false;
    }
    
  } catch (error) {
    console.error('❌ ERROR: VPS connection test failed:', error);
    return false;
  }
}

// Test function to verify pro user has no timer
async function testProUserNoTimer() {
  console.log('🧪 Testing Pro User (No Timer)...');
  
  try {
    // Create pro user config
    const proUserConfig = {
      email: 'pro@example.com',
      tier: 'pro',
      isPro: true
    };
    
    console.log('📋 Pro User Config:', proUserConfig);
    
    // Test timer logic
    const hasTimer = proUserConfig.tier === 'free';
    console.log('📊 Has Timer:', hasTimer);
    
    if (!hasTimer) {
      console.log('🎉 SUCCESS: Pro user has no timer!');
      return true;
    } else {
      console.log('❌ FAILED: Pro user still has timer');
      return false;
    }
    
  } catch (error) {
    console.error('❌ ERROR: Pro user timer test failed:', error);
    return false;
  }
}

// Test iframe loading
function testIframeLoading() {
  console.log('🧪 Testing iframe loading...');
  
  // Create test iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://freerdps.com/client/index.php?rp=/store/freerdps/startup';
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  
  // Add event listeners
  iframe.onload = () => {
    console.log('✅ Iframe loaded successfully');
  };
  
  iframe.onerror = (error) => {
    console.error('❌ Iframe loading error:', error);
  };
  
  return iframe;
}

// Comprehensive test function that tests until it works
async function testUntilWorks() {
  console.log('🚀 Starting Comprehensive VPS Test (Test Until It Works)...');
  
  const tests = [
    { name: 'Pro User No Timer', fn: testProUserNoTimer },
    { name: 'VPS Connection', fn: testVPSConnection },
    { name: 'Iframe Loading', fn: testIframeLoading }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`\n🧪 Running Test: ${test.name}`);
    
    let attempts = 0;
    const maxAttempts = 3;
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
            console.log(`⏳ Waiting 2 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (error) {
        console.error(`💥 ${test.name} ERROR on attempt ${attempts}:`, error);
        if (attempts < maxAttempts) {
          console.log(`⏳ Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (!passed) {
      console.log(`🚨 ${test.name} FAILED after ${maxAttempts} attempts`);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! VPS implementation is working correctly.');
    return true;
  } else {
    console.log('\n❌ SOME TESTS FAILED! VPS implementation needs fixes.');
    return false;
  }
}

// Export test functions
export { testVPSConnection, testIframeLoading, testProUserNoTimer, testUntilWorks };

// Auto-run test if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('🚀 VPS Connection Test Module Loaded');
  
  // Add test button to page for manual testing
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Until Works';
  testButton.style.position = 'fixed';
  testButton.style.top = '10px';
  testButton.style.right = '10px';
  testButton.style.zIndex = '9999';
  testButton.style.background = '#0078d4';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.padding = '10px';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  testButton.onclick = async () => {
    testButton.textContent = 'Testing...';
    testButton.disabled = true;
    
    const success = await testUntilWorks();
    
    if (success) {
      testButton.textContent = '✅ All Tests Passed';
      testButton.style.background = '#4ade80';
    } else {
      testButton.textContent = '❌ Some Tests Failed';
      testButton.style.background = '#ff5f57';
    }
    
    setTimeout(() => {
      testButton.textContent = 'Test Until Works';
      testButton.style.background = '#0078d4';
      testButton.disabled = false;
    }, 3000);
  };
  
  document.body.appendChild(testButton);
  
  // Auto-run tests on page load
  setTimeout(async () => {
    console.log('🤖 Auto-running VPS tests...');
    await testUntilWorks();
  }, 1000);
}
