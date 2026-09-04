import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Share2,
  Sparkles,
  Search,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Lock,
  Menu,
  X,
  CheckCircle,
  Clock,
  Truck,
  ExternalLink,
  ChevronRight,
  Filter,
  Calendar,
  CreditCard,
  User,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';

export interface OrderItem {
  id: string;
  orderId: string;
  product: string;
  productImage?: string;
  qty: number;
  customer: string;
  email: string;
  phone?: string;
  amount: string;
  rawAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Ready to Ship' | 'In Transit' | 'Delivered' | 'Cancelled';
  date: string;
  address: string;
  paymentMethod: string;
  courier?: string;
  trackingId?: string;
  estimatedDelivery?: string;
  aiPurchased?: boolean;
}

const initialOrders: OrderItem[] = [
  {
    id: '1',
    orderId: '#SP1024',
    product: 'Lenovo IdeaPad Slim 5',
    productImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80',
    qty: 1,
    customer: 'Priya',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    amount: '₹56,999',
    rawAmount: 56999,
    paymentStatus: 'Paid',
    orderStatus: 'Ready to Ship',
    date: 'Aug 30, 2026',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103',
    paymentMethod: 'UPI (Google Pay)',
    aiPurchased: true,
  },
  {
    id: '2',
    orderId: '#SP1025',
    product: 'Sony WH-1000XM5',
    productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80',
    qty: 1,
    customer: 'Ananya',
    email: 'ananya.m@example.com',
    phone: '+91 98234 56789',
    amount: '₹29,990',
    rawAmount: 29990,
    paymentStatus: 'Paid',
    orderStatus: 'In Transit',
    courier: 'Demo Express',
    trackingId: 'TRK123456',
    estimatedDelivery: 'Sep 02, 2026',
    date: 'Aug 29, 2026',
    address: 'B-12, Sector 62, Noida, Uttar Pradesh 201301',
    paymentMethod: 'Credit Card (HDFC)',
    aiPurchased: true,
  },
  {
    id: '3',
    orderId: '#SP1026',
    product: 'Logitech MX Master 3S Wireless Mouse',
    productImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=80',
    qty: 2,
    customer: 'Vikram',
    email: 'vikram.singh@example.com',
    phone: '+91 97112 34567',
    amount: '₹17,998',
    rawAmount: 17998,
    paymentStatus: 'Paid',
    orderStatus: 'In Transit',
    courier: 'Blue Dart',
    trackingId: 'BD9823019',
    estimatedDelivery: 'Sep 01, 2026',
    date: 'Aug 28, 2026',
    address: '74/A Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033',
    paymentMethod: 'Net Banking (ICICI)',
    aiPurchased: false,
  },
  {
    id: '4',
    orderId: '#SP1027',
    product: 'Keychron K2 Mechanical Keyboard',
    productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80',
    qty: 1,
    customer: 'Rahul',
    email: 'rahul.k@example.com',
    phone: '+91 99887 66554',
    amount: '₹8,499',
    rawAmount: 8499,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    courier: 'Delhivery',
    trackingId: 'DL7749201',
    estimatedDelivery: 'Aug 28, 2026',
    date: 'Aug 26, 2026',
    address: 'Flat 101, Palm Grove, Bandra West, Mumbai, Maharashtra 400050',
    paymentMethod: 'UPI (PhonePe)',
    aiPurchased: true,
  }
];

interface MerchantOrdersPageProps {
  onNavigate?: NavigationHandler;
}

