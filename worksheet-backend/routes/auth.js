const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// Admin register (optional, for initial setup)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const admin = new Admin({ username, email, password });
    await admin.save();
    res.json({ success: true, admin: { id: admin._id, username, email } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router; 