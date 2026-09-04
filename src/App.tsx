import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { PageRoute, CuratedProduct } from './types';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { MerchantLayout } from './layouts/MerchantLayout';

// Route Guards (RBAC)
import { CustomerGuard } from './components/routes/CustomerGuard';
import { MerchantGuard } from './components/routes/MerchantGuard';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetail } from './pages/ProductDetail';
import { ComparePage } from './pages/ComparePage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AIHistoryPage } from './pages/AIHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Standalone Public Auth Pages
import { AuthPage } from './pages/AuthPage';
import { CustomerSignUpPage } from './pages/CustomerSignUpPage';
import { MerchantRegisterPage } from './pages/MerchantRegisterPage';

// Merchant Pages (Each contains the dedicated Merchant Sidebar)
import { MerchantDashboardPage } from './pages/MerchantDashboardPage';
import { MerchantAddProductPage } from './pages/MerchantAddProductPage';
import { MerchantProductsPage } from './pages/MerchantProductsPage';
import { MerchantAIVisibilityPage } from './pages/MerchantAIVisibilityPage';
import { MerchantAISuggestionsPage } from './pages/MerchantAISuggestionsPage';
import { MerchantOrdersPage } from './pages/MerchantOrdersPage';
import { MerchantRevenuePage } from './pages/MerchantRevenuePage';
import { MerchantProfilePage } from './pages/MerchantProfilePage';

/**
 * Universal navigation hook adapter to provide backward-compatible `onNavigate`
 * to sub-components while enforcing declarative React Router URL paths.
 */
