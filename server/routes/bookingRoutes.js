
/*
import express from 'express';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);


export default  bookingRouter;

*/

import express from 'express';
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings
} from '../controllers/bookingController.js';

import { requireAuth } from "@clerk/express";
import { attachUser } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// Public (no login needed)
bookingRouter.post('/check-availability', checkAvailabilityAPI);

// Protected (login required)
bookingRouter.post('/book', requireAuth(), attachUser, createBooking);
bookingRouter.get('/user', requireAuth(), attachUser, getUserBookings);
bookingRouter.get('/hotel', requireAuth(), attachUser, getHotelBookings);

export default bookingRouter;

