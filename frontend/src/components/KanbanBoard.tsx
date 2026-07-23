import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import type { Project, Board, Task } from "../models/types";
import KanbanColumn from "./KanbanColumn";
import Modal from "./Modal";
import { api } from "../services/api";

const KanbanBoard = ({ initialProject }: { initialProject: Project }) => {
  const [data, setData] = useState<Project>(initialProject);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardTitle, setBoardTitle] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    task: Task | null;
    boardId: number;
  } | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    tags: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setData(initialProject);
  }, [initialProject]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startBoard = data.boards.find(
      (b) => b.id.toString() === source.droppableId,
    );
    const finishBoard = data.boards.find(
      (b) => b.id.toString() === destination.droppableId,
    );

    if (!startBoard || !finishBoard) return;

    let movedTask: Task;

    if (startBoard === finishBoard) {
      const newTasks = Array.from(startBoard.tasks || []);
      [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = newTasks.map((t, idx) => ({
        ...t,
        orderIndex: idx,
      }));
      const newBoard = { ...startBoard, tasks: updatedTasks };
      const newBoards = data.boards.map((b) =>
        b.id === newBoard.id ? newBoard : b,
      );

      setData({ ...data, boards: newBoards });

      movedTask.orderIndex = destination.index;
      movedTask.board = { id: finishBoard.id };
      api
        .updateTask(movedTask)
        .catch((err) => console.error("Failed to update task", err));
      return;
    }

    const startTasks = Array.from(startBoard.tasks || []);
    [movedTask] = startTasks.splice(source.index, 1);

    const finishTasks = Array.from(finishBoard.tasks || []);
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
    api
      .updateTask(movedTask)
      .catch((err) => console.error("Failed to update task", err));
  };

  const openAddBoard = () => {
    setEditingBoard(null);
    setBoardTitle("");
    setIsBoardModalOpen(true);
  };

  const openEditBoard = (board: Board) => {
    setEditingBoard(board);
    setBoardTitle(board.title);
    setIsBoardModalOpen(true);
  };

  const saveBoard = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    try {
      setIsSaving(true);
      if (editingBoard) {
        const updated = await api.updateBoard({
          ...editingBoard,
          title: boardTitle,
        });
        const updatedWithTasks = { ...updated, tasks: editingBoard.tasks };
        setData({
          ...data,
          boards: data.boards.map((b) =>
            b.id === updated.id ? updatedWithTasks : b,
          ),
        });
      } else {
        const created = await api.createBoard({
          title: boardTitle,
          orderIndex: data.boards.length,
          project: { id: data.id },
        });
        setData({
          ...data,
          boards: [...data.boards, { ...created, tasks: [] }],
        });
      }
      setIsBoardModalOpen(false);
    } catch (err) {
      alert("Failed to save board");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBoard = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this board and all its tasks?",
      )
    )
      return;
    try {
      await api.deleteBoard(id);
      setData({ ...data, boards: data.boards.filter((b) => b.id !== id) });
    } catch (err) {
      alert("Failed to delete board");
    }
  };

  const openAddTask = (boardId: number) => {
    setEditingTask({ task: null, boardId });
    setTaskForm({ title: "", description: "", priority: "Medium", tags: "" });
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task, boardId: number) => {
    setEditingTask({ task, boardId });
    setTaskForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      tags: task.tags ? task.tags.map(t => t.title).join(", ") : "",
    });
    setIsTaskModalOpen(true);
  };

  const saveTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask || !taskForm.title.trim()) return;

    try {
      setIsSaving(true);
      const boardId = editingTask.boardId;
      const board = data.boards.find((b) => b.id === boardId);
      if (!board) return;

      const tagTitles = taskForm.tags.split(",").map(t => t.trim()).filter(Boolean);
      const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-400", "bg-blue-400", "bg-indigo-400", "bg-purple-400", "bg-pink-400"];
      
      const parsedTags = tagTitles.map(title => {
        const existing = editingTask.task?.tags?.find(t => t.title.toLowerCase() === title.toLowerCase());
        if (existing) return existing;
        return { title, color: colors[title.length % colors.length] };
      });

      if (editingTask.task) {
        // Update
        const updated = await api.updateTask({
          ...editingTask.task,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          tags: parsedTags,
        });
        const newBoards = data.boards.map((b) =>
          b.id === boardId
            ? {
              ...b,
              tasks: b.tasks.map((t) => (t.id === updated.id ? updated : t)),
            }
            : b,
        );
        setData({ ...data, boards: newBoards });
      } else {
        // Create
        const created = await api.createTask({
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          tags: parsedTags,
          orderIndex: board.tasks ? board.tasks.length : 0,
          board: { id: boardId } as any,
        });
        const newBoards = data.boards.map((b) =>
          b.id === boardId ? { ...b, tasks: [...(b.tasks || []), created] } : b,
        );
        setData({ ...data, boards: newBoards });
      }
      setIsTaskModalOpen(false);
    } catch (err) {
      alert("Failed to save task");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (taskId: number, boardId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.deleteTask(taskId);
      const newBoards = data.boards.map((b) =>
        b.id === boardId
          ? { ...b, tasks: b.tasks.filter((t) => t.id !== taskId) }
          : b,
      );
      setData({ ...data, boards: newBoards });
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const sortedBoards = [...(data.boards || [])].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-8 h-full scrollbar-hide px-8">
          {sortedBoards.map((board) => (
            <KanbanColumn
              key={board.id}
              board={board}
              onEditBoard={() => openEditBoard(board)}
              onDeleteBoard={() => deleteBoard(board.id)}
              onAddTask={() => openAddTask(board.id)}
              onEditTask={(task) => openEditTask(task, board.id)}
              onDeleteTask={(taskId) => deleteTask(taskId, board.id)}
            />
          ))}

          {/* Add New Board Column */}
          <div className="w-[320px] flex-shrink-0">
            <button
              onClick={openAddBoard}
              className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-mono text-sm font-semibold hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Plus size={18} />
              Add new board
            </button>
          </div>
        </div>
      </DragDropContext>

      {/* Board Modal */}
      <Modal
        isOpen={isBoardModalOpen}
        onClose={() => !isSaving && setIsBoardModalOpen(false)}
        title={editingBoard ? "Edit Board" : "Create New Board"}
      >
        <form onSubmit={saveBoard} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Board Title
            </label>
            <input
              type="text"
              required
              autoFocus
              disabled={isSaving}
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. In Progress"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsBoardModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !boardTitle.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Board"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => !isSaving && setIsTaskModalOpen(false)}
        title={editingTask?.task ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={saveTask} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              autoFocus
              disabled={isSaving}
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Fix login bug"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              disabled={isSaving}
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Add more details..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              disabled={isSaving}
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({ ...taskForm, priority: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              disabled={isSaving}
              value={taskForm.tags}
              onChange={(e) =>
                setTaskForm({ ...taskForm, tags: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Bug, Frontend, Urgent"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !taskForm.title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default KanbanBoard;
