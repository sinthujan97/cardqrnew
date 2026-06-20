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
}

export interface LinkCardData {
  displayName: string;
  profileImage: string;
  bio: string;
  links: Array<{ id: string; label: string; url: string; secondaryText?: string; theme?: 'default' | 'outline' | 'accent' }>;
}

export interface WiFiCardData {
  networkName: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'none';
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
}

export const INITIAL_BUSINESS_DATA: BusinessCardData = {
  name: 'Charlotte Dubois',
  position: 'Principal Designer at Studio Arcs',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
  bio: 'Crafting pixel-perfect design systems, elegant layout motions, and physical product experiences.',
  phone: '+1 (555) 019-2834',
  email: 'charlotte@studioarcs.com',
  whatsapp: '+15550192834',
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
  rsvps: []
};

export const INITIAL_LINK_DATA: LinkCardData = {
  displayName: 'Charlotte Dubois',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
  bio: 'Principal Designer & Visual Artist | Sharing thoughts, projects, and design systems.',
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
  security: 'WPA'
};

export const INITIAL_CATALOG_DATA: ProductCatalogData = {
  catalogTitle: 'Studio Arcs Print Shop',
  catalogDescription: 'Exclusive, limited-edition screenprints signed by the artist. Worldwide shipping.',
  bannerImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=300',
  contactNumber: '15550192834',
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

export const getInitialData = (type: TemplateType) => {
  switch (type) {
    case 'business': return INITIAL_BUSINESS_DATA;
    case 'menu': return INITIAL_MENU_DATA;
    case 'event': return INITIAL_EVENT_DATA;
    case 'link': return INITIAL_LINK_DATA;
    case 'wifi': return INITIAL_WIFI_DATA;
    case 'catalog': return INITIAL_CATALOG_DATA;
  }
};
