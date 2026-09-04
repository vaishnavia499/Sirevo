import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { AuthModal } from '../components/AuthModal';
import { CompareDrawer } from '../components/CompareDrawer';
import { useAuth } from '../context/AuthContext';
import { PageRoute } from '../types';
import { 
  Menu, 
  Sparkles, 
  Search, 
  ShoppingCart, 
  User, 
  LogIn, 
  LogOut, 
  Bell,
  ArrowRight,
  Mic
} from 'lucide-react';
import { startVoiceRecognition } from '../utils/speech';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';

export interface CustomerLayoutProps {
  cartCount?: number;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, userRole, logout, openAuthModal } = useAuth();
  const { executeSearch } = useSearch();
  const { cart } = useCart();
  const effectiveCartCount = cart !== undefined ? cart.length : cartCount;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderListening, setIsHeaderListening] = useState(false);

  // Map path to PageRoute for sidebar highlighting
  const getPageFromPath = (path: string): PageRoute => {
    const clean = path.toLowerCase().replace(/\/$/, '') || '/';
    if (clean === '/' || clean === '/home') return 'home';
    if (clean === '/search') return 'search';
    if (clean === '/product-detail' || clean.startsWith('/product')) return 'product-detail';
    if (clean === '/compare') return 'compare';
    if (clean === '/payment' || clean === '/secure-payment') return 'payment';
    if (clean === '/payment-success' || clean === '/order-success') return 'payment-success';
    if (clean === '/ai-history' || clean === '/history') return 'ai-history';
    if (clean === '/orders') return 'orders';
    if (clean === '/cart') return 'cart';
    if (clean === '/profile') return 'profile';
    if (clean === '/settings') return 'settings';
    return 'home';
  };

  const currentPage = getPageFromPath(location.pathname);

  const handleNavigate = (page: PageRoute, query?: string) => {
    switch (page) {
      case 'home':
        navigate('/home');
        break;
      case 'search':
        navigate('/search', { state: { query } });
        break;
      case 'product-detail':
        navigate('/product-detail');
        break;
      case 'compare':
        navigate('/compare');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'payment':
        navigate('/secure-payment');
        break;
      case 'payment-success':
        navigate('/payment-success');
        break;
      case 'ai-history':
        navigate('/ai-history');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        navigate('/home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = headerSearchQuery.trim();
    if (!cleanQuery) return;
    executeSearch(cleanQuery);
    navigate('/search', { state: { query: cleanQuery } });
  };

  const handleHeaderVoiceSearch = () => {
    startVoiceRecognition({
      onTranscript: (text) => {
        setHeaderSearchQuery(text);
      },
      onListeningChange: (listening) => {
        setIsHeaderListening(listening);
      },
      onFinalTranscript: (finalText) => {
        const cleanText = finalText.trim();
        if (cleanText) {
          executeSearch(cleanText);
          navigate('/search', { state: { query: cleanText } });
        }
      }
    });
  };

  return (
    <div 
      id="customer-application-layout"
      className="min-h-screen bg-[#111827] text-slate-100 flex font-sans antialiased selection:bg-purple-600 selection:text-white relative overflow-x-hidden"
    >
      {/* Subtle ambient background glow */}
      <div className="fixed top-0 right-0 w-[550px] h-[550px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Customer Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        cartCount={effectiveCartCount}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${
          isSidebarCollapsed ? 'lg:pl-[74px]' : 'lg:pl-64'
        }`}
      >
        {/* Customer Global Top Navigation Bar */}
        <header 
          id="customer-top-header"
          className="sticky top-0 z-30 bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4"
        >
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              id="customer-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2" onClick={() => navigate('/home')}>
              <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">Sirevo</span>
            </div>
          </div>

          {/* Customer Global Search Bar */}
          <form 
            onSubmit={handleHeaderSearch}
            className="flex-1 max-w-xl hidden sm:flex items-center relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="customer-global-search-input"
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Search products with AI (e.g. 16GB RAM laptop under ₹60k)..."
              className="w-full bg-[#151d32] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-full pl-9 pr-28 py-2 focus:border-purple-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleHeaderVoiceSearch}
              title={isHeaderListening ? "Listening..." : "Voice Search"}
              className={`absolute right-22 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer ${
                isHeaderListening ? 'text-rose-400 animate-pulse' : ''
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>AI Search</span>
            </button>
          </form>

          {/* Right actions: Cart, Auth / User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Cart Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => navigate('/cart')}
              className="p-2 rounded-full bg-[#151d32] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span 
                id="header-cart-badge-count"
                className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center transition-all ${
                  effectiveCartCount > 0 ? 'scale-100 opacity-100' : 'scale-90 opacity-80'
                }`}
              >
                {effectiveCartCount}
              </span>
            </button>

            {/* Auth / Profile CTA */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400">Customer</p>
                  </div>
                </div>

                <button
                  id="customer-header-logout-btn"
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/home');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-signin-btn"
                type="button"
                onClick={() => openAuthModal()}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Outlet for Customer Pages */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Auth Modal for Customer Actions */}
      <AuthModal onNavigate={(page) => handleNavigate(page as PageRoute)} />

      {/* Floating Comparison Drawer for Customer Storefront */}
      <CompareDrawer onNavigate={(page) => handleNavigate(page as PageRoute)} />
    </div>
  );
};

export default CustomerLayout;
