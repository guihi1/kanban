import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Board, Task } from "../models/types";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  board: Board;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const KanbanColumn = ({ 
  board, 
  onEditBoard, 
  onDeleteBoard, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: KanbanColumnProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const getDotColor = (title: string) => {
    switch (title.toLowerCase()) {
      case "backlog": return "bg-slate-300";
      case "to do": return "bg-blue-400";
      case "in progress": return "bg-amber-400";
      case "done": return "bg-emerald-400";
      default: return "bg-slate-300";
    }
  };

  const tasks = board.tasks || [];

  return (
    <div className="w-[320px] flex-shrink-0 flex flex-col max-h-full">
      <div className="bg-slate-50/80 rounded-2xl p-3 flex flex-col h-full border border-slate-100">
        <div className="flex justify-between items-center px-2 mb-4 mt-1 relative">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getDotColor(board.title)}`}></div>
            <h3 className="font-mono text-sm font-bold tracking-wide text-slate-800">
              {board.title}
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200/50 text-slate-500 font-medium">
              {tasks.length}
            </span>
          </div>
          
          <button 
            onClick={() => setShowMenu(!showMenu)}
            onBlur={() => setTimeout(() => setShowMenu(false), 200)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-slate-100 shadow-lg rounded-xl py-2 w-36 z-10">
              <button 
                onClick={onEditBoard}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit2 size={14} /> Edit Title
              </button>
              <button 
                onClick={onDeleteBoard}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={board.id.toString()}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors ${
                snapshot.isDraggingOver ? "bg-slate-100/50 rounded-xl" : ""
              }`}
              style={{ minHeight: "150px" }}
            >
              {tasks
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((task, index) => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} index={index} />
                    
                    {/* Task Actions Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button 
                        onClick={() => onEditTask(task)}
                        className="p-1.5 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-blue-600 rounded-md shadow-sm border border-slate-200"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-600 rounded-md shadow-sm border border-slate-200"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button 
          onClick={onAddTask}
          className="mt-2 flex items-center justify-center gap-2 py-2.5 w-full rounded-xl border border-dashed border-slate-200 text-slate-400 font-mono text-xs hover:border-slate-300 hover:text-slate-500 hover:bg-slate-100/50 transition-all"
        >
          <Plus size={14} />
          Add task
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
