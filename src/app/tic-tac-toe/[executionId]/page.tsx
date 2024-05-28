"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import _mergeWith from "lodash/mergeWith";
import {
  HumanTaskEntry,
  HumanTaskTemplate,
  Workflow,
} from "@io-orkes/conductor-javascript";
import { useEffect, useMemo, useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { paths } from "@/paths";
import { humanTaskRenderers } from "@io-orkes/human-task-material-renderers-react";

export const renderers = humanTaskRenderers;

export default function Page() {
  const params = useParams<{ executionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: getData,
    isLoading: getIsLoading,
    isRefetching: getIsRefetching,
    refetch,
  } = useQuery<{
    workflow: Workflow;
    task: HumanTaskEntry;
    template: HumanTaskTemplate;
  }>({
    queryKey: ["tic-tac-toe"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/tic-tac-toe/${params.executionId}`
      );
      return response.data;
    },
    refetchOnMount: true,
    gcTime: 0,
    refetchInterval: 1000,
  });

  const { mutate: submitForm } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `/api/tic-tac-toe/${params.executionId}/complete`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert("Error: " + error.response?.data?.error);
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `/api/tic-tac-toe/${params.executionId}/terminate`
      );
      return response.data;
    },
    onSuccess: () => {
      router.push(paths.newTicTacToe);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert("Error: " + error.response?.data?.error);
    },
  });

  const formDataIntialState = useMemo(() => {
    const inputData = _mergeWith(
      {},
      {
        a1: "",
        a2: "",
        a3: "",
        b1: "",
        b2: "",
        b3: "",
        c1: "",
        c2: "",
        c3: "",
      },
      getData?.task?.input,
      (a, b) => (b === null ? a : b)
    );
    const {
      __humanTaskDefinition,
      __humanTaskProcessContext,
      _createdBy,
      ...formDataInitialState
    } = inputData;
    return formDataInitialState;
  }, [getData]);

  console.log("aaaa", formDataIntialState);

  const [formData, setFormData] = useState<Record<string, any>>();

  useEffect(() => {
    setFormData(formDataIntialState);
  }, [formDataIntialState]);

  const [formErrors, setFormErrors] = useState<any>([]);
  if (getIsLoading) {
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

  if (getData?.workflow.status === "COMPLETED") {
    if (!getData?.template) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography variant="h5">Game finished</Typography>
            {getData?.workflow?.output?.winner?.result === "draw" && (
              <Typography variant="h5">Draw</Typography>
            )}
            {getData?.workflow?.output?.winner?.result === "ai" && (
              <Typography variant="h5">AI Won!</Typography>
            )}
            {getData?.workflow?.output?.winner?.result === "human" && (
              <Typography variant="h5">You Won!</Typography>
            )}
            <Button
              sx={{
                mt: 2,
              }}
              fullWidth
              variant="contained"
              color="success"
              onClick={() => {
                router.push(paths.newTicTacToe);
              }}
            >
              Play again
            </Button>
          </Box>
        </Box>
      );
    }
  }

  if (getData?.workflow.status === "FAILED") {
    if (!getData?.template) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">Game failed</Typography>
        </Box>
      );
    }
  }

  if (getData?.workflow.status === "RUNNING" && !getData?.template) {
    if (!getData?.template) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">AI playing...</Typography>
        </Box>
      );
    }
  }

  if (!getData?.template) {
    if (!getData?.template) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">No template found</Typography>
        </Box>
      );
    }
  }

  return (
    <>
      <Box
        sx={{
          padding: 2,
        }}
      >
        <JsonForms
          schema={getData.template.jsonSchema as JsonSchema}
          uischema={getData.template.templateUI as UISchemaElement}
          data={formData}
          renderers={renderers}
          onChange={({ data, errors }) => {
            setFormData(data);
            if (errors) {
              setFormErrors(errors);
            } else {
              setFormErrors([]);
            }
          }}
          validationMode="ValidateAndHide"
        />
        <Button
          sx={{
            mt: 1,
          }}
          fullWidth
          variant="contained"
          onClick={() => {
            submitForm();
          }}
        >
          Submit
        </Button>
        <Button
          sx={{
            mt: 2,
          }}
          fullWidth
          variant="contained"
          color="error"
          onClick={() => {
            endGame();
          }}
        >
          End game
        </Button>
      </Box>
    </>
  );
}
