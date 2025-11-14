import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, SEOHead } from '@/components/layout';
import Button from '@/components/common/Button';

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />
      <Navbar />

      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="container text-center py-20">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="outline" size="lg">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
