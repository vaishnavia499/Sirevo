import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Eye,
  ShoppingCart,
  TrendingUp,
  Share2,
  Bell,
  History,
  Settings,
  HelpCircle,
  Menu,
  X,
  Search,
  Sparkles,
  LogOut,
  Store,
  ShieldCheck
} from 'lucide-react';

export const MerchantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/merchant/dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', path: '/merchant/products', icon: Package },
    { id: 'add-product', label: 'Add Product', path: '/merchant/add-product', icon: PlusCircle },
    { id: 'visibility', label: 'AI Visibility', path: '/merchant/visibility', icon: Eye },
    { id: 'orders', label: 'Orders & Payments', path: '/merchant/orders', icon: ShoppingCart },
    { id: 'suggestions', label: 'AI Suggestions', path: '/merchant/suggestions', icon: Share2 },
    { id: 'profile', label: 'Store Settings & Profile', path: '/merchant/profile', icon: Settings },
  ] as const;

  const currentPath = location.pathname.toLowerCase();

  const isItemActive = (itemPath: string, itemId: string) => {
    if (currentPath === itemPath) return true;
    if (itemId === 'dashboard' && (currentPath === '/merchant' || currentPath === '/merchant-dashboard')) return true;
    if (itemId === 'products' && currentPath.includes('/products')) return true;
    if (itemId === 'add-product' && currentPath.includes('/add-product')) return true;
    if (itemId === 'visibility' && (currentPath.includes('/visibility') || currentPath.includes('/ai-visibility'))) return true;
    if (itemId === 'orders' && (currentPath.includes('/orders') || currentPath.includes('/merchant-orders'))) return true;
    if (itemId === 'suggestions' && (currentPath.includes('/suggestions') || currentPath.includes('/ai-suggestions'))) return true;
    if (itemId === 'profile' && (currentPath.includes('/profile') || currentPath.includes('/settings'))) return true;
    return false;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      id="merchant-application-layout"
      className="flex h-screen w-full bg-[#0B1121] overflow-hidden text-slate-100 font-sans antialiased selection:bg-purple-600 selection:text-white"
    >
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          id="merchant-mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. SIDEBAR: Fixed width, full height, independent internal scrolling     */}
      {/* ========================================================================= */}
      <aside
        id="merchant-sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-full bg-[#151c2f] flex flex-col flex-shrink-0 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo area */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div 
            onClick={() => handleNavClick('/merchant/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                Sirevo AI
              </h1>
              <p className="text-xs text-purple-400 font-medium flex items-center gap-1">
                <span>Merchant Hub</span>
                <ShieldCheck className="w-3 h-3 text-purple-400" />
              </p>
            </div>
          </div>

          <button
            type="button"
            id="merchant-close-sidebar-btn"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Info Pill */}
        {user && (
          <div className="mx-4 mt-4 p-2.5 rounded-xl bg-[#0b1120] border border-slate-800 flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.storeName || user.name}</p>
              <p className="text-[10px] text-emerald-400 font-medium">● Verified Seller</p>
            </div>
          </div>
        )}

        {/* Middle: Navigation Links (Flex-1 allows it to take up remaining space and push the bottom section down) */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path, item.id);

            return (
              <button
                key={item.id}
                id={`merchant-layout-nav-${item.id}`}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Upgrade button, settings, etc. (Sticks to the bottom with mt-auto) */}
        <div className="p-4 mt-auto border-t border-slate-800 space-y-2 shrink-0">
          <button
            id="merchant-layout-upgrade-btn"
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-2.5 px-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-lg shadow-purple-950/40 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Upgrade to Pro</span>
          </button>

          <button
            type="button"
            id="merchant-layout-support-btn"
            onClick={() => alert('Support Help Desk: Available 24/7 at support@sirevo.ai')}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Merchant Support</span>
          </button>

          <button
            type="button"
            id="merchant-layout-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER: Takes up remaining width, independent scrolling */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Top Navigation Bar: Fixed at the top of the content area */}
        <header
          id="merchant-layout-topbar"
          className="h-20 flex-shrink-0 flex items-center px-4 sm:px-8 bg-[#0B1121] border-b border-slate-800 justify-between gap-4"
        >
          {/* Mobile menu trigger */}
          <button
            type="button"
            id="merchant-topbar-mobile-menu"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-[#151c2f] border border-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search input */}
          <div className="relative flex-1 max-w-xs sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="merchant-layout-search-pill"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, orders, AI metrics..."
              className="w-full bg-[#151c2f] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Right: Notifications, History, Help, Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              id="merchant-topbar-notifications"
              type="button"
              className="p-2 rounded-full bg-[#151c2f] border border-slate-800 text-slate-400 hover:text-white transition-colors relative cursor-pointer"
              title="Merchant Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </button>

            <button
              id="merchant-topbar-history"
              type="button"
              className="p-2 rounded-full bg-[#151c2f] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Activity Logs"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              id="merchant-topbar-help-link"
              type="button"
              onClick={() => alert('Sirevo Merchant Help: Guides on Product Indexing, Dynamic AI Prompts & Webhooks.')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-1 cursor-pointer hidden sm:block"
            >
              Help
            </button>

            {/* Merchant Avatar linking to Profile */}
            <div
              id="merchant-topbar-avatar"
              onClick={() => handleNavClick('/merchant/profile')}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:border-purple-500 hover:text-purple-300 transition-colors"
              title="Merchant Profile & Settings"
            >
              {user ? (user.storeName || user.name).slice(0, 2).toUpperCase() : 'MI'}
            </div>

            <button
              id="merchant-topbar-logout-btn"
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-full bg-[#151c2f] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content: Scrollable area for the actual pages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Upgrade to Pro Merchant</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Unlock deep AI buyer telemetry, automatic dynamic pricing optimization, and custom ERP webhooks.</p>
              <div className="p-3 bg-slate-900 rounded-lg border border-purple-500/40">
                <span className="font-bold text-white text-sm block">Pro Tier — ₹2,999/mo</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Includes 0% marketplace commission on first 500 AI orders.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Pro Tier activated successfully for your merchant account!');
                  setShowUpgradeModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantLayout;
