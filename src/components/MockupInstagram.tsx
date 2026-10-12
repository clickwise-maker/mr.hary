import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from 'lucide-react';
import { AspectRatio } from '../types';

interface MockupInstagramProps {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  aspectRatio: AspectRatio;
  isGeneratingImage?: boolean;
}

export const MockupInstagram: React.FC<MockupInstagramProps> = ({
  caption,
  hashtags,
  imageUrl,
  aspectRatio,
  isGeneratingImage,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);

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
        return 'aspect-square';
    }
  };

  const isLong = caption.length > 200;
  const displayCaption = !showMore && isLong ? `${caption.slice(0, 180)}...` : caption;

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-800 bg-[#000000] text-white shadow-xl overflow-hidden font-sans">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-900">
        <div className="flex items-center space-x-2.5">
          {/* Gradient Stories Ring */}
          <div className="rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
            <div className="h-8 w-8 rounded-full bg-black p-[1.5px]">
              <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                AV
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-xs text-white hover:underline cursor-pointer">
                alex.vance
              </span>
              <span className="text-[11px] text-slate-400">• Following</span>
            </div>
            <p className="text-[10px] text-slate-400">San Francisco, California</p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-white p-1">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Media Image Frame with aspect ratio */}
      <div className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className={`w-full max-h-[460px] flex items-center justify-center ${getAspectRatioClass(aspectRatio)}`}>
          {isGeneratingImage ? (
            <div className="flex flex-col items-center justify-center text-slate-400 p-6 space-y-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
              <span className="text-xs font-medium">Generating Instagram {aspectRatio} asset...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Instagram Visual"
              className="w-full h-full object-cover transition hover:scale-[1.01]"
            />
          ) : (
            <div className="flex items-center justify-center text-xs text-slate-500">
              No image generated
            </div>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white backdrop-blur-sm">
          {aspectRatio} Optimal
        </div>
      </div>

      {/* Actions Bar */}
      <div className="p-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition active:scale-125 ${liked ? 'text-rose-500' : 'text-white hover:text-slate-300'}`}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-rose-500' : ''}`} />
            </button>
            <button className="text-white hover:text-slate-300 transition">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="text-white hover:text-slate-300 transition">
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`transition ${saved ? 'text-white fill-white' : 'text-white hover:text-slate-300'}`}
          >
            <Bookmark className={`h-6 w-6 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="text-xs font-semibold text-white mb-1.5">
          {liked ? '1,430' : '1,429'} likes
        </p>

        {/* Caption */}
        <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line break-words">
          <span className="font-bold text-white mr-1.5 cursor-pointer hover:underline">
            alex.vance
          </span>
          {displayCaption}
          {!showMore && isLong && (
            <button
              onClick={() => setShowMore(true)}
              className="text-slate-400 font-semibold ml-1 hover:text-white"
            >
              more
            </button>
          )}

          {/* Hashtags Cluster */}
          {hashtags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-sky-300 hover:text-sky-200 cursor-pointer text-[11px]"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Link */}
        <button className="mt-2 text-[11px] text-slate-400 hover:text-slate-300 block">
          View all 64 comments
        </button>

        {/* Timestamp */}
        <p className="mt-1 text-[10px] text-slate-500 uppercase tracking-wider">
          2 hours ago
        </p>
      </div>

      {/* Add comment bar */}
      <div className="flex items-center justify-between border-t border-slate-900 px-3 py-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2 w-full">
          <Smile className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            readOnly
          />
        </div>
        <button className="text-xs font-semibold text-sky-400 opacity-60">Post</button>
      </div>
    </div>
  );
};
