import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PageRoute } from '../types';
import { 
  Sparkles, 
  X, 
  Zap, 
  Check, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Loader2,
  RefreshCw,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { useCompare, Product } from '../context/CompareContext';

interface CompareProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  merchant: string;
  merchantType: 'ai-ready' | 'amazon' | 'flipkart';
  inStock: boolean;
  matchScore: number;
  matchBadge: string;
  matchBadgeClass: string;
  screenSize: string;
  ram: string;
  storage: string;
  batteryLife: string;
  deliverySpeed: string;
  processor: string;
  os: string;
  weight: string;
  warranty: string;
  accentColor: string;
  thumbnail?: string;
  rawSpecs?: Record<string, any>;
}

const initialProducts: CompareProduct[] = [
  {
    id: 'prod-lenovo',
    title: 'Lenovo IdeaPad Slim 5',
    category: 'Laptops',
    price: 59490,
    originalPrice: 74990,
    merchant: 'AI-Ready Merchant',
    merchantType: 'ai-ready',
    inStock: true,
    matchScore: 98,
    matchBadge: '✨ 98% Match',
    matchBadgeClass: 'bg-purple-950/90 text-purple-300 border-purple-700/80',
    screenSize: '15.6" FHD IPS Anti-Glare',
    ram: '16GB LPDDR5',
    storage: '512GB PCIe Gen4',
    batteryLife: '9+ Hours (56.6Wh)',
    deliverySpeed: 'Tomorrow, 10 AM',
    processor: 'Intel Core i5 (12th Gen)',
    os: 'Windows 11 Home',
    weight: '1.77 kg (Slim Chassis)',
    warranty: '1-Year Onsite + ADP',
    accentColor: 'from-blue-600 to-indigo-600',
    thumbnail: ''
  },
  {
    id: 'prod-asus',
    title: 'ASUS Vivobook 15 OLED',
    category: 'Laptops',
    price: 54990,
    originalPrice: 68990,
    merchant: 'Amazon SuperRetail',
    merchantType: 'amazon',
    inStock: true,
    matchScore: 94,
    matchBadge: '💎 94% Match',
    matchBadgeClass: 'bg-blue-950/90 text-blue-300 border-blue-700/80',
    screenSize: '15.6" FHD OLED 600nits',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    batteryLife: '7 Hours (50Wh)',
    deliverySpeed: 'Friday, 24th',
    processor: 'Intel Core i5 (12th Gen)',
    os: 'Windows 11 Home',
    weight: '1.70 kg',
    warranty: '1-Year Manufacturer',
    accentColor: 'from-cyan-600 to-blue-600',
    thumbnail: ''
  },
  {
    id: 'prod-acer',
    title: 'Acer Swift Go 14 AI',
    category: 'Laptops',
    price: 62990,
    originalPrice: 79990,
    merchant: 'Flipkart Electronics',
    merchantType: 'flipkart',
    inStock: true,
    matchScore: 91,
    matchBadge: '⭐ 91% Match',
    matchBadgeClass: 'bg-indigo-950/90 text-indigo-300 border-indigo-700/80',
    screenSize: '14" 2.2K IPS 100% sRGB',
    ram: '16GB LPDDR5X',
    storage: '512GB PCIe Gen4',
    batteryLife: '8.5 Hours (65Wh)',
    deliverySpeed: 'Saturday, 25th',
    processor: 'Intel Core Ultra 5 125H',
    os: 'Windows 11 Home',
    weight: '1.32 kg (Ultra-Light)',
    warranty: '1-Year International',
    accentColor: 'from-purple-600 to-pink-600',
    thumbnail: ''
  }
];

