import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../models/types";
import TagBadge from "./TagBadge";

const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-emerald-400";
    default:
      return "bg-slate-300";
  }
};

const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] mb-3 group 
            ${snapshot.isDragging ? "shadow-lg border-blue-200 ring-2 ring-blue-100 z-10 rotate-1" : "hover:border-slate-300"} 
            transition-all duration-200`}
          style={provided.draggableProps.style}
        >
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-3">
              {task.tags.map((tag, i) => (
                <TagBadge key={i} tag={tag} />
              ))}
            </div>
          )}

          {/* Title */}
          <h4 className="font-mono text-[13px] leading-relaxed font-bold text-slate-800 mb-1 pr-2">
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 mb-4 line-clamp-3">
              {task.description}
            </p>
          )}
          {!task.description && <div className="mb-4"></div>}

          <div className="flex items-center justify-between mt-auto">
            {/* Avatars */}
            <div className="flex -space-x-1.5">
              {task.assignedUser && (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] text-white font-bold border-2 border-white bg-blue-500`}
                  title={task.assignedUser.username}
                >
                  {task.assignedUser.username.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Priority */}
            <div
              className="flex items-center"
              title={`Priority: ${task.priority || "Medium"}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full shadow-sm ${getPriorityColor(
                  task.priority,
                )}`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
