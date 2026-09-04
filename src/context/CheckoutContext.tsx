import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseConfirmationModal } from '../components/PurchaseConfirmationModal';
import { useOrders, PastOrder } from './OrderContext';
import { useCart } from './CartContext';

export interface CheckoutProduct {
  id?: string;
  title?: string;
  name?: string;
  price: number;
  originalPrice?: number;
  merchant?: string;
  merchantName?: string;
  budget?: number;
  image?: string;
  category?: string;
  specs?: string;
  orderId?: string;
}

interface CheckoutContextType {
  openPurchaseModal: (product: CheckoutProduct) => void;
  closePurchaseModal: () => void;
  isModalOpen: boolean;
  selectedProduct: CheckoutProduct | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CheckoutProduct | null>(null);
  const navigate = useNavigate();
  const { setOrders } = useOrders();
  const { clearCart } = useCart();

  const openPurchaseModal = (product: CheckoutProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsModalOpen(false);
  };

  // Complete checkout lifecycle: 1. State Update on Checkout, 2. Cart Cleanup, 3. View Transition
  const handleModalSuccess = () => {
    setIsModalOpen(false);
    if (selectedProduct) {
      const orderNumber = selectedProduct.orderId || `#SP${Math.floor(1000 + Math.random() * 9000)}`;
      const resolvedOrderNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
      const productName = selectedProduct.title || selectedProduct.name || 'Lenovo IdeaPad Slim 5';
      const merchantName = selectedProduct.merchant || selectedProduct.merchantName || 'TechStore Official';
      const productImage = selectedProduct.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80';

      const newOrder: PastOrder = {
        id: `sp-${Date.now().toString(36)}`,
        orderNumber: resolvedOrderNumber,
        name: productName,
        seller: merchantName,
        image: productImage,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `₹${selectedProduct.price.toLocaleString('en-IN')}`,
        numericAmount: selectedProduct.price,
        status: 'In Progress',
        category: selectedProduct.category || 'Electronics'
      };

      // 1. State Update on Checkout: newly created order pushed into orders state array
      setOrders((prev) => {
        const next = [newOrder, ...prev.filter(o => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)];
        try {
          localStorage.setItem('sirevo_orders', JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save orders to localStorage:', e);
        }
        return next;
      });

      // 2. Cart Cleanup: clear cart state array right after order creation
      clearCart();
      try {
        localStorage.removeItem('sirevo_cart');
      } catch (e) {
        console.warn('Failed to remove cart from localStorage:', e);
      }

      // 3. View Transition: automatically switch application view to 'orders' screen
      navigate('/orders', { state: { newOrder, orderId: resolvedOrderNumber } });
    } else {
      navigate('/orders');
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        openPurchaseModal,
        closePurchaseModal,
        isModalOpen,
        selectedProduct
      }}
    >
      {children}
      {isModalOpen && selectedProduct && (
        <PurchaseConfirmationModal
          isOpen={isModalOpen}
          onClose={closePurchaseModal}
          onSuccess={handleModalSuccess}
          productName={selectedProduct.title || selectedProduct.name || 'Lenovo IdeaPad Slim 5'}
          merchantName={selectedProduct.merchant || selectedProduct.merchantName || 'TechStore'}
          price={selectedProduct.price || 56999}
          budget={selectedProduct.budget || 60000}
          image={selectedProduct.image}
        />
      )}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
