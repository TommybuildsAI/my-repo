import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Role, TeamMember } from '@/types/models';
import { StorageKeys, loadJson, saveJson, removeKey } from '@/services/storage';

interface SessionValue {
  currentUser: TeamMember | null;
  role: Role | null;
  ready: boolean; // hydrated from storage
  login: (member: TeamMember) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadJson<TeamMember | null>(StorageKeys.session, null).then((stored) => {
      if (!mounted) return;
      setCurrentUser(stored);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const login = (member: TeamMember) => {
    setCurrentUser(member);
    void saveJson(StorageKeys.session, member);
  };

  const logout = () => {
    setCurrentUser(null);
    void removeKey(StorageKeys.session);
  };

  return (
    <SessionContext.Provider
      value={{ currentUser, role: currentUser?.role ?? null, ready, login, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
