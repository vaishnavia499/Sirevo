import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { 
  ArrowLeftRight, 
  X, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  Plus
} from 'lucide-react';

interface CompareDrawerProps {
  onNavigate?: (page: string) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If list is empty or user is already on /compare, don't show the floating tray
  if (compareList.length === 0 || location.pathname === '/compare') {
    return null;
  }

  const handleGoToCompare = () => {
    if (onNavigate) {
      onNavigate('compare');
    } else {
      navigate('/compare');
    }
  };

  const maxSlots = 3;
  const emptySlotsCount = Math.max(0, maxSlots - compareList.length);

  return (
    <div 
      id="floating-comparison-drawer"
      className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out px-3 sm:px-6 pb-3"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        className="max-w-4xl mx-auto bg-[#0d1527]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden text-slate-100"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Drawer Header Bar */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/60 via-[#131c33] to-[#0d1527] border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Comparison Tray
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-600/60 text-purple-300 text-[10px] font-bold">
                  {compareList.length}/{maxSlots} Selected
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Add up to 3 products to benchmark side-by-side specs and prices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear All Button */}
            <button
              onClick={clearCompare}
              title="Clear all comparison items"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Clear</span>
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Tray" : "Collapse Tray"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Compare Now Action CTA */}
            <button
              id="drawer-compare-now-btn"
              onClick={handleGoToCompare}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Drawer Body: Product Cards & Slots */}
        {!isCollapsed && (
          <div className="p-3 sm:p-4 bg-[#090e1c]/90">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {/* Render Selected Products */}
              {compareList.map((product) => {
                const pId = product.product_id || product.id || '';
                const pName = product.name || product.title || 'Product';
                const pPrice = product.price;

                return (
                  <div
                    key={pId}
                    id={`compare-drawer-item-${pId}`}
                    className="relative group bg-[#131b30] border border-purple-500/30 rounded-xl p-2 sm:p-2.5 flex items-center gap-2.5 shadow-md hover:border-purple-400/50 transition-all animate-in fade-in zoom-in-95 duration-200"
                  >
                    {/* Remove (X) Button */}
                    <button
                      onClick={() => removeFromCompare(pId)}
                      title={`Remove ${pName} from comparison`}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500 flex items-center justify-center transition-colors cursor-pointer z-10 shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Thumbnail / Visual Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#0a0f1d] border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={pName} 
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] sm:text-xs font-bold text-white truncate" title={pName}>
                        {pName}
                      </h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] sm:text-xs font-extrabold text-emerald-400">
                          ₹{pPrice ? pPrice.toLocaleString('en-IN') : 'Check Price'}
                        </span>
                        {product.specs?.ram && (
                          <span className="hidden sm:inline text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {product.specs.ram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Render Empty Placeholders */}
              {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                <div
                  key={`empty-slot-${idx}`}
                  className="border border-dashed border-slate-800 rounded-xl p-2 sm:p-2.5 flex items-center justify-center gap-2 text-slate-500 bg-slate-900/20"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[10px] sm:text-xs font-medium truncate">
                    + Add Product {compareList.length + idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareDrawer;
