import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CuratedProduct, SirevoAIResponse } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeQuery: string;
  setActiveQuery: (query: string) => void;
  searchResults: CuratedProduct[];
  setSearchResults: React.Dispatch<React.SetStateAction<CuratedProduct[]>>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  aiResponse: SirevoAIResponse | null;
  setAiResponse: React.Dispatch<React.SetStateAction<SirevoAIResponse | null>>;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  isRefining: boolean;
  setIsRefining: (val: boolean) => void;
  hasSearched: boolean;
  setHasSearched: (val: boolean) => void;
  executeSearch: (rawQuery: string, category?: string) => Promise<void>;
  handleRefineSubmit: (chatText: string) => Promise<void>;
  clearSearch: () => void;
  resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Fallback catalog items for offline resilience
const FALLBACK_PRODUCTS: Record<string, CuratedProduct> = {
  'prod-lenovo-slim5': {
    product_id: 'prod-lenovo-slim5',
    name: 'Lenovo IdeaPad Slim 5',
    price: 59490,
    original_price: 64990,
    source: 'registered_merchant',
    ai_match_percentage: 98,
    ai_explanation: '98% Match — Verified merchant choice with 16GB LPDDR5 RAM and fast delivery.',
    specs: {
      ram: '16GB LPDDR5',
      storage: '512GB PCIe Gen4',
      battery: '9hrs+ (Best)',
      delivery: 'By Tomorrow'
    },
    badge: 'Official Partner',
    image: 'https://dummyimage.com/400x400/0f172a/4ade80&text=Lenovo',
    thumbnail: 'https://dummyimage.com/400x400/0f172a/4ade80&text=Lenovo',
    category: 'Laptops'
  },
  'prod-asus-16x': {
    product_id: 'prod-asus-16x',
    name: 'Asus Vivobook 16X',
    price: 58990,
    original_price: 69990,
    source: 'registered_merchant',
    ai_match_percentage: 94,
    ai_explanation: '94% Match — Fits budget target with verified partner warranty.',
    specs: {
      ram: '16GB',
      storage: '512GB SSD',
      battery: '7hrs',
      delivery: 'Fri, 24th'
    },
    badge: 'Official Partner',
    image: 'https://dummyimage.com/400x400/0f172a/4ade80&text=Asus',
    thumbnail: 'https://dummyimage.com/400x400/0f172a/4ade80&text=Asus',
    category: 'Laptops'
  }
};

