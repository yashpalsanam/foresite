import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'page_view',
        'property_view',
        'property_search',
        'inquiry_submitted',
        'user_registered',
        'user_login',
        'property_favorite',
        'property_share',
        'form_submitted',
        'button_click',
        'error_occurred',
        'api_call',
        'other',
      ],
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
    browser: {
      type: String,
      default: null,
    },
    os: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    query: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    relatedModel: {
      type: String,
      enum: ['Property', 'Inquiry', 'User', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    duration: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'error', 'pending'],
      default: 'success',
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ user: 1, createdAt: -1 });
analyticsEventSchema.index({ sessionId: 1 });
analyticsEventSchema.index({ createdAt: -1 });
analyticsEventSchema.index({ relatedModel: 1, relatedId: 1 });

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);
