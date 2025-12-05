import React, { useState } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ListingEditor } from './components/ListingEditor';
import { generateListingContent } from './services/gemini';
import { GeneratedListing, GroundingSource } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [listing, setListing] = useState<GeneratedListing | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (keywords: string) => {
    setLoading(true);
    setError(null);
    setListing(null);
    setSources([]);
    setSearchKeywords(keywords);

    try {
      const result = await generateListingContent(keywords);
      setListing(result.listing);
      setSources(result.sources);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setListing(null);
    setSources([]);
    setError(null);
    setSearchKeywords("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-8">
          
          {/* Input Section */}
          <div className={`transition-all duration-500 ease-in-out ${listing ? 'hidden md:block md:w-full' : 'w-full max-w-2xl mx-auto'}`}>
             {!listing && (
               <div className="text-center mb-10">
                 <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                   Sell Your Used Stuff Faster
                 </h1>
                 <p className="text-lg text-gray-600">
                   Enter your item details, and our AI will find current <b>resale prices</b> and write a perfect description to help you sell on FB Marketplace.
                 </p>
               </div>
             )}
             
             {!listing && (
                <GeneratorForm onGenerate={handleGenerate} isLoading={loading} />
             )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-blue-600 animate-fade-in">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700">Checking used markets and drafting your post...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Generation Failed</h3>
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm font-medium underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {listing && !loading && (
            <div className="animate-fade-in-up">
              <ListingEditor 
                initialListing={listing} 
                sources={sources} 
                keywords={searchKeywords}
                onReset={handleReset}
              />
            </div>
          )}

        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Marketplace Listing Genius. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;