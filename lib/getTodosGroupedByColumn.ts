import { database } from "@/appwrite";
import { TaskStatus, TaskColumn, TaskData, TaskBoard, Task } from "@/typings";

export const getTodosGroupedByColumn = async (): Promise<TaskBoard> => {
  const data = await database.listDocuments<TaskData>(
    process.env.NEXT_PUBLIC_APPWRITE_TRELLO_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_TRELLO_TODOS_COLLECTION_ID!
  );

  const taskDocuments = data.documents;

  const tasks: Task[] = taskDocuments.map((doc) => {
    const { image, ...rest } = doc;
    const task: Task = rest;

    if (image) {
      task.image = JSON.parse(image);
    }
    return task;
  });

  const columns = tasks.reduce((acc, task) => {
    if (!acc.get(task.status)) {
      acc.set(task.status, {
        id: task.status,
        tasks: [],
      });
    }

    acc.get(task.status)!.tasks.push({
      $id: task.$id,
      $createdAt: task.$createdAt,
      title: task.title,
      status: task.status,
      ...(task.image && { image: task.image }),
    });

    return acc;
  }, new Map<TaskStatus, TaskColumn>());

  const columnTypes: TaskStatus[] = ["todo", "in-progress", "done"];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        tasks: [],
      });
    }
  }

  const sortedColumns = new Map(
    Array.from(columns.entries()).toSorted(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: TaskBoard = {
    columns: sortedColumns,
  };

  return board;
};
