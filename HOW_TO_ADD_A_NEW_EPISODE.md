# How to Add a New Podcast Episode

> **Template Reference:** `src/app/episode/ep-wtf-16/page.tsx`
> Every new episode page follows this exact structure.

---

## Quick Checklist

- [ ] Add episode data to `src/lib/data.ts`
- [ ] Add guest images to `public/images/guests/`
- [ ] Extract transcript via `extract_transcripts.py`
- [ ] Create episode page folder at `src/app/episode/ep-{id}/`
- [ ] Copy and customise `page.tsx` from `ep-wtf-16`
- [ ] Create transcript sub-page at `ep-{id}/transcript/page.tsx`
- [ ] Update Spotify & YouTube links
- [ ] Test light/dark mode

---

## Step 1: Episode Data (`src/lib/data.ts`)

Add the new episode object to the `episodes` array. Place newer episodes first.

```typescript
{
  id: "ep-{slug}",              // URL slug — will be /episode/ep-{slug}
  number: "21",                 // Episode number (for display)
  series: "WTF is",             // or "People by WTF"
  isNew: true,                  // Show NEW badge (remove after a week)
  date: "Apr 2024",
  duration: "1 hr 45 min",
  title: "Your Episode Title Here",
  guest: "Guest Name 1, Guest Name 2",
  description: "A detailed 1-2 sentence description of the episode...",
  tags: ["STARTUPS & VC", "TECHNOLOGY & AI"],
  invisibleTags: ["SearchKeyword1", "SearchKeyword2"],
  transcript: "Brief transcript preview text...",
  summary: "A 1-sentence summary for the archive card.",
  mindmapUrl: defaultMindmap,
  highlights: [
    "Key insight one.",
    "Key insight two.",
    "Key insight three."
  ],
  parsedTranscript: []  // Fallback — transcript loaded from JSON at runtime
}
```

### Required Fields
| Field | Purpose |
|---|---|
| `id` | URL path: `/episode/{id}` |
| `title` | Main heading on the episode page |
| `guest` | Comma-separated guest names |
| `description` | Paragraph below the title |
| `tags` | Visible category badges |
| `highlights` | Shown as tags under "The Perspectives" |
| `summary` | Used on the archive card |

---

## Step 2: Guest Images

Place guest photos in `public/images/guests/`.

**Supported formats:** `.jpg`, `.avif`, `.png`, `.webp`

**Naming convention:** `FirstName.ext` (e.g., `Ritesh.avif`, `gazal.jpg`)

> **Tip:** Crop to a roughly square aspect ratio. The Polaroid component displays them at a fixed size with `object-cover`.

---

## Step 3: Extract Transcript

### One command:
```bash
python extract_transcripts.py "https://youtube.com/watch?v=VIDEO_ID"
```

**What it does:**
1. Downloads the YouTube auto-generated transcript (via `youtube-transcript-api`)
2. Merges short segments for readability
3. Saves to **both** `transcripts/{VIDEO_ID}.json` **and** `public/transcripts/{VIDEO_ID}.json`

The transcript page (`/episode/ep-{id}/transcript`) automatically loads from `public/transcripts/{VIDEO_ID}.json` at runtime.

**Prerequisites:**
```bash
pip install youtube-transcript-api
```

**Output format:**
```json
{
  "videoId": "FPV5fAkqyBs",
  "lineCount": 2793,
  "transcript": [
    {
      "speaker": "Unknown",
      "timestamp": "00:00",
      "content": "Welcome to another episode..."
    }
  ]
}
```

> **Note:** YouTube transcripts have "Unknown" as the speaker. You can manually label speakers in the JSON file if desired.

---

## Step 4: Create the Episode Page

### Folder Structure
```
src/app/episode/
  ep-wtf-16/          ← TEMPLATE (copy this folder)
    page.tsx           ← Main episode page
    transcript/
      page.tsx         ← Deep-dive transcript page
```

### Copy the template
```
1. Copy the entire `ep-wtf-16` folder
2. Rename to `ep-{your-id}` (must match the `id` in data.ts)
3. Customise page.tsx with episode-specific content
```

---

## Step 5: Customise `page.tsx`

Below is every section you need to modify, in order.

### 5.1 — Episode ID

```tsx
const episode = episodes.find(ep => ep.id === 'ep-{YOUR-ID}');
```

### 5.2 — Guests Array (Polaroid Scrapbook)

```tsx
const guests = [
  { name: "Guest Name", role: "Company", rotation: "rotate(-7deg) translateY(12px)", image: "/images/guests/name.jpg" },
];
```

#### Handling Different Guest Counts

| Guests | Layout | Rotation Strategy |
|---|---|---|
| **1** | Single centred Polaroid | `rotate(-3deg)` |
| **2** | Side by side, slight overlap | `-5deg`, `+4deg` |
| **3** | Overlapping trio | `-7deg`, `+3deg`, `-4deg` |
| **4** (default) | Overlapping quad with `md:-space-x-4` | `-7deg`, `+4deg`, `-4deg`, `+7deg` |
| **5+** | Wrap to 2 rows, reduce Polaroid size | Alternate `-5deg` to `+5deg`, add `scale-90` to `<Polaroid>` |

**For 5+ guests**, adjust the container:
```tsx
<div className="flex flex-row justify-center items-center gap-0 flex-wrap relative z-10 w-full max-w-5xl mx-auto">
```
And add `scale-90` or `scale-[0.85]` to each Polaroid wrapper.

