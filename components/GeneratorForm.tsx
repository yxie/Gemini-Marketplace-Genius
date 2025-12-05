import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (keywords: string) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [keywords, setKeywords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.trim()) {
      onGenerate(keywords);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            What are you selling?
          </label>
          <div className="relative">
            <input
              id="keywords"
              type="text"
              className="w-full pl-10 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              placeholder="e.g., iPhone 13 Pro Max Blue 128GB with slight scratches"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isLoading}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            <strong>Tip:</strong> Include condition (e.g. "like new", "used"), defects, and model year for the most accurate resale price.
          </p>
        </div>

        <button
          type="submit"
          disabled={!keywords.trim() || isLoading}
          className={`
            group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg
            transition-all duration-300 transform
            ${!keywords.trim() || isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01] hover:shadow-blue-200/50'
            }
          `}
        >
          {isLoading ? (
            'Analyzing Used Market...'
          ) : (
            <>
              Generate Listing <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};