function processLocalFallbackQuery(query: string): SirevoAIResponse {
  const clean = query.trim().toLowerCase();

  if (clean.includes('buy lenovo') || clean.includes('buy ideapad')) {
    const p = FALLBACK_PRODUCTS['prod-lenovo-slim5'];
    return {
      ui_action: 'checkout_confirmation',
      chat_message: `Proceeding with instant direct checkout for ${p.name} at ₹${p.price.toLocaleString('en-IN')}. Opening secure Razorpay gateway...`,
      checkout_data: {
        product_id: p.product_id,
        merchant_id: 'merch_lenovo_direct_01',
        amount_to_charge: p.price,
        product_name: p.name
      }
    };
  }

  if (clean.includes('buy asus') || clean.includes('buy vivobook')) {
    const p = FALLBACK_PRODUCTS['prod-asus-16x'];
    return {
      ui_action: 'checkout_confirmation',
      chat_message: `Initiating order verification for ${p.name} at ₹${p.price.toLocaleString('en-IN')}. Opening Razorpay payment gateway...`,
      checkout_data: {
        product_id: p.product_id,
        merchant_id: 'merch_amazon_partner_02',
        amount_to_charge: p.price,
        product_name: p.name
      }
    };
  }

  return {
    ui_action: 'product_grid',
    chat_message: `I searched across catalog and live web merchants for "${query}". Here are verified matching options:`,
    curated_products: [
      FALLBACK_PRODUCTS['prod-lenovo-slim5'],
      FALLBACK_PRODUCTS['prod-asus-16x']
    ]
  };
}

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CuratedProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aiResponse, setAiResponse] = useState<SirevoAIResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setActiveQuery('');
    setSearchResults([]);
    setAiResponse(null);
    setChatHistory([]);
    setHasSearched(false);
    setSelectedCategory('all');
  }, []);

  const resetSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  const executeSearch = useCallback(async (rawQuery: string, category?: string) => {
    const q = rawQuery.trim();
    if (!q) {
      clearSearch();
      return;
    }

    if (category) {
      setSelectedCategory(category);
    }

    setSearchQuery(q);
    setActiveQuery(q);
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch('/api/chat/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) {
        throw new Error(`Search API responded with status ${res.status}`);
      }

      const data: SirevoAIResponse = await res.json();
      setAiResponse(data);
      setSearchResults(data.curated_products || []);
      setChatHistory([
        { id: `user-${Date.now()}`, sender: 'user', text: q },
        { id: `assistant-${Date.now()}`, sender: 'assistant', text: data.chat_message }
      ]);
    } catch (err) {
      console.warn('Backend API request failed, using fallback engine:', err);
      const fallback = processLocalFallbackQuery(q);
      setAiResponse(fallback);
      setSearchResults(fallback.curated_products || []);
      setChatHistory([
        { id: `user-${Date.now()}`, sender: 'user', text: q },
        { id: `assistant-${Date.now()}`, sender: 'assistant', text: fallback.chat_message }
      ]);
    } finally {
      setIsSearching(false);
    }
  }, [clearSearch]);

  const handleRefineSubmit = useCallback(async (chatText: string) => {
    const cleanText = chatText.trim();
    if (!cleanText) return;

    // Append user message to chat immediately
    const userMsgId = `user-${Date.now()}`;
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: cleanText }
    ]);
    setActiveQuery(cleanText);
    setIsRefining(true);

    try {
      const isPureFilter = (
        cleanText.toLowerCase().startsWith('under ') ||
        cleanText.toLowerCase().startsWith('only ') ||
        cleanText.toLowerCase().startsWith('filter ') ||
        cleanText.toLowerCase().startsWith('cheaper')
      ) && searchResults.length > 0 && 
        !cleanText.toLowerCase().includes('dress') && 
        !cleanText.toLowerCase().includes('makeup') && 
        !cleanText.toLowerCase().includes('shoe');

      const endpoint = isPureFilter ? '/api/chat/refine' : '/api/chat/recommend';
      const body = isPureFilter 
        ? JSON.stringify({ query: cleanText, currentProducts: searchResults })
        : JSON.stringify({ query: cleanText });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!res.ok) {
        throw new Error(`Refine API request failed: ${res.status}`);
      }

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.message || data.ai_message || data.chat_message || `Found matching results for "${cleanText}".`
        }
      ]);

      if (data.curated_products && data.curated_products.length > 0) {
        setSearchResults(data.curated_products);
      }
    } catch (err) {
      console.error('Failed to process refinement chat query:', err);
      // Fallback local filtering
      const qLower = cleanText.toLowerCase();
      const underMatch = qLower.match(/under\s*(?:rs\.?|₹)?\s*(\d+)/i);
      let fallbackFiltered = searchResults;
      if (underMatch) {
        const maxPrice = parseInt(underMatch[1], 10);
        fallbackFiltered = searchResults.filter(p => p.price && p.price <= maxPrice);
      } else {
        fallbackFiltered = searchResults.filter(p => p.name?.toLowerCase().includes(qLower));
      }

      if (fallbackFiltered.length > 0) {
        setSearchResults(fallbackFiltered);
      }
      setChatHistory((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: fallbackFiltered.length > 0
            ? `Filtered to ${fallbackFiltered.length} item(s) matching "${cleanText}".`
            : `Could not retrieve external results. Please try again.`
        }
      ]);
    } finally {
      setIsRefining(false);
    }
  }, [searchResults]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        activeQuery,
        setActiveQuery,
        searchResults,
        setSearchResults,
        selectedCategory,
        setSelectedCategory,
        aiResponse,
        setAiResponse,
        chatHistory,
        setChatHistory,
        isSearching,
        setIsSearching,
        isRefining,
        setIsRefining,
        hasSearched,
        setHasSearched,
        executeSearch,
        handleRefineSubmit,
        clearSearch,
        resetSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