const mapProductToCompare = (item: Product, index: number): CompareProduct => {
  const pId = item.product_id || item.id || `prod-${index}`;
  const pTitle = item.name || item.title || 'Product';
  const price = typeof item.price === 'number' ? item.price : (Number(item.price) || 0);
  const originalPrice = item.original_price || (price > 0 ? Math.round(price * 1.2) : 0);
  const isMerchant = item.source === 'registered_merchant' || item.source === 'AI-Ready Merchant';
  const matchScore = item.ai_match_percentage || 95;

  const accentColors = [
    'from-blue-600 to-indigo-600',
    'from-cyan-600 to-blue-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600'
  ];

  let merchantType: 'ai-ready' | 'amazon' | 'flipkart' = 'ai-ready';
  const sourceLower = (item.source || '').toLowerCase();
  if (sourceLower.includes('amazon')) {
    merchantType = 'amazon';
  } else if (sourceLower.includes('flipkart')) {
    merchantType = 'flipkart';
  } else if (!isMerchant) {
    merchantType = 'amazon';
  }

  const specs = item.specs || {};

  return {
    id: pId,
    title: pTitle,
    category: (item as any).category || specs.category || 'General',
    price: price,
    originalPrice: originalPrice,
    merchant: isMerchant ? 'AI-Ready Merchant' : (item.source || 'Verified Partner'),
    merchantType: merchantType,
    inStock: true,
    matchScore: matchScore,
    matchBadge: `✨ ${matchScore}% Match`,
    matchBadgeClass: matchScore >= 95 
      ? 'bg-purple-950/90 text-purple-300 border-purple-700/80' 
      : 'bg-blue-950/90 text-blue-300 border-blue-700/80',
    screenSize: specs.screen || specs.display || 'N/A',
    ram: specs.ram || 'N/A',
    storage: specs.storage || 'N/A',
    batteryLife: specs.battery || 'N/A',
    deliverySpeed: specs.delivery || 'Fast Delivery',
    processor: specs.processor || 'N/A',
    os: specs.os || 'N/A',
    weight: specs.weight || 'N/A',
    warranty: specs.warranty || 'Standard Warranty',
    accentColor: accentColors[index % accentColors.length],
    thumbnail: item.thumbnail || (item as any).image || '',
    rawSpecs: specs
  };
};