export function useAppNavigator(onSelectProduct?: (product: CuratedProduct) => void) {
  const navigate = useNavigate();

  return (page: PageRoute | string, query?: string | CuratedProduct | any) => {
    switch (page) {
      case 'home':
        navigate('/home');
        break;
      case 'search':
        navigate('/search', { state: { query } });
        break;
      case 'product-detail':
        if (query && typeof query === 'object') {
          if (onSelectProduct) onSelectProduct(query as CuratedProduct);
          navigate('/product-detail', { state: { product: query } });
        } else {
          navigate('/product-detail');
        }
        break;
      case 'compare':
        navigate('/compare');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'checkout':
      case 'payment':
        navigate('/checkout');
        break;
      case 'order-success':
      case 'payment-success':
        navigate('/order-success');
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
      case 'auth':
        navigate('/auth');
        break;
      case 'customer-signup':
        navigate('/customer-signup');
        break;
      case 'merchant-register':
        navigate('/merchant/register');
        break;
      case 'merchant-dashboard':
        navigate('/merchant/dashboard');
        break;
      case 'merchant-add-product':
        navigate('/merchant/add-product');
        break;
      case 'merchant-products':
        navigate('/merchant/products');
        break;
      case 'merchant-ai-visibility':
        navigate('/merchant/visibility');
        break;
      case 'merchant-ai-suggestions':
        navigate('/merchant/suggestions');
        break;
      case 'merchant-orders':
        navigate('/merchant/orders');
        break;
      case 'merchant-revenue':
        navigate('/merchant/revenue');
        break;
      case 'merchant-profile':
        navigate('/merchant/profile');
        break;
      default:
        navigate('/home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// Wrapper for SearchPage to extract router query state and support product selection
interface SearchPageWrapperProps {
  onNavigate: any;
  onViewDetails: (product: CuratedProduct) => void;
  onAddToCart?: (product: CuratedProduct) => void;
}

const SearchPageWrapper: React.FC<SearchPageWrapperProps> = ({ onNavigate, onViewDetails, onAddToCart }) => {
  const location = useLocation();
  const initialQuery = (location.state as any)?.query || (location.state as any)?.initialQuery || '';
  return (
    <SearchPage 
      onNavigate={onNavigate as any} 
      initialQuery={initialQuery} 
      onViewDetails={onViewDetails} 
      onAddToCart={onAddToCart}
    />
  );
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<CuratedProduct | null>(() => {
    try {
      const saved = sessionStorage.getItem('sirevo_selected_product');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState<CuratedProduct[]>(() => {
    try {
      const saved = localStorage.getItem('sirevo_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge any legacy mock items if they ever got saved
          return parsed.filter(item => 
            item && item.id !== 'cart-lenovo' && item.id !== 'cart-mouse' && !item.id?.startsWith('cart-item-')
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const handleSelectProduct = (product: CuratedProduct) => {
    setSelectedProduct(product);
    try {
      sessionStorage.setItem('sirevo_selected_product', JSON.stringify(product));
    } catch (e) {
      console.warn('Session storage save error:', e);
    }
  };

  const handleAddToCart = (product: CuratedProduct) => {
    setCart((prevCart) => {
      const updated = [...prevCart, product];
      try {
        localStorage.setItem('sirevo_cart', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save cart to localStorage:', e);
      }
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex(p => (p.product_id || (p as any).id) === productId);
      let updated: CuratedProduct[];
      if (index !== -1) {
        updated = [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
      } else {
        updated = prevCart.filter(p => (p.product_id || (p as any).id) !== productId);
      }
      try {
        localStorage.setItem('sirevo_cart', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save cart to localStorage:', e);
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('sirevo_cart');
    } catch (e) {
      console.warn('Failed to clear cart in localStorage:', e);
    }
  };

  const onNavigate = useAppNavigator(handleSelectProduct);

  const handleViewProductDetails = (product: CuratedProduct) => {
    handleSelectProduct(product);
    onNavigate('product-detail', product);
  };

  return (
    <Routes>
      {/* ===================================================================== */}
      {/* 1. MERCHANT PORTAL ROUTES: Protected by <MerchantGuard> & <MerchantLayout> */}
      {/*    Customer UI is NEVER shown here; ONLY Merchant Sidebar is seen     */}
      {/* ===================================================================== */}
      <Route
        element={
          <MerchantGuard>
            <MerchantLayout />
          </MerchantGuard>
        }
      >
        <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
        <Route path="/merchant/dashboard" element={<MerchantDashboardPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/add-product" element={<MerchantAddProductPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/products" element={<MerchantProductsPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/visibility" element={<MerchantAIVisibilityPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/ai-visibility" element={<MerchantAIVisibilityPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/suggestions" element={<MerchantAISuggestionsPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/ai-suggestions" element={<MerchantAISuggestionsPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/orders" element={<MerchantOrdersPage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/revenue" element={<MerchantRevenuePage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/profile" element={<MerchantProfilePage onNavigate={onNavigate} embedded={true} />} />
        <Route path="/merchant/settings" element={<MerchantProfilePage onNavigate={onNavigate} embedded={true} />} />

        {/* Legacy / Direct Merchant route paths */}
        <Route path="/merchant-dashboard" element={<Navigate to="/merchant/dashboard" replace />} />
        <Route path="/merchant-add-product" element={<Navigate to="/merchant/add-product" replace />} />
        <Route path="/merchant-products" element={<Navigate to="/merchant/products" replace />} />
        <Route path="/merchant-ai-visibility" element={<Navigate to="/merchant/visibility" replace />} />
        <Route path="/merchant-ai-suggestions" element={<Navigate to="/merchant/suggestions" replace />} />
        <Route path="/merchant-orders" element={<Navigate to="/merchant/orders" replace />} />
        <Route path="/merchant-revenue" element={<Navigate to="/merchant/revenue" replace />} />
        <Route path="/merchant-profile" element={<Navigate to="/merchant/profile" replace />} />
      </Route>

      {/* ===================================================================== */}
      {/* 2. STANDALONE PUBLIC & ONBOARDING ROUTES                              */}
      {/* ===================================================================== */}
      <Route path="/auth" element={<AuthPage onNavigate={onNavigate} />} />
      <Route path="/login" element={<AuthPage onNavigate={onNavigate} />} />
      <Route path="/signin" element={<AuthPage onNavigate={onNavigate} />} />
      <Route path="/merchant-register" element={<MerchantRegisterPage onNavigate={onNavigate} />} />
      <Route path="/merchant/register" element={<MerchantRegisterPage onNavigate={onNavigate} />} />
      <Route path="/customer-signup" element={<CustomerSignUpPage onNavigate={onNavigate} />} />
      <Route path="/signup" element={<CustomerSignUpPage onNavigate={onNavigate} />} />

      {/* ===================================================================== */}
      {/* 3. CUSTOMER STOREFRONT ROUTES: Wrapped with CustomerGuard & CustomerLayout */}
      {/* ===================================================================== */}
      <Route
        element={
          <CustomerGuard>
            <CustomerLayout cartCount={cart.length} />
          </CustomerGuard>
        }
      >
        <Route path="/" element={<HomePage onNavigate={onNavigate} />} />
        <Route path="/home" element={<HomePage onNavigate={onNavigate} />} />
        <Route 
          path="/search" 
          element={
            <SearchPageWrapper 
              onNavigate={onNavigate} 
              onViewDetails={handleViewProductDetails} 
              onAddToCart={handleAddToCart}
            />
          } 
        />
        <Route 
          path="/product-detail" 
          element={
            <ProductDetail 
              onNavigate={onNavigate as any} 
              selectedProduct={selectedProduct} 
              onAddToCart={handleAddToCart}
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetail 
              onNavigate={onNavigate as any} 
              selectedProduct={selectedProduct} 
              onAddToCart={handleAddToCart}
            />
          } 
        />
        <Route path="/compare" element={<ComparePage onNavigate={onNavigate as any} />} />
        <Route 
          path="/cart" 
          element={
            <CartPage 
              onNavigate={onNavigate as any} 
              cartItems={cart} 
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onViewDetails={handleViewProductDetails}
            />
          } 
        />
        <Route path="/orders" element={<OrdersPage onNavigate={onNavigate as any} />} />
        <Route path="/checkout" element={<PaymentPage onNavigate={onNavigate as any} />} />
        <Route path="/payment" element={<PaymentPage onNavigate={onNavigate as any} />} />
        <Route path="/secure-payment" element={<PaymentPage onNavigate={onNavigate as any} />} />
        <Route path="/order-success" element={<OrderSuccessPage onNavigate={onNavigate as any} />} />
        <Route path="/payment-success" element={<OrderSuccessPage onNavigate={onNavigate as any} />} />
        <Route path="/ai-history" element={<AIHistoryPage onNavigate={onNavigate as any} />} />
        <Route path="/history" element={<AIHistoryPage onNavigate={onNavigate as any} />} />
        <Route path="/profile" element={<ProfilePage onNavigate={onNavigate as any} />} />
        <Route path="/settings" element={<SettingsPage onNavigate={onNavigate as any} />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
