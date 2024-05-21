"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { humanTaskRenderers } from "@io-orkes/human-task-material-renderers-react";
import {
  HumanTaskEntry,
  HumanTaskTemplate,
} from "@io-orkes/conductor-javascript";
import { useMemo, useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { paths } from "@/paths";
import { materialRenderers } from "@jsonforms/material-renderers";

// export const humanTaskRenderers = [
//   ...materialRenderers,
//   { tester: DescriptionTextTester, renderer: DescriptionTextControl },
//   { tester: ImageViewerTester, renderer: ImageViewerControl },
//   { tester: VideoViewerTester, renderer: VideoViewerControl },
//   { tester: BooleanTester, renderer: BooleanControl },
//   { tester: MarkdownTextTester, renderer: MarkdownTextControl },
//   { tester: FileUploadTester, renderer: FileUploadControl },
// ];

export default function Page() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: getData, isLoading: getIsLoading } = useQuery<{
    task: HumanTaskEntry;
    template: HumanTaskTemplate;
  }>({
    queryKey: ["task"],
    queryFn: async () => {
      const response = await axios.get(`/api/tasks/${params.taskId}`);
      return response.data;
    },
    refetchOnMount: true,
    gcTime: 0,
  });

  const { mutate } = useMutation({
    mutationFn: async ({ taskId }: { taskId: string; formData: unknown }) => {
      const response = await axios.post(
        `/api/tasks/${taskId}/complete`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      router.push(paths.tasks);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      alert("Form succesfully submitted!");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert("Error: " + error.response?.data?.error);
    },
  });

  const formDataIntialState = useMemo(() => {
    const inputData = getData?.task.input || {};
    const {
      __humanTaskDefinition,
      __humanTaskProcessContext,
      _createdBy,
      ...formDataInitialState
    } = inputData;
    return formDataInitialState;
  }, [getData]);

  const [formData, setFormData] =
    useState<Record<string, any>>(formDataIntialState);
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
          renderers={humanTaskRenderers}
          onChange={({ data, errors }) => {
            setFormData(data);
            console.log("data", data);
            if (errors) {
              setFormErrors(errors);
            } else {
              setFormErrors([]);
            }
          }}
          validationMode="ValidateAndHide"
        />
        <Button
          fullWidth
          variant="contained"
          disabled={formErrors.length > 0}
          onClick={() => {
            mutate({ taskId: params.taskId, formData });
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
