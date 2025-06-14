"use client";

import { createContext, useContext, useState } from "react";

const JournalContext = createContext<{
  journal: string;
  setJournal: (value: string) => void;
}>({ journal: "", setJournal: () => {} });

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [journal, setJournal] = useState("");
  return (
    <JournalContext.Provider value={{ journal, setJournal }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => useContext(JournalContext);