export const MerchantOrdersPage: React.FC<MerchantOrdersPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [activeNav, setActiveNav] = useState<string>('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready to Ship' | 'In Transit' | 'Delivered'>('All');

  // Modal States
  const [shippingModalOrder, setShippingModalOrder] = useState<OrderItem | null>(null);
  const [courierPartner, setCourierPartner] = useState<string>('Demo Express');
  const [trackingIdInput, setTrackingIdInput] = useState<string>('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState<string>('2026-09-03');

  // View Details / Tracking Modal
  const [viewOrderModal, setViewOrderModal] = useState<OrderItem | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<OrderItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clean 6 Core Nav Items (matching Dashboard, Visibility, Revenue, Products, Suggestions)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders & Shipping', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setIsMobileSidebarOpen(false);
    if (!onNavigate) return;
    if (id === 'dashboard') onNavigate('merchant-dashboard');
    if (id === 'products') onNavigate('merchant-products');
    if (id === 'visibility') onNavigate('merchant-ai-visibility');
    if (id === 'orders') onNavigate('merchant-orders');
    if (id === 'revenue') onNavigate('merchant-revenue');
    if (id === 'suggestions') onNavigate('merchant-ai-suggestions');
  };

  // Open Shipping Modal
  const handleOpenShippingModal = (order: OrderItem) => {
    setShippingModalOrder(order);
    setCourierPartner('Demo Express');
    setTrackingIdInput(`TRK${Math.floor(100000 + Math.random() * 900000)}`);
    setEstimatedDeliveryInput('2026-09-03');
  };

  // Submit Mark as Shipped
  const handleMarkAsShipped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingModalOrder) return;

    const finalTracking = trackingIdInput.trim() || `TRK${Math.floor(100000 + Math.random() * 900000)}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === shippingModalOrder.id) {
          return {
            ...ord,
            orderStatus: 'In Transit',
            courier: courierPartner,
            trackingId: finalTracking,
            estimatedDelivery: estimatedDeliveryInput || 'Sep 03, 2026'
          };
        }
        return ord;
      })
    );

    setToastMessage(`Order ${shippingModalOrder.orderId} marked as Shipped via ${courierPartner} (${finalTracking})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);

    setShippingModalOrder(null);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      statusFilter === 'All' || order.orderStatus === statusFilter;

    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(q) ||
      order.product.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      (order.courier && order.courier.toLowerCase().includes(q)) ||
      (order.trackingId && order.trackingId.toLowerCase().includes(q))
    );
  });

  const readyToShipCount = orders.filter((o) => o.orderStatus === 'Ready to Ship').length;
  const inTransitCount = orders.filter((o) => o.orderStatus === 'In Transit').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div id="merchant-orders-page-layout" className="space-y-6 max-w-5xl w-full mx-auto">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="mb-4 p-3.5 bg-slate-900 border border-emerald-500/60 rounded-xl shadow-xl text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-white font-medium">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                id="orders-shipping-title"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Orders & Shipping
              </h1>
              <p
                id="orders-shipping-subtitle"
                className="text-sm text-slate-400 mt-1"
              >
                Manage order fulfillment, packing, and dispatch.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#151c2f] p-1 rounded-xl border border-slate-800 flex-wrap">
              {(['All', 'Ready to Ship', 'In Transit', 'Delivered'] as const).map((filter) => {
                const isSelected = statusFilter === filter;
                const count =
                  filter === 'All'
                    ? orders.length
                    : filter === 'Ready to Ship'
                    ? readyToShipCount
                    : filter === 'In Transit'
                    ? inTransitCount
                    : deliveredCount;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{filter}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ORDER LIST LAYOUT (CARDS) */}
          <div id="orders-card-list" className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-[#151c2f] border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
                <Package className="w-10 h-10 mx-auto text-slate-600" />
                <h3 className="text-base font-bold text-slate-200">No Orders Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No orders match the current filter or search criteria.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isReadyToShip = order.orderStatus === 'Ready to Ship';
                const isInTransit = order.orderStatus === 'In Transit';
                const isDelivered = order.orderStatus === 'Delivered';

                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.orderId.replace('#', '')}`}
                    className="bg-[#151c2f] border border-slate-800 rounded-xl p-5 mb-4 hover:border-slate-700/80 transition-all shadow-sm"
                  >
                    {/* Top Row (Flex between): Order '#SP1024' (bold white) and Amount '₹56,999' (bold white) */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base sm:text-lg text-white">
                          {order.orderId}
                        </span>
                        {order.aiPurchased && (
                          <span className="text-[11px] bg-purple-950/80 border border-purple-800/80 text-purple-300 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            AI Assistant Order
                          </span>
                        )}
                        <span className="text-xs text-slate-400 hidden sm:inline-block">
                          Placed {order.date}
                        </span>
                      </div>

                      <span className="font-bold text-base sm:text-lg text-white">
                        {order.amount}
                      </span>
                    </div>

                    {/* Details Row: Product: 'Lenovo IdeaPad Slim 5' | Qty: 1 | Customer: 'Priya' */}
                    <div className="pt-3.5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        {order.productImage && (
                          <img
                            src={order.productImage}
                            alt={order.product}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-100 text-sm sm:text-base leading-snug">
                            {order.product}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: <span className="text-slate-200 font-semibold">{order.qty}</span>{' '}
                            <span className="mx-1.5 text-slate-600">•</span>
                            Customer: <span className="text-slate-200 font-semibold">{order.customer}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-4 flex-wrap self-start sm:self-center">
                        {/* Payment: Small green check icon + 'Paid' */}
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{order.paymentStatus}</span>
                        </div>

                        {/* Status: Ready to Ship (yellow/orange dot) vs In Transit (blue truck) vs Delivered */}
                        {isReadyToShip && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-950/50 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>Ready to Ship</span>
                          </div>
                        )}

                        {isInTransit && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold bg-blue-950/50 border border-blue-800/50 px-2.5 py-1 rounded-lg">
                            <Truck className="w-3.5 h-3.5 text-blue-400" />
                            <span>In Transit</span>
                          </div>
                        )}

                        {isDelivered && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Delivered</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Info Block (For Shipped / In Transit orders): bg-slate-900 p-3 rounded mt-2 text-sm text-slate-300 */}
                    {(isInTransit || isDelivered) && order.courier && order.trackingId && (
                      <div className="bg-slate-900 border border-slate-800/90 p-3 rounded-lg mt-2 text-sm text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>
                            Courier: <strong className="text-white font-medium">{order.courier}</strong>
                          </span>
                          <span className="text-slate-600">|</span>
                          <span>
                            Tracking ID: <strong className="font-mono text-blue-300 font-medium">{order.trackingId}</strong>
                          </span>
                        </div>

                        {order.estimatedDelivery && (
                          <span className="text-xs text-slate-400">
                            Est. Delivery: <strong className="text-slate-200">{order.estimatedDelivery}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Actions (Right aligned flex, mt-4 pt-4 border-t border-slate-800) */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                      {/* Secondary Button: 'View Order' */}
                      <button
                        type="button"
                        id={`btn-view-order-${order.orderId.replace('#', '')}`}
                        onClick={() => setViewOrderModal(order)}
                        className="bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 font-semibold rounded-lg px-4 py-2 text-xs transition-colors cursor-pointer"
                      >
                        View Order
                      </button>

                      {/* Primary Button for Ready to Ship: 'Ship Order' (bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2) */}
                      {isReadyToShip && (
                        <button
                          type="button"
                          id={`btn-ship-order-${order.orderId.replace('#', '')}`}
                          onClick={() => handleOpenShippingModal(order)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/30 cursor-pointer active:scale-95"
                        >
                          <Package className="w-3.5 h-3.5 text-white" />
                          <span>Ship Order</span>
                        </button>
                      )}

                      {/* Secondary Button for In Transit: 'View Tracking' (bg-slate-800 hover:bg-slate-700 text-white rounded px-4 py-2) */}
                      {isInTransit && (
                        <button
                          type="button"
                          id={`btn-view-tracking-${order.orderId.replace('#', '')}`}
                          onClick={() => setTrackingModalOrder(order)}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-blue-400" />
                          <span>View Tracking</span>
                        </button>
                      )}

                      {isDelivered && (
                        <button
                          type="button"
                          onClick={() => setTrackingModalOrder(order)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Delivery Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SHIPPING MODAL (UI Mockup)                                 */}
      {/* ========================================================================= */}
      {shippingModalOrder && (
        <div
          id="shipping-modal-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            id="shipping-modal-container"
            className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
          >
            {/* Modal Header: 'Ship Order #SP1024' (bold white text) + close 'X' button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3
                id="shipping-modal-header"
                className="font-bold text-lg text-white"
              >
                Ship Order {shippingModalOrder.orderId}
              </h3>
              <button
                type="button"
                id="shipping-modal-close-btn"
                onClick={() => setShippingModalOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simple Pipeline/Stepper (Visual only): [Confirm] -> [Pack] -> [Ship] */}
            <div
              id="shipping-pipeline-stepper"
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs flex items-center justify-between text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Confirm</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>Pack</span>
              </div>
              <span className="text-slate-600">→</span>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Ship</span>
              </div>
            </div>

            {/* Order Item Summary in Modal */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg text-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-white truncate max-w-[220px]">
                  {shippingModalOrder.product}
                </p>
                <p className="text-slate-400">
                  Recipient: <span className="text-slate-200">{shippingModalOrder.customer}</span>
                </p>
              </div>
              <span className="font-bold text-white text-sm">
                {shippingModalOrder.amount}
              </span>
            </div>

            {/* Form Fields (Dark inputs bg-slate-900 border border-slate-700) */}
            <form onSubmit={handleMarkAsShipped} className="space-y-4">
              {/* Field 1: Courier / Delivery Partner */}
              <div>
                <label
                  htmlFor="courier-partner-select"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Courier / Delivery Partner
                </label>
                <select
                  id="courier-partner-select"
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                >
                  <option value="Demo Express">Demo Express (Same Day Dispatch)</option>
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="Delhivery">Delhivery Surface</option>
                  <option value="DTDC">DTDC Air Priority</option>
                  <option value="Shadowfax">Shadowfax Hyperlocal</option>
                </select>
              </div>

              {/* Field 2: Tracking ID */}
              <div>
                <label
                  htmlFor="tracking-id-input"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Tracking ID
                </label>
                <input
                  id="tracking-id-input"
                  type="text"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  placeholder="e.g. TRK123456"
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              {/* Field 3: Estimated Delivery */}
              <div>
                <label
                  htmlFor="estimated-delivery-input"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Estimated Delivery
                </label>
                <input
                  id="estimated-delivery-input"
                  type="date"
                  value={estimatedDeliveryInput}
                  onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Modal Action: Full-width primary button at the bottom: 'Mark as Shipped' */}
              <button
                type="submit"
                id="btn-mark-as-shipped"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer active:scale-[0.98] mt-2"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Mark as Shipped</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW ORDER DETAILS MODAL                                                  */}
      {/* ========================================================================= */}
      {viewOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">
                  Order Details {viewOrderModal.orderId}
                </h3>
                <p className="text-xs text-slate-400">Placed on {viewOrderModal.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewOrderModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{viewOrderModal.product}</p>
                  <p className="text-slate-400">Quantity: {viewOrderModal.qty}</p>
                </div>
                <span className="text-base font-bold text-white">{viewOrderModal.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Customer Name</span>
                  <strong className="text-white font-medium">{viewOrderModal.customer}</strong>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Payment Method</span>
                  <strong className="text-white font-medium">{viewOrderModal.paymentMethod}</strong>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Delivery Address</span>
                <p className="text-slate-200">{viewOrderModal.address}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewOrderModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              {viewOrderModal.orderStatus === 'Ready to Ship' && (
                <button
                  type="button"
                  onClick={() => {
                    const orderToShip = viewOrderModal;
                    setViewOrderModal(null);
                    handleOpenShippingModal(orderToShip);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Ship This Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW TRACKING MODAL                                                       */}
      {/* ========================================================================= */}
      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">
                  Package Tracking
                </h3>
                <p className="text-xs text-slate-400">Order {trackingModalOrder.orderId}</p>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Courier Partner:</span>
                <strong className="text-white font-semibold">{trackingModalOrder.courier || 'Demo Express'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tracking Number:</span>
                <strong className="font-mono text-blue-300 font-semibold">{trackingModalOrder.trackingId}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {trackingModalOrder.orderStatus}
                </span>
              </div>
              {trackingModalOrder.estimatedDelivery && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expected Delivery:</span>
                  <strong className="text-slate-200">{trackingModalOrder.estimatedDelivery}</strong>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-lg text-[11px] text-blue-300 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Real-time webhook synchronization enabled with courier partner API.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantOrdersPage;
