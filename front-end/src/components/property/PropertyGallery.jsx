import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

/**
 * PropertyGallery Component
 * Image gallery with lightbox for property images
 */

const PropertyGallery = ({ images = [], title = 'Property' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-neutral-200 rounded-xl aspect-video flex items-center justify-center">
        <p className="text-neutral-500">No images available</p>
      </div>
    );
  }

  const openLightbox = (index) => {
    setSelectedImage(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Main Image */}
        <div 
          className="col-span-4 md:col-span-3 row-span-2 relative aspect-video md:aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0].url || images[0]}
            alt={`${title} - Main view`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 75vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>View all {images.length} photos</span>
          </div>
        </div>

        {/* Thumbnail Images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index + 1}
            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={image.url || image}
              alt={`${title} - View ${index + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                +{images.length - 5} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {showLightbox && typeof window !== 'undefined' && createPortal(
        <Lightbox
          images={images}
          selectedImage={selectedImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
          title={title}
        />,
        document.body
      )}
    </>
  );
};

/**
 * Lightbox Component
 */
const Lightbox = ({ images, selectedImage, onClose, onNext, onPrevious, title }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-neutral-300 z-10"
          aria-label="Close gallery"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={onPrevious}
            className="absolute left-4 text-white hover:text-neutral-300 p-2 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Previous image"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Image */}
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center px-16"
        >
          <div className="relative w-full h-full">
            <Image
              src={images[selectedImage].url || images[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>
        </motion.div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-4 text-white hover:text-neutral-300 p-2 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Next image"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
          {selectedImage + 1} / {images.length}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-3xl px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onPrevious(index)}
              className={clsx(
                'relative flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2',
                selectedImage === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={image.url || image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyGallery;
