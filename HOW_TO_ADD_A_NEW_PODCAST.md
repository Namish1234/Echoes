# 🎙️ How To Add a New Podcast Page to Echoes

A complete, beginner-friendly guide. Follow every step from top to bottom.

---

## 📋 Overview — What You'll Do

Adding a new podcast requires changes to **6 files**. Here's the full checklist:

| # | File | What You Do |
|---|------|-------------|
| 1 | `src/lib/data.ts` | Add podcast info + episode data |
| 2 | `src/app/YOUR-PODCAST/page.tsx` | Create the podcast page (NEW FILE) |
| 3 | `src/app/podcasts/page.tsx` | Add a card on the "All Podcasts" listing |
| 4 | `src/components/Footer.tsx` | Add a link in the footer |
| 5 | `src/app/page.tsx` | Add a card in the homepage "Our Catalog" section |
| 6 | `src/app/collections/[category]/page.tsx` | Add routing so archive links work |

Let's go step by step.

---

## 🎨 Before You Start — Pick Your Colors

Every podcast has its own **accent color**. This color is used everywhere — buttons, badges, guest names, borders, the About section, etc.

Examples from existing podcasts:
- **WTF Podcast** → Orange (`text-wtf-orange`, `bg-wtf-orange`, `#F97316`)
- **Figuring Out** → Blue (`text-[#3B82F6]`, `bg-[#3B82F6]`, `#3B82F6`)

Pick your color and note down:
- Your HEX code, e.g. `#10B981` (green)
- Your Tailwind class will be `bg-[#10B981]` and `text-[#10B981]`

---

## STEP 1 — Add Your Podcast Data

**File:** `src/lib/data.ts`

### 1A. Add to the `podcasts` array

Find the `podcasts` array (near the top of the file). Add your new podcast object:

```typescript
// Inside the podcasts array, add this:
{
  id: "your-podcast-slug",           // ← URL-friendly name (lowercase, dashes)
  title: "Your Podcast Name",
  host: "Host Name",
  description: "A one-line description of the show.",
  coverColor: "bg-[#10B981]",        // ← Your accent color as a Tailwind bg class
  textColor: "text-wtf-white",       // ← Text color that contrasts your coverColor
  tags: ["Business", "Tech", "Life"] // ← Category tags
},
```

### 1B. Create your episodes array

Below the existing episode arrays, add a new exported array:

```typescript
export interface YourPodcastEpisode {
  id: string;
  number: string;
  isNew?: boolean;
  date: string;
  duration: string;
  title: string;
  guest: string;
  description: string;
  tags: string[];
}

export const yourPodcastEpisodes: YourPodcastEpisode[] = [
  {
    id: "yp-01",
    number: "01",
    isNew: true,                               // ← Set true for the latest episode only
    date: "Mar 15, 2026",
    duration: "1 hr 20 min",
    title: "The First Episode Title",
    guest: "Guest Name",
    description: "A short description of what this episode covers.",
    tags: ["BUSINESS", "TECHNOLOGY"]           // ← Must match your ALL_CATEGORIES list
  },
  {
    id: "yp-02",
    number: "02",
    date: "Mar 01, 2026",
    duration: "55 min",
    title: "Second Episode Title",
    guest: "Another Guest",
    description: "Description for episode 2.",
    tags: ["LEADERSHIP", "PSYCHOLOGY"]
  },
  // ... add as many episodes as you need
];
```

> **TIP:** The `tags` inside each episode must exactly match the category names you'll define in your page's `ALL_CATEGORIES` array (Step 2). Spelling and case must be identical.

---

## STEP 2 — Create Your Podcast Page (THE BIG ONE)

**File:** `src/app/your-podcast-slug/page.tsx` **(NEW FILE)**

Create a new folder inside `src/app/` using your podcast's URL slug (same as the `id` from Step 1), and create `page.tsx` inside it.

For example: `src/app/your-podcast-slug/page.tsx`

Copy the **entire template below** and then change the items marked with `// ← CHANGE THIS`:

