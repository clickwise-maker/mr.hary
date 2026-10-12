import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for generating dynamic fallback visuals when API key or quota limits apply
function generateFallbackSvg(prompt: string, platform: string, aspectRatio: string): string {
  let width = 1200;
  let height = 630; // 16:9 approx
  if (aspectRatio === '1:1') {
    width = 1080;
    height = 1080;
  } else if (aspectRatio === '4:3') {
    width = 1200;
    height = 900;
  } else if (aspectRatio === '9:16') {
    width = 1080;
    height = 1920;
  } else if (aspectRatio === '3:4') {
    width = 900;
    height = 1200;
  } else if (aspectRatio === '2:3') {
    width = 800;
    height = 1200;
  } else if (aspectRatio === '3:2') {
    width = 1200;
    height = 800;
  } else if (aspectRatio === '21:9') {
    width = 1260;
    height = 540;
  }

  const cleanPrompt = prompt.replace(/[<>&"]/g, ' ').slice(0, 75);
  const gradients: Record<string, [string, string, string]> = {
    linkedin: ['#0A66C2', '#004182', '#001D3D'],
    twitter: ['#1D9BF0', '#0F1419', '#1A8CD8'],
    instagram: ['#833AB4', '#FD1D1D', '#FCB045'],
  };
  const [c1, c2, c3] = gradients[platform] || ['#6366F1', '#4F46E5', '#312E81'];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="50%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c3}" />
      </linearGradient>
      <linearGradient id="glowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter id="blurFilter">
        <feGaussianBlur stdDeviation="60" />
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <!-- Dynamic geometric accent shapes -->
    <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${width * 0.3}" fill="#ffffff" fill-opacity="0.08" filter="url(#blurFilter)" />
    <circle cx="${width * 0.15}" cy="${height * 0.85}" r="${width * 0.25}" fill="#ffffff" fill-opacity="0.06" filter="url(#blurFilter)" />
    <rect x="${width * 0.08}" y="${height * 0.08}" width="${width * 0.84}" height="${height * 0.84}" rx="24" fill="url(#glowGrad)" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2" />
    <g transform="translate(${width * 0.12}, ${height * 0.45})">
      <rect x="0" y="-45" width="160" height="34" rx="17" fill="#ffffff" fill-opacity="0.2" />
      <text x="80" y="-23" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#ffffff" letter-spacing="1.5">${platform.toUpperCase()} • ${aspectRatio}</text>
      <text x="0" y="35" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="${Math.min(36, width * 0.038)}" fill="#ffffff">
        ${cleanPrompt || 'Tailored Visual Asset'}
      </text>
      <text x="0" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="16" fill="#ffffff" fill-opacity="0.8">
        Studio Concept • Generated with OmniPost AI
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// 1. Generate Simultaneous Cross-Platform Content
app.post('/api/generate-content', async (req, res) => {
  try {
    const { idea, tone = 'professional', customTone, targetAudience, modelPreference = 'gemini-3.5-flash' } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide an idea or campaign topic.' });
    }

    const effectiveTone = customTone ? `${tone} (${customTone})` : tone;
    const modelToUse = modelPreference === 'gemini-3.1-pro-preview' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const systemInstruction = `You are an elite multi-platform social media director and viral copywriter.
Given a core idea, you will simultaneously craft three distinct, masterfully tailored posts for:
1. LinkedIn:
   - Long-form thought-leadership format (150 - 300 words).
   - Scroll-stopping opening hook (1-2 sentences).
   - Generous line spacing and short 1-2 sentence paragraphs for mobile readability.
   - Professional insights, actionable frameworks, or personal lessons learned.
   - Clear engagement question / call to action at the bottom.
   - 3 to 5 targeted professional industry hashtags.
   - An exact visual image description prompt optimized for a high-impact LinkedIn post visual banner (16:9 or 4:3).

2. Twitter / X:
   - Short, punchy, bold tweet (strictly under 280 characters).
   - High hook density, provocative or insightful takeaway, no fluff.
   - 1 to 3 trending relevant hashtags.
   - Also provide an optional 2-part mini thread continuation.
   - An exact visual image description prompt optimized for high-clickthrough Twitter media (16:9).

3. Instagram:
   - Visual-first storytelling caption (80 - 180 words).
   - Emotional or curious opening hook.
   - Clean spacing with dots/line breaks.
   - Strong interactive CTA (e.g. "Save this for later", "Double tap if you agree", "Drop your thoughts below").
   - A dedicated cluster of 12-18 highly targeted niche, community, and trending hashtags.
   - An exact visual image description prompt optimized for aesthetic Instagram feed imagery (1:1 square or 4:3).

Tone requirement: Strictly adhere to "${effectiveTone}".
${targetAudience ? `Target audience: ${targetAudience}` : ''}
Tone styles:
- 'professional': Authoritative, polished, strategic, data/experience-backed.
- 'witty': Clever, self-aware, subtle irony, humorous analogies, memorable punchlines.
- 'urgent': High energy, time-sensitive, FOMO, direct imperatives, immediate value.`;

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: `Idea/Topic to transform: "${idea}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            linkedin: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedRatio: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
              },
              required: ['hook', 'body', 'callToAction', 'hashtags', 'imagePrompt'],
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                tweet: { type: Type.STRING },
                hook: { type: Type.STRING },
                threadContinuation: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                characterCount: { type: Type.INTEGER },
                recommendedRatio: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
              },
              required: ['tweet', 'hook', 'hashtags', 'imagePrompt'],
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hook: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedRatio: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
              },
              required: ['caption', 'hook', 'callToAction', 'hashtags', 'imagePrompt'],
            },
          },
          required: ['themeTitle', 'linkedin', 'twitter', 'instagram'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error generating social content:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate cross-platform content. Please verify your GEMINI_API_KEY.',
    });
  }
});

// 2. Generate Platform-Specific Image with Aspect Ratio & Size Controls
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      platform = 'linkedin',
      aspectRatio = '16:9',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      style = 'Studio Minimalist',
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image generation.' });
    }

    // Supported aspect ratios in Gemini
    const validRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    const chosenSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';

    // Model name selection
    // Note: The prompt asks for `gemini-3-pro-image-preview` and `gemini-nano-banana-2.1`
    const targetModel = model === 'gemini-nano-banana-2.1' ? 'gemini-nano-banana-2.1' : 'gemini-3-pro-image-preview';

    const enhancedPrompt = `${prompt}. Style: ${style}. Clean professional composition, high aesthetic appeal, suitable for ${platform} social media post. No unwanted watermark or text artifacts.`;

    let generatedImageUrl: string | null = null;
    let modelUsed = targetModel;
    let isFallback = false;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenRatio as any,
            imageSize: chosenSize as any,
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (apiErr: any) {
      console.warn(`Primary image model ${targetModel} attempt failed:`, apiErr?.message);
      // Try alternate model (gemini-3-pro-image or gemini-nano-banana-2.1)
      const fallbackModel = targetModel === 'gemini-3-pro-image-preview' ? 'gemini-nano-banana-2.1' : 'gemini-3-pro-image-preview';
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: fallbackModel,
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: chosenRatio as any,
              imageSize: chosenSize as any,
            },
          },
        });

        if (fallbackResponse.candidates?.[0]?.content?.parts) {
          for (const part of fallbackResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
              modelUsed = fallbackModel;
              break;
            }
          }
        }
      } catch (fallbackErr: any) {
        console.warn('Fallback image generation also failed. Supplying styled dynamic SVG graphic:', fallbackErr?.message);
        generatedImageUrl = generateFallbackSvg(prompt, platform, chosenRatio);
        isFallback = true;
      }
    }

    if (!generatedImageUrl) {
      generatedImageUrl = generateFallbackSvg(prompt, platform, chosenRatio);
      isFallback = true;
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      aspectRatio: chosenRatio,
      imageSize: chosenSize,
      modelUsed,
      isFallback,
      prompt: enhancedPrompt,
    });
  } catch (err: any) {
    console.error('Fatal error in image route:', err);
    return res.status(500).json({
      error: err.message || 'Image generation failed.',
    });
  }
});

// 3. Fast Refine / Quick Edit with gemini-3.1-flash-lite or gemini-3.5-flash
app.post('/api/refine-content', async (req, res) => {
  try {
    const {
      platform,
      content,
      action, // 'shorten' | 'punch_hook' | 'add_emojis' | 'fix_grammar' | 'viral_hashtags' | 'translate' | 'remix_tone'
      params = {},
    } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    // gemini-3.1-flash-lite for rapid text manipulations
    const model = 'gemini-3.1-flash-lite';

    let actionPrompt = '';
    switch (action) {
      case 'shorten':
        actionPrompt = `Shorten this ${platform} post by approximately 30-40% while preserving the core insight, hook, and call-to-action. Return ONLY the refined post text.`;
        break;
      case 'punch_hook':
        actionPrompt = `Make the opening hook of this ${platform} post 3x more compelling, curious, and scroll-stopping. Retain the rest of the message. Return ONLY the refined post text.`;
        break;
      case 'add_emojis':
        actionPrompt = `Naturally incorporate taste-appropriate emojis throughout this ${platform} post to improve scanability and visual structure without being spammy. Return ONLY the refined post text.`;
        break;
      case 'fix_grammar':
        actionPrompt = `Proofread and polish this ${platform} post for immaculate grammar, high clarity, and natural flow. Return ONLY the refined post text.`;
        break;
      case 'viral_hashtags':
        actionPrompt = `Analyze this ${platform} post and generate the best 10-15 hyper-relevant, high-reach viral hashtags. Append or replace the existing hashtags cleanly. Return ONLY the refined post text.`;
        break;
      case 'translate':
        actionPrompt = `Translate this entire ${platform} post into ${params.targetLanguage || 'Spanish'} with native fluency, cultural nuance, and appropriate platform terminology. Return ONLY the translated post text.`;
        break;
      case 'remix_tone':
        actionPrompt = `Rewrite this ${platform} post with a distinct ${params.targetTone || 'witty and punchy'} tone. Return ONLY the rewritten post text.`;
        break;
      default:
        actionPrompt = `Refine and improve this ${platform} post for maximum engagement. Return ONLY the refined post text.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: `${actionPrompt}\n\nOriginal Post:\n"""\n${content}\n"""`,
    });

    return res.json({
      success: true,
      refinedContent: response.text?.trim() || content,
      action,
    });
  } catch (err: any) {
    console.error('Error in refine content:', err);
    return res.status(500).json({ error: err.message || 'Failed to refine content.' });
  }
});

