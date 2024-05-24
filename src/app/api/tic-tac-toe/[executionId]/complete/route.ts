import { conductorConfig } from "@/config";
import _last from "lodash/last";
import {
  orkesConductorClient,
  HumanExecutor,
  WorkflowExecutor,
  Task,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const orkesClient = await orkesConductorClient(conductorConfig);
    const workflowExecutor = new WorkflowExecutor(orkesClient);
    const humanExecutor = new HumanExecutor(orkesClient);
    const workflow = await workflowExecutor.getExecution(
      params.executionId,
      true
    );
    const lastTask: Task | undefined = _last(workflow.tasks);
    if (
      lastTask?.taskType !== "HUMAN" ||
      lastTask?.status !== "IN_PROGRESS" ||
      !lastTask?.taskId
    ) {
      throw new Error("Task can not be terminated");
    }
    await humanExecutor.completeTask(lastTask.taskId, await request.json());
    return Response.json({
      success: true,
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
