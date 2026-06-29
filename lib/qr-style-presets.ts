import type { LucideIcon } from 'lucide-react';
import { Square, MessageSquareText, ShoppingBag, Mail, Bike, Coffee, Ticket, Store } from 'lucide-react';

export type FrameLayout = 'none' | 'border' | 'banner-bottom' | 'banner-top';

export interface FrameStylePreset {
  id: string;
  label: string;
  layout: FrameLayout;
  icon: LucideIcon;
  defaultText?: string;
}

export interface ColorPreset {
  id: string;
  label: string;
  dotColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  bgColor: string;
}

export interface ErrorCorrectionOption {
  id: 'L' | 'M' | 'Q' | 'H';
  label: string;
  tooltip: string;
}

export const FRAME_STYLES: FrameStylePreset[] = [
  { id: 'none', label: 'No Frame', layout: 'none', icon: Square },
  { id: 'border', label: 'Simple Border', layout: 'border', icon: Square },
  { id: 'scan-me', label: 'Scan Me', layout: 'banner-bottom', icon: MessageSquareText, defaultText: 'SCAN ME' },
  { id: 'shop-bag', label: 'Shopping Bag', layout: 'banner-bottom', icon: ShoppingBag, defaultText: 'SCAN TO SHOP' },
  { id: 'envelope', label: 'Invite', layout: 'banner-bottom', icon: Mail, defaultText: "YOU'RE INVITED" },
  { id: 'delivery', label: 'Delivery', layout: 'banner-bottom', icon: Bike, defaultText: 'TRACK ORDER' },
  { id: 'cafe', label: 'Cafe Menu', layout: 'banner-bottom', icon: Coffee, defaultText: 'VIEW MENU' },
  { id: 'event', label: 'Event Ticket', layout: 'banner-bottom', icon: Ticket, defaultText: 'SCAN TICKET' },
  { id: 'storefront', label: 'Storefront', layout: 'banner-bottom', icon: Store, defaultText: 'VISIT US' },
];

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'classic', label: 'Classic B&W', dotColor: '#0A0F05', cornerSquareColor: '#0A0F05', cornerDotColor: '#0A0F05', bgColor: '#FFFFFF' },
  { id: 'ocean', label: 'Ocean Blue', dotColor: '#0B3C66', cornerSquareColor: '#0B3C66', cornerDotColor: '#00A8E8', bgColor: '#FFFFFF' },
  { id: 'forest', label: 'Forest Green', dotColor: '#1B4332', cornerSquareColor: '#1B4332', cornerDotColor: '#52B788', bgColor: '#FFFFFF' },
  { id: 'sunset', label: 'Sunset Orange', dotColor: '#8A3B12', cornerSquareColor: '#8A3B12', cornerDotColor: '#F4A261', bgColor: '#FFFFFF' },
  { id: 'purple', label: 'Purple Haze', dotColor: '#3A1259', cornerSquareColor: '#3A1259', cornerDotColor: '#9D4EDD', bgColor: '#FFFFFF' },
  { id: 'rosegold', label: 'Rose Gold', dotColor: '#6B2737', cornerSquareColor: '#6B2737', cornerDotColor: '#E8A0A8', bgColor: '#FFF8F6' },
];

export const ERROR_CORRECTION_LEVELS: ErrorCorrectionOption[] = [
  { id: 'L', label: 'L (7%)', tooltip: 'Lowest density, least damage resistance. Use for clean digital display only.' },
  { id: 'M', label: 'M (15%)', tooltip: 'Balanced default. Good for most printed and digital uses.' },
  { id: 'Q', label: 'Q (25%)', tooltip: 'Higher resistance to dirt/damage, denser pattern. Good with small logos.' },
  { id: 'H', label: 'H (30%)', tooltip: 'Highest damage resistance, densest pattern. Recommended when embedding a logo.' },
];
