#!/usr/bin/env node

/**
 * Uber Server Token Generator
 * Generates a server token for Uber API using OAuth 2.0
 * Run: node scripts/generate-uber-token.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

async function generateToken() {
  console.log('\n' + '='.repeat(60));
  console.log('Uber Server Token Generator');
  console.log('='.repeat(60) + '\n');

  const clientId = process.env.UBER_CLIENT_ID;
  const clientSecret = process.env.UBER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    log.error('Missing Uber credentials in .env.local');
    log.error('Ensure UBER_CLIENT_ID and UBER_CLIENT_SECRET are set');
    process.exit(1);
  }

  log.info('Generating server token with OAuth 2.0...');

  try {
    // Create Basic Auth header (base64 encode clientId:clientSecret)
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(
      'https://login.uber.com/oauth/v2/token',
      'grant_type=client_credentials&scope=rides.request',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in;

    log.success('Server token generated successfully!');
    console.log('\n' + '='.repeat(60));
    console.log('Add this to your .env.local file:');
    console.log('='.repeat(60));
    console.log(`\nUBER_SERVER_TOKEN=${token}\n`);
    console.log('='.repeat(60));
    console.log(`Token expires in: ${expiresIn} seconds (~${Math.floor(expiresIn / 3600)} hours)\n`);

    log.info('Copy the token above and add it to your .env.local file');
    log.info('Then run: node scripts/test-apis.js to verify everything works');

  } catch (error) {
    log.error('Failed to generate token');
    
    if (error.response) {
      log.error(`Status: ${error.response.status}`);
      log.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        log.error('\nInvalid Client ID or Client Secret');
        log.error('Double-check your credentials in .env.local');
      }
    } else {
      log.error(`Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

generateToken();
