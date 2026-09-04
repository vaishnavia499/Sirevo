import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Store, 
  Sparkles, 
  Zap, 
  ChevronDown, 
  AlertTriangle, 
  Check, 
  Lock, 
  HelpCircle,
  Truck,
  Search
} from 'lucide-react';
import { CuratedProduct, PageRoute } from '../types';
import { useCheckout } from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: PageRoute) => void;
  cartItems?: CuratedProduct[];
  onRemoveFromCart?: (productId: string) => void;
  onClearCart?: () => void;
  onViewDetails?: (product: CuratedProduct) => void;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  merchant: string;
  merchantType: 'ai-ready' | 'amazon' | 'flipkart';
  price: number;
  originalPrice: number;
  quantity: number;
  badge?: string;
  aiRationale: string;
  specs: string;
  imageAccent: string;
  image?: string;
  rawProduct?: CuratedProduct;
}

const mapPropToCartItem = (p: CuratedProduct, idx: number): CartItem => ({
  id: p.product_id || (p as any).id || `cart-${idx}`,
  name: p.name,
  category: p.category || 'Curated Products',
  merchant: p.merchant || (p.source === 'registered_merchant' ? 'Sold by TechStore Partner' : 'Sold by Web Merchant'),
  merchantType: 'ai-ready',
  price: typeof p.price === 'number' ? p.price : (Number(p.price) || 0),
  originalPrice: p.original_price ? Number(p.original_price) : Math.round((Number(p.price) || 0) * 1.25),
  quantity: 1,
  badge: p.badge || 'Added to Cart',
  aiRationale: p.ai_explanation || `Matches your shopping preferences with ${p.ai_match_percentage || 95}% confidence.`,
  specs: p.specs ? Object.entries(p.specs).filter(([_, v]) => v && v !== 'N/A').map(([_, v]) => `${v}`).slice(0, 3).join(' • ') : 'Verified Specification',
  imageAccent: 'from-blue-600 to-indigo-600',
  image: p.image || (p as any).thumbnail || (p as any).product_image,
  rawProduct: p
});

