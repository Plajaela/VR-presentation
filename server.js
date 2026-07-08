import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import formidable from 'formidable';

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
// Parse JSON bodies except for file upload endpoints which use formidable
app.use((req, res, next) => {
  if (req.path === '/api/stt' || req.path === '/api/upload-video' || req.path === '/api/upload-image') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// API Routes
app.post('/api/gpt', (req, res) => gptHandler(req, res));
app.post('/api/stt', (req, res) => sttHandler(req, res));
app.post('/api/tts', (req, res) => ttsHandler(req, res));

// Admin Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'password';

  if (username === expectedUsername && password === expectedPassword) {
    return res.json({ success: true, token: 'admin-session-token' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// Admin Save Projects Endpoint
app.post('/api/projects', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-session-token') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  const { projects } = req.body;
  if (!Array.isArray(projects)) {
    return res.status(400).json({ success: false, message: 'Invalid projects data format' });
  }

  try {
    const dataString = JSON.stringify(projects, null, 2);
    
    // Save to public/projects.json (source code)
    const publicPath = path.join(__dirname, 'public', 'projects.json');
    await fs.writeFile(publicPath, dataString, 'utf8');

    // Save to dist/projects.json if dist directory exists (served output)
    const distPath = path.join(__dirname, 'dist', 'projects.json');
    try {
      await fs.writeFile(distPath, dataString, 'utf8');
    } catch {
      // Ignore if dist doesn't exist yet
    }

    return res.json({ success: true, message: 'Projects saved successfully' });
  } catch (error) {
    console.error('Error saving projects:', error);
    return res.status(500).json({ success: false, message: 'Failed to write projects file to disk' });
  }
});

// Admin Save Demo Endpoint
app.post('/api/demo', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-session-token') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  const { demoData } = req.body;
  // Accept both the newer array-of-demos format and the legacy single object;
  // the file is always stored as an array.
  const demoList = Array.isArray(demoData)
    ? demoData
    : demoData && typeof demoData === 'object'
      ? [demoData]
      : null;
  if (!demoList || demoList.some((d) => !d || typeof d !== 'object' || Array.isArray(d))) {
    return res.status(400).json({ success: false, message: 'Invalid demo data format' });
  }

  try {
    const dataString = JSON.stringify(demoList, null, 2);
    
    // Save to public/demo.json (source code)
    const publicPath = path.join(__dirname, 'public', 'demo.json');
    await fs.writeFile(publicPath, dataString, 'utf8');

    // Save to dist/demo.json if dist directory exists (served output)
    const distPath = path.join(__dirname, 'dist', 'demo.json');
    try {
      await fs.writeFile(distPath, dataString, 'utf8');
    } catch {
      // Ignore if dist doesn't exist yet
    }

    return res.json({ success: true, message: 'Demo configuration saved successfully' });
  } catch (error) {
    console.error('Error saving demo:', error);
    return res.status(500).json({ success: false, message: 'Failed to write demo file to disk' });
  }
});

// Admin Save Video Upload Endpoint
app.post('/api/upload-video', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-session-token') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB max limit
    });

    const [, files] = await form.parse(req);
    const videoFile = files.video?.[0];

    if (!videoFile) {
      return res.status(400).json({ success: false, message: 'No video file received' });
    }

    const originalName = videoFile.originalFilename || 'uploaded-video.mp4';
    // Generate a safe unique filename
    const ext = path.extname(originalName) || '.mp4';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    const safeName = `video-${Date.now()}-${baseName}${ext}`;

    const publicDir = path.join(__dirname, 'public');
    const publicPath = path.join(publicDir, safeName);

    // Save to public directory (source code static assets)
    await fs.copyFile(videoFile.filepath, publicPath);
    await fs.unlink(videoFile.filepath);

    // Save to dist directory (served static assets) if dist exists
    const distDir = path.join(__dirname, 'dist');
    const distPath = path.join(distDir, safeName);
    try {
      await fs.copyFile(publicPath, distPath);
    } catch {
      // Ignore if dist doesn't exist yet
    }

    return res.json({
      success: true,
      message: 'Video uploaded successfully',
      videoUrl: `/${safeName}`
    });
  } catch (error) {
    console.error('Video upload failed:', error);
    return res.status(500).json({ success: false, message: 'Video upload failed: ' + error.message });
  }
});

// Admin Project Image Upload Endpoint
app.post('/api/upload-image', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-session-token') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024, // 15MB max limit
    });

    const [, files] = await form.parse(req);
    const imageFile = files.image?.[0];

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'No image file received' });
    }

    const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (imageFile.mimetype && !allowedMimeTypes.has(imageFile.mimetype)) {
      await fs.unlink(imageFile.filepath).catch(() => {});
      return res.status(400).json({ success: false, message: 'Only JPG, PNG, WebP, or GIF images are allowed' });
    }

    const originalName = imageFile.originalFilename || 'uploaded-image.png';
    const ext = path.extname(originalName).toLowerCase() || '.png';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    const safeName = `image-${Date.now()}-${baseName}${ext}`;

    const publicUploadDir = path.join(__dirname, 'public', 'uploads');
    await fs.mkdir(publicUploadDir, { recursive: true });
    const publicPath = path.join(publicUploadDir, safeName);

    await fs.copyFile(imageFile.filepath, publicPath);
    await fs.unlink(imageFile.filepath);

    const distUploadDir = path.join(__dirname, 'dist', 'uploads');
    const distPath = path.join(distUploadDir, safeName);
    try {
      await fs.mkdir(distUploadDir, { recursive: true });
      await fs.copyFile(publicPath, distPath);
    } catch {
      // Ignore if dist doesn't exist yet
    }

    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${safeName}`,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
