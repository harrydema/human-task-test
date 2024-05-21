import { memo, type ReactNode } from "react";

import withAuthGuard from "@/hocs/with-auth-guard";
import { Box, Button, Typography } from "@mui/material";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = withAuthGuard(({ children }: DashboardLayoutProps) => {
  const { role } = useAuth();
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          position: "relative",
          bgcolor: "lightgray",
          borderBottom: "1px solid black",
          pt: 1,
          pb: 1,
        }}
      >
        <Typography textAlign="center" variant="h5">
          {role === "USER" ? "Product Owner" : "Account Executive"}
        </Typography>
        <Button
          sx={{
            position: "absolute",
            right: 2,
            top: 5,
          }}
          onClick={() => {
            router.push(paths.index);
          }}
        >
          Change Role
        </Button>
      </Box>
      <Box
        sx={{
          height: "calc(100% - 48px)",
        }}
      >
        {children}
      </Box>
    </>
  );
});

export default memo(DashboardLayout);
