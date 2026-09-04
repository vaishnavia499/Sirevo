import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Search, 
  Scale, 
  ShieldCheck, 
  Target, 
  CheckCircle2,
  Lock,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { PageRoute, NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { startVoiceRecognition } from '../utils/speech';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onNavigate: NavigationHandler;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { executeSearch } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [preparedQuery, setPreparedQuery] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const samplePrompts = [
    'Laptop under ₹80,000',
    'Wireless headphones under ₹5,000',
    'Phone with best camera',
  ];

  const handleInputClickOrFocus = (e: React.MouseEvent | React.FocusEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      openAuthModal(() => {
        // Callback after successful authentication
      });
    }
  };

  const handleHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    executeSearch(query);
    navigate('/search', { state: { initialQuery: query } });
  };

  const handleVoiceSearchToggle = () => {
    if (isListening) {
      if (stopVoiceRef.current) stopVoiceRef.current();
      setIsListening(false);
      return;
    }

    if (!isAuthenticated) {
      openAuthModal(() => handleVoiceSearchToggle());
      return;
    }

    const cleanup = startVoiceRecognition({
      onTranscript: (transcript) => {
        setInputValue(transcript);
      },
      onListeningChange: (listening) => {
        setIsListening(listening);
      },
      onFinalTranscript: (finalTranscript) => {
        const query = finalTranscript.trim();
        if (query) {
          executeSearch(query);
          navigate('/search', { state: { initialQuery: query } });
        }
      }
    });
    stopVoiceRef.current = cleanup;
  };

  useEffect(() => {
    return () => {
      if (stopVoiceRef.current) stopVoiceRef.current();
    };
  }, []);

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (!isAuthenticated) {
      openAuthModal(() => {
        setInputValue(prompt);
        executeSearch(prompt);
        navigate('/search', { state: { initialQuery: prompt } });
      });
      return;
    }
    executeSearch(prompt);
    navigate('/search', { state: { initialQuery: prompt } });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8 px-2 sm:px-4">
      {/* Top Main Hero Heading & Subtitle */}
      <div className="text-center space-y-3 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/40 text-purple-300 text-xs font-semibold mb-1 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Sirevo AI Shopping Assistant</span>
          {isAuthenticated && user && (
            <span className="ml-1 pl-2 border-l border-purple-700/60 text-purple-200">
              Welcome, {user.name} ({user.role === 'merchant' ? 'Merchant' : 'Customer'})
            </span>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Shop smarter with AI
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto leading-relaxed">
          Tell me what you need. I'll find, compare and recommend the right product.
        </p>
      </div>

      {/* AI Search & Query Bar Container */}
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <form 
          onSubmit={handleHomeSubmit}
          className="bg-[#111726]/90 backdrop-blur-md rounded-2xl border border-slate-700/60 p-2 sm:p-2.5 flex items-center gap-3 shadow-2xl focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all relative"
        >
          {/* Sparkles Icon */}
          <div className="pl-2.5 text-blue-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400 fill-blue-400/20" />
          </div>

          {/* Text Input with Access Control Interception */}
          <input
            id="home-ai-input"
            type="text"
            value={inputValue}
            onClick={handleInputClickOrFocus}
            onFocus={handleInputClickOrFocus}
            onChange={(e) => {
              if (!isAuthenticated) {
                openAuthModal();
                return;
              }
              setInputValue(e.target.value);
            }}
            placeholder="Tell me what you need to shop for..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-hidden cursor-pointer sm:cursor-text"
          />

          {!isAuthenticated && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-purple-400 font-medium bg-purple-950/60 border border-purple-800/40 px-2.5 py-1 rounded-lg shrink-0">
              <Lock className="w-3 h-3" /> Login to Search
            </span>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            id="home-voice-search-btn"
            onClick={handleVoiceSearchToggle}
            title={isListening ? "Listening... click to stop" : "Voice Search with AI"}
            className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 animate-pulse text-white" />
            ) : (
              <Mic className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Send Button */}
          <button
            id="home-ai-send-btn"
            type="submit"
            disabled={!inputValue.trim()}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              inputValue.trim()
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        {/* Listening notification indicator */}
        {isListening && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400 animate-spin" />
              <span className="font-semibold">Listening to your voice...</span>
              <span className="text-slate-300 italic">Say your shopping request clearly</span>
            </div>
            <button
              type="button"
              onClick={handleVoiceSearchToggle}
              className="text-rose-300 hover:text-white underline text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`sample-prompt-${idx}`}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="px-4 py-1.5 rounded-full bg-[#101726]/90 border border-blue-900/60 hover:border-blue-500/80 hover:bg-[#152038] text-slate-300 text-xs font-normal transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              {!isAuthenticated && <Lock className="w-3 h-3 text-purple-400" />}
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Prepared Query Interface Banner if user sent */}
        {preparedQuery && (
          <div 
            id="prepared-query-indicator"
            className="mt-3 p-3 rounded-xl bg-blue-950/60 border border-blue-600/40 text-xs text-blue-200 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Query prepared for Step 2: </span>
              <span className="italic">"{preparedQuery}"</span>
            </div>
          </div>
        )}
      </div>

      {/* "How Sirevo works" section */}
      <div className="w-full max-w-4xl mx-auto mt-16 sm:mt-20">
        <h2 className="text-center text-sm sm:text-base font-bold text-white mb-8">
          How Sirevo works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('search')}
            className="bg-[#111726]/80 hover:bg-[#141b2e] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-start min-h-[170px]"
          >
            <div className="w-9 h-9 rounded-full bg-[#16223d] border border-blue-900/60 text-blue-400 flex items-center justify-center mb-3">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2">
              Search multiple sources
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We scour the web to find all available options across top retailers.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('compare')}
            className="bg-[#111726]/80 hover:bg-[#141b2e] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-start min-h-[170px]"
          >
            <div className="w-9 h-9 rounded-full bg-[#16223d] border border-blue-900/60 text-blue-400 flex items-center justify-center mb-3">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2">
              Compare products
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Side-by-side spec comparisons and price analysis.
            </p>
          </div>

          {/* Card 3 - Highlighted match */}
          <div 
            onClick={() => onNavigate('ai-history')}
            className="bg-[#152038] hover:bg-[#182644] border border-blue-600/60 rounded-2xl p-5 text-center shadow-lg shadow-blue-950/40 transition-all cursor-pointer flex flex-col items-center justify-start min-h-[170px]"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 flex items-center justify-center mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2">
              Recommend best match
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              AI tailored suggestions based on your exact needs.
            </p>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('orders')}
            className="bg-[#111726]/80 hover:bg-[#141b2e] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-start min-h-[170px]"
          >
            <div className="w-9 h-9 rounded-full bg-[#16223d] border border-blue-900/60 text-blue-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-2">
              Buy securely
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Direct links to trusted sellers for a seamless checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
