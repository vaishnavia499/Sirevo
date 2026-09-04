import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseConfirmationModal } from '../components/PurchaseConfirmationModal';

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

  const openPurchaseModal = (product: CheckoutProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    if (selectedProduct) {
      navigate('/secure-payment', {
        state: {
          product: selectedProduct,
          price: selectedProduct.price,
          productName: selectedProduct.title || selectedProduct.name || 'Lenovo IdeaPad Slim 5',
          merchantName: selectedProduct.merchant || selectedProduct.merchantName || 'TechStore',
          budget: selectedProduct.budget || 60000,
          orderId: selectedProduct.orderId || '#SP1024'
        }
      });
    } else {
      navigate('/secure-payment');
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