```tsx
'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { yourPodcastEpisodes } from '@/lib/data';                     // ← CHANGE THIS: import your episodes

// ← CHANGE THIS: List the filter categories that match your episode tags
const ALL_CATEGORIES = ["ALL", "BUSINESS", "TECHNOLOGY", "LEADERSHIP", "PSYCHOLOGY", "LIFE"];

// Wrapper component (required for useSearchParams to work in Next.js)
export default function YourPodcastPageWrapper() {                     // ← CHANGE THIS: rename
  return (
    <Suspense fallback={null}>
      <YourPodcastPage />
    </Suspense>
  );
}

function YourPodcastPage() {                                           // ← CHANGE THIS: rename
  // === BACK BUTTON LOGIC (DO NOT CHANGE THIS) ===
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'archives' ? '/archives' : '/podcasts';
  const backLabel = from === 'archives' ? '← Back to Archives' : '← Back to Podcasts';

  // === STATE (DO NOT CHANGE THIS) ===
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef<HTMLDivElement>(null);

  // === FILTER EPISODES (change the import name only) ===
  const filteredEpisodes = yourPodcastEpisodes.filter((ep) => {        // ← CHANGE THIS: your array name
    const matchCategory = activeCategory === "ALL" || ep.tags.includes(activeCategory);
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      searchLower === "" ||
      ep.title.toLowerCase().includes(searchLower) ||
      ep.description.toLowerCase().includes(searchLower) ||
      ep.guest.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const visibleEpisodes = filteredEpisodes.slice(0, visibleCount);
  const hasMore = visibleEpisodes.length < filteredEpisodes.length;

  // === INFINITE SCROLL (DO NOT CHANGE THIS) ===
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setVisibleCount(prev => prev + 4);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [handleObserver]);

  // =================================================================
  //  EVERYTHING BELOW IS THE VISUAL LAYOUT — CHANGE COLORS & TEXT
  // =================================================================

  return (
    <div className="w-full">

      {/* ============================================================ */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="zine-border bg-wtf-white shadow-zine-lg p-8 md:p-16 relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Decorative shapes (optional — change colors to match your accent) */}
          <div className="absolute z-[5] w-3 h-3 bg-[#10B981] border border-wtf-black top-12 right-[20%] rotate-[30deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          {/*                        ↑ CHANGE COLOR                                        */}
          <div className="absolute z-[5] w-4 h-4 bg-wtf-orange border border-wtf-black bottom-20 left-[15%] rotate-[55deg] hidden md:block"></div>
          <div className="absolute z-[5] w-5 h-1 bg-wtf-black top-[35%] right-[10%] rotate-[45deg] hidden md:block"></div>
          <div className="absolute z-[5] w-3 h-3 bg-[#10B981] border border-wtf-black bottom-[30%] right-[25%] rotate-[15deg] hidden md:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          {/*                        ↑ CHANGE COLOR                                        */}

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b-4 border-wtf-black pb-12 mb-12">
            <div className="flex flex-col items-start">
              {/* Back button (DO NOT CHANGE — this is automatic) */}
              <Link href={backHref} className="inline-block bg-wtf-orange text-wtf-black px-3 py-1 text-xs font-bold mb-4 tracking-widest uppercase border-2 border-wtf-black shadow-[2px_2px_0px_#000]">
                {backLabel}
              </Link>
              <div className="inline-block bg-wtf-black text-wtf-white px-3 py-1 text-xs font-bold mb-6 tracking-widest uppercase">
                Digital Archive Series
              </div>

              {/* ← CHANGE THIS: Your podcast title */}
              <h1 className="text-6xl md:text-[8rem] font-black leading-none uppercase tracking-tighter">
                Your<br/><span className="text-[#10B981]">Podcast.</span>
                {/*                    ↑ CHANGE COLOR    ↑ CHANGE NAME */}
              </h1>
            </div>

            <div className="max-w-md">
              {/* ← CHANGE THIS: Your one-line description */}
              <p className="text-xl md:text-2xl font-bold mb-8 leading-snug">
                A short, punchy description of the podcast. Hosted by Host Name.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* ← CHANGE COLOR on the button */}
                <button className="zine-border bg-[#10B981] text-wtf-white px-8 py-4 font-bold uppercase tracking-widest shadow-zine zine-button text-sm">
                  Explore Episodes
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar — CHANGE ALL 4 VALUES */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 font-bold uppercase tracking-widest text-sm">
            <div className="flex-1 border-l-4 border-[#10B981] pl-4">
              {/*                       ↑ CHANGE COLOR */}
              <span className="opacity-50 block mb-1">Host</span>
              <span className="text-xl">Host Name</span>
              {/*                       ↑ CHANGE */}
            </div>
            <div className="flex-1 border-l-4 border-[#10B981] pl-4">
              <span className="opacity-50 block mb-1">Episodes</span>
              <span className="text-xl">50+</span>
              {/*                       ↑ CHANGE */}
            </div>
            <div className="flex-1 border-l-4 border-[#10B981] pl-4">
              <span className="opacity-50 block mb-1">Focus</span>
              <span className="text-xl">Topic Area</span>
              {/*                       ↑ CHANGE */}
            </div>
            <div className="flex-1 border-l-4 border-[#10B981] pl-4">
              <span className="opacity-50 block mb-1">Reach</span>
              <span className="text-xl">100K+ / Month</span>
              {/*                       ↑ CHANGE */}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* EPISODE EXPLORER — Search bar and category filter pills       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="flex flex-col border-b-4 border-wtf-black pb-4 gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Episodes ({filteredEpisodes.length})</h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {ALL_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setVisibleCount(4); }}
                    className={`zine-border px-6 py-1 font-bold rounded-full text-sm transition-colors ${
                      activeCategory === category
                        ? 'bg-[#10B981] text-wtf-white border-[#10B981]'
                        /*  ↑ CHANGE BOTH COLORS (active pill color) */
                        : 'bg-wtf-white text-wtf-black hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search episodes, guests..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(4); }}
                  className="zine-border pl-4 pr-10 py-2 w-full md:w-72 font-bold outline-none focus:ring-2 focus:ring-[#10B981] bg-wtf-white"
                  {/*                                                              ↑ CHANGE COLOR */}
                />
                <svg className="absolute right-3 top-3 h-5 w-5 text-wtf-black opacity-50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* EPISODE GRID — This renders all the episode cards              */}
      {/* Change the accent color for "New" badge and guest name text   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleEpisodes.length > 0 ? (
          visibleEpisodes.map(ep => (
            <div key={ep.id} className="zine-border bg-wtf-white shadow-zine p-6 flex flex-col hover:-translate-y-1 hover:shadow-zine-lg transition-all">
              <div className="border-b-2 border-wtf-black pb-4 mb-4">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{ep.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {ep.isNew && <span className="bg-[#10B981] text-wtf-white text-[10px] font-bold px-2 py-0.5 uppercase">New</span>}
                    {/*                    ↑ CHANGE COLOR for "New" badge */}
                    <span className="bg-wtf-black text-wtf-white text-xs font-bold px-2 py-0.5">YP {ep.number}</span>
                    {/*                                                                           ↑ CHANGE PREFIX (2-letter code for your podcast) */}
                  </div>
                </div>
                <span className="text-sm font-bold text-[#10B981] uppercase tracking-widest">with {ep.guest}</span>
                {/*                           ↑ CHANGE COLOR for guest name */}
              </div>
              <p className="font-medium leading-relaxed mb-6 flex-1">{ep.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
                {ep.tags.map(tag => (
                  <span key={tag} className="border-2 border-wtf-black px-2 py-0.5">{tag}</span>
                ))}
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-black text-wtf-white">{ep.duration}</span>
                <span className="border-2 border-wtf-black px-2 py-0.5 bg-wtf-cream">{ep.date}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-2xl font-black uppercase mb-2">No episodes found</h3>
            <p className="font-medium opacity-70">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
              className="mt-6 zine-border bg-[#10B981] text-wtf-white px-6 py-2 font-bold uppercase shadow-zine zine-button"
              {/*                    ↑ CHANGE COLOR */}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>


      {/* ============================================================ */}
      {/* INFINITE SCROLL TARGET (DO NOT CHANGE)                        */}
      {/* ============================================================ */}
      <div ref={observerTarget} className="w-full h-20 -mt-10 mb-20 flex items-center justify-center">
        {hasMore && (
           <span className="font-bold text-wtf-black uppercase tracking-widest animate-pulse zine-border px-8 py-3 bg-wtf-white shadow-zine inline-block">
             Loading episodes...
           </span>
        )}
      </div>


      {/* ============================================================ */}
      {/* ABOUT THE HOST SECTION — CHANGE ALL TEXT & COLORS             */}
      {/* ============================================================ */}
      <section className="bg-wtf-black text-wtf-white py-24 border-t-4 border-wtf-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black uppercase mb-8 leading-none tracking-tighter italic">
              About the <br /><span className="text-[#10B981]">Host.</span>
              {/*                           ↑ CHANGE COLOR */}
            </h2>

            {/* ← CHANGE ALL 3 PARAGRAPHS: Write the host's bio */}
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Paragraph 1: Who is the host? Background, credentials, achievements.
            </p>
            <p className="text-lg leading-relaxed mb-6 opacity-80">
              Paragraph 2: What is the podcast about? When was it launched? What makes it unique?
            </p>
            <p className="text-lg leading-relaxed mb-10 opacity-80">
              Paragraph 3: What is the mission / vision of the podcast?
            </p>

            {/* Notable guests list — CHANGE NAMES */}
            <div className="border-t-2 border-[#10B981] pt-8">
              {/*                    ↑ CHANGE COLOR */}
              <p className="font-bold uppercase tracking-widest text-sm mb-6">Notable Guests</p>
              <div className="flex flex-wrap gap-3">
                {["Guest 1", "Guest 2", "Guest 3", "Guest 4", "Guest 5"].map((guest) => (
                  <span key={guest} className="border-2 border-wtf-white px-3 py-1 text-sm font-bold uppercase tracking-widest">
                    {guest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vision / Mission card — CHANGE ALL */}
          <div className="flex-1 w-full">
            <div className="zine-border bg-[#10B981] p-10 shadow-zine rotate-1">
              {/*                    ↑ CHANGE COLOR */}
              <h4 className="text-wtf-white font-black text-2xl mb-4 uppercase">The Show Vision</h4>
              {/*  ↑ CHANGE TEXT COLOR if your bg is light */}
              <ul className="space-y-4 text-wtf-white font-bold">
                {/* ↑ CHANGE TEXT COLOR if your bg is light */}
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#10B981] px-2 py-0.5">01</span> Vision point 1.
                  {/*                       ↑ CHANGE COLOR */}
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#10B981] px-2 py-0.5">02</span> Vision point 2.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#10B981] px-2 py-0.5">03</span> Vision point 3.
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-wtf-white text-[#10B981] px-2 py-0.5">04</span> Vision point 4.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## STEP 3 — Add a Card on the "/podcasts" Page

**File:** `src/app/podcasts/page.tsx`

Find the closing `</Link>` of the last podcast card (the "Figuring Out" card), and **add a new card block** right below it (but before the `</div>` that closes the `flex flex-col gap-12`):

```tsx
          {/* YOUR NEW PODCAST */}
          <Link href="/your-podcast-slug?from=podcasts" className="group">
            {/*        ↑ CHANGE: your folder name */}
            <article className="zine-border bg-wtf-white shadow-zine-lg hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex flex-col md:flex-row overflow-hidden">
              <div className="bg-[#10B981] text-wtf-white p-10 md:p-16 flex items-center justify-center relative overflow-hidden w-full md:w-[400px] shrink-0">
                {/*       ↑ CHANGE COLOR                                            */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <h3 className="relative z-10 text-6xl font-black uppercase tracking-tighter text-center">Your<br/><span className="text-wtf-black">Podcast</span></h3>
                {/*  ↑ CHANGE TITLE. The <span> color should contrast the bg color */}
              </div>
              <div className="p-8 md:p-12 flex flex-col flex-1 justify-center">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tag1</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tag2</span>
                  <span className="border-2 border-wtf-black px-2 py-0.5 text-[10px] font-bold uppercase">Tag3</span>
                  {/* ↑ CHANGE: your podcast topic tags */}
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tight mb-3">Your Podcast Name</h4>
                {/*                                                                   ↑ CHANGE */}
                <p className="font-medium text-lg opacity-80 leading-relaxed mb-6">
                  Hosted by <span className="font-black">Host Name</span>. One-line description of the show.
                  {/*                                     ↑ CHANGE ALL TEXT */}
                </p>
                <div className="flex justify-between items-center border-t-2 border-dashed border-wtf-black pt-4">
                  <span className="font-black uppercase text-sm tracking-widest">50 Episodes</span>
                  {/*                                                              ↑ CHANGE COUNT */}
                  <span className="font-black text-[#10B981] group-hover:text-wtf-black transition-colors text-lg">EXPLORE →</span>
                  {/*                       ↑ CHANGE COLOR */}
                </div>
              </div>
            </article>
          </Link>
```

Also update the "Active Shows" count at the top of that file. Find this line:
```tsx
<h2 className="text-2xl ...">
  {podcasts.filter(p => p.id === 'wtf-podcast' || p.id === 'figuring-out').length} Active Shows
</h2>
```
Add your new podcast ID to the filter:
```tsx
{podcasts.filter(p => p.id === 'wtf-podcast' || p.id === 'figuring-out' || p.id === 'your-podcast-slug').length} Active Shows
```

---

## STEP 4 — Add a Link in the Footer

**File:** `src/components/Footer.tsx`

Find the "Explore" list and add your podcast:

```tsx
<li><Link className="hover:text-wtf-orange" href="/your-podcast-slug">Your Podcast Name</Link></li>
```

Add it below the existing podcast links (after the "Figuring Out" line).

---

## STEP 5 — Add a Card on the Homepage

**File:** `src/app/page.tsx`

Find the "Our Catalog" section. There's a grid with cards for WTF, Figuring Out, and a "Coming Soon" placeholder. Replace the "Coming Soon" card with your new podcast card, or add another card. Match the style of the existing ones.

---

## STEP 6 — Update the Collections Routing

**File:** `src/app/collections/[category]/page.tsx`

Find this line (the link for podcast routing):

```tsx
<Link href={
  podcast.id === 'wtf-podcast' ? '/wtf?from=archives'
  : podcast.id === 'figuring-out' ? '/figuring-out?from=archives'
  : '#'
} ...>
```

Add your new podcast:

```tsx
<Link href={
  podcast.id === 'wtf-podcast' ? '/wtf?from=archives'
  : podcast.id === 'figuring-out' ? '/figuring-out?from=archives'
  : podcast.id === 'your-podcast-slug' ? '/your-podcast-slug?from=archives'
  : '#'
} ...>
```

---

## ✅ Final Checklist

After making all changes, verify everything works:

1. **Build the project:**
   ```bash
   npm run build
   ```
   This must finish with 0 errors. If you see red text, read the error and fix it.

2. **Test these routes in your browser:**
   - `http://localhost:3000/your-podcast-slug` → Your new podcast page
   - `http://localhost:3000/podcasts` → Your card should appear here
   - Click your card → Should go to your page with "← Back to Podcasts" button
   - Click "← Back to Podcasts" → Should return to `/podcasts`
   - Check the footer → Your podcast link should be there
   - Go to `/archives` → Click your podcast → Should show "← Back to Archives"

3. **Common issues:**
   - **"Module not found"** → Check your import path in `page.tsx` matches the export name in `data.ts`
   - **Categories don't filter** → The tags in your episodes must EXACTLY match the `ALL_CATEGORIES` array (case-sensitive)
   - **"useSearchParams should be wrapped in Suspense"** → Make sure you have the wrapper component pattern (the `PageWrapper` function)
   - **Back button always says "Podcasts"** → Make sure the link that takes you to your podcast page includes `?from=archives` or `?from=podcasts`

---

## 📁 Quick Reference — All the Colors to Change

Every podcast has ONE accent color used in these places:

| Location | What to change |
|----------|---------------|
| Hero title `<span>` | `text-[#YOUR_COLOR]` |
| Shape decorations | `bg-[#YOUR_COLOR]` |
| "Explore Episodes" button | `bg-[#YOUR_COLOR]` |
| Stats bar borders | `border-[#YOUR_COLOR]` |
| Category filter (active pill) | `bg-[#YOUR_COLOR] border-[#YOUR_COLOR]` |
| Search input focus ring | `focus:ring-[#YOUR_COLOR]` |
| "New" episode badge | `bg-[#YOUR_COLOR]` |
| Guest name text | `text-[#YOUR_COLOR]` |
| "Clear Filters" button | `bg-[#YOUR_COLOR]` |
| About section "Host." text | `text-[#YOUR_COLOR]` |
| Notable guests border | `border-[#YOUR_COLOR]` |
| Vision card background | `bg-[#YOUR_COLOR]` |
| Vision card number badges | `text-[#YOUR_COLOR]` |
| Podcasts page card panel | `bg-[#YOUR_COLOR]` |
| Podcasts page "EXPLORE →" | `text-[#YOUR_COLOR]` |

**Total: ~15 places.** Just find-and-replace `#10B981` with your chosen color hex.

---

## 🎉 That's It!

You now have a complete podcast page with:
- ✅ Hero section with title, description, back button, stats
- ✅ Category filters + search bar
- ✅ Episode cards with guest names, tags, duration, dates
- ✅ Infinite scroll (loads 4 more episodes as you scroll)
- ✅ About the Host section with bio and vision card
- ✅ Context-aware back navigation (Podcasts ↔ Archives)
- ✅ Linked from the Podcasts listing, Footer, Homepage, and Collections

Happy building! 🚀
