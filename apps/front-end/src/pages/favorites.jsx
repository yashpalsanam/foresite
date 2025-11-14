import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, SEOHead, Breadcrumbs } from '@/components/layout';
import { PropertyCard } from '@/components/property';
import { DotsLoader } from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { useFavorites } from '@/context/FavoritesContext';
import apiClient from '@/utils/apiClient';
import { motion } from 'framer-motion';

/**
 * Favorites Page
 * Display user's saved favorite properties
 */

export default function FavoritesPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (!favorites || favorites.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const propertyIds = favorites.map((fav) =>
          typeof fav === 'object' ? fav.id : fav
        );

        const requests = propertyIds.map((id) =>
          apiClient.get(`/properties/${id}`).catch(() => null)
        );

        const results = await Promise.all(requests);

        const validProperties = results
          .filter((result) => result && result.data)
          .map((result) => result.data);

        setProperties(validProperties);
      } catch (err) {
        console.error('Error fetching favorite properties:', err);
        setError('Failed to load favorite properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favorites]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites();
      setProperties([]);
    }
  };

  return (
    <>
      <SEOHead
        title="My Favorites"
        description="View and manage your favorite properties"
      />

      <Navbar />

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <section className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="container py-8">
            <Breadcrumbs />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
                  My Favorites
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
                  {favoritesCount > 0
                    ? `You have ${favoritesCount} saved ${favoritesCount === 1 ? 'property' : 'properties'}`
                    : 'No saved properties yet'}
                </p>
              </div>
              {favoritesCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section">
          <div className="container">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <DotsLoader size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Error Loading Favorites
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">{error}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : properties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-neutral-400 dark:text-neutral-600 text-8xl mb-6">
                  ❤️
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  No Favorites Yet
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                  Start exploring properties and save your favorites by clicking the heart icon
                </p>
                <Link href="/properties">
                  <Button variant="primary" size="lg">
                    Browse Properties
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id || property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {properties.length > 0 && (
          <section className="section bg-primary-600 dark:bg-primary-800 text-white">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Take the Next Step?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Contact us to schedule viewings or get more information about your favorite properties
              </p>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
