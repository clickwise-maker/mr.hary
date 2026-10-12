import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Briefcase,
  Smile,
  Compass,
  BookOpen,
  Send,
  Loader2,
} from 'lucide-react';
import { ToneType, ImageModel, ImageSize } from '../types';

interface CampaignInputProps {
  onGenerate: (data: {
    idea: string;
    tone: ToneType;
    customTone: string;
    targetAudience: string;
    imageModel: ImageModel;
    imageSize: ImageSize;
    imageStyle: string;
    modelPreference: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview';
    generateImagesSimultaneously: boolean;
  }) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_IDEAS = [
  {
    title: '🚀 Product Launch',
    idea: 'We are launching OmniPost 2.0: AI engine that cuts social media planning from 4 hours to 4 minutes with multi-platform aspect ratio images.',
  },
  {
    title: '💡 Contrarian Tech Insight',
    idea: 'Why AI will not replace junior software engineers—it will eliminate mid-level managers who only forward Jira tickets and sprint summaries.',
  },
  {
    title: '📈 Startup Growth Lessons',
    idea: 'How bootstrapping our B2B SaaS to $50k MRR without venture capital forced us to focus on 1 painful customer problem instead of 50 features.',
  },
  {
    title: '⚡ Urgent Beta Invitation',
    idea: 'Closing beta access in 48 hours for our high-throughput visual generator. Only 50 slots left before we transition to paid commercial tiers.',
  },
];

const TONES: { id: ToneType; label: string; description: string; icon: any; color: string }[] = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Authoritative, polished, strategic, data-backed',
    icon: Briefcase,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'witty',
    label: 'Witty',
    description: 'Sharp, clever, ironic, relatable humor',
    icon: Smile,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    description: 'High energy, time-sensitive, FOMO, direct imperatives',
    icon: Flame,
    color: 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40',
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    description: 'Empowering, visionary, emotional momentum',
    icon: Compass,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'educational',
    label: 'Educational',
    description: 'Step-by-step breakdown, framework, playbook',
    icon: BookOpen,
    color: 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/40',
  },
];

const IMAGE_STYLES = [
  'Modern Minimalist Studio',
  'Hyperrealistic 3D Render',
  'Editorial Tech Photography',
  'Futuristic Cyberpunk / Neon',
  'Chalkboard / Hand-Drawn Infographic',
  'Cinematic Ambient Warmth',
];

export const CampaignInput: React.FC<CampaignInputProps> = ({ onGenerate, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [customTone, setCustomTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Visual Controls
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-3-pro-image-preview');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [imageStyle, setImageStyle] = useState(IMAGE_STYLES[0]);
  const [generateImagesSimultaneously, setGenerateImagesSimultaneously] = useState(true);
  const [modelPreference, setModelPreference] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onGenerate({
      idea: idea.trim(),
      tone,
      customTone: customTone.trim(),
      targetAudience: targetAudience.trim(),
      imageModel,
      imageSize,
      imageStyle,
      modelPreference,
      generateImagesSimultaneously,
    });
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl transition sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Social Campaign Studio</span>
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Simultaneous Generator
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Input an idea once. We simultaneously craft tailored copies &amp; optimal aspect ratio imagery for LinkedIn, Twitter/X, and Instagram.
          </p>
        </div>

        {/* Quick sample inspiration pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">Try quick prompt:</span>
          {SAMPLE_IDEAS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdea(sample.idea)}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core Idea Textarea */}
        <div>
          <label htmlFor="idea-input" className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-200">
            <span>What do you want to share? (Idea, announcement, insight, launch)</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {idea.length} characters
            </span>
          </label>
          <div className="relative">
            <textarea
              id="idea-input"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. We just reduced our database latency by 85% by rethinking our caching layer. Here is what failed 3 times before we got it right..."
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 p-3.5 text-sm text-slate-100 placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200">
              Desired Tone &amp; Voice <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Influences narrative angle, sentence rhythm, and emotional cadence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {TONES.map((t) => {
              const Icon = t.icon;
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`group relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${t.color} border-indigo-500/60 shadow-lg shadow-indigo-500/10`
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {t.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-tight text-slate-400">
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Tone Input */}
          <div className="mt-2.5 flex items-center gap-2">
            <input
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              placeholder="Or specify custom nuance (e.g., 'direct, contrarian, no corporate jargon', 'warm, poetic founder')"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 sm:p-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between text-xs font-medium text-slate-300 hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span>Studio Visual Controls &amp; Image Engine (Gemini 3 Pro Image • 1K / 2K / 4K)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-[11px] hidden sm:inline">
                {imageModel === 'gemini-3-pro-image-preview' ? 'Gemini 3 Pro Image' : 'Nano Banana 2.1'} • {imageSize}
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showAdvanced && (
            <div className="mt-4 grid gap-4 border-t border-slate-800/60 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Image Generation Model */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Image Generator Model
                </label>
                <select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value as ImageModel)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="gemini-3-pro-image-preview">
                    gemini-3-pro-image-preview (Studio Quality)
                  </option>
                  <option value="gemini-nano-banana-2.1">
                    gemini-nano-banana-2.1 (Fast Visuals)
                  </option>
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Generates unique visuals tailored to each platform's optimal ratio.
                </p>
              </div>

              {/* Image Size (1K, 2K, 4K) */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Image Size / Resolution
                </label>
                <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setImageSize(sz)}
                      className={`flex-1 rounded-md py-1 text-xs font-semibold transition ${
                        imageSize === sz
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  {imageSize === '1K' ? '1024px Web Standard' : imageSize === '2K' ? '2048px High-Res Retina' : '4096px Ultra Studio Pro'}
                </p>
              </div>

              {/* Visual Style Preset */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Visual Style Concept
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {IMAGE_STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Art direction applied across all 3 platforms.
                </p>
              </div>

              {/* Target Audience / Strategy Model */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Target Audience (Optional)
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B founders, Gen-Z creators, engineers"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Copywriting Model:</span>
                  <button
                    type="button"
                    onClick={() => setModelPreference(modelPreference === 'gemini-3.5-flash' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash')}
                    className="text-[10px] font-medium text-indigo-400 hover:underline"
                  >
                    {modelPreference}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Simultaneous Image Toggle Notice */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/40 pt-2.5">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={generateImagesSimultaneously}
                onChange={(e) => setGenerateImagesSimultaneously(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Simultaneously generate unique tailored images for each platform's optimal ratio</span>
            </label>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">LinkedIn: 16:9</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">Twitter: 16:9</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">Instagram: 1:1</span>
            </div>
          </div>
        </div>

        {/* Generate Primary CTA Button */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="flex items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Simultaneously Crafting 3 Platform Campaigns &amp; Images...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-200" />
                <span>Generate Cross-Platform Package</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
