export type PlatformId = 'linkedin' | 'twitter' | 'instagram';

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type ToneType = 'professional' | 'witty' | 'urgent' | 'inspirational' | 'storytelling' | 'educational' | 'custom';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  badge: string;
  defaultRatio: AspectRatio;
  color: string;
  characterLimit?: number;
  formatDescription: string;
}

export interface GeneratedPost {
  platform: PlatformId;
  content: string;
  hook?: string;
  callToAction?: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  imageModel: ImageModel;
  isGeneratingImage?: boolean;
  isFallback?: boolean;
  thread?: string[];
}

export interface AuditResult {
  overallScore: number;
  viralIndex: string;
  platformAudits: {
    linkedin: {
      score: number;
      hookCritique: string;
      topStrength: string;
      actionableTip: string;
    };
    twitter: {
      score: number;
      hookCritique: string;
      topStrength: string;
      actionableTip: string;
    };
    instagram: {
      score: number;
      hookCritique: string;
      topStrength: string;
      actionableTip: string;
    };
  };
  generalRecommendations: string[];
}

export interface CampaignHistoryItem {
  id: string;
  timestamp: number;
  idea: string;
  tone: string;
  themeTitle: string;
  posts: Record<PlatformId, GeneratedPost>;
}
