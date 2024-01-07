import { Models } from "appwrite";

type TypeColumn = "todo" | "in-progress" | "done";

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypeColumn;
  image?: Image;
}

interface TodoData extends Todo, Models.Document {
  image?: string;
}

interface Column {
  id: TypeColumn;
  todos: Todo[];
}

interface Board {
  columns: Map<TypeColumn, Column>;
}

interface Image {
  bucketId: string;
  fileId: string;
}
