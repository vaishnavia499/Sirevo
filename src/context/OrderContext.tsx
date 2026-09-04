import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PastOrder {
  id: string;
  orderNumber: string;
  name: string;
  seller: string;
  image: string;
  date: string;
  amount: string;
  numericAmount: number;
  status: 'Delivered' | 'In Progress' | 'Cancelled';
  category: string;
  items?: any[];
}

export const defaultPastOrders: PastOrder[] = [
  {
    id: 'sp-0982',
    orderNumber: '#SP0982',
    name: 'Sony WH-1000XM5',
    seller: 'AudioWorld',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    date: 'Oct 12, 2023',
    amount: '₹29,990',
    numericAmount: 29990,
    status: 'Delivered',
    category: 'Audio'
  },
  {
    id: 'sp-0951',
    orderNumber: '#SP0951',
    name: 'Nest Cam (Battery)',
    seller: 'SmartHome Co',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=200&auto=format&fit=crop&q=80',
    date: 'Sep 28, 2023',
    amount: '₹14,499',
    numericAmount: 14499,
    status: 'Delivered',
    category: 'Smart Home'
  },
  {
    id: 'sp-0820',
    orderNumber: '#SP0820',
    name: 'Keychron K2 V2',
    seller: 'MechKeys IN',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80',
    date: 'Sep 15, 2023',
    amount: '₹7,999',
    numericAmount: 7999,
    status: 'Delivered',
    category: 'Keyboards'
  }
];

export interface OrderContextType {
  orders: PastOrder[];
  setOrders: React.Dispatch<React.SetStateAction<PastOrder[]>>;
  addOrder: (orderData: Partial<PastOrder>) => PastOrder;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sirevo_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load orders from localStorage:', e);
    }
    return defaultPastOrders;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sirevo_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  const addOrder = (orderData: Partial<PastOrder>): PastOrder => {
    const orderNumber = orderData.orderNumber || `#SP${Math.floor(1000 + Math.random() * 9000)}`;
    const numericAmount = typeof orderData.numericAmount === 'number' 
      ? orderData.numericAmount 
      : (orderData.amount ? Number(String(orderData.amount).replace(/[^0-9.-]+/g, '')) || 0 : 0);

    const newOrder: PastOrder = {
      id: orderData.id || `order-${Date.now()}`,
      orderNumber,
      name: orderData.name || 'AI Curated Selection',
      seller: orderData.seller || 'TechStore Official',
      image: orderData.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80',
      date: orderData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: orderData.amount || `₹${numericAmount.toLocaleString('en-IN')}`,
      numericAmount,
      status: (orderData.status as any) || 'In Progress',
      category: orderData.category || 'Electronics'
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    return {
      orders: defaultPastOrders,
      setOrders: () => {},
      addOrder: (data) => data as PastOrder
    };
  }
  return context;
};

export default OrderContext;
