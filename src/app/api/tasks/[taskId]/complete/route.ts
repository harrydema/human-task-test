import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const orkesClient = await orkesConductorClient(conductorConfig);
    const humanExecutor = new HumanExecutor(orkesClient);
    await humanExecutor.completeTask(params.taskId, await request.json());
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
