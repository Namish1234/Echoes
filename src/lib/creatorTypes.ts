// ============================================================
// Creator Platform — Type Definitions
// All Firestore-backed types for creator podcasts & episodes
// ============================================================

/** A podcast created by a platform creator */
export interface CreatorPodcast {
  id: string;
  slug: string;
  title: string;
  host: string;
  description: string;
  accentColor: string;       // HEX like "#FF6B00"
  textOnAccent: string;      // "white" | "black" — contrast text for the accent bg
  tags: string[];
  coverImageUrl: string;
  creatorUid: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

/** An episode within a creator podcast */
export interface CreatorEpisode {
  id: string;
  slug: string;
  podcastId: string;
  number: string;
  title: string;
  guest: string;
  description: string;
  date: string;
  duration: string;
  tags: string[];
  sections: EpisodeSection[];
  status: 'draft' | 'published';
  creatorUid: string;
  createdAt: string;
  updatedAt: string;
}

// ── Section Types (each maps to a draggable block in the editor) ──

export type EpisodeSection =
  | SummarySection
  | SixtySecondSection
  | KeyLessonsSection
  | PolaroidSection
  | MindmapSection
  | QuoteSection
  | StatsSection
  | CustomTextSection;

export interface SummarySection {
  type: 'summary';
  id: string;
  content: string;  // The summary text
}

export interface SixtySecondParagraph {
  text: string;
  imageUrl: string;
  imageCaption: string;
  imagePosition: 'left' | 'right';
}

export interface SixtySecondSection {
  type: 'sixty-second';
  id: string;
  heading: string;
  subheading: string;
  paragraphs: SixtySecondParagraph[];
  takeaway: string;
}

export interface KeyLesson {
  context: string;   // Short headline
  summary: string;   // Expanded explanation
  align: 'left' | 'right' | 'center';
}

export interface KeyLessonsSection {
  type: 'key-lessons';
  id: string;
  heading: string;
  subheading: string;
  lessons: KeyLesson[];
}

export interface PolaroidImage {
  imageUrl: string;
  name: string;
  role: string;
  rotation: string;   // CSS transform like "rotate(-7deg) translateY(12px)"
}

export interface PolaroidSection {
  type: 'polaroids';
  id: string;
  heading: string;
  highlights: string[];
  images: PolaroidImage[];
}

export interface MindmapNode {
  id: string;
  label: string;
  category: 'core' | 'tech' | 'phil' | 'biz' | 'example';
  children?: string[];
}

export interface MindmapSection {
  type: 'mindmap';
  id: string;
  centralTopic: string;
  nodes: MindmapNode[];
}

export interface QuoteSection {
  type: 'quote';
  id: string;
  text: string;
  attribution: string;
}

export interface StatCard {
  label: string;
  value: string;
  description: string;
  color: string;  // HEX
}

export interface StatsSection {
  type: 'stats';
  id: string;
  cards: StatCard[];
}

export interface CustomTextSection {
  type: 'custom-text';
  id: string;
  heading: string;
  content: string;
}

// ── Comment ──

export interface EpisodeComment {
  id: string;
  episodeId: string;
  userId: string;
  userName: string;
  userAvatarId: string;
  content: string;
  createdAt: string;
  replyToId?: string;
}

// ── Analytics Event ──

export interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'scroll_depth' | 'section_view';
  page: string;
  userId?: string;
  referrer?: string;
  scrollDepth?: number;
  sectionId?: string;
  timestamp: string;
  userAgent?: string;
}

// ── Helpers ──

/** Generate a URL-friendly slug from a title */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** Generate a unique section ID */
export function generateSectionId(): string {
  return `sec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
