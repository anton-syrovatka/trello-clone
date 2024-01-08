import { create } from "zustand";
import { TaskBoard, TaskColumn, TaskImage, Task, TaskStatus } from "@/typings";
import * as appwrite from "@/appwrite";

interface BoardState {
  board: TaskBoard;
  setBoard: (board: TaskBoard) => void;

  createTask: (
    taskTitle: string,
    columnId: TaskStatus,
    image?: File | null
  ) => Promise<void>;
  updateTask: (tasks: Task) => Promise<void>;
  deleteTask: (taskIndex: number, tasks: Task, id: TaskStatus) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TaskStatus, TaskColumn>(),
  },

  setBoard: (board: TaskBoard) => {
    set({ board });
  },

  deleteTask: async (taskIndex: number, task: Task, id: TaskStatus) => {
    const columns = get().board.columns;
    const tasks = [...columns.get(id)?.tasks];
    tasks.splice(taskIndex, 1);
    columns.get(id).tasks = tasks;

    set({
      board: { columns },
    });

    if (task.image) {
      await appwrite.deleteFile(task.image.bucketId, task.image.fileId);
    }

    await appwrite.deleteTask(task.$id);
  },

  createTask: async (
    taskTitle: string,
    columnId: TaskStatus,
    image?: File | null
  ) => {
    let file: TaskImage | undefined;

    if (image) {
      const fileUploaded = await appwrite.uploadFile(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await appwrite.createTask({
      title: taskTitle,
      status: columnId,
      image: file,
    } as Task);

    set((state) => {
      const columns = state.board.columns;
      const column = columns.get(columnId);

      const newTask: Task = {
        $id,
        $createdAt: new Date().toISOString(),
        title: taskTitle,
        status: columnId,
        ...(file && { image: file }),
      };

      if (!column) {
        columns.set(columnId, {
          id: columnId,
          tasks: [newTask],
        });
      } else {
        column.tasks = [...column.tasks, newTask];
      }

      return {
        board: { columns },
      };
    });
  },

  updateTask: async (task: Task) => {
    await appwrite.updateTask(task);
  },
}));
