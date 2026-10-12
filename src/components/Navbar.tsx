import React from 'react';
import { Sparkles, History, Download, Layers, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onOpenAudit: () => void;
  historyCount: number;
  hasGeneratedContent: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenExport,
  onOpenAudit,
  historyCount,
  hasGeneratedContent,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo and Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">OmniPost</span>
              <span className="rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/30">
                Studio AI
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Cross-Platform Content &amp; Visual Generator
            </p>
          </div>
        </div>

        {/* Gemini Engine Indicators */}
        <div className="hidden lg:flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Gemini Intelligence:</span>
          <span className="font-medium text-emerald-400">3.5 Flash</span>
          <span className="text-slate-600">•</span>
          <span className="font-medium text-purple-400">3.1 Pro</span>
          <span className="text-slate-600">•</span>
          <span className="font-medium text-pink-400">3 Pro Image (1K-4K)</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {hasGeneratedContent && (
            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition hover:bg-purple-500/20 active:scale-95"
              title="Run Deep Strategic Audit using Gemini 3.1 Pro"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Strategic Audit</span>
            </button>
          )}

          {hasGeneratedContent && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-slate-300" />
              <span className="hidden sm:inline">Export Bundle</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white active:scale-95"
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>Saved</span>
            {historyCount > 0 && (
              <span className="rounded-full bg-indigo-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
