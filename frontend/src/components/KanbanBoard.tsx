import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Project } from '../models/types';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ project }: { project: Project }) => {
  const [data, setData] = useState<Project>(project);

  useEffect(() => {
    setData(project);
  }, [project]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Se caiu fora de um droppable
    if (!destination) {
      return;
    }

    // Se a posição não mudou
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Encontrar colunas de origem e destino
    const startBoard = data.boards.find(b => b.id === source.droppableId);
    const finishBoard = data.boards.find(b => b.id === destination.droppableId);

    if (!startBoard || !finishBoard) {
      return;
    }

    // Movendo dentro da mesma coluna
    if (startBoard === finishBoard) {
      const newTasks = Array.from(startBoard.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      // Atualizar a ordem das tasks (opcional, dependendo de como o backend espera)
      const updatedTasks = newTasks.map((t, idx) => ({ ...t, order: idx }));

      const newBoard = {
        ...startBoard,
        tasks: updatedTasks,
      };

      const newBoards = data.boards.map(b => 
        b.id === newBoard.id ? newBoard : b
      );

      setData({
        ...data,
        boards: newBoards,
      });
      return;
    }

    // Movendo entre colunas diferentes
    const startTasks = Array.from(startBoard.tasks);
    const [movedTask] = startTasks.splice(source.index, 1);
    
    const finishTasks = Array.from(finishBoard.tasks);
    finishTasks.splice(destination.index, 0, movedTask);

    // Atualizar order
    const updatedStartTasks = startTasks.map((t, idx) => ({ ...t, order: idx }));
    const updatedFinishTasks = finishTasks.map((t, idx) => ({ ...t, order: idx }));

    const newStartBoard = {
      ...startBoard,
      tasks: updatedStartTasks,
    };

    const newFinishBoard = {
      ...finishBoard,
      tasks: updatedFinishTasks,
    };

    const newBoards = data.boards.map(b => {
      if (b.id === newStartBoard.id) return newStartBoard;
      if (b.id === newFinishBoard.id) return newFinishBoard;
      return b;
    });

    setData({
      ...data,
      boards: newBoards,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row flex-nowrap overflow-auto pb-4 h-100">
        {data.boards.sort((a, b) => a.order - b.order).map(board => (
          <KanbanColumn key={board.id} board={board} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
