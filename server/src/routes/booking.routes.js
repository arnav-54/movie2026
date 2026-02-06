const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);

module.exports = router;
