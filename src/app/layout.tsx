import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ConditionalHeader from '@/components/layout/ConditionalHeader';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pacifik Ecommerce | Services',
  description: 'Manage and organize your store services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-soft-gray flex flex-col font-sans">
        <ConditionalHeader />
        <main className="flex-1 w-full mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
