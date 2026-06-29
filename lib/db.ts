import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export interface CardData {
  id: string;
  slug: string;
  editToken: string;
  templateType: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeData {
  id: string;
  slug: string;
  name: string;
  content: any;
  qr_image_url?: string;
  logo_url?: string;
  created_at: string;
  scan_count: number;
}

export interface MenuItemData {
  id: string;
  qr_code_id: string;
  section_name: string;
  item_name: string;
  description?: string;
  price: string;
  image_url?: string;
  allergens: string[];
  display_order: number;
}

// Check if Supabase env variables are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Initialize Supabase Client if configured
const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// File-based DB paths
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Local DB Helpers
function readLocalDB(): { cards: CardData[]; qr_codes: QRCodeData[]; menu_items: MenuItemData[] } {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial = { cards: [], qr_codes: [], menu_items: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content || '{"cards":[],"qr_codes":[],"menu_items":[]}');
    return {
      cards: parsed.cards || [],
      qr_codes: parsed.qr_codes || [],
      menu_items: parsed.menu_items || []
    };
  } catch (error) {
    console.error('Failed to read local DB, using empty store:', error);
    return { cards: [], qr_codes: [], menu_items: [] };
  }
}

function writeLocalDB(data: { cards: CardData[]; qr_codes: QRCodeData[]; menu_items: MenuItemData[] }) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write local DB:', error);
  }
}

// Database API Methods (Old cards table)
export async function getCardBySlug(slug: string): Promise<CardData | null> {
  if (!slug) return null;
  const normalizedSlug = slug.toLowerCase().trim();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase getCardBySlug error:', error);
      return null;
    }
    return data as CardData;
  } else {
    const db = readLocalDB();
    const card = db.cards.find(c => c.slug.toLowerCase() === normalizedSlug);
    return card || null;
  }
}

export async function getCardByEditToken(editToken: string): Promise<CardData | null> {
  if (!editToken) return null;
  if (supabase) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('editToken', editToken)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase getCardByEditToken error:', error);
      return null;
    }
    return data as CardData;
  } else {
    const db = readLocalDB();
    const card = db.cards.find(c => c.editToken === editToken);
    return card || null;
  }
}

export async function saveCard(
  cardData: Omit<CardData, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<CardData> {
  const timestamp = new Date().toISOString();
  
  if (supabase) {
    if (cardData.id) {
      // Update
      const { data, error } = await supabase
        .from('cards')
        .update({
          slug: cardData.slug.toLowerCase().trim(),
          templateType: cardData.templateType,
          data: cardData.data,
          updatedAt: timestamp
        })
        .eq('id', cardData.id)
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to update card: ${error.message}`);
      }
      return data as CardData;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('cards')
        .insert({
          slug: cardData.slug.toLowerCase().trim(),
          editToken: cardData.editToken,
          templateType: cardData.templateType,
          data: cardData.data,
          createdAt: timestamp,
          updatedAt: timestamp
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to create card: ${error.message}`);
      }
      return data as CardData;
    }
  } else {
    const db = readLocalDB();
    const existingIndex = cardData.id 
      ? db.cards.findIndex(c => c.id === cardData.id) 
      : -1;
      
    if (existingIndex >= 0) {
      // Update
      const existing = db.cards[existingIndex];
      const updated: CardData = {
        ...existing,
        slug: cardData.slug.toLowerCase().trim(),
        templateType: cardData.templateType,
        data: cardData.data,
        updatedAt: timestamp
      };
      db.cards[existingIndex] = updated;
      writeLocalDB(db);
      return updated;
    } else {
      // Create new
      const newCard: CardData = {
        id: cardData.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        slug: cardData.slug.toLowerCase().trim(),
        editToken: cardData.editToken,
        templateType: cardData.templateType,
        data: cardData.data,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      db.cards.push(newCard);
      writeLocalDB(db);
      return newCard;
    }
  }
}

// -------------------------------------------------------------
// NEW QR_CODES AND MENU_ITEMS METHODS
// -------------------------------------------------------------

export async function getQRCodeBySlug(slug: string): Promise<QRCodeData | null> {
  if (!slug) return null;
  const normalizedSlug = slug.toLowerCase().trim();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase getQRCodeBySlug error:', error);
      return null;
    }
    return data as QRCodeData;
  } else {
    const db = readLocalDB();
    const qrCode = db.qr_codes.find(c => c.slug.toLowerCase() === normalizedSlug);
    return qrCode || null;
  }
}

export async function getQRCodeById(id: string): Promise<QRCodeData | null> {
  if (!id) return null;
  
  if (supabase) {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase getQRCodeById error:', error);
      return null;
    }
    return data as QRCodeData;
  } else {
    const db = readLocalDB();
    const qrCode = db.qr_codes.find(c => c.id === id);
    return qrCode || null;
  }
}

