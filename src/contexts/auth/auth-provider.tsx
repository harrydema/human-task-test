import type { FC, ReactNode } from "react";
import { useCallback, useState } from "react";

import { AuthContext } from "./auth-context";
import { Role } from "@/models/Role";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>();

  const _setRole = useCallback((role?: Role) => {
    setRole(role);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole: _setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
