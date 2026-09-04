import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff,
  MoreVertical, 
  SlidersHorizontal, 
  ChevronDown, 
  ArrowLeftRight, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  ShoppingBag, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  X, 
  Lock,
  Radio,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { PageRoute, CuratedProduct, CheckoutData } from '../types';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useSearch } from '../context/SearchContext';
import { startVoiceRecognition } from '../utils/speech';
import { ProductCard } from '../components/ProductCard';
import { StockAlertModal } from '../components/StockAlertModal';

interface SearchPageProps {
  onNavigate: (page: PageRoute) => void;
  initialQuery?: string;
  onViewDetails?: (product: CuratedProduct) => void;
  onAddToCart?: (product: CuratedProduct) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ 
  onNavigate, 
  initialQuery: propInitialQuery,
  onViewDetails,
  onAddToCart
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || location.state?.query || propInitialQuery || '';

  const {
    searchQuery,
    setSearchQuery,
    activeQuery,
    searchResults,
    selectedCategory,
    setSelectedCategory,
    aiResponse,
    chatHistory,
    isSearching,
    isRefining,
    hasSearched,
    executeSearch,
    handleRefineSubmit: contextRefineSubmit,
    clearSearch
  } = useSearch();

  const [inputQuery, setInputQuery] = useState(searchQuery || initialQuery || '');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const { openPurchaseModal } = useCheckout();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { compareList, addToCompare, isCompared } = useCompare();

