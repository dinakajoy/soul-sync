"use client";

import { createContext, useContext, useState } from "react";
import { IUser } from "@/types";

const UserContext = createContext<{
  user: IUser | null;
  setUser: (value: IUser) => void;
}>({ user: null, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
