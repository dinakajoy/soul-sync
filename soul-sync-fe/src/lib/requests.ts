export const fetchCounts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/counts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch counts");
  return res.json();
};

export const fetchAllData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch all data");
  return res.json();
};

export const postCheckin = async ({
  moodEmoji,
  emotion,
  reflection,
}: {
  moodEmoji: string;
  emotion: string;
  reflection: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/check-in`,
    {
      method: "POST",
      body: JSON.stringify({ moodEmoji, emotion, reflection }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to submit check-in");
  return res.json();
};

export const fetchJournals = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/journal`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch counts");
  return res.json();
};

export const postJournal = async ({ entry }: { entry: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/journal`, {
    method: "POST",
    body: JSON.stringify({
      entry,
    }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to submit check-in");
  return res.json();
};

export const postSync = async ({
  theme,
  currentQuestion,
  userResponse,
}: {
  theme: string;
  currentQuestion: string;
  userResponse: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sync`, {
    method: "POST",
    body: JSON.stringify({
      theme,
      currentQuestion,
      userResponse,
    }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to submit sync");
  return res.json();
};

export const postTrackSync = async ({ theme }: { theme: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/track-sync`,
    {
      method: "POST",
      body: JSON.stringify({ theme }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      keepalive: true,
    }
  );

  if (!res.ok) throw new Error("Failed to track sync");
  return res.json();
};
