import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET consolidated dashboard recent data
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      user: db.user,
      announcementsCount: db.announcements.length,
      recentAnnouncements: db.announcements.slice(0, 3),
      upcomingEventsCount: db.events.length + db.hackathons.length,
      recentEvents: db.events.slice(0, 3),
      recentHackathons: db.hackathons.slice(0, 2),
      joinedClubsCount: db.clubs.filter(c => c.isJoined).length,
      clubs: db.clubs,
      communityPostsCount: db.posts.length,
      recentPosts: db.posts.slice(0, 2)
    }
  });
});

export default router;
