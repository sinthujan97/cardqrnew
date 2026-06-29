import { NextRequest, NextResponse } from 'next/server';
import { getQRCodeById, incrementScanCount, getCardBySlug } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Fetch new schema qr_code
    const qrCode = await getQRCodeById(id);
    if (qrCode) {
      // Increment scan count in background (don't block redirect)
      incrementScanCount(id).catch(err => {
        console.error('Failed to increment scan count:', err);
      });

      // Redirect to beautiful public view page
      return NextResponse.redirect(new URL(`/c/${qrCode.slug}`, request.url), 302);
    }

    // 2. Fallback check for old card slug lookup (if id was passed as slug)
    const oldCard = await getCardBySlug(id);
    if (oldCard) {
      return NextResponse.redirect(new URL(`/c/${oldCard.slug}`, request.url), 302);
    }

    // Not found redirect to home
    return NextResponse.redirect(new URL('/', request.url), 302);
  } catch (error) {
    console.error('Scan redirection error:', error);
    return NextResponse.redirect(new URL('/', request.url), 302);
  }
}
