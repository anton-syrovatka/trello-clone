"use client";

import { Task, TaskStatus } from "@/typings";
import React, { useMemo } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useModalStore } from "@/store/ModalStore";
import { useSearchStore } from "@/store/SearchStore";
import TaskCard from "./TaskCard";
import CountBadge from "./CountBadge";

const statusToTitle: {
  [key in TaskStatus]: string;
} = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

type Props = {
  id: TaskStatus;
  tasks: Task[];
  index: number;
};

function Column({ id, index, tasks }: Props) {
  const [searchTerm] = useSearchStore((state) => [state.searchTerm]);
  const [openModal, setNewTaskStatus] = useModalStore((state) => [
    state.openModal,
    state.setNewTaskStatus,
  ]);

  const handleAddTask = () => {
    setNewTaskStatus(id);
    openModal();
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return tasks;
    }

    return tasks.filter((task) =>
      task.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  }, [tasks, searchTerm]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {statusToTitle[id]}{" "}
                  <CountBadge searchTerm={searchTerm} tasks={filteredTasks} />
                </h2>

                <div className="space-y-2">
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <TaskCard
                          id={id}
                          index={index}
                          task={task}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="flex items-end justify-end">
                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={handleAddTask}
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
