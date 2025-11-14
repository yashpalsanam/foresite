import React from 'react';
import { Navbar, Footer, SEOHead, Breadcrumbs } from '@/components/layout';
import { ContactForm } from '@/components/forms';
import { SITE_CONFIG } from '@/utils/constants';

export default function ContactPage() {
  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with Foresite Real Estate. We're here to help you find your perfect property."
      />
      <Navbar />

      <main>
        <section className="bg-neutral-100 border-b border-neutral-200">
          <div className="container py-8">
            <Breadcrumbs />
            <h1 className="text-4xl font-bold text-neutral-900 mt-4">Contact Us</h1>
            <p className="text-lg text-neutral-600 mt-2">We'd love to hear from you</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Get In Touch</h2>
                <p className="text-neutral-600 mb-8">
                  Have questions? We're here to help. Reach out to us through any of the following methods.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Email</h3>
                      <a href={`mailto:${SITE_CONFIG.CONTACT_EMAIL}`} className="text-primary-600 hover:underline">
                        {SITE_CONFIG.CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Phone</h3>
                      <a href={`tel:${SITE_CONFIG.CONTACT_PHONE}`} className="text-primary-600 hover:underline">
                        {SITE_CONFIG.CONTACT_PHONE}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Office</h3>
                      <p className="text-neutral-600">
                        123 Real Estate Ave<br />
                        Miami, FL 33101
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
                  <h3 className="font-semibold text-neutral-900 mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
