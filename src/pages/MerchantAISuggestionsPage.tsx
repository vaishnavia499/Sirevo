import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Share2,
  Clock,
  Sparkles,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  FileText,
  Laptop,
  ChevronDown,
  ChevronUp,
  Brain,
  Rocket,
  Sliders,
  Check,
  Zap,
  Info,
  LogOut
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';

interface MerchantAISuggestionsPageProps {
  onNavigate?: NavigationHandler;
}

export const MerchantAISuggestionsPage: React.FC<MerchantAISuggestionsPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  // Navigation & UI States
  const [activeNav, setActiveNav] = useState<string>('suggestions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Interactive Action Modals
  const [activeModal, setActiveModal] = useState<'price' | 'specs' | 'delivery' | null>(null);
  const [currentPrice, setCurrentPrice] = useState('56999');
  const [proposedPrice, setProposedPrice] = useState('54900');
  const [selectedBattery, setSelectedBattery] = useState('57Wh Li-Polymer');
  const [selectedWeight, setSelectedWeight] = useState('1.89 kg');
  const [deliveryDays, setDeliveryDays] = useState('2');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setIsMobileSidebarOpen(false);
    if (!onNavigate) return;
    if (id === 'dashboard') onNavigate('merchant-dashboard');
    if (id === 'products') onNavigate('merchant-products');
    if (id === 'visibility') onNavigate('merchant-ai-visibility');
    if (id === 'orders') onNavigate('merchant-orders');
    if (id === 'revenue') onNavigate('merchant-revenue');
    if (id === 'suggestions') onNavigate('merchant-ai-suggestions');
  };

  const handleApplyPriceChange = () => {
    setActionSuccessMessage(`Successfully updated Lenovo IdeaPad price to ₹${Number(proposedPrice).toLocaleString('en-IN')}! AI agents will now see the competitive rate.`);
    setActiveModal(null);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleApplySpecsChange = () => {
    setActionSuccessMessage(`Updated specifications (Battery: ${selectedBattery}, Weight: ${selectedWeight}). AI Match raised to 94%!`);
    setActiveModal(null);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleApplyDeliveryChange = () => {
    setActionSuccessMessage(`Express delivery configured for ${deliveryDays} Business Days. AI buy-intent conversion improved!`);
    setActiveModal(null);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  return (
    <div id="merchant-ai-growth-actions-layout" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* Notification Success Toast */}
      {actionSuccessMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{actionSuccessMessage}</span>
          <button
            type="button"
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
          {/* 2. PAGE HEADER & SUMMARY BANNER                                       */}
          {/* ===================================================================== */}
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-purple-400 stroke-[2.5]" />
              <h1
                id="merchant-ai-growth-actions-title"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                AI Growth Actions
              </h1>
            </div>
            <p
              id="merchant-ai-growth-actions-subtitle"
              className="text-sm text-slate-400 mt-1"
            >
              Prioritized actions to help your products perform better with AI buyers.
            </p>
          </div>

          {/* Summary Banner */}
          <div
            id="summary-banner-card"
            className="bg-[#151c2f] border border-slate-800 rounded-xl p-4 sm:p-5 mt-6 shadow-sm space-y-2"
          >
            {/* Top Row (Flex) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Growth Actions</span>
              </div>
              <span className="text-slate-400 font-medium">• 3 actions available</span>

              {/* Pill Badges */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/70 border border-rose-800 text-rose-400">
                  2 HIGH IMPACT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/70 border border-blue-800 text-blue-400">
                  1 MEDIUM IMPACT
                </span>
              </div>
            </div>

            {/* Bottom Row */}
            <p className="text-xs text-slate-400">
              Based on recent AI buyer searches, comparisons and purchases.
            </p>
          </div>

          {/* ===================================================================== */}
          {/* 3. ACTION CARDS GRID (3 Columns)                                      */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* ------------------------------------------------------------------- */}
            {/* Card 1 (Price Comparison - High Impact)                             */}
            {/* ------------------------------------------------------------------- */}
            <div
              id="action-card-price-comparison"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                {/* Header with Red circular icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      Your laptop is losing price comparisons
                    </h3>
                  </div>
                </div>

                {/* Badge: High Impact */}
                <div className="mt-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/70 border border-rose-800/80 text-rose-400">
                    High Impact
                  </span>
                </div>

                {/* Data Block */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-4 my-4 space-y-3">
                  {/* Yours vs Average */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Yours</span>
                    <span className="text-white text-sm">₹56,999</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Average</span>
                    <span className="text-emerald-400 text-sm">₹54,999</span>
                  </div>

                  {/* Horizontal visual progress bars */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full w-[88%]" />
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full w-[76%]" />
                    </div>
                  </div>
                </div>

                {/* Context */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consider reviewing your price to stay competitive with similar products.
                </p>
              </div>

              {/* Action & Footer */}
              <div className="pt-5 space-y-2">
                <button
                  id="btn-review-price"
                  type="button"
                  onClick={() => setActiveModal('price')}
                  className="w-full bg-blue-200 text-blue-900 hover:bg-blue-300 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Review Price</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Impact: Improve price competitiveness
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* Card 2 (Product Specifications - Medium Impact)                     */}
            {/* ------------------------------------------------------------------- */}
            <div
              id="action-card-specifications"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                {/* Header with Blue circular icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      Complete 2 product specifications
                    </h3>
                  </div>
                </div>

                {/* Badge: Medium Impact */}
                <div className="mt-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-950/70 border border-blue-800/80 text-blue-400">
                    Medium Impact
                  </span>
                </div>

                {/* Data Block: Vertical List with 2 check circles */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-4 my-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Battery capacity</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Product weight</span>
                  </div>
                </div>

                {/* Context */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  These specifications are frequently used by AI buyers when comparing laptops.
                </p>
              </div>

              {/* Action & Footer */}
              <div className="pt-5 space-y-2">
                <button
                  id="btn-complete-details"
                  type="button"
                  onClick={() => setActiveModal('specs')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Complete Details</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Impact: Improve AI matching
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* Card 3 (Delivery Speed - High Impact)                               */}
            {/* ------------------------------------------------------------------- */}
            <div
              id="action-card-delivery-speed"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                {/* Header with Red circular icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      Your competitors deliver faster
                    </h3>
                  </div>
                </div>

                {/* Badge: High Impact */}
                <div className="mt-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/70 border border-rose-800/80 text-rose-400">
                    High Impact
                  </span>
                </div>

                {/* Data Block: You vs Competitors */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-4 my-4 flex items-center justify-between text-center">
                  <div className="text-left">
                    <span className="text-[11px] text-slate-400 block font-medium">You</span>
                    <span className="text-sm sm:text-base font-bold text-white">3-4 Days</span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Competitors</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-400">1-2 Days</span>
                  </div>
                </div>

                {/* Context */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consider improving your delivery estimate to become more competitive.
                </p>
              </div>

              {/* Action & Footer */}
              <div className="pt-5 space-y-2">
                <button
                  id="btn-review-delivery"
                  type="button"
                  onClick={() => setActiveModal('delivery')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Review Delivery</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Impact: Improve purchase competitiveness
                </p>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. PRODUCT PERFORMANCE SECTION                                        */}
          {/* ===================================================================== */}
          <div className="mt-10">
            <h2
              id="product-performance-section-title"
              className="text-lg sm:text-xl font-bold text-white tracking-tight"
            >
              Product Performance
            </h2>

            {/* Performance Card */}
            <div
              id="product-performance-card"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 mt-4 shadow-sm space-y-6"
            >
              {/* Top Row: Product Thumbnail + Title + Insight Subtext */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0">
                  <Laptop className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Lenovo IdeaPad Slim 5
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    <span className="font-semibold text-slate-300">Insight:</span> Your product gets strong visibility, but there is an opportunity to improve conversion.
                  </p>
                </div>
              </div>

              {/* Funnel Row: Centered connected metric blocks */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
                  
                  {/* Block 1: Searches */}
                  <div className="bg-[#151c2f] border border-slate-800 rounded-xl p-4 w-full sm:w-36 text-center shadow-xs">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                      320
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                      SEARCHES
                    </span>
                  </div>

                  {/* Arrow 1 */}
                  <div className="text-slate-600 hidden sm:block">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  {/* Block 2: Shortlisted */}
                  <div className="bg-[#151c2f] border border-slate-800 rounded-xl p-4 w-full sm:w-36 text-center shadow-xs">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                      86
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                      SHORTLISTED
                    </span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="text-slate-600 hidden sm:block">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  {/* Block 3: Purchased (Drop-off indicator) */}
                  <div className="bg-[#151c2f] border border-rose-950/80 rounded-xl p-4 w-full sm:w-36 text-center shadow-xs">
                    <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 block">
                      24
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                      PURCHASED
                    </span>
                  </div>

                </div>
              </div>

              {/* Bottom Right Action */}
              <div className="flex justify-end pt-2">
                <button
                  id="btn-view-product-insights"
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('merchant-ai-visibility');
                  }}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Product Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5. AI INSIGHT ACCORDION (Footer)                                      */}
          {/* ===================================================================== */}
          <div className="mt-6">
            <button
              type="button"
              id="ai-insight-accordion-btn"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full bg-[#151c2f] border border-slate-800 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-colors shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white">
                  How did AI identify these actions?
                </span>
              </div>

              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Accordion Expand Content */}
            {isAccordionOpen && (
              <div className="bg-[#13192a] border-x border-b border-slate-800 rounded-b-xl p-5 text-xs text-slate-300 space-y-3 animate-in fade-in slide-in-from-top-1">
                <p className="leading-relaxed">
                  Sirevo AI continuously monitors shopping conversational intent, agent evaluation pipelines, and final checkout conversions across categories:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-semibold text-white block">Price Competitiveness</span>
                    <p className="text-slate-400 text-[11px]">
                      Comparing live catalog prices against top 5 shortlisted alternatives in the ₹50,000–₹60,000 laptop segment.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-semibold text-white block">Attribute Completeness</span>
                    <p className="text-slate-400 text-[11px]">
                      AI prompt filters check for exact specs before presenting products to tech-focused buyers.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-semibold text-white block">Fulfillment Velocity</span>
                    <p className="text-slate-400 text-[11px]">
                      Urgent buyer agents enforce strict delivery threshold penalties on listings taking &gt;3 days.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

      {/* ======================================================================= */}
      {/* ACTION 1 MODAL: REVIEW PRICE                                            */}
      {/* ======================================================================= */}
      {activeModal === 'price' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">Optimize Product Price</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Current Listed Price (INR)</label>
                <input
                  type="text"
                  disabled
                  value={`₹${Number(currentPrice).toLocaleString('en-IN')}`}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Proposed Competitive Price (INR)</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-500 text-white font-bold rounded-lg px-3 py-2 focus:outline-none"
                />
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Targeting ₹54,900 puts you in top 3 recommended results.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyPriceChange}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer"
              >
                Save New Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* ACTION 2 MODAL: COMPLETE DETAILS                                        */}
      {/* ======================================================================= */}
      {activeModal === 'specs' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">Complete Specifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">Battery Capacity</label>
                <input
                  type="text"
                  value={selectedBattery}
                  onChange={(e) => setSelectedBattery(e.target.value)}
                  placeholder="e.g. 57Wh Rapid Charge"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Product Weight</label>
                <input
                  type="text"
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  placeholder="e.g. 1.89 kg"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplySpecsChange}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer"
              >
                Update Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* ACTION 3 MODAL: REVIEW DELIVERY                                         */}
      {/* ======================================================================= */}
      {activeModal === 'delivery' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">Fulfillment & Delivery</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">Guaranteed Delivery Estimate</label>
                <select
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="1">1 Business Day (Next-Day Prime)</option>
                  <option value="2">1-2 Business Days (Express)</option>
                  <option value="3">3-4 Business Days (Standard)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                Partnering with localized fulfillment centers reduces delivery times and ranks products 35% higher.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyDeliveryChange}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer"
              >
                Apply Shipping Speed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantAISuggestionsPage;
