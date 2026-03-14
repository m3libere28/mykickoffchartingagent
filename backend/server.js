const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Set up simple sessions/cookies if needed, for MVP we can use simple token based
// but the prompt says simple local/private-use auth. We can use a basic cookie or header.
// To keep it simple, we'll just check for an auth header.

// Make uploads directory available if needed
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const extractRoutes = require('./routes/extract');
const followUpRoutes = require('./routes/followUp');
const summaryRoutes = require('./routes/summary');

app.use('/api', authRoutes);
app.use('/api/extract-adime', extractRoutes);
app.use('/api/extract-followup', followUpRoutes);
app.use('/api/generate-summary', summaryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(port, () => {
  console.log(`Kickoff Charting V2 Backend running on port ${port}`);
});
