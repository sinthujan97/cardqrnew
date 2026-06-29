'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Upload, Trash2, Palette, Sliders, Image as ImageIcon, LayoutGrid, ShieldCheck, AlertTriangle } from 'lucide-react';
import { FRAME_STYLES, COLOR_PRESETS, ERROR_CORRECTION_LEVELS } from '@/lib/qr-style-presets';
import type { ShapeColorRef, ShapeFrameDef } from '@/lib/qr-style-presets';
import { uploadImageAction } from '@/app/actions/card-actions';

interface QRStylingCustomizerProps {
  value: string;
  onChange?: (options: any) => void;
  initialOptions?: any;
}

const MAX_LOGO_BYTES = 1024 * 1024; // 1MB

// Builds a fresh qr-code-styling instance at the requested size and composites the
// chosen frame onto a canvas. Always re-renders at the target resolution (rather than
// upscaling a smaller canvas) so large exports stay crisp.
export async function renderQRToCanvas(
  config: any,
  opts: { format: 'png' | 'jpeg'; targetSize?: number }
): Promise<HTMLCanvasElement | null> {
  const { format, targetSize } = opts;
  const size = targetSize || config.width || 260;

  const QRCodeStyling = (await import('qr-code-styling')).default;
  const instance = new QRCodeStyling({ ...config, width: size, height: size });
  const rawData = (await instance.getRawData(format)) as Blob | null;
  if (!rawData) return null;

  const blobUrl = URL.createObjectURL(rawData);
  const img = new window.Image();
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.src = blobUrl;
  });

  const frame = config.frame || {};
  const frameMeta = FRAME_STYLES.find((f) => f.id === frame.style) || FRAME_STYLES[0];
  const bgColor = config.backgroundOptions?.color || '#FFFFFF';
  const frameColor = frame.color || '#0A0F05';
  const frameTextColor = frame.textColor || '#FFFFFF';
  const frameText = frame.text || '';

  if (frameMeta.layout === 'shape' && frameMeta.shape) {
    const canvas = renderShapeFrameToCanvas(img, frameMeta.shape, { frameColor, frameTextColor, bgColor, frameText: frameText || frameMeta.defaultText || '' });
    URL.revokeObjectURL(blobUrl);
    return canvas;
  }

  const isFramed = frameMeta.layout !== 'none';
  const isBanner = frameMeta.layout.startsWith('banner');
  const scale = size / 260;
  const padding = 32 * scale;
  const borderW = isFramed ? 6 * scale : 0;
  const bannerH = isBanner ? 56 * scale : 0;

  const canvasW = img.width + padding * 2 + borderW * 2;
  const canvasH = img.height + padding * 2 + borderW * 2 + bannerH;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(blobUrl);
    return null;
  }

  if (isFramed) {
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvasW, canvasH - bannerH);
    ctx.fillStyle = bgColor;
    ctx.fillRect(borderW, borderW, canvasW - borderW * 2, canvasH - borderW * 2 - bannerH);
    ctx.drawImage(img, padding + borderW, padding + borderW, img.width, img.height);
    if (bannerH > 0) {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, canvasH - bannerH, canvasW, bannerH);
      ctx.fillStyle = frameTextColor;
      ctx.font = `bold ${24 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((frameText || 'SCAN ME').toUpperCase(), canvasW / 2, canvasH - bannerH / 2);
    }
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, padding, padding, img.width, img.height);
  }

  URL.revokeObjectURL(blobUrl);
  return canvas;
}

/** Composites a Shape-layout frame (outline + QR + accents + caption) onto a fresh canvas, using
 * the exact same path data the live preview renders, via Path2D instead of <svg><path>. */
function renderShapeFrameToCanvas(
  img: HTMLImageElement,
  shape: ShapeFrameDef,
  opts: { frameColor: string; frameTextColor: string; bgColor: string; frameText: string }
): HTMLCanvasElement | null {
  const { frameColor, frameTextColor, bgColor, frameText } = opts;
  const [, , vbWStr, vbHStr] = shape.viewBox.split(' ');
  const vbW = parseFloat(vbWStr);
  const vbH = parseFloat(vbHStr);
  const scaleFactor = img.width / shape.qrInset.size;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(vbW * scaleFactor);
  canvas.height = Math.round(vbH * scaleFactor);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);

  const resolve = (ref?: ShapeColorRef) => resolveShapeColor(ref, frameColor, bgColor, frameTextColor);

  // 1. Outline silhouette
  ctx.fillStyle = shape.outlineFill === 'background' ? bgColor : frameColor;
  ctx.fill(new Path2D(shape.outlinePath));
  if (shape.outlineStroke) {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2.5;
    ctx.stroke(new Path2D(shape.outlinePath));
  }

  // 2. QR window
  ctx.fillStyle = bgColor;
  ctx.fillRect(shape.qrInset.x, shape.qrInset.y, shape.qrInset.size, shape.qrInset.size);
  ctx.drawImage(img, shape.qrInset.x, shape.qrInset.y, shape.qrInset.size, shape.qrInset.size);

  // 3. Accents (ribbons, spiral dots, handles, banner strips, etc)
  shape.accentPaths?.forEach((a) => {
    const path = new Path2D(a.d);
    if (a.fill) {
      ctx.fillStyle = resolve(a.fill);
      ctx.fill(path);
    }
    if (a.stroke) {
      ctx.strokeStyle = resolve(a.stroke);
      ctx.lineWidth = a.strokeWidth || 2;
      ctx.stroke(path);
    }
  });

  // 4. Caption
  if (shape.bannerText && frameText) {
    ctx.fillStyle = frameTextColor;
    ctx.font = `900 ${shape.bannerText.fontSize || 10}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText.toUpperCase(), shape.bannerText.x, shape.bannerText.y);
  }

  ctx.restore();
  return canvas;
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, format: 'png' | 'jpeg'): string {
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mime, 0.92);
}

