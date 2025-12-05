import React from 'react';
import { ExternalLink, Info, Search } from 'lucide-react';
import { GroundingSource } from '../types';

interface SourceListProps {
  sources: GroundingSource[];
  keywords: string;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, keywords }) => {
  const encodedKw = encodeURIComponent(keywords);
  const marketLinks = [
    { name: 'eBay', url: `https://www.ebay.com/sch/i.html?_nkw=${encodedKw}&LH_ItemCondition=3000` },
    { name: 'Mercari', url: `https://www.mercari.com/search/?keyword=${encodedKw}` },
    { name: 'Facebook Marketplace', url: `https://www.facebook.com/marketplace/search/?query=${encodedKw}` }
  ];

  return (
    <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-4 text-blue-800">
        <Info className="w-4 h-4" />
        <h4 className="font-semibold text-sm uppercase tracking-wider">Price References & Data</h4>
      </div>
      
      {/* Existing AI Sources */}
      {sources.length > 0 && (
        <div className="mb-5">
            <p className="text-xs text-blue-600 mb-3 font-medium opacity-80">
                AI ANALYZED SOURCES:
            </p>
            <ul className="space-y-2">
                {sources.map((source, index) => {
                  let hostname = source.uri;
                  try {
                    hostname = new URL(source.uri).hostname.replace('www.', '');
                  } catch (e) {}

                  return (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <ExternalLink className="w-3.5 h-3.5 mt-1 text-blue-400 flex-shrink-0" />
                        <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-600 hover:underline truncate"
                        title={source.title}
                        >
                        {source.title || hostname}
                        </a>
                    </li>
                  );
                })}
            </ul>
            <div className="h-px bg-blue-200 mt-4"></div>
        </div>
      )}

      {/* Direct Search Links */}
      <div>
        <p className="text-xs text-blue-600 mb-3 font-medium opacity-80">
            COMPARE PRICES DIRECTLY ON:
        </p>
        <div className="flex flex-col gap-2">
            {marketLinks.map((market) => (
                <a 
                    key={market.name}
                    href={market.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2.5 bg-white rounded-lg border border-blue-200 text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group"
                >
                    <span className="flex items-center gap-2">
                       <Search className="w-3.5 h-3.5 opacity-70" /> {market.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
            ))}
        </div>
      </div>

    </div>
  );
};