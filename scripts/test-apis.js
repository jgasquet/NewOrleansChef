#!/usr/bin/env node

/**
 * API Test Script - NewOrleansChef
 * Tests Ticketmaster, Eventbrite, and Uber APIs
 * Run: node scripts/test-apis.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

async function testTicketmaster() {
  log.info('Testing Ticketmaster API...');
  
  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: process.env.TICKETMASTER_API_KEY,
        city: 'New Orleans',
        stateCode: 'LA',
        size: 5,
      },
    });

    const events = response.data._embedded?.events || [];
    
    if (events.length > 0) {
      log.success(`Ticketmaster API working! Found ${events.length} events`);
      console.log(`   Sample: "${events[0].name}" on ${events[0].dates.start.localDate}`);
      return true;
    } else {
      log.warn('Ticketmaster API working but no events found');
      return true;
    }
  } catch (error) {
    log.error(`Ticketmaster API failed: ${error.response?.data?.fault?.detail || error.message}`);
    if (error.response?.status === 401) {
      log.error('   Invalid API key - check TICKETMASTER_API_KEY');
    }
    return false;
  }
}

async function testEventbrite() {
  log.info('Testing Eventbrite API...');
  
  try {
    const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
      headers: {
        'Authorization': `Bearer ${process.env.EVENTBRITE_PRIVATE_TOKEN}`,
      },
      params: {
        'location.address': 'New Orleans, LA',
        'location.within': '25mi',
        'page_size': 5,
      },
    });

    const events = response.data.events || [];
    
    if (events.length > 0) {
      log.success(`Eventbrite API working! Found ${events.length} events`);
      console.log(`   Sample: "${events[0].name.text}"`);
      return true;
    } else {
      log.warn('Eventbrite API working but no events found');
      return true;
    }
  } catch (error) {
    log.error(`Eventbrite API failed: ${error.response?.data?.error_description || error.message}`);
    if (error.response?.status === 401) {
      log.error('   Invalid token - check EVENTBRITE_PRIVATE_TOKEN');
    }
    return false;
  }
}

async function testUber() {
  log.info('Testing Uber API...');
  
  // Note: Without a server token, we can only test the deep link generation
  // Server token requires OAuth flow with Client ID + Secret
  
  if (!process.env.UBER_SERVER_TOKEN) {
    log.warn('Uber Server Token not configured - can only test deep links');
    log.info('   Run: node scripts/generate-uber-token.js to get a server token');
    
    // Test deep link generation
    const clientId = process.env.UBER_CLIENT_ID || process.env.NEXT_PUBLIC_UBER_CLIENT_ID;
    if (clientId) {
      const testLink = `https://m.uber.com/ul/?client_id=${clientId}&dropoff[latitude]=29.9273&dropoff[longitude]=-90.0875&dropoff[nickname]=Commander's%20Palace`;
      log.success('Uber deep links configured correctly');
      console.log(`   Test link: ${testLink}`);
      return true;
    } else {
      log.error('Uber Client ID not found');
      return false;
    }
  }
  
  try {
    // Test with Commander's Palace coordinates (Garden District)
    const response = await axios.get('https://api.uber.com/v1.2/estimates/price', {
      headers: {
        'Authorization': `Token ${process.env.UBER_SERVER_TOKEN}`,
      },
      params: {
        start_latitude: 29.9584,  // French Quarter
        start_longitude: -90.0644,
        end_latitude: 29.9273,    // Commander's Palace
        end_longitude: -90.0875,
      },
    });

    const prices = response.data.prices || [];
    
    if (prices.length > 0) {
      log.success(`Uber API working! Found ${prices.length} ride options`);
      console.log(`   Sample: ${prices[0].display_name} - $${prices[0].low_estimate}-${prices[0].high_estimate}`);
      return true;
    } else {
      log.warn('Uber API working but no ride options found');
      return true;
    }
  } catch (error) {
    log.error(`Uber API failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.status === 401) {
      log.error('   Invalid token - generate a new UBER_SERVER_TOKEN');
    }
    return false;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('NewOrleansChef - API Integration Tests');
  console.log('='.repeat(60) + '\n');

  const results = {
    ticketmaster: await testTicketmaster(),
    eventbrite: await testEventbrite(),
    uber: await testUber(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('Test Results:');
  console.log('='.repeat(60));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([api, passed]) => {
    const status = passed ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`${api.padEnd(20)} ${status}`);
  });
  
  console.log('='.repeat(60));
  console.log(`\nOverall: ${passed}/${total} APIs working\n`);
  
  if (passed === total) {
    log.success('All APIs configured correctly! You\'re ready to build! 🚀');
  } else {
    log.warn('Some APIs need attention. Check error messages above.');
  }
  
  console.log('\nNext Steps:');
  console.log('1. If Uber shows warning, run: node scripts/generate-uber-token.js');
  console.log('2. Start dev server: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  console.log('');
}

runTests().catch(error => {
  log.error(`Test script failed: ${error.message}`);
  process.exit(1);
});
