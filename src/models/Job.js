const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const JobListSchema = new Schema({
  job_id: {
    type: Number,
    required: true,
    unique: true,
  },
  job_title: {
    type: String,
    required: true,

  },
  job_type: {
    type: String,
    enum: ['FT', 'FL', 'IN', 'PT'],
  },
  job_link: {
    type: String,
    required: true,
  },
  posted_date: {
    type: Date,
  },
  is_notified: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const JobList = mongoose.model('joblist', JobListSchema);
module.exports = JobList;