export async function saveQRCode(
  qrData: Omit<QRCodeData, 'id' | 'created_at' | 'scan_count'> & { id?: string }
): Promise<QRCodeData> {
  const timestamp = new Date().toISOString();
  
  if (supabase) {
    if (qrData.id) {
      // Update
      const { data, error } = await supabase
        .from('qr_codes')
        .update({
          slug: qrData.slug.toLowerCase().trim(),
          name: qrData.name,
          content: qrData.content,
          qr_image_url: qrData.qr_image_url,
          logo_url: qrData.logo_url
        })
        .eq('id', qrData.id)
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to update QR Code: ${error.message}`);
      }
      return data as QRCodeData;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          slug: qrData.slug.toLowerCase().trim(),
          name: qrData.name,
          content: qrData.content,
          qr_image_url: qrData.qr_image_url,
          logo_url: qrData.logo_url,
          created_at: timestamp,
          scan_count: 0
        })
        .select()
        .single();
        
      if (error) {
        throw new Error(`Failed to create QR Code: ${error.message}`);
      }
      return data as QRCodeData;
    }
  } else {
    const db = readLocalDB();
    const existingIndex = qrData.id 
      ? db.qr_codes.findIndex(c => c.id === qrData.id) 
      : -1;
      
    if (existingIndex >= 0) {
      // Update
      const existing = db.qr_codes[existingIndex];
      const updated: QRCodeData = {
        ...existing,
        slug: qrData.slug.toLowerCase().trim(),
        name: qrData.name,
        content: qrData.content,
        qr_image_url: qrData.qr_image_url || existing.qr_image_url,
        logo_url: qrData.logo_url || existing.logo_url
      };
      db.qr_codes[existingIndex] = updated;
      writeLocalDB(db);
      return updated;
    } else {
      // Create new
      const newQR: QRCodeData = {
        id: qrData.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        slug: qrData.slug.toLowerCase().trim(),
        name: qrData.name,
        content: qrData.content,
        qr_image_url: qrData.qr_image_url,
        logo_url: qrData.logo_url,
        created_at: timestamp,
        scan_count: 0
      };
      db.qr_codes.push(newQR);
      writeLocalDB(db);
      return newQR;
    }
  }
}

export async function incrementScanCount(id: string): Promise<boolean> {
  if (supabase) {
    // Correct PostgreSQL atomic increment using raw RPC or via increment logic if supported, or read-then-write
    // To make it simple and robust, let's select then update or use raw SQL.
    // RPC increment_scan_count(qr_id) is standard, but if RPC doesn't exist, we can do read-then-write.
    // Let's do a select then update.
    const { data: qr } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('id', id)
      .maybeSingle();
      
    if (qr) {
      await supabase
        .from('qr_codes')
        .update({ scan_count: (qr.scan_count || 0) + 1 })
        .eq('id', id);
      return true;
    }
    return false;
  } else {
    const db = readLocalDB();
    const qrIndex = db.qr_codes.findIndex(c => c.id === id);
    if (qrIndex >= 0) {
      db.qr_codes[qrIndex].scan_count += 1;
      writeLocalDB(db);
      return true;
    }
    return false;
  }
}

export async function getMenuItemsByQRCodeId(qrCodeId: string): Promise<MenuItemData[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .order('display_order', { ascending: true });
      
    if (error) {
      console.error('Supabase getMenuItems error:', error);
      return [];
    }
    return data as MenuItemData[];
  } else {
    const db = readLocalDB();
    return db.menu_items
      .filter(item => item.qr_code_id === qrCodeId)
      .sort((a, b) => a.display_order - b.display_order);
  }
}

export async function saveMenuItems(
  qrCodeId: string,
  items: Omit<MenuItemData, 'id' | 'qr_code_id'>[]
): Promise<MenuItemData[]> {
  if (supabase) {
    // Delete existing
    await supabase.from('menu_items').delete().eq('qr_code_id', qrCodeId);
    
    if (items.length === 0) return [];
    
    // Insert new
    const { data, error } = await supabase
      .from('menu_items')
      .insert(
        items.map((item, idx) => ({
          qr_code_id: qrCodeId,
          section_name: item.section_name,
          item_name: item.item_name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          allergens: item.allergens,
          display_order: idx
        }))
      )
      .select();
      
    if (error) {
      throw new Error(`Failed to save menu items: ${error.message}`);
    }
    return data as MenuItemData[];
  } else {
    const db = readLocalDB();
    // Remove old items for this QR code
    db.menu_items = db.menu_items.filter(item => item.qr_code_id !== qrCodeId);
    
    // Add new items
    const savedItems: MenuItemData[] = items.map((item, idx) => ({
      id: Math.random().toString(36).substring(2, 15),
      qr_code_id: qrCodeId,
      section_name: item.section_name,
      item_name: item.item_name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      allergens: item.allergens,
      display_order: idx
    }));
    
    db.menu_items.push(...savedItems);
    writeLocalDB(db);
    return savedItems;
  }
}

// Image upload implementation remains unchanged...
export async function uploadImage(fileBase64: string, fileName: string): Promise<string> {
  const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data');
  }
  const buffer = Buffer.from(matches[2], 'base64');
  
  const vercelBlobToken = process.env.BLOB_READ_WRITE_TOKEN?.replace(/['"]/g, '').trim();
  if (vercelBlobToken) {
    const fileExt = fileName.split('.').pop() || 'jpg';
    const filePath = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { put } = await import('@vercel/blob');
    const blob = await put(filePath, buffer, {
      access: 'public',
      contentType: matches[1],
      token: vercelBlobToken
    });
    
    return blob.url;
  } else if (supabase) {
    const fileExt = fileName.split('.').pop() || 'png';
    const filePath = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('card-media')
      .upload(filePath, buffer, {
        contentType: matches[1],
        upsert: true
      });
      
    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('card-media')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  } else {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    
    const fileExt = fileName.split('.').pop() || 'png';
    const uniqueName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueName);
    
    fs.writeFileSync(targetPath, buffer);
    return `/uploads/${uniqueName}`;
  }
}

