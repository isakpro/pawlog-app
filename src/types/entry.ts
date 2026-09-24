export interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  story: string;
  trainingGoal: string;
  goalCompleted: boolean;
  photoUrl: string | null;
}

export type EntryRequest = Omit<DiaryEntry, 'id' | 'photoUrl'>;
