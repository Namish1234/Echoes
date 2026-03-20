# How to Add a New Podcast Episode

This guide walks you through adding a new episode to the Echoes website — from transcript to mindmap to audio.

---

## Quick Overview

Adding an episode comes down to **3 steps**:
1. Add episode data to `src/lib/data.ts`
2. (Optional) Drop an audio file in `public/audio/`
3. Done — the page auto-generates at `/episode/{id}`

---

## Step 1: Prepare Your Transcript

Format your raw transcript into the **structured format** below. This is where the semantic highlighting magic happens.

### Transcript Format

Each line of dialogue is an object with:
- `speaker` — who's talking
- `timestamp` — when they say it (MM:SS)
- `content` — what they say, with optional **highlight tags**

### Highlight Tags

Wrap important phrases in tags to auto-color them:

| Tag | Color | Use For |
|-----|-------|---------|
| `[tech: phrase]` | Blue | Technical terms, tools, architectures |
| `[phil: phrase]` | Purple | Philosophical, ethical, abstract ideas |
| `[biz: phrase]` | Green | Business strategy, metrics, market terms |

**Example:**
```
"We need [tech: Joint Embedding Predictive Architectures] to achieve [phil: true understanding]."
```

---

## Step 2: Prepare Your Mindmap Nodes

The mindmap is an interactive 2D canvas with connected concept nodes. Define nodes like:

```typescript
{
  id: "unique-id",           // lowercase, hyphenated
  label: "Node Label",       // shown on the node
  category: "tech",          // "core" | "tech" | "phil" | "biz" | "example"
  children: ["child-id-1"]   // optional: connect to example/sub-nodes
}
```

**Category colors:**
- `core` → Orange (main themes)
- `tech` → Blue (technical concepts)
- `phil` → Purple (philosophical ideas)
- `biz` → Green (business concepts)
- `example` → Gray (real-world examples, link them as children of a parent)

---

## Step 3: Add the Episode to `data.ts`

Open `src/lib/data.ts` and add your episode object to the `episodes` array.

### Full Template

Copy this and fill in your details:

```typescript
{
  id: "ep-XX",                     // Unique ID (used in URL: /episode/ep-XX)
  number: "1",                     // Episode number
  series: "People by WTF",         // Series name (or omit for default)
  isNew: true,                     // Show "NEW" badge? Set false later
  date: "Jan 15, 2025",            // Display date
  duration: "1 hr 20 min",         // Episode length
  title: "YOUR EPISODE TITLE",     // Big bold title
  guest: "Guest Name",             // Featured guest
  description: "A short 1-2 sentence summary of the episode for card previews.",
  tags: ["TECHNOLOGY & AI"],        // Categories shown as badges
  invisibleTags: ["AI", "ML"],     // Extra tags for search (not displayed)
  transcript: "Short fallback text for episodes without structured transcripts...",
  audioSrc: "/audio/ep-XX.mp3",    // Path to audio file (see Step 4)

  // Mindmap nodes (see Step 2 above)
  mindmapNodes: [
    { id: "main-theme", label: "Main Theme", category: "core", children: ["example-1"] },
    { id: "concept-1", label: "Key Concept", category: "tech" },
    { id: "idea-1", label: "Big Idea", category: "phil" },
    { id: "strategy-1", label: "Strategy", category: "biz" },
    { id: "example-1", label: "Real Example", category: "example" },
  ],

  // Key takeaways shown in the floating sidebar
  keyLessons: [
    "First key insight from the episode.",
    "Second important takeaway.",
    "Third lesson learned.",
  ],

  // Structured transcript with semantic highlighting
  parsedTranscript: [
    {
      speaker: "Host Name",
      timestamp: "00:00",
      content: "Welcome to the show. Today we're diving into [tech: Machine Learning] and its implications for [biz: the global economy]."
    },
    {
      speaker: "Guest Name",
      timestamp: "01:15",
      content: "Thank you. The core question is whether [tech: neural networks] can achieve [phil: genuine understanding] or remain sophisticated pattern matchers."
    },
    // ... add more transcript lines
  ],

  summary: "A full paragraph summary of the episode for the episode detail page.",
  mindmapUrl: "",                  // Leave empty (we use mindmapNodes now)
  highlights: [                    // Short bullet highlights (fallback if keyLessons missing)
    "First highlight.",
    "Second highlight.",
  ]
},
```

---

## Step 4: Add Audio (Optional)

1. Place your MP3 file in: `public/audio/`
2. Name it to match the `audioSrc` field: e.g., `ep-XX.mp3`
3. The sticky audio player at the bottom of the episode page will auto-detect it
4. When audio plays, the transcript auto-scrolls to the current dialogue line

**No audio file?** The player shows a non-intrusive "Place audio in /public/audio/" message.

---

## Step 5: Verify

```bash
npm run build
```

Then visit: `http://localhost:3000/episode/ep-XX`

### Checklist
- [ ] Episode appears on the WTF/Figuring Out podcast page
- [ ] Clicking the card navigates to `/episode/ep-XX`
- [ ] Header shows correct title, guest, date, tags
- [ ] Spotify/YouTube/PDF buttons are visible
- [ ] Transcript renders with speaker names on the left
- [ ] Semantic highlights show in correct colors (blue/purple/green)
- [ ] Floating "Mindmap" button opens the interactive canvas
- [ ] Floating "Key Lessons" button shows the takeaways
- [ ] Audio player appears at the bottom (if audio file is present)

---

## One-Command Workflow (For AI Assistants)

If you're using an AI assistant (like me!), you can paste your raw transcript and say:

> "Here's the transcript for Episode X with [Guest]. Add it to the website."

The AI will:
1. Parse the transcript into the structured format
2. Auto-tag semantic highlights (`[tech:]`, `[phil:]`, `[biz:]`)
3. Generate mindmap nodes from key concepts
4. Create key lessons from the main insights
5. Add the episode to `data.ts`
6. Verify the build

**All you need to provide:** the raw transcript text and episode metadata (guest, date, duration).

---

## Future: Admin Panel

In the future, this workflow will move to an admin panel where:
- Each podcast is owned by its creator
- Creators can upload transcripts, mindmaps, and audio through a UI
- Content is moderated before going live
- The structured data is stored in a database rather than `data.ts`

For now, `data.ts` is the single source of truth.
