import Property from '../models/Property.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { geocodeAddress } from '../config/googleMaps.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    status,
    listingType,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    search,
    sortBy = '-createdAt',
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (listingType) query.listingType = listingType;
  if (propertyType) query.propertyType = propertyType;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) };
  if (bathrooms) query['features.bathrooms'] = { $gte: Number(bathrooms) };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
      { 'address.state': { $regex: search, $options: 'i' } },
      { keywords: { $in: [new RegExp(search, 'i')] } },
      { amenities: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const properties = await Property.find(query)
    .populate('owner', 'name email phone')
    .populate('agent', 'name email phone')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort(sortBy);

  const count = await Property.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    },
  });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'name email phone avatar')
    .populate('agent', 'name email phone avatar');

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found',
    });
  }

  await property.incrementViews();

  res.status(200).json({
    success: true,
    data: { property },
  });
});

export const createProperty = asyncHandler(async (req, res) => {
  const propertyData = req.body;

  if (propertyData.address) {
    const { street, city, state, zipCode } = propertyData.address;
    const fullAddress = `${street}, ${city}, ${state} ${zipCode || ''}`.trim();
    
    logger.info(`Geocoding address: ${fullAddress}`);
    
    const location = await geocodeAddress(fullAddress);
    propertyData.location = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };
  }

  propertyData.owner = req.user._id;

  const property = await Property.create(propertyData);

  logger.info(`Property created: ${property._id} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: { property },
  });
});

export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found',
    });
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this property',
    });
  }

  if (req.body.address && req.body.address.street) {
    const fullAddress = `${req.body.address.street}, ${req.body.address.city}, ${req.body.address.state} ${req.body.address.zipCode}`;
    const location = await geocodeAddress(fullAddress);
    req.body.location = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  logger.info(`Property updated: ${property._id}`);

  res.status(200).json({
    success: true,
    message: 'Property updated successfully',
    data: { property },
  });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found',
    });
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this property',
    });
  }

  for (const image of property.images) {
    await deleteFromCloudinary(image.publicId);
  }

  await property.deleteOne();

  logger.info(`Property deleted: ${property._id}`);

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully',
  });
});

export const uploadPropertyImages = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found',
    });
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded',
    });
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await uploadToCloudinary(file, 'foresite/properties');
    if (result.success) {
      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
        isPrimary: property.images.length === 0 && uploadedImages.length === 0,
      });
    }
  }

  property.images.push(...uploadedImages);
  await property.save();

  logger.info(`Images uploaded to property: ${property._id}`);

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: { images: uploadedImages },
  });
});

export const deletePropertyImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found',
    });
  }

  const image = property.images.id(imageId);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: 'Image not found',
    });
  }

  await deleteFromCloudinary(image.publicId);

  property.images.pull(imageId);
  await property.save();

  logger.info(`Image deleted from property: ${property._id}`);

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully',
  });
});

export const getNearbyProperties = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistance = 10000 } = req.query;

  if (!lng || !lat) {
    return res.status(400).json({
      success: false,
      message: 'Longitude and latitude are required',
    });
  }

  const properties = await Property.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(maxDistance),
      },
    },
    status: 'available',
  }).limit(10);

  res.status(200).json({
    success: true,
    data: { properties },
  });
});

export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ isFeatured: true, status: 'available' })
    .limit(6)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: { properties },
  });
});

export const getPropertyStats = asyncHandler(async (req, res) => {
  const totalProperties = await Property.countDocuments();
  const availableProperties = await Property.countDocuments({ status: 'available' });
  const soldProperties = await Property.countDocuments({ status: 'sold' });
  const rentedProperties = await Property.countDocuments({ status: 'rented' });

  const propertiesByType = await Property.aggregate([
    { $group: { _id: '$propertyType', count: { $sum: 1 } } },
  ]);

  const averagePrice = await Property.aggregate([
    { $group: { _id: null, avgPrice: { $avg: '$price' } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalProperties,
      availableProperties,
      soldProperties,
      rentedProperties,
      propertiesByType,
      averagePrice: averagePrice[0]?.avgPrice || 0,
    },
  });
});
