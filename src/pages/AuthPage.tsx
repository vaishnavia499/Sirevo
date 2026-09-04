import React, { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  Store, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { NavigationHandler } from '../types';

interface AuthPageProps {
  onNavigate?: NavigationHandler;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const auth = useAuth();
  
  // Active role selection: 'customer' or 'merchant'
  const [role, setRole] = useState<'customer' | 'merchant'>('customer');
  // Authentication mode: 'signin' or 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setNotification('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setNotification(null);

    setTimeout(() => {
      if (mode === 'signin') {
        auth.login(
          email.trim(), 
          role, 
          role === 'merchant' ? (businessName || email.split('@')[0] + ' Store') : (fullName || 'Alex Rivera')
        );
      } else {
        if (role === 'customer') {
          auth.signup('customer', {
            name: fullName.trim() || 'Alex Rivera',
            email: email.trim(),
          });
        } else {
          auth.signup('merchant', {
            name: businessName.trim() || 'TechStore Official',
            email: email.trim(),
            storeName: businessName.trim() || 'TechStore Official',
            category: 'Consumer Electronics',
          });
        }
      }

      setIsLoading(false);

      if (onNavigate) {
        if (role === 'merchant') {
          onNavigate('merchant-dashboard');
        } else {
          onNavigate('home');
        }
      }
    }, 400);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      auth.login(
        role === 'customer' ? 'alex.shopper@google.com' : 'partner.store@google.com',
        role,
        role === 'customer' ? 'Alex Rivera' : 'TechStore Official'
      );
      setIsLoading(false);
      if (onNavigate) {
        onNavigate(role === 'merchant' ? 'merchant-dashboard' : 'home');
      }
    }, 450);
  };

  const handleForgotPassword = () => {
    setNotification('Password reset link sent to ' + (email || 'your email') + ' if registered.');
  };

  return (
    <div 
      id="auth-page-container"
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0B1121] text-slate-100 font-sans relative overflow-x-hidden"
    >
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Branding & Hero with Constellation Graphic                   */}
      {/* ========================================================================= */}
      <div 
        id="auth-left-hero-column"
        className="w-full lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e1b4b] flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[420px] lg:min-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80"
      >
        {/* Abstract Constellation & Network Mesh Graphic (SVG overlay) */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <svg 
            className="w-full h-full object-cover" 
            viewBox="0 0 800 900" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Constellation Nodes & Connecting Lines */}
            <g stroke="#6366f1" strokeWidth="0.75" strokeOpacity="0.4">
              <line x1="120" y1="180" x2="280" y2="220" />
              <line x1="280" y1="220" x2="390" y2="140" />
              <line x1="390" y1="140" x2="520" y2="260" />
              <line x1="520" y1="260" x2="430" y2="380" />
              <line x1="430" y1="380" x2="280" y2="220" />
              <line x1="430" y1="380" x2="210" y2="460" />
              <line x1="210" y1="460" x2="120" y2="180" />
              <line x1="520" y1="260" x2="680" y2="340" />
              <line x1="680" y1="340" x2="590" y2="520" />
              <line x1="590" y1="520" x2="430" y2="380" />
              <line x1="210" y1="460" x2="340" y2="600" />
              <line x1="340" y1="600" x2="590" y2="520" />
              <line x1="340" y1="600" x2="180" y2="720" />
              <line x1="590" y1="520" x2="670" y2="690" />
              <line x1="340" y1="600" x2="490" y2="760" />
            </g>

            {/* Glowing Accent Nodes */}
            <circle cx="120" cy="180" r="3.5" fill="#60a5fa" fillOpacity="0.8" />
            <circle cx="280" cy="220" r="4.5" fill="#818cf8" fillOpacity="0.9" />
            <circle cx="390" cy="140" r="3" fill="#a78bfa" fillOpacity="0.7" />
            <circle cx="520" cy="260" r="5" fill="#38bdf8" fillOpacity="0.85" />
            <circle cx="430" cy="380" r="4" fill="#818cf8" fillOpacity="0.9" />
            <circle cx="210" cy="460" r="3.5" fill="#60a5fa" fillOpacity="0.7" />
            <circle cx="680" cy="340" r="3.5" fill="#c084fc" fillOpacity="0.8" />
            <circle cx="590" cy="520" r="4.5" fill="#818cf8" fillOpacity="0.9" />
            <circle cx="340" cy="600" r="4" fill="#38bdf8" fillOpacity="0.8" />
            <circle cx="180" cy="720" r="3" fill="#a78bfa" fillOpacity="0.7" />
            <circle cx="670" cy="690" r="3.5" fill="#60a5fa" fillOpacity="0.8" />
            <circle cx="490" cy="760" r="4" fill="#818cf8" fillOpacity="0.8" />

            {/* Ambient Radial Gradient Orbs */}
            <circle cx="450" cy="360" r="180" fill="url(#purpleGlow)" fillOpacity="0.18" />
            <circle cx="280" cy="550" r="160" fill="url(#blueGlow)" fillOpacity="0.15" />

            <defs>
              <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Ambient colored background lights */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Left: Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              Sirevo AI
            </span>
          </div>

          {/* Quick return to home button if onNavigate is passed */}
          {onNavigate && (
            <button
              id="auth-back-to-home-btn"
              onClick={() => onNavigate('home')}
              className="lg:hidden text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Bottom Left Alignment: Headline & Subtitle */}
        <div className="relative z-10 mt-16 lg:mt-auto pt-10 pb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Shop and sell with the <br className="hidden sm:inline" />
            <span className="text-[#93c5fd] font-extrabold">power of AI.</span>
          </h1>

          <p className="text-slate-400 mt-4 max-w-md text-sm sm:text-base leading-relaxed">
            Experience the future of commerce where AI finds, compares, and procures the perfect products for you.
          </p>

          {/* Live System Indicator */}
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-blue-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Autonomous Agent Active
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Zero Friction Checkout</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Authentication Form Area                                    */}
      {/* ========================================================================= */}
      <div 
        id="auth-right-form-column"
        className="w-full lg:w-1/2 min-h-screen bg-[#0B1121] flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative items-center"
      >
        {/* Optional top navigation back for large screens */}
        <div className="w-full max-w-md flex justify-end">
          {onNavigate && (
            <button
              id="auth-desktop-back-btn"
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Storefront</span>
            </button>
          )}
        </div>

        {/* Center Auth Form Card */}
        <div 
          id="auth-form-card"
          className="w-full max-w-md bg-[#151c2f] rounded-2xl p-7 sm:p-8 border border-slate-800 shadow-2xl my-auto text-slate-100"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome to Sirevo AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose how you want to continue
            </p>
          </div>

          {/* Role Selector: 2 Selectable Boxes Side-by-Side */}
          <div className="grid grid-cols-2 gap-3.5 my-6">
            {/* Box 1: Customer */}
            <button
              type="button"
              id="role-box-customer"
              onClick={() => setRole('customer')}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                role === 'customer'
                  ? 'border-blue-500 bg-blue-900/10 ring-1 ring-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 text-slate-400'
              }`}
            >
              <div>
                <div className="mb-2 text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <div className={`font-semibold text-sm ${role === 'customer' ? 'text-white' : 'text-slate-300'}`}>
                  Customer
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-1.5">
                Find, compare and buy products with AI.
              </p>
            </button>

            {/* Box 2: Merchant */}
            <button
              type="button"
              id="role-box-merchant"
              onClick={() => setRole('merchant')}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                role === 'merchant'
                  ? 'border-blue-500 bg-blue-900/10 ring-1 ring-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 text-slate-400'
              }`}
            >
              <div>
                <div className="mb-2 text-blue-400">
                  <Store className="w-4 h-4" />
                </div>
                <div className={`font-semibold text-sm ${role === 'merchant' ? 'text-white' : 'text-slate-300'}`}>
                  Merchant
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-1.5">
                Manage your products and reach AI-powered buyers.
              </p>
            </button>
          </div>

          {/* Feedback notification message */}
          {notification && (
            <div className="mb-4 p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>{notification}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode-specific signup name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {role === 'customer' ? 'Full Name' : 'Company / Store Name'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-name-input"
                    type="text"
                    value={role === 'customer' ? fullName : businessName}
                    onChange={(e) => role === 'customer' ? setFullName(e.target.value) : setBusinessName(e.target.value)}
                    placeholder={role === 'customer' ? 'Alex Rivera' : 'Apex Electronics'}
                    required
                    className="w-full bg-[#0B1121] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#0B1121] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  id="auth-forgot-password-btn"
                  onClick={handleForgotPassword}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0B1121] border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  id="auth-toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Button */}
            <button
              id="auth-primary-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  <span>
                    {mode === 'signin' 
                      ? 'Sign In' 
                      : (role === 'customer' ? 'Create Customer Account' : 'Register Business')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider with 'or' */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-700/80" />
            <span className="text-xs text-slate-500 uppercase">or</span>
            <div className="flex-1 h-px bg-slate-700/80" />
          </div>

          {/* Social Button: Continue with Google */}
          <button
            id="auth-google-btn"
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-transparent border border-slate-700 hover:bg-slate-800/60 text-slate-200 font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            {/* Google Colorful 'G' Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Link: Switch between sign in & sign up */}
          <div className="text-center mt-6">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  id="auth-toggle-mode-btn"
                  onClick={() => {
                    if (role === 'merchant' && onNavigate) {
                      onNavigate('merchant-register');
                    } else if (role === 'customer' && onNavigate) {
                      onNavigate('customer-signup');
                    } else {
                      setMode('signup');
                      setNotification(null);
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  {role === 'customer' ? 'Create Customer Account' : 'Register Business'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  id="auth-toggle-mode-btn"
                  onClick={() => {
                    setMode('signin');
                    setNotification(null);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Global Footer (at very bottom outside the card) */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-6 text-center">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Your account information is securely protected by Sirevo AI.</span>
        </div>
      </div>
    </div>
  );
};
