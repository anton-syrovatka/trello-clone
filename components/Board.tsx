"use client";

import { TaskBoard, TaskColumn, Task, TaskStatus } from "@/typings";
import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  const [board, fetchBoard, setBoard, updateTask] = useBoardStore((state) => [
    state.board,
    state.fetchBoard,
    state.setBoard,
    state.updateTask,
  ]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // outside the board
    if (!destination) {
      return;
    }

    // column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);
      setBoard({
        ...board,
        columns: rearrangedColumns,
      });

      return;
    }

    // type === "card"

    // insure indexes are stored as numbers 0,1,2 instead of ids with DND lib
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: TaskColumn = {
      id: startColIndex[0],
      tasks: startColIndex[1].tasks,
    };

    const finishCol: TaskColumn = {
      id: finishColIndex[0],
      tasks: finishColIndex[1].tasks,
    };

    // out of droppable
    if (!startCol || !finishCol) {
      return;
    }

    // same position in same column
    if (source.index === destination.index && startCol === finishCol) {
      return;
    }

    const newTasks = [...startCol.tasks];
    const [taskMoved] = newTasks.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // same task drag
      newTasks.splice(destination.index, 0, taskMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        tasks: newTasks,
      };

      newColumns.set(startCol.id, newCol);
      setBoard({ ...board, columns: newColumns });
    } else {
      // drag to another column
      const finishTasks = [...finishCol.tasks];
      finishTasks.splice(destination.index, 0, taskMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        tasks: newTasks,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        tasks: finishTasks,
      });

      // update DB
      updateTask(taskMoved, finishCol.id);

      // update store
      setBoard({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-4"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} index={index} tasks={column.tasks} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
