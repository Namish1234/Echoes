import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper';

/* ── helper: extract YouTube video id from any youtube URL ── */
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

/* ── helper: call Groq (free tier — llama-3.3-70b, no CC required) ── */
async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in environment');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/* ── POST handler ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { youtubeUrl, podcastTitle } = body;

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'youtubeUrl is required' }, { status: 400 });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // 1. Fetch transcript with robust language fallbacks
    let transcriptChunks: { text: string }[] = [];
    let fetchError: unknown = null;
    let success = false;
    
    // First line of defense: youtube-captions-scraper (often more reliable for edge cases)
    const scraperFallbackLangs = ['en', 'en-IN', 'en-US', 'en-GB'];
    for (const lang of scraperFallbackLangs) {
      if (success) break;
      try {
        const captions = await getSubtitles({ videoID: videoId, lang });
        // The scraper returns an array of { text, start, dur }. Normalize it.
        transcriptChunks = captions.map((c: any) => ({ text: c.text }));
        if (transcriptChunks.length > 0) success = true;
      } catch (e) {
        fetchError = e;
      }
    }

    // Second line of defense: youtube-transcript standard library
    if (!success) {
      const ytFallbacks = ['en', 'en-US', 'en-GB', 'en-IN', 'en-CA', 'en-AU', 'a.en'];
      for (const lang of ytFallbacks) {
        try {
          transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId, { lang });
          success = true;
          break; // Stop at first successful match
        } catch (e) {
          fetchError = e;
          continue;
        }
      }
    }

    // Bare default if everything else failed
    if (!success) {
      try {
        transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId);
        success = true;
      } catch (e) {
        fetchError = e;
      }
    }

    if (!success || transcriptChunks.length === 0) {
      return NextResponse.json({ 
        error: 'Could not fetch transcript. Make sure the video has captions/subtitles enabled.',
        detail: String(fetchError)
      }, { status: 422 });
    }

    // Stitch transcript text (limit to ~12000 chars to stay within context)
    const rawTranscript = transcriptChunks.map(c => c.text).join(' ').slice(0, 12000);

    // 2. Send to Gemini for structured extraction
    const prompt = `
You are an expert podcast content analyst for the Echoes platform, a premium knowledge-centric podcast site.
Analyze the following podcast transcript and return a JSON object with this EXACT structure:

{
  "title": "A concise, compelling episode title (not just restating the topic — make it punchy and editorial)",
  "guest": "Guest name(s) or 'Solo' if it's just the host",
  "description": "1-2 sentence compelling description of the episode (max 200 chars)",
  "summary": "A 1-paragraph summary of the episode's core thesis and most important ideas (max 400 chars)",
  "tags": ["TAG1", "TAG2", "TAG3"],  // 2-5 topical tags in UPPERCASE, e.g. 'TECHNOLOGY & AI', 'BUSINESS & ECONOMICS', 'HEALTH & WELLNESS', etc.
  "accentColorHex": "#XXXXXX",  // A vibrant hex color that reflects the episode's theme (avoid plain red/green/blue — make it rich)
  "backgroundTheme": "sports|nature|business|tech|philosophy|politics|health|art|global",  // one of these keywords based on the main topic
  "centralTopic": "The core concept that ties the whole episode together (3-6 words)",
  "sixtySecond": {
    "heading": "The 60-Second Breakdown",
    "subheading": "A subtitle for this breakdown section",
    "paragraphs": [
      { "text": "First key idea of the episode, 2-3 sentences.", "imagePosition": "right" },
      { "text": "Second key idea, 2-3 sentences.", "imagePosition": "left" },
      { "text": "Third key idea, 2-3 sentences.", "imagePosition": "right" }
    ],
    "takeaway": "The single most important takeaway from this episode (1 punchy sentence)"
  },
  "keyLessons": [
    { "context": "First lesson headline, 5-8 words", "summary": "2-3 sentence explanation of this lesson" },
    { "context": "Second lesson headline", "summary": "Explanation" },
    { "context": "Third lesson headline", "summary": "Explanation" },
    { "context": "Fourth lesson headline", "summary": "Explanation" }
  ],
  "mindmapNodes": [
    { "id": "central", "label": "Central Topic Label", "category": "core", "children": ["node2", "node3", "node4"] },
    { "id": "node2", "label": "Branch 1", "category": "tech", "children": ["node5"] },
    { "id": "node3", "label": "Branch 2", "category": "biz", "children": [] },
    { "id": "node4", "label": "Branch 3", "category": "phil", "children": ["node6"] },
    { "id": "node5", "label": "Sub-branch", "category": "example", "children": [] },
    { "id": "node6", "label": "Sub-branch 2", "category": "example", "children": [] }
  ],
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"]
}

Categories for mindmap nodes:
- "core" = central/foundational ideas (orange)
- "tech" = technology/systems (blue)
- "phil" = philosophy/principles (purple)
- "biz" = business/economics (green)
- "example" = concrete examples/stories (gray)

${podcastTitle ? `This is for the podcast: "${podcastTitle}"\n` : ''}
TRANSCRIPT:
${rawTranscript}

Return ONLY valid JSON, no markdown fences, no explanation.
`.trim();

    const geminiResponse = await callGroq(prompt);

    // 3. Parse JSON from Gemini response
    let parsed: Record<string, unknown>;
    try {
      // sometimes gemini wraps in backticks
      const cleaned = geminiResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({
        error: 'AI returned invalid JSON. Please try again.',
        raw: geminiResponse.slice(0, 500)
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsed });

  } catch (err) {
    console.error('[generate-episode] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
