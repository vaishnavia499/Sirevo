import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <CheckoutProvider>
              <CompareProvider>
                <SearchProvider>
                  <App />
                </SearchProvider>
              </CompareProvider>
            </CheckoutProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
