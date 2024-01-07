"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { Todo, TypeColumn } from "@/typings";
import { XCircleIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import Image from "next/image";

interface Props extends DraggableProvided {
  id: TypeColumn;
  index: number;
  todo: Todo;
}

function TodoCard({ id, index, todo, ...rest }: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      (async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      })();
    }
  }, [todo]);

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...rest.draggableProps}
      {...rest.dragHandleProps}
      ref={rest.innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
