"use client";

import { Board, Column as IColumn, Todo, TypeColumn } from "@/typings";
import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import Column from "./Column";
import { useStrictDroppable } from "@/lib/useStrictDroppable";

type UseBoardStoreType = [
  Board,
  () => void,
  (board: Board) => void,
  (todo: Todo, columnId: TypeColumn) => void
];

function Board() {
  const [dndEnabled] = useStrictDroppable(false);

  const [board, getBoard, setBoardState, updateTodoInDb] =
    useBoardStore<UseBoardStoreType>((state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDb,
    ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    console.log({ destination, source, type });
    // outside the board
    if (!destination) {
      return;
    }

    // board drag
    // if (source.droppableId === "board") {
    //   return;
    // }

    // column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // insure indexes are stored as numbers 0,1,2 instead of ids with DND lib
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];
    // const startColIndex = columns[source.index];
    // const finishColIndex = columns[destination.index];

    const startCol: IColumn = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: IColumn = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) {
      return;
    }

    if (source.index === destination.index && startCol === finishCol) {
      return;
    }

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // same task drag
      newTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      // drag to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // update DB
      updateTodoInDb(todoMoved, finishCol.id);

      // update store
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {/* {dndEnabled && ( */}
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-4"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
      {/* )} */}
    </DragDropContext>
  );
}

export default Board;
