// rideshareRoutes.js - Express routes for rideshare comparison
const express = require('express');
const router = express.Router();
const rideshareController = require('../controllers/rideshareController');

// Simple auth middleware for MVP
const authenticateUser = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (process.env.NODE_ENV === 'development' || apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid API key'
    });
  }
};

/**
 * POST /api/rideshare/compare
 * Compare ride options from multiple providers
 *
 * Body: {
 *   pickup: { latitude, longitude },
 *   dropoff: { latitude, longitude },
 *   passengers: 1,
 *   filters: { wheelchair, carSeat, luxury, shared },
 *   eventId: "optional"
 * }
 */
router.post('/compare', authenticateUser, rideshareController.compareRides.bind(rideshareController));

/**
 * POST /api/rideshare/track-booking
 * Track when user clicks to book a ride
 *
 * Body: {
 *   provider: "uber",
 *   rideType: "uberX",
 *   price: 15.50,
 *   eventId: "optional"
 * }
 */
router.post('/track-booking', authenticateUser, rideshareController.trackBooking.bind(rideshareController));

module.exports = router;
