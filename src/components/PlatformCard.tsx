import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3,
  Sliders,
  Image as ImageIcon,
  Share2,
  Languages,
  Wand2,
  Smile,
  Zap,
  Scissors,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { GeneratedPost, AspectRatio, ImageSize, ImageModel } from '../types';
import { MockupLinkedIn } from './MockupLinkedIn';
import { MockupTwitter } from './MockupTwitter';
import { MockupInstagram } from './MockupInstagram';

interface PlatformCardProps {
  post: GeneratedPost;
  onUpdatePost: (updated: Partial<GeneratedPost>) => void;
  onRegenerateImage: (params: {
    aspectRatio: AspectRatio;
    imageSize: ImageSize;
    imageModel: ImageModel;
    prompt: string;
  }) => Promise<void>;
  onRefineText: (action: string, params?: any) => Promise<void>;
  isRefining: boolean;
}

const ALL_ASPECT_RATIOS: { ratio: AspectRatio; label: string; desc: string }[] = [
  { ratio: '1:1', label: '1:1 Square', desc: 'Instagram Feed, LinkedIn Post' },
  { ratio: '16:9', label: '16:9 Widescreen', desc: 'LinkedIn Banner, Twitter/X Media' },
  { ratio: '4:3', label: '4:3 Standard', desc: 'LinkedIn Carousel, Tablet feed' },
  { ratio: '9:16', label: '9:16 Story/Reel', desc: 'Instagram Stories, Mobile Fullscreen' },
  { ratio: '3:2', label: '3:2 Landscape', desc: 'Twitter/X Photography' },
  { ratio: '2:3', label: '2:3 Portrait', desc: 'Pinterest, Mobile vertical' },
  { ratio: '3:4', label: '3:4 Portrait', desc: 'Instagram Portrait feed' },
  { ratio: '21:9', label: '21:9 Ultrawide', desc: 'Cinematic Header' },
];