// 4. Strategic Content Audit & Audience Fit using gemini-3.1-pro-preview
app.post('/api/audit-content', async (req, res) => {
  try {
    const { idea, tone, posts } = req.body;

    if (!posts) {
      return res.status(400).json({ error: 'Posts object is required for audit.' });
    }

    const systemInstruction = `You are a world-class social media strategist and viral content analyst.
Conduct a rigorous audit of this cross-platform content package across LinkedIn, Twitter/X, and Instagram.
Evaluate each post for:
1. Hook strength & stopping power.
2. Platform algorithm fit & readability.
3. Call-to-action effectiveness.
4. Tone consistency with "${tone || 'intended tone'}".
5. Virality potential (0-100 score).

Provide high-impact, actionable feedback.`;

    const contents = `Core Idea: "${idea}"
Intended Tone: "${tone}"

LinkedIn Post:
${posts.linkedin || 'N/A'}

Twitter Post:
${posts.twitter || 'N/A'}

Instagram Post:
${posts.instagram || 'N/A'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            viralIndex: { type: Type.STRING },
            platformAudits: {
              type: Type.OBJECT,
              properties: {
                linkedin: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    hookCritique: { type: Type.STRING },
                    topStrength: { type: Type.STRING },
                    actionableTip: { type: Type.STRING },
                  },
                  required: ['score', 'hookCritique', 'topStrength', 'actionableTip'],
                },
                twitter: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    hookCritique: { type: Type.STRING },
                    topStrength: { type: Type.STRING },
                    actionableTip: { type: Type.STRING },
                  },
                  required: ['score', 'hookCritique', 'topStrength', 'actionableTip'],
                },
                instagram: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    hookCritique: { type: Type.STRING },
                    topStrength: { type: Type.STRING },
                    actionableTip: { type: Type.STRING },
                  },
                  required: ['score', 'hookCritique', 'topStrength', 'actionableTip'],
                },
              },
              required: ['linkedin', 'twitter', 'instagram'],
            },
            generalRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['overallScore', 'viralIndex', 'platformAudits', 'generalRecommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, audit: parsed });
  } catch (err: any) {
    console.error('Audit failed:', err);
    return res.status(500).json({ error: err.message || 'Audit failed.' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

// Start Full-stack Express with Vite
async function startServer() {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
