# Echoes Platform — Technical Choices & Architecture Document

> This document explains every major technology decision made during the Echoes platform enhancement, including what was chosen, why, what the alternatives were, and when you'll need to change course as the platform scales.

---

## 1. Authentication — Firebase Authentication (Google Sign-In)

### What We Chose
**Firebase Authentication** with the **Google Sign-In** provider, using client-side `signInWithPopup()`.

### Why
- **Zero cost at scale**: Firebase Auth is free for up to **50,000 daily active users** and unlimited monthly Auth API calls. For a content platform, this ceiling is extremely generous.
- **Native Google integration**: Since we're using Google Sign-In, Firebase (a Google product) has first-class support with minimal code — 3 lines to trigger auth.
- **Session persistence built-in**: Firebase handles session tokens, refresh tokens, and `onAuthStateChanged` automatically — no need to manually manage JWTs, cookies, or session storage.
- **No backend server needed**: Authentication runs entirely client-side, eliminating the need for a custom auth server.

### Alternatives Considered

| Alternative | Pros | Cons | Why We Didn't Choose |
|------------|------|------|---------------------|
| **Supabase Auth** | PostgreSQL-based, SQL queries, Row Level Security | Heavier setup, 50K MAU free limit (same), requires separate hosting | Our use case is tag-based filtering, not complex SQL. Firebase's free tier is equivalent. |
| **Auth0** | Enterprise-grade, many providers | Free tier limited to 7,000 MAU, complex pricing at scale | Too expensive for a startup. Firebase gives 7x the free users. |
| **NextAuth.js** | Self-hosted, no vendor lock-in | Requires your own database, more code to write, session management is manual | Adds significant complexity without clear benefit at this stage. |
| **Clerk** | Excellent DX, pre-built UI components | $0.02/MAU beyond free tier (500 users), vendor lock-in | Cost becomes non-trivial quickly (e.g., 10K users = $200/mo). |

### Drawbacks
- **Vendor lock-in**: Migrating away from Firebase Auth means rebuilding the auth flow.
- **Client-side only (current setup)**: No server-side session validation. If you need SSR-protected routes, you'd add Firebase Admin SDK on the server.
- **Google-only**: We currently only support Google Sign-In. Adding email/password or other OAuth providers (GitHub, Twitter) is trivial with Firebase but not yet implemented.

### When to Re-evaluate
- **Beyond 50K DAU**: Still free, but consider if you need server-side session management.
- **Multi-tenant / enterprise features**: Switch to Auth0 or Clerk.

---

## 2. Database — Cloud Firestore (Firebase)

### What We Chose
**Cloud Firestore** — a NoSQL document database from Firebase.

### Why
- **Free tier**: 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day — more than enough for user profiles and episode interactions.
- **Real-time sync**: Firestore can push data changes to the client in real-time (useful for future features like live feed updates).
- **Simple data model**: Our data is user profiles (document per user) + episode metadata. This maps perfectly to Firestore's document model.
- **Tag-based querying**: Firestore supports `array-contains` queries, perfect for matching user interest tags to episode tags.
- **Zero infrastructure**: No database server to manage, no connection pooling, no migrations.

### Alternatives Considered

| Alternative | Pros | Cons | Why We Didn't Choose |
|------------|------|------|---------------------|
| **Supabase (PostgreSQL)** | Full SQL, complex joins, Row Level Security | Requires SQL knowledge, 500MB free storage, connection limits | Overkill for our document-based data model. |
| **MongoDB Atlas** | Flexible schema, good for documents | 512MB free tier, requires connection string management | Firebase Firestore integrates better with Firebase Auth (same ecosystem). |
| **PlanetScale (MySQL)** | SQL, branching for schema changes | 1 billion row reads/no free tier for new signups | No free tier makes it unsuitable for near-zero cost. |
| **Local JSON (current approach)** | No setup, zero cost | No persistence, no user data, no personalization | Can't store user profiles or preferences. |

### Drawbacks
- **Not ideal for full-text search**: Firestore doesn't support full-text search natively. We work around this with client-side search (see Section 4).
- **NoSQL limitations**: Complex relational queries (e.g., "find all users who saved episodes from podcast X that were released before date Y") are harder.
- **Vendor lock-in**: Data export is possible but migration requires rebuilding queries.

