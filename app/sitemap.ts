import type { MetadataRoute } from 'next';

const BASE_URL = 'https://getcardqr.com';

const TEMPLATES = [
  'website-url', 'restaurant-menu', 'business-card', 'social-media', 'wifi',
  'pdf', 'images', 'video', 'simple-text', 'facebook-page', 'app-download',
  'google-review', 'instagram-profile', 'event', 'email', 'sms', 'phone-call',
  'location', 'youtube-channel', 'payment'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Map all 20 creator workspaces
  const creatorPages: MetadataRoute.Sitemap = TEMPLATES.map((slug) => ({
    url: `${BASE_URL}/create/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Map all 20 SEO landing pages
  const seoLandingPages: MetadataRoute.Sitemap = TEMPLATES.map((slug) => ({
    url: `${BASE_URL}/qr-code/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticPages, ...creatorPages, ...seoLandingPages];
}
