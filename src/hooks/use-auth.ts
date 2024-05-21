import { useContext } from "react";

import type { AuthContextType as FirebaseAuthContextType } from "@/contexts/auth";
import { AuthContext } from "@/contexts/auth";

type AuthContextType = FirebaseAuthContextType;

const useAuth = <T = AuthContextType>() => useContext(AuthContext) as T;

export default useAuth;
