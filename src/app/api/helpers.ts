import {
  HumanTaskEntry,
  HumanExecutor,
  HumanTaskTemplate,
} from "@io-orkes/conductor-javascript";

export const assignTaskAndClaim = async (
  executor: HumanExecutor,
  taskId: string,
  assignee: string
): Promise<HumanTaskEntry> => {
  return await executor.claimTaskAsExternalUser(taskId!, assignee);
};

export const findTasks = async (
  executor: HumanExecutor,
  assignee: string
): Promise<HumanTaskEntry[]> => {
  try {
    const tasks = await executor.pollSearch({
      states: ["ASSIGNED", "IN_PROGRESS"],
      assignees: [{ userType: "EXTERNAL_USER", user: assignee }],
    });
    return tasks;
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const findTaskAndClaim = async (
  executor: HumanExecutor,
  assignee: string
): Promise<HumanTaskEntry | null> => {
  const tasks = await findTasks(executor, assignee);
  if (tasks.length > 0) {
    const [firstTask] = tasks;
    const taskId = firstTask?.taskId;
    if (taskId != null) {
      if (firstTask.state === "IN_PROGRESS") {
        return executor.getTaskById(taskId);
      }

      try {
        return await assignTaskAndClaim(executor, taskId, assignee);
      } catch (e) {
        return executor.getTaskById(taskId);
      }
    }
  }
  return null;
};

export const findFirstTaskInProgress = async (
  executor: HumanExecutor,
  assignee: string
): Promise<HumanTaskEntry | null> => {
  const tasks = await executor.search({
    states: ["IN_PROGRESS"],
    assignees: [{ userType: "EXTERNAL_USER", user: assignee }],
  });
  if (tasks.length > 0) {
    const task = tasks[0];
    return task;
  }
  return null;
};

export const getClaimedAndUnClaimedTasksForAssignee = async (
  humanExecutor: HumanExecutor
): Promise<HumanTaskEntry[]> => {
  const tasks = await humanExecutor.search({
    states: ["IN_PROGRESS", "ASSIGNED"],
  });

  return tasks;
};

export const omitStartsWithUnderscore = (obj: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith("_")));

export const taskDefaultValues = (maybeTask?: HumanTaskEntry | null) => ({
  ...omitStartsWithUnderscore(maybeTask?.input || {}),
  ...(maybeTask?.output || {}),
});

/**
 *************
 */

export const findHumanTasksByRole = async (
  executor: HumanExecutor,
  role: string
): Promise<HumanTaskEntry[]> => {
  const tasks = await executor.pollSearch({
    states: ["ASSIGNED", "IN_PROGRESS"],
    assignees: [{ userType: "EXTERNAL_GROUP", user: role }],
  });
  return tasks;
};

export const findHumanTasksByTaskId = async (
  executor: HumanExecutor,
  taskId: string
): Promise<HumanTaskEntry> => {
  const task = await executor.getTaskById(taskId);
  return task;
};

export const findHumanTemplateByTaskId = async (
  executor: HumanExecutor,
  taskId: string
): Promise<HumanTaskTemplate> => {
  const task = await executor.getTaskById(taskId);
  if (
    !task.humanTaskDef?.userFormTemplate?.name ||
    !task.humanTaskDef?.userFormTemplate?.version
  ) {
    throw new Error("No template found");
  }
  const template = executor.getTemplateByNameVersion(
    task.humanTaskDef?.userFormTemplate?.name,
    task.humanTaskDef?.userFormTemplate?.version
  );
  return template;
};
