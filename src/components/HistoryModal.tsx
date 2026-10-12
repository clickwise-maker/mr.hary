import React from 'react';
import { X, History, Trash2, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { CampaignHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CampaignHistoryItem[];
  onSelectCampaign: (item: CampaignHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCampaign,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Saved Campaigns History</h3>
              <p className="text-xs text-slate-400">
                {history.length} saved cross-platform content packages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No saved campaigns yet. Generate an idea to save it automatically!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-slate-700 hover:bg-slate-950"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">
                      {item.themeTitle || 'Social Campaign'}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-indigo-300 font-semibold border border-slate-700 capitalize">
                      {item.tone}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{item.idea}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onSelectCampaign(item);
                      onClose();
                    }}
                    className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    <span>Load</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/70 p-4">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All History</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
