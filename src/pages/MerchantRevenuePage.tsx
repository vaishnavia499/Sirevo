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
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  ChevronDown,
  Filter,
  BarChart3,
  Bot
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';
import { getStoredMerchantProducts } from '../utils/merchantProducts';

interface MerchantRevenuePageProps {
  onNavigate?: NavigationHandler;
}

export const MerchantRevenuePage: React.FC<MerchantRevenuePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const products = getStoredMerchantProducts();

  // Navigation & Filter States
  const [activeNav, setActiveNav] = useState<string>('revenue');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'YTD'>('30D');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'ai' | 'direct'>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    date: string;
    gmv: number;
    aiRevenue: number;
    orders: number;
  } | null>(null);

  // 6 Core Clean Nav Items (No Action Log)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
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

  // Dynamic Chart Points based on TimeRange
  const chartDatasets: Record<
    '7D' | '30D' | '90D' | 'YTD',
    Array<{ date: string; gmv: number; aiRevenue: number; orders: number }>
  > = {
    '7D': [
      { date: 'Mon', gmv: 42000, aiRevenue: 31000, orders: 8 },
      { date: 'Tue', gmv: 58000, aiRevenue: 44000, orders: 11 },
      { date: 'Wed', gmv: 51000, aiRevenue: 38000, orders: 9 },
      { date: 'Thu', gmv: 74000, aiRevenue: 59000, orders: 14 },
      { date: 'Fri', gmv: 89000, aiRevenue: 68000, orders: 18 },
      { date: 'Sat', gmv: 112000, aiRevenue: 86000, orders: 23 },
      { date: 'Sun', gmv: 98000, aiRevenue: 73000, orders: 19 }
    ],
    '30D': [
      { date: 'Aug 01', gmv: 34000, aiRevenue: 24000, orders: 7 },
      { date: 'Aug 05', gmv: 62000, aiRevenue: 48000, orders: 12 },
      { date: 'Aug 10', gmv: 81000, aiRevenue: 61000, orders: 16 },
      { date: 'Aug 15', gmv: 73000, aiRevenue: 52000, orders: 14 },
      { date: 'Aug 20', gmv: 98000, aiRevenue: 76000, orders: 20 },
      { date: 'Aug 25', gmv: 124000, aiRevenue: 98000, orders: 25 },
      { date: 'Aug 30', gmv: 142000, aiRevenue: 112000, orders: 29 }
    ],
    '90D': [
      { date: 'Jun', gmv: 380000, aiRevenue: 260000, orders: 74 },
      { date: 'Jul', gmv: 520000, aiRevenue: 385000, orders: 106 },
      { date: 'Aug', gmv: 765000, aiRevenue: 598000, orders: 154 }
    ],
    YTD: [
      { date: 'Q1', gmv: 890000, aiRevenue: 580000, orders: 180 },
      { date: 'Q2', gmv: 1240000, aiRevenue: 890000, orders: 255 },
      { date: 'Q3 (Proj)', gmv: 1842000, aiRevenue: 1345000, orders: 380 }
    ]
  };

  const currentData = chartDatasets[timeRange];
  const totalGMV = currentData.reduce((acc, curr) => acc + curr.gmv, 0);
  const totalAIRevenue = currentData.reduce((acc, curr) => acc + curr.aiRevenue, 0);
  const aiPercentage = Math.round((totalAIRevenue / totalGMV) * 100) || 72;
  const netEarnings = Math.round(totalGMV * 0.985); // 1.5% gateway fee
  const marketplaceCommissionSaved = Math.round(totalGMV * 0.135); // 15% marketplace commission saved

  // Settlement history items
  const settlements = [
    {
      id: 'SET-9824',
      date: 'Aug 28, 2026',
      amount: '₹ 1,42,800',
      status: 'Paid',
      bank: 'HDFC Bank (•••• 4920)',
      ordersCount: 28,
      utr: 'UTR892301948293'
    },
    {
      id: 'SET-9823',
      date: 'Aug 21, 2026',
      amount: '₹ 1,18,450',
      status: 'Paid',
      bank: 'HDFC Bank (•••• 4920)',
      ordersCount: 22,
      utr: 'UTR891290384721'
    },
    {
      id: 'SET-9822',
      date: 'Aug 14, 2026',
      amount: '₹ 94,300',
      status: 'Paid',
      bank: 'HDFC Bank (•••• 4920)',
      ordersCount: 19,
      utr: 'UTR890184729103'
    },
    {
      id: 'SET-9821',
      date: 'Aug 07, 2026',
      amount: '₹ 1,06,200',
      status: 'Paid',
      bank: 'HDFC Bank (•••• 4920)',
      ordersCount: 21,
      utr: 'UTR889201948201'
    }
  ];

  // SVG Chart Geometry Calculations
  const maxVal = Math.max(...currentData.map((d) => d.gmv)) * 1.15 || 150000;
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 20;

  const pointsGMV = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.gmv / maxVal) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pointsAI = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.aiRevenue / maxVal) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const pathGMV = generateSmoothPath(pointsGMV);
  const pathAI = generateSmoothPath(pointsAI);

  const areaGMV = `${pathGMV} L ${pointsGMV[pointsGMV.length - 1]?.x || width},${height - paddingY} L ${pointsGMV[0]?.x || 0},${height - paddingY} Z`;
  const areaAI = `${pathAI} L ${pointsAI[pointsAI.length - 1]?.x || width},${height - paddingY} L ${pointsAI[0]?.x || 0},${height - paddingY} Z`;

  const handleDownloadReport = () => {
    setDownloadSuccessToast('Revenue and settlement report for ' + timeRange + ' exported to CSV.');
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4500);
  };

  return (
    <div id="merchant-revenue-page-layout" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* TOAST FEEDBACK */}
      {downloadSuccessToast && (
        <div className="mb-4 p-3.5 bg-slate-900 border border-emerald-500/60 rounded-xl shadow-xl text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-white font-medium">{downloadSuccessToast}</p>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccessToast(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                id="merchant-revenue-title"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5"
              >
                <span>Revenue & Financial Analytics</span>
                <span className="text-xs font-semibold bg-emerald-950/80 border border-emerald-800/70 text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Track gross sales, AI-driven assistant conversions, settlement payouts, and zero-commission savings.
              </p>
            </div>

            {/* Range Toggle & Export Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-[#151c2f] p-1 rounded-xl border border-slate-800">
                {(['7D', '30D', '90D', 'YTD'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      timeRange === r
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="button"
                id="btn-export-revenue-csv"
                onClick={handleDownloadReport}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* TOP 4 FINANCIAL METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Gross Merchandise Value */}
            <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Gross Sales (GMV)</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ₹ {totalGMV.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.6% vs previous period</span>
              </div>
            </div>

            {/* Card 2: AI-Attributed Revenue */}
            <div className="bg-[#151c2f] border border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-purple-950/20 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">AI Assistant Sales</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ₹ {totalAIRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-semibold">{aiPercentage}% of total revenue</span>
                <span className="text-[10px] bg-purple-950/80 text-purple-400 px-2 py-0.5 rounded border border-purple-800">
                  Top Channel
                </span>
              </div>
            </div>

            {/* Card 3: Net Merchant Payout */}
            <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Net Merchant Earnings</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                  ₹ {netEarnings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                <span>98.5% net payout rate</span>
              </div>
            </div>

            {/* Card 4: Platform Fee Savings */}
            <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Marketplace Fees Saved</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
                  ₹ {marketplaceCommissionSaved.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                <span>0% listing fee vs 15% legacy platforms</span>
              </div>
            </div>
          </div>

          {/* MAIN REVENUE CHART (Interactive SVG with Curves, Glow, and Tooltips) */}
          <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span>Revenue Trend Breakdown ({timeRange})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison between Total Gross Sales and Conversational AI-Attributed Checkouts
                </p>
              </div>

              {/* Legend & Channel Filters */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-300 font-medium">Total GMV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-purple-300 font-semibold">AI Assistant Revenue</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div className="relative pt-6 pb-2">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-64 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* GMV Gradient Fill */}
                  <linearGradient id="gmvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>

                  {/* AI Revenue Gradient Fill */}
                  <linearGradient id="aiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = height - paddingY - ratio * (height - 2 * paddingY);
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="9"
                        textAnchor="end"
                        fontWeight="600"
                      >
                        ₹{Math.round((maxVal * ratio) / 1000)}k
                      </text>
                    </g>
                  );
                })}

                {/* GMV Area & Line */}
                <path d={areaGMV} fill="url(#gmvAreaGrad)" />
                <path
                  d={pathGMV}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* AI Revenue Area & Line */}
                <path d={areaAI} fill="url(#aiAreaGrad)" />
                <path
                  d={pathAI}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Interactive Points */}
                {pointsAI.map((pt, index) => (
                  <g
                    key={index}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredDataPoint({
                        date: pt.date,
                        gmv: pt.gmv,
                        aiRevenue: pt.aiRevenue,
                        orders: pt.orders
                      })
                    }
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  >
                    {/* GMV Dot */}
                    <circle
                      cx={pointsGMV[index].x}
                      cy={pointsGMV[index].y}
                      r="4"
                      className="fill-blue-400 stroke-2 stroke-slate-900 transition-transform hover:scale-150"
                    />

                    {/* AI Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      className="fill-purple-400 stroke-2 stroke-[#0B1121] transition-transform hover:scale-150"
                    />

                    {/* X-axis Label */}
                    <text
                      x={pt.x}
                      y={height - 2}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {pt.date}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Card */}
              {hoveredDataPoint && (
                <div className="absolute top-2 right-4 bg-slate-900 border border-purple-500/60 rounded-xl p-3 shadow-2xl text-xs space-y-1 animate-in fade-in zoom-in-95 pointer-events-none">
                  <p className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                    <span>{hoveredDataPoint.date}</span>
                    <span className="text-[10px] text-purple-300 font-normal">
                      {hoveredDataPoint.orders} Orders
                    </span>
                  </p>
                  <div className="flex items-center justify-between gap-6 text-blue-400">
                    <span>Gross GMV:</span>
                    <strong className="text-white">₹ {hoveredDataPoint.gmv.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-purple-400">
                    <span>AI Revenue:</span>
                    <strong className="text-purple-300">
                      ₹ {hoveredDataPoint.aiRevenue.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TWO COLUMNS: Settlement Schedule & Top Revenue Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Product-Level Revenue Table */}
            <div className="lg:col-span-2 bg-[#151c2f] border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">Top Revenue Generating Products</h3>
                  <p className="text-xs text-slate-400">Catalog items driving highest gross margins & AI sales</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('merchant-products');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Products</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Units Sold</th>
                      <th className="py-3 px-3">AI Sales Share</th>
                      <th className="py-3 px-4 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.slice(0, 5).map((prod, index) => {
                      const estimatedUnits = Math.max(4, prod.purchased || (12 - index * 2));
                      const rawPrice = prod.rawPrice || 15000;
                      const productRevenue = rawPrice * estimatedUnits;
                      const aiShare = Math.min(95, (prod.aiMatch || 80) + 5);

                      return (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-700"
                              />
                              <div>
                                <p className="font-bold text-slate-100 truncate max-w-[180px]">
                                  {prod.name}
                                </p>
                                <span className="text-[10px] text-slate-400">{prod.category}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-semibold text-slate-200">{prod.price}</td>

                          <td className="py-3 px-3 text-slate-300 font-medium">
                            {estimatedUnits} units
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-purple-500 h-full rounded-full"
                                  style={{ width: `${aiShare}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-purple-300">{aiShare}%</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-white">
                            ₹ {productRevenue.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 border-t border-slate-800 bg-slate-900/30 text-xs text-slate-400 flex items-center justify-between">
                <span>Calculated across active catalog inventory</span>
                <span className="font-semibold text-emerald-400">All prices INR Net</span>
              </div>
            </div>

            {/* Right 1 Column: Settlement Schedule & Bank Info */}
            <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">Payout Settlement</h3>
                  </div>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    Direct NEFT
                  </span>
                </div>

                {/* Upcoming Payout Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Next Scheduled Payout</span>
                    <span className="font-semibold text-white">Sep 04, 2026</span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    ₹ 1,74,500
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Processing 34 orders ready for clearance</span>
                  </p>
                </div>

                {/* Recent Settlements List */}
                <div className="space-y-2.5 mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-[11px]">
                    Recent Disbursed Settlements
                  </p>

                  <div className="space-y-2">
                    {settlements.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.amount}</span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.date} • {item.bank}</p>
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
                Automated weekly settlements initiated every Friday at 18:00 IST.
              </div>
            </div>
          </div>
    </div>
  );
};

export default MerchantRevenuePage;
