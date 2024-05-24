import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  WorkflowExecutor,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const orkesClient = await orkesConductorClient(conductorConfig);
    const workflowExecutor = new WorkflowExecutor(orkesClient);
    await workflowExecutor.terminate(params.executionId, "Game ended by user");
    return Response.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
