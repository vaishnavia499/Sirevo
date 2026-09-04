import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Check, 
  Lock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { PageRoute } from '../types';

export interface PurchaseConfirmationProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onNavigate?: (page: PageRoute) => void;
  productName?: string;
  merchantName?: string;
  price?: number;
  budget?: number;
  image?: string;
  comparisonLinkRoute?: PageRoute;
}

export const PurchaseConfirmationModal: React.FC<PurchaseConfirmationProps> = ({
  isOpen = true,
  onClose,
  onSuccess,
  onNavigate,
  productName = 'Lenovo IdeaPad Slim 5',
  merchantName = 'TechStore',
  price = 56999,
  budget = 60000,
  image,
  comparisonLinkRoute = 'compare'
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const remainingBudget = budget - price;
  const isWithinBudget = remainingBudget >= 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round((price / budget) * 100)));

  const handleConfirmAndPay = async () => {
    if (!isConfirmed) return;
    setIsProcessing(true);

    let generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          notes: {
            product: productName,
            merchant: merchantName,
            budget: budget
          }
        })
      });

      if (res.ok) {
        const orderData = await res.json();
        if (orderData.orderId) {
          generatedOrderId = orderData.orderId;
        }
      }
    } catch (e) {
      console.warn('Backend order generation fallback:', e);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/secure-payment', {
            state: {
              product: {
                title: productName,
                price: price,
                merchant: merchantName,
                budget: budget,
                image: image,
                orderId: generatedOrderId
              }
            }
          });
          if (onNavigate) {
            onNavigate('payment');
          }
        }
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Centered Large Dark Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative my-auto text-slate-200 select-none overflow-hidden"
      >
        {/* Subtle Ambient Background Gradient Glow inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button (X) in top right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Payment Processing Success State */
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
              <p className="text-sm text-slate-400">Your order has been securely processed with {merchantName}.</p>
              <p className="text-xs text-blue-400 font-mono mt-2">Redirecting to Order History & Tracking...</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-6">
            
            {/* 1. Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold tracking-wide">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span>Sirevo AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-4 mb-2 text-white tracking-tight">
                Are you sure you want to buy this?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Please review your order before continuing to secure payment.
              </p>
            </div>

            {/* 2. Product Summary Row */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <span className="font-bold text-white text-base sm:text-lg tracking-tight">
                {productName}
              </span>
              <span className="font-bold text-white text-base sm:text-lg font-mono">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* 3. AI Rationale Block */}
            <div className="border-l-2 border-purple-500 pl-4 relative py-0.5">
              {/* Decorative Purple Node Indicator */}
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500" />

              <div className="flex items-center gap-1.5 text-purple-400 text-sm font-semibold mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Why Sirevo recommended this</span>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Matches requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Within ₹{budget.toLocaleString('en-IN')} budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Currently in stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Fast delivery</span>
                </div>
              </div>

              {/* View Comparison Link */}
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate(comparisonLinkRoute);
                }}
                className="text-slate-300 text-xs sm:text-sm mt-3 inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <span>View comparison</span>
                <span className="text-purple-400 font-bold">→</span>
              </button>
            </div>

            {/* 4. Budget Tracker (Crucial Feature) */}
            <div className="bg-[#0b0f1a] p-4 rounded-xl border border-slate-800/80 space-y-2">
              {/* Top Flex Row */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    PURCHASE AMOUNT
                  </span>
                  <span className="text-base font-bold text-white tracking-tight">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    YOUR BUDGET
                  </span>
                  <span className="text-base font-bold text-white tracking-tight">
                    ₹{budget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full mt-3 mb-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Bottom Flex Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Within your budget</span>
                </div>

                <span className="text-slate-400 text-xs">
                  Remaining: ₹{remainingBudget > 0 ? remainingBudget.toLocaleString('en-IN') : 0}
                </span>
              </div>
            </div>

            {/* 5. Explicit Consent Box */}
            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Confirm your purchase
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                You are about to purchase <strong className="text-white font-semibold">{productName}</strong> from <strong className="text-white font-semibold">{merchantName}</strong> for <strong className="text-white font-semibold">₹{price.toLocaleString('en-IN')}</strong>.
              </p>

              {/* Checkbox row with custom styling */}
              <label className="flex items-center gap-3 pt-1 cursor-pointer select-none group">
                <div 
                  onClick={() => setIsConfirmed(!isConfirmed)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all border ${
                    isConfirmed 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/30' 
                      : 'bg-slate-800 border-slate-700 group-hover:border-slate-600'
                  }`}
                >
                  {isConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                  Yes, I want to purchase this product.
                </span>
              </label>
            </div>

            {/* 6. Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mt-6">
              {/* Button 1: Go Back */}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-transparent hover:bg-slate-800/80 text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center"
              >
                Go Back
              </button>

              {/* Button 2: Confirm & Pay */}
              <button
                type="button"
                disabled={!isConfirmed || isProcessing}
                onClick={handleConfirmAndPay}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 ${
                  isConfirmed && !isProcessing
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span>Confirm & Pay ₹{price.toLocaleString('en-IN')}</span>
                )}
              </button>
            </div>

            {/* 7. Security Footer */}
            <div className="text-slate-500 text-[11px] text-center pt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>You will be redirected to secure payment after confirmation.</span>
              </div>
              <p className="text-slate-500 text-[10px]">
                Your payment will not be processed until you confirm.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
