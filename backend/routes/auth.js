const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/jsonStore');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = readData('users.json');
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password, // In production use bcrypt
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: 'Registration successful',
    user: userWithoutPassword,
    token: 'jwt-mock-token-' + newUser.id
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readData('users.json');
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token: 'jwt-mock-token-' + user.id
  });
});

// GET /api/auth/users (for test/admin)
router.get('/users', (req, res) => {
  const users = readData('users.json');
  const sanitized = users.map(({ password, ...rest }) => rest);
  res.json(sanitized);
});

module.exports = router;