export const PlatformCard: React.FC<PlatformCardProps> = ({
  post,
  onUpdatePost,
  onRegenerateImage,
  onRefineText,
  isRefining,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'imageStudio'>('preview');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(post.imagePrompt);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(post.aspectRatio);
  const [selectedSize, setSelectedSize] = useState<ImageSize>(post.imageSize || '1K');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(post.imageModel || 'gemini-3-pro-image-preview');
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);

  // Platform specific branding
  const platformMeta = {
    linkedin: {
      name: 'LinkedIn',
      badge: 'Long-Form Narrative',
      color: 'from-blue-600 to-cyan-600',
      tagline: 'Thought-leadership & B2B reach',
      optimalRatio: '16:9' as AspectRatio,
    },
    twitter: {
      name: 'Twitter / X',
      badge: 'Punchy Hook',
      color: 'from-sky-500 to-blue-500',
      tagline: 'High virality & rapid conversation',
      optimalRatio: '16:9' as AspectRatio,
    },
    instagram: {
      name: 'Instagram',
      badge: 'Visual Storytelling',
      color: 'from-rose-500 via-purple-500 to-amber-500',
      tagline: 'Aesthetic engagement & community hashtags',
      optimalRatio: '1:1' as AspectRatio,
    },
  }[post.platform];

  const handleCopy = () => {
    let fullText = post.content;
    if (post.hashtags && post.hashtags.length > 0) {
      const tagsFormatted = post.hashtags
        .map((t) => (t.startsWith('#') ? t : `#${t}`))
        .join(' ');
      fullText = `${fullText}\n\n${tagsFormatted}`;
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!post.imageUrl) return;
    const link = document.createElement('a');
    link.href = post.imageUrl;
    link.download = `${post.platform}_visual_${post.aspectRatio.replace(':', 'x')}_${post.imageSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerImageRegen = () => {
    onRegenerateImage({
      aspectRatio: selectedRatio,
      imageSize: selectedSize,
      imageModel: selectedModel,
      prompt: customPrompt,
    });
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden transition">
      {/* Platform Branding Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${platformMeta.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
            {post.platform === 'linkedin' ? 'in' : post.platform === 'twitter' ? '𝕏' : 'IG'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">{platformMeta.name}</h3>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                {platformMeta.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{platformMeta.tagline}</p>
          </div>
        </div>

        {/* Tab switchers: Preview vs Editor vs Visual Studio */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 transition ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mockup</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 transition ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit Text</span>
          </button>
          <button
            onClick={() => setActiveTab('imageStudio')}
            className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 transition ${
              activeTab === 'imageStudio'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Visual Studio</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* TAB 1: Authentic Mockup */}
        {activeTab === 'preview' && (
          <div className="py-1">
            {post.platform === 'linkedin' && (
              <MockupLinkedIn
                content={post.content}
                hashtags={post.hashtags}
                imageUrl={post.imageUrl}
                aspectRatio={post.aspectRatio}
                isGeneratingImage={post.isGeneratingImage}
              />
            )}
            {post.platform === 'twitter' && (
              <MockupTwitter
                tweet={post.content}
                hashtags={post.hashtags}
                imageUrl={post.imageUrl}
                aspectRatio={post.aspectRatio}
                thread={post.thread}
                isGeneratingImage={post.isGeneratingImage}
              />
            )}
            {post.platform === 'instagram' && (
              <MockupInstagram
                caption={post.content}
                hashtags={post.hashtags}
                imageUrl={post.imageUrl}
                aspectRatio={post.aspectRatio}
                isGeneratingImage={post.isGeneratingImage}
              />
            )}
          </div>
        )}

        {/* TAB 2: Text Editor & Quick Refine */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            {/* Quick Refine Toolbar (gemini-3.1-flash-lite) */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  Gemini Flash-Lite Fast Polish Actions:
                </span>
                {isRefining && (
                  <span className="text-[11px] text-amber-400 flex items-center gap-1 animate-pulse">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Refining...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefineText('punch_hook')}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  <Wand2 className="h-3 w-3 text-amber-400" />
                  <span>Punch Up Hook</span>
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefineText('shorten')}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  <Scissors className="h-3 w-3 text-rose-400" />
                  <span>Shorten (-30%)</span>
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefineText('add_emojis')}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  <Smile className="h-3 w-3 text-emerald-400" />
                  <span>Add Emojis</span>
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefineText('fix_grammar')}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  <Check className="h-3 w-3 text-indigo-400" />
                  <span>Polish Grammar</span>
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefineText('viral_hashtags')}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  <Zap className="h-3 w-3 text-cyan-400" />
                  <span>Smart Hashtags</span>
                </button>

                {/* Translation dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    disabled={isRefining}
                    onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                    className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 hover:text-white"
                  >
                    <Languages className="h-3 w-3 text-purple-400" />
                    <span>Translate</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showTranslateMenu && (
                    <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl">
                      {['Spanish', 'German', 'Japanese', 'French', 'Portuguese'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setShowTranslateMenu(false);
                            onRefineText('translate', { targetLanguage: lang });
                          }}
                          className="w-full text-left rounded px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Content Area */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                <span>Post Content:</span>
                <span className={post.platform === 'twitter' && post.content.length > 280 ? 'text-rose-400 font-bold' : ''}>
                  {post.content.length} characters {post.platform === 'twitter' ? '/ 280 limit' : ''}
                </span>
              </div>
              <textarea
                rows={9}
                value={post.content}
                onChange={(e) => onUpdatePost({ content: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            {/* Hashtags list */}
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">
                Hashtags ({post.hashtags.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {post.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-xs text-indigo-300 border border-slate-700"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                    <button
                      type="button"
                      onClick={() => {
                        const next = post.hashtags.filter((_, idx) => idx !== i);
                        onUpdatePost({ hashtags: next });
                      }}
                      className="ml-1 text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Visual Studio & Aspect Ratio & Size Controls */}
        {activeTab === 'imageStudio' && (
          <div className="space-y-4">
            {/* Visual Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden relative">
              <div className="max-h-[300px] flex items-center justify-center p-2">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt="Platform Asset"
                    className="max-h-[280px] w-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">No visual generated</div>
                )}
              </div>
              <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {post.aspectRatio}
                </span>
                <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {post.imageSize || '1K'}
                </span>
              </div>
            </div>

            {/* Aspect Ratio Selector (Affordance for 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  Aspect Ratio Control
                </label>
                <span className="text-[11px] text-indigo-400">
                  Platform Optimal: {platformMeta.optimalRatio}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-4">
                {ALL_ASPECT_RATIOS.map((item) => {
                  const isSelected = selectedRatio === item.ratio;
                  const isOptimal = item.ratio === platformMeta.optimalRatio;
                  return (
                    <button
                      key={item.ratio}
                      type="button"
                      onClick={() => setSelectedRatio(item.ratio)}
                      className={`relative flex flex-col items-center justify-center rounded-lg border p-2 text-center transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-mono">{item.ratio}</span>
                      {isOptimal && (
                        <span className="mt-0.5 rounded bg-blue-500/20 px-1 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                          Optimal
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Resolution & Model Affordances */}
            <div className="grid grid-cols-2 gap-3">
              {/* Image Size (1K, 2K, 4K) */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Image Size / Resolution
                </label>
                <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-0.5">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`flex-1 rounded-md py-1 text-xs font-semibold transition ${
                        selectedSize === sz
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Image Model Engine
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ImageModel)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (Studio)</option>
                  <option value="gemini-nano-banana-2.1">gemini-nano-banana-2.1</option>
                </select>
              </div>
            </div>

            {/* Custom Prompt Text */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Visual Art Prompt
              </label>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Visual description for this platform's visual..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Regenerate Action */}
            <button
              type="button"
              disabled={post.isGeneratingImage}
              onClick={handleTriggerImageRegen}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {post.isGeneratingImage ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating {selectedRatio} ({selectedSize})...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Regenerate Image ({selectedRatio} • {selectedSize})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Global Action Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Post</span>
                </>
              )}
            </button>

            {post.imageUrl && (
              <button
                onClick={handleDownloadImage}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95"
                title={`Download image (${post.aspectRatio})`}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Image</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <span>Ratio: <strong className="text-slate-300">{post.aspectRatio}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-slate-300">{post.imageSize || '1K'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
