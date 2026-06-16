import express from 'express';
import { protect } from '../middleware/auth';
import Video from '../models/Video';
import Topic from '../models/Topic';
import Faq from '../models/Faq';

const router = express.Router();

// FAQs - use DB when available
router.get('/faq', async (req: any, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    if (faqs && faqs.length) return res.json({ success: true, data: faqs });
    // fallback static
    return res.json({ success: true, data: [ { id: '1', category: 'Reproductive Health', question: 'What is reproductive health education?', answer: 'Reproductive health education teaches you about your body, how it works, and how to make informed decisions about your health and future.' } ] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create FAQ (protected)
router.post('/faq', protect, async (req: any, res) => {
  try {
    const { category, question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ success: false, message: 'Question and answer required' });
    const f = await Faq.create({ category, question, answer, createdBy: req.user._id });
    res.status(201).json({ success: true, data: f });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

// Update FAQ (protected)
router.put('/faq/:id', protect, async (req: any, res) => {
  try {
    const f = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!f) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: f });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

// Delete FAQ (protected)
router.delete('/faq/:id', protect, async (req: any, res) => {
  try {
    const f = await Faq.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Myths (static for now)
router.get('/myths', (req, res) => {
  res.json({ success: true, data: [ { id: '1', category: 'Pregnancy Facts', myth: "You can't get pregnant the first time", truth: 'FALSE - You can get pregnant any time you engage in sexual activity, including the first time.', explanation: 'Once a girl starts menstruating, pregnancy is possible.' } ] });
});

// Topics CRUD
router.get('/topics', async (req: any, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json({ success: true, data: topics });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/topics/:id', async (req: any, res) => {
  try { const t = await Topic.findById(req.params.id); if (!t) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, data: t }); } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/topics', protect, async (req: any, res) => {
  try { const { title, description, category, content } = req.body; if (!title) return res.status(400).json({ success: false, message: 'Title required' }); const t = await Topic.create({ title, description, category, content, createdBy: req.user._id }); res.status(201).json({ success: true, data: t }); } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/topics/:id', protect, async (req: any, res) => {
  try { const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!t) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, data: t }); } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/topics/:id', protect, async (req: any, res) => {
  try {
    const t = await Topic.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// List videos from DB
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new video (protected)
router.post('/videos', protect, async (req: any, res) => {
  try {
    const { title, description, url, thumbnail, protected: isProtected } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const v = await Video.create({ title, description, url, thumbnail, protected: !!isProtected, createdBy: req.user._id });
    res.status(201).json({ success: true, data: v });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload a thumbnail image (base64) -> returns public URL
router.post('/videos/upload-thumbnail', protect, async (req: any, res) => {
  try {
    const { data, ext = 'jpg' } = req.body;
    if (!data) return res.status(400).json({ success: false, message: 'Missing image data' });
    const base64 = data.replace(/^data:\w+\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `thumb-${Date.now()}.${ext}`;
    const dest = path.join(uploadsDir, filename);
    fs.writeFileSync(dest, buffer);
    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    res.status(201).json({ success: true, data: { url } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a video (protected, only super or owner)
router.delete('/videos/:id', protect, async (req: any, res) => {
  try {
    const v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.user?.role !== 'super') return res.status(403).json({ success: false, message: 'Forbidden' });
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
