import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Share2,
  Clock,
  Settings,
  HelpCircle,
  Search,
  RefreshCw,
  Bell,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Filter,
  ExternalLink,
  Laptop,
  Headphones,
  ArrowUpRight,
  Plus,
  LogOut
} from 'lucide-react';
import { NavigationHandler, PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { getStoredMerchantProducts } from '../utils/merchantProducts';

interface MerchantDashboardPageProps {
  onNavigate?: NavigationHandler;
  embedded?: boolean;
}

export const MerchantDashboardPage: React.FC<MerchantDashboardPageProps> = ({ onNavigate, embedded = false }) => {
  const { user, logout } = useAuth();
  const products = getStoredMerchantProducts();
  
  // Navigation & Tabs state
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'products' | 'visibility' | 'orders' | 'revenue' | 'suggestions'
  >('dashboard');
  const [activeTopTab, setActiveTopTab] = useState<'global' | 'marketplace' | 'analytics'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSyncData = () => {
    setIsSyncing(true);
    setSyncNotification('Syncing inventory & AI telemetry...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotification('Inventory & AI match telemetry synced successfully!');
      setTimeout(() => setSyncNotification(null), 3000);
    }, 1200);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  return (
    <div id="merchant-dashboard-content" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* Sync Toast Feedback */}
      {syncNotification && (
        <div className="p-3 bg-blue-950/80 border border-blue-800 rounded-xl text-blue-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{syncNotification}</span>
        </div>
      )}
          
          {/* ===================================================================== */}
          {/* 3. DASHBOARD HEADER                                                   */}
          {/* ===================================================================== */}
          <div>
            <h1 
              id="merchant-dashboard-title"
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              Merchant Overview
            </h1>
            <p 
              id="merchant-dashboard-subtitle"
              className="text-sm text-slate-400 mt-1"
            >
              AI performance and sales metrics for your store.
            </p>
          </div>

          {/* ===================================================================== */}
          {/* 4. TOP METRIC CARDS (Grid of 4)                                       */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: TOTAL PRODUCTS */}
            <div 
              id="metric-card-total-products"
              onClick={() => {
                if (onNavigate) onNavigate('merchant-products');
              }}
              className="bg-[#151c2f] border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 flex flex-col justify-between shadow-sm cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 group-hover:text-purple-300 transition-colors">
                  TOTAL PRODUCTS
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-purple-400 transition-colors">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-white tracking-tight">{products.length}</div>
                <span className="text-[11px] text-purple-400 font-medium group-hover:underline flex items-center gap-0.5">
                  Manage stock →
                </span>
              </div>
            </div>

            {/* Card 2: AI SEARCHES */}
            <div 
              id="metric-card-ai-searches"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  AI SEARCHES
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">320</div>
            </div>

            {/* Card 3: SHORTLISTED */}
            <div 
              id="metric-card-shortlisted"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  SHORTLISTED
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">86</div>
            </div>

            {/* Card 4: PURCHASED */}
            <div 
              id="metric-card-purchased"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  PURCHASED
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">24</span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +15%
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5. REVENUE & VISIBILITY SECTION (2 Columns)                           */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Revenue Card */}
            <div 
              id="merchant-revenue-card"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md"
            >
              <div>
                <h3 className="text-lg font-bold text-white">Revenue</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total Earnings</p>

                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    ₹1,24,500
                  </div>
                  <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+8.4% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Decorative Mock Area Chart */}
              <div className="mt-6 pt-4 border-t border-slate-800/40">
                <div className="h-20 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,60 Q40,40 80,45 T160,25 T240,30 T300,10 L300,80 L0,80 Z"
                      fill="url(#revenueGrad)"
                    />
                    <path
                      d="M0,60 Q40,40 80,45 T160,25 T240,30 T300,10"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Visibility Card */}
            <div 
              id="merchant-ai-visibility-card"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-md"
            >
              <div>
                <h3 className="text-lg font-bold text-white">AI Visibility</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your products appeared in 320 AI shopping searches.
                </p>

                {/* Row of 3 mini-metrics */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#0B1121]/60 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Searches
                    </span>
                    <span className="text-lg font-bold text-white">320</span>
                  </div>
                  <div className="bg-[#0B1121]/60 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Shortlisted
                    </span>
                    <span className="text-lg font-bold text-white">86</span>
                  </div>
                  <div className="bg-[#0B1121]/60 border border-slate-800 rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Purchased
                    </span>
                    <span className="text-lg font-bold text-white">24</span>
                  </div>
                </div>
              </div>

              {/* Average AI Match Score with horizontal progress bar */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Average AI Match Score
                    </span>
                    <span className="text-[11px] text-slate-400">
                      How well your products align with user intent.
                    </span>
                  </div>
                  <span className="text-base font-bold text-white">85%</span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 6. AI INTELLIGENCE SECTION (2 Columns)                                */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* AI Suggestions Card (Left) */}
            <div 
              id="merchant-ai-suggestions-card"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-lg font-bold text-white">AI Suggestions</h3>
              </div>

              <div className="space-y-3">
                {/* Card 1 */}
                <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-white">
                    Increase stock for Lenovo Slim 5
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    High AI intent detected in recent searches for &quot;gaming laptops&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedSuggestion('Lenovo Slim 5')}
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 mt-3 cursor-pointer transition-colors"
                  >
                    <span>Action Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-[#1e293b] rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-white">
                    Optimize keywords for Sony WH-1000XM5
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Adding &quot;noise-canceling&quot; boosts match rate by 12%.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedSuggestion('Sony WH-1000XM5')}
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 mt-3 cursor-pointer transition-colors"
                  >
                    <span>Action Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent AI Actions Card (Right) */}
            <div 
              id="merchant-recent-ai-actions-card"
              className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-md"
            >
              <h3 className="text-lg font-bold text-white mb-4">Recent AI Actions</h3>

              {/* Vertical timeline list */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#151c2f]" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-medium">Just now</span> — User compared{' '}
                    <span className="text-blue-400 font-semibold">Lenovo IdeaPad</span> in search{' '}
                    <span className="italic text-slate-400">&quot;Laptops under 60k&quot;</span>.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-[#151c2f]" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-medium">15 mins ago</span> — AI matched{' '}
                    <span className="text-purple-400 font-semibold">Samsung S23</span> with 92% confidence for query{' '}
                    <span className="italic text-slate-400">&quot;best camera phone compact&quot;</span>.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-[#151c2f]" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-medium">45 mins ago</span> — Product{' '}
                    <span className="text-blue-400 font-semibold">MacBook Air M2</span> shortlisted by user after AI recommendation.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-[#151c2f]" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-medium">2 hours ago</span> — System indexed{' '}
                    <span className="text-emerald-400 font-semibold">5 new products</span> for AI search visibility.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 7. PRODUCTS DATA TABLE                                                */}
          {/* ===================================================================== */}
          <div 
            id="merchant-products-table-card"
            className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Products</h3>
              <button
                type="button"
                id="merchant-view-all-products-btn"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4">Stock</th>
                    <th className="pb-3 px-4">AI Match</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {/* Row 1: Lenovo IdeaPad Slim 5 */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                          <Laptop className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Lenovo IdeaPad Slim 5</div>
                          <div className="text-[11px] text-slate-400">SKU: LEN-SL5-16</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">₹55,000</td>
                    <td className="py-4 px-4">
                      <span className="text-rose-400 font-bold">2 left</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-xs">94%</span>
                        <div className="w-20 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-[94%]" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: Sony WH-1000XM5 */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                          <Headphones className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Sony WH-1000XM5</div>
                          <div className="text-[11px] text-slate-400">SKU: SNY-XM5-BLK</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">₹29,990</td>
                    <td className="py-4 px-4 text-slate-300 font-medium">41</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-xs">88%</span>
                        <div className="w-20 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-[88%]" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 8. ORDERS & PAYMENTS DATA TABLE                                       */}
          {/* ===================================================================== */}
          <div 
            id="merchant-orders-table-card"
            className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Orders & Payments</h3>
              <button
                type="button"
                id="merchant-view-all-orders-btn"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 px-4">Product</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Method</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {/* Order 1 */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4 font-mono text-xs text-slate-300">#ORD-9871</td>
                    <td className="py-4 px-4 font-medium text-white">Lenovo IdeaPad Slim 5</td>
                    <td className="py-4 px-4 font-semibold text-white">₹55,000</td>
                    <td className="py-4 px-4 text-slate-300">UPI</td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
                        Paid
                      </span>
                    </td>
                  </tr>

                  {/* Order 2 */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pr-4 font-mono text-xs text-slate-300">#ORD-9820</td>
                    <td className="py-4 px-4 font-medium text-white">Sony WH-1000XM5</td>
                    <td className="py-4 px-4 font-semibold text-white">₹29,990</td>
                    <td className="py-4 px-4 text-slate-300">Credit Card</td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/80">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

      {/* Suggestion Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">AI Optimization Action</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Target product: <strong className="text-white">{selectedSuggestion}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Applying this recommendation increases visibility in direct natural language queries by up to 24% according to our ranking algorithm.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Recommendation applied for ${selectedSuggestion}!`);
                  setSelectedSuggestion(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer"
              >
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
