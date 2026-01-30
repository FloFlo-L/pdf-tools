import type { ReactNode } from 'react';
import Footer from '@/components/footer';
import Navbar from '@/components/nav-bar';

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="my-16 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
