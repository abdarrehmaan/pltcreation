import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'PLT Creation — Premium Women\'s Ethnic Wear',
    template: '%s | PLT Creation',
  },
  description:
    'Discover PLT Creation\'s exquisite collection of Chikankari, Kurtis, Co-ord Sets, Stitched & Unstitched Suits. Premium ethnic fashion for the modern woman.',
  keywords: [
    'ethnic wear', 'women fashion', 'chikankari', 'kurtis', 'co-ord sets',
    'stitched suits', 'unstitched suits', 'hifza', 'indian ethnic wear',
  ],
  authors: [{ name: 'PLT Creation' }],
  creator: 'PLT Creation',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'PLT Creation',
    title: 'PLT Creation — Premium Women\'s Ethnic Wear',
    description: 'Exquisite ethnic fashion — Chikankari, Kurtis, Co-ord Sets & More.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLT Creation — Premium Women\'s Ethnic Wear',
    description: 'Exquisite ethnic fashion — Chikankari, Kurtis, Co-ord Sets & More.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'var(--font-inter)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C4748A', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
