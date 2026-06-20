/**
 * Google AdSense Configuration
 * 
 * Once AdSense approval is received, populate:
 * - PUBLISHER_ID: Your AdSense publisher code (e.g., 'ca-pub-XXXXXXXXXXXXXXXX')
 * - AD_UNITS: Map each Slot ID to its corresponding AdSense ad unit slot code (e.g., '1234567890')
 */

export const ADSENSE_CONFIG = {
  // TODO: Replace with real AdSense publisher ID once approved
  PUBLISHER_ID: 'ca-pub-placeholder',
  
  // 12 slot IDs (6 pages x 2 slots per page)
  AD_UNITS: {
    // Business Card Template Page (/business-card-qr)
    'business-card-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'business-card-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // Restaurant Menu Template Page (/restaurant-menu-qr)
    'restaurant-menu-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'restaurant-menu-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // Event Template Page (/event-qr)
    'event-card-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'event-card-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // Link Hub Template Page (/link-hub-qr)
    'link-hub-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'link-hub-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // WiFi Sharing Template Page (/wifi-qr)
    'wifi-sharing-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'wifi-sharing-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // Product Catalog Template Page (/product-catalog-qr)
    'product-catalog-intro': 'ad-unit-placeholder', // Slot A (after intro)
    'product-catalog-lower': 'ad-unit-placeholder', // Slot B (before FAQ / lower page)

    // Workspace Builder Creator Pages (/create?t=X)
    'business-workspace': 'ad-unit-placeholder',
    'menu-workspace': 'ad-unit-placeholder',
    'event-workspace': 'ad-unit-placeholder',
    'link-workspace': 'ad-unit-placeholder',
    'wifi-workspace': 'ad-unit-placeholder',
    'catalog-workspace': 'ad-unit-placeholder',

    // Workspace Builder Creator Pages - Sidebar slots (vertical skyscraper)
    'business-workspace-sidebar': 'ad-unit-placeholder',
    'menu-workspace-sidebar': 'ad-unit-placeholder',
    'event-workspace-sidebar': 'ad-unit-placeholder',
    'link-workspace-sidebar': 'ad-unit-placeholder',
    'wifi-workspace-sidebar': 'ad-unit-placeholder',
    'catalog-workspace-sidebar': 'ad-unit-placeholder',

    // Homepage Ad Slots
    'homepage-post-hero': 'ad-unit-placeholder',
    'homepage-post-steps': 'ad-unit-placeholder',
    'homepage-pre-faq': 'ad-unit-placeholder',
  } as Record<string, string>
};
