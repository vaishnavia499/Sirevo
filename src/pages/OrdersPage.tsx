import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Sparkles, 
  Search, 
  Calendar, 
  Bell, 
  Truck, 
  Package, 
  ExternalLink, 
  X, 
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  FileText,
  Star,
  Send
} from 'lucide-react';
import { PageRoute } from '../types';

interface OrdersPageProps {
  onNavigate?: (page: PageRoute, query?: string) => void;
}

interface PastOrder {
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
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in-progress' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSelectedOrder, setAiSelectedOrder] = useState<string>('#SP1024');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Sirevo AI Order Assistant. I have access to real-time telemetry for order #SP1024 (Lenovo IdeaPad Slim 5). How can I assist you today?'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const pastOrders: PastOrder[] = [
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

  const filteredOrders = useMemo(() => {
    return pastOrders.filter(order => {
      // Filter tab check
      if (selectedFilter === 'in-progress' && order.status !== 'In Progress') return false;
      if (selectedFilter === 'cancelled' && order.status !== 'Cancelled') return false;
      
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          order.name.toLowerCase().includes(q) ||
          order.orderNumber.toLowerCase().includes(q) ||
          order.seller.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedFilter, searchQuery, pastOrders]);

  const handleOpenAiWithQuestion = (orderNum: string, initialText?: string) => {
    setAiSelectedOrder(orderNum);
    if (initialText) {
      setAiChatLogs(prev => [
        ...prev,
        { sender: 'user', text: initialText },
        { 
          sender: 'ai', 
          text: `Your ${orderNum === '#SP1024' ? 'Lenovo IdeaPad Slim 5' : 'package'} is currently in transit with BlueDart Express. It departed the Regional Hub at 06:45 AM today and is scheduled for arrival by 8:00 PM on Oct 24, 2026. Delivery OTP will be sent to your registered number.` 
        }
      ]);
    }
    setShowAiModal(true);
  };

  const handleSendAiMessage = () => {
    if (!aiQuestion.trim()) return;
    const userMsg = aiQuestion;
    setAiQuestion('');
    setAiChatLogs(prev => [
      ...prev,
      { sender: 'user', text: userMsg },
      { 
        sender: 'ai', 
        text: `Analysis for ${aiSelectedOrder}: Everything is operating smoothly under verified merchant SLA. Estimated transit delay risk is 0.02%. Let me know if you would like an e-invoice, contact the courier, or change delivery instructions.` 
      }
    ]);
  };

  return (
    <div className="min-h-full bg-[#111827] text-slate-200 font-sans p-4 sm:p-6 lg:p-8 -m-4 sm:-m-5 lg:-m-6 relative">
      
      {/* Top Header Bar with Notifications & Profile */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Sirevo Live Portal
          </span>
        </div>

        {/* Far right icons: Notification bell and profile avatar */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            id="orders-notification-btn"
            className="p-2.5 rounded-full bg-[#1F2937] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-[#1F2937]"></span>
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-[#1F2937] border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-purple-400 font-medium">1 New</span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-[#111827] border border-purple-900/40 text-xs">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple-400" /> Package Dispatched
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Order #SP1024 (Lenovo IdeaPad Slim 5) is out for delivery.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111827]/60 text-xs">
                  <p className="font-semibold text-slate-300">Price Drop Alert</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Saved item Sony WH-1000XM5 is ₹2,000 off today.</p>
                </div>
              </div>
            </div>
          )}

          <div 
            onClick={() => onNavigate && onNavigate('profile')}
            id="orders-profile-avatar"
            className="flex items-center gap-2.5 pl-1 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User Profile Avatar"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage your recent purchases and deliveries.
          </p>
        </div>

        {/* Far right: Dark pill badge showing 'Total Orders 24' */}
        <div className="self-start sm:self-center">
          <div className="inline-flex items-center gap-2 bg-[#1F2937] border border-slate-700/80 px-4 py-2 rounded-full shadow-inner">
            <span className="text-xs sm:text-sm font-medium text-slate-300">Total Orders</span>
            <span className="text-xs sm:text-sm font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700">
              24
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Delivery Section */}
      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Active Delivery
        </h2>

        {/* Active Order Card */}
        <div className="bg-[#1F2937] border border-slate-700 rounded-2xl p-5 sm:p-6 mt-4 shadow-xl relative overflow-hidden">
          {/* Top Row of Card */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <span className="text-xs sm:text-sm font-mono text-slate-400 tracking-wide">
              Order #SP1024
            </span>

            <div className="inline-flex items-center gap-1.5 bg-white text-slate-900 font-semibold px-3 py-1 rounded-full text-xs shadow-sm">
              <span className="text-sm leading-none">🚚</span>
              <span>Shipped</span>
            </div>
          </div>

          {/* Card Body (Grid Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
            
            {/* Left side (Product Info) - 6 cols on lg */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                {/* Product Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#111827] border border-slate-700 p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80"
                    alt="Lenovo IdeaPad Slim 5"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    Lenovo IdeaPad Slim 5
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Sold by: <span className="text-slate-300 font-medium">TechStore Official</span>
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight">
                    ₹56,999
                  </p>
                </div>
              </div>

              {/* Dark Inner Box: Expected Delivery */}
              <div className="bg-[#111827] border border-slate-800 rounded-lg p-3.5 mt-5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Expected Delivery Date
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Oct 24, 2026 <span className="text-slate-400 font-normal">(by 8:00 PM)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right side (Tracking & AI Actions) - 7 cols on lg */}
            <div className="lg:col-span-7 flex flex-col justify-between pt-4 lg:pt-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-slate-800/80">
              
              {/* Progress Tracker (Horizontal Step Tracker showing 4 nodes) */}
              <div className="w-full px-2 sm:px-4">
                <div className="flex items-center justify-between relative">
                  
                  {/* Background Connecting Track Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700 -z-0" />
                  {/* Completed Progress Track Line */}
                  <div className="absolute top-4 left-4 w-[66%] h-0.5 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 -z-0" />

                  {/* Node 1: Ordered (Checked) */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#93C5FD] text-slate-900 flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2">
                      Ordered
                    </span>
                  </div>

                  {/* Node 2: Packed (Checked) */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#93C5FD] text-slate-900 flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2">
                      Packed
                    </span>
                  </div>

                  {/* Node 3: Shipped (Active/Current with pulse effect) */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#111827] border-2 border-purple-400 flex items-center justify-center relative shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-purple-400 animate-ping absolute opacity-75"></div>
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-purple-300 mt-2">
                      Shipped
                    </span>
                  </div>

                  {/* Node 4: Delivered (Upcoming/Dim) */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#111827] border-2 border-slate-700 text-slate-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-2">
                      Delivered
                    </span>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Track Order Button */}
                  <button
                    onClick={() => setShowTrackModal(true)}
                    id="track-order-active-btn"
                    className="flex-1 min-w-[140px] py-2.5 px-5 rounded-xl bg-[#BFDBFE] hover:bg-[#93C5FD] text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Truck className="w-4 h-4 text-slate-900" />
                    <span>Track Order</span>
                  </button>

                  {/* Ask AI about this order Button */}
                  <button
                    onClick={() => handleOpenAiWithQuestion('#SP1024', 'Where is my order?')}
                    id="ask-ai-order-btn"
                    className="flex-1 min-w-[190px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>✨ Ask AI about this order</span>
                  </button>
                </div>

                {/* Subtext */}
                <div className="mt-3">
                  <button
                    onClick={() => handleOpenAiWithQuestion('#SP1024', 'Where is my order?')}
                    className="text-xs text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left group"
                  >
                    <span>Try asking:</span>
                    <span className="text-purple-400 font-medium group-hover:underline">"Where is my order?"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Past Orders Section */}
      <section className="mt-10">
        
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mr-2">
              Past Orders
            </h2>

            {/* Three Pill Tabs */}
            <div className="flex items-center gap-1.5 bg-[#111827] p-1 rounded-full border border-slate-800">
              <button
                onClick={() => setSelectedFilter('all')}
                id="filter-all-orders-btn"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Orders
              </button>

              <button
                onClick={() => setSelectedFilter('in-progress')}
                id="filter-inprogress-btn"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === 'in-progress'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In Progress
              </button>

              <button
                onClick={() => setSelectedFilter('cancelled')}
                id="filter-cancelled-btn"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === 'cancelled'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* On the far right: Search input bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              id="search-past-orders-input"
              className="w-full bg-[#1F2937] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Data Table: Clean, borderless table inside a dark container */}
        <div className="bg-[#1F2937] border border-slate-700 rounded-2xl overflow-hidden mt-4 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-700/80 bg-[#17202e]/60">
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PRODUCT
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    AMOUNT
                  </th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Product: Thumbnail, Title, Seller */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#111827] border border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                            <img
                              src={order.image}
                              alt={order.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                              {order.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {order.seller}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className="py-4 px-4 text-xs font-mono font-medium text-slate-300">
                        {order.orderNumber}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-slate-300">
                        {order.date}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-xs sm:text-sm font-bold text-white">
                        {order.amount}
                      </td>

                      {/* Status: Dark pill badge 'Delivered' */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#111827] text-slate-300 border border-slate-700/60 shadow-xs">
                          <span>Delivered</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        </span>
                      </td>

                      {/* Actions: AI sparkle icon button for contextual help */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAiWithQuestion(order.orderNumber, `Can I get an invoice or return details for ${order.name} (${order.orderNumber})?`)}
                            title={`Ask AI about ${order.name}`}
                            className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 border border-transparent hover:border-purple-800/50 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('product-detail');
                              }
                            }}
                            title="View product specifications"
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer hidden sm:inline-flex"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 text-slate-600" />
                        <p className="text-sm font-medium text-slate-300">No matching orders found</p>
                        <p className="text-xs text-slate-500">Try changing your search terms or filter selection.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* Live Track Order Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F2937] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Live Shipment Tracking</h3>
                  <p className="text-xs text-slate-400 font-mono">Order #SP1024 • AWB: 940011284920</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrackModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Courier Partner</span>
                  <span className="text-sm font-bold text-white">BlueDart Express (Air Priority)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  On Schedule
                </span>
              </div>

              {/* Timeline steps */}
              <div className="space-y-4 pl-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-500/20 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Out for Regional Delivery</p>
                    <p className="text-[11px] text-slate-400">Departed Delhi NCR Hub • Today, 08:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Package Arrived at Central Sort Facility</p>
                    <p className="text-[11px] text-slate-400">Customs & Inspection Cleared • Oct 23, 09:14 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Dispatched from TechStore Official Warehouse</p>
                    <p className="text-[11px] text-slate-400">Bangalore Warehouse • Oct 22, 02:40 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-700">
              <button
                onClick={() => {
                  setShowTrackModal(false);
                  handleOpenAiWithQuestion('#SP1024', 'Can you summarize live tracking updates for #SP1024?');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask AI to Monitor
              </button>
              <button
                onClick={() => setShowTrackModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Order Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F2937] border border-purple-500/40 rounded-2xl w-full max-w-xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Sirevo AI Order Concierge</h3>
                  <p className="text-xs text-purple-300 font-mono">Querying context for Order {aiSelectedOrder}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
              {aiChatLogs.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/20'
                        : 'bg-[#111827] text-slate-200 border border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-2 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setAiQuestion('Download official tax invoice PDF');
                }}
                className="text-[11px] whitespace-nowrap bg-[#111827] hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                📄 Get Invoice
              </button>
              <button
                onClick={() => {
                  setAiQuestion('What is the return window and warranty period?');
                }}
                className="text-[11px] whitespace-nowrap bg-[#111827] hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                🛡️ Return Policy
              </button>
              <button
                onClick={() => {
                  setAiQuestion('Change delivery address or timing');
                }}
                className="text-[11px] whitespace-nowrap bg-[#111827] hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                📍 Change Delivery Slot
              </button>
            </div>

            {/* Input Box */}
            <div className="pt-3 border-t border-slate-700 flex items-center gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAiMessage();
                }}
                placeholder="Ask anything about this order or delivery..."
                className="flex-1 bg-[#111827] border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiQuestion.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
