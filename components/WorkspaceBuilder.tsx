'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TemplatesDropdown from '@/components/TemplatesDropdown';
import { 
  Briefcase, Utensils, Calendar as CalendarIcon, Link2, Wifi, 
  ShoppingBag, Sparkles, Send, Check, AlertTriangle, X, ChevronRight, Eye, QrCode
} from 'lucide-react';
import { getInitialData, TemplateType } from '@/lib/templates';
import { CardData } from '@/lib/db';
import TemplateForm from '@/components/TemplateForms';
import PhysicalCard from '@/components/PhysicalCard';
import PhoneMockup from '@/components/PhoneMockup';
import QRGenerator from '@/components/QRGenerator';
import { createCardAction, updateCardAction, checkSlugAvailability } from '@/app/actions/card-actions';
import AdSlot from '@/components/AdSlot';

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
  const searchParams = useSearchParams();
  const tParam = searchParams.get('t');
  
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

  // Sync with URL query parameter t
  useEffect(() => {
    if (!initialCard && tParam) {
      const validTemplates: TemplateType[] = ['business', 'menu', 'event', 'link', 'wifi', 'catalog'];
      if (validTemplates.includes(tParam as TemplateType)) {
        setTemplate(tParam as TemplateType);
      }
    }
  }, [tParam, initialCard]);

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
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans select-none relative">
      {/* Workspace Header */}
      <header className="h-16 px-6 bg-surface/75 backdrop-blur-md border-b border-border-default flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          {/* Styled Brand Logo Badge */}
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm">
            <QrCode className="w-4.5 h-4.5 text-white" />
          </div>
          <Link href="/" className="text-base font-bold tracking-tight text-primary flex items-center gap-1 font-heading">
            Card<span className="text-muted-text font-normal">QR</span>
          </Link>
          <span className="text-xs text-border-emphasis">/</span>
          <span className="text-xs font-bold text-muted-text">
            {isEditMode ? 'Edit Card Workspace' : 'Creator Workspace'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <TemplatesDropdown />
          {/* Mobile Preview Trigger */}
          <button
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden h-9 px-3 border border-border-default rounded-xl text-xs font-bold bg-surface hover:bg-surface-2 flex items-center gap-1.5 cursor-pointer text-primary"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing || slugStatus === 'taken' || !slug}
            className="h-9 px-4.5 bg-accent hover:bg-accent/95 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {isPublishing ? 'Saving...' : (
              <>
                <Send className="w-3.5 h-3.5 text-white" /> {isEditMode ? 'Update Card' : 'Publish Card'}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Customizer Forms */}
        <section className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 flex flex-col max-w-3xl bg-background">
          <div className="max-w-xl w-full">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-1.5 font-heading">
              {isEditMode ? 'Update Your Card' : 'Design Your Card'}
            </h1>
            <p className="text-xs text-muted-text">
              {isEditMode ? 'Modify your fields below. The card changes will update immediately.' : 'Fill in the fields below. The live simulator on the right will update instantly.'}
            </p>
            
            {/* Slug Path Input */}
            <div className="mt-6 p-4 rounded-xl border border-border-default bg-surface shadow-2xs">
              <label className="text-[11px] font-bold text-muted-text tracking-wide uppercase">Your Public URL Route</label>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-muted-text select-none">cardqr.com/c/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. coffee-hub"
                  className="flex-1 h-9 px-3 text-xs border border-border-default rounded-lg focus:outline-none focus:border-accent font-bold text-primary bg-surface-2"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold">
                {slugStatus === 'checking' && <span className="text-muted-text">Verifying URL route availability...</span>}
                {slugStatus === 'available' && <span className="text-success">✓ Route is available</span>}
                {slugStatus === 'taken' && <span className="text-danger">✗ Route already in use. Try a different slug.</span>}
                {slugStatus === 'idle' && <span className="text-muted-text/60">Alphanumeric characters and hyphens only.</span>}
              </div>
            </div>

            {/* Template Workspace Ad Slot Placeholder */}
            <AdSlot slotId={`${template}-workspace`} />

            {/* Template Selector Grid is hidden; selected template is governed by URL query path or dropdown selection */}

            {/* validation banner */}
            {validationError && (
              <div className="mt-6 p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Render selected template form */}
            <div className="mt-8 bg-surface border border-border-default p-6 rounded-2xl shadow-2xs mb-10">
              <div className="flex items-center gap-2 mb-6 border-b border-border-default pb-4">
                <div className="w-6 h-6 rounded-md bg-accent-dim text-accent flex items-center justify-center font-bold">
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
        <section className="hidden md:flex w-[380px] border-l border-border-default bg-background flex-col justify-center py-6 shrink-0 h-full overflow-y-auto no-scrollbar">
          <PhoneMockup dark={false}>
            <div className="relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-background">
              
              {/* Viewfinder borders customized for small simulator screen */}
              <div className="absolute inset-4 pointer-events-none z-0 border border-border-default rounded-2xl">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-border-emphasis rounded-tl-md" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-border-emphasis rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-border-emphasis rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-border-emphasis rounded-br-md" />
                
                {/* Live Scan Mode label */}
                <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-bold tracking-wider text-muted-text uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  <span>Scan Preview</span>
                </div>
              </div>

              {/* Physical card centered with scale adjustment */}
              <div className="flex-1 flex flex-col items-center justify-center z-10 scale-90 -my-6 origin-center">
                <PhysicalCard card={{ templateType: template, data: formData, slug: slug || 'preview' }} />
                
                {/* Hint indicator */}
                <span className="text-[8px] text-muted-text font-bold uppercase tracking-wider mt-4">
                  Interactive Card Preview
                </span>
              </div>
            </div>
          </PhoneMockup>
        </section>
      </main>

      {/* Mobile Preview Overlay Bottom Sheet */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end md:hidden">
          <div className="absolute inset-0" onClick={() => setShowMobilePreview(false)} />
          <div className="relative bg-surface border-t border-border-emphasis rounded-t-3xl p-4 flex flex-col gap-4 max-h-[90%] z-20 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <span className="text-xs font-bold text-primary">Live Mobile Simulator</span>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-6">
              <PhoneMockup animate={false} dark={false}>
                <div className="relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-background">
                  
                  <div className="absolute inset-4 pointer-events-none z-0 border border-border-default rounded-2xl">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-border-emphasis rounded-tl-md" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-border-emphasis rounded-tr-md" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-border-emphasis rounded-bl-md" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-border-emphasis rounded-br-md" />
                    
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-bold tracking-wider text-muted-text uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                      <span>Scan Preview</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center z-10 scale-90 -my-6 origin-center">
                    <PhysicalCard card={{ templateType: template, data: formData, slug: slug || 'preview' }} />
                    <span className="text-[8px] text-muted-text font-bold uppercase tracking-wider mt-4">
                      Interactive Card Preview
                    </span>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      )}

      {/* Publish Result Modal Overlay */}
      {publishResult && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl p-6.5 max-w-sm w-full flex flex-col gap-5 border border-border-emphasis shadow-2xl select-text text-primary">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-success text-zinc-950 flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
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
                className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-primary cursor-pointer hover:bg-border-emphasis"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="py-2 flex justify-center bg-white p-4 rounded-2xl border border-border-default">
              <QRGenerator value={publishResult.publicUrl} />
            </div>

            {/* Secret URL warning */}
            <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/20 text-warning text-[10px] leading-relaxed font-bold flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-warning mt-0.5" />
              <div>
                <span className="uppercase text-warning block mb-0.5">Critical Action Required</span>
                Save your edit link below. Anyone with this link can edit your Card. We do not store passwords.
              </div>
            </div>

            {/* Edit Link copying */}
            <div className="flex flex-col gap-1 pt-1.5 border-t border-border-default">
              <span className="text-[9px] font-extrabold tracking-wider text-muted-text uppercase">Secret Edit URL</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={publishResult.editUrl}
                  className="flex-1 h-9 px-2.5 text-[11px] font-mono border border-border-default bg-surface-2 rounded-lg focus:outline-none text-primary"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publishResult.editUrl);
                  }}
                  className="h-9 px-3 bg-accent hover:bg-accent/90 text-zinc-950 text-xs font-bold rounded-lg shrink-0 transition-all cursor-pointer"
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
              className="w-full h-10 border border-border-default hover:bg-surface-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-primary transition-all text-center mt-2 cursor-pointer"
            >
              Open Scanned Card <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
