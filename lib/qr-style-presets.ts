import type { LucideIcon } from 'lucide-react';
import { Square, MessageSquareText, ShoppingBag, Mail, Bike, Coffee, Ticket, Store } from 'lucide-react';

export type FrameLayout = 'none' | 'border' | 'banner-bottom' | 'banner-top' | 'shape';

/** Color sentinels resolved at render time against the user's chosen frameColor/bgColor/frameTextColor. */
export type ShapeColorRef = 'frame' | 'background' | 'text';

export interface ShapeAccentPath {
  d: string;
  fill?: ShapeColorRef;
  stroke?: ShapeColorRef;
  strokeWidth?: number;
}

export interface ShapeFrameDef {
  /** "minX minY width height" */
  viewBox: string;
  /** Outer silhouette of the frame. */
  outlinePath: string;
  /** Which user color fills the outline: the card "paper" color, or a solid illustration color. */
  outlineFill: 'background' | 'frame';
  /** Draw a frameColor border around the outline (only meaningful when outlineFill is 'background'). */
  outlineStroke?: boolean;
  /** Square window (in viewBox units) where the live QR renders. Never cropped to a non-square shape. */
  qrInset: { x: number; y: number; size: number };
  /** Extra decoration drawn after the QR (ribbons, spiral-binding dots, banner strips, handles, etc). */
  accentPaths?: ShapeAccentPath[];
  /** Where the caption text is centered, if this shape has one. */
  bannerText?: { x: number; y: number; fontSize?: number };
}

