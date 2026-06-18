'use server';

import { getCardBySlug, getCardByEditToken, saveCard, uploadImage } from '@/lib/db';

// Generate a random string of specific length for editToken
function generateToken(length = 11): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  try {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
    if (!cleanSlug) return false;
    
    const card = await getCardBySlug(cleanSlug);
    return card === null;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
}

export async function createCardAction(
  slug: string,
  templateType: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog',
  data: any
): Promise<ActionResponse<{ slug: string; editToken: string }>> {
  try {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
    if (!cleanSlug) {
      return { success: false, error: 'URL Slug is required' };
    }
    
    // Check if slug is reserved or already taken
    const existing = await getCardBySlug(cleanSlug);
    if (existing) {
      return { success: false, error: 'URL Slug is already in use by another card' };
    }
    
    // Generate a secure edit token
    let editToken = generateToken();
    let tokenCollision = await getCardByEditToken(editToken);
    while (tokenCollision) {
      editToken = generateToken();
      tokenCollision = await getCardByEditToken(editToken);
    }
    
    // Initial template structure cleanup (ensuring empty structures are valid)
    const card = await saveCard({
      slug: cleanSlug,
      editToken,
      templateType,
      data
    });
    
    return {
      success: true,
      data: {
        slug: card.slug,
        editToken: card.editToken
      }
    };
  } catch (error: any) {
    console.error('Failed to create card:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

export async function updateCardAction(
  editToken: string,
  data: any,
  slug?: string
): Promise<ActionResponse<{ slug: string; editToken: string }>> {
  try {
    const existing = await getCardByEditToken(editToken);
    if (!existing) {
      return { success: false, error: 'Card not found with this edit token' };
    }
    
    let targetSlug = existing.slug;
    if (slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
      if (cleanSlug && cleanSlug !== existing.slug) {
        // Checking if new slug is available
        const slugOwner = await getCardBySlug(cleanSlug);
        if (slugOwner && slugOwner.id !== existing.id) {
          return { success: false, error: 'URL Slug is already in use' };
        }
        targetSlug = cleanSlug;
      }
    }
    
    const updated = await saveCard({
      id: existing.id,
      slug: targetSlug,
      editToken: existing.editToken,
      templateType: existing.templateType,
      data: {
        ...existing.data,
        ...data
      }
    });
    
    return {
      success: true,
      data: {
        slug: updated.slug,
        editToken: updated.editToken
      }
    };
  } catch (error: any) {
    console.error('Failed to update card:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

export async function uploadImageAction(
  fileBase64: string,
  fileName: string
): Promise<ActionResponse<string>> {
  try {
    const publicUrl = await uploadImage(fileBase64, fileName);
    return { success: true, data: publicUrl };
  } catch (error: any) {
    console.error('Failed to upload image:', error);
    return { success: false, error: error.message || 'Failed to upload image' };
  }
}

export async function submitRsvpAction(
  slug: string,
  rsvp: { name: string; email: string; guests: number }
): Promise<ActionResponse<any>> {
  try {
    const existing = await getCardBySlug(slug);
    if (!existing) {
      return { success: false, error: 'Card not found' };
    }
    
    if (existing.templateType !== 'event') {
      return { success: false, error: 'This template does not support RSVPs' };
    }
    
    const cardData = existing.data || {};
    const rsvps = cardData.rsvps || [];
    
    const newRsvp = {
      ...rsvp,
      timestamp: new Date().toISOString()
    };
    
    const updatedRsvps = [...rsvps, newRsvp];
    
    await saveCard({
      id: existing.id,
      slug: existing.slug,
      editToken: existing.editToken,
      templateType: existing.templateType,
      data: {
        ...cardData,
        rsvps: updatedRsvps
      }
    });
    
    return { success: true, data: newRsvp };
  } catch (error: any) {
    console.error('Failed to submit RSVP:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}
