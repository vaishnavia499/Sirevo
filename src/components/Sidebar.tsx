import React from 'react';
import { 
  Home, 
  Search, 
  Scale, 
  ShoppingBag, 
  ShoppingCart,
  Sparkles,
  HelpCircle,
  LogOut,
  LogIn,
  Menu,
  User,
  Store
} from 'lucide-react';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

interface SidebarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, query?: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAIAssistant?: () => void;
  cartCount?: number;
}

export const NAV_ITEMS: { id: PageRoute; label: string; path: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', path: '/home', icon: Home },
  { id: 'search', label: 'Search', path: '/search', icon: Search },
  { id: 'compare', label: 'Compare', path: '/compare', icon: Scale },
  { id: 'orders', label: 'Orders', path: '/orders', icon: ShoppingBag },
  { id: 'cart', label: 'Cart', path: '/cart', icon: ShoppingCart },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAIAssistant,
  cartCount = 0
}) => {
  const { isAuthenticated, user, userRole, logout, openAuthModal } = useAuth();
  const { compareList } = useCompare();

  const handleAskSirevo = () => {
    if (!isAuthenticated) {
      openAuthModal(() => {
        if (onOpenAIAssistant) {
          onOpenAIAssistant();
        } else {
          onNavigate('search', 'Show my active orders and recommended accessories');
        }
      });
      if (onCloseMobile) onCloseMobile();
      return;
    }

    if (onOpenAIAssistant) {
      onOpenAIAssistant();
    } else {
      onNavigate('search', 'Show my active orders and recommended accessories');
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container (Fixed dark sidebar bg-[#1F2937]) */}
      <aside
        id="customer-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-30 bg-[#1F2937] text-slate-300 flex flex-col border-r border-slate-750/70 shadow-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[74px]' : 'w-64'
        } ${
          isOpenMobile ? 'translate-x-0' : 'max-lg:-translate-x-full'
        }`}
      >
        {/* Top Header: Sirevo AI Logo */}
        <div className={`pt-5 pb-4 border-b border-slate-700/60 ${isCollapsed ? 'px-3 text-center' : 'px-5'}`}>
          <div className="flex items-center justify-between gap-2.5">
            {!isCollapsed ? (
              <div 
                onClick={() => {
                  onNavigate('home');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30 shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <h1 className="font-bold text-base text-white tracking-tight leading-tight truncate">Sirevo AI</h1>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {userRole === 'merchant' ? 'Merchant Hub' : 'Intelligent Shopping'}
                  </p>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => {
                  onNavigate('home');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30 cursor-pointer"
                title="Sirevo AI"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}

            <button
              id="sidebar-menu-toggle-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle menu width"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated && user && !isCollapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-xl bg-[#111827] border border-slate-700/70 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shrink-0">
              {userRole === 'merchant' ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">
                {userRole === 'merchant' ? '🏬 Merchant' : '👤 Customer'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'orders' && (currentPage === 'payment' || currentPage === 'payment-success'));
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                title={isCollapsed ? item.label : undefined}
                onClick={() => {
                  // Role protection: If merchant tries to open Cart, redirect to merchant-dashboard
                  if (userRole === 'merchant' && item.id === 'cart') {
                    onNavigate('merchant-dashboard');
                  } else {
                    onNavigate(item.id);
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center rounded-xl transition-all cursor-pointer relative ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium'
                } ${
                  isActive
                    ? 'bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                {item.id === 'compare' && compareList.length > 0 && (
                  <span className={`${isCollapsed ? 'absolute top-1.5 right-1.5 w-4 h-4 text-[9px]' : 'px-2 py-0.5 text-[10px]'} font-extrabold rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs`}>
                    {compareList.length}
                  </span>
                )}
                {item.id === 'cart' && cartCount > 0 && (
                  <span className={`${isCollapsed ? 'absolute top-1.5 right-1.5 w-4 h-4 text-[9px]' : 'px-2 py-0.5 text-[10px]'} font-extrabold rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs`}>
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Primary Action Button & Utility Links */}
        <div className="p-3 space-y-2 border-t border-slate-700/60">
          {/* Ask Sirevo Primary Button */}
          {!isCollapsed ? (
            <button
              onClick={handleAskSirevo}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 group-hover:rotate-12 transition-transform" />
              <span>Ask Sirevo</span>
            </button>
          ) : (
            <button
              onClick={handleAskSirevo}
              title="Ask Sirevo"
              className="w-full p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Help Center */}
          <button
            onClick={() => {
              onNavigate('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed ? "Help Center" : undefined}
            className={`w-full flex items-center rounded-xl transition-all cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2 text-xs font-medium'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span className="truncate">Help Center</span>}
          </button>

          {/* Log Out / Sign In Button */}
          {isAuthenticated ? (
            <button
              id="sidebar-logout-btn"
              onClick={() => {
                logout();
                onNavigate('home');
                if (onCloseMobile) onCloseMobile();
              }}
              title={isCollapsed ? "Log Out" : undefined}
              className={`w-full flex items-center rounded-xl transition-all cursor-pointer text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2 text-xs font-medium'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-400" />
              {!isCollapsed && <span className="truncate">Log Out</span>}
            </button>
          ) : (
            <button
              id="sidebar-signin-btn"
              onClick={() => {
                openAuthModal();
                if (onCloseMobile) onCloseMobile();
              }}
              title={isCollapsed ? "Sign In" : undefined}
              className={`w-full flex items-center rounded-xl transition-all cursor-pointer text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2 text-xs font-semibold'
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0 text-purple-400" />
              {!isCollapsed && <span className="truncate">Sign In / Register</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
