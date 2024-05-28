import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
  WorkflowExecutor,
  Task,
} from "@io-orkes/conductor-javascript";
import _last from "lodash/last";
import { NextRequest } from "next/server";
import { findTaskAndClaim } from "../../helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const client = await orkesConductorClient(conductorConfig);
    const workflowExecutor = new WorkflowExecutor(client);
    const humanExecutor = new HumanExecutor(client);
    const workflow = await workflowExecutor.getExecution(
      params.executionId,
      true
    );
    const task: Task | undefined = _last(workflow.tasks);
    if (
      task?.taskType === "HUMAN" &&
      task?.status === "IN_PROGRESS" &&
      !!task?.taskId
    ) {
      const humanTask = await humanExecutor.getTaskById(task?.taskId!);
      const template = await client.humanTask.getTemplateByNameAndVersion(
        humanTask?.humanTaskDef?.userFormTemplate?.name!,
        humanTask?.humanTaskDef?.userFormTemplate?.version!
      );
      return Response.json({
        workflow,
        task: humanTask,
        template,
      });
    }
    return Response.json({
      workflow,
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
