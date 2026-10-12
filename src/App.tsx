import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LayoutGrid,
  Columns3,
  Download,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  PlatformId,
  AspectRatio,
  ImageSize,
  ImageModel,
  ToneType,
  GeneratedPost,
  AuditResult,
  CampaignHistoryItem,
} from './types';
import { Navbar } from './components/Navbar';
import { CampaignInput } from './components/CampaignInput';
import { PlatformCard } from './components/PlatformCard';
import { AuditModal } from './components/AuditModal';
import { HistoryModal } from './components/HistoryModal';
import { ExportModal } from './components/ExportModal';

const HISTORY_STORAGE_KEY = 'omnipost_campaign_history_v1';

export default function App() {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [customTone, setCustomTone] = useState('');
  const [themeTitle, setThemeTitle] = useState('');

  // Generated posts per platform
  const [posts, setPosts] = useState<Record<PlatformId, GeneratedPost> | null>(null);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [isRefining, setIsRefining] = useState<Record<PlatformId, boolean>>({
    linkedin: false,
    twitter: false,
    instagram: false,
  });

  // Modals & Panels
  const [viewMode, setViewMode] = useState<'all' | PlatformId>('all');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History from localStorage
  const [history, setHistory] = useState<CampaignHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Main Generation Handler
  const handleGenerate = async (params: {
    idea: string;
    tone: ToneType;
    customTone: string;
    targetAudience: string;
    imageModel: ImageModel;
    imageSize: ImageSize;
    imageStyle: string;
    modelPreference: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview';
    generateImagesSimultaneously: boolean;
  }) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setIdea(params.idea);
    setTone(params.tone);
    setCustomTone(params.customTone);
    setGenerationStep('Synthesizing cross-platform copy angles with Gemini Flash...');

    try {
      // Step 1: Generate cross-platform tailored copies
      const textRes = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: params.idea,
          tone: params.tone,
          customTone: params.customTone,
          targetAudience: params.targetAudience,
          modelPreference: params.modelPreference,
        }),
      });

      const textData = await textRes.json();
      if (!textRes.ok || !textData.success) {
        throw new Error(textData.error || 'Failed to generate tailored content');
      }

      const generatedData = textData.data;
      setThemeTitle(generatedData.themeTitle || 'Social Campaign');

      // Initialize initial post drafts
      const initialPosts: Record<PlatformId, GeneratedPost> = {
        linkedin: {
          platform: 'linkedin',
          content: `${generatedData.linkedin.hook}\n\n${generatedData.linkedin.body}\n\n${generatedData.linkedin.callToAction}`,
          hook: generatedData.linkedin.hook,
          callToAction: generatedData.linkedin.callToAction,
          hashtags: generatedData.linkedin.hashtags || [],
          imagePrompt: generatedData.linkedin.imagePrompt || `${params.idea} professional concept visual`,
          imageUrl: '',
          aspectRatio: (generatedData.linkedin.recommendedRatio as AspectRatio) || '16:9',
          imageSize: params.imageSize,
          imageModel: params.imageModel,
          isGeneratingImage: params.generateImagesSimultaneously,
        },
        twitter: {
          platform: 'twitter',
          content: generatedData.twitter.tweet,
          hook: generatedData.twitter.hook,
          hashtags: generatedData.twitter.hashtags || [],
          imagePrompt: generatedData.twitter.imagePrompt || `${params.idea} punchy modern visual`,
          imageUrl: '',
          aspectRatio: (generatedData.twitter.recommendedRatio as AspectRatio) || '16:9',
          imageSize: params.imageSize,
          imageModel: params.imageModel,
          thread: generatedData.twitter.threadContinuation || [],
          isGeneratingImage: params.generateImagesSimultaneously,
        },
        instagram: {
          platform: 'instagram',
          content: `${generatedData.instagram.hook}\n\n${generatedData.instagram.caption}\n\n${generatedData.instagram.callToAction}`,
          hook: generatedData.instagram.hook,
          callToAction: generatedData.instagram.callToAction,
          hashtags: generatedData.instagram.hashtags || [],
          imagePrompt: generatedData.instagram.imagePrompt || `${params.idea} aesthetic visual render`,
          imageUrl: '',
          aspectRatio: (generatedData.instagram.recommendedRatio as AspectRatio) || '1:1',
          imageSize: params.imageSize,
          imageModel: params.imageModel,
          isGeneratingImage: params.generateImagesSimultaneously,
        },
      };

      setPosts(initialPosts);

      // Step 2: Generate Unique Visuals simultaneously for each platform's optimal ratio
      if (params.generateImagesSimultaneously) {
        setGenerationStep('Simultaneously rendering tailored visuals (LinkedIn 16:9 • Twitter 16:9 • Instagram 1:1)...');

        const platforms: PlatformId[] = ['linkedin', 'twitter', 'instagram'];
        const imagePromises = platforms.map(async (plat) => {
          const draft = initialPosts[plat];
          try {
            const imgRes = await fetch('/api/generate-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: draft.imagePrompt,
                platform: plat,
                aspectRatio: draft.aspectRatio,
                imageSize: draft.imageSize,
                model: draft.imageModel,
                style: params.imageStyle,
              }),
            });
            const imgData = await imgRes.json();
            if (imgRes.ok && imgData.success) {
              setPosts((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  [plat]: {
                    ...prev[plat],
                    imageUrl: imgData.imageUrl,
                    isGeneratingImage: false,
                    isFallback: imgData.isFallback,
                  },
                };
              });
            } else {
              setPosts((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  [plat]: {
                    ...prev[plat],
                    isGeneratingImage: false,
                  },
                };
              });
            }
          } catch (err) {
            console.error(`Image generation failed for ${plat}:`, err);
            setPosts((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                [plat]: {
                  ...prev[plat],
                  isGeneratingImage: false,
                },
              };
            });
          }
        });

        await Promise.all(imagePromises);
      }

      // Save to history
      setTimeout(() => {
        setPosts((current) => {
          if (current) {
            const historyItem: CampaignHistoryItem = {
              id: `camp_${Date.now()}`,
              timestamp: Date.now(),
              idea: params.idea,
              tone: params.customTone ? `${params.tone} (${params.customTone})` : params.tone,
              themeTitle: generatedData.themeTitle || 'Social Campaign',
              posts: current,
            };
            setHistory((prevHistory) => [historyItem, ...prevHistory.slice(0, 19)]);
          }
          return current;
        });
      }, 500);
    } catch (err: any) {
      console.error('Generation failure:', err);
      setErrorMessage(err.message || 'Failed to complete campaign generation.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate individual platform image with aspect ratio / size / model changes
  const handleRegenerateImage = async (
    platform: PlatformId,
    params: {
      aspectRatio: AspectRatio;
      imageSize: ImageSize;
      imageModel: ImageModel;
      prompt: string;
    }
  ) => {
    if (!posts) return;

    setPosts((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          isGeneratingImage: true,
          aspectRatio: params.aspectRatio,
          imageSize: params.imageSize,
          imageModel: params.imageModel,
          imagePrompt: params.prompt,
        },
      };
    });

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          platform,
          aspectRatio: params.aspectRatio,
          imageSize: params.imageSize,
          model: params.imageModel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [platform]: {
              ...prev[platform],
              imageUrl: data.imageUrl,
              isGeneratingImage: false,
              isFallback: data.isFallback,
            },
          };
        });
      } else {
        throw new Error(data.error || 'Failed to render image');
      }
    } catch (err: any) {
      console.error('Image regen error:', err);
      setPosts((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [platform]: {
            ...prev[platform],
            isGeneratingImage: false,
          },
        };
      });
      alert(`Image generation notice: ${err.message}`);
    }
  };

  // Refine text action using gemini-3.1-flash-lite
  const handleRefineText = async (platform: PlatformId, action: string, params?: any) => {
    if (!posts) return;
    const currentPost = posts[platform];

    setIsRefining((prev) => ({ ...prev, [platform]: true }));

    try {
      const res = await fetch('/api/refine-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content: currentPost.content,
          action,
          params,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [platform]: {
              ...prev[platform],
              content: data.refinedContent,
            },
          };
        });
      } else {
        throw new Error(data.error || 'Failed to refine content');
      }
    } catch (err: any) {
      console.error('Refine failed:', err);
      alert(`Refine notice: ${err.message}`);
    } finally {
      setIsRefining((prev) => ({ ...prev, [platform]: false }));
    }
  };

  // Update post fields directly from editor
  const handleUpdatePost = (platform: PlatformId, updated: Partial<GeneratedPost>) => {
    setPosts((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          ...updated,
        },
      };
    });
  };

  // Run Strategic Content Audit with gemini-3.1-pro-preview
  const handleRunAudit = async () => {
    if (!posts) return;
    setShowAuditModal(true);
    setIsAuditing(true);

    try {
      const res = await fetch('/api/audit-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tone: customTone ? `${tone} (${customTone})` : tone,
          posts: {
            linkedin: posts.linkedin.content,
            twitter: posts.twitter.content,
            instagram: posts.instagram.content,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuditResult(data.audit);
      } else {
        throw new Error(data.error || 'Strategic audit failed');
      }
    } catch (err: any) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenAudit={handleRunAudit}
        historyCount={history.length}
        hasGeneratedContent={!!posts}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-bold hover:text-white ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Campaign Input Section */}
        <CampaignInput onGenerate={handleGenerate} isLoading={isGenerating} />

        {/* Generation Progress Indicator */}
        {isGenerating && (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 shadow-lg flex items-center justify-center space-x-3 text-indigo-200">
            <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white">Simultaneous Generation in Progress</p>
              <p className="text-xs text-indigo-300">{generationStep || 'Processing multi-platform pipeline...'}</p>
            </div>
          </div>
        )}

        {/* Results Workspace Section */}
        {posts && (
          <section className="space-y-4 pt-2">
            {/* Workspace Controls Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">{themeTitle || 'Social Media Package'}</h2>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Ready to publish
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tone: <span className="text-slate-200 font-medium capitalize">{customTone ? `${tone} (${customTone})` : tone}</span> • 3 platform tailored drafts &amp; optimal aspect ratio visuals.
                </p>
              </div>

              {/* View layout selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 hidden md:inline">Layout:</span>
                <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 transition ${
                      viewMode === 'all'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Columns3 className="h-3.5 w-3.5" />
                    <span>All 3 Platforms</span>
                  </button>
                  <button
                    onClick={() => setViewMode('linkedin')}
                    className={`flex items-center space-x-1 rounded-md px-2 py-1 transition ${
                      viewMode === 'linkedin'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => setViewMode('twitter')}
                    className={`flex items-center space-x-1 rounded-md px-2 py-1 transition ${
                      viewMode === 'twitter'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Twitter/X</span>
                  </button>
                  <button
                    onClick={() => setViewMode('instagram')}
                    className={`flex items-center space-x-1 rounded-md px-2 py-1 transition ${
                      viewMode === 'instagram'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Instagram</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Cards Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === 'all'
                  ? 'grid-cols-1 lg:grid-cols-3'
                  : 'grid-cols-1 max-w-2xl mx-auto'
              }`}
            >
              {(viewMode === 'all' || viewMode === 'linkedin') && (
                <PlatformCard
                  post={posts.linkedin}
                  onUpdatePost={(up) => handleUpdatePost('linkedin', up)}
                  onRegenerateImage={(params) => handleRegenerateImage('linkedin', params)}
                  onRefineText={(act, p) => handleRefineText('linkedin', act, p)}
                  isRefining={isRefining.linkedin}
                />
              )}

              {(viewMode === 'all' || viewMode === 'twitter') && (
                <PlatformCard
                  post={posts.twitter}
                  onUpdatePost={(up) => handleUpdatePost('twitter', up)}
                  onRegenerateImage={(params) => handleRegenerateImage('twitter', params)}
                  onRefineText={(act, p) => handleRefineText('twitter', act, p)}
                  isRefining={isRefining.twitter}
                />
              )}

              {(viewMode === 'all' || viewMode === 'instagram') && (
                <PlatformCard
                  post={posts.instagram}
                  onUpdatePost={(up) => handleUpdatePost('instagram', up)}
                  onRegenerateImage={(params) => handleRegenerateImage('instagram', params)}
                  onRefineText={(act, p) => handleRefineText('instagram', act, p)}
                  isRefining={isRefining.instagram}
                />
              )}
            </div>
          </section>
        )}
      </main>

      {/* Strategic Audit Modal (gemini-3.1-pro-preview) */}
      <AuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        audit={auditResult}
        isLoading={isAuditing}
        onReaudit={handleRunAudit}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onSelectCampaign={(item) => {
          setIdea(item.idea);
          setTone(item.tone as any);
          setThemeTitle(item.themeTitle);
          setPosts(item.posts);
        }}
        onClearHistory={() => setHistory([])}
        onDeleteItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
      />

      {/* Export Bundle Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        posts={posts}
        idea={idea}
        tone={customTone ? `${tone} (${customTone})` : tone}
      />
    </div>
  );
}
