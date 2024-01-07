import { TaskBoard } from "@/typings";
import formatTasksForAI from "./formatTasksForAI";

const fetchAITaskSummary = async (board: TaskBoard): Promise<string> => {
  const tasks = formatTasksForAI(board);

  const res = await fetch("/api/generateTaskSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tasks }),
  });

  const resp = await res.json();

  if (resp.error) {
    return resp.error.message;
  }

  const { content } = resp;

  return content;
};

export default fetchAITaskSummary;
