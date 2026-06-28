import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SiteNav from '@/components/SiteNav';

// Custom markdown compiler to render HTML matching the stationery theme
function compileMarkdown(markdown: string): string {
  let html = markdown.replace(/\r\n/g, '\n');

  // Convert bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" class="text-accent hover:underline font-semibold">${text}</a>`;
  });

  const lines = html.split('\n');
  let result = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inList) {
        result += listType === 'ul' ? '</ul>\n' : '</ol>\n';
        inList = false;
        listType = null;
      }
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; inList = false; listType = null; }
      result += `<h1 class="text-2xl md:text-3xl font-heading font-medium text-primary mt-8 mb-4 border-b border-border-default pb-2">${line.slice(2)}</h1>\n`;
    } else if (line.startsWith('## ')) {
      if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; inList = false; listType = null; }
      result += `<h2 class="text-lg md:text-xl font-heading font-medium text-primary mt-8 mb-3">${line.slice(3)}</h2>\n`;
    } else if (line.startsWith('### ')) {
      if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; inList = false; listType = null; }
      result += `<h3 class="text-base font-heading font-medium text-primary mt-6 mb-2">${line.slice(4)}</h3>\n`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; }
        result += '<ul class="list-disc pl-5 my-4 space-y-1.5 text-xs md:text-sm text-muted-text font-medium">\n';
        inList = true;
        listType = 'ul';
      }
      result += `<li>${line.slice(2)}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; }
        result += '<ol class="list-decimal pl-5 my-4 space-y-1.5 text-xs md:text-sm text-muted-text font-medium">\n';
        inList = true;
        listType = 'ol';
      }
      const match = line.match(/^\d+\.\s(.*)$/);
      result += `<li>${match ? match[1] : line}</li>\n`;
    } else {
      if (inList) { result += listType === 'ul' ? '</ul>\n' : '</ol>\n'; inList = false; listType = null; }
      result += `<p class="text-xs md:text-sm text-muted-text leading-relaxed my-4 font-medium">${line}</p>\n`;
    }
  }

  if (inList) {
    result += listType === 'ul' ? '</ul>\n' : '</ol>\n';
  }

  return result;
}

function getPageData(slug: string) {
  const filenameMap: Record<string, string> = {
    'privacy-policy': 'privacy-policy.md',
    'terms-of-service': 'terms-of-service.md',
    'contact': 'contact-support.md',
    'about': 'about-cardqr.md',
    'wifi-qr-code-generator': 'blog-wifi-qr-code-generator.md',
    'qr-code-menu-maker': 'blog-qr-code-menu-maker.md',
    'digital-business-card-maker': 'blog-digital-business-card-maker.md',
  };

  const filename = filenameMap[slug];
  if (!filename) return null;

  try {
    const filePath = path.join(process.cwd(), 'content', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter metadata
    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    let title = '';
    let description = '';
    let content = fileContent;

    if (match) {
      content = match[2];
      const yamlLines = match[1].split('\n');
      yamlLines.forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim();
          const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (key === 'title') title = value;
          if (key === 'meta-description') description = value;
        }
      });
    } else {
      const h1Match = fileContent.match(/^# (.*)$/m);
      title = h1Match ? h1Match[1] : slug.replace(/-/g, ' ');
      description = `Read about ${title} on CardQR.`;
    }

    return {
      title,
      description,
      contentHtml: compileMarkdown(content),
    };
  } catch (e) {
    console.error(`Error reading markdown for slug ${slug}:`, e);
    return null;
  }
}

export async function generateStaticParams() {
  return [
    { slug: 'privacy-policy' },
    { slug: 'terms-of-service' },
    { slug: 'contact' },
    { slug: 'about' },
    { slug: 'wifi-qr-code-generator' },
    { slug: 'qr-code-menu-maker' },
    { slug: 'digital-business-card-maker' },
  ];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getPageData(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://getcardqr.com/${slug}`
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://getcardqr.com/${slug}`,
      images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['https://getcardqr.com/og-image.png'],
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getPageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary selection:bg-accent selection:text-white">
      <SiteNav />

      {/* Main Container */}
      <main className="flex-1 py-12 md:py-16 max-w-3xl mx-auto w-full px-6 flex flex-col gap-6">
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-text hover:text-accent font-mono uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Homepage
          </Link>
        </div>

        <article className="bg-surface paper-grain p-8 md:p-12 rounded-3xl border border-border-default shadow-2xs">
          <div 
            className="prose max-w-none prose-stone prose-sm md:prose-base leading-relaxed text-muted-text"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        </article>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-default text-xs text-muted-text bg-surface">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-primary text-sm font-heading">CardQR</span>
              <span className="text-[10px]">© 2026 CardQR Inc.</span>
            </div>
            <p className="text-[10px] text-muted-text/80 leading-relaxed font-medium">
              Create premium, native-feeling mobile cards linked to custom QR codes in seconds.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2 min-w-[100px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Company</span>
              <Link href="/about" className="hover:text-accent transition-all font-semibold text-[11px]">About Us</Link>
              <Link href="/contact" className="hover:text-accent transition-all font-semibold text-[11px]">Contact Support</Link>
            </div>
            <div className="flex flex-col gap-2 min-w-[100px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Legal</span>
              <Link href="/terms-of-service" className="hover:text-accent transition-all font-semibold text-[11px]">Terms of Service</Link>
              <Link href="/privacy-policy" className="hover:text-accent transition-all font-semibold text-[11px]">Privacy Policy</Link>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Guides & Resources</span>
              <Link href="/wifi-qr-code-generator" className="hover:text-accent transition-all font-semibold text-[11px]">WiFi QR Generator Guide</Link>
              <Link href="/qr-code-menu-maker" className="hover:text-accent transition-all font-semibold text-[11px]">QR Code Menu Maker</Link>
              <Link href="/digital-business-card-maker" className="hover:text-accent transition-all font-semibold text-[11px]">Digital Business Card Guide</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
