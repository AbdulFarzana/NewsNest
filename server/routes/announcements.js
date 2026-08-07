import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all announcements
router.get('/', (req, res) => {
  res.json({ success: true, announcements: db.announcements });
});

// POST new announcement
router.post('/', (req, res) => {
  const { title, description, category, author, priority, isPinned } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    description,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: category || 'General',
    author: author || db.user.name,
    priority: priority || 'Medium',
    isPinned: Boolean(isPinned)
  };

  db.announcements.unshift(newAnn);

  res.json({ success: true, announcement: newAnn, announcements: db.announcements, message: 'Official announcement posted!' });
});

// DELETE announcement
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.announcements = db.announcements.filter(a => a.id !== id);
  res.json({ success: true, announcements: db.announcements, message: 'Announcement removed.' });
});

export default router;
