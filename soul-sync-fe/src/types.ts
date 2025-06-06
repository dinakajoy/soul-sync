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
  { label: "frustrated", emoji: "😤" },
  { label: "overwhelmed", emoji: "🤯" },
  { label: "confused", emoji: "😕" },
];

export type CheckinResponse = {
  message: string;
  affirmations: string[];
  emotion: string;
};
