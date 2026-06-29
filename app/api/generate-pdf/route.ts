import jsPDF from 'jspdf';

export async function POST(request: Request) {
  try {
    const { qrPngDataUrl, label, url } = await request.json();

    if (!qrPngDataUrl || typeof qrPngDataUrl !== 'string') {
      return Response.json({ error: 'Missing qrPngDataUrl' }, { status: 400 });
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const qrSize = 120;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = (pageHeight - qrSize) / 2 - 20;
    doc.addImage(qrPngDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setFontSize(18);
    doc.setTextColor(10, 15, 5);
    doc.text(label || 'CardQR Code', pageWidth / 2, qrY + qrSize + 14, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(url || '', pageWidth / 2, pageHeight - 15, { align: 'center' });

    const pdfArrayBuffer = doc.output('arraybuffer');

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cardqr-code.pdf"',
      },
    });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    return Response.json({ error: err.message || 'Failed to generate PDF' }, { status: 500 });
  }
}
