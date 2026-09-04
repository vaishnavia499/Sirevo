import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  Lightbulb,
  Bot,
  Zap,
  ArrowUpRight,
  Target,
  BarChart2,
  Check
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';
import { getStoredMerchantProducts } from '../utils/merchantProducts';

interface MerchantAIVisibilityPageProps {
  onNavigate?: NavigationHandler;
}

export const MerchantAIVisibilityPage: React.FC<MerchantAIVisibilityPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const products = getStoredMerchantProducts();

  // Navigation & UI States
  const [activeNav, setActiveNav] = useState<string>('visibility');
  const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    label: string;
    queries: number;
    shortlists: number;
    conversions: number;
  } | null>(null);

  // Clean 6 Core Nav Items (matching Dashboard, Orders, Products, Revenue, Suggestions)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  // Real Dynamic AI Match Score Calculation across catalog
  const { averageAiScore, highAiCount, totalSearches, totalShortlists, totalPurchases } = useMemo(() => {
    if (!products || products.length === 0) {
      return { averageAiScore: 92, highAiCount: 0, totalSearches: 320, totalShortlists: 86, totalPurchases: 24 };
    }
    const sum = products.reduce((acc, p) => acc + (p.aiMatch || 85), 0);
    const avg = Math.round(sum / products.length);
    const high = products.filter((p) => (p.aiMatch || 0) >= 80).length;
    const searches = products.reduce((acc, p) => acc + (p.aiSearches || 40), 0);
    const shortlists = products.reduce((acc, p) => acc + (p.shortlisted || 10), 0);
    const purchases = products.reduce((acc, p) => acc + (p.purchased || 4), 0);

    return {
      averageAiScore: avg,
      highAiCount: high,
      totalSearches: searches,
      totalShortlists: shortlists,
      totalPurchases: purchases
    };
  }, [products]);

  // Dynamic Chart Datasets for 7D vs 30D
  const chartData7D = [
    { label: 'Mon', queries: 32, shortlists: 9, conversions: 3 },
    { label: 'Tue', queries: 48, shortlists: 14, conversions: 4 },
    { label: 'Wed', queries: 41, shortlists: 11, conversions: 3 },
    { label: 'Thu', queries: 64, shortlists: 19, conversions: 6 },
    { label: 'Fri', queries: 82, shortlists: 24, conversions: 7 },
    { label: 'Sat', queries: 98, shortlists: 29, conversions: 9 },
    { label: 'Sun', queries: 85, shortlists: 23, conversions: 7 }
  ];

  const chartData30D = [
    { label: 'W1', queries: 180, shortlists: 48, conversions: 14 },
    { label: 'W2', queries: 245, shortlists: 66, conversions: 19 },
    { label: 'W3', queries: 310, shortlists: 84, conversions: 26 },
    { label: 'W4', queries: 395, shortlists: 108, conversions: 34 }
  ];

  const currentChartData = timeRange === '7D' ? chartData7D : chartData30D;

  // Top user queries matched by the AI conversational model (Crisp, High-Impact)
  const topSearches = [
    {
      id: 's1',
      query: 'Laptop under ₹60,000 with 16GB RAM',
      product: products[0]?.name || 'Lenovo IdeaPad Slim 5',
      match: '96%',
      hits: '164 hits',
      tag: 'High Intent'
    },
    {
      id: 's2',
      query: 'Best wireless noise cancelling headphones',
      product: products[1]?.name || 'Sony WH-1000XM5',
      match: '92%',
      hits: '118 hits',
      tag: 'Comparison'
    },
    {
      id: 's3',
      query: 'Ergonomic bluetooth mouse for coding',
      product: products[2]?.name || 'Logitech MX Master 3S',
      match: '89%',
      hits: '84 hits',
      tag: 'Direct Match'
    }
  ];

  // SVG Chart Geometry Calculations
  const chartWidth = 540;
  const chartHeight = 180;
  const padX = 35;
  const padY = 20;

  const maxVal = Math.max(...currentChartData.map((d) => d.queries)) * 1.2 || 100;

  const pointsQueries = currentChartData.map((d, i) => {
    const x = padX + (i / (currentChartData.length - 1)) * (chartWidth - 2 * padX);
    const y = chartHeight - padY - (d.queries / maxVal) * (chartHeight - 2 * padY);
    return { x, y, ...d };
  });

  const pointsShortlists = currentChartData.map((d, i) => {
    const x = padX + (i / (currentChartData.length - 1)) * (chartWidth - 2 * padX);
    const y = chartHeight - padY - ((d.shortlists * 3) / maxVal) * (chartHeight - 2 * padY);
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

  const pathQueries = generateSmoothPath(pointsQueries);
  const pathShortlists = generateSmoothPath(pointsShortlists);
  const areaQueries = `${pathQueries} L ${pointsQueries[pointsQueries.length - 1]?.x || chartWidth},${chartHeight - padY} L ${pointsQueries[0]?.x || 0},${chartHeight - padY} Z`;

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

  return (
    <div id="merchant-ai-visibility-layout" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* CRISP PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1
                  id="merchant-ai-visibility-title"
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                >
                  AI Visibility
                </h1>
                <span className="text-xs font-bold bg-purple-950/80 border border-purple-800/70 text-purple-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Live AI Engine
                </span>
              </div>
              <p
                id="merchant-ai-visibility-subtitle"
                className="text-sm text-slate-400 mt-1"
              >
                Track how AI shopping agents discover, rank, and recommend your products.
              </p>
            </div>

            {/* Right Action */}
            <button
              id="btn-improve-ai-visibility"
              type="button"
              onClick={() => setShowImproveModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-purple-950/40 transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              <span>Boost AI Ranking</span>
            </button>
          </div>

          {/* 4 HIGH-IMPACT METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: AI Search Hits */}
            <div
              id="metric-card-ai-searches"
              className="bg-[#151c2f] border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">AI Search Hits</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalSearches.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14% vs last week</span>
              </div>
            </div>

            {/* Card 2: AI Shortlists */}
            <div
              id="metric-card-product-shortlisted"
              className="bg-[#151c2f] border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">AI Shortlists</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalShortlists.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                <strong className="text-purple-300 font-semibold">
                  {Math.round((totalShortlists / (totalSearches || 1)) * 100)}%
                </strong>{' '}
                shortlist rate
              </div>
            </div>

            {/* Card 3: Agent Checkouts */}
            <div
              id="metric-card-purchases"
              className="bg-[#151c2f] border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">AI Conversions</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalPurchases.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8% order rate</span>
              </div>
            </div>

            {/* Card 4: AI Match Score Donut */}
            <div
              id="metric-card-ai-match-score"
              className="bg-[#151c2f] border border-purple-500/40 rounded-2xl p-4.5 flex flex-col justify-between shadow-lg shadow-purple-950/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">Catalog Match Score</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>

              {/* Dynamic Donut Chart Graphic */}
              <div className="my-1 flex items-center justify-center gap-3">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <defs>
                      <linearGradient id="scoreGradientCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <path
                      stroke="url(#scoreGradientCompact)"
                      strokeDasharray={`${averageAiScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-white">
                    {averageAiScore}%
                  </span>
                </div>

                <div>
                  <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                    Top Tier
                  </span>
                  <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                    {highAiCount}/{products.length} Products Ready
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium truncate">
                1-shot AI recommendation active
              </div>
            </div>
          </div>

          {/* DYNAMIC CHART & TOP SEARCHES SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Visual Discovery Trend */}
            <div
              id="ai-searches-chart-card"
              className="lg:col-span-2 bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm space-y-3"
            >
              {/* Header & Range Toggle */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Discovery & Shortlist Trends
                  </h3>
                </div>

                {/* 7D vs 30D Filter Pill */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTimeRange('7D')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      timeRange === '7D'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    7D
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange('30D')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      timeRange === '30D'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    30D
                  </button>
                </div>
              </div>

              {/* Interactive Smooth SVG Graph */}
              <div className="relative pt-2 pb-1">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-48 overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="aiQueryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>

                    <linearGradient id="aiStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0.33, 0.66, 1].map((ratio) => {
                    const y = chartHeight - padY - ratio * (chartHeight - 2 * padY);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padX}
                          y1={y}
                          x2={chartWidth - padX}
                          y2={y}
                          stroke="#1e293b"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padX - 6}
                          y={y + 3}
                          fill="#64748b"
                          fontSize="9"
                          textAnchor="end"
                          fontWeight="600"
                        >
                          {Math.round(maxVal * ratio)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Fill */}
                  <path d={areaQueries} fill="url(#aiQueryGrad)" />

                  {/* Queries Stroke */}
                  <path
                    d={pathQueries}
                    fill="none"
                    stroke="url(#aiStrokeGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Shortlists Line (Dotted Purple) */}
                  <path
                    d={pathShortlists}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />

                  {/* Interactive Points */}
                  {pointsQueries.map((pt, idx) => (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredChartPoint({
                          label: pt.label,
                          queries: pt.queries,
                          shortlists: pt.shortlists,
                          conversions: pt.conversions
                        })
                      }
                      onMouseLeave={() => setHoveredChartPoint(null)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        className="fill-blue-400 stroke-2 stroke-[#0B1121] transition-transform hover:scale-150"
                      />
                      <circle
                        cx={pointsShortlists[idx].x}
                        cy={pointsShortlists[idx].y}
                        r="3"
                        className="fill-purple-400 stroke-2 stroke-[#0B1121] transition-transform hover:scale-150"
                      />
                      <text
                        x={pt.x}
                        y={chartHeight - 4}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Hover Tooltip Card */}
                {hoveredChartPoint && (
                  <div className="absolute top-0 right-2 bg-slate-900 border border-purple-500/60 rounded-lg p-2.5 shadow-2xl text-xs space-y-1 animate-in fade-in zoom-in-95 pointer-events-none">
                    <p className="font-bold text-white border-b border-slate-800 pb-0.5">
                      {hoveredChartPoint.label}
                    </p>
                    <div className="flex items-center justify-between gap-4 text-blue-400 text-[11px]">
                      <span>Searches:</span>
                      <strong className="text-white">{hoveredChartPoint.queries}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-purple-400 text-[11px]">
                      <span>Shortlists:</span>
                      <strong className="text-purple-300">{hoveredChartPoint.shortlists}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-emerald-400 text-[11px]">
                      <span>Orders:</span>
                      <strong className="text-emerald-300">{hoveredChartPoint.conversions}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-300 text-xs">Searches</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1 bg-purple-500 rounded" />
                    <span className="text-purple-300 text-xs">Shortlists</span>
                  </div>
                </div>
                <span className="text-slate-500 text-[11px]">Live Sync</span>
              </div>
            </div>

            {/* Right Column: Top Conversational Buyer Queries (Clean, Message-Focused) */}
            <div
              id="top-ai-searches-card"
              className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      Matched Buyer Queries
                    </h3>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    High Intent
                  </span>
                </div>

                {/* Query Cards */}
                <div className="space-y-2.5 mt-3">
                  {topSearches.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1e293b]/90 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white truncate">
                          "{item.query}"
                        </p>
                        <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                          {item.match}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300 truncate">
                          <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">{item.product}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] shrink-0 font-medium">
                          {item.hits}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('merchant-ai-suggestions');
                }}
                className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer w-full"
              >
                <span>View AI Suggestions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI MATCH SCORE BREAKDOWN MATRIX (Visual & Compact) */}
          <div className="bg-[#151c2f] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Ranking Factors
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('merchant-products');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Specs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Tech Specs</span>
                  <span className="text-xs font-bold text-emerald-400">96%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                </div>
                <p className="text-[11px] text-slate-400">RAM, CPU, storage complete</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">In-Stock Rate</span>
                  <span className="text-xs font-bold text-emerald-400">92%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
                <p className="text-[11px] text-slate-400">Healthy inventory level</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Price Match</span>
                  <span className="text-xs font-bold text-purple-400">88%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '88%' }} />
                </div>
                <p className="text-[11px] text-slate-400">Competitive vs market price</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Fast Delivery</span>
                  <span className="text-xs font-bold text-blue-400">85%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-[11px] text-slate-400">2-day dispatch badge</p>
              </div>
            </div>
          </div>

      {/* OPTIMIZE MODAL (Action-focused) */}
      {showImproveModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Boost AI Ranking</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImproveModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Add Specific Tech Specs</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    GPU, RAM speed, and dimensions boost match frequency by +28%.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Maintain Active Stock</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Zero-inventory items are omitted from AI shopping prompts.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImproveModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImproveModal(false);
                  if (onNavigate) onNavigate('merchant-products');
                }}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md cursor-pointer"
              >
                Update Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantAIVisibilityPage;
