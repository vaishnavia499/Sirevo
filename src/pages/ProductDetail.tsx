import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageRoute, CuratedProduct } from '../types';
import { 
  Sparkles, 
  Check, 
  Zap, 
  ArrowLeftRight, 
  ShoppingCart, 
  Star, 
  ArrowRight, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  ZoomIn, 
  Bell, 
  ShoppingBag 
} from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { useCompare } from '../context/CompareContext';
import { StockAlertModal } from '../components/StockAlertModal';

interface ProductDetailProps {
  onNavigate: (page: PageRoute | string, query?: any) => void;
  selectedProduct?: CuratedProduct | null;
  onAddToCart?: (product: CuratedProduct) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  onNavigate, 
  selectedProduct: propSelectedProduct,
  onAddToCart
}) => {
  const location = useLocation();
  const locationProduct = (location.state as any)?.product as CuratedProduct | undefined;

  const storedProduct = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('sirevo_selected_product');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  // Priority: current navigation state > prop from App state > persisted sessionStorage
  const product: CuratedProduct = useMemo(() => {
    if (locationProduct && locationProduct.product_id) {
      return locationProduct;
    }
    if (propSelectedProduct && propSelectedProduct.product_id) {
      return propSelectedProduct;
    }
    if (storedProduct && storedProduct.product_id) {
      return storedProduct;
    }
    return {
      product_id: 'default-prod',
      name: 'Curated Product',
      price: 0,
      source: 'registered_merchant',
      ai_match_percentage: 95,
      ai_explanation: 'Verified merchant product match.',
      specs: {},
      image: '',
      thumbnail: '',
      category: 'General'
    };
  }, [locationProduct, propSelectedProduct, storedProduct]);

  // Keep sessionStorage aligned with the resolved product
  useEffect(() => {
    if (product && product.product_id && product.product_id !== 'default-prod') {
      try {
        sessionStorage.setItem('sirevo_selected_product', JSON.stringify(product));
      } catch (e) {
        console.warn('Session storage save error:', e);
      }
    }
  }, [product]);

  const [activeThumb, setActiveThumb] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [lastTap, setLastTap] = useState<number>(0);
  const [isInStock, setIsInStock] = useState<boolean>((product as any).in_stock !== false);
  const [isStockAlertOpen, setIsStockAlertOpen] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1800);
  };

  // Synchronize in-stock status and reset active thumb when switching products
  useEffect(() => {
    setIsInStock((product as any).in_stock !== false);
    setActiveThumb(0);
  }, [product.product_id]);

  const { openPurchaseModal } = useCheckout();
  const { addToCompare, isCompared } = useCompare();

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsFullScreen(true);
    }
    setLastTap(now);
  };

  // Dynamic price calculations strictly from product object
  const price = typeof product.price === 'number' 
    ? product.price 
    : (Number(product.price) || 0);

  const originalPrice = product.original_price && Number(product.original_price) > price
    ? Number(product.original_price)
    : (price ? Math.round(price * 1.25) : 0);

  const discountPercent = originalPrice > price 
    ? Math.max(5, Math.round(((originalPrice - price) / originalPrice) * 100))
    : 0;

  // Dynamic category name formatted cleanly
  const categoryName = useMemo(() => {
    const rawCat = (product.category || '').toLowerCase().trim();
    if (rawCat && rawCat !== 'external_web' && rawCat !== 'partner_catalog' && rawCat !== 'general') {
      return rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    }
    const nameLower = (product.name || '').toLowerCase();
    if (nameLower.includes('keyboard') || nameLower.includes('keypad')) return 'Keyboards';
    if (nameLower.includes('headphone') || nameLower.includes('earbuds') || nameLower.includes('earphone') || nameLower.includes('headset') || nameLower.includes('audio')) return 'Audio';
    if (nameLower.includes('shoe') || nameLower.includes('sneaker') || nameLower.includes('air max') || nameLower.includes('footwear') || nameLower.includes('nike')) return 'Footwear';
    if (nameLower.includes('clip') || nameLower.includes('hair') || nameLower.includes('apparel') || nameLower.includes('fashion') || nameLower.includes('dress')) return 'Fashion & Accessories';
    if (nameLower.includes('laptop') || nameLower.includes('notebook') || nameLower.includes('macbook') || nameLower.includes('ideapad') || nameLower.includes('vivobook')) return 'Laptops';
    if (nameLower.includes('sensor') || nameLower.includes('esp32') || nameLower.includes('board') || nameLower.includes('module')) return 'Electronics Components';
    return 'Electronics';
  }, [product.category, product.name]);

  const isRegisteredMerchant = 
    product.source === 'registered_merchant' || 
    product.source === 'AI-Ready Merchant' || 
    product.badge === 'Official Partner';

  const brandOrMerchant = isRegisteredMerchant 
    ? (product.merchant || 'TechStore Partner') 
    : (product.merchant || (product.source === 'external_web' ? 'Web Verified Store' : 'Sirevo Partner'));

  // Sourced product image exclusively rendered across hero and gallery
  const productImage = product.image || product.thumbnail || '';

  // 4 Gallery perspectives dynamically rendering product.image
  const thumbnailPerspectives = useMemo(() => [
    { id: 0, label: 'Primary View', scaleClass: 'scale-100' },
    { id: 1, label: 'Detail View', scaleClass: 'scale-125' },
    { id: 2, label: 'Angle Profile', scaleClass: 'scale-110 -rotate-2' },
    { id: 3, label: 'Full Asset', scaleClass: 'scale-95' }
  ], []);

  // Dynamic specifications mapped strictly from product.specs
  const displaySpecs = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    
    if (product.specs?.processor && product.specs.processor !== 'N/A') {
      list.push({ label: 'Processor', value: product.specs.processor });
    }
    if (product.specs?.ram && product.specs.ram !== 'N/A') {
      list.push({ label: 'RAM / Memory', value: product.specs.ram });
    }
    if (product.specs?.storage && product.specs.storage !== 'N/A') {
      list.push({ label: 'Storage / Source', value: product.specs.storage });
    }
    if (product.specs?.battery && product.specs.battery !== 'N/A') {
      list.push({ label: 'Battery / Rating', value: product.specs.battery });
    }
    if (product.specs?.screen && product.specs.screen !== 'N/A') {
      list.push({ label: 'Screen / Display', value: product.specs.screen });
    }
    if (product.specs?.delivery && product.specs.delivery !== 'N/A') {
      list.push({ label: 'Fulfillment', value: product.specs.delivery });
    }
    if (product.specs?.weight && product.specs.weight !== 'N/A') {
      list.push({ label: 'Weight / Build', value: product.specs.weight });
    }
    if (product.specs?.warranty && product.specs.warranty !== 'N/A') {
      list.push({ label: 'Warranty', value: product.specs.warranty });
    }

    if (list.length < 4) {
      if (!list.some(s => s.label === 'Category')) {
        list.push({ label: 'Category', value: categoryName });
      }
      if (!list.some(s => s.label === 'Merchant')) {
        list.push({ label: 'Merchant / Sourced From', value: brandOrMerchant });
      }
      if (!list.some(s => s.label === 'Fulfillment')) {
        list.push({ label: 'Fulfillment', value: product.specs?.delivery || 'Fast Delivery Available' });
      }
      if (!list.some(s => s.label === 'Protection')) {
        list.push({ label: 'Buyer Protection', value: '7-Day Escrow Guarantee' });
      }
    }
    
    return list;
  }, [product, categoryName, brandOrMerchant]);

  const handleBuyNow = () => {
    openPurchaseModal({
      id: product.product_id,
      title: product.name,
      price: price,
      originalPrice: originalPrice,
      merchant: isRegisteredMerchant ? 'TechStore' : (product.merchant || 'Web Merchant'),
      merchantName: isRegisteredMerchant ? 'TechStore (AI-Ready Merchant)' : (product.merchant || 'Verified Partner'),
      budget: price,
      specs: displaySpecs.map(s => `${s.label}: ${s.value}`).slice(0, 3).join(' • ') || 'Verified Product'
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 pb-28 font-sans -m-4 sm:-m-5 lg:-m-6 p-4 sm:p-6 lg:p-8 relative">
      
      {/* Top Header / Breadcrumb with Working Back Button */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
        <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
          <button 
            id="breadcrumb-back-to-search-btn"
            onClick={() => onNavigate('search')}
            title="Return to search results"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 hover:text-blue-400 cursor-pointer font-semibold py-1 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 shadow-xs hover:border-slate-600 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 capitalize">{categoryName}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400">{brandOrMerchant}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* AI Confidence Match Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1322] border border-slate-800 text-xs font-semibold text-slate-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{product.ai_match_percentage || 95}% AI Match</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. Centered Hero Image Gallery Box */}
        <div className="bg-[#0b101e] border border-slate-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Main Large Display Canvas with Double-Click Full Screen Trigger */}
          <div 
            onDoubleClick={() => setIsFullScreen(true)}
            onTouchEnd={handleTouchEnd}
            className="aspect-[16/9] max-h-[380px] w-full bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden group cursor-zoom-in select-none"
            title="Double-click to expand to full screen"
          >
            {/* Ambient Background Glow on Canvas */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Hover Tooltip / Zoom Indicator */}
            <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 pointer-events-none shadow-lg">
              <ZoomIn className="w-3 h-3 text-blue-400" />
              <span>Double-click to expand</span>
            </div>

            {/* Dynamic Curated Product Visual Canvas exclusively rendering product.image */}
            <div className="relative w-full max-w-lg h-full flex flex-col items-center justify-center p-4">
              <div className="relative transform hover:scale-105 transition-transform duration-300 max-h-[320px] flex items-center justify-center">
                {productImage ? (
                  <img 
                    src={productImage} 
                    alt={product.name} 
                    title={product.name}
                    className={`max-h-[290px] w-auto object-contain drop-shadow-2xl rounded-lg p-2 transition-all duration-300 ${
                      activeThumb === 1 ? 'scale-115' : activeThumb === 2 ? 'scale-105 -rotate-1' : activeThumb === 3 ? 'scale-95' : 'scale-100'
                    }`}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400">
                    <ShoppingBag className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 4 Small Thumbnail Perspectives exclusively rendering product.image and its attributes */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-4">
            {thumbnailPerspectives.map((perspective) => (
              <div 
                key={perspective.id}
                onClick={() => setActiveThumb(perspective.id)}
                className={`aspect-[16/10] bg-[#070b14] rounded-xl border p-2 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                  activeThumb === perspective.id 
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-[#0d1527]' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-full h-full bg-[#0e172a] rounded-lg border border-slate-700/60 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={`${product.name} - ${perspective.label}`} 
                      title={`${product.name} - ${perspective.label}`}
                      className={`w-full h-full object-contain ${perspective.scaleClass} group-hover:scale-105 transition-transform duration-200`} 
                    />
                  ) : (
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-medium mt-1 truncate">{perspective.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* 2. Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Product Info & Specs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title, Badge & Price Container */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/80 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{product.ai_match_percentage || 95}% Match</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice > price && (
                  <span className="text-base sm:text-lg text-slate-500 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/30 text-blue-400 border border-blue-500/40">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Merchant Card */}
            <div className="p-4 bg-[#0c1222] rounded-xl border border-blue-900/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏪</span>
                  <span className="font-bold text-sm text-slate-100">
                    {brandOrMerchant}
                  </span>
                  {isRegisteredMerchant && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInStock(!isInStock)}
                    title="Toggle stock status for demo testing"
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      isInStock 
                        ? 'bg-emerald-950/70 text-emerald-400 border-emerald-600/40 hover:bg-emerald-900/40' 
                        : 'bg-rose-950/70 text-rose-400 border-rose-600/40 hover:bg-rose-900/40'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{isInStock ? 'In Stock' : 'Out of Stock'}</span>
                    <span className="text-[10px] text-slate-400 ml-0.5 opacity-70 underline">(toggle)</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Delivery: <strong className="text-white">{product.specs?.delivery || 'Tomorrow, 10 AM'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>7-Day Replacement Policy & Free Returns via Escrow</span>
                </div>
              </div>

              {!isInStock && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    id="notify-merchant-card-btn"
                    onClick={() => setIsStockAlertOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Bell className="w-4 h-4 animate-bounce text-purple-200" />
                    <span>Notify When Available (Email Alert)</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    We'll email you the second stock is restored.
                  </p>
                </div>
              )}
            </div>

            {/* Key Specifications Box */}
            <div className="p-5 bg-[#0c1222] rounded-xl border border-slate-800/90 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Key Specifications
              </h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
                {displaySpecs.map((spec, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{spec.label}</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <button 
                  onClick={() => onNavigate('compare')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Compare with other products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AI Rationale & Reviews */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* AI Recommendation Card with subtle purple/blue glow */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a163a] via-[#101732] to-[#0c1224] border border-purple-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-sm sm:text-base font-bold text-white mb-3.5 flex items-center gap-2">
                <span>🧠</span>
                <span>Why Sirevo AI recommends this</span>
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{product.ai_explanation || `Top recommendation in ${categoryName} with ${product.ai_match_percentage || 96}% confidence`}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified price point at ₹{price.toLocaleString('en-IN')}</span>
                </li>
                {product.specs?.ram && product.specs.ram !== 'N/A' && (
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.specs.ram}</span>
                  </li>
                )}
                {product.specs?.delivery && (
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{product.specs.delivery}</span>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Autonomous escrow buyer protection with 7-day hassle-free returns</span>
                </li>
              </ul>
            </div>

            {/* Reviews Box */}
            <div className="p-5 bg-[#0c1222] rounded-2xl border border-slate-800/90 shadow-lg space-y-4">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  4.7
                </div>
                <div className="flex items-center gap-1 text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-400">Based on 1,204 customer & benchmark reviews</p>
              </div>

              {/* Progress Bars for Ratings */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 text-slate-400 text-[11px] font-bold">5</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[78%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 w-8 text-right font-mono">78%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 text-slate-400 text-[11px] font-bold">4</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[18%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 w-8 text-right font-mono">18%</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Sticky Bottom Action Bar */}
      <div 
        id="product-detail-sticky-bar"
        className="fixed bottom-0 left-0 right-0 bg-[#090e1a]/95 backdrop-blur-md border-t border-slate-800/90 py-3.5 px-4 sm:px-8 z-40 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: Price & Name */}
          <div className="flex items-baseline gap-2.5 min-w-0">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight shrink-0">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-[140px] sm:max-w-xs font-medium">
              {product.name}
            </span>
          </div>

          {/* Right Side: Compare, Add to Cart, Buy Now */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => addToCompare({
                ...product,
                price: price,
                original_price: originalPrice
              })}
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCompared(product.product_id)
                  ? 'border-purple-500 bg-purple-950/70 text-purple-300 shadow-md shadow-purple-900/30'
                  : 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared(product.product_id) ? 'text-purple-400' : ''}`} />
              <span>{isCompared(product.product_id) ? 'Comparing' : '+ Compare'}</span>
            </button>

            {isInStock ? (
              <>
                <button
                  id="product-detail-add-to-cart-btn"
                  onClick={handleAddToCartClick}
                  className={`px-3 sm:px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isAddedToCart
                      ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-md shadow-emerald-900/30'
                      : 'border-slate-700/60 bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Add to Shopping Cart"
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Buy Now</span>
                </button>
              </>
            ) : (
              <button
                id="notify-when-available-btn"
                onClick={() => setIsStockAlertOpen(true)}
                className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>Notify When Available</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. Full-Screen Modal View */}
      {isFullScreen && (
        <div 
          onClick={() => setIsFullScreen(false)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
            }}
            aria-label="Back to Product Details"
            className="absolute top-6 left-6 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-2 group z-[110] border border-white/15 shadow-2xl backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
            }}
            aria-label="Close"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-[110] border border-white/15 shadow-2xl backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center justify-center select-none"
          >
            <div className="absolute w-[500px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            {productImage ? (
              <img 
                src={productImage} 
                alt={product.name}
                title={product.name}
                className="max-h-[75vh] max-w-[85vw] object-contain drop-shadow-2xl rounded-2xl relative z-10"
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400">
                <ShoppingBag className="w-20 h-20" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. In-Stock Alert Modal */}
      <StockAlertModal
        isOpen={isStockAlertOpen}
        onClose={() => setIsStockAlertOpen(false)}
        product={{
          productId: product.product_id,
          productName: product.name,
          price: price,
          image: productImage,
          thumbnail: product.thumbnail,
          externalLink: product.external_link
        }}
        onRestockSimulated={() => {
          setIsInStock(true);
        }}
      />

    </div>
  );
};

export default ProductDetail;
