import { ID, database, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { TaskBoard, TaskColumn, TaskImage, Task, TaskStatus } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: TaskBoard;
  setBoard: (board: TaskBoard) => void;
  fetchBoard: () => void;

  createTask: (
    taskTitle: string,
    columnId: TaskStatus,
    image?: File | null
  ) => Promise<void>;
  updateTask: (tasks: Task, columnId: TaskStatus) => Promise<void>;
  deleteTask: (taskIndex: number, tasks: Task, id: TaskStatus) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TaskStatus, TaskColumn>(),
  },
  setBoard: (board: TaskBoard) => {
    set({ board });
  },

  fetchBoard: async () => {
    const board = await getTodosGroupedByColumn();
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
      await storage.deleteFile(task.image.bucketId, task.image.fileId);
    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      task.$id
    );
  },

  createTask: async (
    taskTitle: string,
    columnId: TaskStatus,
    image?: File | null
  ) => {
    let file: TaskImage | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: taskTitle,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

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

  updateTask: async (task: Task, columnId: TaskStatus) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      task.$id,
      { title: task.title, status: columnId }
    );
  },
}));
