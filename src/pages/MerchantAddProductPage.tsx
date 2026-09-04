import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Share2,
  Clock,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Sparkles,
  Plus,
  UploadCloud,
  CheckCircle2,
  Circle,
  Moon,
  Sun,
  X,
  ChevronDown,
  ArrowLeft,
  Check,
  FileText,
  Truck,
  RotateCcw,
  Sliders,
  Menu,
  LogOut
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MerchantProduct,
  getStoredMerchantProducts,
  saveStoredMerchantProducts
} from '../utils/merchantProducts';

interface MerchantAddProductPageProps {
  onNavigate?: NavigationHandler;
  embedded?: boolean;
}

export const MerchantAddProductPage: React.FC<MerchantAddProductPageProps> = ({ onNavigate, embedded = false }) => {
  const { user, logout } = useAuth();

  // Sidebar & Top Nav state
  const [activeNav, setActiveNav] = useState<string>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Form states
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number | string>(50);
  const [shippingWeight, setShippingWeight] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);
  const [readinessScore, setReadinessScore] = useState(85);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files) as File[];
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prev) => [...prev, ...newUrls]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prev) => [...prev, ...newUrls]);
    }
  };

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setAiGeneratedSuccess(true);
      setReadinessScore(98);
      if (!description) {
        setDescription(
          'Engineered with industry-leading active noise cancellation, custom 40mm dynamic drivers, and up to 30 hours of ultra-low latency playback. Optimized with multi-point Bluetooth 5.3 pairing and crystal-clear beamforming microphone arrays for calls and gaming.'
        );
      }
      setTimeout(() => setAiGeneratedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div id="merchant-add-product-layout" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* ===================================================================== */}
      {/* 3. MAIN CONTENT HEADER                                                */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('merchant-dashboard')}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors mr-1 cursor-pointer"
                    title="Back to Dashboard"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1
                  id="merchant-add-product-title"
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                >
                  Add Product
                </h1>
              </div>
              <p
                id="merchant-add-product-subtitle"
                className="text-sm text-slate-400 mt-1"
              >
                Provide comprehensive details to optimize your product for AI discovery.
              </p>
            </div>

            {/* Quick Action Preview */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Product draft saved successfully!');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#151c2f] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!productName) {
                    alert('Please enter a product name before publishing.');
                    return;
                  }

                  const numPrice = parseFloat(price) || 2999;
                  const numStock = Math.max(0, parseInt(String(stockQuantity)) || 25);
                  const generatedId = `prod-${Date.now()}`;
                  const defaultImg = uploadedImages[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80';

                  const newProd: MerchantProduct = {
                    id: generatedId,
                    name: productName,
                    image: defaultImg,
                    price: price.startsWith('₹') || price.startsWith('$') ? price : `₹${numPrice.toLocaleString()}`,
                    rawPrice: numPrice,
                    stock: numStock,
                    stockLabel: numStock === 0 ? 'Out of stock' : numStock <= 5 ? `${numStock} left` : undefined,
                    lowStockThreshold: 5,
                    aiMatch: readinessScore || 90,
                    aiSearches: 120,
                    shortlisted: 34,
                    purchased: 6,
                    status: numStock > 0 ? 'Active' : 'Disabled',
                    category: category || 'General',
                    sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
                    stockLogs: [
                      {
                        id: `log-${Date.now()}`,
                        timestamp: 'Just now',
                        previousStock: 0,
                        newStock: numStock,
                        change: numStock,
                        reason: 'Initial product release stock'
                      }
                    ]
                  };

                  const existing = getStoredMerchantProducts();
                  saveStoredMerchantProducts([newProd, ...existing]);

                  alert(`"${productName}" published with ${numStock} available units and indexed for AI discovery!`);
                  if (onNavigate) onNavigate('merchant-products');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                Publish Product
              </button>
            </div>
          </div>

          {/* AI Banner feedback */}
          {aiGeneratedSuccess && (
            <div className="p-3.5 bg-purple-950/60 border border-purple-700/60 rounded-xl text-purple-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>AI Enrichment Complete:</strong> Generated semantic product parameters, keywords, and intent tags for AI shopping queries.
                </span>
              </div>
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          )}

          {/* ===================================================================== */}
          {/* 4. CONTENT LAYOUT (Two Columns: 2/3 Left, 1/3 Right)                  */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* =================================================================== */}
            {/* 5. LEFT COLUMN (Form Sections - 2/3 width)                          */}
            {/* =================================================================== */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card 1: Basic Information */}
              <div
                id="card-basic-information"
                className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-sm space-y-5"
              >
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Basic Information
                </h2>

                {/* Product Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-product-name"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wide"
                  >
                    Product Name
                  </label>
                  <input
                    id="input-product-name"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="textarea-description"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wide"
                    >
                      Description
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Supports natural language search
                    </span>
                  </div>
                  <textarea
                    id="textarea-description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product features and benefits..."
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors leading-relaxed resize-none"
                  />
                </div>

                {/* Flex Row (2 columns): Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="select-category"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wide"
                    >
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="select-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-purple-500 transition-colors pr-10 cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        <option value="Audio & Headphones">Audio & Headphones</option>
                        <option value="Laptops & Computers">Laptops & Computers</option>
                        <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                        <option value="Wearables & Watches">Wearables & Watches</option>
                        <option value="Gaming Accessories">Gaming Accessories</option>
                        <option value="Smart Home & IoT">Smart Home & IoT</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price (USD) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="input-price"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wide"
                    >
                      Price (USD)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400 font-semibold text-sm">
                        $
                      </span>
                      <input
                        id="input-price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 2: Product Images */}
              <div
                id="card-product-images"
                className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Product Images
                  </h2>
                  <span className="text-xs text-slate-400">
                    High resolution images boost AI visual matching
                  </span>
                </div>

                {/* Dropzone area */}
                <label
                  htmlFor="file-dropzone-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 mt-4 cursor-pointer transition-colors text-center block ${
                    isDragging
                      ? 'border-purple-500 bg-purple-950/20'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                  }`}
                >
                  <input
                    id="file-dropzone-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                    <UploadCloud className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mt-3">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </label>

                {/* Image Previews if uploaded */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {uploadedImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden border border-slate-700 aspect-square group"
                      >
                        <img
                          src={url}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 3: Specifications & Logistics */}
              <div
                id="card-specifications-logistics"
                className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Specifications & Logistics
                  </h2>
                  <span className="text-xs text-slate-400">Optional for initial indexing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      SKU / Identifier
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. WH-1000-BLK"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Shipping Weight
                    </label>
                    <input
                      type="text"
                      value={shippingWeight}
                      onChange={(e) => setShippingWeight(e.target.value)}
                      placeholder="e.g. 250g"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* =================================================================== */}
            {/* 6. RIGHT COLUMN (AI Optimization Hub - 1/3 width)                   */}
            {/* =================================================================== */}
            <div className="lg:col-span-1 space-y-6">
              
              <div
                id="card-ai-optimization-hub"
                className="bg-[#151c2f] border border-purple-900/50 rounded-xl p-6 shadow-xl shadow-purple-950/20 space-y-5"
              >
                {/* Header: Sparkle icon and 'AI Optimization Hub' */}
                <div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      AI Optimization Hub
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Maximize your product&apos;s visibility across AI shopping assistants. We structure your data so AI agents can confidently recommend your product.
                  </p>
                </div>

                {/* Action Button: 'Generate AI-Readable Info' */}
                <button
                  id="btn-generate-ai-readable-info"
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAI ? 'Structuring Data...' : 'Generate AI-Readable Info'}</span>
                </button>

                {/* Readiness Score */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      AI Readiness
                    </span>
                    <span className="text-2xl font-extrabold text-white tracking-tight">
                      {readinessScore}%
                    </span>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${readinessScore}%` }}
                    />
                  </div>
                </div>

                {/* Checklist: Requirements */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Optimization Checklist
                  </span>

                  <ul className="space-y-2.5 text-xs">
                    {/* Item 1: Product name */}
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium">Product name</span>
                    </li>

                    {/* Item 2: Price */}
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium">Price</span>
                    </li>

                    {/* Item 3: Specifications */}
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium">Specifications</span>
                    </li>

                    {/* Item 4: Stock */}
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium">Stock</span>
                    </li>

                    {/* Item 5: Delivery information (empty circle) */}
                    <li className="flex items-center gap-2.5 text-slate-500">
                      <Circle className="w-4 h-4 text-slate-600 shrink-0 stroke-[1.5]" />
                      <span>Delivery information</span>
                    </li>

                    {/* Item 6: Return policy (empty circle) */}
                    <li className="flex items-center gap-2.5 text-slate-500">
                      <Circle className="w-4 h-4 text-slate-600 shrink-0 stroke-[1.5]" />
                      <span>Return policy</span>
                    </li>
                  </ul>
                </div>

                {/* AI Intent Tags Preview */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Detected AI Intent Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      #noise-cancelling
                    </span>
                    <span className="bg-blue-950/60 border border-blue-800/60 text-blue-300 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      #travel-headphones
                    </span>
                    <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      #long-battery
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

    </div>
  );
};
