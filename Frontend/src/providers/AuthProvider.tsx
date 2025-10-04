"use client";

import { createContext, type ReactNode, useContext } from "react";

type AuthContextType = {
  is_logged_in: boolean;
};

const AuthContext = createContext<AuthContextType>({ is_logged_in: false });

export function AuthProvider({ children, is_logged_in }: { children: ReactNode; is_logged_in: boolean }) {
  return (
    <AuthContext.Provider value={{ is_logged_in }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}