### When to Re-evaluate
- **Beyond 1GB storage or 50K reads/day**: Upgrade to Firestore Blaze plan (pay-as-you-go, very cheap).
- **Complex analytics needed**: Add a read-replica in PostgreSQL for analytics queries.

---

## 3. Frontend Framework — Next.js 16 (App Router)

### What We Chose
**Next.js 16** with the **App Router**, **TypeScript**, and **Tailwind CSS 4**.

### Why
This was inherited from the existing project. It remains an excellent choice because:
- **SSR + SSG + Client Components**: Pages that don't need auth (landing, podcasts, episodes) can be statically generated for zero-latency loads. Authenticated pages use client components.
- **Dynamic imports / code splitting**: `next/dynamic` lets us load heavy components (FeedPage, LandingPage, InteractiveMindmap) only when needed.
- **React Compiler** (`reactCompiler: true` in config): Automatically optimizes re-renders without manual `useMemo`/`useCallback`.
- **TypeScript**: Catches bugs at compile time, especially important for the complex user profile data model.

### Performance Optimizations Implemented
1. **Dynamic imports**: Home page uses `next/dynamic` to code-split LandingPage and FeedPage — visitors don't download feed code, logged-in users don't download landing code.
2. **Intersection Observer**: Episode cards in the feed load in batches of 6 as the user scrolls.
3. **Loading skeletons**: Placeholder UI renders instantly while data loads.
4. **Static pages**: Pages without auth (episode detail, podcast listings) remain server-rendered for SEO.

---

## 4. Search Architecture — Client-Side Pre-Built Index (FlexSearch)

### What We Chose
**FlexSearch** — a lightweight, memory-efficient full-text search library. The index is built at build time and loaded lazily when the user interacts with the search input.

### How It Works
1. **Build time**: All transcript text is processed into a compressed search index → saved as `/public/search-index.json`
2. **Runtime**: Index is **NOT loaded on page load**. It's fetched only when the user focuses the search input.
3. **Search**: Runs entirely client-side against the loaded index — instant results, zero server cost.
4. **Data**: Raw transcripts are never sent for search purposes — only the compressed index (~60-80% smaller).

### Why FlexSearch Over Alternatives

| Alternative | Pros | Cons | Why We Didn't Choose |
|------------|------|------|---------------------|
| **Algolia** | Best-in-class search, typo tolerance, faceting | Free tier: 10K searches/mo, then $1/1K searches | Adds recurring cost. Not needed at current data volume. |
| **Elasticsearch** | Industry standard for large datasets | Requires a server, minimum ~$35/mo on Elastic Cloud | Way too heavy for our current scale. |
| **Fuse.js** | Zero config, fuzzy matching | Slower than FlexSearch for large datasets, no index serialization | FlexSearch is 10-50x faster on large text corpora. |
| **Meilisearch** | Fast, self-hosted, good DX | Requires a server instance | Unnecessary infrastructure cost. |

### Scaling Thresholds

| Episodes | Approx Index Size (gzipped) | Verdict |
|----------|----------------------------|---------|
| ~25 (current) | ~200-400 KB | ✅ Perfectly fine |
| ~100-500 | ~1-3 MB | ⚠️ Works, slightly slower first search load |
| ~2,000+ | ~10 MB+ | 🚫 Migrate to server-side search |

### When to Migrate
Once the search index exceeds **~5 MB gzipped**, switch to:
1. **Algolia** (free tier: 10K searches/mo) — best DX, instant deployment
2. **Firebase Cloud Function + FlexSearch** — run the same search logic server-side, pay only for function invocations
3. **Meilisearch on Railway/Fly.io** — self-hosted, ~$5/mo

The search UI component (`SearchInput`) is designed to be **backend-agnostic** — only the data-fetching layer needs to change.

---

## 5. User Avatars — Preset SVG System

### What We Chose
**50 preset geometric SVG avatars** generated programmatically in `src/lib/avatars.ts`.

### Why
- **Zero storage cost**: Avatars are SVG strings, not uploaded images. No blob storage needed.
- **Design consistency**: All avatars use the same color palette and geometric aesthetic as the site.
- **Instant rendering**: SVGs render at any size without quality loss, no image optimization needed.
- **Tiny footprint**: All 50 avatars combined are ~8KB of JavaScript — no network requests.

