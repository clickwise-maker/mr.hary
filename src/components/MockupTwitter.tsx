import React, { useState } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  Share,
  BadgeCheck,
  BarChart2,
  MoreHorizontal,
} from 'lucide-react';
import { AspectRatio } from '../types';

interface MockupTwitterProps {
  tweet: string;
  hashtags: string[];
  imageUrl?: string;
  aspectRatio: AspectRatio;
  thread?: string[];
  isGeneratingImage?: boolean;
}

export const MockupTwitter: React.FC<MockupTwitterProps> = ({
  tweet,
  hashtags,
  imageUrl,
  aspectRatio,
  thread = [],
  isGeneratingImage,
}) => {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showThread, setShowThread] = useState(false);

  // Format hashtags inside tweet or append
  const charCount = tweet.length;
  const isOverLimit = charCount > 280;

  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '16:9':
        return 'aspect-[16/9]';
      case '9:16':
        return 'aspect-[9/16]';
      case '2:3':
        return 'aspect-[2/3]';
      case '3:2':
        return 'aspect-[3/2]';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-[16/9]';
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-800 bg-[#000000] text-slate-100 shadow-xl overflow-hidden font-sans">
      {/* Tweet Body container */}
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white shadow">
              AV
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                  Alex Vance
                </span>
                <BadgeCheck className="h-4 w-4 text-sky-400 fill-sky-400" />
                <span className="text-xs text-slate-400">@alexvance</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">12m</span>
              </div>
              <p className="text-[11px] text-slate-400">Systems &amp; Product</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-900">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Text Content */}
        <div className="mt-3 text-sm text-slate-100 leading-normal whitespace-pre-line break-words">
          {tweet}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-sky-400 hover:underline cursor-pointer text-xs"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media Frame with platform aspect ratio */}
        {imageUrl && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 relative">
            <div className={`w-full max-h-[380px] flex items-center justify-center ${getAspectRatioClass(aspectRatio)}`}>
              {isGeneratingImage ? (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 space-y-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                  <span className="text-xs font-medium">Rendering Twitter visual ({aspectRatio})...</span>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Twitter Media"
                  className="w-full h-full object-cover transition hover:scale-[1.01]"
                />
              )}
            </div>
            <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              {aspectRatio} Optimal
            </div>
          </div>
        )}

        {/* Character Limit Status bar */}
        <div className="mt-3 flex items-center justify-between border-b border-slate-900 pb-2 text-[11px]">
          <span className="text-slate-400">9:41 AM · Oct 12, 2026 · <strong className="text-slate-300">34.2K</strong> Views</span>
          <div className="flex items-center space-x-1.5">
            <span className={isOverLimit ? 'font-bold text-red-400' : 'text-slate-400'}>
              {charCount}/280
            </span>
            <div className="h-2 w-12 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${isOverLimit ? 'bg-red-500' : charCount > 240 ? 'bg-amber-400' : 'bg-sky-400'}`}
                style={{ width: `${Math.min(100, (charCount / 280) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Engagement Action Bar */}
        <div className="mt-2 flex items-center justify-between text-slate-400 text-xs px-1">
          <button className="flex items-center space-x-1.5 hover:text-sky-400 transition">
            <MessageCircle className="h-4 w-4" />
            <span>28</span>
          </button>
          <button
            onClick={() => setRetweeted(!retweeted)}
            className={`flex items-center space-x-1.5 transition ${retweeted ? 'text-emerald-400' : 'hover:text-emerald-400'}`}
          >
            <Repeat2 className="h-4 w-4" />
            <span>{retweeted ? '115' : '114'}</span>
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center space-x-1.5 transition ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{liked ? '843' : '842'}</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:text-sky-400 transition">
            <BarChart2 className="h-4 w-4" />
            <span>34K</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`hover:text-sky-400 transition ${bookmarked ? 'text-sky-400 fill-sky-400' : ''}`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-sky-400' : ''}`} />
            </button>
            <button className="hover:text-sky-400 transition">
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini-thread continuation toggle if generated */}
      {thread && thread.length > 0 && (
        <div className="border-t border-slate-900 bg-slate-950/60 p-3">
          <button
            onClick={() => setShowThread(!showThread)}
            className="flex w-full items-center justify-between text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <span>{showThread ? 'Hide thread continuation' : `Show 2-part thread extension (${thread.length} tweets)`}</span>
            <span className="text-[11px] text-slate-400 font-normal">Thread view</span>
          </button>

          {showThread && (
            <div className="mt-3 space-y-3 pl-6 border-l-2 border-slate-800">
              {thread.map((t, idx) => (
                <div key={idx} className="relative text-xs text-slate-300 bg-black/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="absolute -left-[31px] top-3 h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-black" />
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">2/{idx + 2}</span>
                  <p className="whitespace-pre-line">{t}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
