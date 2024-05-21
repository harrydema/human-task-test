import type { ReactNode } from "react";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/use-auth";
import { paths } from "@/paths";

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props;
  const { role } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(false);

  const check = useCallback(() => {
    if (role) {
      router.replace(paths.tasks);
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
  // not authenticated / authorized.

  return <>{children}</>;
};

export default memo(GuestGuard);
