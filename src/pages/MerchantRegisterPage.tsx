import React, { useState } from 'react';
import { 
  Store, 
  Briefcase, 
  MapPin, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Info, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavigationHandler } from '../types';

interface MerchantRegisterPageProps {
  onNavigate?: NavigationHandler;
}

export const MerchantRegisterPage: React.FC<MerchantRegisterPageProps> = ({ onNavigate }) => {
  const auth = useAuth();

  // Section 1: Business Information
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  // Section 2: Business Address
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Section 3: Contact Person
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Section 4: Account Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Agreement & State
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage('Please agree to the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      auth.signup('merchant', {
        name: contactName.trim() || businessName.trim() || 'Merchant Partner',
        email: (businessEmail.trim() || contactEmail.trim() || 'partner@techstore.in'),
        storeName: businessName.trim() || 'Official Merchant Store',
        category: businessCategory || 'Consumer Electronics',
      });

      setIsSubmitting(false);
      setSuccessMessage('Merchant account registered successfully! Redirecting to Merchant Portal...');

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('merchant-dashboard');
        }
      }, 800);
    }, 500);
  };

  return (
    <div 
      id="merchant-register-page"
      className="min-h-screen bg-[#0B1121] text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start relative overflow-x-hidden"
    >
      {/* Top Header Navigation Return */}
      {onNavigate && (
        <div className="w-full max-w-3xl flex justify-between items-center mb-6">
          <button
            type="button"
            id="merchant-back-to-home-btn"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151c2f] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>

          <button
            type="button"
            id="merchant-quick-signin-btn"
            onClick={() => onNavigate('auth')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer transition-colors"
          >
            Sign In to Existing Account
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. Page Header (Centered above the form)                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-2">
        {/* Top: Small, rounded square badge containing a storefront icon */}
        <div 
          id="merchant-header-badge"
          className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center mb-4 shadow-lg shadow-black/40"
        >
          <Store className="w-6 h-6 text-slate-300" />
        </div>

        {/* Title: 'Register your business' */}
        <h1 
          id="merchant-header-title"
          className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2"
        >
          Register your business
        </h1>

        {/* Subtitle */}
        <p 
          id="merchant-header-subtitle"
          className="text-slate-400 text-sm sm:text-base leading-relaxed"
        >
          Make your products discoverable and transactable by AI buyers.
        </p>
      </div>

      {/* Error & Success Feedback Alerts */}
      {errorMessage && (
        <div className="max-w-3xl w-full my-4 p-3.5 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="max-w-3xl w-full my-4 p-3.5 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Main Form Card                                                         */}
      {/* ========================================================================= */}
      <div 
        id="merchant-form-card"
        className="max-w-3xl w-full bg-[#151c2f] rounded-2xl p-6 sm:p-10 border border-slate-800 my-6 shadow-2xl text-slate-100"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --------------------------------------------------------------------- */}
          {/* Section 1: BUSINESS INFORMATION                                      */}
          {/* --------------------------------------------------------------------- */}
          <div id="section-business-information" className="space-y-4">
            <div className="text-purple-400 text-xs font-bold tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>BUSINESS INFORMATION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1: Business Name */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Business Name
                </label>
                <input
                  id="merchant-input-business-name"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Row 1: Business Category (Dropdown Select) */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Business Category
                </label>
                <select
                  id="merchant-select-business-category"
                  required
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Computer Hardware & Laptops">Computer Hardware & Laptops</option>
                  <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                  <option value="Audio & Wearables">Audio & Wearables</option>
                  <option value="Home & Kitchen Appliances">Home & Kitchen Appliances</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Office & Industrial Supplies">Office & Industrial Supplies</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Row 2: Business Email */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Business Email
                </label>
                <input
                  id="merchant-input-business-email"
                  type="email"
                  required
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Row 2: Business Phone */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Business Phone
                </label>
                <input
                  id="merchant-input-business-phone"
                  type="tel"
                  required
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* Section 2: BUSINESS ADDRESS                                          */}
          {/* --------------------------------------------------------------------- */}
          <div id="section-business-address" className="space-y-4 pt-2">
            <div className="text-purple-400 text-xs font-bold tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>BUSINESS ADDRESS</span>
            </div>

            <div className="space-y-4">
              {/* Row 1: Street Address (Full Width) */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Street Address
                </label>
                <input
                  id="merchant-input-street-address"
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Innovation Way, Suite 100"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Row 2: 3 Columns (City, State, Pincode) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    City
                  </label>
                  <input
                    id="merchant-input-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    State
                  </label>
                  <select
                    id="merchant-select-state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                  >
                    <option value="" disabled>State</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Texas">Texas</option>
                    <option value="Washington">Washington</option>
                    <option value="Massachusetts">Massachusetts</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Florida">Florida</option>
                    <option value="Colorado">Colorado</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other">Other Region / State</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Pincode
                  </label>
                  <input
                    id="merchant-input-pincode"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="94105"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* Section 3: CONTACT PERSON                                            */}
          {/* --------------------------------------------------------------------- */}
          <div id="section-contact-person" className="space-y-4 pt-2">
            <div className="text-purple-400 text-xs font-bold tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>CONTACT PERSON</span>
            </div>

            <div className="space-y-4">
              {/* Row 1: Owner / Contact Person Name (Full Width) */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Owner / Contact Person Name
                </label>
                <input
                  id="merchant-input-contact-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Row 2: 2 Columns (Contact Email & Contact Phone) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Contact Email
                  </label>
                  <input
                    id="merchant-input-contact-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Contact Phone
                  </label>
                  <input
                    id="merchant-input-contact-phone"
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Personal or direct line"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* Section 4: ACCOUNT SECURITY                                          */}
          {/* --------------------------------------------------------------------- */}
          <div id="section-account-security" className="space-y-4 pt-2">
            <div className="text-purple-400 text-xs font-bold tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>ACCOUNT SECURITY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="merchant-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    id="merchant-toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="merchant-input-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    id="merchant-toggle-confirm-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* 4. Form Actions (Bottom of the Card)                                 */}
          {/* --------------------------------------------------------------------- */}
          <div className="pt-4 space-y-4 border-t border-slate-800/80">
            {/* Checkbox: Terms of Service & Privacy Policy */}
            <div className="flex items-center gap-2.5">
              <input
                id="merchant-checkbox-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <label 
                htmlFor="merchant-checkbox-terms"
                className="text-xs text-slate-300 select-none cursor-pointer"
              >
                I agree to the{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-purple-400 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                &{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-purple-400 font-semibold hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button: Vibrant blue-to-purple gradient */}
            <button
              id="merchant-submit-create-account-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-lg mt-6 transition-all duration-200 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Merchant Account...</span>
              ) : (
                <>
                  <span>Create Merchant Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  id="merchant-link-to-signin"
                  onClick={() => onNavigate ? onNavigate('auth') : auth.openAuthModal()}
                  className="text-purple-400 font-semibold hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 5. Global Footer                                                          */}
      {/* ========================================================================= */}
      <div 
        id="merchant-global-footer-badge"
        className="bg-slate-800/50 border border-slate-700 text-slate-400 text-xs px-4 py-2 rounded-full flex items-center justify-center gap-2 mt-2 mb-8 text-center max-w-xl mx-auto shadow-md"
      >
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>After registration, you can add your products and make them discoverable to AI buyers.</span>
      </div>
    </div>
  );
};
