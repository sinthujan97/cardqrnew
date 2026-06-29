export type TemplateType = 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';

export interface BusinessCardData {
  name: string;
  position: string;
  photo: string; // Base64 or URL
  bio: string;
  phone: string;
  email: string;
  whatsapp: string;
  socials: Array<{ label: 'Instagram' | 'LinkedIn' | 'Twitter' | 'GitHub' | 'YouTube' | 'TikTok' | 'Website'; url: string }>;
  theme?: 'light' | 'dark';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  tags?: Array<'vegan' | 'vegetarian' | 'gluten-free' | 'spicy' | 'recommended'>;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantMenuData {
  restaurantName: string;
  coverImage: string;
  logo: string;
  description: string;
  currency: string;
  categories: MenuCategory[];
  displayMode?: 'card' | 'list';
  theme?: 'light' | 'dark';
}


export interface EventRsvp {
  name: string;
  email: string;
  guests: number;
  timestamp: string;
}

export interface EventCardData {
  title: string;
  banner: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  rsvpButtonText: string;
  maxGuests?: number;
  rsvps: EventRsvp[];
  theme?: 'light' | 'dark';
}

export interface LinkCardData {
  displayName: string;
  profileImage: string;
  bio: string;
  links: Array<{ id: string; label: string; url: string; secondaryText?: string; theme?: 'default' | 'outline' | 'accent' }>;
  theme?: 'light' | 'dark';
}

export interface WiFiCardData {
  networkName: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'none';
  theme?: 'light' | 'dark';
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  link: string; // WhatsApp or checkout link
}

export interface ProductCatalogData {
  catalogTitle: string;
  catalogDescription: string;
  bannerImage: string;
  contactNumber?: string; // For auto-WhatsApp checkout inquiry
  products: CatalogProduct[];
  theme?: 'light' | 'dark';
}

export const INITIAL_BUSINESS_DATA: BusinessCardData = {
  name: 'Charlotte Dubois',
  position: 'Principal Designer at Studio Arcs',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
  bio: 'Crafting pixel-perfect design systems, elegant layout motions, and physical product experiences.',
  phone: '+1 (555) 019-2834',
  email: 'charlotte@studioarcs.com',
  whatsapp: '+15550192834',
  theme: 'light',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Website', url: 'https://studioarcs.com' }
  ]
};

