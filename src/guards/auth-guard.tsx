import type { ReactNode } from "react";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/use-auth";
import { paths } from "@/paths";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;
  const router = useRouter();
  const { role } = useAuth();
  const [checked, setChecked] = useState<boolean>(false);

  const check = useCallback(() => {
    if (!role) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      const href = paths.index + `?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [role, router]);

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(
    () => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

export default memo(AuthGuard);
