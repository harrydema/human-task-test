import { conductorConfig } from "@/config";
import {
  orkesConductorClient,
  HumanExecutor,
} from "@io-orkes/conductor-javascript";
import { findHumanTasksByRole } from "../helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const role = request.nextUrl.searchParams.get("role");
    if (!role) {
      return Response.json(
        { error: "Role query param is required" },
        {
          status: 400,
        }
      );
    }
    const orkesClient = await orkesConductorClient(conductorConfig);
    const humanExecutor = new HumanExecutor(orkesClient);
    const tasks = await findHumanTasksByRole(humanExecutor, role);
    return Response.json({
      tasks,
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    throw e;
  }
}
