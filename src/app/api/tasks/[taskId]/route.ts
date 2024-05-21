import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
} from "@io-orkes/conductor-javascript";
import { NextRequest } from "next/server";
import {
  findHumanTasksByTaskId,
  findHumanTemplateByTaskId,
} from "../../helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const orkesClient = await orkesConductorClient(conductorConfig);
    const humanExecutor = new HumanExecutor(orkesClient);
    const task = await findHumanTasksByTaskId(humanExecutor, params.taskId);
    const template = await findHumanTemplateByTaskId(
      humanExecutor,
      params.taskId
    );
    return Response.json({
      task,
      template,
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
