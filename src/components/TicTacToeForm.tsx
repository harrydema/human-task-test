"use client";
import { HumanTaskTemplate } from "@io-orkes/conductor-javascript";
import { humanTaskRenderers } from "@io-orkes/human-task-material-renderers-react";
import { JsonFormsCore, JsonSchema, UISchemaElement } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { Button } from "@mui/material";
import { useState } from "react";

interface TicTacToeFormProps {
  initialData: Record<string, any>;
  template: HumanTaskTemplate;
  onSubmit: (state: Pick<JsonFormsCore, "data" | "errors">) => void;
}

export const TicTacToeForm = ({
  initialData,
  template,
  onSubmit,
}: TicTacToeFormProps) => {
  const [formState, setFormState] = useState<
    Pick<JsonFormsCore, "data" | "errors">
  >({ data: initialData, errors: [] });
  return (
    <>
      <JsonForms
        schema={template.jsonSchema as JsonSchema}
        uischema={template.templateUI as UISchemaElement}
        data={formState?.data}
        renderers={humanTaskRenderers}
        onChange={setFormState}
        validationMode="ValidateAndHide"
      />
      <Button
        sx={{
          marginTop: 2,
        }}
        variant="contained"
        fullWidth
        onClick={() => onSubmit(formState!)}
      >
        Submit
      </Button>
    </>
  );
};
