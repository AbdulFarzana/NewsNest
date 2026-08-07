import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all community posts
router.get('/', (req, res) => {
  res.json({ success: true, posts: db.posts });
});

// POST new community feed post
router.post('/', (req, res) => {
  const { content, category } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: 'Post content cannot be empty.' });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    author: {
      name: db.user.name,
      rollNumber: db.user.rollNumber,
      avatarUrl: db.user.avatarUrl,
      role: db.user.role
    },
    content,
    timestamp: 'Just now',
    category: category || 'General Discussion',
    likes: 0,
    isLiked: false,
    comments: []
  };

  db.posts.unshift(newPost);
  db.user.postsCount += 1;

  res.json({ success: true, post: newPost, posts: db.posts, message: 'Post published to database community feed!' });
});

// POST toggle like post
router.post('/:id/like', (req, res) => {
  const { id } = req.params;
  const post = db.posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  post.isLiked = !post.isLiked;
  post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;

  res.json({ success: true, post, posts: db.posts });
});

// POST comment on a post
router.post('/:id/comment', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
  }

  const post = db.posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: db.user.name,
    avatarUrl: db.user.avatarUrl,
    text,
    timestamp: 'Just now'
  };

  post.comments = post.comments || [];
  post.comments.push(newComment);

  res.json({ success: true, post, posts: db.posts });
});

export default router;
