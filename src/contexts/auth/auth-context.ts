import { Role } from "@/models/Role";
import { createContext } from "react";

export interface AuthContextType {
  role?: string;
  setRole: (role?: Role) => void;
}

export const AuthContext = createContext<AuthContextType>({
  setRole: () => {},
});
