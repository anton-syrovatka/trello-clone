import { TaskBoard } from "@/typings";
import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: TaskBoard) => {
  return "Herr Syrovatka, welcome to Trello Clone! ";
  try {
    const todos = formatTodosForAI(board);

    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todos }),
    });

    const resp = await res.json();

    if (resp.error) {
      return resp.error.message;
    }

    const { content } = resp;

    return content;
  } catch (error) {
    return error;
  }
};

export default fetchSuggestion;
