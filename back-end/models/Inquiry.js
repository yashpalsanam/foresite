import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    inquiryType: {
      type: String,
      enum: ['viewing', 'information', 'purchase', 'rent', 'other'],
      default: 'information',
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'any'],
      default: 'any',
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTime: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    responseTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({ property: 1 });
inquirySchema.index({ user: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ assignedTo: 1 });
inquirySchema.index({ isRead: 1 });
inquirySchema.index({ createdAt: -1 });

inquirySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'property',
    select: 'title propertyType price address images',
  }).populate({
    path: 'user',
    select: 'name email phone avatar',
  }).populate({
    path: 'assignedTo',
    select: 'name email role',
  });
  next();
});

export default mongoose.model('Inquiry', inquirySchema);
