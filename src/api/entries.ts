import type { DiaryEntry } from '@/types/entry';
import { request, resolveUrl } from './client';

function withFullPhotoUrl(entry: DiaryEntry): DiaryEntry {
  return entry.photoUrl ? { ...entry, photoUrl: resolveUrl(entry.photoUrl) } : entry;
}

export async function getEntries() {
  const entries = await request<DiaryEntry[]>('/api/entries');
  return entries.map(withFullPhotoUrl);
}
