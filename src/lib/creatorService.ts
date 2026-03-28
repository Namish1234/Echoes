// ============================================================
// Creator Platform — Firestore CRUD + Image Upload Service
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  CreatorPodcast,
  CreatorEpisode,
  EpisodeComment,
  AnalyticsEvent,
} from './creatorTypes';

// ── Podcast CRUD ──

export async function createPodcast(data: Omit<CreatorPodcast, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'creatorPodcasts'));
  const now = new Date().toISOString();
  const podcast: CreatorPodcast = {
    ...data,
    id: ref.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, podcast);
  return ref.id;
}

export async function updatePodcast(id: string, data: Partial<CreatorPodcast>): Promise<void> {
  const ref = doc(db, 'creatorPodcasts', id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

export async function deletePodcast(id: string): Promise<void> {
  // Delete all episodes under this podcast first
  const episodesQuery = query(
    collection(db, 'creatorEpisodes'),
    where('podcastId', '==', id)
  );
  const episodeSnap = await getDocs(episodesQuery);
  const deletePromises = episodeSnap.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // Delete the podcast itself
  await deleteDoc(doc(db, 'creatorPodcasts', id));
}

export async function getPodcast(id: string): Promise<CreatorPodcast | null> {
  const snap = await getDoc(doc(db, 'creatorPodcasts', id));
  return snap.exists() ? (snap.data() as CreatorPodcast) : null;
}

export async function getPodcastBySlug(slug: string): Promise<CreatorPodcast | null> {
  const q = query(
    collection(db, 'creatorPodcasts'),
    where('slug', '==', slug),
    where('status', '==', 'published')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as CreatorPodcast;
}

export async function getCreatorPodcasts(uid: string): Promise<CreatorPodcast[]> {
  const q = query(
    collection(db, 'creatorPodcasts'),
    where('creatorUid', '==', uid)
  );
  const snap = await getDocs(q);
  const pods = snap.docs.map(d => d.data() as CreatorPodcast);
  return pods.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllPublishedPodcasts(): Promise<CreatorPodcast[]> {
  const q = query(
    collection(db, 'creatorPodcasts'),
    where('status', '==', 'published')
  );
  const snap = await getDocs(q);
  const pods = snap.docs.map(d => d.data() as CreatorPodcast);
  return pods.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Episode CRUD ──

export async function createEpisode(data: Omit<CreatorEpisode, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'creatorEpisodes'));
  const now = new Date().toISOString();
  const episode: CreatorEpisode = {
    ...data,
    id: ref.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, episode);
  return ref.id;
}

export async function updateEpisode(id: string, data: Partial<CreatorEpisode>): Promise<void> {
  const ref = doc(db, 'creatorEpisodes', id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteEpisode(id: string): Promise<void> {
  await deleteDoc(doc(db, 'creatorEpisodes', id));
}

export async function getEpisode(id: string): Promise<CreatorEpisode | null> {
  const snap = await getDoc(doc(db, 'creatorEpisodes', id));
  return snap.exists() ? (snap.data() as CreatorEpisode) : null;
}

export async function getEpisodeBySlug(podcastId: string, slug: string): Promise<CreatorEpisode | null> {
  const q = query(
    collection(db, 'creatorEpisodes'),
    where('podcastId', '==', podcastId),
    where('slug', '==', slug)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as CreatorEpisode;
}

export async function getCreatorEpisodes(podcastId: string): Promise<CreatorEpisode[]> {
  const q = query(
    collection(db, 'creatorEpisodes'),
    where('podcastId', '==', podcastId)
  );
  const snap = await getDocs(q);
  const episodes = snap.docs.map(d => d.data() as CreatorEpisode);
  return episodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getEpisodeCount(podcastId: string): Promise<number> {
  const q = query(
    collection(db, 'creatorEpisodes'),
    where('podcastId', '==', podcastId)
  );
  const snap = await getDocs(q);
  return snap.size;
}

// ── Image Upload ──

export async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

// ── Comments ──

export async function addComment(comment: Omit<EpisodeComment, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'comments'));
  const full: EpisodeComment = {
    ...comment,
    id: ref.id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, full);
  return ref.id;
}

export async function getComments(episodeId: string): Promise<EpisodeComment[]> {
  const q = query(
    collection(db, 'comments'),
    where('episodeId', '==', episodeId)
  );
  const snap = await getDocs(q);
  const comments = snap.docs.map(d => d.data() as EpisodeComment);
  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteComment(commentId: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId));
}

// ── Analytics ──

export async function logAnalyticsEvent(event: Omit<AnalyticsEvent, 'id'>): Promise<void> {
  try {
    await addDoc(collection(db, 'analytics'), {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });
  } catch (e) {
    // Silently fail analytics — never break the user experience
    console.warn('[Analytics] Failed to log event:', e);
  }
}

export async function getAnalyticsEvents(filters?: {
  type?: string;
  page?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AnalyticsEvent[]> {
  let q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'));

  // Note: Firestore requires composite indexes for multiple where clauses
  // For the admin dashboard, we'll filter client-side for flexibility
  const snap = await getDocs(q);
  let events = snap.docs.map(d => ({ ...d.data(), id: d.id } as AnalyticsEvent));

  if (filters?.type) events = events.filter(e => e.type === filters.type);
  if (filters?.page) events = events.filter(e => e.page === filters.page);
  if (filters?.startDate) events = events.filter(e => e.timestamp >= filters.startDate!);
  if (filters?.endDate) events = events.filter(e => e.timestamp <= filters.endDate!);

  return events;
}
