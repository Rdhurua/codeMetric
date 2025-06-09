'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  email: string;
  userId: string;
} | null;

const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Auto-fetch user info from server
    fetch("/api/me",{
       method:"GET",
       credentials:"include",

    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
