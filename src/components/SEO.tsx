import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Happy Ride Drop - Premium Taxi Service | Chennai Outstation Taxi',
  description = 'Book reliable outstation taxi service in Chennai with Happy Ride Drop. Professional drivers, clean vehicles, 24/7 availability. Minimum 130km one-way, 250km round-trip. Call +91 9087520500',
  keywords = 'Chennai taxi service, outstation taxi Chennai, taxi booking, Happy Ride Drop, Chennai to Bangalore taxi, Chennai to Pondicherry taxi, reliable taxi service, 24/7 taxi service',
  image = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  url = 'https://happyridedroptaxi.com'
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Happy Ride Drop Taxi Service",
    "description": description,
    "telephone": "+91-9087520500",
    "email": "happyridedroptaxi@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.0827",
      "longitude": "80.2707"
    },
    "url": url,
    "image": image,
    "priceRange": "₹₹",
    "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-24:00",
    "serviceArea": {
      "@type": "State",
      "name": "Tamil Nadu"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Taxi Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Outstation Taxi Service",
            "description": "Reliable outstation taxi service for long-distance travel"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer",
            "description": "Safe and comfortable airport transfer service"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Happy Ride Drop Taxi" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Happy Ride Drop Taxi" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;