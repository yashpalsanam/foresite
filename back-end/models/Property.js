import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['house', 'apartment', 'condo', 'villa', 'land', 'commercial', 'office', 'other'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending', 'draft'],
      default: 'available',
    },
    listingType: {
      type: String,
      enum: ['sale', 'rent'],
      required: [true, 'Listing type is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'USA' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    features: {
      bedrooms: { type: Number, default: 0, min: 0 },
      bathrooms: { type: Number, default: 0, min: 0 },
      area: { type: Number, required: true, min: 0 },
      areaUnit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
      yearBuilt: { type: Number, min: 1800, max: new Date().getFullYear() + 1 },
      parking: { type: Number, default: 0, min: 0 },
      floors: { type: Number, default: 1, min: 1 },
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    virtualTourUrl: {
      type: String,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

propertySchema.index({ location: '2dsphere' });
propertySchema.index({ status: 1, listingType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ isFeatured: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ agent: 1 });

propertySchema.virtual('fullAddress').get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

propertySchema.virtual('primaryImage').get(function () {
  // Check if images array exists and has items
  if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
    return null;
  }
  
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : this.images[0]?.url || null;
});

propertySchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Property', propertySchema);
