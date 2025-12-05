import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShoppingBag size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">Marketplace Genius</span>
        </div>
      </div>
    </header>
  );
};