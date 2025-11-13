export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user',
};

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
];

export const PROPERTY_STATUS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'pending', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
];

export const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

export const INQUIRY_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const INQUIRY_TYPES = [
  { value: 'viewing', label: 'Viewing' },
  { value: 'information', label: 'Information' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'rent', label: 'Rent' },
  { value: 'other', label: 'Other' },
];

export const NOTIFICATION_TYPES = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'property', label: 'Property' },
  { value: 'system', label: 'System' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
};
