"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Stack } from "@mui/material";
import { paths } from "@/paths";
import useAuth from "@/hooks/use-auth";
import { Role } from "@/models/Role";

export default function Page() {
  const router = useRouter();
  const { setRole } = useAuth();
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={3}>
          <Button
            variant="contained"
            onClick={() => {
              setRole(Role.USER);
              router.push(paths.tasks);
            }}
          >
            Use as Product Owner
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setRole(Role.ADMIN);
              router.push(paths.tasks);
            }}
          >
            Use as Account Executive
          </Button>
        </Stack>
      </Box>
    </>
  );
}
