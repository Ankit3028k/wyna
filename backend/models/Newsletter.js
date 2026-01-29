const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  preferences: {
    sareeCollections: {
      type: Boolean,
      default: true
    },
    exclusiveOffers: {
      type: Boolean,
      default: true
    },
    newArrivals: {
      type: Boolean,
      default: true
    },
    weavingTechniques: {
      type: Boolean,
      default: false
    }
  },
  source: {
    type: String,
    enum: ['website', 'social_media', 'referral', 'advertisement'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  unsubscribedAt: Date,
  lastEmailSent: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', newsletterSchema);