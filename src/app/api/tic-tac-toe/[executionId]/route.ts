import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";
import { findTaskAndClaim } from "../../helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const client = await orkesConductorClient(conductorConfig);
    const workflowStatus = await client.workflowResource.getExecutionStatus(
      params.executionId
    );
    const humanExecutor = new HumanExecutor(client);
    const task = await findTaskAndClaim(humanExecutor, "federico@gmail.com");
    if (task != null) {
      const template = await client.humanTask.getTemplateByNameAndVersion(
        task?.humanTaskDef?.userFormTemplate?.name!,
        task?.humanTaskDef?.userFormTemplate?.version!
      );
      return Response.json({
        workflowStatus,
        task,
        template,
      });
    }
    return Response.json({
      workflowStatus,
      task: undefined,
      template: undefined,
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
