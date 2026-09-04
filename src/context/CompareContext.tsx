import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CuratedProduct } from '../types';

export interface Product extends Partial<CuratedProduct> {
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  source?: string;
  ai_match_percentage?: number;
  ai_explanation?: string;
  specs?: {
    ram?: string;
    storage?: string;
    battery?: string;
    delivery?: string;
    screen?: string;
    processor?: string;
    os?: string;
    weight?: string;
    warranty?: string;
    [key: string]: any;
  };
  badge?: string;
  external_link?: string;
  merchant_id?: string;
  thumbnail?: string;
  // Aliases for compatibility
  id?: string;
  title?: string;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    const normProduct: Product = {
      ...product,
      product_id: product.product_id || product.id || String(Date.now()),
      name: product.name || product.title || 'Product'
    };

    if (compareList.some(item => item.product_id === normProduct.product_id)) {
      return;
    }

    if (compareList.length >= 3) {
      alert("You can compare up to 3 products at a time.");
      return;
    }

    setCompareList(prev => [...prev, normProduct]);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(item => item.product_id !== productId && item.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isCompared = (productId: string): boolean => {
    if (!productId) return false;
    return compareList.some(item => item.product_id === productId || item.id === productId);
  };

  const toggleCompare = (product: Product) => {
    const pId = product.product_id || product.id || '';
    if (isCompared(pId)) {
      removeFromCompare(pId);
    } else {
      addToCompare(product);
    }
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        toggleCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
