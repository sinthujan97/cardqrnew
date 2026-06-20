'use client';

import React, { useState } from 'react';
import { Plus, Trash, Upload, Sparkles } from 'lucide-react';
import { uploadImageAction } from '@/app/actions/card-actions';

interface FormProps<T> {
  data: T;
  onChange: (newData: T) => void;
}

// Helper: Scale down a base64 image client-side using canvas to optimize mobile footprint
const resizeImage = (base64Str: string, maxSide = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // If already smaller than maxSide, no need to resize
      if (width <= maxSide && height <= maxSide) {
        resolve(base64Str);
        return;
      }

      if (width > height) {
        if (width > maxSide) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        }
      } else {
        if (height > maxSide) {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Detect if PNG/WebP format with potential transparency, and preserve it to prevent black background artifacts
      const isPNG = base64Str.startsWith('data:image/png') || base64Str.startsWith('data:image/webp');
      const mimeType = isPNG ? 'image/png' : 'image/jpeg';
      
      // Output as compressed format (quality parameter is ignored for image/png)
      const resizedBase64 = canvas.toDataURL(mimeType, isPNG ? undefined : 0.82);
      resolve(resizedBase64);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// Helper: Convert file to Base64 for instant client-side preview and server-side saving
const handleImageFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  onDone: (url: string) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const originalBase64 = event.target?.result as string;
    
    // Scale and compress the image first
    const scaledBase64 = await resizeImage(originalBase64, 800);
    
    // 1. Instant client-side preview using scaled base64
    onDone(scaledBase64); // Render scaled base64 in simulator instantly
    
    // 2. Proactive upload to storage (server action)
    try {
      const res = await uploadImageAction(scaledBase64, file.name);
      if (res.success && res.data) {
        onDone(res.data); // Update with permanent URL
      }
    } catch (err) {
      console.error('Upload failed, keeping local preview:', err);
    }
  };
  reader.readAsDataURL(file);
};

