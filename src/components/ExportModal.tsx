import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Code2, Layers } from 'lucide-react';
import { GeneratedPost, PlatformId } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Record<PlatformId, GeneratedPost> | null;
  idea: string;
  tone: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  posts,
  idea,
  tone,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen || !posts) return null;

  const buildMarkdown = () => {
    return `# Cross-Platform Social Media Campaign
**Original Brief:** ${idea}
**Tone:** ${tone}
**Generated Date:** ${new Date().toLocaleDateString()}

---

## 1. LinkedIn (Long-Form)
**Optimal Aspect Ratio:** ${posts.linkedin.aspectRatio}
**Image Resolution:** ${posts.linkedin.imageSize || '1K'}

${posts.linkedin.content}

**Hashtags:**
${posts.linkedin.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}

*Image Prompt:*
> ${posts.linkedin.imagePrompt}

---

## 2. Twitter / X (Punchy & Short)
**Optimal Aspect Ratio:** ${posts.twitter.aspectRatio}
**Image Resolution:** ${posts.twitter.imageSize || '1K'}

${posts.twitter.content}

**Hashtags:**
${posts.twitter.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}

*Image Prompt:*
> ${posts.twitter.imagePrompt}

---

## 3. Instagram (Visual Storytelling)
**Optimal Aspect Ratio:** ${posts.instagram.aspectRatio}
**Image Resolution:** ${posts.instagram.imageSize || '1K'}

${posts.instagram.content}

**Hashtags:**
${posts.instagram.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}

*Image Prompt:*
> ${posts.instagram.imagePrompt}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(buildMarkdown());
    setCopiedFormat('markdown');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnipost_campaign_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const data = {
      idea,
      tone,
      generatedAt: new Date().toISOString(),
      platforms: posts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnipost_campaign_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllImages = () => {
    (['linkedin', 'twitter', 'instagram'] as PlatformId[]).forEach((platform, idx) => {
      const p = posts[platform];
      if (p.imageUrl) {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = p.imageUrl;
          a.download = `${platform}_${p.aspectRatio.replace(':', 'x')}_${p.imageSize || '1K'}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, idx * 300);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Complete Campaign</h3>
              <p className="text-xs text-slate-400">
                Package all 3 platforms (LinkedIn, Twitter/X, Instagram) + Visual Assets
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

        {/* Export Options */}
        <div className="p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Markdown option */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-bold text-white">Markdown Bundle</span>
                </div>
                <p className="text-xs text-slate-400">
                  Formatted for Notion, Obsidian, GitHub, or documentation.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex-1 flex items-center justify-center space-x-1 rounded-lg border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  {copiedFormat === 'markdown' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedFormat === 'markdown' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex-1 flex items-center justify-center space-x-1 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* JSON option */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-purple-400 mb-1">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm font-bold text-white">Structured JSON</span>
                </div>
                <p className="text-xs text-slate-400">
                  Raw data with image URLs, aspect ratios, and prompt metadata.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDownloadJson}
                  className="w-full flex items-center justify-center space-x-1 rounded-lg bg-purple-600 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>
          </div>

          {/* Download all images */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white block">Download All Visual Assets</span>
              <span className="text-xs text-slate-400">
                Downloads 3 tailored images: LinkedIn ({posts.linkedin.aspectRatio}), Twitter ({posts.twitter.aspectRatio}), Instagram ({posts.instagram.aspectRatio}).
              </span>
            </div>
            <button
              onClick={handleDownloadAllImages}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Download 3 Images</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 bg-slate-950/70 p-4">
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
