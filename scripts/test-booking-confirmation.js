#!/usr/bin/env node

/**
 * Test script for the booking confirmation edge function
 * 
 * This script tests both the edge function and the API endpoint
 * to ensure booking confirmation emails are working correctly.
 * 
 * Usage:
 * node scripts/test-booking-confirmation.js [ANON_KEY]
 */

const readline = require('readline');

// Use the correct project reference
const PROJECT_REF = 'jshnsfvvsmjlxlbdpehf';

// Sample booking data for testing
const sampleBookingData = {
  property_size: '1500-2499 sq.ft.',
  services: [
    { name: 'HDR Photography', price: 249.99, count: 1, total: 249.99 }
  ],
  total_amount: 249.99,
  address: {
    street: '123 Test Street',
    city: 'Toronto',
    province: 'ON',
    zipCode: 'M1A 1A1'
  },
  preferred_date: '2024-12-15T00:00:00',
  time: '10:00:00',
  property_status: 'Vacant',
  agent_name: 'Test User',
  agent_email: 'cooper@rephotos.ca', // Changed to your email for testing
  agent_phone: '416-555-0123',
  agent_company: 'Test Realty',
  notes: 'This is a test booking - please ignore'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function testEdgeFunction(anonKey) {
  console.log('\n🧪 Testing Edge Function...\n');

  // Test the GET endpoint first
  console.log('1. Testing GET /test endpoint...');
  try {
    const testUrl = `https://${PROJECT_REF}.supabase.co/functions/v1/booking-confirmation/test`;
    console.log(`   URL: ${testUrl}`);
    
    const response = await fetch(testUrl);
    const result = await response.text();
    
    if (response.ok) {
      console.log('   ✅ GET test endpoint successful');
      console.log('   📧 Test email should be sent to cooper@rephotos.ca');
    } else {
      console.log(`   ❌ GET test failed: ${response.status} - ${result}`);
    }
  } catch (error) {
    console.log(`   ❌ GET test error: ${error.message}`);
  }

  // Test the POST endpoint with booking data
  console.log('\n2. Testing POST endpoint with booking data...');
  try {
    const postUrl = `https://${PROJECT_REF}.supabase.co/functions/v1/booking-confirmation`;
    console.log(`   URL: ${postUrl}`);
    
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        record: sampleBookingData
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ POST test successful');
      console.log('   📧 Confirmation email should be sent to:', sampleBookingData.agent_email);
      console.log('   📧 Copy should be sent to: cooper@rephotos.ca');
      console.log('   📄 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log(`   ❌ POST test failed: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(result, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ POST test error: ${error.message}`);
  }
}

async function testApiEndpoint() {
  console.log('\n🧪 Testing API Endpoint...\n');

  console.log('Testing POST /api/bookings/create...');
  try {
    // Test against localhost (for development)
    const apiUrl = 'http://localhost:3000/api/bookings/create';
    console.log(`   URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleBookingData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ API endpoint test successful');
      console.log('   📝 Booking created with ID:', result.booking?.id);
      console.log('   📧 Confirmation email should be triggered automatically');
      console.log('   📄 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log(`   ❌ API endpoint test failed: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(result, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ API endpoint test error: ${error.message}`);
    console.log('   💡 Make sure your Next.js app is running on localhost:3000');
  }
}

async function main() {
  console.log('🧪 Booking Confirmation Email Test Suite');
  console.log(`📋 Project Reference: ${PROJECT_REF}\n`);

  // Get command line argument or ask for input
  let anonKey = process.argv[2];

  if (!anonKey) {
    console.log('To test the edge function, we need your Supabase anon key.\n');
    anonKey = await askQuestion('Enter your Supabase Anon Key: ');
  }

  if (anonKey) {
    await testEdgeFunction(anonKey);
  } else {
    console.log('\n⏭️  Skipping edge function test (missing anon key)');
  }

  // Test the API endpoint
  await testApiEndpoint();

  console.log('\n📝 Test Summary:');
  console.log('   - Edge function tests require deployed function and correct credentials');
  console.log('   - API endpoint tests require running Next.js app (npm run dev)');
  console.log('   - Check your email inbox for confirmation emails');
  console.log('   - Check Supabase dashboard logs for detailed error information');

  console.log('\n📊 Troubleshooting:');
  console.log('   - Verify RESEND_API_KEY is set in Supabase Edge Functions settings');
  console.log('   - Check edge function logs in Supabase dashboard');
  console.log('   - Ensure your project reference and anon key are correct');
  console.log('   - Verify the booking confirmation function is deployed');
  console.log('   - Check that .env.local has the correct Supabase URL and keys');

  rl.close();
}

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Test cancelled by user');
  rl.close();
  process.exit(0);
});

main().catch(console.error); 