import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Project, Task } from "../models/types";
import KanbanColumn from "./KanbanColumn";
import { api } from "../services/api";

const KanbanBoard = ({ initialProject }: { initialProject: Project }) => {
  const [data, setData] = useState<Project>(initialProject);

  useEffect(() => {
    setData(initialProject);
  }, [initialProject]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startBoard = data.boards.find(
      (b) => b.id.toString() === source.droppableId,
    );
    const finishBoard = data.boards.find(
      (b) => b.id.toString() === destination.droppableId,
    );

    if (!startBoard || !finishBoard) return;

    let movedTask: Task;

    if (startBoard === finishBoard) {
      const newTasks = Array.from(startBoard.tasks);
      [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = newTasks.map((t, idx) => ({
        ...t,
        orderIndex: idx,
      }));

      const newBoard = {
        ...startBoard,
        tasks: updatedTasks,
      };

      const newBoards = data.boards.map((b) =>
        b.id === newBoard.id ? newBoard : b,
      );

      setData({
        ...data,
        boards: newBoards,
      });

      movedTask.orderIndex = destination.index;
      movedTask.board = { id: finishBoard.id };
      api.updateTask(movedTask).catch((err) => {
        console.error("Failed to update task", err);
      });
      return;
    }

    // Moved to a different column
    const startTasks = Array.from(startBoard.tasks);
    [movedTask] = startTasks.splice(source.index, 1);

    const finishTasks = Array.from(finishBoard.tasks);
    finishTasks.splice(destination.index, 0, movedTask);

    const updatedStartTasks = startTasks.map((t, idx) => ({
      ...t,
      orderIndex: idx,
    }));
    const updatedFinishTasks = finishTasks.map((t, idx) => ({
      ...t,
      orderIndex: idx,
    }));

    const newStartBoard = { ...startBoard, tasks: updatedStartTasks };
    const newFinishBoard = { ...finishBoard, tasks: updatedFinishTasks };

    const newBoards = data.boards.map((b) => {
      if (b.id === newStartBoard.id) return newStartBoard;
      if (b.id === newFinishBoard.id) return newFinishBoard;
      return b;
    });

    setData({ ...data, boards: newBoards });

    movedTask.orderIndex = destination.index;
    movedTask.board = { id: finishBoard.id };
    api.updateTask(movedTask).catch((err) => {
      console.error("Failed to update task", err);
    });
  };

  const sortedBoards = [...(data.boards || [])].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-8 h-full scrollbar-hide px-8">
        {sortedBoards.map((board) => (
          <KanbanColumn key={board.id} board={board} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