export interface FrameStylePreset {
  id: string;
  label: string;
  layout: FrameLayout;
  icon: LucideIcon;
  defaultText?: string;
  shape?: ShapeFrameDef;
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

/** Builds a closed full-circle path (two semicircle arcs) — a verified-safe primitive. */
const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx + r},${cy} A${r},${r} 0 0 1 ${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z`;

export const FRAME_STYLES: FrameStylePreset[] = [
  { id: 'none', label: 'No Frame', layout: 'none', icon: Square },
  { id: 'border', label: 'Simple Border', layout: 'border', icon: Square },
  { id: 'scan-me', label: 'Scan Me', layout: 'banner-bottom', icon: MessageSquareText, defaultText: 'SCAN ME' },
  { id: 'delivery', label: 'Delivery', layout: 'banner-bottom', icon: Bike, defaultText: 'TRACK ORDER' },
  { id: 'event', label: 'Event Ticket', layout: 'banner-bottom', icon: Ticket, defaultText: 'SCAN TICKET' },
  { id: 'storefront', label: 'Storefront', layout: 'banner-bottom', icon: Store, defaultText: 'VISIT US' },

  // ---- Shaped frames: geometric ----
  {
    id: 'rounded-card',
    label: 'Rounded Card',
    layout: 'shape',
    icon: Square,
    defaultText: 'SCAN ME',
    shape: {
      viewBox: '0 0 100 124',
      outlinePath:
        'M10,0 H90 A10,10 0 0 1 100,10 V114 A10,10 0 0 1 90,124 H10 A10,10 0 0 1 0,114 V10 A10,10 0 0 1 10,0 Z',
      outlineFill: 'background',
      outlineStroke: true,
      qrInset: { x: 10, y: 10, size: 80 },
      accentPaths: [
        {
          d: 'M0,96 H100 V114 A10,10 0 0 1 90,124 H10 A10,10 0 0 1 0,114 Z',
          fill: 'frame',
        },
      ],
      bannerText: { x: 50, y: 110, fontSize: 11 },
    },
  },
  {
    id: 'ticket-notch',
    label: 'Ticket Notch',
    layout: 'shape',
    icon: Ticket,
    shape: {
      viewBox: '0 0 100 100',
      outlinePath: 'M0,0 H100 V42 L92,50 L100,58 V100 H0 V58 L8,50 L0,42 Z',
      outlineFill: 'background',
      outlineStroke: true,
      qrInset: { x: 10, y: 10, size: 80 },
    },
  },
  {
    id: 'torn-receipt',
    label: 'Torn Receipt',
    layout: 'shape',
    icon: Square,
    shape: {
      viewBox: '0 0 100 104',
      outlinePath:
        'M0,0 H100 V96 L93.75,104 L87.5,96 L81.25,104 L75,96 L68.75,104 L62.5,96 L56.25,104 L50,96 L43.75,104 L37.5,96 L31.25,104 L25,96 L18.75,104 L12.5,96 L6.25,104 L0,96 Z',
      outlineFill: 'background',
      outlineStroke: true,
      qrInset: { x: 10, y: 8, size: 80 },
    },
  },
  {
    id: 'speech-bubble',
    label: 'Scan Me Tag',
    layout: 'shape',
    icon: MessageSquareText,
    defaultText: 'SCAN ME!',
    shape: {
      viewBox: '0 0 120 120',
      outlinePath: 'M0,0 H120 V120 H0 Z',
      outlineFill: 'background',
      outlineStroke: false,
      qrInset: { x: 0, y: 0, size: 100 },
      accentPaths: [
        {
          d: 'M86,84 H114 A6,6 0 0 1 120,90 V106 A6,6 0 0 1 114,112 H86 A6,6 0 0 1 80,106 V90 A6,6 0 0 1 86,84 Z',
          fill: 'frame',
        },
        { d: 'M84,84 L96,84 L74,64 Z', fill: 'frame' },
      ],
      bannerText: { x: 100, y: 98, fontSize: 8 },
    },
  },
  {
    id: 'medallion',
    label: 'Wax Seal',
    layout: 'shape',
    icon: Square,
    defaultText: '✓',
    shape: {
      viewBox: '0 0 100 100',
      outlinePath:
        'M6,0 H94 A6,6 0 0 1 100,6 V94 A6,6 0 0 1 94,100 H6 A6,6 0 0 1 0,94 V6 A6,6 0 0 1 6,0 Z',
      outlineFill: 'background',
      outlineStroke: true,
      qrInset: { x: 10, y: 10, size: 80 },
      accentPaths: [{ d: circlePath(88, 12, 14), fill: 'frame' }],
      bannerText: { x: 88, y: 13, fontSize: 9 },
    },
  },

  // ---- Shaped frames: themed silhouettes ----
  {
    id: 'envelope',
    label: 'Invite',
    layout: 'shape',
    icon: Mail,
    defaultText: "YOU'RE INVITED",
    shape: {
      viewBox: '0 0 100 146',
      outlinePath: 'M50,0 L100,30 V146 H0 V30 Z',
      outlineFill: 'frame',
      qrInset: { x: 14, y: 38, size: 72 },
      accentPaths: [
        { d: circlePath(50, 15, 6), fill: 'background' },
        { d: 'M0,124 H100 V146 H0 Z', fill: 'frame' },
      ],
      bannerText: { x: 50, y: 135, fontSize: 9 },
    },
  },
  {
    id: 'gift-box',
    label: 'Gift Box',
    layout: 'shape',
    icon: ShoppingBag,
    defaultText: 'OPEN ME',
    shape: {
      viewBox: '0 0 100 146',
      outlinePath: 'M0,12 H100 V146 H0 Z',
      outlineFill: 'frame',
      qrInset: { x: 12, y: 20, size: 76 },
      accentPaths: [
        { d: 'M44,12 H56 V20 H44 Z', fill: 'background' },
        { d: 'M44,96 H56 V124 H44 Z', fill: 'background' },
        { d: 'M0,42 H12 V54 H0 Z', fill: 'background' },
        { d: 'M88,42 H100 V54 H88 Z', fill: 'background' },
        { d: 'M40,12 L50,2 L50,12 Z', fill: 'background' },
        { d: 'M60,12 L50,2 L50,12 Z', fill: 'background' },
      ],
      bannerText: { x: 50, y: 135, fontSize: 9 },
    },
  },
  {
    id: 'cafe',
    label: 'Cafe Menu',
    layout: 'shape',
    icon: Coffee,
    defaultText: 'VIEW MENU',
    shape: {
      viewBox: '0 0 100 140',
      outlinePath: 'M0,10 H100 V20 H0 Z M5,20 H95 L85,110 H15 Z M0,110 H100 V140 H0 Z',
      outlineFill: 'frame',
      qrInset: { x: 21, y: 34, size: 58 },
      accentPaths: [{ d: 'M95,45 A15,15 0 0 1 95,75', stroke: 'background', strokeWidth: 4 }],
      bannerText: { x: 50, y: 125, fontSize: 9 },
    },
  },
  {
    id: 'shop-bag',
    label: 'Shopping Bag',
    layout: 'shape',
    icon: ShoppingBag,
    defaultText: 'SCAN TO SHOP',
    shape: {
      viewBox: '0 0 100 140',
      outlinePath: 'M20,20 H80 L95,124 H5 Z M0,124 H100 V140 H0 Z',
      outlineFill: 'frame',
      qrInset: { x: 30, y: 30, size: 50 },
      accentPaths: [
        { d: 'M28,20 A6,6 0 0 1 40,20', stroke: 'background', strokeWidth: 4 },
        { d: 'M60,20 A6,6 0 0 1 72,20', stroke: 'background', strokeWidth: 4 },
      ],
      bannerText: { x: 50, y: 132, fontSize: 9 },
    },
  },
  {
    id: 'notepad',
    label: 'Notepad',
    layout: 'shape',
    icon: Square,
    defaultText: 'SCAN ME',
    shape: {
      viewBox: '0 0 100 130',
      outlinePath:
        'M8,10 H92 A8,8 0 0 1 100,18 V122 A8,8 0 0 1 92,130 H8 A8,8 0 0 1 0,122 V18 A8,8 0 0 1 8,10 Z',
      outlineFill: 'background',
      outlineStroke: true,
      qrInset: { x: 10, y: 22, size: 76 },
      accentPaths: [
        { d: 'M0,106 H100 V122 A8,8 0 0 1 92,130 H8 A8,8 0 0 1 0,122 Z', fill: 'frame' },
        ...[12, 28, 44, 60, 76, 92].map((cx) => ({ d: circlePath(cx, 4, 3), fill: 'frame' as ShapeColorRef })),
      ],
      bannerText: { x: 50, y: 118, fontSize: 10 },
    },
  },
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
