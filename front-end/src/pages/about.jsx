import React from 'react';
import { Navbar, Footer, SEOHead, Breadcrumbs } from '@/components/layout';
import Button from '@/components/common/Button';

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about Foresite Real Estate. Our mission is to help you find the perfect property."
      />
      <Navbar />

      <main>
        <section className="bg-neutral-100 border-b border-neutral-200">
          <div className="container py-8">
            <Breadcrumbs />
            <h1 className="text-4xl font-bold text-neutral-900 mt-4">About Foresite</h1>
          </div>
        </section>

        <section className="section">
          <div className="container max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <h2>Who We Are</h2>
              <p>
                Foresite Real Estate is a leading property platform dedicated to making your home search simple, transparent, and enjoyable. With years of experience in the real estate industry, we've helped thousands of clients find their perfect property.
              </p>

              <h2>Our Mission</h2>
              <p>
                Our mission is to revolutionize the way people discover and purchase properties. We believe everyone deserves access to quality housing and transparent pricing.
              </p>

              <h2>Why Choose Us</h2>
              <ul>
                <li><strong>Extensive Listings:</strong> Thousands of verified properties</li>
                <li><strong>Expert Guidance:</strong> Professional support every step of the way</li>
                <li><strong>Transparent Pricing:</strong> No hidden fees or surprises</li>
                <li><strong>Modern Technology:</strong> Advanced search and filtering tools</li>
              </ul>

              <div className="text-center mt-12">
                <Button variant="primary" size="lg" onClick={() => window.location.href = '/contact'}>
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
