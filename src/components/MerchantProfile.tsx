import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Receipt,
  RotateCcw,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle2,
  Store,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

export interface MerchantProfileData {
  fullName: string;
  email: string;
  phone: string;
  storeName: string;
  storeDescription: string;
  taxNumber: string;
  returnPolicy: string;
}

export const MerchantProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<MerchantProfileData>({
    fullName: 'Mohammed Imthiyas A.',
    email: 'mohammed.imthiyas@nexusdigital.io',
    phone: '+91 98765 43210',
    storeName: 'Nexus Tech & Electronics',
    storeDescription:
      'Premier retailer specializing in high-performance laptops, developer workstations, ultra-responsive mechanical keyboards, and AI hardware accelerators.',
    taxNumber: 'GSTIN29ABCDE1234F1Z5',
    returnPolicy:
      '30-day hassle-free replacement or full refund on all manufacturer electronics. Items must include original packaging and serial documentation.',
  });

  // Stored state for reverting if Cancel is clicked
  const [savedData, setSavedData] = useState<MerchantProfileData>(formData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSavedData(formData);
    setIsEditing(false);
    setToastMessage('Merchant profile and store settings successfully updated!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  return (
    <div
      id="merchant-profile-root"
      className="space-y-6 max-w-6xl w-full mx-auto font-sans"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="merchant-profile-toast"
          className="p-3.5 bg-slate-900 border border-emerald-500/60 rounded-xl shadow-xl shadow-emerald-950/40 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
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

      {/* Header: 'Merchant Settings & Profile' */}
      <div
        id="merchant-profile-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Merchant Settings & Profile
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              Verified Merchant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your merchant credentials, verified identity, and public storefront details.
          </p>
        </div>

        {/* Action Buttons: Edit / Save Changes + Cancel */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                id="merchant-profile-cancel-btn"
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-[#162035] hover:bg-slate-800 hover:border-slate-600 text-xs font-semibold text-slate-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-400" />
                <span>Cancel</span>
              </button>

              <button
                id="merchant-profile-save-btn"
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              id="merchant-profile-edit-btn"
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Edit3 className="w-4 h-4 text-white" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =================================================================== */}
        {/* LEFT COLUMN (Card 1): Personal / Login Details                     */}
        {/* =================================================================== */}
        <div
          id="merchant-profile-personal-card"
          className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-800/60 flex items-center justify-center text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Personal & Login Details</h2>
                  <p className="text-[11px] text-slate-400">Authorized merchant representative</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                Tier 1 Signatory
              </span>
            </div>

            {/* Avatar Placeholder */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0e1628] border border-slate-800/80">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-purple-900/40 border-2 border-purple-400/40">
                  {formData.fullName
                    ? formData.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'MI'}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    title="Upload new avatar"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center shadow hover:bg-purple-400 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {formData.fullName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {formData.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-400">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>2FA Active (Hardware Key + Authenticator)</span>
                </div>
              </div>
            </div>

            {/* Input / Display Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <input
                    id="merchant-input-fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {formData.fullName}
                    </p>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <input
                    id="merchant-input-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="merchant@domain.com"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 font-mono">
                      {formData.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Phone Number</span>
                </label>
                {isEditing ? (
                  <input
                    id="merchant-input-phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 font-mono">
                      {formData.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Email and phone numbers are used for payout notifications and critical dispute alerts.</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN (Card 2): Business / Store Details                    */}
        {/* =================================================================== */}
        <div
          id="merchant-profile-store-card"
          className="bg-[#151c2f] border border-slate-800 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Business & Store Details</h2>
                  <p className="text-[11px] text-slate-400">Public storefront and tax entity configuration</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-1">
                <Store className="w-3 h-3 text-emerald-400" />
                Active Store
              </span>
            </div>

            <div className="space-y-4">
              {/* Store Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  <span>Store Name</span>
                </label>
                {isEditing ? (
                  <input
                    id="merchant-input-storeName"
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Enter store name"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-200 font-bold text-purple-300">
                      {formData.storeName}
                    </p>
                  </div>
                )}
              </div>

              {/* Tax / GST Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tax / GST Number</span>
                </label>
                {isEditing ? (
                  <input
                    id="merchant-input-taxNumber"
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. GSTIN29ABCDE1234F1Z5"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 uppercase font-mono transition-colors"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80 flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-slate-300 font-mono">
                      {formData.taxNumber}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                      Compliant
                    </span>
                  </div>
                )}
              </div>

              {/* Store Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Store Description</span>
                </label>
                {isEditing ? (
                  <textarea
                    id="merchant-input-storeDescription"
                    name="storeDescription"
                    rows={3}
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your brand and catalog focus..."
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {formData.storeDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Return Policy (Textarea) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Return & Warranty Policy</span>
                </label>
                {isEditing ? (
                  <textarea
                    id="merchant-input-returnPolicy"
                    name="returnPolicy"
                    rows={3}
                    value={formData.returnPolicy}
                    onChange={handleInputChange}
                    placeholder="Enter return, refund, and replacement criteria..."
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {formData.returnPolicy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Storefront Visibility: <strong className="text-emerald-400">Indexed by Sirevo AI</strong></span>
            <span className="text-slate-500">Auto-synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
