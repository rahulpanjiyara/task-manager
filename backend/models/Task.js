const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ['TODO', 'DONE'],
    default: 'TODO'
  },

  linkedFile: {
    data: Buffer,           // stores file as binary (Blob equivalent in MongoDB)
    contentType: String     // e.g., 'application/pdf'
  },

  createdOn: {
    type: Date,
    default: Date.now,      // auto-generate when created
    required: true
  },

  deadline: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Task', TaskSchema);
