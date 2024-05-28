import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
  WorkflowExecutor,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";

export async function POST() {
  try {
    const orkesClient = await orkesConductorClient(conductorConfig);
    const workflowExecutor = new WorkflowExecutor(orkesClient);
    const response = await workflowExecutor.startWorkflow({
      name: "pablo-tic-tac-toe",
      version: 2,
    });
    return Response.json({
      executionId: response,
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
