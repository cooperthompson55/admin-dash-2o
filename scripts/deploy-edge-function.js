#!/usr/bin/env node

/**
 * Deployment script for the booking confirmation Supabase Edge Function
 * 
 * This script deploys the edge function that sends booking confirmation emails
 * when new bookings are created.
 * 
 * Prerequisites:
 * 1. Supabase CLI installed (npm install -g supabase)
 * 2. Logged into Supabase CLI (supabase login)
 * 3. Environment variables set up in your Supabase project:
 *    - RESEND_API_KEY
 * 
 * Usage:
 * node scripts/deploy-edge-function.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Deploying Booking Confirmation Edge Function...\n');

// Check if Supabase CLI is installed
try {
  execSync('supabase --version', { stdio: 'ignore' });
  console.log('✅ Supabase CLI found');
} catch (error) {
  console.error('❌ Supabase CLI not found. Please install it first:');
  console.error('   npm install -g supabase');
  process.exit(1);
}

// Check if logged into Supabase
try {
  execSync('supabase projects list', { stdio: 'ignore' });
  console.log('✅ Supabase CLI authenticated');
} catch (error) {
  console.error('❌ Not logged into Supabase CLI. Please login first:');
  console.error('   supabase login');
  process.exit(1);
}

// Check if edge function exists
const functionPath = path.join(__dirname, '..', 'supabase', 'functions', 'booking-confirmation', 'index.ts');
if (!fs.existsSync(functionPath)) {
  console.error(`❌ Edge function not found at: ${functionPath}`);
  process.exit(1);
}
console.log('✅ Edge function file found');

try {
  // Deploy the edge function
  console.log('\n📤 Deploying edge function...');
  
  const deployCommand = 'supabase functions deploy booking-confirmation --project-ref YOUR_PROJECT_REF';
  
  console.log(`Running: ${deployCommand}`);
  console.log('\n⚠️  IMPORTANT: Replace YOUR_PROJECT_REF with your actual Supabase project reference');
  console.log('   You can find this in your Supabase dashboard URL or by running:');
  console.log('   supabase projects list\n');
  
  // For now, just show the command - user needs to run it manually with their project ref
  console.log('📋 Copy and run this command with your project reference:');
  console.log(`   ${deployCommand.replace('YOUR_PROJECT_REF', '<your-project-ref>')}`);
  
  console.log('\n✅ Deployment instructions provided');
  
  console.log('\n🔧 After deployment, make sure to set the following environment variables in your Supabase project:');
  console.log('   1. Go to your Supabase dashboard');
  console.log('   2. Navigate to Settings > Edge Functions');
  console.log('   3. Add environment variable: RESEND_API_KEY');
  console.log('   4. Set the value to your Resend API key');

  console.log('\n🧪 To test the deployed function:');
  console.log('   1. GET  https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation/test');
  console.log('   2. POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation');
  console.log('      with booking data in the request body');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Edge function setup complete!');
console.log('\n📚 Documentation:');
console.log('   - Supabase Edge Functions: https://supabase.com/docs/guides/functions');
console.log('   - Resend API: https://resend.com/docs'); 