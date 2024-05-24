"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { AuthProvider } from "@/contexts/auth";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Box
          sx={{
            bgcolor: "lightgray",
            height: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#FFF",
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
              maxWidth: 600,
              margin: "0 auto",
              height: "100%",
            }}
          >
            {children}
          </Box>
        </Box>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
