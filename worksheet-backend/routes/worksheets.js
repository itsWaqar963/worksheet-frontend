const express = require('express');
const multer = require('multer');
const Worksheet = require('../models/Worksheet');
const auth = require('../middleware/auth');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const timestamp = Date.now();
    let finalName = `${name}-${timestamp}${ext}`;
    let counter = 1;
    // Prevent overwriting: append (1), (2), etc. if file exists
    while (fs.existsSync(path.join('uploads', finalName))) {
      finalName = `${name}-${timestamp}(${counter})${ext}`;
      counter++;
    }
    cb(null, finalName);
  }
});
const upload = multer({ storage });

// Upload PDF (protected)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const { title, description, category, tags, grade } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;
  const worksheet = new Worksheet({
    title, description, category, tags: tags.split(','), grade, fileUrl,
    originalName: req.file.originalname // save the original filename
  });
  await worksheet.save();
  res.json({ success: true, worksheet });
});

// Get all worksheets (public)
router.get('/', async (req, res) => {
  const { subject, grade, category } = req.query;
  let filter = {};
  if (subject && subject !== 'All') filter.category = subject;
  if (grade && grade !== 'All') filter.grade = grade;
  if (category && category !== 'All') filter.category = category;
  const worksheets = await Worksheet.find(filter).sort({ uploadDate: -1 });
  res.json(worksheets);
});

// Get worksheet by ID (public)
router.get('/:id', async (req, res) => {
  const worksheet = await Worksheet.findById(req.params.id);
  if (!worksheet) return res.status(404).json({ message: 'Not found' });
  res.json(worksheet);
});

// Edit worksheet (protected)
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, tags, grade } = req.body;
  const worksheet = await Worksheet.findByIdAndUpdate(
    req.params.id,
    { title, description, category, tags: tags.split(','), grade },
    { new: true }
  );
  res.json({ success: true, worksheet });
});

// Delete worksheet (protected)
router.delete('/:id', auth, async (req, res) => {
  await Worksheet.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Popular worksheets (public)
router.get('/popular', async (req, res) => {
  const worksheets = await Worksheet.find().sort({ uploadDate: -1 }).limit(3);
  res.json(worksheets);
});

// Recent worksheets (public)
router.get('/recent', async (req, res) => {
  const worksheets = await Worksheet.find().sort({ uploadDate: -1 }).limit(3);
  res.json(worksheets);
});

router.get('/download/:id', async (req, res) => {
  try {
    const worksheet = await Worksheet.findById(req.params.id);
    if (!worksheet || !worksheet.fileUrl) {
      return res.status(404).send('File not found');
    }
    const filePath = path.join(__dirname, '..', worksheet.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    res.download(filePath, worksheet.originalName || path.basename(filePath));
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 