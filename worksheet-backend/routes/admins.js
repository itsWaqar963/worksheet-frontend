const express = require('express');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all admins (protected)
router.get('/', auth, async (req, res) => {
  const admins = await Admin.find({}, '-password');
  res.json(admins);
});

// Add new admin (protected)
router.post('/', auth, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const admin = new Admin({ username, email, password });
    await admin.save();
    res.json({ success: true, admin: { id: admin._id, username, email } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Remove admin (protected)
router.delete('/:id', auth, async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 