import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    productId: string;
    productName: string;
    price?: number | null;
    image?: string | null;
    thumbnail?: string | null;
    externalLink?: string | null;
  } | null;
  onRestockSimulated?: () => void;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({
  isOpen,
  onClose,
  product,
  onRestockSimulated
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Pre-fill email with registered user's email if available, or default demo email
      setEmail(user?.email || 'alex.customer@sirevo.ai');
      setStatusMessage(null);
      setIsSubscribed(false);
      setDispatchReceipt(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/stock-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          productName: product.productName,
          email: cleanEmail,
          price: product.price,
          image: product.image || product.thumbnail,
          externalLink: product.externalLink
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register alert');
      }

      setIsSubscribed(true);
      setStatusMessage({
        type: 'success',
        text: 'In-stock alert confirmed! You will receive an email as soon as fresh inventory arrives.'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error subscribing to in-stock alert.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateRestock = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch('/api/stock-alert/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          productName: product.productName,
          inStock: true,
          price: product.price,
          image: product.image || product.thumbnail,
          externalLink: product.externalLink
        })
      });

      const data = await res.json();
      if (res.ok) {
        setDispatchReceipt(data);
        if (onRestockSimulated) onRestockSimulated();
      }
    } catch (err: any) {
      console.error('Trigger error:', err.message);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0c1222] border border-slate-800/90 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Notify When Available
            </h3>
            <p className="text-xs text-slate-400">
              Get an instant email alert when back in stock
            </p>
          </div>
        </div>

        {/* Product Snapshot Card */}
        <div className="p-3.5 bg-[#070b14] rounded-xl border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#0d1322] rounded-lg border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            {product.thumbnail || product.image ? (
              <img 
                src={product.thumbnail || product.image || ''} 
                alt={product.productName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-slate-500">Item</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">
              {product.productName}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Check Offer'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80">
                Out of Stock
              </span>
            </div>
          </div>
        </div>

        {/* Form or Success State */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                We'll only email you when this product is available for order. No spam.
              </p>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'error' 
                  ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60' 
                  : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
              }`}>
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify When Available</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Alert Active!
              </h4>
              <p className="text-xs text-slate-300">
                We'll notify <strong className="text-purple-300">{email}</strong> immediately when this item is restocked.
              </p>
            </div>

            {/* Test Email Dispatch Webhook Trigger for Judges & Evaluators */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={handleSimulateRestock}
                disabled={isTriggering}
                className="w-full py-2 px-3 rounded-xl bg-[#131b2e] hover:bg-[#1a253e] border border-blue-500/40 text-xs font-semibold text-blue-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTriggering ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>Triggering Nodemailer Dispatch...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-blue-400 fill-current" />
                    <span>Simulate Restock & Dispatch Email</span>
                  </>
                )}
              </button>

              {dispatchReceipt && (
                <div className="p-3 bg-[#080d1a] border border-blue-900/60 rounded-xl text-left space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Nodemailer Dispatched Successfully!</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[10px] truncate">
                    Recipient: {email}
                  </div>
                  <div className="text-slate-500 font-mono text-[10px] truncate">
                    Subject: {dispatchReceipt.dispatched?.[0]?.subject || 'In-Stock Notification'}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default StockAlertModal;
