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
function readLocalDB(): { cards: CardData[] } {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ cards: [] }, null, 2));
      return { cards: [] };
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content || '{"cards":[]}');
  } catch (error) {
    console.error('Failed to read local DB, using empty store:', error);
    return { cards: [] };
  }
}

function writeLocalDB(data: { cards: CardData[] }) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write local DB:', error);
  }
}

// Database API Methods
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

export async function uploadImage(fileBase64: string, fileName: string): Promise<string> {
  // We accept fileBase64 (e.g. data:image/png;base64,...)
  // Clean up the base64 prefix
  const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data');
  }
  const buffer = Buffer.from(matches[2], 'base64');
  
  const vercelBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (vercelBlobToken) {
    // Generate clean file path
    const fileExt = fileName.split('.').pop() || 'jpg';
    const filePath = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Dynamically import put from @vercel/blob
    const { put } = await import('@vercel/blob');
    
    const blob = await put(filePath, buffer, {
      access: 'public',
      contentType: matches[1],
      token: vercelBlobToken
    });
    
    return blob.url;
  } else if (supabase) {
    // Generate clean file path
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
    // Save to local uploads folder
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
