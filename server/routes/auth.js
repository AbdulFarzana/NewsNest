import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET current logged-in user profile
router.get('/me', (req, res) => {
  res.json({ success: true, user: db.user });
});

// POST login
router.post('/login', (req, res) => {
  const { emailOrRoll, password } = req.body;
  if (!emailOrRoll || !password) {
    return res.status(400).json({ success: false, message: 'Email/Roll Number and Password are required.' });
  }

  // Find user or allow demo quick login
  const existingUser = db.registeredUsers.find(
    u => u.email.toLowerCase() === emailOrRoll.toLowerCase() || u.rollNumber.toLowerCase() === emailOrRoll.toLowerCase()
  );

  if (existingUser) {
    // Sync current db.user name and details
    db.user.name = existingUser.name;
    db.user.email = existingUser.email;
    db.user.rollNumber = existingUser.rollNumber;
    db.user.role = existingUser.role;
    return res.json({ success: true, user: db.user, message: 'Logged in successfully!' });
  }

  // If new user email/roll login dynamically
  const newUserRecord = {
    id: `usr_${Date.now()}`,
    email: emailOrRoll.includes('@') ? emailOrRoll : `${emailOrRoll.toLowerCase()}@college.edu`,
    rollNumber: emailOrRoll.includes('@') ? '21CS' + Math.floor(1000 + Math.random() * 9000) : emailOrRoll.toUpperCase(),
    password: password,
    name: emailOrRoll.split('@')[0].replace('.', ' ').toUpperCase(),
    role: 'Student Representative'
  };

  db.registeredUsers.push(newUserRecord);
  db.user.name = newUserRecord.name;
  db.user.email = newUserRecord.email;
  db.user.rollNumber = newUserRecord.rollNumber;
  db.user.role = newUserRecord.role;

  res.json({ success: true, user: db.user, message: 'Logged in successfully!' });
});

// POST register new user
router.post('/register', (req, res) => {
  const { name, email, rollNumber, password, role } = req.body;
  
  if (!name || !email || !rollNumber || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required for registration.' });
  }

  const existing = db.registeredUsers.find(u => u.email === email || u.rollNumber === rollNumber);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Account with this email or roll number already exists.' });
  }

  const newUserRecord = {
    id: `usr_${Date.now()}`,
    email,
    rollNumber,
    password,
    name,
    role: role || 'Computer Science Undergraduate'
  };

  db.registeredUsers.push(newUserRecord);

  // Update current active profile
  db.user = {
    ...db.user,
    id: newUserRecord.id,
    name: newUserRecord.name,
    email: newUserRecord.email,
    rollNumber: newUserRecord.rollNumber,
    role: newUserRecord.role
  };

  res.json({ success: true, user: db.user, message: 'Registration successful!' });
});

// PUT update profile
router.put('/profile', (req, res) => {
  const updated = req.body;
  db.user = {
    ...db.user,
    ...updated
  };
  res.json({ success: true, user: db.user, message: 'Profile updated in database successfully!' });
});

export default router;