export const CartPage: React.FC<CartPageProps> = ({ 
  onNavigate, 
  cartItems: propCartItems,
  onRemoveFromCart,
  onClearCart,
  onViewDetails
}) => {
  const { 
    cart: contextCart, 
    removeFromCart: contextRemoveFromCart, 
    clearCart: contextClearCart 
  } = useCart();

  const effectiveCart = propCartItems !== undefined ? propCartItems : contextCart;

  // Clear Initial State: Initialize the cart state as an empty array ([]) rather than including default items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (effectiveCart && effectiveCart.length > 0) {
      return effectiveCart.map(mapPropToCartItem);
    }
    return [];
  });

  React.useEffect(() => {
    if (effectiveCart) {
      setCartItems(effectiveCart.map(mapPropToCartItem));
    }
  }, [effectiveCart]);

  const [userBudget, setUserBudget] = useState<number>(60000);
  const [budgetConfirmed, setBudgetConfirmed] = useState<boolean>(false);
  const { openPurchaseModal } = useCheckout();

  const updateQuantity = (id: string, qty: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (onRemoveFromCart) {
      onRemoveFromCart(id);
    }
    if (contextRemoveFromCart) {
      contextRemoveFromCart(id);
    }
  };

  const handleClearAll = () => {
    setCartItems([]);
    if (onClearCart) {
      onClearCart();
    }
    if (contextClearCart) {
      contextClearCart();
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalSavings = originalSubtotal - subtotal;
  const deliveryFee = 0; // Free AI merchant delivery
  const total = subtotal + deliveryFee;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isOverBudget = total > userBudget;
  const budgetDiff = Math.abs(total - userBudget);
  const isCheckoutDisabled = isOverBudget && !budgetConfirmed;

  const handleProceedToCheckout = () => {
    if (isCheckoutDisabled) return;
    openPurchaseModal({
      id: cartItems[0]?.id || 'cart-checkout',
      title: cartItems.length === 1 ? cartItems[0].name : `${cartItems[0].name} + ${cartItems.length - 1} other item${cartItems.length > 2 ? 's' : ''}`,
      price: total,
      originalPrice: originalSubtotal,
      merchant: 'TechStore',
      merchantName: 'TechStore (AI-Ready Merchant)',
      budget: userBudget,
      specs: `${totalItemCount} total item${totalItemCount > 1 ? 's' : ''} in cart`
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-28 md:pb-16 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Cart
          </h1>
          <span className="px-3 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
            {cartItems.length} {cartItems.length === 1 ? 'Product' : 'Products'} ({totalItemCount} total items)
          </span>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="cart-clear-all-btn"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div id="cart-empty-state" className="bg-[#0b101e] rounded-3xl border border-slate-800/80 p-12 sm:p-16 text-center space-y-6 shadow-2xl max-w-2xl mx-auto my-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 shadow-xl">
              <ShoppingCart className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Your cart is empty</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Looks like you haven't added any products to your cart yet. Explore our AI-curated catalog to find top-rated electronics, gadgets, and apparel tailored to your needs.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              id="cart-start-searching-btn"
              onClick={() => onNavigate('search')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Start Searching</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Dynamic Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="bg-[#0c1222] rounded-2xl border border-slate-800/90 p-5 sm:p-6 hover:border-slate-700/80 transition-all space-y-4 shadow-xl relative overflow-hidden"
              >
                {/* AI-Selected Pill */}
                {item.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/80 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{item.badge}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                  
                  {/* Product Thumbnail Graphic Canvas */}
                  <div className="sm:col-span-4 aspect-[16/11] bg-[#050811] rounded-xl border border-slate-800/90 p-3 flex items-center justify-center relative overflow-hidden group">
                    <div className={`w-24 h-24 bg-gradient-to-tr ${item.imageAccent} opacity-15 rounded-full blur-xl absolute inset-0 m-auto pointer-events-none`} />
                    
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center justify-center text-slate-500">
                        <ShoppingCart className="w-10 h-10 text-slate-600 mb-1" />
                        <span className="text-[10px] font-semibold text-slate-400">{item.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Info & Rationale */}
                  <div className="sm:col-span-8 flex flex-col justify-between h-full space-y-3">
                    
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{item.name}</h2>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Store className="w-3.5 h-3.5 text-blue-400" />
                            <span>{item.merchant}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.specs}</p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* AI Rationale Box */}
                      <div className="p-3 rounded-xl bg-[#111a33]/80 border border-blue-900/50 text-xs text-slate-300 space-y-1 mt-2">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed text-[11px]">
                            <strong className="text-white">Why this product was selected:</strong> {item.aiRationale}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price, Qty Selector, View Details */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-xl font-black text-white tracking-tight">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-500 block">
                              (₹{item.price.toLocaleString('en-IN')} each)
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            aria-label="Quantity"
                            className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                          >
                            <option value={1}>Qty: 1</option>
                            <option value={2}>Qty: 2</option>
                            <option value={3}>Qty: 3</option>
                            <option value={4}>Qty: 4</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.rawProduct && onViewDetails) {
                              onViewDetails(item.rawProduct);
                            } else {
                              onNavigate('product-detail');
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}

            {/* Verification Guarantee Card */}
            <div className="p-4 bg-[#0a1020] border border-blue-900/40 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <p>
                <strong className="text-white">Sirevo Verified Guarantee:</strong> All items fulfilled by AI-Ready Merchants with encrypted checkout and 7-day hassle-free returns.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Order Summary Card & AI Budget Guardrail */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sticky top-6">
            
            <div className="p-6 bg-[#0c1222] rounded-2xl border border-slate-800/90 shadow-2xl space-y-5">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-normal text-slate-400">
                  {cartItems.length} {cartItems.length === 1 ? 'type' : 'types'}
                </span>
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Total</span>
                  <span className="line-through text-slate-500">₹{originalSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Savings (20% Avg)</span>
                  <span className="text-emerald-400 font-semibold">-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Merchant Express Delivery</span>
                  </span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Combined Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white tracking-tight">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              {/* AI Budget Guardrail Status Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                isOverBudget 
                  ? 'bg-rose-950/20 border-rose-600/50 text-rose-200' 
                  : 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  {isOverBudget ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        {isOverBudget ? 'Budget Limit Exceeded' : 'Within AI Budget Target'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Limit: ₹{userBudget.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {isOverBudget ? (
                        <>Combined total exceeds your set budget by <strong className="text-rose-400 font-semibold">₹{budgetDiff.toLocaleString('en-IN')}</strong>. Please acknowledge before proceeding.</>
                      ) : (
                        <>Combined total is well within your budget (<strong className="text-emerald-400 font-semibold">₹{budgetDiff.toLocaleString('en-IN')}</strong> remaining).</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Explicit Checkbox Confirmation if Over Budget */}
                {isOverBudget && (
                  <div className="mt-3 pt-3 border-t border-rose-800/40">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={budgetConfirmed}
                        onChange={(e) => setBudgetConfirmed(e.target.checked)}
                        className="mt-0.5 rounded-sm border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-300 leading-tight">
                        I confirm and approve exceeding my AI budget constraint of ₹{userBudget.toLocaleString('en-IN')}.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic 'Buy All' or 'Proceed to Checkout' Primary Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={isCheckoutDisabled}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                  isCheckoutDisabled
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                {cartItems.length === 1 ? (
                  <span>Proceed to Checkout</span>
                ) : (
                  <span>Buy All {cartItems.length} Items • ₹{total.toLocaleString('en-IN')}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit Razorpay & UPI Secure Payment</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* STICKY BOTTOM BAR FOR MOBILE RESPONSIVENESS (md:hidden) */}
      {cartItems.length > 0 && (
        <div 
          id="cart-mobile-sticky-bar"
          className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-40 md:hidden shadow-2xl flex items-center justify-between gap-3"
        >
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
            <span className="text-lg font-black text-white tracking-tight">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={isCheckoutDisabled}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isCheckoutDisabled
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 cursor-pointer'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            {cartItems.length === 1 ? (
              <span>Proceed to Checkout</span>
            ) : (
              <span>Buy All ({cartItems.length}) • ₹{total.toLocaleString('en-IN')}</span>
            )}
          </button>
        </div>
      )}

    </div>
  );
};

export default CartPage;
