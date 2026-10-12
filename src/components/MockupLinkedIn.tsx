import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe2, MoreHorizontal } from 'lucide-react';
import { AspectRatio } from '../types';

interface MockupLinkedInProps {
  content: string;
  hashtags: string[];
  imageUrl?: string;
  aspectRatio: AspectRatio;
  isGeneratingImage?: boolean;
}

export const MockupLinkedIn: React.FC<MockupLinkedInProps> = ({
  content,
  hashtags,
  imageUrl,
  aspectRatio,
  isGeneratingImage,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  // Aspect ratio to CSS style
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

  const isLong = content.length > 320;
  const displayContent = !expanded && isLong ? `${content.slice(0, 300)}...` : content;

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-700/80 bg-[#1B1F23] text-slate-100 shadow-xl overflow-hidden font-sans">
      {/* LinkedIn Post Header */}
      <div className="flex items-center justify-between p-3.5 pb-2">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
              AV
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1B1F23]" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold text-white hover:text-blue-400 cursor-pointer">
                Alex Vance
              </span>
              <span className="text-xs text-slate-400">• 1st</span>
            </div>
            <p className="text-xs text-slate-400 leading-tight">
              Tech Founder &amp; AI Systems Architect
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe2 className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Text Body */}
      <div className="px-3.5 py-2 text-sm text-slate-200 leading-relaxed whitespace-pre-line break-words">
        {displayContent}
        {!expanded && isLong && (
          <button
            onClick={() => setExpanded(true)}
            className="ml-1 text-slate-400 hover:text-blue-400 font-semibold"
          >
            ...see more
          </button>
        )}

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="font-semibold text-blue-400 hover:underline cursor-pointer text-xs"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image Banner with platform aspect ratio */}
      {imageUrl && (
        <div className="mt-2 relative w-full bg-slate-950 flex items-center justify-center overflow-hidden border-y border-slate-800">
          <div className={`w-full max-h-[460px] flex items-center justify-center ${getAspectRatioClass(aspectRatio)}`}>
            {isGeneratingImage ? (
              <div className="flex flex-col items-center justify-center text-slate-400 p-6 space-y-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <span className="text-xs font-medium">Generating optimal {aspectRatio} visual...</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt="LinkedIn Post Visual"
                className="w-full h-full object-cover transition hover:scale-[1.01]"
              />
            )}
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
            {aspectRatio} Optimal
          </div>
        </div>
      )}

      {/* Reactions Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 border-b border-slate-800">
        <div className="flex items-center space-x-1">
          <div className="flex -space-x-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">👍</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] text-white">👏</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white">💡</span>
          </div>
          <span className="ml-1 text-[11px]">{liked ? '435' : '434'}</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>42 comments</span>
          <span>•</span>
          <span>18 reposts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around px-2 py-1 text-xs text-slate-400">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 font-semibold transition hover:bg-slate-800 ${
            liked ? 'text-blue-400' : 'hover:text-slate-200'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-blue-400 text-blue-400' : ''}`} />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1.5 rounded-lg px-3 py-2 font-semibold hover:bg-slate-800 hover:text-slate-200">
          <MessageSquare className="h-4 w-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1.5 rounded-lg px-3 py-2 font-semibold hover:bg-slate-800 hover:text-slate-200">
          <Repeat2 className="h-4 w-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center space-x-1.5 rounded-lg px-3 py-2 font-semibold hover:bg-slate-800 hover:text-slate-200">
          <Send className="h-4 w-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
