import React, { useState } from 'react';
import { Navbar, Footer, PropertySEOHead, PropertyBreadcrumbs } from '@/components/layout';
import { PropertyGallery, PropertyFeatures, PropertySpecs, PropertyMap, SimilarProperties } from '@/components/property';
import { InquiryForm } from '@/components/forms';
import Button from '@/components/common/Button';
import { PropertyStatusBadge, FeaturedBadge } from '@/components/common/Badge';
import { formatPrice, formatArea } from '@/utils/formatPrice';
import { formatListingDate } from '@/utils/formatDate';
import { getPropertyById, getSimilarProperties } from '@/lib/getPropertyById';
import { useFavorites } from '@/context/FavoritesContext';
import { useToggle } from '@/hooks/useToggle';

export default function PropertyDetailPage({ property, similarProperties }) {
  const [inquiryModalOpen, , , toggleInquiryModal] = useToggle(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isPropertyFavorite = isFavorite(property?.id);

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-neutral-600 mb-8">The property you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/properties'}>
            Browse Properties
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const mapLocation = property.location?.coordinates
    ? {
        lat: property.location.coordinates[1],
        lng: property.location.coordinates[0],
        latitude: property.location.coordinates[1],
        longitude: property.location.coordinates[0],
        address: property.address?.street ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}` : null,
        city: property.address?.city,
        state: property.address?.state,
        zipCode: property.address?.zipCode,
      }
    : null;

  const propertyFeatures = {
    bedrooms: property.features?.bedrooms,
    bathrooms: property.features?.bathrooms,
    area: property.features?.area,
    areaUnit: property.features?.areaUnit || 'sqft',
    yearBuilt: property.features?.yearBuilt,
    parking: property.features?.parking,
    floors: property.features?.floors,
  };

  return (
    <>
      <PropertySEOHead property={property} />
      <Navbar />

      <main>
        {/* Breadcrumbs */}
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="container py-4">
            <PropertyBreadcrumbs property={property} />
          </div>
        </section>

        {/* Property Gallery */}
        <section className="section-sm">
          <div className="container">
            <PropertyGallery images={property.images} title={property.title} />
          </div>
        </section>

        {/* Property Details */}
        <section className="section-sm">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <PropertyStatusBadge status={property.status} />
                    {property.featured && <FeaturedBadge />}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-lg text-neutral-600 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {property.address?.street ? `${property.address.street}, ${property.address.city}, ${property.address.state}` : `${property.address?.city || ''}, ${property.address?.state || ''}`}
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">
                    {formatListingDate(property.createdAt)}
                  </p>
                </div>

                {/* Price & Quick Stats */}
                <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-primary-600">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">{property.listingType === 'rent' ? 'per month' : ''}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-neutral-600">
                    <div className="text-center">
                      <p className="font-semibold text-2xl text-neutral-900">{propertyFeatures.bedrooms || 0}</p>
                      <p>Beds</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-2xl text-neutral-900">{propertyFeatures.bathrooms || 0}</p>
                      <p>Baths</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-2xl text-neutral-900">{formatArea(propertyFeatures.area || 0)}</p>
                      <p>{propertyFeatures.areaUnit}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Property</h2>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {/* Property Specs */}
                <PropertySpecs property={{
                  type: property.propertyType,
                  bedrooms: propertyFeatures.bedrooms,
                  bathrooms: propertyFeatures.bathrooms,
                  area: propertyFeatures.area,
                  yearBuilt: propertyFeatures.yearBuilt,
                  floors: propertyFeatures.floors,
                  parking: propertyFeatures.parking,
                }} />

                {/* Features & Amenities */}
                <PropertyFeatures amenities={property.amenities || []} features={[]} />

                {/* Keywords */}
                {property.keywords && property.keywords.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">Property Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {mapLocation && <PropertyMap location={mapLocation} />}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Contact Card */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-semibold">Interested in this property?</h3>
                    <Button variant="primary" fullWidth onClick={toggleInquiryModal}>
                      Send Inquiry
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => toggleFavorite(property)}
                      leftIcon={
                        <svg className="h-5 w-5" fill={isPropertyFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      }
                    >
                      {isPropertyFavorite ? 'Saved' : 'Save Property'}
                    </Button>
                    <a href={`tel:+1234567890`}>
                      <Button variant="secondary" fullWidth>
                        Call Agent
                      </Button>
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <section className="section bg-neutral-50">
            <div className="container">
              <SimilarProperties propertyId={property.id} />
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Inquiry Modal */}
      <InquiryForm
        property={property}
        isOpen={inquiryModalOpen}
        onClose={toggleInquiryModal}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const [propertyResult, similarProperties] = await Promise.all([
      getPropertyById(id),
      getSimilarProperties(id, 4),
    ]);

    if (!propertyResult.success || propertyResult.notFound) {
      return { notFound: true };
    }

    return {
      props: {
        property: propertyResult.property,
        similarProperties,
      },
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { notFound: true };
  }
}
