'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TemplatesDropdown from '@/components/TemplatesDropdown';
import { 
  Sparkles, Send, Check, AlertTriangle, X, ChevronRight, Eye, QrCode,
  ArrowRight, ArrowLeft, Download, Copy, Share2
} from 'lucide-react';
import Image from 'next/image';
import { getInitialData } from '@/lib/templates';
import TemplateForm from '@/components/TemplateForms';
import PhysicalCard from '@/components/PhysicalCard';
import PhoneMockup from '@/components/PhoneMockup';
import QRStylingCustomizer from '@/components/QRStylingCustomizer';
import { createQRCodeAction, updateQRCodeAction, checkSlugAvailability } from '@/app/actions/card-actions';
import AdSlot from '@/components/AdSlot';

interface WorkspaceBuilderProps {
  initialQRCode?: any;
  forcedTemplate?: string;
}

export default function WorkspaceBuilder({ initialQRCode, forcedTemplate }: WorkspaceBuilderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tParam = searchParams.get('t');
  
  // Dynamic vs Static templates check
  const DYNAMIC_TYPES = ['restaurant-menu', 'business-card', 'social-media', 'pdf', 'images', 'video', 'event'];

  // States
  const [template, setTemplate] = useState<string>(
    initialQRCode?.slug || forcedTemplate || 'website-url'
  );
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(initialQRCode?.content || null);
  const [slug, setSlug] = useState(initialQRCode?.slug || '');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>(
    initialQRCode ? 'available' : 'idle'
  );
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrStyleOptions, setQrStyleOptions] = useState<any>(null);
  const [createdId, setCreatedId] = useState<string>(initialQRCode?.id || '');
  
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Sync with URL query parameter t
  useEffect(() => {
    if (!initialQRCode && !forcedTemplate && tParam) {
      setTemplate(tParam);
    }
  }, [tParam, initialQRCode, forcedTemplate]);

  // Handle template initial load or changes (only in create mode)
  useEffect(() => {
    if (!initialQRCode) {
      setFormData(getInitialData(template));
      // Reset step
      setStep(1);
    }
  }, [template, initialQRCode]);

  // Clean slug on change and validate
  const handleSlugChange = async (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
    if (!cleaned) {
      setSlugStatus('idle');
      return;
    }
    
    if (initialQRCode && cleaned === initialQRCode.slug) {
      setSlugStatus('available');
      return;
    }
    
    setSlugStatus('checking');
    const isAvailable = await checkSlugAvailability(cleaned);
    setSlugStatus(isAvailable ? 'available' : 'taken');
  };

  // Compute Static QR value based on form details
  const getStaticQRValue = () => {
    if (!formData) return '';
    
    switch (template) {
      case 'website-url':
      case 'facebook-page':
      case 'youtube-channel':
        return formData.url || 'https://getcardqr.com';
      case 'instagram-profile':
        const rawInsta = formData.url || '';
        return rawInsta.startsWith('http') ? rawInsta : `https://instagram.com/${rawInsta}`;
      case 'wifi':
        return `WIFI:S:${formData.networkName || ''};T:${formData.security || 'WPA'};P:${formData.password || ''};;`;
      case 'simple-text':
        return formData.text || '';
      case 'email':
        return `mailto:${formData.emailAddress || ''}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`;
      case 'sms':
        return `smsto:${formData.phoneNumber || ''}:${formData.message || ''}`;
      case 'phone-call':
        return `tel:${formData.phoneNumber || ''}`;
      case 'location':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address || '')}`;
      case 'payment':
        return formData.paymentUrl || '';
      case 'app-download':
        return formData.appStoreUrl || formData.playStoreUrl || '';
      default:
        return 'https://getcardqr.com';
    }
  };

  // Step 1 -> Step 2 transition: save content if dynamic
  const handleContinueToDesign = async () => {
    setValidationError('');
    const isDynamic = DYNAMIC_TYPES.includes(template);

    if (isDynamic) {
      if (!slug) {
        setValidationError('Please select a URL path slug for your dynamic card.');
        return;
      }
      if (slugStatus === 'taken') {
        setValidationError('This URL route path is already taken. Please choose another.');
        return;
      }

      setIsPublishing(true);
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://getcardqr.com';
        
        let res;
        if (createdId) {
          // Update
          res = await updateQRCodeAction(createdId, slug, template, formData, undefined, undefined, template === 'restaurant-menu' ? formData.categories : undefined);
        } else {
          // Create
          res = await createQRCodeAction(slug, template, formData, undefined, undefined, template === 'restaurant-menu' ? formData.categories : undefined);
        }

        if (res.success && res.data) {
          setCreatedId(res.data.id);
          const redirectUrl = `${origin}/q/${res.data.id}`;
          setQrCodeUrl(redirectUrl);
          setStep(2);
        } else {
          setValidationError(res.error || 'Failed to save card contents.');
        }
      } catch (err: any) {
        console.error(err);
        setValidationError(err.message || 'An error occurred.');
      } finally {
        setIsPublishing(false);
      }
    } else {
      // For static codes, encode value directly
      const staticVal = getStaticQRValue();
      setQrCodeUrl(staticVal);
      setStep(2);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://getcardqr.com';
    const link = DYNAMIC_TYPES.includes(template) ? `${origin}/c/${slug}` : getStaticQRValue();
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const isDynamic = DYNAMIC_TYPES.includes(template);

  return (
    <div className="h-screen bg-background text-primary flex flex-col font-sans select-none relative overflow-hidden">
      {/* Workspace Header */}
      <header className="h-16 px-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-white/8 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="CardQR" width={28} height={28} priority className="rounded-none border border-white/10" />
          <Link href="/" className="text-sm font-bold tracking-tight text-primary flex items-center gap-0.5 font-heading">
            Card<span className="text-accent">QR</span>
          </Link>
          <span className="text-xs text-primary/20">/</span>
          <span className="text-xs font-semibold text-muted-text">
            {initialQRCode ? 'Edit QR Card' : 'Creator Workspace'}
          </span>
        </div>

        {/* Top Wizard Steps Progress Bar */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold font-sans">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-surface-2 text-muted-text'}`}>1</span>
            <span className={step >= 1 ? 'text-primary' : 'text-muted-text'}>Content</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-text/30" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-surface-2 text-muted-text'}`}>2</span>
            <span className={step >= 2 ? 'text-primary' : 'text-muted-text'}>QR Design</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-text/30" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-accent text-accent-foreground' : 'bg-surface-2 text-muted-text'}`}>3</span>
            <span className={step >= 3 ? 'text-primary' : 'text-muted-text'}>Download</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TemplatesDropdown />
          {step === 1 && (
            <button
              onClick={() => setShowMobilePreview(true)}
              className="md:hidden h-9 px-3 border border-white/5 bg-surface hover:bg-surface-2 rounded-none text-xs font-bold flex items-center gap-1.5 cursor-pointer text-primary"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Control Column */}
        <section className="flex-1 overflow-y-auto px-4 py-6 md:px-12 md:py-8 flex flex-col max-w-3xl bg-background">
          <div className="max-w-xl w-full">
            {/* Step Content Headers */}
            {step === 1 && (
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-1">
                  1. Fill Content Details
                </h1>
                <p className="text-[11px] text-muted-text font-semibold">
                  Provide details for your QR code destination sheet below.
                </p>
              </div>
            )}
            {step === 2 && (
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-1">
                  2. Customize QR Code Style
                </h1>
                <p className="text-[11px] text-muted-text font-semibold">
                  Modify patterns, shapes, colors, and embed logos in the center of your scannable.
                </p>
              </div>
            )}
            {step === 3 && (
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-1">
                  3. Export & Download
                </h1>
                <p className="text-[11px] text-muted-text font-semibold">
                  Your scannable is ready. Download in premium vectors or image files.
                </p>
              </div>
            )}

            {/* Validation Banner */}
            {validationError && (
              <div className="mt-4 p-3.5 rounded-none bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1 WIDGETS */}
            {step === 1 && formData && (
              <div className="space-y-6 mt-6">
                {/* Slug URL Input (For dynamic templates only) */}
                {isDynamic && (
                  <div className="boxy-sm p-4 rounded-none bg-surface">
                    <label className="text-[10px] font-bold text-muted-text tracking-wider uppercase block mb-2">Public URL Route slug</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-text font-semibold font-mono">cardqr.com/c/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="e.g. delicious-cafe"
                        className="flex-1 h-9 px-3 text-xs border border-white/5 bg-surface-2 rounded-none focus:outline-none focus:border-accent text-primary font-semibold font-mono"
                      />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[9px] font-bold">
                      {slugStatus === 'checking' && <span className="text-muted-text">Verifying route availability...</span>}
                      {slugStatus === 'available' && <span className="text-emerald-400">✓ Route available</span>}
                      {slugStatus === 'taken' && <span className="text-red-400">✗ Route already in use. Try a different slug.</span>}
                      {slugStatus === 'idle' && <span className="text-muted-text/50">Characters: a-z, 0-9, hyphen.</span>}
                    </div>
                  </div>
                )}

                {/* Main Form Fields */}
                <div className="bg-surface border border-white/8 p-5 rounded-none">
                  <TemplateForm
                    type={template}
                    data={formData}
                    onChange={(newData) => setFormData(newData)}
                  />
                </div>

                {/* Continue to Step 2 Button */}
                <div className="pt-2">
                  <button
                    onClick={handleContinueToDesign}
                    disabled={isPublishing}
                    className="boxy w-full h-11 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isPublishing ? 'Saving Details...' : 'Continue to QR Design'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 WIDGETS */}
            {step === 2 && (
              <div className="mt-6 space-y-6">
                <QRStylingCustomizer
                  value={qrCodeUrl}
                  onChange={(opts) => setQrStyleOptions(opts)}
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="boxy flex-1 h-11 hover:bg-surface-2 rounded-none text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer bg-surface"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Content
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="boxy flex-1 h-11 bg-accent hover:brightness-105 text-accent-foreground rounded-none text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue to Download <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 WIDGETS */}
            {step === 3 && (
              <div className="mt-6 space-y-6">
                <div className="p-5 bg-surface border border-white/8 rounded-none space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary">QR Code Generator Complete!</h3>
                      <p className="text-[10px] text-muted-text font-semibold">Your custom scannable is ready to deploy.</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-muted-text uppercase tracking-wider block mb-1">Redirection Link / Payload</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={isDynamic ? `${typeof window !== 'undefined' ? window.location.origin : 'https://getcardqr.com'}/c/${slug}` : getStaticQRValue()}
                          className="flex-1 h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-mono"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="h-9 px-4 bg-accent hover:brightness-110 text-accent-foreground text-xs font-bold rounded-none shrink-0 cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {isDynamic && (
                      <div className="pt-2">
                        <Link
                          href={`/c/${slug}`}
                          target="_blank"
                          className="w-full h-10 bg-surface-2 border border-white/5 rounded-none hover:bg-white/5 text-xs font-semibold text-primary flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-4 h-4 text-cyan" />
                          View Live Dynamic Card
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="boxy flex-1 h-11 hover:bg-surface-2 rounded-none text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer bg-surface"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit QR Design
                  </button>
                  <Link
                    href="/"
                    className="boxy flex-1 h-11 bg-surface hover:bg-surface-2 rounded-none text-xs font-bold text-primary flex items-center justify-center gap-1"
                  >
                    Return to Homepage
                  </Link>
                </div>

                {/* Ad Slot 3 */}
                <div className="pt-4">
                  <AdSlot slotId="create-step3-banner" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Flat Phone Mockup Column (Only for Step 1 content editing) */}
        {step === 1 && (
          <section className="hidden md:flex w-[380px] xl:w-[480px] border-l border-white/8 bg-surface/20 flex-col items-center gap-4 py-6 px-6 shrink-0 h-full overflow-hidden">
            <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest block shrink-0">Live Preview Simulator</span>

            <div className="flex-1 w-full min-h-0 flex items-center justify-center">
              <PhoneMockup dark={false} className="!w-auto !max-w-[340px] h-full max-h-full">
                <div className="relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-background">
                  {formData ? (
                    <div className="flex-1 flex flex-col items-center justify-center z-10 scale-[0.82] origin-center w-full">
                      <PhysicalCard card={{ templateType: template as any, data: formData, slug: slug || 'preview' }} />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-text">Waiting for details...</span>
                  )}
                </div>
              </PhoneMockup>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Preview Bottom Drawer (Step 1 mobile viewing) */}
      {showMobilePreview && step === 1 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-end md:hidden">
          <div className="absolute inset-0" onClick={() => setShowMobilePreview(false)} />
          <div className="relative bg-surface border-t-2 border-foreground rounded-t-none p-4 flex flex-col gap-4 max-h-[85%] z-20 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-xs font-bold text-primary">Live Simulator</span>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-6 flex flex-col items-center">
              <PhoneMockup animate={false} dark={false}>
                <div className="relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-background">
                  {formData && (
                    <div className="flex-1 flex flex-col items-center justify-center z-10 scale-[0.82] origin-center w-full">
                      <PhysicalCard card={{ templateType: template as any, data: formData, slug: slug || 'preview' }} />
                    </div>
                  )}
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
