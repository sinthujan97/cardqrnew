'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Upload, Trash2, Palette, Sliders, Image as ImageIcon, LayoutGrid, Check } from 'lucide-react';

interface QRStylingCustomizerProps {
  value: string;
  onChange?: (options: any) => void;
  initialOptions?: any;
}

export default function QRStylingCustomizer({ value, onChange, initialOptions }: QRStylingCustomizerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrStylingInstance = useRef<any>(null);

  // Styling States
  const [dotType, setDotType] = useState(initialOptions?.dotsOptions?.type || 'rounded');
  const [dotColor, setDotColor] = useState(initialOptions?.dotsOptions?.color || '#0A0F05');
  const [bgColor, setBgColor] = useState(initialOptions?.backgroundOptions?.color || '#FFFFFF');
  const [cornerSquareType, setCornerSquareType] = useState(initialOptions?.cornersSquareOptions?.type || 'extra-rounded');
  const [cornerSquareColor, setCornerSquareColor] = useState(initialOptions?.cornersSquareOptions?.color || '#0A0F05');
  const [cornerDotType, setCornerDotType] = useState(initialOptions?.cornersDotOptions?.type || 'dot');
  const [cornerDotColor, setCornerDotColor] = useState(initialOptions?.cornersDotOptions?.color || '#00D9FF');
  
  // Gradient state
  const [useGradient, setUseGradient] = useState(!!initialOptions?.dotsOptions?.gradient);
  const [gradientColor1, setGradientColor1] = useState(initialOptions?.dotsOptions?.gradient?.colorStops?.[0]?.color || '#0A0F05');
  const [gradientColor2, setGradientColor2] = useState(initialOptions?.dotsOptions?.gradient?.colorStops?.[1]?.color || '#00D9FF');

  // Logo state
  const [logoFile, setLogoFile] = useState<string | null>(initialOptions?.image || null);
  const [logoSize, setLogoSize] = useState(initialOptions?.imageOptions?.imageSizeFactor || 0.4);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pattern' | 'colors' | 'logo'>('pattern');

  // Load and instantiate qr-code-styling client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initQR = async () => {
      const QRCodeStyling = (await import('qr-code-styling')).default;

      // Base configuration
      const options = getQRConfig();
      const qrCode = new QRCodeStyling(options);
      
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
      }
      
      qrStylingInstance.current = qrCode;
    };

    initQR();
  }, [value, dotType, dotColor, bgColor, cornerSquareType, cornerSquareColor, cornerDotType, cornerDotColor, useGradient, gradientColor1, gradientColor2, logoFile, logoSize]);

  // Construct options dictionary
  const getQRConfig = () => {
    const dotsOptions: any = {
      type: dotType
    };

    if (useGradient) {
      dotsOptions.gradient = {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 }
        ]
      };
    } else {
      dotsOptions.color = dotColor;
    }

    return {
      width: 260,
      height: 260,
      type: 'svg' as any,
      data: value || 'https://getcardqr.com',
      image: logoFile || undefined,
      dotsOptions,
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: cornerSquareColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: cornerDotColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSizeFactor: logoSize,
        margin: 5
      }
    };
  };

  // Sync to parent component
  useEffect(() => {
    if (onChange) {
      onChange(getQRConfig());
    }
  }, [dotType, dotColor, bgColor, cornerSquareType, cornerSquareColor, cornerDotType, cornerDotColor, useGradient, gradientColor1, gradientColor2, logoFile, logoSize]);

  // Handle Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoFile(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    if (!qrStylingInstance.current) return;
    await qrStylingInstance.current.download({
      name: `cardqr-code`,
      extension: format
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start">
      {/* Live QR Output Display (Sticky/Centered on side) */}
      <div className="boxy w-full md:w-[300px] flex flex-col items-center justify-center p-6 bg-surface rounded-none shrink-0">
        <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-4">Live Styled QR</span>
        
        {/* Render Container */}
        <div className="bg-white p-4 rounded-none flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <div ref={qrRef} className="w-[260px] h-[260px] rounded-none overflow-hidden flex items-center justify-center" />
        </div>

        {/* Quick format download buttons */}
        <div className="w-full mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDownload('png')}
            className="h-9 text-[10px] font-bold bg-surface-2 hover:bg-surface-2/70 text-primary rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/5"
          >
            <Download className="w-3 h-3 text-cyan" /> PNG
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="h-9 text-[10px] font-bold bg-surface-2 hover:bg-surface-2/70 text-primary rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/5"
          >
            <Download className="w-3 h-3 text-accent" /> SVG
          </button>
          <button
            onClick={() => handleDownload('jpeg')}
            className="h-9 text-[10px] font-bold bg-surface-2 hover:bg-surface-2/70 text-primary rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/5"
          >
            <Download className="w-3 h-3 text-emerald-400" /> JPG
          </button>
        </div>
      </div>

      {/* Editor Panel Controls */}
      <div className="boxy flex-1 w-full bg-surface rounded-none p-5">
        {/* Tab Controls */}
        <div className="flex border-b border-white/5 mb-5">
          <button
            onClick={() => setActiveTab('pattern')}
            className={`flex-1 pb-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pattern' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Pattern & Shapes
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 pb-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'colors' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Color Palette
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex-1 pb-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'logo' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Logo Center
          </button>
        </div>

        {/* Tab Contents: Pattern */}
        {activeTab === 'pattern' && (
          <div className="space-y-4">
            {/* Dots type */}
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">QR Code Pattern style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'classy', label: 'Classy' },
                  { id: 'classy-rounded', label: 'Elegant' },
                  { id: 'square', label: 'Square' },
                  { id: 'extra-rounded', label: 'Organic' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDotType(item.id)}
                    className={`h-9 px-2 text-[10px] font-bold rounded-none border transition-all cursor-pointer ${
                      dotType === item.id 
                        ? 'border-accent bg-accent/10 text-primary' 
                        : 'border-white/5 bg-surface-2 text-muted-text hover:text-primary hover:border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner square shapes */}
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Corner Square style</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'dot', label: 'Dot' },
                  { id: 'extra-rounded', label: 'Rounded' },
                  { id: 'out-rounded', label: 'Organic' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCornerSquareType(item.id)}
                    className={`h-9 px-1 text-[9px] font-bold rounded-none border transition-all cursor-pointer ${
                      cornerSquareType === item.id 
                        ? 'border-accent bg-accent/10 text-primary' 
                        : 'border-white/5 bg-surface-2 text-muted-text hover:text-primary hover:border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner dots shapes */}
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Corner Dot style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'dot', label: 'Dot' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCornerDotType(item.id)}
                    className={`h-9 text-[10px] font-bold rounded-none border transition-all cursor-pointer ${
                      cornerDotType === item.id 
                        ? 'border-accent bg-accent/10 text-primary' 
                        : 'border-white/5 bg-surface-2 text-muted-text hover:text-primary hover:border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: Colors */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Color Gradient Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-surface-2 rounded-none border border-white/5">
              <span className="text-xs font-bold text-primary">Use Dot Gradient Color</span>
              <input
                type="checkbox"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent border-white/10 bg-black cursor-pointer"
              />
            </div>

            {/* Foreground colors */}
            {!useGradient ? (
              <div>
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Dots Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="w-10 h-10 border-0 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Gradient Start</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="w-8 h-8 border-0 rounded bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="flex-1 h-8 px-2 text-[10px] bg-surface-2 border border-white/5 rounded-none text-primary font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Gradient End</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="w-8 h-8 border-0 rounded bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="flex-1 h-8 px-2 text-[10px] bg-surface-2 border border-white/5 rounded-none text-primary font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Corner custom colors */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Corner Frame</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={cornerSquareColor}
                    onChange={(e) => setCornerSquareColor(e.target.value)}
                    className="w-8 h-8 border-0 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={cornerSquareColor}
                    onChange={(e) => setCornerSquareColor(e.target.value)}
                    className="flex-1 h-8 px-2 text-[10px] bg-surface-2 border border-white/5 rounded-none text-primary font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Corner Center</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={cornerDotColor}
                    onChange={(e) => setCornerDotColor(e.target.value)}
                    className="w-8 h-8 border-0 rounded bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={cornerDotColor}
                    onChange={(e) => setCornerDotColor(e.target.value)}
                    className="flex-1 h-8 px-2 text-[10px] bg-surface-2 border border-white/5 rounded-none text-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Background colors */}
            <div className="border-t border-white/5 pt-4">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Background Color (Usually White or Transparent)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 border-0 rounded bg-transparent cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: Logo */}
        {activeTab === 'logo' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Embed Logo Icon in Center</label>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <label className="h-10 px-4 bg-accent hover:brightness-110 text-accent-foreground rounded-none flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoFile && (
                    <button
                      onClick={() => setLogoFile(null)}
                      className="h-10 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-none flex items-center justify-center gap-1.5 text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {logoFile && (
                  <div className="border border-white/5 p-4 rounded-none bg-surface-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={logoFile} alt="Preview Logo" className="w-10 h-10 rounded border border-white/10 bg-white object-contain shrink-0" />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-primary block">Embedded Logo Properties</span>
                        <span className="text-[9px] text-muted-text block">Rendered in the center of the QR</span>
                      </div>
                    </div>

                    {/* Logo sizing selector */}
                    <div>
                      <label className="text-[9px] font-bold text-muted-text uppercase tracking-widest block mb-1">Logo Size scale</label>
                      <div className="flex gap-2">
                        {[
                          { val: 0.2, label: 'Small' },
                          { val: 0.35, label: 'Medium' },
                          { val: 0.5, label: 'Large (Ensure error correction is high)' }
                        ].map((sz) => (
                          <button
                            key={sz.val}
                            onClick={() => setLogoSize(sz.val)}
                            className={`flex-1 h-8 text-[9px] font-bold rounded-none border transition-all cursor-pointer ${
                              logoSize === sz.val
                                ? 'border-accent bg-accent/10 text-primary'
                                : 'border-white/5 bg-surface-2 text-muted-text'
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
