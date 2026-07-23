import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Board } from "../models/types";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ board }: { board: Board }) => {
  const getDotColor = (title: string) => {
    switch (title.toLowerCase()) {
      case "backlog":
        return "bg-slate-300";
      case "to do":
        return "bg-blue-400";
      case "in progress":
        return "bg-amber-400";
      case "done":
        return "bg-emerald-400";
      default:
        return "bg-slate-300";
    }
  };

  const tasks = board.tasks || [];

  return (
    <div className="w-[320px] flex-shrink-0 flex flex-col max-h-full">
      <div className="bg-slate-50/80 rounded-2xl p-3 flex flex-col h-full border border-slate-100">
        <div className="flex justify-between items-center px-2 mb-4 mt-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${getDotColor(board.title)}`}
            ></div>
            <h3 className="font-mono text-sm font-bold tracking-wide text-slate-800">
              {board.title}
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200/50 text-slate-500 font-medium">
              {tasks.length}
            </span>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={board.id.toString()}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors ${snapshot.isDraggingOver ? "bg-slate-100/50 rounded-xl" : ""
                }`}
              style={{ minHeight: "150px" }}
            >
              {tasks
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button className="mt-2 flex items-center justify-center gap-2 py-2.5 w-full rounded-xl border border-dashed border-slate-200 text-slate-400 font-mono text-xs hover:border-slate-300 hover:text-slate-500 hover:bg-slate-100/50 transition-all">
          <Plus size={14} />
          Add task
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
