import { type ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 min-h-0 flex flex-col">
        {children}
      </main>
    </div>
  );
};