### 5.3 — Lessons (Unpack the Lessons)

```tsx
const extendedLessons = [
  {
    context: "One-line summary of the lesson",
    summary: "2-3 sentence detailed explanation...",
    align: 'left' as const   // Pattern: left, right, left, right, center
  },
];
```

**Alignment pattern (ladder layout):**
- 3 lessons: `left`, `right`, `center`
- 4 lessons: `left`, `right`, `left`, `center`
- 5 lessons: `left`, `right`, `left`, `right`, `center`

### 5.4 — Episode Breakdown (Stats Cards)

Update the three stat cards: Duration, Themes count, Companies/People count.

### 5.5 — Notable Quote

Pick the most impactful quote from the episode:

```tsx
<blockquote>Your powerful quote here.</blockquote>
<p>— Speaker Name, Company</p>
```

### 5.6 — The Episode in 60 Seconds (Summary)

This is the **magazine-style summary** with inline Polaroid images.

> **CRITICAL:** Do NOT just use generic AI summaries. You must **manually read the deeply extracted transcript JSON** and derive specific, authentic insights and real quotes for these paragraphs. The quality of this section is paramount.

**Structure (based on ep-18):**
1. **Paragraph 1** — Left-floating image, Guest 1's key point (with quote)
2. **Paragraph 2** — Right-floating image, Guest 2's key point (with quote)
3. **Paragraph 3** — Left-floating image, Guest 3's key point
4. **Paragraph 4** — Right-floating image, Guest 4's key point
5. **Paragraph 5** — Left-floating image, Host/Additional point
6. **"The Takeaway" box** — 1-sentence conclusion

**Keyword highlighting colors:**
| Color | Hex | Use For |
|---|---|---|
| Orange | `#FF6B00` | Core traits, key "flaws", abstract concepts |
| Purple | `#8B5CF6` | Psychological concepts, algorithms, hierarchy |
| Green | `#22C55E` | Positive outcomes, solutions, authenticity |
| Blue | `#3B82F6` | Technical terms, achievements, consistency |
| Pink | `#EC4899` | Virality, vulnerability, emotions |

Apply via:
```tsx
<span className="font-extrabold" style={{ color: '#FF6B00' }}>keyword</span>
```

**For 1-2 guests:** Reduce to 2-3 paragraphs with alternating left/right images.
**For 3+ guests:** Ensure 1 paragraph per guest, plus host if relevant.

### 5.7 — Recommended Episodes ("If You Liked This")

```tsx
const recommendedEpisodes = [
  {
    id: 'ep-03',
    title: 'Related Episode Title',
    guest: 'Guest Name',
    description: 'Short description...',
    tags: ['TAG'],
  },
  // List 3 related episodes
];
```

### 5.8 — Spotify & YouTube Links

```tsx
<a href="https://open.spotify.com/episode/YOUR_ID" ...>Spotify</a>
<a href="https://youtu.be/YOUR_VIDEO_ID" ...>YouTube</a>
```

---

## Step 6: Transcript Sub-Page

Copy from `ep-wtf-16/transcript/page.tsx` and update:

1. Episode ID: `episodes.find(ep => ep.id === 'ep-{YOUR-ID}')`
2. Fetch URL: `fetch('/transcripts/{YOUR_VIDEO_ID}.json')`
3. Back link: `<Link href="/episode/ep-{YOUR-ID}">← Back</Link>`

**Built-in features:** Real-time search, line-saving, optional notes, light/dark mode.

---

## Visual Design Reference

### Section Order (top to bottom)
```
1. Header (title, tags, date, Spotify/YouTube)
   ···· dotted divider ····
2. The Perspectives (highlights + Polaroid scrapbook)
   ···· dotted divider ····
3. Unpack the Lessons (ladder layout)
   ···· dotted divider ····
4. Episode Breakdown (3 stats cards)
   ···· dotted divider ····
5. Notable Quote
6. The Episode in 60 Seconds (inline images + keyword highlights)
   ···· dotted divider ····
7. If You Liked This (3 recommended episodes)
```

### Dividers (dotted, never solid)
```tsx
<div className="w-full max-w-6xl mx-auto px-6 py-2">
  <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)', opacity: 0.4 }}></div>
</div>
```

### Floating Deep Dive FAB
Bottom-right `+` button → opens slide-out tray → Transcript link + Mind Map.

### Color System (CSS variables, auto light/dark)
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--surface`, `--page-bg`
- `--border-color`, `--border-subtle`
- `--color-wtf-orange` = `#FF6B00`

---

## Full Workflow Example

```bash
# 1. Extract transcript
python extract_transcripts.py "https://youtube.com/watch?v=abc123"

# 2. Add guest image to public/images/guests/

# 3. Add episode data to src/lib/data.ts

# 4. Copy template
# Copy src/app/episode/ep-wtf-16/ → src/app/episode/ep-{new-id}/
# Update all episode-specific content

# 5. Test
npm run dev
# Visit http://localhost:3000/episode/ep-{new-id}
# Check light mode + dark mode
```

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Polaroids overflow on mobile | Add `flex-wrap`, reduce scale |
| Transcript shows "Unknown" | Manual — YouTube transcripts don't have speaker labels |
| Dark mode text invisible | Use `var(--text-primary)` not hardcoded colors |
| Images not loading | Path must start with `/images/guests/` |
| extract_transcripts.py fails | Run `pip install youtube-transcript-api` |