  // Razorpay Checkout Modal State for 'checkout_confirmation'
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);
  const [activeCheckout, setActiveCheckout] = useState<CheckoutData | null>(null);

  // In-Stock Alert Modal State
  const [stockAlertProduct, setStockAlertProduct] = useState<{
    productId: string;
    productName: string;
    price?: number | null;
    image?: string | null;
    thumbnail?: string | null;
    externalLink?: string | null;
  } | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat area on update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isSearching, isRefining]);

  // When checkout_confirmation action is received, trigger checkout state
  useEffect(() => {
    if (aiResponse?.ui_action === 'checkout_confirmation' && aiResponse.checkout_data) {
      setActiveCheckout(aiResponse.checkout_data);
      setShowRazorpayModal(true);
    }
  }, [aiResponse]);

  // If a new query was passed via router navigation (e.g. from home page), execute it if different from active query
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && initialQuery.trim() !== activeQuery) {
      setInputQuery(initialQuery.trim());
      executeSearch(initialQuery.trim());
    } else if (searchQuery) {
      setInputQuery(searchQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      if (stopVoiceRef.current) stopVoiceRef.current();
    };
  }, []);

  // Submit handler for the left-hand 'Shopping Assistant' chat box for searching and conversational filtering
  const handleRefineSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const chatText = inputQuery.trim();
    if (!chatText) return;

    if (!isAuthenticated) {
      openAuthModal(() => {
        handleRefineSubmit();
      });
      return;
    }

    setInputQuery('');
    await contextRefineSubmit(chatText);
  };

  const handleClearAll = () => {
    setInputQuery('');
    clearSearch();
  };

  const handleVoiceSearchToggle = () => {
    if (isListening) {
      if (stopVoiceRef.current) stopVoiceRef.current();
      setIsListening(false);
      if (inputQuery.trim()) {
        const queryToExecute = inputQuery.trim();
        executeSearch(queryToExecute);
        setInputQuery('');
      }
      return;
    }

    if (!isAuthenticated) {
      openAuthModal(() => handleVoiceSearchToggle());
      return;
    }

    const cleanup = startVoiceRecognition({
      onTranscript: (transcript) => {
        setInputQuery(transcript);
      },
      onListeningChange: (listening) => {
        setIsListening(listening);
      },
      onFinalTranscript: (finalTranscript) => {
        const queryToExecute = finalTranscript.trim();
        if (queryToExecute) {
          setInputQuery(queryToExecute);
          handleRefineSubmit();
        }
      }
    });
    stopVoiceRef.current = cleanup;
  };

  const handleViewDetails = (product: CuratedProduct) => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate('/product-detail', { state: { product } });
    }
  };

  const handleBuyClick = (product: CuratedProduct) => {
    const fullProduct = {
      ...product,
      id: product.product_id,
      title: product.name,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      source: product.source,
      external_link: product.external_link || (product.source === 'external_web' ? 'https://www.google.com/shopping' : undefined),
      merchant: product.source === 'registered_merchant' ? 'TechStore (AI-Ready Partner)' : (product.source || 'External Web Merchant'),
      merchantName: product.source === 'registered_merchant' ? 'TechStore (AI-Ready Partner)' : (product.source || 'External Web Merchant'),
      budget: 60000,
      specs: product.specs ? `${product.specs.ram || ''} • ${product.specs.storage || ''} • ${product.specs.battery || ''}` : ''
    };

    navigate('/checkout', {
      state: {
        product: fullProduct,
        source: fullProduct.source,
        external_link: fullProduct.external_link,
        price: fullProduct.price,
        productName: fullProduct.name,
        productId: fullProduct.product_id,
        merchantName: fullProduct.merchantName,
        budget: 60000,
      }
    });
  };

  const handleAuthorizeAndPay = async () => {
    if (!activeCheckout) return;
    setIsProcessingPayment(true);

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeCheckout.amount_to_charge,
          notes: {
            product_id: activeCheckout.product_id,
            merchant_id: activeCheckout.merchant_id,
            product_name: activeCheckout.product_name
          }
        })
      });

      const orderData = await res.json();
      console.log('Secure Razorpay Order generated:', orderData);
    } catch (e) {
      console.warn('Backend order generation note:', e);
    } finally {
      setIsProcessingPayment(false);
      setShowRazorpayModal(false);
      openPurchaseModal({
        id: activeCheckout.product_id,
        title: activeCheckout.product_name || 'Curated Product',
        price: activeCheckout.amount_to_charge,
        merchant: 'AI-Ready Merchant',
        merchantName: 'TechStore (AI-Ready Merchant)',
        budget: 60000
      });
    }
  };

  // Filter display products by category if selected
  const displayProducts = useMemo(() => {
    if (selectedCategory === 'all') return searchResults;
    return searchResults.filter(p => {
      const cat = (p as any).category || p.specs?.storage || '';
      const name = p.name.toLowerCase();
      const catLower = selectedCategory.toLowerCase();
      return cat.toLowerCase().includes(catLower) || name.includes(catLower);
    });
  }, [searchResults, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto pb-8 relative">
      
      {/* Razorpay Checkout Modal Gate */}
      {showRazorpayModal && activeCheckout && (
        <div 
          id="razorpay-checkout-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#0e1628] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-950/80 via-[#101b33] to-[#0e1628] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Razorpay Secure Checkout</h3>
                  <p className="text-[10px] text-blue-400">Sirevo AI Merchant Gate</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Details Body */}
            <div className="p-6 space-y-4">
              <div className="bg-[#090d18] border border-slate-800/90 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Item:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{activeCheckout.product_name || activeCheckout.product_id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Merchant ID:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{activeCheckout.merchant_id}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300">Total Payable:</span>
                  <span className="text-lg font-bold text-emerald-400">₹{activeCheckout.amount_to_charge.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-snug">
                  Zero-redirect AI checkout token generated for immediate merchant settlement via Razorpay.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  disabled={isProcessingPayment}
                  onClick={handleAuthorizeAndPay}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 fill-white" />
                  )}
                  <span>{isProcessingPayment ? 'Generating Order...' : `Authorize & Pay ₹${activeCheckout.amount_to_charge.toLocaleString('en-IN')}`}</span>
                </button>
                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Grid: Pinned Chat Box (Left) & Results View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Pinned Static Chat Box */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 z-20">
          <div className="flex flex-col h-[calc(100vh-2rem)] rounded-2xl bg-[#0f172a]/60 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Pinned Static Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0 bg-[#0f172a]/90">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-400 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">Shopping Assistant (Gemini AI)</h2>
              </div>
              <div className="flex items-center gap-1.5">
                {hasSearched && (
                  <button
                    onClick={handleClearAll}
                    title="Clear Search & Chat"
                    className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
                <button 
                  aria-label="Options"
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE Conversation Area */}
            <div 
              ref={chatScrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {/* If no search history yet, display a welcoming prompt banner */}
              {chatHistory.length === 0 && (
                <div className="text-center py-10 px-4 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mx-auto shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Ask Sirevo AI Anything</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Search for specific items, ask for budget comparisons, or request instant product filters.
                  </p>
                </div>
              )}

              {/* Dynamic Conversation History */}
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'items-start gap-3'} animate-in fade-in duration-200`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[88%] bg-[#1a243c] border border-slate-700/60 text-slate-100 rounded-2xl rounded-tr-xs px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <>
                      <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-500/50 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-md shadow-blue-600/30">
                        S
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-[#12192c] border border-slate-800/80 text-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-[13px] leading-relaxed space-y-3">
                          <p className="text-slate-300">{msg.text}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Searching / Refining Indicator */}
              {(isSearching || isRefining) && (
                <div className="flex items-start gap-3 pt-2 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-500/50 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-md shadow-blue-600/30">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#12192c] border border-slate-800/80 text-purple-300 rounded-2xl rounded-tl-xs p-3.5 text-xs flex items-center gap-2 font-medium animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400 shrink-0" />
                      <span>{isRefining ? 'Filtering products with Gemini AI...' : 'Searching live inventory & analyzing best matches...'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Listening Indicator when Voice Search is active */}
            {isListening && (
              <div className="px-4 py-2 bg-rose-950/60 border-t border-rose-800/60 flex items-center justify-between text-xs text-rose-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  <span>Listening... Speak your shopping request now</span>
                </div>
                <button
                  type="button"
                  onClick={handleVoiceSearchToggle}
                  className="text-rose-400 hover:text-white text-[11px] underline cursor-pointer"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Pinned Static Search Input */}
            <div className="p-4 bg-[#0f172a] border-t border-slate-800 flex-shrink-0">
              <form onSubmit={handleRefineSubmit} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="search-chat-input"
                    type="text"
                    value={inputQuery}
                    onClick={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                        openAuthModal();
                      }
                    }}
                    onFocus={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                        openAuthModal();
                      }
                    }}
                    onChange={(e) => {
                      if (!isAuthenticated) {
                        openAuthModal();
                        return;
                      }
                      setInputQuery(e.target.value);
                    }}
                    placeholder={isAuthenticated ? "Search or refine (e.g. 'hair clips', 'under 500')..." : "Sign in to chat with AI..."}
                    className="w-full bg-[#1e293b] text-white rounded-xl pl-4 pr-16 py-3 border border-slate-700 focus:outline-hidden focus:border-blue-500 text-xs sm:text-sm placeholder-slate-400"
                  />

                  {/* Clear Button if input has text */}
                  {inputQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => setInputQuery('')}
                      className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Voice Search Button Inside Input */}
                  <button
                    type="button"
                    id="voice-search-mic-btn"
                    onClick={handleVoiceSearchToggle}
                    title={isListening ? "Listening... click to stop" : "Voice Search with AI"}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-500/50'
                        : 'text-slate-400 hover:text-blue-400 hover:bg-slate-700/50'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  aria-label="Submit filter"
                  disabled={!inputQuery.trim() && (isSearching || isRefining)}
                  className={`p-3 rounded-xl text-white transition-all cursor-pointer shrink-0 ${
                    inputQuery.trim()
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isSearching || isRefining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
                {!isAuthenticated && <Lock className="w-3 h-3 text-purple-400 inline" />}
                <span>{isAuthenticated ? 'Connected to Gemini AI & Razorpay Backend.' : 'Authentication required to search products and converse with AI.'}</span>
              </p>
            </div>

          </div>
        </div>

        {/* Right Column: Search Results Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header Bar */}
          <div className="flex flex-col gap-3 bg-[#0d1322]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Curated Picks</h3>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18233c] text-blue-300 text-xs font-semibold border border-blue-900/60">
                    <ChevronDown className="w-3 h-3" />
                    <span>{hasSearched ? (activeQuery ? `Results for "${activeQuery}"` : 'Active Search') : 'Catalog Picks'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {displayProducts.length} recommendation{displayProducts.length === 1 ? '' : 's'} available
                </p>
              </div>

              <div className="flex items-center gap-2">
                {hasSearched && (
                  <button
                    onClick={handleClearAll}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#162035] hover:border-rose-500/60 hover:text-rose-400 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Search</span>
                  </button>
                )}
                <button 
                  onClick={() => onNavigate('compare')}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#162035] hover:border-purple-500 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Compare {compareList.length > 0 ? `(${compareList.length})` : ''}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs border-t border-slate-800/70 pt-2.5">
              {['all', 'electronics', 'fashion', 'beauty', 'audio', 'accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-[#151f38] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton Indicator when searching or refining */}
          {(isSearching || isRefining) && (
            <div id="product-grid-loading-skeleton" className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#0d1322]/90 border border-slate-800 text-center space-y-2">
                <Loader2 className="w-7 h-7 animate-spin text-blue-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  Finding & verifying products with Gemini AI...
                </h4>
                <p className="text-xs text-slate-400">
                  Scanning merchant catalogs, live Google Shopping results, and verified specifications
                </p>
              </div>

              {/* Skeleton Cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0f1628]/90 rounded-2xl border border-slate-800/90 p-5 animate-pulse flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-48 h-36 bg-slate-800/60 rounded-xl shrink-0 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-slate-700" />
                  </div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 bg-slate-800/70 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-800/50 rounded-md w-1/4" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-8 bg-slate-800/40 rounded-lg" />
                      <div className="h-8 bg-slate-800/40 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Curated Products */}
          {!(isSearching || isRefining) && (
            <div className="space-y-4 transition-opacity duration-200 opacity-100">
              
              {displayProducts.length === 0 && (
                <div className="bg-[#0f1628]/90 rounded-2xl border border-slate-800/90 p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-purple-400 mx-auto shadow-md">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="text-base font-bold text-white">
                      {hasSearched ? `No products found for "${activeQuery}"` : "Discover Products with Sirevo AI"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {hasSearched 
                        ? "Try refining your query with different keywords, price targets, or resetting the active category filter."
                        : "Type any shopping need into the assistant on the left, or try one of these popular searches:"}
                    </p>
                  </div>
                  {!hasSearched && (
                    <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                      {['Mechanical Keyboard', 'Hair Clips', 'Wireless Headphones', 'Gaming Mouse'].map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setInputQuery(item);
                            executeSearch(item);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#151f38] hover:bg-purple-900/40 border border-slate-700 hover:border-purple-600/60 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {displayProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onNavigate={onNavigate}
                  onViewDetails={handleViewDetails}
                  onAddToCart={onAddToCart}
                  onBuyClick={handleBuyClick}
                  onAddToCompare={addToCompare}
                  isCompared={isCompared(product.product_id)}
                  onOpenStockAlert={(p) => setStockAlertProduct(p)}
                />
              ))}

            </div>
          )}
        </div>

      </div>

      {/* In-Stock Alert Modal */}
      {stockAlertProduct && (
        <StockAlertModal
          isOpen={!!stockAlertProduct}
          onClose={() => setStockAlertProduct(null)}
          product={stockAlertProduct}
        />
      )}
    </div>
  );
};

export default SearchPage;
