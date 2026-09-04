import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Plus,
  Trash2,
  Cpu,
  Wallet,
  Tag,
  Edit3,
  Check,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Sliders,
  AlertCircle
} from 'lucide-react';

export interface AddressItem {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CustomerProfileData {
  name: string;
  email: string;
  budgetLimit: string;
  preferredCategories: string;
  addresses: AddressItem[];
}

export const CustomerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState({ current: '', next: '', confirm: '' });
  const [passwordToast, setPasswordToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CustomerProfileData>({
    name: 'Mohammed Imthiyas A.',
    email: 'mohammed.imthiyas@gmail.com',
    budgetLimit: '₹75,000',
    preferredCategories: 'Laptops & Ultrabooks, Smart Audio, Developer Accessories, Wireless Tech',
    addresses: [
      {
        id: 'addr-1',
        label: 'Primary Residence',
        street: '452 Innovation Blvd, Suite 800',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Work / Studio Office',
        street: '108 Tech Park, 4th Floor',
        city: 'Bangalore',
        state: 'KA',
        postalCode: '560100',
        country: 'India',
        isDefault: false,
      },
    ],
  });

  // Stored state for rollback on Cancel
  const [savedData, setSavedData] = useState<CustomerProfileData>(formData);

  // Handle general text field updates
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle address field updates
  const handleAddressChange = (id: string, field: keyof AddressItem, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      ),
    }));
  };

  // Add a new blank address block in Edit Mode
  const handleAddNewAddress = () => {
    const newAddress: AddressItem = {
      id: `addr-${Date.now()}`,
      label: 'New Address',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: formData.addresses.length === 0,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  // Remove an address block
  const handleRemoveAddress = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
  };

  // Toggle or Save Handler
  const handleSaveToggle = () => {
    if (isEditing) {
      setSavedData(formData);
      setIsEditing(false);
      setToastMessage('Account details and shipping preferences saved successfully!');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.current || !newPassword.next) {
      setPasswordToast('Please fill out all password fields.');
      return;
    }
    if (newPassword.next !== newPassword.confirm) {
      setPasswordToast('New passwords do not match.');
      return;
    }
    setPasswordToast(null);
    setShowPasswordModal(false);
    setNewPassword({ current: '', next: '', confirm: '' });
    setToastMessage('Security credential successfully updated!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div
      id="customer-profile-root"
      className="space-y-6 max-w-4xl w-full mx-auto font-sans text-slate-100"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="customer-profile-toast"
          className="p-3.5 bg-slate-900 border border-blue-500/60 rounded-xl shadow-xl shadow-blue-950/40 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center justify-center">
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

      {/* Header: 'My Account' with Edit Details / Save Details */}
      <div
        id="customer-profile-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              My Account
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              Verified Buyer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal credentials, delivery addresses, and AI shopping preferences.
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              id="customer-profile-cancel-btn"
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-[#162035] hover:bg-slate-800 hover:border-slate-600 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>Cancel</span>
            </button>
          )}

          <button
            id="customer-profile-toggle-btn"
            type="button"
            onClick={handleSaveToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] ${
              isEditing
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-950/50'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Save Details</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-white" />
                <span>Edit Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vertical Stack Layout */}
      <div className="space-y-6">
        {/* =================================================================== */}
        {/* CARD 1: Personal Info                                               */}
        {/* =================================================================== */}
        <div
          id="customer-profile-personal-card"
          className="bg-[#151c2f] p-6 rounded-xl border border-slate-800 shadow-lg space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Personal Information</h2>
                <p className="text-[11px] text-slate-400">Primary account name and email contact</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center border border-blue-400/40">
              {formData.name
                ? formData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'MI'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Full Name</span>
              </label>
              {isEditing ? (
                <input
                  id="customer-input-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  placeholder="Enter full name"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">{formData.name}</p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Email Address</span>
              </label>
              {isEditing ? (
                <input
                  id="customer-input-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  placeholder="customer@domain.com"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-300 font-mono">{formData.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Link */}
          <div className="pt-2 flex items-center justify-between">
            <button
              id="customer-profile-change-password-link"
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <span className="text-[11px] text-slate-500">Last changed 2 weeks ago</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 2: Shipping Addresses                                          */}
        {/* =================================================================== */}
        <div
          id="customer-profile-addresses-card"
          className="bg-[#151c2f] p-6 rounded-xl border border-slate-800 shadow-lg space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Shipping Addresses</h2>
                <p className="text-[11px] text-slate-400">Delivery destinations for quick 1-click checkout</p>
              </div>
            </div>

            {/* In Edit Mode: Allow adding a new address */}
            {isEditing && (
              <button
                id="customer-add-address-btn"
                type="button"
                onClick={handleAddNewAddress}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            )}
          </div>

          {/* List of Saved Addresses */}
          <div className="space-y-4">
            {formData.addresses.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#0e1628]/60 border border-dashed border-slate-800 text-center">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No saved shipping addresses</p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="mt-3 px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add Address
                  </button>
                )}
              </div>
            ) : (
              formData.addresses.map((addr, index) => (
                <div
                  key={addr.id}
                  id={`customer-address-block-${addr.id}`}
                  className={`p-4 rounded-xl transition-all ${
                    isEditing
                      ? 'bg-slate-900/90 border border-slate-700 space-y-3'
                      : 'bg-[#0e1628]/80 border border-slate-800 space-y-1.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-950 text-blue-400 text-[10px] font-bold flex items-center justify-center border border-blue-800">
                        {index + 1}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={addr.label}
                          onChange={(e) => handleAddressChange(addr.id, 'label', e.target.value)}
                          placeholder="e.g. Home, Office"
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">{addr.label}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                          Default
                        </span>
                      )}

                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(addr.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title="Remove Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block mb-1">Street Address</label>
                        <input
                          type="text"
                          value={addr.street}
                          onChange={(e) => handleAddressChange(addr.id, 'street', e.target.value)}
                          placeholder="Street Address, Apt / Suite"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">City</label>
                        <input
                          type="text"
                          value={addr.city}
                          onChange={(e) => handleAddressChange(addr.id, 'city', e.target.value)}
                          placeholder="City"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">State / Province</label>
                        <input
                          type="text"
                          value={addr.state}
                          onChange={(e) => handleAddressChange(addr.id, 'state', e.target.value)}
                          placeholder="State"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={addr.postalCode}
                          onChange={(e) => handleAddressChange(addr.id, 'postalCode', e.target.value)}
                          placeholder="Postal Code"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Country</label>
                        <input
                          type="text"
                          value={addr.country}
                          onChange={(e) => handleAddressChange(addr.id, 'country', e.target.value)}
                          placeholder="Country"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 leading-relaxed pl-7">
                      <p>{addr.street}</p>
                      <p className="text-slate-400">
                        {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 3: AI Preferences (Optional)                                  */}
        {/* =================================================================== */}
        <div
          id="customer-profile-ai-prefs-card"
          className="bg-[#151c2f] p-6 rounded-xl border border-slate-800 shadow-lg space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">AI Search & Shopping Preferences</h2>
                <p className="text-[11px] text-slate-400">Parameters used by Sirevo AI assistant for recommendations</p>
              </div>
            </div>
            <span className="text-[10px] text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* AI Shopping Budget Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Shopping Budget Limit</span>
              </label>
              {isEditing ? (
                <input
                  id="customer-input-budgetLimit"
                  type="text"
                  name="budgetLimit"
                  value={formData.budgetLimit}
                  onChange={handleTextChange}
                  placeholder="e.g. ₹75,000"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors font-semibold"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                  <p className="text-xs sm:text-sm text-emerald-400 font-bold font-mono">
                    {formData.budgetLimit}
                  </p>
                </div>
              )}
            </div>

            {/* Preferred Categories */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                <span>Preferred Categories</span>
              </label>
              {isEditing ? (
                <input
                  id="customer-input-preferredCategories"
                  type="text"
                  name="preferredCategories"
                  value={formData.preferredCategories}
                  onChange={handleTextChange}
                  placeholder="e.g. Laptops, Audio, Mechanical Keyboards"
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white w-full focus:outline-none focus:border-purple-500 transition-colors"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-[#0e1628]/60 border border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-300">{formData.preferredCategories}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Dialog Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#151c2f] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Update Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordToast && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordToast}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">Current Password</label>
                <input
                  type="password"
                  value={newPassword.current}
                  onChange={(e) => setNewPassword({ ...newPassword, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword.next}
                  onChange={(e) => setNewPassword({ ...newPassword, next: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  value={newPassword.confirm}
                  onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
