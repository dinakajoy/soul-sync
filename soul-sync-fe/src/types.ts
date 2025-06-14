export type MoodOption = {
  label: string;
  emoji: string;
};

export const moods: MoodOption[] = [
  { label: "Happy", emoji: "😊" },
  { label: "Excited", emoji: "😄" },
  { label: "Anxious", emoji: "😟" },
  { label: "Tired", emoji: "😴" },
  { label: "Sad", emoji: "😔" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Overwhelmed", emoji: "🤯" },
  { label: "Confused", emoji: "😕" },
];

export type CheckinResponse = {
  message: string;
  affirmations: string[];
  emotion: string;
};

export type JournalResponse = {
  summary: string;
  themes: string[];
  mood: string;
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type JournalEntry = {
  _id: string;
  entry: string;
  reflection: string;
  themes: string[];
  mood: string;
  date: string;
};

export type Counts = {
  journalCount: number;
  checkInCount: number;
  syncSessionCount: number;
};

export type AllEntries = {
  journals: JournalEntry[];
  checkins: {
    _id: string;
    userId: string;
    emotion: string;
    moodEmoji: string;
    date: string;
  }[];
  syncSessions: {
    _id: string;
    theme: string;
    date: string;
  }[];
};
