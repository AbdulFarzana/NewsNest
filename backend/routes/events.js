import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET events
router.get('/', (req, res) => {
  res.json({ success: true, events: db.events });
});

// POST new event
router.post('/', (req, res) => {
  const { title, description, time, location, date, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Event title and description are required.' });
  }

  const newEvt = {
    id: `evt-${Date.now()}`,
    title,
    description,
    date: date || 'May 25, 2026',
    time: time || '10:00 AM - 01:00 PM',
    location: location || 'Auditorium Block A',
    category: category || 'Upcoming',
    isRegistered: false,
    imagePlaceholderColor: 'from-blue-600 to-indigo-600'
  };

  db.events.unshift(newEvt);

  res.json({ success: true, event: newEvt, events: db.events, message: 'New event published!' });
});

// POST RSVP toggle
router.post('/:id/rsvp', (req, res) => {
  const { id } = req.params;
  const evt = db.events.find(e => e.id === id);

  if (!evt) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  evt.isRegistered = !evt.isRegistered;
  
  // Re-calculate user stats
  const registeredEventsCount = db.events.filter(e => e.isRegistered).length;
  const registeredHackathonsCount = db.hackathons.filter(h => h.isRegistered).length;
  db.user.eventsJoinedCount = registeredEventsCount + registeredHackathonsCount;

  res.json({ success: true, event: evt, events: db.events, user: db.user });
});

export default router;
