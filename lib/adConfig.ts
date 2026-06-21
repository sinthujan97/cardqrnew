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
  
  AD_UNITS: {
    // ── Business Card Template Page (/business-card-qr) ──────────────────────
    'business-card-intro': 'ad-unit-placeholder', // Slot A — after hero
    'business-card-mid': 'ad-unit-placeholder',   // Slot B — between template cards & steps
    'business-card-lower': 'ad-unit-placeholder', // Slot C — before FAQ

    // ── Restaurant Menu Template Page (/restaurant-menu-qr) ──────────────────
    'restaurant-menu-intro': 'ad-unit-placeholder',
    'restaurant-menu-mid': 'ad-unit-placeholder',
    'restaurant-menu-lower': 'ad-unit-placeholder',

    // ── Event Template Page (/event-qr) ──────────────────────────────────────
    'event-card-intro': 'ad-unit-placeholder',
    'event-card-mid': 'ad-unit-placeholder',
    'event-card-lower': 'ad-unit-placeholder',

    // ── Link Hub Template Page (/link-hub-qr) ────────────────────────────────
    'link-hub-intro': 'ad-unit-placeholder',
    'link-hub-mid': 'ad-unit-placeholder',
    'link-hub-lower': 'ad-unit-placeholder',

    // ── WiFi Sharing Template Page (/wifi-qr) ────────────────────────────────
    'wifi-sharing-intro': 'ad-unit-placeholder',
    'wifi-sharing-mid': 'ad-unit-placeholder',
    'wifi-sharing-lower': 'ad-unit-placeholder',

    // ── Product Catalog Template Page (/product-catalog-qr) ─────────────────
    'product-catalog-intro': 'ad-unit-placeholder',
    'product-catalog-mid': 'ad-unit-placeholder',
    'product-catalog-lower': 'ad-unit-placeholder',

    // ── Generic SEO landing pages without templateId ─────────────────────────
    // Used by /url-to-qr, /vcard-qr, /qr-with-logo, /dynamic-qr-code
    'landing-intro': 'ad-unit-placeholder',
    'landing-mid': 'ad-unit-placeholder',

    // ── Workspace Builder — inline slot (shown above form) ───────────────────
    'business-workspace': 'ad-unit-placeholder',
    'menu-workspace': 'ad-unit-placeholder',
    'event-workspace': 'ad-unit-placeholder',
    'link-workspace': 'ad-unit-placeholder',
    'wifi-workspace': 'ad-unit-placeholder',
    'catalog-workspace': 'ad-unit-placeholder',

    // ── Workspace Builder — vertical sidebar slot (beside preview) ───────────
    'business-workspace-sidebar': 'ad-unit-placeholder',
    'menu-workspace-sidebar': 'ad-unit-placeholder',
    'event-workspace-sidebar': 'ad-unit-placeholder',
    'link-workspace-sidebar': 'ad-unit-placeholder',
    'wifi-workspace-sidebar': 'ad-unit-placeholder',
    'catalog-workspace-sidebar': 'ad-unit-placeholder',

    // ── Homepage ──────────────────────────────────────────────────────────────
    'homepage-post-hero': 'ad-unit-placeholder',
    'homepage-post-steps': 'ad-unit-placeholder',
    'homepage-pre-faq': 'ad-unit-placeholder',
  } as Record<string, string>
};
