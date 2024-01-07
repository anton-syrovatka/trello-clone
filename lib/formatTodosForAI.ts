import { Board, Todo, TypeColumn } from "@/typings";

export default function formatTodosForAI(board: Board) {
  const todos = Array.from(board.columns.entries());

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;

    return map;
  }, {} as { [key in TypeColumn]: Todo[] });

  // const flatArrayCounted = Object.entries(flatArray).reduce(
  //   (map, [key, value]) => {
  //     map[key as TypeColumn] = value.length;

  //     return map;
  //   },
  //   {} as { [key in TypeColumn]: number }
  // );

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypeColumn] = value.map((item) => item.title);

      return map;
    },
    {} as { [key in TypeColumn]: string[] }
  );

  console.log({ flatArray, flatArrayCounted });

  return flatArrayCounted;
}
