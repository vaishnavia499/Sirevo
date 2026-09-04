import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { PageRoute, CuratedProduct } from './types';
import { useCart } from './context/CartContext';
import { useOrders, defaultPastOrders, PastOrder } from './context/OrderContext';

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
        navigate('/orders', { state: typeof query === 'object' ? { newOrder: query } : undefined });
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

  // Clear Initial State: Initialize the cart state as an empty array ([]) rather than including default items
  const { cart: contextCart, addToCart: contextAddToCart, removeFromCart: contextRemoveFromCart, clearCart: contextClearCart } = useCart();
  const [cart, setCart] = useState<CuratedProduct[]>(() => contextCart || []);
  const { orders: contextOrders, setOrders: contextSetOrders } = useOrders();

  React.useEffect(() => {
    if (contextCart) {
      setCart(contextCart);
    }
  }, [contextCart]);

  const [orders, setOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sirevo_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load orders from localStorage:', e);
    }
    return defaultPastOrders;
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
    setCart((prevCart) => [...prevCart, product]);
    if (contextAddToCart) {
      contextAddToCart(product);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex(p => (p.product_id || (p as any).id) === productId);
      if (index !== -1) {
        return [...prevCart.slice(0, index), ...prevCart.slice(index + 1)];
      }
      return prevCart.filter(p => (p.product_id || (p as any).id) !== productId);
    });
    if (contextRemoveFromCart) {
      contextRemoveFromCart(productId);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    if (contextClearCart) {
      contextClearCart();
    }
    try {
      localStorage.removeItem('sirevo_cart');
    } catch (e) {
      console.warn('Failed to clear cart in localStorage:', e);
    }
  };

  const onNavigate = useAppNavigator(handleSelectProduct);

  // Complete checkout lifecycle: 1. State Update on Checkout, 2. Cart Cleanup, 3. View Transition
  const handleCheckoutComplete = (orderData?: any) => {
    const orderNumber = orderData?.orderNumber || `#SP${Math.floor(1000 + Math.random() * 9000)}`;
    const numericAmount = typeof orderData?.numericAmount === 'number' 
      ? orderData.numericAmount 
      : (typeof orderData?.price === 'number' ? orderData.price : (Number(String(orderData?.amount || '').replace(/[^0-9.-]+/g, '')) || 56999));

    const newOrder: PastOrder = {
      id: orderData?.id || `sp-${Date.now().toString(36)}`,
      orderNumber,
      name: orderData?.name || orderData?.title || orderData?.productName || (cart[0]?.name ? (cart.length > 1 ? `${cart[0].name} + ${cart.length - 1} more` : cart[0].name) : 'Lenovo IdeaPad Slim 5'),
      seller: orderData?.seller || orderData?.merchant || orderData?.merchantName || 'TechStore Official',
      image: orderData?.image || cart[0]?.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80',
      date: orderData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: orderData?.amount || `₹${numericAmount.toLocaleString('en-IN')}`,
      numericAmount,
      status: 'In Progress',
      category: orderData?.category || cart[0]?.category || 'Electronics'
    };

    // 1. State Update on Checkout: push into orders state array
    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter(o => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)];
      try {
        localStorage.setItem('sirevo_orders', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save orders to localStorage:', e);
      }
      return updated;
    });
    if (contextSetOrders) {
      contextSetOrders((prev) => [newOrder, ...prev.filter(o => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)]);
    }

    // 2. Cart Cleanup: clear cart state array
    setCart([]);
    if (contextClearCart) {
      contextClearCart();
    }
    try {
      localStorage.removeItem('sirevo_cart');
    } catch (e) {
      console.warn('Failed to remove cart from localStorage:', e);
    }

    // 3. View Transition: automatically switch to 'orders' screen
    onNavigate('orders', newOrder as any);
  };

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
              onCheckoutComplete={handleCheckoutComplete}
            />
          } 
        />
        <Route 
          path="/orders" 
          element={
            <OrdersPage 
              onNavigate={onNavigate as any} 
              orders={orders} 
              setOrders={setOrders} 
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <PaymentPage 
              onNavigate={onNavigate as any} 
              onCheckoutComplete={handleCheckoutComplete}
              orders={orders}
              setOrders={setOrders}
              onClearCart={handleClearCart}
            />
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PaymentPage 
              onNavigate={onNavigate as any} 
              onCheckoutComplete={handleCheckoutComplete}
              orders={orders}
              setOrders={setOrders}
              onClearCart={handleClearCart}
            />
          } 
        />
        <Route 
          path="/secure-payment" 
          element={
            <PaymentPage 
              onNavigate={onNavigate as any} 
              onCheckoutComplete={handleCheckoutComplete}
              orders={orders}
              setOrders={setOrders}
              onClearCart={handleClearCart}
            />
          } 
        />
        <Route 
          path="/order-success" 
          element={
            <OrderSuccessPage 
              onNavigate={onNavigate as any} 
              onCheckoutComplete={handleCheckoutComplete}
            />
          } 
        />
        <Route 
          path="/payment-success" 
          element={
            <OrderSuccessPage 
              onNavigate={onNavigate as any} 
              onCheckoutComplete={handleCheckoutComplete}
            />
          } 
        />
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