function CardThemeSelector({ 
  value = 'light', 
  onChange 
}: { 
  value?: 'light' | 'dark'; 
  onChange: (theme: 'light' | 'dark') => void; 
}) {
  return (
    <div className="mb-6 p-4 rounded-xl border border-border-default bg-surface shadow-2xs">
      <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase block mb-2">Card Visual Theme</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('light')}
          className={`flex-1 h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            value === 'light'
              ? 'bg-[#FAF8F4] border-accent text-accent shadow-xs'
              : 'bg-surface border-border-default text-primary hover:bg-surface-2'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FAF8F4] border border-border-emphasis" />
          <span>Light Stationery</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('dark')}
          className={`flex-1 h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            value === 'dark'
              ? 'bg-[#1A1815] border-accent text-accent shadow-xs'
              : 'bg-surface border-border-default text-primary hover:bg-surface-2'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#1A1815] border border-white/10" />
          <span>Dark Charcoal</span>
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. BUSINESS FORM
// -------------------------------------------------------------
export function BusinessForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddSocial = () => {
    const socials = data.socials || [];
    onChange({ 
      ...data, 
      socials: [...socials, { label: 'Instagram', url: '' }] 
    });
  };

  const handleRemoveSocial = (index: number) => {
    const socials = [...(data.socials || [])];
    socials.splice(index, 1);
    onChange({ ...data, socials });
  };

  const handleSocialChange = (index: number, field: string, value: string) => {
    const socials = [...(data.socials || [])];
    socials[index] = { ...socials[index], [field]: value };
    onChange({ ...data, socials });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Full Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. Charlotte Dubois"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Position / Subtitle</label>
          <input
            type="text"
            value={data.position || ''}
            onChange={(e) => updateField('position', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. Principal Designer at Studio Arcs"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Profile Photo</label>
        <div className="flex items-center gap-4 mt-2">
          {data.photo && (
            <img src={data.photo} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-border-default bg-surface text-primary" />
          )}
          <label className="h-10 px-4 border border-border-default bg-surface rounded-xl hover:bg-surface-2 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer text-primary">
            <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFileChange(e, (url) => updateField('photo', url))}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Bio Description</label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={3}
          className="w-full p-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium resize-none text-primary"
          placeholder="Brief description about yourself or company..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border-default pt-6 mt-1 text-primary">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Phone Number</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="charlotte@example.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">WhatsApp (Include Country Code)</label>
          <input
            type="text"
            value={data.whatsapp || ''}
            onChange={(e) => updateField('whatsapp', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="15551234567"
          />
        </div>
      </div>

      {/* Social Links List */}
      <div className="border-t border-border-default pt-6 mt-1 text-primary">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Social Links</label>
          <button
            type="button"
            onClick={handleAddSocial}
            className="h-8 px-3 border border-accent/20 hover:border-accent hover:bg-accent-dim rounded-lg text-[10px] font-bold text-accent flex items-center gap-1 transition-all cursor-pointer bg-surface"
          >
            <Plus className="w-3 h-3" /> Add Link
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          {data.socials?.map((social: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-center bg-surface p-2.5 rounded-xl border border-border-default text-primary">
              <select
                value={social.label}
                onChange={(e) => handleSocialChange(idx, 'label', e.target.value)}
                className="h-9 px-2 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-semibold text-primary"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter (X)</option>
                <option value="GitHub">GitHub</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Website">Website</option>
              </select>
              <input
                type="text"
                value={social.url}
                onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 h-9 px-3 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocial(idx)}
                className="w-9 h-9 border border-border-default rounded-lg bg-surface text-muted-text hover:text-danger hover:bg-danger/10 hover:border-danger/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. RESTAURANT MENU FORM
// -------------------------------------------------------------
export function MenuForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddCategory = () => {
    const categories = data.categories || [];
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      items: []
    };
    onChange({ ...data, categories: [...categories, newCat] });
  };

  const handleRemoveCategory = (catId: string) => {
    const categories = (data.categories || []).filter((c: any) => c.id !== catId);
    onChange({ ...data, categories });
  };

  const handleCategoryNameChange = (catId: string, name: string) => {
    const categories = (data.categories || []).map((c: any) => {
      if (c.id === catId) return { ...c, name };
      return c;
    });
    onChange({ ...data, categories });
  };

  const handleAddItem = (catId: string) => {
    const categories = (data.categories || []).map((c: any) => {
      if (c.id === catId) {
        return {
          ...c,
          items: [
            ...c.items,
            {
              id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              name: 'New Item',
              description: 'Item description...',
              price: '0.00',
              tags: []
            }
          ]
        };
      }
      return c;
    });
    onChange({ ...data, categories });
  };

  const handleRemoveItem = (catId: string, itemId: string) => {
    const categories = (data.categories || []).map((c: any) => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.filter((item: any) => item.id !== itemId)
        };
      }
      return c;
    });
    onChange({ ...data, categories });
  };

  const handleItemFieldChange = (catId: string, itemId: string, field: string, value: any) => {
    const categories = (data.categories || []).map((c: any) => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.map((item: any) => {
            if (item.id === itemId) return { ...item, [field]: value };
            return item;
          })
        };
      }
      return c;
    });
    onChange({ ...data, categories });
  };

  const handleTagToggle = (catId: string, itemId: string, tag: string, active: boolean) => {
    const categories = (data.categories || []).map((c: any) => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.map((item: any) => {
            if (item.id === itemId) {
              const tags = item.tags || [];
              const updatedTags = active 
                ? [...tags, tag] 
                : tags.filter((t: string) => t !== tag);
              return { ...item, tags: updatedTags };
            }
            return item;
          })
        };
      }
      return c;
    });
    onChange({ ...data, categories });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      {/* Menu Display Mode Segmented Toggle */}
      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Menu Display Mode</label>
        <div className="flex gap-2 mt-1.5 bg-surface p-1 rounded-xl border border-border-default">
          <button
            type="button"
            onClick={() => updateField('displayMode', 'card')}
            className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              (data.displayMode || 'card') === 'card'
                ? 'bg-accent text-white shadow-xs'
                : 'text-muted-text hover:text-primary hover:bg-surface-2/40'
            }`}
          >
            Card View (Grid)
          </button>
          <button
            type="button"
            onClick={() => updateField('displayMode', 'list')}
            className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              data.displayMode === 'list'
                ? 'bg-accent text-white shadow-xs'
                : 'text-muted-text hover:text-primary hover:bg-surface-2/40'
            }`}
          >
            List View (Classic)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Restaurant Name</label>
          <input
            type="text"
            value={data.restaurantName || ''}
            onChange={(e) => updateField('restaurantName', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. Gusto Bistro"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Currency symbol</label>
          <input
            type="text"
            value={data.currency || '$'}
            onChange={(e) => updateField('currency', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. $, €, £"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Description</label>
        <input
          type="text"
          value={data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
          placeholder="Italian bistro crafted from local organic ingredients..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Cover Banner Image</label>
          <div className="flex items-center gap-3 mt-2">
            {data.coverImage && (
              <img src={data.coverImage} alt="Cover Preview" className="w-14 h-10 object-cover rounded-lg border border-border-default bg-surface text-primary" />
            )}
            <label className="h-9 px-3 border border-border-default bg-surface rounded-lg hover:bg-surface-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-primary transition-all">
              <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFileChange(e, (url) => updateField('coverImage', url))}
              />
            </label>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Brand Logo</label>
          <div className="flex items-center gap-3 mt-2">
            {data.logo && (
              <img src={data.logo} alt="Logo Preview" className="w-10 h-10 object-cover rounded-lg border border-border-default bg-surface text-primary" />
            )}
            <label className="h-9 px-3 border border-border-default bg-surface rounded-lg hover:bg-surface-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-primary transition-all">
              <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFileChange(e, (url) => updateField('logo', url))}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Menu categories list */}
      <div className="border-t border-border-default pt-6 mt-1 text-primary">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Menu Categories & Items</label>
          <button
            type="button"
            onClick={handleAddCategory}
            className="h-8 px-3 border border-accent bg-accent text-white hover:bg-accent/90 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Category
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {data.categories?.map((cat: any) => (
            <div key={cat.id} className="p-5 rounded-2xl border border-border-default bg-[#FAF8F4]/40 text-primary">
              <div className="flex gap-2 items-center justify-between mb-3">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                  className="h-9 px-3 text-xs font-bold border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all flex-1 max-w-[200px]"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddItem(cat.id)}
                    className="h-8 px-2.5 border border-accent/20 hover:border-accent hover:bg-accent-dim rounded-lg text-[10px] font-bold text-accent flex items-center gap-1 transition-all cursor-pointer bg-surface"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Food Item
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="w-8 h-8 border border-border-default bg-surface text-muted-text hover:text-danger hover:bg-danger/10 hover:border-danger/20 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items under category */}
              <div className="flex flex-col gap-3.5 mt-4">
                {cat.items?.map((item: any) => (
                  <div key={item.id} className="p-4 border border-border-default bg-surface rounded-xl flex flex-col gap-3.5 text-primary">
                    <div className="flex gap-2 items-start justify-between">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemFieldChange(cat.id, item.id, 'name', e.target.value)}
                          placeholder="Item Name"
                          className="h-8 px-2.5 text-xs font-bold border border-border-default bg-surface rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => handleItemFieldChange(cat.id, item.id, 'price', e.target.value)}
                          placeholder="Price"
                          className="h-8 px-2.5 text-xs font-bold border border-border-default bg-surface rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(cat.id, item.id)}
                        className="w-8 h-8 border border-border-default bg-surface text-muted-text hover:text-danger hover:bg-danger/10 hover:border-danger/20 rounded-md flex items-center justify-center shrink-0 transition-all cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemFieldChange(cat.id, item.id, 'description', e.target.value)}
                      placeholder="Item description (ingredients, sizes, etc.)..."
                      className="h-8 px-2.5 text-xs border border-border-default bg-surface rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full"
                    />

                    {/* Image and Tag selections */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img src={item.image} alt="Item Preview" className="w-8 h-8 object-cover rounded-md border border-border-default bg-surface text-primary" />
                        )}
                        <label className="h-7 px-2 border border-border-default bg-surface rounded-md hover:bg-surface-2 flex items-center gap-1 text-[9px] font-bold cursor-pointer transition-all text-primary">
                          <Upload className="w-3 h-3 text-muted-text" /> Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileChange(e, (url) => handleItemFieldChange(cat.id, item.id, 'image', url))}
                          />
                        </label>
                      </div>

                      {/* Tag list toggles */}
                      <div className="flex gap-1 flex-wrap">
                        {['vegan', 'vegetarian', 'gluten-free', 'spicy'].map((tag) => {
                          const isChecked = item.tags?.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagToggle(cat.id, item.id, tag, !isChecked)}
                              className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                isChecked 
                                  ? 'bg-accent text-white border border-accent' 
                                  : 'bg-surface text-muted-text border border-border-default hover:bg-surface-2'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. EVENT CARD FORM
// -------------------------------------------------------------
export function EventForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Event Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
          placeholder="e.g. Midsummer Gallery Vernissage"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Event Banner Image</label>
        <div className="flex items-center gap-4 mt-2">
          {data.banner && (
            <img src={data.banner} alt="Banner Preview" className="w-20 h-10 object-cover rounded-lg border border-border-default shadow-xs bg-surface text-primary" />
          )}
          <label className="h-10 px-4 border border-border-default bg-surface rounded-xl hover:bg-surface-2 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all text-primary">
            <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFileChange(e, (url) => updateField('banner', url))}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Date Description</label>
          <input
            type="text"
            value={data.date || ''}
            onChange={(e) => updateField('date', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. July 24, 2026"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Time / Duration</label>
          <input
            type="text"
            value={data.time || ''}
            onChange={(e) => updateField('time', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. 19:00 - 22:30"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Venue Location</label>
        <input
          type="text"
          value={data.venue || ''}
          onChange={(e) => updateField('venue', e.target.value)}
          className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
          placeholder="e.g. Studio Arcs Gallery, District 4"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Event Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          className="w-full p-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium resize-none text-primary"
          placeholder="Give a brief summary of the agenda, curated features..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-default pt-6 mt-1 text-primary">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">RSVP Button Text</label>
          <input
            type="text"
            value={data.rsvpButtonText || ''}
            onChange={(e) => updateField('rsvpButtonText', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="Request Invitation / RSVP"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Max Guests Limit (Optional)</label>
          <input
            type="number"
            value={data.maxGuests || ''}
            onChange={(e) => updateField('maxGuests', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="Unlimited"
          />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. LINK CARD FORM
// -------------------------------------------------------------
export function LinkForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddLink = () => {
    const links = data.links || [];
    onChange({
      ...data,
      links: [
        ...links,
        {
          id: `link-${Date.now()}`,
          label: 'New Button Link',
          url: 'https://',
          secondaryText: 'Sub-description text',
          theme: 'default'
        }
      ]
    });
  };

  const handleRemoveLink = (linkId: string) => {
    const links = (data.links || []).filter((l: any) => l.id !== linkId);
    onChange({ ...data, links });
  };

  const handleLinkFieldChange = (linkId: string, field: string, value: string) => {
    const links = (data.links || []).map((l: any) => {
      if (l.id === linkId) return { ...l, [field]: value };
      return l;
    });
    onChange({ ...data, links });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Display Name / Title</label>
          <input
            type="text"
            value={data.displayName || ''}
            onChange={(e) => updateField('displayName', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. Charlotte Dubois"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Profile Image</label>
          <div className="flex items-center gap-3 mt-2">
            {data.profileImage && (
              <img src={data.profileImage} alt="Profile Preview" className="w-10 h-10 object-cover rounded-full border border-border-default bg-surface text-primary" />
            )}
            <label className="h-9 px-3 border border-border-default bg-surface rounded-lg hover:bg-surface-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-primary transition-all">
              <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFileChange(e, (url) => updateField('profileImage', url))}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Short Bio</label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={2}
          className="w-full p-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium resize-none text-primary"
          placeholder="Introduce yourself, company, or channels..."
        />
      </div>

      {/* Dynamic links */}
      <div className="border-t border-border-default pt-6 mt-1 text-primary">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Button Links</label>
          <button
            type="button"
            onClick={handleAddLink}
            className="h-8 px-3 border border-accent/20 hover:border-accent hover:bg-accent-dim rounded-lg text-[10px] font-bold text-accent flex items-center gap-1 transition-all cursor-pointer bg-surface"
          >
            <Plus className="w-3 h-3" /> Add Link
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {data.links?.map((link: any) => (
            <div key={link.id} className="p-4 border border-border-default bg-surface rounded-xl flex flex-col gap-3 text-primary">
              <div className="flex gap-2 items-start justify-between">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleLinkFieldChange(link.id, 'label', e.target.value)}
                    placeholder="Button Label"
                    className="h-8.5 px-3 text-xs font-bold border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
                  />
                  <select
                    value={link.theme || 'default'}
                    onChange={(e) => handleLinkFieldChange(link.id, 'theme', e.target.value)}
                    className="h-8.5 px-3 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-semibold text-primary w-full"
                  >
                    <option value="default">Default Button</option>
                    <option value="outline">Outline Button</option>
                    <option value="accent">Primary Dark Button</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="w-8.5 h-8.5 border border-border-default bg-surface text-muted-text hover:text-danger hover:bg-danger/10 hover:border-danger/20 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={link.url}
                onChange={(e) => handleLinkFieldChange(link.id, 'url', e.target.value)}
                placeholder="Redirect Link URL (e.g. https://instagram.com/user)"
                className="h-8.5 px-3 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
              />
              <input
                type="text"
                value={link.secondaryText}
                onChange={(e) => handleLinkFieldChange(link.id, 'secondaryText', e.target.value)}
                placeholder="Alternative helper text (appears small underneath label)"
                className="h-8.5 px-3 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. WIFI CARD FORM
// -------------------------------------------------------------
export function WifiForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Network SSID (Name)</label>
        <input
          type="text"
          value={data.networkName || ''}
          onChange={(e) => updateField('networkName', e.target.value)}
          className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
          placeholder="e.g. StudioArcs_Guest_5G"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">WPA/WEP Password</label>
          <input
            type="text"
            value={data.password || ''}
            onChange={(e) => updateField('password', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. spaceandchroma"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Security Type</label>
          <select
            value={data.security || 'WPA'}
            onChange={(e) => updateField('security', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default bg-surface rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-semibold text-primary"
          >
            <option value="WPA">WPA/WPA2/WPA3 (Recommended)</option>
            <option value="WEP">WEP (Legacy)</option>
            <option value="none">Open / None (No Password)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. PRODUCT CATALOG FORM
// -------------------------------------------------------------
export function CatalogForm({ data, onChange }: FormProps<any>) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddProduct = () => {
    const products = data.products || [];
    const newProd = {
      id: `prod-${Date.now()}`,
      name: 'New Art/Print Piece',
      description: 'Handcrafted Screenprint, Edition of 50...',
      price: '100.00',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200&h=200',
      link: ''
    };
    onChange({ ...data, products: [...products, newProd] });
  };

  const handleRemoveProduct = (prodId: string) => {
    const products = (data.products || []).filter((p: any) => p.id !== prodId);
    onChange({ ...data, products });
  };

  const handleProductFieldChange = (prodId: string, field: string, value: any) => {
    const products = (data.products || []).map((p: any) => {
      if (p.id === prodId) return { ...p, [field]: value };
      return p;
    });
    onChange({ ...data, products });
  };

  return (
    <div className="flex flex-col gap-5">
      <CardThemeSelector value={data.theme} onChange={(theme) => updateField('theme', theme)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Catalog Title</label>
          <input
            type="text"
            value={data.catalogTitle || ''}
            onChange={(e) => updateField('catalogTitle', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. Studio Arcs Print Shop"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">WhatsApp Contact (Inquiry Checkout)</label>
          <input
            type="text"
            value={data.contactNumber || ''}
            onChange={(e) => updateField('contactNumber', e.target.value)}
            className="w-full h-10 px-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium text-primary"
            placeholder="e.g. 15551234567"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Catalog Banner Image</label>
        <div className="flex items-center gap-4 mt-2">
          {data.bannerImage && (
            <img src={data.bannerImage} alt="Banner Preview" className="w-16 h-10 object-cover rounded-lg border border-border-default shadow-xs bg-surface text-primary" />
          )}
          <label className="h-10 px-4 border border-border-default bg-surface rounded-xl hover:bg-surface-2 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all text-primary">
            <Upload className="w-3.5 h-3.5 text-muted-text" /> Upload Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFileChange(e, (url) => updateField('bannerImage', url))}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Catalog Description</label>
        <textarea
          value={data.catalogDescription || ''}
          onChange={(e) => updateField('catalogDescription', e.target.value)}
          rows={2}
          className="w-full p-3.5 mt-1 text-xs border border-border-default rounded-xl bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium resize-none text-primary"
          placeholder="Brief description about the catalog, materials, or delivery details..."
        />
      </div>

      {/* Catalog products list */}
      <div className="border-t border-border-default pt-6 mt-1 text-primary">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-semibold text-muted-text tracking-wider uppercase">Catalog Products</label>
          <button
            type="button"
            onClick={handleAddProduct}
            className="h-8 px-3 border border-accent bg-accent text-white hover:bg-accent/90 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Product
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {data.products?.map((prod: any) => (
            <div key={prod.id} className="p-5 border border-border-default bg-surface rounded-2xl flex flex-col gap-4 text-primary">
              <div className="flex gap-2 items-start justify-between">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    type="text"
                    value={prod.name}
                    onChange={(e) => handleProductFieldChange(prod.id, 'name', e.target.value)}
                    placeholder="Product Name"
                    className="h-8.5 px-3 text-xs font-bold border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
                  />
                  <input
                    type="text"
                    value={prod.price}
                    onChange={(e) => handleProductFieldChange(prod.id, 'price', e.target.value)}
                    placeholder="Price (e.g. 120.00)"
                    className="h-8.5 px-3 text-xs font-bold border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(prod.id)}
                  className="w-8.5 h-8.5 border border-border-default bg-surface text-muted-text hover:text-danger hover:bg-danger/10 hover:border-danger/20 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                value={prod.description}
                onChange={(e) => handleProductFieldChange(prod.id, 'description', e.target.value)}
                placeholder="Product description (materials, availability, dimensions)..."
                rows={2}
                className="w-full p-2.5 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all resize-none font-medium text-primary"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  {prod.image && (
                    <img src={prod.image} alt="Product Preview" className="w-9 h-9 object-cover rounded-lg border border-border-default shrink-0 bg-surface text-primary" />
                  )}
                  <label className="h-8 px-3 border border-accent/20 hover:border-accent hover:bg-accent-dim rounded-lg text-[10px] font-bold text-accent flex items-center gap-1.5 cursor-pointer transition-all bg-surface">
                    <Upload className="w-3 h-3 text-accent" /> Product Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (url) => handleProductFieldChange(prod.id, 'image', url))}
                    />
                  </label>
                </div>
                
                <input
                  type="text"
                  value={prod.link || ''}
                  onChange={(e) => handleProductFieldChange(prod.id, 'link', e.target.value)}
                  placeholder="Purchase URL link (Optional)"
                  className="h-8.5 px-3 text-xs border border-border-default bg-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all w-full text-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN MULTI-FORM DISPATCHER
// -------------------------------------------------------------
export default function TemplateForm({ 
  type, 
  data, 
  onChange 
}: { 
  type: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
  data: any;
  onChange: (newData: any) => void;
}) {
  switch (type) {
    case 'business':
      return <BusinessForm data={data} onChange={onChange} />;
    case 'menu':
      return <MenuForm data={data} onChange={onChange} />;
    case 'event':
      return <EventForm data={data} onChange={onChange} />;
    case 'link':
      return <LinkForm data={data} onChange={onChange} />;
    case 'wifi':
      return <WifiForm data={data} onChange={onChange} />;
    case 'catalog':
      return <CatalogForm data={data} onChange={onChange} />;
    default:
      return <div className="p-4 text-xs">Invalid template selection</div>;
  }
}
