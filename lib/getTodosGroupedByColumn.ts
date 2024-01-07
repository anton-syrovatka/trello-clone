import { database } from "@/appwrite";
import { TypeColumn, Column, TodoData, Board, Todo } from "@/typings";

export const getTodosGroupedByColumn = async (): Promise<Board> => {
  const data = await database.listDocuments<TodoData>(
    process.env.APPWRITE_TRELLO_DATABASE_ID!,
    process.env.APPWRITE_TRELLO_TODOS_COLLECTION_ID!
  );

  const todoDocuments = data.documents;

  const todos: Todo[] = todoDocuments.map((doc) => {
    const { image, ...rest } = doc;
    const todo: Todo = rest;

    if (image) {
      todo.image = JSON.parse(image);
    }
    return todo;
  });

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: todo.image }),
    });

    return acc;
  }, new Map<TypeColumn, Column>());

  const columnTypes: TypeColumn[] = ["todo", "in-progress", "done"];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  const sortedColumns = new Map(
    Array.from(columns.entries()).toSorted(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
