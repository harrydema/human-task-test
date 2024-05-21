import type { FC } from "react";

import GuestGuard from "@/guards/guest-guard";

const withGuestGuard = <P extends object>(Component: FC<P>): FC<P> => {
  return function WithGuestGuard(props: P) {
    return (
      <GuestGuard>
        <Component {...props} />
      </GuestGuard>
    );
  };
};

export default withGuestGuard;
