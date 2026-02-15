import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-full">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Barrington 220</h1>
            <p className="text-xs text-red-100 uppercase tracking-wider font-medium">Professional Development</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-sm font-medium text-red-100">Choice Session Signup Portal</span>
        </div>
      </div>
    </header>
  );
};
