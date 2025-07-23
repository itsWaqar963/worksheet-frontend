const mongoose = require('mongoose');

const WorksheetSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  tags: [String],
  grade: String,
  fileUrl: String,
  originalName: String, // store the original filename
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worksheet', WorksheetSchema); 