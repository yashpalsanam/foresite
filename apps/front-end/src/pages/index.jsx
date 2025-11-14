import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, SEOHead } from '@/components/layout';
import { SearchBar } from '@/components/forms';
import { FeaturedProperties } from '@/components/property';
import Button from '@/components/common/Button';
import { getFeaturedProperties, getPropertyStats } from '@/lib/getProperties';
import { generateOrganizationStructuredData } from '@/lib/seo';
import { motion } from 'framer-motion';

/**
 * Homepage
 * Main landing page with hero, search, and featured properties
 */

export default function HomePage({ featuredProperties, stats }) {
  const structuredData = generateOrganizationStructuredData();

  return (
    <>
      <SEOHead
        title="Find Your Perfect Property"
        description="Discover your dream home with Foresite Real Estate. Browse luxury properties, apartments, and commercial spaces."
        structuredData={structuredData}
      />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container relative py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find Your Dream Home
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8">
                Discover the perfect property that fits your lifestyle
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-xl p-2 shadow-2xl">
                <SearchBar showFilters />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        {stats && (
          <section className="py-12 bg-white border-b border-neutral-200">
            <div className="container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard number={stats.total} label="Total Properties" />
                <StatCard number={stats.forSale} label="For Sale" />
                <StatCard number={stats.forRent} label="For Rent" />
                <StatCard number={stats.sold} label="Sold" />
              </div>
            </div>
          </section>
        )}

        {/* Featured Properties */}
        <section className="section bg-neutral-50">
          <div className="container">
            {featuredProperties && featuredProperties.length > 0 ? (
              <FeaturedProperties limit={8} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  Featured Properties
                </h2>
                <p className="text-neutral-600 mb-8">
                  Check out our hand-picked selection of premium properties
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/properties'}>
                  View All Properties
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Why Choose Foresite
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                We make finding your perfect property simple and stress-free
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="🏠"
                title="Wide Selection"
                description="Browse thousands of properties from apartments to luxury estates"
              />
              <FeatureCard
                icon="🔍"
                title="Advanced Search"
                description="Filter by location, price, size, and amenities to find exactly what you need"
              />
              <FeatureCard
                icon="🤝"
                title="Expert Support"
                description="Our team of professionals is here to guide you every step of the way"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-primary-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Start your journey today and discover properties that match your vision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button variant="secondary" size="lg">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/**
 * Stat Card Component
 */
const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
      {number?.toLocaleString() || '0'}
    </div>
    <div className="text-sm text-neutral-600">{label}</div>
  </div>
);

/**
 * Feature Card Component
 */
const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-white rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>
    <p className="text-neutral-600">{description}</p>
  </div>
);

/**
 * Server-side data fetching
 */
export async function getStaticProps() {
  try {
    const [featuredProperties, stats] = await Promise.all([
      getFeaturedProperties(8),
      getPropertyStats(),
    ]);

    return {
      props: {
        featuredProperties,
        stats,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      props: {
        featuredProperties: [],
        stats: null,
      },
      revalidate: 60,
    };
  }
}
