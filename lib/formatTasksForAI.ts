import { TaskBoard, Task, TaskStatus } from "@/typings";

export default function formatTasksForAI(board: TaskBoard) {
  const tasks = Array.from(board.columns.entries());

  const flatArray = tasks.reduce((map, [key, value]) => {
    map[key] = value.tasks;

    return map;
  }, {} as { [key in TaskStatus]: Task[] });

  // {todo: 1, in-progress: 2: done: 5}
  // const flatArrayCounted = Object.entries(flatArray).reduce(
  //   (map, [key, value]) => {
  //     map[key as TaskStatus] = value.length;

  //     return map;
  //   },
  //   {} as { [key in TaskStatus]: number }
  // );

  // {todo: ["task1", "task2"], in-progress: []: done: []}
  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TaskStatus] = value.map((item) => item.title);

      return map;
    },
    {} as { [key in TaskStatus]: string[] }
  );

  return flatArrayCounted;
}
