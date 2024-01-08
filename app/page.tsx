import * as appwrite from "@/appwrite";
import Board from "@/components/Board";
import Header from "@/components/Header";
import { createBoard } from "@/lib/createBoard";

export default async function Home() {
  const result = await appwrite.getAllTasks();
  const board = createBoard(result.documents);

  return (
    <main>
      <Header />
      <Board boardData={board} />
    </main>
  );
}
