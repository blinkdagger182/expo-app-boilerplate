#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script validates that all required environment variables are set
 * before the app starts. Run this in CI/CD pipelines and pre-build hooks.
 * 
 * Usage:
 *   node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key] = value;
      }
    }
  });
}

const requiredEnvVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_SUPERWALL_API_KEY_IOS',
  'EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID',
  'EXPO_PUBLIC_GEMINI_API_KEY',
];

const optionalEnvVars = [
  'EXPO_PUBLIC_GCP_OCR_URL',
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;
const missing = [];
const invalid = [];

// Check required variables
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  
  if (!value) {
    missing.push(varName);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('_here')) {
    invalid.push(varName);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

// Check optional variables
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (optional)`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

// Report errors
if (hasErrors) {
  console.log('\n❌ Environment validation failed!\n');
  
  if (missing.length > 0) {
    console.log('Missing required variables:');
    missing.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }
  
  if (invalid.length > 0) {
    console.log('\nVariables with placeholder values:');
    invalid.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }
  
  console.log('\n📝 To fix this:');
  console.log('  1. Copy .env.example to .env');
  console.log('  2. Fill in your actual API keys and URLs');
  console.log('  3. See docs/ENVIRONMENT_SETUP.md for details\n');
  
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!\n');
process.exit(0);