// SVG is vector and can't be canvas-composited with a frame — download it directly.
export async function downloadQRDirect(config: any, format: 'svg', filename: string) {
  const QRCodeStyling = (await import('qr-code-styling')).default;
  const instance = new QRCodeStyling(config);
  await instance.download({ name: filename, extension: format });
}

function resolveShapeColor(ref: ShapeColorRef | undefined, frameColor: string, bgColor: string, frameTextColor: string) {
  if (ref === 'frame') return frameColor;
  if (ref === 'background') return bgColor;
  if (ref === 'text') return frameTextColor;
  return 'none';
}

function ShapeFramePreview({
  shape, frameColor, frameTextColor, bgColor, text, qrRef,
}: {
  shape: ShapeFrameDef;
  frameColor: string;
  frameTextColor: string;
  bgColor: string;
  text: string;
  qrRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [, , vbWStr, vbHStr] = shape.viewBox.split(' ');
  const vbW = parseFloat(vbWStr);
  const vbH = parseFloat(vbHStr);
  const pct = (v: number, total: number) => `${(v / total) * 100}%`;
  const resolve = (ref?: ShapeColorRef) => resolveShapeColor(ref, frameColor, bgColor, frameTextColor);

  return (
    <div className="relative" style={{ width: 260, aspectRatio: `${vbW} / ${vbH}` }}>
      <svg viewBox={shape.viewBox} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d={shape.outlinePath}
          fill={shape.outlineFill === 'background' ? bgColor : frameColor}
          stroke={shape.outlineStroke ? frameColor : 'none'}
          strokeWidth={shape.outlineStroke ? 2.5 : 0}
        />
      </svg>

      <div
        className="absolute overflow-hidden flex items-center justify-center"
        style={{
          left: pct(shape.qrInset.x, vbW),
          top: pct(shape.qrInset.y, vbH),
          width: pct(shape.qrInset.size, vbW),
          height: pct(shape.qrInset.size, vbH),
          background: bgColor,
        }}
      >
        <div ref={qrRef} className="w-full h-full" />
      </div>

      <svg viewBox={shape.viewBox} className="absolute inset-0 w-full h-full pointer-events-none">
        {shape.accentPaths?.map((a, i) => (
          <path
            key={i}
            d={a.d}
            fill={a.fill ? resolve(a.fill) : 'none'}
            stroke={a.stroke ? resolve(a.stroke) : 'none'}
            strokeWidth={a.strokeWidth || 0}
          />
        ))}
        {shape.bannerText && text && (
          <text
            x={shape.bannerText.x}
            y={shape.bannerText.y}
            fontSize={shape.bannerText.fontSize || 10}
            fill={frameTextColor}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={900}
            style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  );
}

export default function QRStylingCustomizer({ value, onChange, initialOptions }: QRStylingCustomizerProps) {
  const qrRef = useRef<HTMLDivElement>(null);

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
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>(initialOptions?.dotsOptions?.gradient?.type || 'linear');
  const [gradientColor1, setGradientColor1] = useState(initialOptions?.dotsOptions?.gradient?.colorStops?.[0]?.color || '#0A0F05');
  const [gradientColor2, setGradientColor2] = useState(initialOptions?.dotsOptions?.gradient?.colorStops?.[1]?.color || '#00D9FF');

  // Logo state
  const [logoFile, setLogoFile] = useState<string | null>(initialOptions?.image || null);
  const [logoSize, setLogoSize] = useState(
    initialOptions?.imageOptions?.imageSize ?? initialOptions?.imageOptions?.imageSizeFactor ?? 0.3
  );
  const [hideBackgroundDots, setHideBackgroundDots] = useState<boolean>(initialOptions?.imageOptions?.hideBackgroundDots ?? true);
  const [logoMargin, setLogoMargin] = useState<number>(initialOptions?.imageOptions?.margin ?? 5);
  const [logoBlobUrl, setLogoBlobUrl] = useState<string | null>(initialOptions?.logoBlobUrl || null);
  const [logoUploadError, setLogoUploadError] = useState('');

  // Frame state (open catalog — see lib/qr-style-presets.ts)
  const [frameStyle, setFrameStyle] = useState<string>(initialOptions?.frame?.style || 'none');
  const [frameColor, setFrameColor] = useState(initialOptions?.frame?.color || '#0A0F05');
  const [frameTextColor, setFrameTextColor] = useState(initialOptions?.frame?.textColor || '#FFFFFF');
  const [frameText, setFrameText] = useState(initialOptions?.frame?.text || 'SCAN ME');

  // Error correction
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>(
    initialOptions?.qrOptions?.errorCorrectionLevel || 'M'
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pattern' | 'colors' | 'logo' | 'frame' | 'quality'>('pattern');

  const frameMeta = FRAME_STYLES.find((f) => f.id === frameStyle) || FRAME_STYLES[0];

  // Load and instantiate qr-code-styling client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initQR = async () => {
      const QRCodeStyling = (await import('qr-code-styling')).default;

      const options = getQRConfig();
      const qrCode = new QRCodeStyling(options);

      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
      }
    };

    initQR();
  }, [
    value, dotType, dotColor, bgColor, cornerSquareType, cornerSquareColor, cornerDotType, cornerDotColor,
    useGradient, gradientType, gradientColor1, gradientColor2, logoFile, logoSize, hideBackgroundDots,
    logoMargin, errorCorrectionLevel, frameStyle,
  ]);

  // Construct options dictionary
  const getQRConfig = () => {
    const dotsOptions: any = {
      type: dotType
    };

    if (useGradient) {
      dotsOptions.gradient = {
        type: gradientType,
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
        hideBackgroundDots,
        imageSize: logoSize,
        margin: logoMargin
      },
      qrOptions: {
        errorCorrectionLevel
      },
      frame: {
        style: frameStyle,
        color: frameColor,
        textColor: frameTextColor,
        text: frameText
      },
      logoBlobUrl
    };
  };

  // Sync to parent component
  useEffect(() => {
    if (onChange) {
      onChange(getQRConfig());
    }
  }, [
    dotType, dotColor, bgColor, cornerSquareType, cornerSquareColor, cornerDotType, cornerDotColor,
    useGradient, gradientType, gradientColor1, gradientColor2, logoFile, logoSize, hideBackgroundDots,
    logoMargin, errorCorrectionLevel, frameStyle, frameColor, frameTextColor, frameText, logoBlobUrl,
  ]);

  // Handle Logo upload: instant local preview + background Blob persistence
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploadError('');

    if (file.size > MAX_LOGO_BYTES) {
      setLogoUploadError('Logo must be under 1MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setLogoFile(base64);

      try {
        const res = await uploadImageAction(base64, file.name);
        if (res.success && res.data) {
          setLogoBlobUrl(res.data);
        }
      } catch (err) {
        console.error('Logo Blob upload failed, local preview still active:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoBlobUrl(null);
    setLogoUploadError('');
  };

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg') => {
    if (format === 'svg') {
      await downloadQRDirect(getQRConfig(), 'svg', 'cardqr-code');
      return;
    }
    const canvas = await renderQRToCanvas(getQRConfig(), { format });
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvasToDataUrl(canvas, format);
    a.download = `cardqr-code.${format === 'jpeg' ? 'jpg' : 'png'}`;
    a.click();
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start">
      {/* Live QR Output Display (Sticky/Centered on side) */}
      <div className="boxy w-full md:w-[300px] flex flex-col items-center justify-center p-6 bg-surface rounded-none shrink-0">
        <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-4">Live Styled QR</span>

        {/* Render Container */}
        {frameMeta.layout === 'shape' && frameMeta.shape ? (
          <ShapeFramePreview
            shape={frameMeta.shape}
            frameColor={frameColor}
            frameTextColor={frameTextColor}
            bgColor={bgColor}
            text={frameText || frameMeta.defaultText || ''}
            qrRef={qrRef}
          />
        ) : (
          <div
            className="p-4 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            style={{
              background: bgColor,
              border: frameMeta.layout !== 'none' ? `6px solid ${frameColor}` : 'none',
            }}
          >
            <div ref={qrRef} className="w-[260px] h-[260px] overflow-hidden flex items-center justify-center" />
            {frameMeta.layout.startsWith('banner') && (
              <div
                className="w-[260px] mt-3 py-2.5 text-center text-sm font-black uppercase tracking-wider"
                style={{ background: frameColor, color: frameTextColor }}
              >
                {frameText || frameMeta.defaultText || 'SCAN ME'}
              </div>
            )}
          </div>
        )}

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
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
              activeTab === 'pattern' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pattern &amp; Shapes</span>
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
              activeTab === 'colors' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Palette</span>
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
              activeTab === 'logo' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo Center</span>
          </button>
          <button
            onClick={() => setActiveTab('frame')}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
              activeTab === 'frame' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Frame</span>
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex-1 py-2.5 text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
              activeTab === 'quality' ? 'text-accent border-b-2 border-accent' : 'text-muted-text hover:text-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Error Correction</span>
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
            {/* Quick color presets */}
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Quick Color Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setUseGradient(false);
                      setDotColor(preset.dotColor);
                      setCornerSquareColor(preset.cornerSquareColor);
                      setCornerDotColor(preset.cornerDotColor);
                      setBgColor(preset.bgColor);
                    }}
                    className="h-12 px-2 rounded-none border border-white/5 bg-surface-2 hover:border-white/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full shrink-0 border border-white/10" style={{ background: preset.dotColor }} />
                    <span className="text-[9px] font-bold text-muted-text text-left leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Gradient Type</label>
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setGradientType(t)}
                        className={`flex-1 h-8 text-[10px] font-bold rounded-none border capitalize transition-all cursor-pointer ${
                          gradientType === t ? 'border-accent bg-accent/10 text-primary' : 'border-white/5 bg-surface-2 text-muted-text'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
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
                      accept="image/png,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoFile && (
                    <button
                      onClick={handleRemoveLogo}
                      className="h-10 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-none flex items-center justify-center gap-1.5 text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {logoUploadError && (
                  <div className="p-2.5 rounded-none bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{logoUploadError}</span>
                  </div>
                )}

                {logoFile && (
                  <div className="border border-white/5 p-4 rounded-none bg-surface-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={logoFile} alt="Preview Logo" className="w-10 h-10 rounded border border-white/10 bg-white object-contain shrink-0" />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-primary block">Embedded Logo Properties</span>
                        <span className="text-[9px] text-muted-text block">Rendered in the center of the QR</span>
                      </div>
                    </div>

                    {/* Logo size slider */}
                    <div>
                      <label className="text-[9px] font-bold text-muted-text uppercase tracking-widest block mb-1">
                        Logo Size: {Math.round(logoSize * 100)}%
                      </label>
                      <input
                        type="range"
                        min={0.2}
                        max={0.4}
                        step={0.01}
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                      <p className="text-[9px] text-muted-text mt-1">Larger logos need a higher error correction level (Q or H) to stay scannable.</p>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-surface rounded-none border border-white/5">
                      <span className="text-[10px] font-bold text-primary">Clear background behind logo</span>
                      <input
                        type="checkbox"
                        checked={hideBackgroundDots}
                        onChange={(e) => setHideBackgroundDots(e.target.checked)}
                        className="w-4 h-4 rounded text-accent focus:ring-accent border-white/10 bg-black cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-surface rounded-none border border-white/5">
                      <span className="text-[10px] font-bold text-primary">Add padding around logo</span>
                      <input
                        type="checkbox"
                        checked={logoMargin > 0}
                        onChange={(e) => setLogoMargin(e.target.checked ? 5 : 0)}
                        className="w-4 h-4 rounded text-accent focus:ring-accent border-white/10 bg-black cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents: Frame */}
        {activeTab === 'frame' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Frame Style</label>
              <div className="grid grid-cols-3 gap-2">
                {FRAME_STYLES.map((fs) => {
                  const Icon = fs.icon;
                  return (
                    <button
                      key={fs.id}
                      onClick={() => {
                        setFrameStyle(fs.id);
                        if (fs.defaultText) setFrameText(fs.defaultText);
                      }}
                      className={`h-16 px-2 text-[9px] font-bold rounded-none border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        frameStyle === fs.id
                          ? 'border-accent bg-accent/10 text-primary'
                          : 'border-white/5 bg-surface-2 text-muted-text hover:text-primary hover:border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{fs.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {frameMeta.layout !== 'none' && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Frame Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="flex-1 h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {(frameMeta.layout.startsWith('banner') || (frameMeta.layout === 'shape' && frameMeta.shape?.bannerText)) && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Banner Text</label>
                      <input
                        type="text"
                        value={frameText}
                        onChange={(e) => setFrameText(e.target.value)}
                        placeholder={frameMeta.defaultText || 'SCAN ME'}
                        maxLength={20}
                        className="w-full h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-bold uppercase focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">Banner Text Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={frameTextColor}
                          onChange={(e) => setFrameTextColor(e.target.value)}
                          className="w-10 h-10 border-0 rounded bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={frameTextColor}
                          onChange={(e) => setFrameTextColor(e.target.value)}
                          className="flex-1 h-9 px-3 text-xs bg-surface-2 border border-white/5 rounded-none text-primary font-mono focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab Contents: Error Correction */}
        {activeTab === 'quality' && (
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block mb-2">
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ERROR_CORRECTION_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  title={lvl.tooltip}
                  onClick={() => setErrorCorrectionLevel(lvl.id)}
                  className={`h-12 px-1 text-[10px] font-bold rounded-none border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    errorCorrectionLevel === lvl.id
                      ? 'border-accent bg-accent/10 text-primary'
                      : 'border-white/5 bg-surface-2 text-muted-text hover:text-primary hover:border-white/10'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-text font-semibold leading-relaxed">
              {ERROR_CORRECTION_LEVELS.find((l) => l.id === errorCorrectionLevel)?.tooltip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
