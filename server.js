import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import API handlers
import gptHandler from './api/gpt.js';
import sttHandler from './api/stt.js';
import ttsHandler from './api/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 20356;

// Middleware
app.use(cors());
// Parse JSON bodies except for STT which uses formidable
app.use((req, res, next) => {
  if (req.path === '/api/stt') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// API Routes
app.post('/api/gpt', (req, res) => gptHandler(req, res));
app.post('/api/stt', (req, res) => sttHandler(req, res));
app.post('/api/tts', (req, res) => ttsHandler(req, res));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
