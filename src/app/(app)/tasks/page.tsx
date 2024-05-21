"use client";

import React, { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import useAuth from "@/hooks/use-auth";
import { HumanTaskEntry } from "@io-orkes/conductor-javascript";
import moment from "moment";

export default function Page() {
  const router = useRouter();
  const { role } = useAuth();
  const { data, isLoading } = useQuery<{
    tasks: HumanTaskEntry[];
  }>({
    queryKey: [`tasks/${role}`],
    queryFn: async () => {
      const response = await axios.get(`/api/tasks`, {
        params: {
          role,
        },
      });
      return response.data;
    },
    refetchOnMount: true,
    gcTime: 0,
  });
  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!data) {
    return null;
  }
  if (data.tasks.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">No tasks found</Typography>
      </Box>
    );
  }
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {data.tasks.map((task, index) => (
        <Fragment key={task.taskId}>
          <ListItemButton
            onClick={() => {
              router.push(`/tasks/${task.taskId}`);
            }}
          >
            <ListItem alignItems="flex-start">
              <ListItemText
                // @ts-ignore
                primary={task.displayName}
                secondary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {task.state}
                    </Typography>
                    {` - ${moment(task.createdOn).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}`}
                  </>
                }
              />
            </ListItem>
          </ListItemButton>
          {index < data.tasks.length - 1 && <Divider />}
        </Fragment>
      ))}
    </List>
  );
}
