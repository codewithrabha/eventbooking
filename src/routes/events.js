const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/', 
  authenticateUser,
  [
    body('title').notEmpty().trim(),
    body('date').isISO8601(),
    body('capacity').isInt({ min: 1 }),
    body('price').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...req.body,
          created_by: req.user.id
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Update event
router.put('/:id',
  authenticateUser,
  [
    body('title').optional().trim(),
    body('date').optional().isISO8601(),
    body('capacity').optional().isInt({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .update(req.body)
        .eq('id', req.params.id)
        .eq('created_by', req.user.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Event not found or unauthorized' });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Delete event
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
      .eq('created_by', req.user.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { eventRoutes: router };