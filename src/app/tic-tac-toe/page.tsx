"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import axios, { AxiosError } from "axios";
import { paths } from "@/paths";

export default function Page() {
  const router = useRouter();

  const { mutate: startGame } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/tic-tac-toe`);
      return response.data;
    },
    onSuccess: (response) => {
      router.push(`${paths.newTicTacToe}/${response.executionId}`);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert("Error: " + error.response?.data?.error);
    },
  });

  return (
    <Box
      sx={{
        padding: 2,
      }}
    >
      <Button
        sx={{
          mt: 2,
        }}
        fullWidth
        variant="contained"
        color="success"
        onClick={() => {
          startGame();
        }}
      >
        Start new game
      </Button>
    </Box>
  );
}
