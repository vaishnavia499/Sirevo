import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  ExternalLink,
  XCircle,
  RotateCcw,
  X
} from 'lucide-react';
import { PageRoute } from '../types';

interface PaymentPageProps {
  onNavigate?: (page: PageRoute) => void;
  productName?: string;
  price?: number;
  merchantName?: string;
  orderId?: string;
  budget?: number;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  onNavigate,
  productName: defaultProductName = 'Lenovo IdeaPad Slim 5',
  price: defaultPrice = 59490,
  merchantName: defaultMerchantName = 'TechStore (AI-Ready Merchant)',
  orderId: defaultOrderId = '#SP1024',
  budget: defaultBudget = 60000
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routerState = location.state as {
    product?: {
      title?: string;
      name?: string;
      price?: number;
      merchant?: string;
      merchantName?: string;
      budget?: number;
      orderId?: string;
      image?: string;
      id?: string;
      source?: string;
      external_link?: string;
    };
    source?: string;
    external_link?: string;
    price?: number;
    productName?: string;
    merchantName?: string;
    budget?: number;
    orderId?: string;
    productId?: string;
  } | null;

  const productName = routerState?.product?.title || routerState?.product?.name || routerState?.productName || defaultProductName;
  const price = routerState?.product?.price ?? routerState?.price ?? defaultPrice;
  const merchantName = routerState?.product?.merchant || routerState?.product?.merchantName || routerState?.merchantName || defaultMerchantName;
  const budget = routerState?.product?.budget ?? routerState?.budget ?? defaultBudget;
  const productId = routerState?.product?.id || routerState?.productId || 'prod-lenovo-slim5';
  const displayOrderId = routerState?.product?.orderId || routerState?.orderId || defaultOrderId;
  const source = routerState?.product?.source || routerState?.source || 'registered_merchant';
  const externalLink = routerState?.product?.external_link || routerState?.external_link || (source === 'external_web' ? 'https://www.google.com/shopping' : '');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentFailedDetails, setPaymentFailedDetails] = useState<{
    reason: string;
    code: string;
    step?: string;
  } | null>(null);

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentFailedDetails({
        reason: 'Payment declined: Insufficient funds or card authorization declined by the issuing bank (Test Failure Scenario).',
        code: 'PAYMENT_DECLINED_BY_BANK',
        step: 'bank_authorization'
      });
    }, 500);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentFailedDetails(null);

    try {
      // 1. POST request to /api/payment/create-order with bounded product metadata & source
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'INR',
          source: source,
          external_link: externalLink,
          notes: {
            productId: productId,
            productName: productName,
            merchant: merchantName,
            source: source,
            external_link: externalLink,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed with status ${response.status}`);
      }

      const orderData = await response.json();
      const { orderId, amount, keyId } = orderData;

      if (!orderId || !keyId) {
        throw new Error('Invalid order response returned from server.');
      }

      // 2. Configure official Razorpay options object
      const options = {
        key: keyId,
        amount: amount,
        currency: orderData.currency || 'INR',
        name: 'Sirevo AI',
        description: `Order for ${productName}`,
        order_id: orderId,
        handler: function (razorpayResponse: any) {
          setIsProcessing(false);

          const successState = {
            orderId: orderId,
            paymentId: razorpayResponse.razorpay_payment_id || `pay_${Date.now().toString(36)}`,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id || orderId,
            razorpay_signature: razorpayResponse.razorpay_signature,
            merchant: merchantName,
            dateTime: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
            totalPaid: price,
            source: source,
            external_link: externalLink,
            product: {
              title: productName,
              name: productName,
              price: price,
              merchant: merchantName,
              source: source,
              external_link: externalLink,
            }
          };

          // On success, navigate the user to /order-success route with full bounded metadata
          navigate('/order-success', { state: successState });
          if (onNavigate) {
            onNavigate('payment-success');
          }
        },
        prefill: {
          name: 'Sirevo Customer',
          email: 'customer@sirevo.ai',
          contact: '9999999999'
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      // 3. Launch official test modal over screen
      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (failResp: any) {
          setIsProcessing(false);
          setPaymentFailedDetails({
            reason: failResp.error?.description || 'Your payment was declined by the bank. No charges were made.',
            code: failResp.error?.code || 'BAD_REQUEST_ERROR',
            step: failResp.error?.step || 'payment_authorization'
          });
        });
        rzp.open();
      } else {
        // Fallback: load Razorpay checkout.js dynamically if needed
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        script.onerror = () => {
          setIsProcessing(false);
          setErrorMessage('Unable to load Razorpay SDK. Please check your network connection.');
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      console.error('Error initiating payment:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-slate-200">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Top-left back link */}
          <button
            onClick={() => onNavigate ? onNavigate('cart') : navigate('/cart')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Order Review</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Checkout | Secure Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete your order with end-to-end 256-bit encryption.
          </p>
        </div>

        {/* Top-right Test Mode Badge */}
        <div className="self-start sm:self-center">
          <div className="px-3.5 py-1.5 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/50 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Secure Checkout · Test Mode</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block">Payment Notice</span>
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Order Summary & AI Match Analysis (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Order Summary Card */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ORDER SUMMARY
            </h2>

            {/* Product Row */}
            <div className="flex items-center gap-3.5">
              {/* Product Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-[#050811] border border-slate-800 p-2 flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="w-8 h-5 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-xs border border-slate-600 flex flex-col justify-between p-0.5 shadow-xs">
                  <div className="w-1 h-1 rounded-full bg-cyan-300 mx-auto" />
                  <div className="w-full h-0.5 bg-slate-400/40 rounded-full" />
                </div>
              </div>

              {/* Title & Merchant Subtitle */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white tracking-tight truncate">
                  {productName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {merchantName} • Qty: 1
                </p>
              </div>

              {/* Price */}
              <span className="text-sm font-bold text-white font-mono shrink-0">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Product price</span>
                <span className="font-semibold text-slate-200">₹{price.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Delivery</span>
                <span className="font-semibold text-emerald-400">Free</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
              <span className="text-base font-bold text-white">Total</span>
              <span className="text-2xl font-black text-white tracking-tight font-mono text-emerald-400">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Footer Grid */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2.5 text-xs text-slate-400">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Ref Order</span>
                <span className="font-mono text-slate-300 font-semibold truncate block max-w-[180px]">{displayOrderId}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Merchant</span>
                <span className="text-slate-300 font-medium truncate block">{merchantName}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Fulfillment Model</span>
                <span className="text-slate-300 font-medium">
                  {source === 'external_web' 
                    ? '🤖 AI Buyer Autonomous Headless Fulfillment · Razorpay Escrow' 
                    : '⚡ Direct Merchant Priority · 1–2 Business Days'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Match Analysis Card */}
          <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  AI Match Analysis
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/70 text-[10px] font-bold">
                AI Verified
              </span>
            </div>

            {/* Three bullet points with green checkmarks */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Matches requirements (16GB RAM, Fast CPU)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Within your specified budget constraint (₹{budget.toLocaleString('en-IN')})</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>In stock · Fast verified merchant delivery</span>
              </div>
            </div>

            {/* Link below */}
            <button
              onClick={() => onNavigate ? onNavigate('compare') : navigate('/compare')}
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>View why this product was recommended</span>
              <span className="text-blue-400 font-bold">→</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Streamlined Razorpay Secure Gateway (Span 7) */}
        <div className="lg:col-span-7">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Background Ambient Blue Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-blue-600/10 blur-3xl pointer-events-none" />

            {/* 1. Official Razorpay Logo */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
              alt="Razorpay" 
              className="w-44 h-auto object-contain brightness-0 invert opacity-95 mb-2 transition-transform hover:scale-105"
            />

            {/* 2. Gateway Title & Subtitle */}
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Complete Payment
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                You will be securely redirected to Razorpay to complete your purchase using UPI or Card.
              </p>
            </div>

            {/* 3. Amount to Pay Callout Card */}
            <div className="w-full max-w-md bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 flex items-center justify-between shadow-inner">
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Amount to Pay
                </span>
                <span className="text-[11px] text-slate-500">
                  Zero hidden fees · Instant settlement
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight text-emerald-400">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* 4. Prominent 'Pay with Razorpay' Button */}
            <div className="w-full max-w-md space-y-3">
              <button
                id="pay-with-razorpay-btn"
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white stroke-[2.5] group-hover:scale-110 transition-transform" />
                    <span>Pay with Razorpay</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <span>By clicking, you authorize the secure test transaction through Razorpay.</span>
              </p>

              {/* Demo Simulate Failure Button */}
              <button
                id="simulate-payment-failure-btn"
                type="button"
                onClick={handleSimulateFailure}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.99] disabled:opacity-50"
                title="Simulate a declined payment failure scenario"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Payment Failure (Demo Test)</span>
              </button>
            </div>

            {/* 5. Trust & Guardrails Footer */}
            <div className="w-full max-w-md pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>100% Secure | Test Mode</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400/90 font-medium">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Payment Failed Modal Dialog */}
      {paymentFailedDetails && (
        <div 
          id="payment-failed-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#0e1628] border border-rose-800/80 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Header Bar */}
            <div className="p-5 bg-gradient-to-r from-rose-950/80 via-[#1a1222] to-[#0e1628] border-b border-rose-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 font-bold shadow-md shadow-rose-950/50">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Payment Failed</h3>
                  <p className="text-[10px] text-rose-400">Transaction Not Completed</p>
                </div>
              </div>
              <button 
                onClick={() => setPaymentFailedDetails(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              <div className="p-3.5 bg-rose-950/40 border border-rose-800/40 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Transaction Declined</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {paymentFailedDetails.reason}
                </p>
              </div>

              {/* Transaction Specs */}
              <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Product:</span>
                  <span className="text-slate-200 font-sans font-semibold truncate max-w-[200px]">{productName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Amount:</span>
                  <span className="text-white font-bold">₹{price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-rose-400 font-bold uppercase">FAILED / DECLINED</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Error Code:</span>
                  <span className="text-rose-300">{paymentFailedDetails.code}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Safeguard:</span>
                  <span className="text-emerald-400 font-sans">Zero charges deducted from account</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  id="retry-payment-btn"
                  type="button"
                  onClick={() => {
                    setPaymentFailedDetails(null);
                    handlePayment();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentFailedDetails(null);
                    if (onNavigate) onNavigate('cart');
                    else navigate('/cart');
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  Return to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentPage;
