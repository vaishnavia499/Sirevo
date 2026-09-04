import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavigationHandler } from '../types';

interface CustomerSignUpPageProps {
  onNavigate?: NavigationHandler;
}

export const CustomerSignUpPage: React.FC<CustomerSignUpPageProps> = ({ onNavigate }) => {
  const auth = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage('Please agree to the Terms & Privacy Policy to continue.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entries.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      auth.signup('customer', {
        name: fullName.trim() || 'Alex Rivera',
        email: email.trim() || 'alex.rivera@example.com',
      });

      setIsSubmitting(false);
      setSuccessMessage('Account created successfully! Welcome to Sirevo AI.');

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('home');
        }
      }, 700);
    }, 500);
  };

  const handleGoogleSignUp = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      auth.login('customer', {
        email: 'alex.rivera@example.com',
        name: 'Alex Rivera (Google)',
      });
      setIsSubmitting(false);
      setSuccessMessage('Signed in with Google successfully!');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('home');
        }
      }, 700);
    }, 500);
  };

  return (
    <div 
      id="customer-signup-page"
      className="min-h-screen bg-[#0B1121] text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-x-hidden"
    >
      {/* Top Header Return Button (if navigation available) */}
      {onNavigate && (
        <div className="w-full max-w-md flex justify-between items-center mb-4">
          <button
            type="button"
            id="customer-signup-back-btn"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151c2f] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            type="button"
            id="customer-signup-merchant-switch-btn"
            onClick={() => onNavigate('merchant-register')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer transition-colors"
          >
            Register as Merchant &rarr;
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. Page Header (Outside, above the card)                                 */}
      {/* ========================================================================= */}
      <div 
        id="customer-signup-brand-header"
        className="text-xl font-bold flex items-center justify-center gap-2 mb-6 text-white"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Bot className="w-4 h-4 text-blue-400" />
        </div>
        <span className="tracking-tight">Sirevo AI</span>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="max-w-md w-full mb-4 p-3.5 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="max-w-md w-full mb-4 p-3.5 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Main Form Card                                                         */}
      {/* ========================================================================= */}
      <div 
        id="customer-signup-card"
        className="max-w-md w-full bg-[#151c2f] rounded-2xl p-8 border border-slate-800 shadow-2xl"
      >
        {/* ======================================================================= */}
        {/* 3. Card Header                                                          */}
        {/* ======================================================================= */}
        <h1 
          id="customer-signup-title"
          className="text-2xl font-bold text-white text-center mb-1 tracking-tight"
        >
          Create your Sirevo account
        </h1>
        <p 
          id="customer-signup-subtitle"
          className="text-sm text-slate-400 text-center mb-8"
        >
          Start finding the right products with AI.
        </p>

        {/* ======================================================================= */}
        {/* 4. Input Fields (Vertical Stack)                                        */}
        {/* ======================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: Full Name */}
          <div>
            <label 
              htmlFor="customer-input-fullname"
              className="text-xs font-medium text-slate-300 block mb-1.5"
            >
              Full Name
            </label>
            <div className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 w-full flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="customer-input-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Field 2: Email */}
          <div>
            <label 
              htmlFor="customer-input-email"
              className="text-xs font-medium text-slate-300 block mb-1.5"
            >
              Email
            </label>
            <div className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 w-full flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="customer-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Field 3: Phone Number */}
          <div>
            <label 
              htmlFor="customer-input-phone"
              className="text-xs font-medium text-slate-300 block mb-1.5"
            >
              Phone Number
            </label>
            <div className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 w-full flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="customer-input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Field 4: Password */}
          <div>
            <label 
              htmlFor="customer-input-password"
              className="text-xs font-medium text-slate-300 block mb-1.5"
            >
              Password
            </label>
            <div className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 w-full flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="customer-input-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <button
                type="button"
                id="customer-toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
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

          {/* Field 5: Confirm Password */}
          <div>
            <label 
              htmlFor="customer-input-confirm-password"
              className="text-xs font-medium text-slate-300 block mb-1.5"
            >
              Confirm Password
            </label>
            <div className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 w-full flex items-center gap-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="customer-input-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <button
                type="button"
                id="customer-toggle-confirm-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5. Form Actions                                                       */}
          {/* ===================================================================== */}
          
          {/* Checkbox */}
          <div className="mt-4 mb-6 text-sm text-slate-300 flex items-center gap-2">
            <input
              id="customer-signup-checkbox-terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <label 
              htmlFor="customer-signup-checkbox-terms"
              className="text-xs text-slate-300 select-none cursor-pointer"
            >
              I agree to the{' '}
              <a 
                href="#terms" 
                onClick={(e) => e.preventDefault()} 
                className="text-blue-400 font-semibold hover:underline"
              >
                Terms & Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="customer-submit-signup-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-purple-600/25 cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* ===================================================================== */}
          {/* 6. Social Login                                                       */}
          {/* ===================================================================== */}
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500 px-3 uppercase tracking-wider font-semibold">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Google Button */}
          <button
            id="customer-google-signup-btn"
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-transparent border border-slate-700 text-slate-300 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 7. Global Footer (Outside, below the card)                                */}
      {/* ========================================================================= */}
      <div className="text-center">
        {/* Centered text directly below the card */}
        <p 
          id="customer-signin-prompt"
          className="text-sm text-slate-400 mt-6"
        >
          Already have an account?{' '}
          <button
            type="button"
            id="customer-link-to-signin"
            onClick={() => onNavigate ? onNavigate('auth') : auth.openAuthModal()}
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </p>

        {/* Centered tiny text below that */}
        <p 
          id="customer-security-notice"
          className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1"
        >
          <Lock className="w-3 h-3 text-slate-500" />
          <span>Your information is securely protected.</span>
        </p>
      </div>
    </div>
  );
};