interface ComparePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [cleared, setCleared] = useState(false);
  const { openPurchaseModal } = useCheckout();

  // Dynamic AI Verdict States
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [bestPickName, setBestPickName] = useState<string | null>(null);
  const [isLoadingVerdict, setIsLoadingVerdict] = useState<boolean>(false);
  const [verdictError, setVerdictError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // If compareList has products, use them! If empty and not cleared, use initialProducts
  const products: CompareProduct[] = (compareList.length > 0)
    ? compareList.map(mapProductToCompare)
    : (cleared ? [] : initialProducts);

  // Dynamic spec presence checks to avoid cluttering with N/A for non-tech products
  const hasRam = useMemo(() => products.some(p => p.ram && p.ram !== 'N/A'), [products]);
  const hasStorage = useMemo(() => products.some(p => p.storage && p.storage !== 'N/A'), [products]);
  const hasBattery = useMemo(() => products.some(p => p.batteryLife && p.batteryLife !== 'N/A'), [products]);
  const hasProcessor = useMemo(() => products.some(p => p.processor && p.processor !== 'N/A'), [products]);
  const hasScreen = useMemo(() => products.some(p => p.screenSize && p.screenSize !== 'N/A'), [products]);
  const hasOs = useMemo(() => products.some(p => p.os && p.os !== 'N/A'), [products]);
  const hasWarranty = useMemo(() => products.some(p => p.warranty && p.warranty !== 'N/A' && p.warranty !== 'Standard Warranty'), [products]);

  // Extract any dynamic extra specs from rawSpecs (e.g. material, grip, rating, etc.)
  const extraSpecKeys = useMemo(() => {
    const knownKeys = new Set(['screen', 'display', 'ram', 'storage', 'battery', 'delivery', 'processor', 'os', 'weight', 'warranty', 'category']);
    const keys = new Set<string>();
    products.forEach(p => {
      if (p.rawSpecs) {
        Object.keys(p.rawSpecs).forEach(k => {
          const val = p.rawSpecs![k];
          if (!knownKeys.has(k.toLowerCase()) && val && typeof val === 'string' && val !== 'N/A') {
            keys.add(k);
          }
        });
      }
    });
    return Array.from(keys);
  }, [products]);

  // Fetch dynamic AI verdict from Gemini backend whenever products change
  const fetchVerdict = useCallback(async () => {
    if (products.length === 0) {
      setAiVerdict(null);
      setBestPickName(null);
      setIsLoadingVerdict(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingVerdict(true);
    setVerdictError(null);

    try {
      const payload = {
        products: products.map(p => ({
          id: p.id,
          name: p.title,
          price: p.price,
          originalPrice: p.originalPrice,
          merchant: p.merchant,
          merchantType: p.merchantType,
          matchScore: p.matchScore,
          specs: {
            screen: p.screenSize !== 'N/A' ? p.screenSize : undefined,
            ram: p.ram !== 'N/A' ? p.ram : undefined,
            storage: p.storage !== 'N/A' ? p.storage : undefined,
            battery: p.batteryLife !== 'N/A' ? p.batteryLife : undefined,
            delivery: p.deliverySpeed,
            processor: p.processor !== 'N/A' ? p.processor : undefined,
            os: p.os !== 'N/A' ? p.os : undefined,
            warranty: p.warranty !== 'Standard Warranty' ? p.warranty : undefined,
            ...(p.rawSpecs || {})
          }
        }))
      };

      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`AI Compare returned status ${res.status}`);
      }

      const data = await res.json();
      setAiVerdict(data.verdict || null);
      setBestPickName(data.best_pick_name || null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load AI comparison verdict:', err);
        setVerdictError('Unable to generate AI comparison. Click retry to refresh.');
      }
    } finally {
      setIsLoadingVerdict(false);
    }
  }, [products]);

  // Product signature key to trigger verdict re-evaluation only when items change
  const productKey = useMemo(() => products.map(p => `${p.id}-${p.price}`).join(','), [products]);

  useEffect(() => {
    fetchVerdict();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [productKey, refreshCount, fetchVerdict]);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    if (compareList.length <= 1) {
      setCleared(true);
    }
  };

  const handleClearAll = () => {
    clearCompare();
    setCleared(true);
  };

  const handleReset = () => {
    setCleared(false);
    clearCompare();
    initialProducts.forEach(p => {
      addToCompare({
        product_id: p.id,
        name: p.title,
        price: p.price,
        original_price: p.originalPrice,
        source: p.merchantType === 'ai-ready' ? 'registered_merchant' : p.merchant,
        ai_match_percentage: p.matchScore,
        specs: {
          ram: p.ram,
          storage: p.storage,
          battery: p.batteryLife,
          delivery: p.deliverySpeed,
          screen: p.screenSize,
          processor: p.processor,
          os: p.os,
          weight: p.weight,
          warranty: p.warranty,
          category: p.category
        }
      });
    });
  };

  const handleBuyProduct = (product: CompareProduct) => {
    openPurchaseModal({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      merchant: product.merchant,
      merchantName: `${product.merchant} (${product.merchantType === 'ai-ready' ? 'AI-Ready Merchant' : 'Direct Merchant'})`,
      budget: product.price * 1.1,
      specs: `${product.deliverySpeed} • ${product.merchant}`
    });
  };

  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;

  // Render markdown bold text helper
  const renderFormattedVerdict = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-28 font-sans -m-4 sm:-m-5 lg:-m-6 p-4 sm:p-6 lg:p-8">
      
      {/* 1. Top Header & Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('search')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Back to Search"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compare Products
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side dynamic AI specification benchmarking and pricing analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {products.length < initialProducts.length && (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl border border-blue-800 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Restore Default Set</span>
            </button>
          )}

          {products.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* 2. Dynamic AI Verdict Card */}
        {products.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0b1020] border border-indigo-500/40 shadow-2xl relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-3.5 relative z-10">
              <div className="flex items-start gap-3.5 flex-1">
                <div className={`w-9 h-9 rounded-xl ${isLoadingVerdict ? 'bg-indigo-600/30 border-indigo-400/50 animate-pulse' : 'bg-indigo-500/20 border-indigo-400/30'} border flex items-center justify-center text-indigo-300 shrink-0 mt-0.5 shadow-md`}>
                  {isLoadingVerdict ? (
                    <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <span>Sirevo Intelligence Engine</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isLoadingVerdict ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                    </span>
                    {bestPickName && !isLoadingVerdict && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-bold">
                        ⭐ Top Pick: {bestPickName}
                      </span>
                    )}
                    {isLoadingVerdict && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[10px] font-medium animate-pulse">
                        Analyzing specifications & live values...
                      </span>
                    )}
                  </div>

                  {isLoadingVerdict ? (
                    <div className="space-y-2 py-1">
                      <div className="h-3.5 bg-slate-800/80 rounded animate-pulse w-11/12" />
                      <div className="h-3.5 bg-slate-800/60 rounded animate-pulse w-4/5" />
                    </div>
                  ) : verdictError ? (
                    <div className="flex items-center gap-2 text-xs text-rose-300">
                      <span>{verdictError}</span>
                      <button 
                        onClick={() => setRefreshCount(c => c + 1)} 
                        className="underline hover:text-white cursor-pointer font-semibold ml-1"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      <strong className="text-white font-semibold">AI Verdict:</strong>{' '}
                      {renderFormattedVerdict(aiVerdict || 'Analyzing current product selection...')}
                    </p>
                  )}
                </div>
              </div>

              {/* Refresh analysis button */}
              <button
                onClick={() => setRefreshCount(c => c + 1)}
                disabled={isLoadingVerdict}
                title="Regenerate AI Comparison Verdict"
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-40 shrink-0 self-start mt-0.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingVerdict ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State when All Removed */}
        {products.length === 0 && (
          <div className="p-12 text-center bg-[#0a0f1d] rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No products selected for comparison</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You cleared all products from the matrix. Browse our catalog, search products, or restore the default comparison set.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                Restore Default Set
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back to Search
              </button>
            </div>
          </div>
        )}

        {/* 3. Comparison Matrix */}
        {products.length > 0 && (
          <div className="bg-[#080d1a] rounded-2xl border border-slate-800/90 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                
                {/* STICKY PRODUCT HEADER ROW */}
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0c1222]">
                    <th className="p-4 w-44 sm:w-52 font-semibold text-slate-400 align-bottom">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pb-2">
                        Features & Metrics
                      </span>
                    </th>

                    {products.map(product => (
                      <th 
                        key={product.id}
                        className="p-4 min-w-[220px] sm:min-w-[260px] border-l border-slate-800 align-top relative bg-[#090f1f]"
                      >
                        {/* Remove (X) button */}
                        <button
                          onClick={() => handleRemove(product.id)}
                          aria-label={`Remove ${product.title} from comparison`}
                          className="absolute top-3 right-3 p-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors cursor-pointer z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-3 pt-1">
                          {/* Product Thumbnail Rendering */}
                          <div className="aspect-[16/10] w-full bg-[#050811] rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className={`w-32 h-18 bg-gradient-to-tr ${product.accentColor} opacity-20 rounded-md blur-xl absolute inset-0 m-auto`} />
                            
                            {product.thumbnail ? (
                              <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img 
                                  src={product.thumbnail} 
                                  alt={product.title} 
                                  className="max-h-24 max-w-full object-contain rounded-lg drop-shadow-md"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
                                <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-md mb-1">
                                  <ShoppingBag className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-bold text-slate-300 truncate max-w-[140px]">
                                  {product.title}
                                </span>
                              </div>
                            )}

                            <span className="text-[8px] text-slate-500 font-mono absolute bottom-1.5 right-2">
                              {product.category}
                            </span>
                          </div>

                          {/* Product Title */}
                          <div>
                            <h3 className="font-bold text-sm text-white line-clamp-1" title={product.title}>
                              {product.title}
                            </h3>
                          </div>

                          {/* Price & Merchant Badge */}
                          <div className="space-y-1.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-white">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-xs text-slate-500 line-through">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {product.merchantType === 'ai-ready' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-700/60 text-[10px] font-bold">
                                  <span>🏪 AI-Ready Merchant</span>
                                  <Check className="w-2.5 h-2.5 text-blue-400 stroke-[3]" />
                                </span>
                              ) : product.merchantType === 'amazon' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-700/50 text-[10px] font-semibold">
                                  <span>🛒 Amazon</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 text-sky-300 border border-sky-700/50 text-[10px] font-semibold">
                                  <span>🛍️ Flipkart</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Buy Button */}
                          <button
                            onClick={() => handleBuyProduct(product)}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>Buy Now</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* SPECIFICATIONS ROWS */}
                <tbody className="text-slate-300">
                  
                  {/* Row: AI Match Score */}
                  <tr className="border-b border-slate-800/80 bg-[#090f1f]/50 hover:bg-[#0c1429] transition-colors">
                    <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                      AI Match Score
                    </td>
                    {products.map(p => (
                      <td key={p.id} className="p-3.5 border-l border-slate-800/80 font-semibold">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${p.matchBadgeClass}`}>
                          {p.matchBadge}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Price Difference */}
                  <tr className="border-b border-slate-800/80 bg-[#060a14] hover:bg-[#0c1429] transition-colors">
                    <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                      Price Difference
                    </td>
                    {products.map(p => {
                      const isCheapest = p.price === minPrice;
                      const diff = p.price - minPrice;
                      return (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 font-bold">
                          {isCheapest ? (
                            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                              <span>✓ Lowest Price (₹{p.price.toLocaleString('en-IN')})</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              +₹{diff.toLocaleString('en-IN')} vs lowest
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Delivery Speed */}
                  <tr className="border-b border-slate-800/80 bg-[#090f1f]/50 hover:bg-[#0c1429] transition-colors">
                    <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                      Delivery Speed
                    </td>
                    {products.map(p => (
                      <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-semibold">
                        <span className={p.merchantType === 'ai-ready' ? 'text-blue-400 font-bold' : 'text-slate-300'}>
                          {p.deliverySpeed}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Row: RAM (shown if any product has RAM) */}
                  {hasRam && (
                    <tr className="border-b border-slate-800/80 bg-[#060a14] hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        RAM & Memory
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-semibold">
                          {p.ram}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Storage (shown if any product has Storage) */}
                  {hasStorage && (
                    <tr className="border-b border-slate-800/80 bg-[#090f1f]/50 hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Storage / Capacity
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-semibold">
                          {p.storage}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Battery Life (shown if any product has battery/rating) */}
                  {hasBattery && (
                    <tr className="border-b border-slate-800/80 bg-[#060a14] hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Battery / Longevity
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-semibold">
                          <span className="text-slate-200">
                            {p.batteryLife}
                          </span>
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Processor (shown if any product has processor) */}
                  {hasProcessor && (
                    <tr className="border-b border-slate-800/80 bg-[#090f1f]/50 hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Processor / Chip
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-medium">
                          {p.processor}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Display (shown if any product has screen) */}
                  {hasScreen && (
                    <tr className="border-b border-slate-800/80 bg-[#060a14] hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Display
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-medium">
                          {p.screenSize}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Operating System (shown if any product has OS) */}
                  {hasOs && (
                    <tr className="border-b border-slate-800/80 bg-[#090f1f]/50 hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Operating System
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-medium">
                          {p.os}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Row: Warranty */}
                  {hasWarranty && (
                    <tr className="border-b border-slate-800/80 bg-[#060a14] hover:bg-[#0c1429] transition-colors">
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021]">
                        Warranty & Support
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-slate-300 font-medium">
                          {p.warranty}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Dynamic Custom Specs from rawSpecs (e.g. material, grip, rating, etc.) */}
                  {extraSpecKeys.map((specKey, idx) => (
                    <tr 
                      key={specKey} 
                      className={`border-b border-slate-800/80 ${idx % 2 === 0 ? 'bg-[#090f1f]/50' : 'bg-[#060a14]'} hover:bg-[#0c1429] transition-colors`}
                    >
                      <td className="p-3.5 font-medium text-slate-400 bg-[#0a1021] capitalize">
                        {specKey.replace(/_/g, ' ')}
                      </td>
                      {products.map(p => (
                        <td key={p.id} className="p-3.5 border-l border-slate-800/80 text-white font-medium">
                          {p.rawSpecs?.[specKey] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComparePage;
