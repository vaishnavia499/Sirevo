import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Eye,
  ShoppingBag,
  TrendingUp,
  Share2,
  Clock,
  Sparkles,
  Search,
  Bell,
  HelpCircle,
  Plus,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Lock,
  ArrowUpRight,
  Filter,
  Check,
  MoreVertical,
  Edit2,
  Edit3,
  Minus,
  CheckCircle2,
  RotateCcw,
  ArrowDownRight,
  History,
  AlertCircle,
  Boxes,
  Trash2,
  Copy,
  Image as ImageIcon,
  Tag,
  ListPlus,
  Sliders,
  DollarSign,
  ShieldCheck,
  UploadCloud,
  FileText,
  ExternalLink,
  Layers,
  LogOut
} from 'lucide-react';
import { NavigationHandler } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MerchantProduct,
  getStoredMerchantProducts,
  saveStoredMerchantProducts
} from '../utils/merchantProducts';

interface MerchantProductsPageProps {
  onNavigate?: NavigationHandler;
}

const CATEGORY_PRESETS = [
  'Laptops',
  'Audio',
  'Accessories',
  'Smartphones',
  'Monitors',
  'Wearables',
  'Cameras',
  'Gaming'
];

const PRESET_IMAGES: { label: string; url: string }[] = [
  {
    label: 'Laptop (IdeaPad)',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'MacBook Pro',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Headphones (Sony ANC)',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Earbuds',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Wireless Mouse (MX Master)',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mechanical Keyboard',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Smartwatch',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Gaming Monitor',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80'
  }
];

