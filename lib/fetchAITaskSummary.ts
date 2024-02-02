import { TaskBoard } from '@/typings';
import formatTasksForAI from './formatTasksForAI';

const fetchAITaskSummary = async (board: TaskBoard): Promise<string> => {
  const tasks = formatTasksForAI(board);
  try {
    const res = await fetch('/api/generateTaskSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
    });

    const body = await res.json();

    if (res.ok) {
      const { content } = body;
      return content;
    }

    if (body?.error?.message) {
      return body.error.message;
    }
    console.error(body);

    return 'Oops, something went wrong ...';
  } catch (error) {
    console.error(error);
    return 'Oops, something went wrong ...';
  }
};

export default fetchAITaskSummary;
