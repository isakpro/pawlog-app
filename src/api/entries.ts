import type { DiaryEntry, EntryRequest } from '@/types/entry';
import { request, resolveUrl } from './client';

const jsonHeaders = { 'Content-Type': 'application/json' };

function withFullPhotoUrl(entry: DiaryEntry): DiaryEntry {
  return entry.photoUrl ? { ...entry, photoUrl: resolveUrl(entry.photoUrl) } : entry;
}

export async function getEntries() {
  const entries = await request<DiaryEntry[]>('/api/entries');
  return entries.map(withFullPhotoUrl);
}

export async function createEntry(entry: EntryRequest) {
  const created = await request<DiaryEntry>('/api/entries', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(entry),
  });
  return withFullPhotoUrl(created);
}