export const INITIAL_MENU_DATA: RestaurantMenuData = {
  restaurantName: 'Gusto Bistro',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=300',
  logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=120&h=120',
  description: 'Contemporary Italian fare crafted from locally sourced organic ingredients.',
  currency: '$',
  displayMode: 'card',
  theme: 'light',
  categories: [
    {
      id: 'cat-1',
      name: 'Starters',
      items: [
        {
          id: 'item-1-1',
          name: 'Truffle Arancini',
          description: 'Crispy risotto spheres, wild mushroom, black truffle paste, house aioli.',
          price: '14.00',
          image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=200&h=200',
          tags: ['vegetarian', 'recommended']
        },
        {
          id: 'item-1-2',
          name: 'Burrata & Heirloom',
          description: 'Creamy burrata, balsamic reduction, basil oil, grilled sourdough.',
          price: '16.50',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=200&h=200',
          tags: ['vegetarian', 'gluten-free']
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Mains',
      items: [
        {
          id: 'item-2-1',
          name: 'Hand-Cut Tagliatelle',
          description: 'Slow-braised beef ragu, aged Parmigiano Reggiano, aromatic herbs.',
          price: '28.00',
          image: 'https://images.unsplash.com/photo-1563379971899-660589a01cc3?auto=format&fit=crop&q=80&w=200&h=200',
          tags: ['recommended']
        },
        {
          id: 'item-2-2',
          name: 'Seared Wild Salmon',
          description: 'Asparagus spears, lemon dill butter sauce, herb-roasted baby potatoes.',
          price: '34.00',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200&h=200',
          tags: ['gluten-free']
        }
      ]
    }
  ]
};

export const INITIAL_EVENT_DATA: EventCardData = {
  title: 'Midsummer Gallery Vernissage',
  banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600&h=300',
  date: 'July 24, 2026',
  time: '19:00 - 22:30',
  venue: 'Studio Arcs Gallery, District 4',
  description: 'Join us for an exclusive unveiling of Charlotte Dubois latest solo exhibition "Chroma and Space". Curated drinks, live chamber jazz, and conversations with the artist.',
  rsvpButtonText: 'Request Invitation / RSVP',
  maxGuests: 75,
  theme: 'light',
  rsvps: []
};

export const INITIAL_LINK_DATA: LinkCardData = {
  displayName: 'Charlotte Dubois',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
  bio: 'Principal Designer & Visual Artist | Sharing thoughts, projects, and design systems.',
  theme: 'light',
  links: [
    {
      id: 'link-1',
      label: 'Latest Solo Exhibition',
      url: 'https://studioarcs.com/chroma-space',
      secondaryText: 'Chroma & Space — Gallery Open',
      theme: 'accent'
    },
    {
      id: 'link-2',
      label: 'Design System Template',
      url: 'https://figma.com',
      secondaryText: 'Get the free Figma library',
      theme: 'default'
    },
    {
      id: 'link-3',
      label: 'Read My Articles',
      url: 'https://medium.com',
      secondaryText: 'Weekly thoughts on layouts & motion',
      theme: 'outline'
    }
  ]
};

export const INITIAL_WIFI_DATA: WiFiCardData = {
  networkName: 'StudioArcs_Guest_5G',
  password: 'spaceandchroma',
  security: 'WPA',
  theme: 'light'
};

export const INITIAL_CATALOG_DATA: ProductCatalogData = {
  catalogTitle: 'Studio Arcs Print Shop',
  catalogDescription: 'Exclusive, limited-edition screenprints signed by the artist. Worldwide shipping.',
  bannerImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=300',
  contactNumber: '15550192834',
  theme: 'light',
  products: [
    {
      id: 'prod-1',
      name: 'Chroma No. 4 Screenprint',
      description: 'Hand-pulled 4-color screenprint on 300gsm acid-free cotton paper. Edition of 50.',
      price: '120.00',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300&h=300',
      link: 'https://studioarcs.com/shop/chroma-4'
    },
    {
      id: 'prod-2',
      name: 'Space & Shadow Screenprint',
      description: 'Duotone silver and charcoal ink screenprint on black matte boards. Edition of 25.',
      price: '160.00',
      image: 'https://images.unsplash.com/photo-1579783928621-7a13d66a6211?auto=format&fit=crop&q=80&w=300&h=300',
      link: 'https://studioarcs.com/shop/space-shadow'
    }
  ]
};

export const INITIAL_WEBSITE_URL: any = {
  url: 'https://example.com',
  title: 'My Portfolio Website'
};

export const INITIAL_PDF: any = {
  title: 'Annual Product Guide.pdf',
  description: 'Download the complete catalog of screenprints, exhibitions, and pricing details.',
  pdfUrl: ''
};

export const INITIAL_IMAGES: any = {
  galleryTitle: 'Studio Exhibition Gallery',
  images: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1579783928621-7a13d66a6211?auto=format&fit=crop&q=80&w=300&h=300'
  ]
};

export const INITIAL_VIDEO: any = {
  title: 'Exhibition Launch Presentation',
  description: 'A behind-the-scenes walkthrough of Charlotte Dubois latest art launch and design systems.',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

export const INITIAL_SIMPLE_TEXT: any = {
  title: 'Quick Studio Notice',
  text: 'The gallery will be closed for private viewings on Mondays. For reservations, please contact us via phone or email.'
};

export const INITIAL_FACEBOOK: any = {
  url: 'https://facebook.com/studioarcs'
};

export const INITIAL_APP_DOWNLOAD: any = {
  appName: 'Studio Arcs App',
  appDescription: 'Browse portfolios, check prices, and submit customized commissions.',
  logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
  appStoreUrl: 'https://apps.apple.com',
  playStoreUrl: 'https://play.google.com'
};

export const INITIAL_GOOGLE_REVIEW: any = {
  businessName: 'Studio Arcs Gallery',
  url: 'https://search.google.com/local/writereview'
};

export const INITIAL_INSTAGRAM: any = {
  url: 'https://instagram.com/studioarcs'
};

export const INITIAL_EMAIL: any = {
  emailAddress: 'contact@studioarcs.com',
  subject: 'Art Commission Inquiry',
  body: 'Hello, I would like to get a quote for a custom screenprint.'
};

export const INITIAL_SMS: any = {
  phoneNumber: '+15550192834',
  message: 'Hello Charlotte, I scanned your QR code and would like to connect.'
};

export const INITIAL_PHONE_CALL: any = {
  phoneNumber: '+15550192834'
};

export const INITIAL_LOCATION: any = {
  address: '1600 Amphitheatre Pkwy, Mountain View, CA',
  latitude: '37.4220',
  longitude: '-122.0841'
};

export const INITIAL_YOUTUBE: any = {
  url: 'https://youtube.com/@studioarcs'
};

export const INITIAL_PAYMENT: any = {
  paymentUrl: 'https://paypal.me/studioarcs/50',
  title: 'Exhibition Reservation Deposit',
  amount: '50.00'
};

export const getInitialData = (type: string) => {
  switch (type) {
    case 'business':
    case 'business-card':
      return INITIAL_BUSINESS_DATA;
    case 'menu':
    case 'restaurant-menu':
      return INITIAL_MENU_DATA;
    case 'event':
      return INITIAL_EVENT_DATA;
    case 'link':
    case 'social-media':
      return INITIAL_LINK_DATA;
    case 'wifi':
      return INITIAL_WIFI_DATA;
    case 'catalog':
      return INITIAL_CATALOG_DATA;
    case 'website-url':
      return INITIAL_WEBSITE_URL;
    case 'pdf':
      return INITIAL_PDF;
    case 'images':
      return INITIAL_IMAGES;
    case 'video':
      return INITIAL_VIDEO;
    case 'simple-text':
      return INITIAL_SIMPLE_TEXT;
    case 'facebook-page':
      return INITIAL_FACEBOOK;
    case 'app-download':
      return INITIAL_APP_DOWNLOAD;
    case 'google-review':
      return INITIAL_GOOGLE_REVIEW;
    case 'instagram-profile':
      return INITIAL_INSTAGRAM;
    case 'email':
      return INITIAL_EMAIL;
    case 'sms':
      return INITIAL_SMS;
    case 'phone-call':
      return INITIAL_PHONE_CALL;
    case 'location':
      return INITIAL_LOCATION;
    case 'youtube-channel':
      return INITIAL_YOUTUBE;
    case 'payment':
      return INITIAL_PAYMENT;
    default:
      return {};
  }
};