### Alternatives Considered

| Alternative | Pros | Cons | Why We Didn't Choose |
|------------|------|------|---------------------|
| **User-uploaded photos** | Personal, familiar | Requires blob storage (~$0.023/GB on S3), moderation, resizing pipeline | Storage costs grow, moderation burden, data privacy concerns. |
| **DiceBear/Boring Avatars** | Algorithmic, unique per user | External dependency, less design control | We wanted avatars that match the zine aesthetic exactly. |
| **Emoji-based** | Zero cost, universal | Limited expression, feels cheap | Doesn't match the premium feel of the platform. |

### When to Re-evaluate
If users strongly request custom photo uploads, use **Firebase Storage** (5 GB free) with image resizing via **Firebase Extensions**.

---

## 6. State Management — React Context + Firestore

### What We Chose
A single **React Context** (`AuthContext.tsx`) that provides auth state and user profile to all components.

### Why
- **Simplicity**: For a content platform with a single shared state (user profile), Context is the right tool. Redux/Zustand would be over-engineering.
- **Firebase integration**: The context wraps `onAuthStateChanged` (Firebase's built-in session persistence), so the app automatically knows when a user signs in or out.
- **Optimistic updates**: Profile changes (save episode, change avatar) update local state immediately, then sync to Firestore.

### When to Re-evaluate
- **Complex client-side state**: If you add features like real-time chat, collaborative features, or complex caching, consider **Zustand** or **TanStack Query**.
- **Multiple contexts**: If you end up with 4+ context providers, consolidate with a state management library.

---

## 7. CSS Architecture — Tailwind CSS 4 + CSS Custom Properties

### Dark Mode Strategy
- **CSS custom properties** (`--grid-line`, `--grid-line-inv`, `--page-bg`, etc.) toggle between light and dark values.
- **Class-based dark mode**: The `.dark` class on `<html>` activates dark overrides. Persisted in `localStorage` (`echoes-theme`).
- **Grid fix**: All background grid patterns use `var(--grid-line)` instead of hardcoded `#000`, so grids appear as white lines on dark backgrounds.

### Why Not System Preference?
The user explicitly toggles dark mode via the theme toggle button. We don't follow `prefers-color-scheme` because:
1. Users may want dark mode on the site even if their OS is in light mode (or vice versa).
2. Podcast content platforms often have strong aesthetic preferences that override system settings.

---

## Cost Summary

| Service | Current Cost | Free Tier Limit | Upgrade Cost |
|---------|-------------|-----------------|--------------|
| Firebase Auth | **$0** | 50K DAU | Pay-as-you-go |
| Cloud Firestore | **$0** | 1GB, 50K reads/day | ~$0.06/100K reads |
| FlexSearch (client-side) | **$0** | Unlimited | N/A |
| Preset Avatars (SVG) | **$0** | Unlimited | N/A |
| Next.js (Vercel hosting) | **$0** | 100GB bandwidth | $20/mo Pro |
| **Total** | **$0/mo** | | |

---

## File Architecture Summary

```
src/
├── app/
│   ├── page.tsx              ← Conditional: Landing (visitors) / Feed (logged-in)
│   ├── layout.tsx            ← Root layout with AuthProvider
│   ├── onboarding/page.tsx   ← 10-step questionnaire
│   ├── profile/page.tsx      ← User profile, saved episodes, settings
│   └── [existing pages...]   ← Podcasts, episodes, archives, etc.
├── components/
│   ├── Navbar.tsx             ← Auth-aware, mobile hamburger, user dropdown
│   ├── FeedPage.tsx           ← Curated feed with lazy loading
│   ├── LandingPage.tsx        ← Original homepage (for visitors)
│   ├── SaveButton.tsx         ← Episode bookmark toggle
│   ├── Providers.tsx          ← Client-side context wrapper
│   └── [existing components]
└── lib/
    ├── firebase.ts            ← Firebase app initialization
    ├── AuthContext.tsx         ← Auth + user profile context
    ├── avatars.ts             ← 50 preset geometric SVG avatars
    └── data.ts                ← Episode/podcast data
```
