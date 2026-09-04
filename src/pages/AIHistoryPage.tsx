import React from 'react';
import { History, Sparkles, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { PageRoute } from '../types';

interface AIHistoryPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AIHistoryPage: React.FC<AIHistoryPageProps> = ({ onNavigate }) => {
  const historySessions = [
    {
      id: 'session-1',
      date: 'Today, 4:25 PM',
      prompt: 'I need a laptop under ₹60,000 for programming, 16GB RAM and good battery life',
      category: 'Laptops & Computers',
      topics: ['16GB RAM', 'Long battery life', 'Programming & Coding'],
      recommendationsCount: 4,
    },
    {
      id: 'session-2',
      date: 'Yesterday, 11:10 AM',
      prompt: 'Wireless noise cancelling headphones under ₹5,000 for work and travel',
      category: 'Audio',
      topics: ['Battery life > 30h', 'Comfort', 'ANC Mode'],
      recommendationsCount: 5,
    },
    {
      id: 'session-3',
      date: 'May 10, 2026',
      prompt: 'Smartphone with best camera under ₹30,000 with OIS and AMOLED display',
      category: 'Smartphones',
      topics: ['OIS Camera', 'AMOLED 120Hz', 'Fast Charging'],
      recommendationsCount: 3,
    },
    {
      id: 'session-4',
      date: 'Apr 26, 2026',
      prompt: 'Mechanical keyboard with hot-swappable tactile switches for Mac setup',
      category: 'Accessories',
      topics: ['Tactile switches', 'Bluetooth 5.1', 'Mac layout'],
      recommendationsCount: 4,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#18233c] text-blue-400 flex items-center justify-center border border-blue-900/50">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Assistant History</h2>
          </div>
          <p className="text-xs text-slate-400">
            Review your previous shopping inquiries, search criteria, and pilot summaries.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>New AI Shopping Search</span>
        </button>
      </div>

      {/* History Session Cards */}
      <div className="space-y-4">
        {historySessions.map((session) => (
          <div
            key={session.id}
            id={`history-session-${session.id}`}
            className="bg-[#111726]/90 rounded-2xl border border-slate-800/80 p-5 hover:border-slate-700 hover:bg-[#141c30] transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60">
                  {session.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {session.date}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {session.recommendationsCount} items evaluated
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-white leading-snug">
                "{session.prompt}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Focus topics:</span>
              {session.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#162035] border border-slate-800 text-slate-300 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('compare')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                View comparison matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Re-run query
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

