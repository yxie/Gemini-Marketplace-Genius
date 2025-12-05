import React, { useState, useEffect } from 'react';
import { Copy, Check, ArrowLeft, DollarSign, Type, FileText, Image as ImageIcon, ExternalLink, Info } from 'lucide-react';
import { GeneratedListing, GroundingSource } from '../types';
import { SourceList } from './SourceList';

interface ListingEditorProps {
  initialListing: GeneratedListing;
  sources: GroundingSource[];
  keywords: string;
  onReset: () => void;
}

export const ListingEditor: React.FC<ListingEditorProps> = ({ initialListing, sources, keywords, onReset }) => {
  const [title, setTitle] = useState(initialListing.title);
  const [price, setPrice] = useState(initialListing.price);
  const [description, setDescription] = useState(initialListing.description);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialListing.title);
    setPrice(initialListing.price);
    setDescription(initialListing.description);
  }, [initialListing]);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const CopyButton = ({ text, fieldName }: { text: string, fieldName: string }) => (
    <button
      onClick={() => copyToClipboard(text, fieldName)}
      className="absolute right-2 top-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
      title="Copy to clipboard"
    >
      {copiedField === fieldName ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={onReset}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
          </button>
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            AI Generated Draft
          </span>
        </div>

        {/* Title Field */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            <Type className="w-4 h-4 text-blue-500" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-800"
          />
          <CopyButton text={title} fieldName="title" />
        </div>

        {/* Price Field */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative group">
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              <DollarSign className="w-4 h-4 text-green-500" /> Estimated Price
            </label>
            <div className="relative group/tooltip">
              <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-10 pointer-events-none text-center leading-relaxed">
                Estimate based on sold listings from Mercari, eBay, and FB Marketplace.
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-800"
          />
          <CopyButton text={price} fieldName="price" />
        </div>

        {/* Description Field */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            <FileText className="w-4 h-4 text-purple-500" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={12}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 leading-relaxed"
          />
          <CopyButton text={description} fieldName="description" />
        </div>
      </div>

      {/* Sidebar Info Column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Image Suggestions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
             <ImageIcon className="w-5 h-5 text-indigo-500" />
             <h3 className="font-bold text-gray-800">Official Product Images</h3>
          </div>
          
          {initialListing.imageSuggestions && initialListing.imageSuggestions.length > 0 ? (
             <div className="space-y-3">
               <p className="text-xs text-gray-500 mb-2">
                 The following images were found on official brand websites or retailers:
               </p>
               {initialListing.imageSuggestions.map((url, idx) => (
                 <a 
                   key={idx} 
                   href={url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-blue-600 hover:underline hover:bg-gray-100 transition-colors"
                 >
                   <ExternalLink size={12} className="flex-shrink-0" />
                   <span className="truncate">View Image {idx + 1}</span>
                 </a>
               ))}
             </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No direct official image links found. Please check the sources below for product pages.
            </p>
          )}
        </div>

        {/* Sources List */}
        <SourceList sources={sources} keywords={keywords} />

        {/* Tips Card */}
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
          <h3 className="font-bold text-yellow-800 mb-2">Seller Tips</h3>
          <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
            <li>Take clear, well-lit photos of the actual item.</li>
            <li>Be honest about any defects or scratches.</li>
            <li>Meet buyers in public places for safety.</li>
            <li>Accept cash or secure digital payments only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};