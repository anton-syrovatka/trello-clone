"use client";

import React, { useEffect, useState, memo, PropsWithChildren } from "react";
import Image from "next/image";
import { DraggableProvided } from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/16/solid";

import { useBoardStore } from "@/store/BoardStore";
import { Task, TaskStatus } from "@/typings";
import getUrl from "@/lib/getUrl";

interface Props {
  id: TaskStatus;
  index: number;
  task: Task;
}

function TaskCard({ id, index, task }: Props) {
  const [deleteTask] = useBoardStore((state) => [state.deleteTask]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (task.image) {
      (async () => {
        const url = await getUrl(task.image!);

        if (url) {
          setImageUrl(url.toString());
        }
      })();
    }
  }, [task]);

  return (
    <div>
      <div className="flex justify-between items-center p-5">
        <p>{task.title}</p>
        <button
          onClick={() => deleteTask(index, task, id)}
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

interface HocProps extends DraggableProvided {
  id: TaskStatus;
  index: number;
  task: Task;
}

const TaskCardMemo = memo(TaskCard);

function TaskCardHoc({
  innerRef,
  draggableProps,
  dragHandleProps,
  ...otherProps
}: HocProps) {
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <TaskCardMemo {...otherProps} />
    </div>
  );
}

export default TaskCardHoc;
