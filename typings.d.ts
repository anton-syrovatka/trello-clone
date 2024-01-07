import { Models } from "appwrite";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  $id: string;
  $createdAt: string;
  title: string;
  status: TaskStatus;
  image?: TaskImage;
}

interface TaskData extends Task, Models.Document {
  image?: string;
}

interface TaskColumn {
  id: TaskStatus;
  tasks: Task[];
}

interface TaskBoard {
  columns: Map<TaskStatus, Column>;
}

interface TaskImage {
  bucketId: string;
  fileId: string;
}
