'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Check, Copy } from 'lucide-react';

interface QRGeneratorProps {
  value: string;
  size?: number;
  showDownloads?: boolean;
}

export default function QRGenerator({ value, size = 200, showDownloads = true }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1.5,
        color: {
          dark: '#111111',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (error) => {
        if (error) console.error('Error generating QR Code:', error);
      }
    );
  }, [value, size]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cardqr-${value.split('/').pop() || 'code'}.png`;
    link.href = url;
    link.click();
  };

  const downloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(value, {
        type: 'svg',
        margin: 1.5,
        color: {
          dark: '#111111',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `cardqr-${value.split('/').pop() || 'code'}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate SVG:', err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code Canvas Frame */}
      <div className="bg-white p-3 rounded-2xl premium-border shadow-xs flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-xl overflow-hidden" />
      </div>

      {showDownloads && (
        <div className="w-full flex flex-col gap-2">
          {/* Quick Copy Link */}
          <button
            onClick={copyLink}
            className="w-full h-10 px-4 flex items-center justify-between text-xs font-medium bg-surface-2 hover:bg-border-default active:bg-border-emphasis text-primary rounded-xl transition-all"
          >
            <span className="truncate mr-4">{value}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-success font-semibold shrink-0">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-text" />
            )}
          </button>

          {/* Download Formats */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={downloadPNG}
              className="h-10 text-xs font-semibold bg-primary hover:bg-accent active:bg-accent text-background rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
            <button
              onClick={downloadSVG}
              className="h-10 text-xs font-semibold bg-surface hover:bg-surface-2 active:bg-border-default border border-border-default text-primary rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
