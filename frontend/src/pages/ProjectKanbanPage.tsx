import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { mockProjects } from "../data/mockData";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";

const ProjectKanbanPage = () => {
  const { id } = useParams<{ id: string }>();

  const project = useMemo(() => {
    return mockProjects.find((p) => p.id === id) || mockProjects[0];
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-800">
            Project not found
          </h2>
          <Link
            to="/"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col pt-12 pb-4 overflow-hidden">
        <div className="px-8 mb-8 flex flex-col gap-2">
          <h2 className="font-mono text-3xl font-bold text-slate-900 tracking-tight">
            Roadmap board
          </h2>
          <p className="font-mono text-sm text-slate-400">
            Drag work across stages. Everything auto-saves.
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectKanbanPage;
