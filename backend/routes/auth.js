const express = require('express');
const router = express.Router();

// A very simple token-based auth for local use. 
// In a real app we'd use JWTs or proper session cookies.
// For this MVP, we'll return a simple fixed token if credentials match.
const MOCK_TOKEN = 'kickoff-v2-local-valid-token';

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const envUser = process.env.APP_USERNAME;
  const envPass = process.env.APP_PASSWORD;

  if (!envUser || !envPass) {
    return res.status(500).json({ error: 'Server misconfiguration: credentials not set.' });
  }

  if (username === envUser && password === envPass) {
    res.json({ token: MOCK_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/auth/status', (req, res) => {
  // Simple check via Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${MOCK_TOKEN}`) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Middleware to protect routes
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === `Bearer ${MOCK_TOKEN}`) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = router;
module.exports.requireAuth = requireAuth;
