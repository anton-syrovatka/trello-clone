import { ID, database, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { Board, Column, Image, Todo, TypeColumn } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypeColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (text: string) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypeColumn) => void;

  addTask: (todo: string, columnId: TypeColumn, image?: File | null) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskType: TypeColumn;
  setNewTaskType: (columnId: TypeColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board: Board) => {
    set({ board });
  },

  newTaskInput: "",
  setNewTaskInput: (text: string) => {
    set({ newTaskInput: text });
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypeColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({
      board: {
        columns: newColumns,
      },
    });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await database.deleteDocument(
      process.env.APPWRITE_TRELLO_DATABASE_ID!,
      process.env.APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  addTask: async (todo: string, columnId: TypeColumn, image?: File | null) => {
    let file: Image | undefined;

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
      process.env.APPWRITE_TRELLO_DATABASE_ID!,
      process.env.APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  updateTodoInDb: async (todo: Todo, columnId: TypeColumn) => {
    await database.updateDocument(
      process.env.APPWRITE_TRELLO_DATABASE_ID!,
      process.env.APPWRITE_TRELLO_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },

  searchString: "",
  setSearchString: (searchString: string) => set({ searchString }),

  newTaskType: "todo",
  setNewTaskType: (columnId: TypeColumn) => set({ newTaskType: columnId }),

  image: null,
  setImage: (image: File | null) => set({ image }),
}));
