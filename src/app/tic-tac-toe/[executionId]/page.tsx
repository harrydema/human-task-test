"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  HumanTaskEntry,
  HumanTaskTemplate,
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
    const inputData = getData?.task?.input || {};
    const {
      __humanTaskDefinition,
      __humanTaskProcessContext,
      _createdBy,
      ...formDataInitialState
    } = inputData;
    return formDataInitialState;
  }, [getData]);

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
          disabled={formErrors.length > 0}
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
          disabled={formErrors.length > 0}
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
