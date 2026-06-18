'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Utensils, Calendar as CalendarIcon, Link2, Wifi, 
  ShoppingBag, Sparkles, Send, Check, AlertTriangle, X, ChevronRight, Eye 
} from 'lucide-react';
import { getInitialData, TemplateType } from '@/lib/templates';
import { CardData } from '@/lib/db';
import TemplateForm from '@/components/TemplateForms';
import TemplatePreview from '@/components/TemplatePreviews';
import PhoneMockup from '@/components/PhoneMockup';
import QRGenerator from '@/components/QRGenerator';
import { createCardAction, updateCardAction, checkSlugAvailability } from '@/app/actions/card-actions';

const TEMPLATES: Array<{ id: TemplateType; label: string; icon: any }> = [
  { id: 'business', label: 'Business Card', icon: Briefcase },
  { id: 'menu', label: 'Restaurant Menu', icon: Utensils },
  { id: 'event', label: 'Event Card', icon: CalendarIcon },
  { id: 'link', label: 'Link Hub', icon: Link2 },
  { id: 'wifi', label: 'WiFi Sharing', icon: Wifi },
  { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
];

interface WorkspaceBuilderProps {
  initialCard?: CardData;
}

export default function WorkspaceBuilder({ initialCard }: WorkspaceBuilderProps) {
  const router = useRouter();
  
  // States
  const [template, setTemplate] = useState<TemplateType>(initialCard?.templateType || 'business');
  const [formData, setFormData] = useState<any>(initialCard?.data || null);
  const [slug, setSlug] = useState(initialCard?.slug || '');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>(
    initialCard ? 'available' : 'idle'
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ publicUrl: string; editUrl: string } | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle template initial load or changes (only in create mode)
  useEffect(() => {
    if (!initialCard) {
      setFormData(getInitialData(template));
    }
  }, [template, initialCard]);

  // Clean slug on change and validate
  const handleSlugChange = async (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
    if (!cleaned) {
      setSlugStatus('idle');
      return;
    }
    
    // In edit mode, if user changes back to original slug, it's available
    if (initialCard && cleaned === initialCard.slug) {
      setSlugStatus('available');
      return;
    }
    
    setSlugStatus('checking');
    const isAvailable = await checkSlugAvailability(cleaned);
    setSlugStatus(isAvailable ? 'available' : 'taken');
  };

  const handlePublish = async () => {
    setValidationError('');
    
    if (!slug) {
      setValidationError('Please choose a URL path slug.');
      return;
    }
    
    if (slugStatus === 'taken') {
      setValidationError('This URL path slug is already taken. Please choose another.');
      return;
    }

    setIsPublishing(true);
    try {
      const origin = window.location.origin;
      if (initialCard) {
        // Edit mode update
        const res = await updateCardAction(initialCard.editToken, formData, slug);
        if (res.success && res.data) {
          setPublishResult({
            publicUrl: `${origin}/c/${res.data.slug}`,
            editUrl: `${origin}/edit/${res.data.editToken}`
          });
        } else {
          setValidationError(res.error || 'Failed to update card.');
        }
      } else {
        // Create mode publish
        const res = await createCardAction(slug, template, formData);
        if (res.success && res.data) {
          setPublishResult({
            publicUrl: `${origin}/c/${res.data.slug}`,
            editUrl: `${origin}/edit/${res.data.editToken}`
          });
        } else {
          setValidationError(res.error || 'Failed to publish card.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || 'An error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!formData) return null;

  const isEditMode = !!initialCard;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans select-none relative">
      {/* Workspace Header */}
      <header className="h-16 px-6 bg-white border-b border-black/5 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-black tracking-tight text-primary flex items-center gap-1">
            Card<span className="text-muted-text font-medium">QR</span>
          </Link>
          <span className="text-xs text-muted-text/60">/</span>
          <span className="text-xs font-bold text-primary">
            {isEditMode ? 'Edit Card Workspace' : 'Creator Workspace'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Preview Trigger */}
          <button
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden h-9 px-3 border border-black/10 rounded-xl text-xs font-bold bg-white hover:bg-[#F4F4F5] flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing || slugStatus === 'taken' || !slug}
            className="h-9 px-4.5 bg-primary hover:bg-accent disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {isPublishing ? 'Saving...' : (
              <>
                <Send className="w-3.5 h-3.5" /> {isEditMode ? 'Update Card' : 'Publish Card'}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Customizer Forms */}
        <section className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 flex flex-col max-w-3xl">
          <div className="max-w-xl w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-1.5">
              {isEditMode ? 'Update Your Card' : 'Design Your Card'}
            </h1>
            <p className="text-xs text-muted-text">
              {isEditMode ? 'Modify your fields below. The card changes will update immediately.' : 'Fill in the fields below. The live simulator on the right will update instantly.'}
            </p>
            
            {/* Slug Path Input */}
            <div className="mt-6 p-4 rounded-xl border border-black/5 bg-white shadow-2xs">
              <label className="text-[11px] font-bold text-primary tracking-wide uppercase">Your Public URL Route</label>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-muted-text select-none">cardqr.com/c/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. coffee-hub"
                  className="flex-1 h-9 px-3 text-xs border border-black/10 rounded-lg focus:outline-none focus:border-primary font-bold text-primary"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold">
                {slugStatus === 'checking' && <span className="text-muted-text">Verifying URL route availability...</span>}
                {slugStatus === 'available' && <span className="text-[#10B981]">✓ Route route is available</span>}
                {slugStatus === 'taken' && <span className="text-red-500">✗ Route already in use. Try a different slug.</span>}
                {slugStatus === 'idle' && <span className="text-muted-text/60">Alphanumeric characters and hyphens only.</span>}
              </div>
            </div>

            {/* Template Selector Grid (Disabled in edit mode to preserve structural types) */}
            {!isEditMode && (
              <div className="mt-8">
                <label className="text-[11px] font-bold text-primary tracking-wide uppercase">Select Template Profile</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2.5">
                  {TEMPLATES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = template === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTemplate(item.id)}
                        className={`h-11 px-3.5 border rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-white text-primary shadow-xs' 
                            : 'border-black/5 bg-white hover:bg-muted-bg text-muted-text'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-text/70'}`} />
                        <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* validation banner */}
            {validationError && (
              <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Render selected template form */}
            <div className="mt-8 bg-white border border-black/5 p-6 rounded-2xl shadow-2xs mb-10">
              <div className="flex items-center gap-2 mb-6 border-b border-black/5 pb-4">
                <div className="w-6 h-6 rounded-md bg-primary/5 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold tracking-wider text-muted-text uppercase">
                  {TEMPLATES.find(t => t.id === template)?.label} Customizer
                </h2>
              </div>
              
              <TemplateForm
                type={template}
                data={formData}
                onChange={(newData) => setFormData(newData)}
              />
            </div>
          </div>
        </section>

        {/* Right Side: Simulator Preview (Desktop only) */}
        <section className="hidden md:flex w-[380px] border-l border-black/5 bg-[#FAFAFA] flex-col justify-center py-6 shrink-0 h-full overflow-y-auto no-scrollbar">
          <PhoneMockup>
            <TemplatePreview type={template} data={formData} />
          </PhoneMockup>
        </section>
      </main>

      {/* Mobile Preview Overlay Bottom Sheet */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end md:hidden">
          <div className="absolute inset-0" onClick={() => setShowMobilePreview(false)} />
          <div className="relative bg-[#FAFAFA] rounded-t-3xl p-4 flex flex-col gap-4 max-h-[90%] z-20 overflow-hidden">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-bold text-primary">Live Mobile Simulator</span>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="w-7 h-7 rounded-full bg-[#F4F4F5] flex items-center justify-center text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-6">
              <PhoneMockup animate={false}>
                <TemplatePreview type={template} data={formData} />
              </PhoneMockup>
            </div>
          </div>
        </div>
      )}

      {/* Publish Result Modal Overlay */}
      {publishResult && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6.5 max-w-sm w-full flex flex-col gap-5 border border-black/5 shadow-xl select-text">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-success text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-primary">
                  {isEditMode ? 'Card Updated!' : 'Card Published!'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setPublishResult(null);
                  router.push('/');
                }}
                className="w-7 h-7 rounded-full bg-[#F4F4F5] flex items-center justify-center text-primary cursor-pointer hover:bg-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="py-2 flex justify-center">
              <QRGenerator value={publishResult.publicUrl} />
            </div>

            {/* Secret URL warning */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] leading-relaxed font-bold flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="uppercase text-amber-700 block mb-0.5">Critical Action Required</span>
                Save your edit link below. Anyone with this link can edit your Card. We do not store passwords.
              </div>
            </div>

            {/* Edit Link copying */}
            <div className="flex flex-col gap-1 pt-1.5 border-t border-black/5">
              <span className="text-[9px] font-extrabold tracking-wider text-muted-text uppercase">Secret Edit URL</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={publishResult.editUrl}
                  className="flex-1 h-9 px-2.5 text-[11px] font-mono border border-black/10 bg-[#FAFAFA] rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publishResult.editUrl);
                  }}
                  className="h-9 px-3 bg-primary hover:bg-accent text-white text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* View public card */}
            <a
              href={publishResult.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 border border-black/10 hover:bg-[#F4F4F5] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-primary transition-all text-center mt-2 cursor-pointer"
            >
              Open Scanned Card <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
