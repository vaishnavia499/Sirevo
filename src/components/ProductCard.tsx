import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Clock, 
  Zap, 
  ArrowLeftRight, 
  ExternalLink,
  Bell,
  ShoppingCart,
  Check
} from 'lucide-react';
import { CuratedProduct, PageRoute } from '../types';

export interface ProductCardProps {
  product: CuratedProduct;
  onNavigate: (page: PageRoute) => void;
  onViewDetails?: (product: CuratedProduct) => void;
  onAddToCart?: (product: CuratedProduct) => void;
  onBuyClick: (product: CuratedProduct) => void;
  onAddToCompare: (product: CuratedProduct) => void;
  isCompared: boolean;
  onOpenStockAlert?: (product: {
    productId: string;
    productName: string;
    price?: number | null;
    image?: string | null;
    thumbnail?: string | null;
    externalLink?: string | null;
  }) => void;
  initialInStock?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onViewDetails,
  onAddToCart,
  onBuyClick,
  onAddToCompare,
  isCompared,
  onOpenStockAlert,
  initialInStock = true
}) => {
  const [isInStock, setIsInStock] = useState<boolean>(
    (product as any).in_stock !== undefined ? (product as any).in_stock : initialInStock
  );
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1800);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      onNavigate('product-detail', product);
    }
  };

  const isRegisteredMerchant = 
    product.source === 'registered_merchant' || 
    product.source === 'AI-Ready Merchant' || 
    product.badge === 'Official Partner';

  const handleNotifyClick = () => {
    if (onOpenStockAlert) {
      onOpenStockAlert({
        productId: product.product_id,
        productName: product.name,
        price: product.price,
        image: product.image,
        thumbnail: product.thumbnail,
        externalLink: product.external_link
      });
    }
  };

  return (
    <div 
      id={`product-card-${product.product_id}`}
      className="bg-[#0f1628]/90 rounded-2xl border border-slate-800/90 p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-5"
    >
      {/* Product Visual & Source / Stock Badges */}
      <div 
        onClick={handleViewDetails}
        className={`w-full sm:w-48 h-36 bg-[#070b14] rounded-xl border ${isRegisteredMerchant ? 'border-emerald-900/40' : 'border-slate-800'} flex items-center justify-center relative overflow-hidden shrink-0 group cursor-pointer`}
      >
        {/* Source Badge */}
        {isRegisteredMerchant ? (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 shadow-xs z-10">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Official Partner</span>
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-600/80 text-slate-300 text-[10px] font-semibold flex items-center gap-1 shadow-xs z-10">
            <ShoppingBag className="w-2.5 h-2.5 text-slate-400" />
            <span>Available on Web</span>
          </div>
        )}

        {/* Stock Status Interactive Toggle Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsInStock(!isInStock);
          }}
          title="Click to toggle in-stock / out-of-stock"
          className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer z-10 flex items-center gap-1 shadow-sm ${
            isInStock
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/60 hover:bg-rose-900/80 animate-pulse'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span>{isInStock ? 'In Stock' : 'Out of Stock'}</span>
        </button>

        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.name} 
            onError={(e) => {
              const target = e.currentTarget;
              const fallbackLabel = encodeURIComponent((product.name || 'Product').slice(0, 18));
              target.onerror = null;
              target.src = `https://dummyimage.com/400x400/0f172a/38bdf8&text=${fallbackLabel}`;
            }}
            className={`w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200 ${!isInStock ? 'opacity-60 grayscale-[40%]' : ''}`} 
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-indigo-400">
            <ShoppingBag className="w-8 h-8 text-slate-600" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 
              onClick={handleViewDetails}
              className="text-base font-bold text-white tracking-tight cursor-pointer hover:text-blue-400 transition-colors"
            >
              {product.name}
            </h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isRegisteredMerchant ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' : 'bg-slate-800/80 text-slate-300 border border-slate-700'} flex items-center gap-1 shrink-0`}>
              <span>{isRegisteredMerchant ? '💎' : '🌐'}</span> {product.ai_match_percentage || 95}% Match
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-white">₹{product.price ? product.price.toLocaleString('en-IN') : 'Check Offer'}</span>
            {product.original_price && (
              <span className="text-xs text-slate-500 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
            )}
            {!isInStock && (
              <span className="text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60 ml-1">
                Temporarily Unavailable
              </span>
            )}
          </div>
          {product.ai_explanation && (
            <p className="text-xs text-slate-400 mt-1.5 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800/70">
              {product.ai_explanation}
            </p>
          )}
        </div>

        {product.specs && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {product.specs.ram && product.specs.ram !== 'N/A' && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">RAM</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <span className={isRegisteredMerchant ? "text-emerald-400" : "text-blue-400"}>●</span> {product.specs.ram}
                </span>
              </div>
            )}
            {product.specs.storage && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Storage / Source</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <span className="text-slate-400">💽</span> {product.specs.storage}
                </span>
              </div>
            )}
            {product.specs.battery && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Battery / Rating</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {product.specs.battery}
                </span>
              </div>
            )}
            {product.specs.delivery && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Fulfillment</span>
                <span className={`${isRegisteredMerchant ? "text-emerald-300" : "text-blue-400"} font-semibold flex items-center gap-1`}>
                  <Zap className="w-3 h-3 fill-current" /> {product.specs.delivery}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-2 border-t border-slate-800/70 flex items-center gap-2.5">
          <button 
            id={`view-details-btn-${product.product_id}`}
            onClick={handleViewDetails}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-[#141d32] hover:bg-[#19243e] text-xs font-semibold text-slate-200 transition-colors text-center cursor-pointer"
          >
            View Details
          </button>

          {/* Direct External Web Store Link */}
          {product.source === 'external_web' && product.external_link && (
            <a
              href={product.external_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open external merchant listing"
              className="p-2 rounded-xl border border-slate-700 bg-[#141d32] hover:bg-[#19243e] text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Compare Action Button */}
          <button
            id={`compare-btn-${product.product_id}`}
            onClick={() => onAddToCompare(product)}
            title={isCompared ? "In comparison tray" : "Add to comparison"}
            className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCompared
                ? 'border-purple-500 bg-purple-950/70 text-purple-300 shadow-md shadow-purple-900/30'
                : 'border-slate-700 bg-[#141d32] hover:border-purple-500 hover:bg-[#19243e] text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared ? 'text-purple-400' : ''}`} />
            <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
          </button>

          {/* Add to Cart Button */}
          {isInStock && (
            <button
              id={`add-to-cart-btn-${product.product_id}`}
              type="button"
              onClick={handleAddToCartClick}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                isAddedToCart
                  ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-md shadow-emerald-900/30'
                  : 'border-slate-700 bg-[#141d32] hover:bg-slate-800 text-slate-200 hover:text-white'
              }`}
              title="Add to Shopping Cart"
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>
          )}

          {/* In-Stock: Buy Button | Out-of-Stock: Notify When Available */}
          {isInStock ? (
            <button 
              id={`checkout-btn-${product.product_id}`}
              onClick={() => onBuyClick(product)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-blue-900/30 active:scale-[0.98]"
            >
              <span>Buy with Razorpay</span>
              <Zap className="w-3 h-3 fill-white" />
            </button>
          ) : (
            <button 
              id={`notify-btn-${product.product_id}`}
              onClick={handleNotifyClick}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-900/40 active:scale-[0.98]"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Notify When Available</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
