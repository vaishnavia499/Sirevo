import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Store,
  Building2,
  Globe,
  Tag,
  FileCheck
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (page: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen: propIsOpen, 
  onClose: propOnClose,
  onNavigate
}) => {
  const auth = useAuth();
  
  // Support both direct props and AuthContext
  const isOpen = propIsOpen !== undefined ? propIsOpen : auth.isAuthModalOpen;
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      auth.closeAuthModal();
    }
  };

  // Role selection: 'customer' or 'merchant'
  const [selectedRole, setSelectedRole] = useState<'customer' | 'merchant'>('customer');
  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Merchant Specific Form States
  const [businessName, setBusinessName] = useState('');
  const [legalEntity, setLegalEntity] = useState('Private Limited');
  const [taxId, setTaxId] = useState('');
  const [category, setCategory] = useState('Consumer Electronics');
  const [website, setWebsite] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in your email address and password.');
      return;
    }

    if (mode === 'signup') {
      if (selectedRole === 'customer' && !fullName.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      if (selectedRole === 'merchant') {
        if (!businessName.trim()) {
          setFormError('Please enter your company or business name.');
          return;
        }
        if (!taxId.trim()) {
          setFormError('Please enter your Tax ID / GSTIN for seller verification.');
          return;
        }
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (mode === 'signin') {
        auth.login(
          email.trim(), 
          selectedRole, 
          selectedRole === 'merchant' ? (email.split('@')[0] + ' Store') : 'Alex Rivera'
        );
      } else {
        if (selectedRole === 'customer') {
          auth.signup('customer', {
            name: fullName.trim(),
            email: email.trim(),
          });
        } else {
          auth.signup('merchant', {
            name: businessName.trim(),
            email: email.trim(),
            storeName: businessName.trim(),
            legalEntity,
            taxId: taxId.trim(),
            category,
            website: website.trim() || undefined,
          });
        }
      }

      auth.setUserRole(selectedRole);
      setIsSubmitting(false);
      handleClose();

      if (onNavigate) {
        if (selectedRole === 'merchant') {
          onNavigate('merchant-dashboard');
        } else {
          onNavigate('home');
        }
      }
    }, 450);
  };

  const handleQuickDemo = (role: 'customer' | 'merchant') => {
    setSelectedRole(role);
    if (role === 'customer') {
      auth.login('alex.customer@sirevo.ai', 'customer', 'Alex Rivera');
      auth.setUserRole('customer');
      handleClose();
      if (onNavigate) onNavigate('home');
    } else {
      auth.signup('merchant', {
        name: 'TechStore Official',
        email: 'partner@techstore.in',
        storeName: 'TechStore Official',
        legalEntity: 'Private Limited',
        taxId: '29ABCDE1234F1Z5',
        category: 'Consumer Electronics',
        website: 'https://techstore-official.in'
      });
      auth.setUserRole('merchant');
      handleClose();
      if (onNavigate) onNavigate('merchant-dashboard');
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Modal Card: Wide, elegant dark card */}
      <div 
        id="auth-modal-card"
        className="w-full max-w-2xl bg-[#0b1120] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 text-slate-100 relative my-6 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-slate-800/80 shrink-0">
          {/* Sirevo AI Logo in top left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">Sirevo AI</span>
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 border border-blue-800/50 px-2 py-0.5 rounded-full">
                  Auth Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Commerce Authentication</p>
            </div>
          </div>

          {/* Subtle 'X' close button in top right */}
          <button
            id="auth-modal-close-btn"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Heading & Subtitle */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to Sirevo AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose how you want to continue
            </p>
          </div>

          {/* CLEAR ROLE SELECTION AT THE TOP OF THE AUTHENTICATION CARD */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. CUSTOMER CARD */}
              <button
                type="button"
                id="role-customer-card"
                onClick={() => {
                  setSelectedRole('customer');
                  setFormError('');
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  selectedRole === 'customer'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-950/60 via-[#101935] to-[#0b1120] shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'border-slate-800 bg-[#0f172a]/60 hover:border-slate-700 hover:bg-[#0f172a] text-slate-400'
                }`}
              >
                {/* Selected Indicator / Checkmark */}
                {selectedRole === 'customer' && (
                  <div className="absolute top-3.5 right-3.5 text-blue-400 animate-in zoom-in-50 duration-150">
                    <CheckCircle2 className="w-5 h-5 fill-blue-500 text-[#0b1120]" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === 'customer'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${selectedRole === 'customer' ? 'text-white' : 'text-slate-300'}`}>
                      Customer
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Find, compare and buy products with AI.
                </p>
              </button>

              {/* 2. MERCHANT CARD */}
              <button
                type="button"
                id="role-merchant-card"
                onClick={() => {
                  setSelectedRole('merchant');
                  setFormError('');
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  selectedRole === 'merchant'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-950/60 via-[#181135] to-[#0b1120] shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                    : 'border-slate-800 bg-[#0f172a]/60 hover:border-slate-700 hover:bg-[#0f172a] text-slate-400'
                }`}
              >
                {/* Selected Indicator / Checkmark */}
                {selectedRole === 'merchant' && (
                  <div className="absolute top-3.5 right-3.5 text-purple-400 animate-in zoom-in-50 duration-150">
                    <CheckCircle2 className="w-5 h-5 fill-purple-500 text-[#0b1120]" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === 'merchant'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${selectedRole === 'merchant' ? 'text-white' : 'text-slate-300'}`}>
                      Merchant
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage your products and reach AI-powered buyers.
                </p>
              </button>
            </div>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>{formError}</span>
            </div>
          )}

          {/* AUTHENTICATION FORMS: CUSTOMER vs MERCHANT (Never shown simultaneously) */}
          <div className="pt-2">
            
            {/* ========================================================================= */}
            {/* 1. CUSTOMER AUTHENTICATION FLOW */}
            {/* ========================================================================= */}
            {selectedRole === 'customer' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="customer-fullname-input"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        required
                        className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full placeholder-slate-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="customer-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.customer@sirevo.ai"
                      required
                      className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      id="customer-password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full placeholder-slate-500"
                    />
                  </div>

                  {/* Submit Button for Customer */}
                  <button
                    id="customer-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Authenticating...'
                    ) : mode === 'signin' ? (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Create Customer Account</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Registration / Switch Mode Link for Customer */}
                <div className="text-center pt-2">
                  {mode === 'signin' ? (
                    <button
                      type="button"
                      id="customer-switch-signup-link"
                      onClick={() => {
                        setMode('signup');
                        setFormError('');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                    >
                      Don&apos;t have an account? <span className="underline underline-offset-4">Create Customer Account</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="customer-switch-signin-link"
                      onClick={() => {
                        setMode('signin');
                        setFormError('');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Already have an account? <span className="text-blue-400 font-semibold underline underline-offset-4">Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. MERCHANT AUTHENTICATION FLOW */}
            {/* ========================================================================= */}
            {selectedRole === 'merchant' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' ? (
                    /* Detailed Merchant Registration 2-Column Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Company / Business Name *
                        </label>
                        <input
                          id="merchant-businessname-input"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Apex Electronics Private Limited"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Legal Entity Type *
                        </label>
                        <select
                          id="merchant-legalentity-select"
                          value={legalEntity}
                          onChange={(e) => setLegalEntity(e.target.value)}
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full cursor-pointer"
                        >
                          <option value="Sole Proprietorship">Sole Proprietorship</option>
                          <option value="LLC">LLC</option>
                          <option value="Private Limited">Private Limited</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Public Corporation">Public Corporation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Tax ID / GSTIN *
                        </label>
                        <input
                          id="merchant-taxid-input"
                          type="text"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500 font-mono text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Business Category *
                        </label>
                        <select
                          id="merchant-category-select"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full cursor-pointer"
                        >
                          <option value="Consumer Electronics">Consumer Electronics</option>
                          <option value="Computer Hardware & Peripherals">Computer Hardware & Peripherals</option>
                          <option value="Fashion & Apparel">Fashion & Apparel</option>
                          <option value="Home & Living">Home & Living</option>
                          <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                          <option value="Sports & Fitness">Sports & Fitness</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Company Website <span className="text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="merchant-website-input"
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourstore.com"
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Official Email Address *
                        </label>
                        <input
                          id="merchant-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="merchant@company.com"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Merchant Password *
                        </label>
                        <input
                          id="merchant-password-input"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create security password"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Merchant Sign In Form */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Official Merchant Email Address
                        </label>
                        <input
                          id="merchant-signin-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="partner@techstore.in"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Merchant Password
                        </label>
                        <input
                          id="merchant-signin-password-input"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="bg-[#151c2f] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all w-full placeholder-slate-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Merchant Benefits Box */}
                  {mode === 'signup' && (
                    <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 mt-2 flex items-start gap-2.5">
                      <span className="text-base leading-none shrink-0 mt-0.5">✨</span>
                      <p className="text-xs text-purple-200 leading-relaxed font-medium">
                        Registering as a merchant makes your entire catalog AI-readable and discoverable by our smart buyer agents.
                      </p>
                    </div>
                  )}

                  {/* Submit Button for Merchant */}
                  <button
                    id="merchant-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Authenticating Merchant...'
                    ) : mode === 'signin' ? (
                      <>
                        <span>Sign In as Merchant</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Register Your Business</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Registration / Switch Mode Link for Merchant */}
                <div className="text-center pt-2">
                  {mode === 'signin' ? (
                    <button
                      type="button"
                      id="merchant-switch-signup-link"
                      onClick={() => {
                        setMode('signup');
                        setFormError('');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
                    >
                      New merchant? <span className="underline underline-offset-4">Register Your Business</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="merchant-switch-signin-link"
                      onClick={() => {
                        setMode('signin');
                        setFormError('');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Already registered? <span className="text-purple-400 font-semibold underline underline-offset-4">Sign In as Merchant</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Need instant testing credentials?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="quick-demo-customer-btn"
                onClick={() => handleQuickDemo('customer')}
                className="px-3 py-1.5 rounded-lg bg-[#151c2f] hover:bg-slate-800 text-blue-300 text-xs font-semibold border border-blue-900/40 hover:border-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo as Customer</span>
              </button>
              <button
                type="button"
                id="quick-demo-merchant-btn"
                onClick={() => handleQuickDemo('merchant')}
                className="px-3 py-1.5 rounded-lg bg-[#151c2f] hover:bg-slate-800 text-purple-300 text-xs font-semibold border border-purple-900/40 hover:border-purple-600 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Demo as Merchant</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
