import { TaskBoard, Task, TaskStatus } from "@/typings";

export default function formatTodosForAI(board: TaskBoard) {
  const todos = Array.from(board.columns.entries());

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;

    return map;
  }, {} as { [key in TaskStatus]: Task[] });

  // const flatArrayCounted = Object.entries(flatArray).reduce(
  //   (map, [key, value]) => {
  //     map[key as TaskStatus] = value.length;

  //     return map;
  //   },
  //   {} as { [key in TaskStatus]: number }
  // );

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TaskStatus] = value.map((item) => item.title);

      return map;
    },
    {} as { [key in TaskStatus]: string[] }
  );

  console.log({ flatArray, flatArrayCounted });

  return flatArrayCounted;
}
