import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET hackathons
router.get('/', (req, res) => {
  res.json({ success: true, hackathons: db.hackathons });
});

// POST new hackathon
router.post('/', (req, res) => {
  const { title, description, prizePool, date, type, scope } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Hackathon title and description are required.' });
  }

  const newHack = {
    id: `hack-${Date.now()}`,
    title,
    description,
    prizePool: prizePool || '₹1,00,000',
    date: date || 'June 15, 2026',
    type: type || 'Offline',
    scope: scope || 'National',
    category: 'Upcoming',
    isRegistered: false
  };

  db.hackathons.unshift(newHack);

  res.json({ success: true, hackathon: newHack, hackathons: db.hackathons, message: 'Hackathon posted!' });
});

// POST RSVP toggle
router.post('/:id/rsvp', (req, res) => {
  const { id } = req.params;
  const hack = db.hackathons.find(h => h.id === id);

  if (!hack) {
    return res.status(404).json({ success: false, message: 'Hackathon not found.' });
  }

  hack.isRegistered = !hack.isRegistered;

  // Re-calculate user stats
  const registeredEventsCount = db.events.filter(e => e.isRegistered).length;
  const registeredHackathonsCount = db.hackathons.filter(h => h.isRegistered).length;
  db.user.eventsJoinedCount = registeredEventsCount + registeredHackathonsCount;

  res.json({ success: true, hackathon: hack, hackathons: db.hackathons, user: db.user });
});

export default router;
