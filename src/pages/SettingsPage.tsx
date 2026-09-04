import React, { useState } from 'react';
import { Settings, Sliders, Bell } from 'lucide-react';
import { PageRoute } from '../types';

interface SettingsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [currency, setCurrency] = useState('INR');
  const [dealAlerts, setDealAlerts] = useState(true);
  const [pilotDepth, setPilotDepth] = useState('detailed');
  const [priceDropNotify, setPriceDropNotify] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#18233c] text-blue-400 flex items-center justify-center border border-blue-900/50">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Application Settings</h2>
          </div>
          <p className="text-xs text-slate-400">
            Customize your Sirevo AI assistant behavior, currencies, and notifications.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* AI Pilot Preferences */}
        <div className="bg-[#111726]/90 rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">AI Assistant Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 space-y-2">
              <label className="font-bold text-white block">Recommendation Depth</label>
              <p className="text-slate-400 text-[11px]">Level of technical detail in product breakdowns</p>
              <select
                id="setting-pilot-depth"
                value={pilotDepth}
                onChange={(e) => setPilotDepth(e.target.value)}
                className="w-full mt-2 p-2 bg-[#151d30] border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-hidden focus:border-blue-500"
              >
                <option value="concise">Concise & Quick Summary</option>
                <option value="detailed">Balanced & Feature-rich (Default)</option>
                <option value="expert">Deep Technical Spec Breakdown</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 space-y-2">
              <label className="font-bold text-white block">Preferred Currency</label>
              <p className="text-slate-400 text-[11px]">Display currency across all catalog prices</p>
              <select
                id="setting-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full mt-2 p-2 bg-[#151d30] border border-slate-700 rounded-lg text-xs font-medium text-slate-200 focus:outline-hidden focus:border-blue-500"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-[#111726]/90 rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Notification Alerts</h3>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Price Drop Notifications</p>
                <p className="text-slate-400 text-[11px]">Get alerted when saved comparison items drop in price</p>
              </div>
              <button
                id="toggle-price-drop"
                onClick={() => setPriceDropNotify(!priceDropNotify)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  priceDropNotify ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    priceDropNotify ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">AI Deal Opportunities</p>
                <p className="text-slate-400 text-[11px]">Receive smart shopping bundle suggestions and discount alerts</p>
              </div>
              <button
                id="toggle-deal-alerts"
                onClick={() => setDealAlerts(!dealAlerts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  dealAlerts ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    dealAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 cursor-pointer"
          >
            ← Return to Home Screen
          </button>
          <span className="text-[11px] text-slate-500">Sirevo AI v1.0 • Step 1 Connected</span>
        </div>
      </div>
    </div>
  );
};

