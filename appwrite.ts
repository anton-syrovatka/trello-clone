import { Client, ID, Databases, Storage } from "appwrite";
import { Task, TaskData, TaskStatus } from "./typings";

const projectId = process.env.NEXT_PUBLIC_APPWRITE_TRELLO_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_TRELLO_DATABASE_ID!;
const collectionId =
  process.env.NEXT_PUBLIC_APPWRITE_TRELLO_TODOS_COLLECTION_ID!;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_TRELLO_BUCKET_ID!;

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(projectId);

const database = new Databases(client);
const storage = new Storage(client);

export { client, database, storage, ID };

// Collection

export function getAllTasks() {
  return database.listDocuments<TaskData>(databaseId, collectionId);
}

export function createTask(task: Task) {
  return database.createDocument<TaskData>(
    databaseId,
    collectionId,
    ID.unique(),
    {
      title: task.title,
      status: task.status,
      ...(task.image && { image: JSON.stringify(task.image) }),
    }
  );
}

export function updateTask(task: Task) {
  return database.updateDocument(databaseId, collectionId, task.$id, {
    title: task.title,
    status: task.status,
  });
}

export function deleteTask(taskId: string) {
  return database.deleteDocument(databaseId, collectionId, taskId);
}

// Storage

export function uploadFile(file: File) {
  return storage.createFile(bucketId, ID.unique(), file);
}

export function deleteFile(bucketId: string, fileId: string) {
  return storage.deleteFile(bucketId, fileId);
}
