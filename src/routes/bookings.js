const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/',
  authenticateUser,
  [
    body('event_id').notEmpty(),
    body('quantity').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', req.body.event_id)
        .single();

      if (eventError) throw eventError;
      if (!event) return res.status(404).json({ error: 'Event not found' });

      // Calculate total price
      const totalPrice = event.price * req.body.quantity;

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          event_id: req.body.event_id,
          user_id: req.user.id,
          quantity: req.body.quantity,
          total_price: totalPrice
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Cancel booking
router.put('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found or unauthorized' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { bookingRoutes: router };