export const MerchantProductsPage: React.FC<MerchantProductsPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  // Navigation & UI States
  const [activeNav, setActiveNav] = useState<string>('products');
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'out_of_stock' | 'low_ai'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Products Data State (with localStorage persistence)
  const [products, setProducts] = useState<MerchantProduct[]>(() => getStoredMerchantProducts());
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Full Product Edit Modal State (Edit ALL Fields)
  // -------------------------------------------------------------
  const [editingProduct, setEditingProduct] = useState<MerchantProduct | null>(null);
  const [editTab, setEditTab] = useState<'general' | 'inventory' | 'specs' | 'media' | 'ai'>('general');
  
  // Full Edit Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Laptops');
  const [formBrand, setFormBrand] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(0);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState<number>(5);
  const [formStatus, setFormStatus] = useState<'Active' | 'Disabled'>('Active');
  const [formAutoDisableOnZero, setFormAutoDisableOnZero] = useState<boolean>(true);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWarranty, setFormWarranty] = useState('');
  const [formAiMatch, setFormAiMatch] = useState<number>(90);
  const [formSpecs, setFormSpecs] = useState<string[]>([]);
  const [newSpecInput, setNewSpecInput] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [formStockReason, setFormStockReason] = useState<string>('Inventory update');
  const [formCustomReason, setFormCustomReason] = useState<string>('');

  // -------------------------------------------------------------
  // Dedicated Quick Stock Adjustment Modal State
  // -------------------------------------------------------------
  const [selectedProductForStock, setSelectedProductForStock] = useState<MerchantProduct | null>(null);
  const [stockEditValue, setStockEditValue] = useState<number>(0);
  const [stockEditReason, setStockEditReason] = useState<string>('Customer order fulfilled');
  const [customReason, setCustomReason] = useState<string>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [autoDisableOnZero, setAutoDisableOnZero] = useState<boolean>(true);

  // Inline table stock editing state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineStockValue, setInlineStockValue] = useState<number>(0);

  // Toast / Feedback Notification state
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    description: string;
    type?: 'success' | 'warning' | 'info';
  } | null>(null);

  // Sync to localStorage on state change
  useEffect(() => {
    saveStoredMerchantProducts(products);
  }, [products]);

  // Show Toast Helper
  const showToast = (title: string, description: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastNotification({ title, description, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  // -------------------------------------------------------------
  // Open Full Product Editor Modal (Populate all state fields)
  // -------------------------------------------------------------
  const handleOpenFullEditModal = (prod: MerchantProduct) => {
    setEditingProduct(prod);
    setEditTab('general');
    setFormName(prod.name);
    setFormCategory(prod.category || 'Laptops');
    setFormBrand(prod.brand || '');
    setFormSku(prod.sku || '');
    setFormPrice(prod.rawPrice || 0);
    setFormOriginalPrice(prod.rawOriginalPrice || prod.rawPrice || 0);
    setFormStock(prod.stock);
    setFormLowStockThreshold(prod.lowStockThreshold || 5);
    setFormStatus(prod.status);
    setFormAutoDisableOnZero(true);
    setFormImage(prod.image);
    setFormDescription(prod.description || '');
    setFormWarranty(prod.warranty || '1 Year Brand Warranty');
    setFormAiMatch(prod.aiMatch || 90);
    setFormSpecs(prod.specifications && prod.specifications.length > 0 ? [...prod.specifications] : [
      'Processor: High-speed multi-core',
      'Memory: Fast responsive RAM',
      'Battery: Extended all-day longevity'
    ]);
    setNewSpecInput('');
    setFormTags(prod.tags && prod.tags.length > 0 ? [...prod.tags] : ['featured', 'tech', 'bestseller']);
    setNewTagInput('');
    setFormStockReason('Customer order fulfilled');
    setFormCustomReason('');
    setOpenActionMenuId(null);
  };

  // Close Full Product Edit Modal
  const handleCloseFullEditModal = () => {
    setEditingProduct(null);
  };

  // Save Full Product Edit Changes
  const handleSaveFullEditModal = () => {
    if (!editingProduct) return;

    if (!formName.trim()) {
      alert('Product name cannot be empty.');
      return;
    }

    const previousStock = editingProduct.stock;
    const newStock = Math.max(0, formStock);
    const stockChange = newStock - previousStock;
    const effectiveStockReason = formStockReason === 'Other' && formCustomReason.trim()
      ? formCustomReason.trim()
      : formStockReason;

    // Create log if stock was changed
    let updatedLogs = editingProduct.stockLogs || [];
    if (stockChange !== 0) {
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        previousStock,
        newStock,
        change: stockChange,
        reason: effectiveStockReason
      };
      updatedLogs = [newLog, ...updatedLogs].slice(0, 10);
    }

    let finalStatus = formStatus;
    if (newStock === 0 && formAutoDisableOnZero) {
      finalStatus = 'Disabled';
    } else if (newStock > 0 && formStatus === 'Disabled' && previousStock === 0) {
      finalStatus = 'Active';
    }

    const formattedPrice = `₹${formPrice.toLocaleString('en-IN')}`;
    const formattedOriginalPrice = formOriginalPrice > 0 ? `₹${formOriginalPrice.toLocaleString('en-IN')}` : undefined;

    const updatedProduct: MerchantProduct = {
      ...editingProduct,
      name: formName.trim(),
      category: formCategory,
      brand: formBrand.trim(),
      sku: formSku.trim() || editingProduct.sku,
      price: formattedPrice,
      rawPrice: formPrice,
      originalPrice: formattedOriginalPrice,
      rawOriginalPrice: formOriginalPrice,
      stock: newStock,
      stockLabel: newStock === 0 ? 'Out of stock' : newStock <= formLowStockThreshold ? `${newStock} left` : undefined,
      lowStockThreshold: formLowStockThreshold,
      status: finalStatus,
      image: formImage.trim() || editingProduct.image,
      description: formDescription.trim(),
      warranty: formWarranty.trim(),
      aiMatch: formAiMatch,
      specifications: formSpecs,
      tags: formTags,
      stockLogs: updatedLogs
    };

    const updatedList = products.map((item) => (item.id === editingProduct.id ? updatedProduct : item));
    setProducts(updatedList);
    setEditingProduct(null);

    showToast(
      'Product Updated Successfully',
      `All details for "${updatedProduct.name}" (Price, Stock: ${updatedProduct.stock}, Specs, AI score) have been saved.`
    );
  };

  // Add Spec
  const handleAddSpec = () => {
    if (!newSpecInput.trim()) return;
    setFormSpecs((prev) => [...prev, newSpecInput.trim()]);
    setNewSpecInput('');
  };

  // Remove Spec
  const handleRemoveSpec = (index: number) => {
    setFormSpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!formTags.includes(newTagInput.trim().toLowerCase())) {
      setFormTags((prev) => [...prev, newTagInput.trim().toLowerCase()]);
    }
    setNewTagInput('');
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Image Upload handler (convert to Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Duplicate Product
  const handleDuplicateProduct = (prod: MerchantProduct) => {
    const duplicated: MerchantProduct = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku || 'SKU'}-COPY`,
      purchased: 0,
      shortlisted: 0,
      stockLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          previousStock: 0,
          newStock: prod.stock,
          change: prod.stock,
          reason: 'Cloned from ' + prod.name
        }
      ]
    };
    setProducts((prev) => [duplicated, ...prev]);
    setOpenActionMenuId(null);
    showToast('Product Duplicated', `Created a copy of "${prod.name}" as "${duplicated.name}".`);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from your catalog?`)) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setOpenActionMenuId(null);
      showToast('Product Deleted', `"${name}" was removed from the merchant catalog.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // Open Edit Stock Modal
  // -------------------------------------------------------------
  const handleOpenStockModal = (prod: MerchantProduct) => {
    setSelectedProductForStock(prod);
    setStockEditValue(prod.stock);
    setLowStockThreshold(prod.lowStockThreshold || 5);
    setStockEditReason('Customer order fulfilled');
    setCustomReason('');
    setAutoDisableOnZero(true);
    setOpenActionMenuId(null);
  };

  // Close Stock Modal
  const handleCloseStockModal = () => {
    setSelectedProductForStock(null);
  };

  // Submit Quick Stock Update Modal
  const handleSaveStockModal = () => {
    if (!selectedProductForStock) return;

    const previousStock = selectedProductForStock.stock;
    const newStock = Math.max(0, stockEditValue);
    const change = newStock - previousStock;
    const effectiveReason = stockEditReason === 'Other' && customReason.trim() ? customReason.trim() : stockEditReason;

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      previousStock,
      newStock,
      change,
      reason: effectiveReason
    };

    let newStatus = selectedProductForStock.status;
    if (newStock === 0 && autoDisableOnZero) {
      newStatus = 'Disabled';
    } else if (newStock > 0 && selectedProductForStock.status === 'Disabled' && previousStock === 0) {
      newStatus = 'Active';
    }

    const updated = products.map((item) => {
      if (item.id === selectedProductForStock.id) {
        const existingLogs = item.stockLogs || [];
        return {
          ...item,
          stock: newStock,
          stockLabel: newStock === 0 ? 'Out of stock' : newStock <= (lowStockThreshold || 5) ? `${newStock} left` : undefined,
          lowStockThreshold,
          status: newStatus,
          stockLogs: [newLog, ...existingLogs].slice(0, 10)
        };
      }
      return item;
    });

    setProducts(updated);
    setSelectedProductForStock(null);

    showToast(
      change < 0 ? 'Stock Decreased' : 'Stock Updated',
      `${selectedProductForStock.name}: Available stock is now ${newStock} units (${change > 0 ? `+${change}` : change}). Reason: ${effectiveReason}`
    );
  };

  // Quick Direct Stock Adjustment (-1 / +1)
  const handleQuickStockAdjust = (id: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const target = products.find((p) => p.id === id);
    if (!target) return;

    const previousStock = target.stock;
    const newStock = Math.max(0, previousStock + delta);
    if (previousStock === newStock) return;

    const change = newStock - previousStock;
    const reason = change < 0 ? 'Direct unit decrease' : 'Stock replenishment';

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      previousStock,
      newStock,
      change,
      reason
    };

    let newStatus = target.status;
    if (newStock === 0) {
      newStatus = 'Disabled';
    } else if (newStock > 0 && target.status === 'Disabled' && previousStock === 0) {
      newStatus = 'Active';
    }

    const updated = products.map((item) => {
      if (item.id === id) {
        const existingLogs = item.stockLogs || [];
        return {
          ...item,
          stock: newStock,
          stockLabel: newStock === 0 ? 'Out of stock' : newStock <= (item.lowStockThreshold || 5) ? `${newStock} left` : undefined,
          status: newStatus,
          stockLogs: [newLog, ...existingLogs].slice(0, 10)
        };
      }
      return item;
    });

    setProducts(updated);

    showToast(
      change < 0 ? 'Stock Decreased' : 'Stock Increased',
      `${target.name}: ${previousStock} → ${newStock} units (${change > 0 ? `+${change}` : change})`
    );
  };

  // Start inline stock edit
  const handleStartInlineEdit = (prod: MerchantProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setInlineEditingId(prod.id);
    setInlineStockValue(prod.stock);
  };

  // Save inline stock edit
  const handleSaveInlineEdit = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) {
      setInlineEditingId(null);
      return;
    }

    const previousStock = target.stock;
    const newStock = Math.max(0, inlineStockValue);
    const change = newStock - previousStock;

    if (change !== 0) {
      const reason = change < 0 ? 'Manual decrease' : 'Manual increase';
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        previousStock,
        newStock,
        change,
        reason
      };

      let newStatus = target.status;
      if (newStock === 0) {
        newStatus = 'Disabled';
      } else if (newStock > 0 && target.status === 'Disabled' && previousStock === 0) {
        newStatus = 'Active';
      }

      const updated = products.map((item) => {
        if (item.id === id) {
          const existingLogs = item.stockLogs || [];
          return {
            ...item,
            stock: newStock,
            stockLabel: newStock === 0 ? 'Out of stock' : newStock <= (item.lowStockThreshold || 5) ? `${newStock} left` : undefined,
            status: newStatus,
            stockLogs: [newLog, ...existingLogs].slice(0, 10)
          };
        }
        return item;
      });

      setProducts(updated);

      showToast(
        change < 0 ? 'Stock Decreased' : 'Stock Updated',
        `${target.name}: ${previousStock} → ${newStock} units (${change > 0 ? `+${change}` : change})`
      );
    }

    setInlineEditingId(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'visibility', label: 'AI Visibility', icon: Eye },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'suggestions', label: 'AI Suggestions', icon: Share2 },
  ] as const;

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = tableSearch.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.sku && item.sku.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeFilter === 'live') {
        return item.status === 'Active' && item.stock > 0;
      }
      if (activeFilter === 'out_of_stock') {
        return item.stock === 0;
      }
      if (activeFilter === 'low_ai') {
        return item.aiMatch < 60;
      }

      return true;
    });
  }, [products, tableSearch, activeFilter]);

  const handleToggleStatus = (id: string, newStatus: 'Active' | 'Disabled') => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setOpenStatusDropdownId(null);
  };

  return (
    <div id="merchant-portal-products-layout" className="space-y-6 max-w-7xl w-full mx-auto">
      {/* Dynamic Toast Feedback */}
      {toastNotification && (
        <div className="p-3.5 bg-slate-900 border border-purple-500/60 rounded-xl shadow-xl shadow-purple-950/40 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              toastNotification.type === 'warning'
                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {toastNotification.title}
              </p>
              <p className="text-slate-300 text-xs mt-0.5">
                {toastNotification.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. PAGE HEADER                                                        */}
      {/* ===================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                id="merchant-products-page-title"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5"
              >
                <span>Product Catalog & Inventory</span>
                <span className="text-xs font-semibold bg-purple-950/80 border border-purple-800/70 text-purple-300 px-2.5 py-0.5 rounded-full">
                  {products.length} Products
                </span>
              </h1>
              <p
                id="merchant-products-page-subtitle"
                className="text-sm text-slate-400 mt-1"
              >
                Click any product to edit all details (name, price, category, stock, specs, and AI scores).
              </p>
            </div>

            {/* Right Primary Buttons: 'Add Product' */}
            <div className="flex items-center gap-2.5">
              <button
                id="btn-header-add-product"
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('merchant-add-product');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm transition-colors shadow-lg shadow-blue-900/30 cursor-pointer active:scale-[0.98] shrink-0"
              >
                <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. FILTERS & SEARCH (Above the table)                                 */}
          {/* ===================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            
            {/* Left (Filters): Pill-shaped buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                id="filter-pill-all"
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-purple-950/50 border border-purple-500 text-purple-300 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                All ({products.length})
              </button>

              <button
                id="filter-pill-live"
                type="button"
                onClick={() => setActiveFilter('live')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'live'
                    ? 'bg-purple-950/50 border border-purple-500 text-purple-300 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                Live in Stock ({products.filter((p) => p.status === 'Active' && p.stock > 0).length})
              </button>

              <button
                id="filter-pill-out-of-stock"
                type="button"
                onClick={() => setActiveFilter('out_of_stock')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === 'out_of_stock'
                    ? 'bg-purple-950/50 border border-purple-500 text-purple-300 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                Out of Stock ({products.filter((p) => p.stock === 0).length})
              </button>

              <button
                id="filter-pill-low-ai"
                type="button"
                onClick={() => setActiveFilter('low_ai')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFilter === 'low_ai'
                    ? 'bg-purple-950/50 border border-purple-500 text-purple-300 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Low AI Readiness</span>
              </button>
            </div>

            {/* Right (Search): Secondary search bar specific to table */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="table-products-search-input"
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search name, SKU, brand, category..."
                className="w-full bg-[#151c2f] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. DATA TABLE CONTAINER                                               */}
          {/* ===================================================================== */}
          <div
            id="merchant-products-table-container"
            className="bg-[#151c2f] border border-slate-800 rounded-2xl overflow-hidden mt-6 shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                {/* 5. Table Layout & Headers */}
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 sm:px-6">Product Details</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock Available</th>
                    <th className="py-3.5 px-4">AI Match</th>
                    <th className="py-3.5 px-4">AI Searches</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredProducts.map((prod) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Column 1: Product (Thumbnail + Name + Category + SKU) */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => handleOpenFullEditModal(prod)}
                            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group-hover:border-purple-500 transition-colors"
                            title="Click to edit product"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenFullEditModal(prod)}
                              className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors text-left text-sm hover:underline cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{prod.name}</span>
                              <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                            </button>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
                                {prod.category}
                              </span>
                              {prod.brand && (
                                <span className="text-[11px] text-slate-400">
                                  {prod.brand}
                                </span>
                              )}
                              {prod.sku && (
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                                  {prod.sku}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Price & Original Price */}
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <div>{prod.price}</div>
                        {prod.originalPrice && (
                          <div className="text-[11px] text-slate-500 line-through">
                            {prod.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Stock Available (Interactive Steppers, Inline Edit, Badge) */}
                      <td className="py-4 px-4">
                        {inlineEditingId === prod.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={inlineStockValue}
                              onChange={(e) => setInlineStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineEdit(prod.id);
                                if (e.key === 'Escape') setInlineEditingId(null);
                              }}
                              className="w-16 bg-slate-900 border border-purple-500 text-white rounded-lg px-2 py-1 text-xs font-bold text-center focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(prod.id)}
                              className="p-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                              title="Save stock"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlineEditingId(null)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {/* Fast Decrement Button */}
                            <button
                              type="button"
                              id={`decrease-stock-btn-${prod.id}`}
                              onClick={(e) => handleQuickStockAdjust(prod.id, -1, e)}
                              disabled={prod.stock === 0}
                              className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 hover:bg-rose-950/60 hover:border-rose-700/80 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:border-slate-700 disabled:cursor-not-allowed cursor-pointer"
                              title="Decrease stock by 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            {/* Stock Badge / Value */}
                            <div
                              onClick={(e) => handleStartInlineEdit(prod, e)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                                prod.stock === 0
                                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-400'
                                  : prod.stock <= (prod.lowStockThreshold || 5)
                                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-400'
                                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                              }`}
                              title="Click to edit stock quantity inline"
                            >
                              <span>{prod.stock}</span>
                              <span className="text-[10px] font-medium opacity-80">
                                {prod.stock === 0 ? 'Out of stock' : prod.stock <= (prod.lowStockThreshold || 5) ? 'Low' : 'units'}
                              </span>
                            </div>

                            {/* Fast Increment Button */}
                            <button
                              type="button"
                              id={`increase-stock-btn-${prod.id}`}
                              onClick={(e) => handleQuickStockAdjust(prod.id, 1, e)}
                              className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 hover:bg-emerald-950/60 hover:border-emerald-700/80 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Column 4: AI Match */}
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              prod.aiMatch >= 80 ? 'bg-emerald-400 shadow-xs shadow-emerald-500/50' : prod.aiMatch >= 60 ? 'bg-blue-400' : 'bg-amber-400'
                            }`}
                          />
                          <span>{prod.aiMatch}%</span>
                        </div>
                      </td>

                      {/* Column 5: AI Searches */}
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        <div>{prod.aiSearches} searches</div>
                        <div className="text-[11px] text-slate-500">{prod.shortlisted} shortlisted</div>
                      </td>

                      {/* Column 6: Status Toggle */}
                      <td className="py-4 px-4 relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            id={`status-toggle-${prod.id}`}
                            onClick={() =>
                              setOpenStatusDropdownId(
                                openStatusDropdownId === prod.id ? null : prod.id
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              prod.status === 'Active'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/60'
                            }`}
                          >
                            <span>{prod.status}</span>
                            <ChevronDown className="w-3 h-3 text-current stroke-[2.5]" />
                          </button>

                          {/* Status Dropdown */}
                          {openStatusDropdownId === prod.id && (
                            <div className="absolute left-0 mt-1.5 w-32 bg-[#1e273f] border border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(prod.id, 'Active')}
                                className="w-full px-3 py-1.5 text-xs text-left font-medium flex items-center justify-between text-emerald-400 hover:bg-emerald-950/50 cursor-pointer"
                              >
                                <span>Active</span>
                                {prod.status === 'Active' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(prod.id, 'Disabled')}
                                className="w-full px-3 py-1.5 text-xs text-left font-medium flex items-center justify-between text-slate-400 hover:bg-slate-800 cursor-pointer"
                              >
                                <span>Disabled</span>
                                {prod.status === 'Disabled' && <Check className="w-3.5 h-3.5 text-slate-400" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 7: Actions (Edit Full Details Button + Menu) */}
                      <td className="py-4 px-4 sm:px-6 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          {/* Primary Edit Button (Opens Full Edit modal) */}
                          <button
                            type="button"
                            id={`btn-edit-product-full-${prod.id}`}
                            onClick={() => handleOpenFullEditModal(prod)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-purple-900/30 cursor-pointer active:scale-95"
                            title="Edit all product fields"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Product</span>
                          </button>

                          {/* More Options dropdown */}
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setOpenActionMenuId(openActionMenuId === prod.id ? null : prod.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
                              title="More options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openActionMenuId === prod.id && (
                              <div className="absolute right-0 mt-1.5 w-44 bg-[#1e273f] border border-slate-700 rounded-xl shadow-2xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95">
                                <button
                                  type="button"
                                  onClick={() => handleOpenFullEditModal(prod)}
                                  className="w-full px-3.5 py-2 text-xs text-left font-medium text-slate-200 hover:bg-purple-900/40 hover:text-purple-200 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Edit All Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenStockModal(prod)}
                                  className="w-full px-3.5 py-2 text-xs text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                                >
                                  <Boxes className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Quick Stock Adjust</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateProduct(prod)}
                                  className="w-full px-3.5 py-2 text-xs text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Duplicate Product</span>
                                </button>
                                <div className="my-1 border-t border-slate-800" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="w-full px-3.5 py-2 text-xs text-left font-medium text-rose-400 hover:bg-rose-950/50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Delete Product</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        <Package className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold text-slate-300">No products found</p>
                        <p className="text-slate-500 mt-0.5">Try searching with a different keyword or resetting filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p id="table-pagination-count">
                Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} (Inventory & Catalog Synced)
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-slate-800 text-white rounded-lg font-semibold">
                  Page {currentPage} of 1
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={true}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

      {/* ========================================================================= */}
      {/* 🚀 COMPREHENSIVE FULL PRODUCT EDIT MODAL (EDIT ALL PRODUCT FIELDS)         */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div
          id="merchant-full-edit-product-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={handleCloseFullEditModal}
        >
          <div
            className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Edit Product Details</span>
                    <span className="text-xs font-mono font-normal bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      ID: {editingProduct.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modify name, price, category, stock count, specifications, tags, and images
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseFullEditModal}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs for Full Product Editor */}
            <div className="flex items-center border-b border-slate-800 px-6 bg-slate-900/40 overflow-x-auto gap-1">
              {[
                { id: 'general', label: 'General & Pricing', icon: DollarSign },
                { id: 'inventory', label: 'Stock & Inventory', icon: Boxes },
                { id: 'specs', label: 'Specs & Features', icon: ListPlus },
                { id: 'media', label: 'Image & Media', icon: ImageIcon },
                { id: 'ai', label: 'AI Readiness', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = editTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Scrollable Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* ------------------------------------------------------------- */}
              {/* TAB 1: GENERAL & PRICING                                      */}
              {/* ------------------------------------------------------------- */}
              {editTab === 'general' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                      Product Title / Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Lenovo IdeaPad Slim 5 14-inch"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Category & Brand in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                        Category
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                      >
                        {CATEGORY_PRESETS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                        Brand / Manufacturer
                      </label>
                      <input
                        type="text"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        placeholder="e.g. Sony, Lenovo, Apple"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* SKU & Warranty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                        SKU / Model Number
                      </label>
                      <input
                        type="text"
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        placeholder="e.g. LEN-SLIM5-16GB"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                        Warranty / Support
                      </label>
                      <input
                        type="text"
                        value={formWarranty}
                        onChange={(e) => setFormWarranty(e.target.value)}
                        placeholder="e.g. 1 Year Brand Warranty"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Pricing Fields & Discount Preview */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Pricing & Discount</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-300 text-[11px]">
                          Selling Price (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={formPrice}
                            onChange={(e) => setFormPrice(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-8 pr-3.5 py-2 text-sm font-bold focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-semibold text-slate-300 text-[11px]">
                          Original MRP (₹) (Optional for Discount Tag)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={formOriginalPrice}
                            onChange={(e) => setFormOriginalPrice(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-8 pr-3.5 py-2 text-sm font-bold focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {formOriginalPrice > formPrice && formPrice > 0 && (
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          Customer saves ₹{(formOriginalPrice - formPrice).toLocaleString('en-IN')} (
                          {Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)}% OFF)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-200">Catalog Visibility Status</p>
                      <p className="text-[11px] text-slate-400">
                        {formStatus === 'Active'
                          ? 'Active: Product appears in AI searches and customer storefront.'
                          : 'Disabled: Product is hidden from AI searches.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormStatus(formStatus === 'Active' ? 'Disabled' : 'Active')}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                        formStatus === 'Active'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {formStatus}
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: INVENTORY & STOCK MANAGEMENT                           */}
              {/* ------------------------------------------------------------- */}
              {editTab === 'inventory' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">Available Units in Stock</h4>
                        <p className="text-slate-400 text-[11px]">
                          Update or decrease stock count when units are sold or fulfilled
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        formStock === 0
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                          : formStock <= formLowStockThreshold
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      }`}>
                        {formStock === 0 ? 'Out of Stock' : `${formStock} Units Available`}
                      </span>
                    </div>

                    {/* Interactive Steppers */}
                    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormStock((v) => Math.max(0, v - 10))}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-rose-400 border border-slate-700 cursor-pointer"
                          title="Decrease stock by 10"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStock((v) => Math.max(0, v - 1))}
                          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min="0"
                          value={formStock}
                          onChange={(e) => setFormStock(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 bg-transparent text-2xl font-black text-center text-white focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Units
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormStock((v) => v + 1)}
                          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                          title="Increase stock by 1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStock((v) => v + 10)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-slate-700 cursor-pointer"
                          title="Increase stock by 10"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* Reason for change */}
                    {formStock !== editingProduct.stock && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                          {formStock < editingProduct.stock ? 'Reason for Stock Decrease' : 'Reason for Stock Adjustment'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            'Customer order fulfilled',
                            'Damaged / Defective units',
                            'Sample / Demo allocation',
                            'Inventory audit correction',
                            'Supplier return',
                            'Other'
                          ].map((reason) => (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => setFormStockReason(reason)}
                              className={`p-2 rounded-lg text-xs font-medium text-left transition-colors border cursor-pointer ${
                                formStockReason === reason
                                  ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {reason}
                            </button>
                          ))}
                        </div>

                        {formStockReason === 'Other' && (
                          <input
                            type="text"
                            value={formCustomReason}
                            onChange={(e) => setFormCustomReason(e.target.value)}
                            placeholder="Specify custom reason..."
                            className="w-full mt-2 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Low stock threshold */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-300">Low Stock Alert Limit</label>
                      <span className="font-bold text-amber-400">
                        Trigger low-stock warning when ≤ {formLowStockThreshold} units
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={formLowStockThreshold}
                      onChange={(e) => setFormLowStockThreshold(parseInt(e.target.value) || 5)}
                      className="w-full accent-purple-500 bg-slate-800 cursor-pointer"
                    />
                  </div>

                  {/* Auto-disable on Zero */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-200">Auto-Disable If Out of Stock</p>
                      <p className="text-[11px] text-slate-400">
                        Automatically change status to "Disabled" when inventory reaches 0 units
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormAutoDisableOnZero(!formAutoDisableOnZero)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        formAutoDisableOnZero ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          formAutoDisableOnZero ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Stock Audit Trail */}
                  {editingProduct.stockLogs && editingProduct.stockLogs.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-400">
                        <History className="w-3.5 h-3.5" />
                        <span>Inventory Audit Trail</span>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {editingProduct.stockLogs.map((log) => (
                          <div
                            key={log.id}
                            className="bg-slate-900/50 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="text-slate-300 font-medium">{log.reason}</p>
                              <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold ${log.change < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {log.change > 0 ? `+${log.change}` : log.change} units
                              </span>
                              <p className="text-[10px] text-slate-500">
                                {log.previousStock} → {log.newStock}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: SPECS & FEATURES                                       */}
              {/* ------------------------------------------------------------- */}
              {editTab === 'specs' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Overview Description */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                      Product Description / AI Knowledge Base
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Detailed product features, specs, and highlights that AI shopping assistant will index..."
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Key Specifications List */}
                  <div className="space-y-2 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                    <label className="block font-semibold text-slate-200 text-xs">
                      Key Technical Specifications
                    </label>
                    
                    <div className="space-y-2">
                      {formSpecs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => {
                              const updated = [...formSpecs];
                              updated[index] = e.target.value;
                              setFormSpecs(updated);
                            }}
                            className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(index)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Remove spec"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newSpecInput}
                        onChange={(e) => setNewSpecInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSpec();
                          }
                        }}
                        placeholder="Add specification (e.g. Battery: 5000mAh, RAM: 16GB)..."
                        className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Search Tags */}
                  <div className="space-y-2 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                    <label className="block font-semibold text-slate-200 text-xs">
                      AI Search Tags & Keywords
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {formTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-950/60 border border-purple-800 text-purple-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-purple-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add keyword tag (e.g. gaming, ultrabook, noise-canceling)..."
                        className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: IMAGE & MEDIA                                          */}
              {/* ------------------------------------------------------------- */}
              {editTab === 'media' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wide text-[11px]">
                      Product Image URL
                    </label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Live Preview & File Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Live Preview Box */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center">
                      <p className="text-[11px] font-bold text-slate-400 mb-2">Live Image Preview</p>
                      <div className="w-36 h-36 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg">
                        {formImage ? (
                          <img
                            src={formImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-600" />
                        )}
                      </div>
                    </div>

                    {/* Upload Local Image File */}
                    <div className="bg-slate-900/80 border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                      <UploadCloud className="w-8 h-8 text-purple-400 mb-2" />
                      <p className="font-semibold text-slate-200 text-xs">Upload from Computer</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 mb-3">PNG, JPG, WebP up to 5MB</p>
                      <label className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer transition-colors">
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preset Library */}
                  <div className="space-y-2 pt-2">
                    <p className="font-semibold text-slate-400 text-[11px]">Quick Image Presets (1-Click Apply):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormImage(preset.url)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            formImage === preset.url
                              ? 'bg-purple-950/60 border-purple-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="text-[11px] font-medium truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 5: AI READINESS & PERFORMANCE                             */}
              {/* ------------------------------------------------------------- */}
              {editTab === 'ai' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>AI Match & Readiness Score</span>
                      </label>
                      <span className="text-sm font-black text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
                        {formAiMatch}% Match Quality
                      </span>
                    </div>

                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={formAiMatch}
                      onChange={(e) => setFormAiMatch(parseInt(e.target.value) || 90)}
                      className="w-full accent-purple-500 bg-slate-800 cursor-pointer"
                    />

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Higher AI Match Scores guarantee your product appears as a top recommendation when customers ask conversational questions in the Sirevo AI Assistant.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                      <div className="text-lg font-bold text-white">{editingProduct.aiSearches}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">AI Query Appearances</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                      <div className="text-lg font-bold text-blue-400">{editingProduct.shortlisted}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">AI Shortlists</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                      <div className="text-lg font-bold text-emerald-400">{editingProduct.purchased}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Orders Converted</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseFullEditModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="save-full-product-edit-btn"
                  onClick={handleSaveFullEditModal}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-950/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All Product Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK EDIT STOCK MODAL                                                    */}
      {/* ========================================================================= */}
      {selectedProductForStock && (
        <div
          id="merchant-edit-stock-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={handleCloseStockModal}
        >
          <div
            className="bg-[#151c2f] border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Quick Stock Adjustment
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust inventory count and record decrease reason
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseStockModal}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Product Info Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
                <img
                  src={selectedProductForStock.image}
                  alt={selectedProductForStock.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-white truncate">
                    {selectedProductForStock.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span>{selectedProductForStock.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-200">{selectedProductForStock.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400">Current Stock:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedProductForStock.stock === 0
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        : selectedProductForStock.stock <= 5
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    }`}>
                      {selectedProductForStock.stock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Stock Counter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  New Available Stock Quantity
                </label>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStockEditValue((v) => Math.max(0, v - 10))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-rose-400 border border-slate-700 cursor-pointer"
                      title="Decrease by 10"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockEditValue((v) => Math.max(0, v - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                      title="Decrease by 1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Big Number Input */}
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      value={stockEditValue}
                      onChange={(e) => setStockEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 bg-transparent text-2xl font-black text-center text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                      Units
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStockEditValue((v) => v + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                      title="Increase by 1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockEditValue((v) => v + 10)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-slate-700 cursor-pointer"
                      title="Increase by 10"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Stock Difference Indicator */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    {stockEditValue < selectedProductForStock.stock ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        Decreasing by {selectedProductForStock.stock - stockEditValue} units
                      </span>
                    ) : stockEditValue > selectedProductForStock.stock ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Increasing by {stockEditValue - selectedProductForStock.stock} units
                      </span>
                    ) : (
                      <span className="text-slate-400">No change in stock</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStockEditValue(0)}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Set to 0 (Out of stock)
                  </button>
                </div>
              </div>

              {/* Reason for Stock Decrease / Adjustment */}
              {stockEditValue !== selectedProductForStock.stock && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    {stockEditValue < selectedProductForStock.stock ? 'Reason for Stock Decrease' : 'Reason for Stock Adjustment'}
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Customer order fulfilled',
                      'Damaged / Defective units',
                      'Sample / Demo allocation',
                      'Inventory audit correction',
                      'Supplier return',
                      'Other'
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setStockEditReason(reason)}
                        className={`p-2 rounded-lg text-xs font-medium text-left transition-colors border cursor-pointer ${
                          stockEditReason === reason
                            ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  {stockEditReason === 'Other' && (
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Specify reason..."
                      className="w-full mt-2 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                    />
                  )}
                </div>
              )}

              {/* Low Stock Warning Threshold */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Low Stock Alert Limit
                  </label>
                  <span className="text-xs font-bold text-amber-400">
                    Alert when ≤ {lowStockThreshold} units
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 5)}
                  className="w-full accent-purple-500 bg-slate-800 cursor-pointer"
                />
              </div>

              {/* Auto Disable when 0 */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Auto-Disable If Out of Stock
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Prevent customer checkout if inventory reaches 0 units
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDisableOnZero(!autoDisableOnZero)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoDisableOnZero ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      autoDisableOnZero ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleCloseStockModal();
                  handleOpenFullEditModal(selectedProductForStock);
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Full Product Editor</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseStockModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="save-stock-modal-btn"
                  onClick={handleSaveStockModal}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-purple-950/40 transition-all cursor-pointer"
                >
                  Save Stock Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MerchantProductsPage;
