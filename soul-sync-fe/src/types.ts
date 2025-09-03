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

export type IPredictionResult = {
  predictedClass: string;
  probabilities: {
    [key: string]: number;
  };
};

export type IFormData = {
  age: string;
  family_history: "Yes" | "No";
  work_interfere: string;
  no_employees: string;
  remote_work: "Yes" | "No";
  leave: string;
  obs_consequence: "Yes" | "No";
  gender: string;
  benefits: string;
  care_options: string;
  wellness_program: string;
  seek_help: string;
  anonymity: string;
  mental_vs_physical: string;
};

export type IInputData = {
  age: number;
  family_history: number;
  work_interfere: number;
  no_employees: number;
  remote_work: number;
  leave: number;
  obs_consequence: number;
  gender_Male: number;
  gender_Other: number;
  benefits_No: number;
  benefits_Yes: number;
  "care_options_Not sure": number;
  care_options_Yes: number;
  wellness_program_No: number;
  wellness_program_Yes: number;
  seek_help_No: number;
  seek_help_Yes: number;
  anonymity_No: number;
  anonymity_Yes: number;
  mental_vs_physical_No: number;
  mental_vs_physical_Yes: number;
};
