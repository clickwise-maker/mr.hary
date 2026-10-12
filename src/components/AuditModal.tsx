import React from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { AuditResult, PlatformId } from '../types';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditResult | null;
  isLoading: boolean;
  onReaudit: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  audit,
  isLoading,
  onReaudit,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Strategic Content Audit</h3>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  gemini-3.1-pro-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audience fit, stopping power, virality, and platform algorithmic scoring
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

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <p className="text-sm font-semibold text-slate-200">
                Gemini 3.1 Pro is auditing hooks, tone, and audience fit...
              </p>
              <p className="text-xs text-slate-400">
                Analyzing cognitive engagement &amp; platform distribution triggers
              </p>
            </div>
          ) : audit ? (
            <>
              {/* Overall Score Banner */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-400 mb-1">Overall Campaign Score</span>
                  <div className={`text-4xl font-extrabold px-3 py-1 rounded-xl border ${getScoreColor(audit.overallScore)}`}>
                    {audit.overallScore}/100
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2">
                    Across LinkedIn, Twitter, Instagram
                  </span>
                </div>

                <div className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Viral Index &amp; Impact</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-300">
                    {audit.viralIndex || 'High Potential'}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">LinkedIn</span>
                      <strong className="text-sm text-blue-400 font-bold">{audit.platformAudits.linkedin.score}%</strong>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Twitter / X</span>
                      <strong className="text-sm text-sky-400 font-bold">{audit.platformAudits.twitter.score}%</strong>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Instagram</span>
                      <strong className="text-sm text-rose-400 font-bold">{audit.platformAudits.instagram.score}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform breakdown cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Platform-by-Platform Tactical Breakdown
                </h4>
                {(['linkedin', 'twitter', 'instagram'] as PlatformId[]).map((platform) => {
                  const item = audit.platformAudits[platform];
                  const title = platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'Twitter / X' : 'Instagram';
                  const badgeColor = platform === 'linkedin' ? 'text-blue-400' : platform === 'twitter' ? 'text-sky-400' : 'text-pink-400';

                  return (
                    <div key={platform} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${badgeColor}`}>{title}</span>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${getScoreColor(item.score)}`}>
                          {item.score}/100
                        </span>
                      </div>

                      <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
                        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80">
                          <span className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                            <AlertCircle className="h-3 w-3 text-amber-400" /> Hook Analysis
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-300">{item.hookCritique}</p>
                        </div>

                        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80">
                          <span className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Core Strength
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-300">{item.topStrength}</p>
                        </div>

                        <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80">
                          <span className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                            <Lightbulb className="h-3 w-3 text-purple-400" /> Tactical Tip
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-300">{item.actionableTip}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General recommendations */}
              {audit.generalRecommendations && audit.generalRecommendations.length > 0 && (
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Overarching Strategic Recommendations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {audit.generalRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No audit run yet. Click "Run Audit" below to trigger Gemini 3.1 Pro analysis.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/70 p-4">
          <button
            onClick={onReaudit}
            disabled={isLoading}
            className="flex items-center space-x-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Run Strategic Audit</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
