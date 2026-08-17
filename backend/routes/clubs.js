import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET clubs
router.get('/', (req, res) => {
  res.json({ success: true, clubs: db.clubs });
});

// POST join/leave club
router.post('/:id/join', (req, res) => {
  const { id } = req.params;
  const club = db.clubs.find(c => c.id === id);

  if (!club) {
    return res.status(404).json({ success: false, message: 'Club not found.' });
  }

  club.isJoined = !club.isJoined;

  // Update joined clubs count
  db.user.clubsCount = db.clubs.filter(c => c.isJoined).length;

  res.json({ success: true, club, clubs: db.clubs, user: db.user });
});

export default router;
