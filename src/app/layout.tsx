import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextSessionProvider } from '@/context/NextSessionProvider';
import { ChannelProvider } from '@/context/ChannelProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Messaging App',
  description: 'Generated by create next app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <NextSessionProvider>
        <ChannelProvider>
          <body className={inter.className}>
            <Navbar />
            {children}
          </body>
        </ChannelProvider>
      </NextSessionProvider>
    </html>
  );
}
